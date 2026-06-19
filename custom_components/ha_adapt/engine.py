"""Pure lighting math for HA Adapt.

No Home Assistant imports, so everything here is unit-testable on its own.

The model: a schema has one configurable **sun** plus a per-light **24-hour
timeline**. For each light we build 24 hourly "anchors" — an anchor is either
the light's explicit cell for that hour, or (if the cell is empty) the sun's
value scaled into the light's own min/max range. The live value at any moment
is a cyclic interpolation across those anchors. The same machinery produces the
sun's own row for the UI.

    input source  ->  DriveSignal (normalized 0..1)  ->  values (bri, temp)
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import math

from .const import BRIGHTNESS_CHANGE, COLOR_TEMP_CHANGE, HOURS_PER_DAY
from .models import LightConfig, SunConfig

# --- small numeric helpers ---------------------------------------------------


def clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def _round5(value: float) -> int:
    """Round Kelvin to the nearest 5 for stable, comparable values."""
    return int(round(value / 5.0) * 5)


def find_a_b(x1: float, x2: float, y1: float, y2: float) -> tuple[float, float]:
    """Solve a/b so ``0.5*(1+tanh(a*x+b))`` passes through the two points."""
    ya = math.atanh(2.0 * y1 - 1.0)
    yb = math.atanh(2.0 * y2 - 1.0)
    a = (yb - ya) / (x2 - x1)
    b = ya - a * x1
    return a, b


def scaled_tanh(
    x: float, x1: float, x2: float, y1: float = 0.05, y2: float = 0.95
) -> float:
    """A smooth S-curve mapping ``x`` to ``0..1``."""
    a, b = find_a_b(x1, x2, y1, y2)
    return 0.5 * (1.0 + math.tanh(a * x + b))


def color_difference_redmean(
    rgb1: tuple[int, int, int], rgb2: tuple[int, int, int]
) -> float:
    """Perceptual ("redmean") distance between two RGB colors."""
    r_hat = (rgb1[0] + rgb2[0]) / 2.0
    delta_r, delta_g, delta_b = (
        rgb1[0] - rgb2[0],
        rgb1[1] - rgb2[1],
        rgb1[2] - rgb2[2],
    )
    red = (2.0 + r_hat / 256.0) * delta_r**2
    green = 4.0 * delta_g**2
    blue = (2.0 + (255.0 - r_hat) / 256.0) * delta_b**2
    return math.sqrt(red + green + blue)


# --- the sun -----------------------------------------------------------------


@dataclass
class SunSnapshot:
    """A point-in-time view of the sun, computed by the coordinator."""

    position: float  # -1 (solar midnight) .. 1 (solar noon)
    is_day: bool
    nearest_sunrise: datetime
    nearest_sunset: datetime


@dataclass
class DriveSignal:
    """Normalized signal: brightness demand and warmth, each 0..1."""

    brightness: float
    warmth: float  # 0 = warmest (min temp), 1 = coolest (max temp)


@dataclass
class Target:
    """Concrete values to send to a light. ``None`` means "don't set".

    ``color_temp_kelvin`` is always the baseline; ``rgb_color`` (when set)
    overrides it for RGB-capable lights.
    """

    brightness_pct: int | None
    color_temp_kelvin: int | None
    rgb_color: tuple[int, int, int] | None = None

    @property
    def is_empty(self) -> bool:
        return (
            self.brightness_pct is None
            and self.color_temp_kelvin is None
            and self.rgb_color is None
        )


def sun_snapshot(now: datetime, events: list[tuple[datetime, str]]) -> SunSnapshot:
    """Build a :class:`SunSnapshot` from sorted sun events bracketing ``now``."""
    prev = None
    nxt = None
    for event in events:
        if event[0] <= now:
            prev = event
        elif nxt is None:
            nxt = event
            break

    sunrises = [t for t, kind in events if kind == "sunrise"]
    sunsets = [t for t, kind in events if kind == "sunset"]
    nearest_sunrise = min(
        sunrises, key=lambda t: abs((t - now).total_seconds()), default=now
    )
    nearest_sunset = min(
        sunsets, key=lambda t: abs((t - now).total_seconds()), default=now
    )

    if prev is None or nxt is None:
        return SunSnapshot(0.0, True, nearest_sunrise, nearest_sunset)

    span = (nxt[0] - prev[0]).total_seconds() or 1.0
    frac = clamp((now - prev[0]).total_seconds() / span, 0.0, 1.0)
    is_day = prev[1] == "sunrise"
    position = math.sin(math.pi * frac)
    if not is_day:
        position = -position
    return SunSnapshot(position, is_day, nearest_sunrise, nearest_sunset)


def _ramp(now: datetime, start: datetime, end: datetime, rising: bool) -> float:
    """A smooth tanh 0..1 transition across the ``[start, end]`` window."""
    total = (end - start).total_seconds() or 1.0
    frac = clamp((now - start).total_seconds() / total, 0.0, 1.0)
    value = scaled_tanh(frac, 0.0, 1.0)
    return value if rising else (1.0 - value)


def _day_factor(now: datetime, snap: SunSnapshot, sun: SunConfig) -> float:
    """Brightness demand (0..1): a tanh ramp around sunrise/sunset."""
    from datetime import timedelta

    dark = timedelta(seconds=sun.ramp_dark)
    light = timedelta(seconds=sun.ramp_light)
    sr_start, sr_end = snap.nearest_sunrise - dark, snap.nearest_sunrise + light
    ss_start, ss_end = snap.nearest_sunset - light, snap.nearest_sunset + dark

    if sr_start <= now <= sr_end:
        return _ramp(now, sr_start, sr_end, rising=True)
    if ss_start <= now <= ss_end:
        return _ramp(now, ss_start, ss_end, rising=False)
    return 1.0 if snap.is_day else 0.0


def sun_drive(now: datetime, snap: SunSnapshot, sun: SunConfig) -> DriveSignal:
    """Convert the sun snapshot into a normalized :class:`DriveSignal`."""
    brightness = _day_factor(now, snap, sun)
    warmth = clamp(snap.position, 0.0, 1.0)
    return DriveSignal(brightness=brightness, warmth=warmth)


# --- mapping drive -> concrete values ----------------------------------------


def drive_to_values(
    drive: DriveSignal,
    min_b: float,
    max_b: float,
    min_ct: float,
    max_ct: float,
) -> tuple[float, float]:
    """Scale a normalized drive signal into (brightness%, colorTempK) floats."""
    brightness = lerp(min_b, max_b, clamp(drive.brightness, 0.0, 1.0))
    color_temp = lerp(min_ct, max_ct, clamp(drive.warmth, 0.0, 1.0))
    return brightness, color_temp


# --- the 24-hour timeline ----------------------------------------------------


def sun_values(
    sun: SunConfig, drives: list[DriveSignal]
) -> list[tuple[float, float]]:
    """The sun's (brightness, colorTemp) for each hour, as floats."""
    return [
        drive_to_values(
            drive,
            sun.min_brightness,
            sun.max_brightness,
            sun.min_color_temp,
            sun.max_color_temp,
        )
        for drive in drives
    ]


def sun_row(sun: SunConfig, drives: list[DriveSignal]) -> list[tuple[int, int]]:
    """The sun's own (brightness, colorTemp) for each of the 24 hours."""
    return [
        (int(round(bri)), _round5(temp))
        for bri, temp in sun_values(sun, drives)
    ]


RgbColor = tuple[int, int, int]
# (brightness, colorTemp, rgb|None) for one hour.
Anchor = tuple[float, float, RgbColor | None]


def light_anchors(
    light: LightConfig, sun_vals: list[tuple[float, float]]
) -> list[Anchor]:
    """Build 24 effective (brightness, colorTemp, rgb) anchors for a light.

    Explicit hour cells win (and may carry an ``rgb_color`` override); empty
    cells *follow the sun*, clamped into the light's own min/max range (so a
    light can't run brighter/cooler than it allows, but otherwise tracks the
    sun rather than scaling its own independent curve).
    """
    anchors: list[Anchor] = []
    for hour in range(HOURS_PER_DAY):
        cell = light.hours[hour] if hour < len(light.hours) else None
        if cell:
            bri = clamp(cell["brightness"], light.min_brightness, light.max_brightness)
            temp = clamp(cell["color_temp"], light.min_color_temp, light.max_color_temp)
            raw = cell.get("rgb_color")
            rgb: RgbColor | None = (
                (int(raw[0]), int(raw[1]), int(raw[2])) if raw else None
            )
        else:
            bri = clamp(
                sun_vals[hour][0], light.min_brightness, light.max_brightness
            )
            temp = clamp(
                sun_vals[hour][1], light.min_color_temp, light.max_color_temp
            )
            rgb = None
        anchors.append((bri, temp, rgb))
    return anchors


def _interp_rgb(
    rgb0: RgbColor | None, rgb1: RgbColor | None, frac: float
) -> RgbColor | None:
    """Lerp two RGB anchors; for a mixed pair snap to the nearer anchor."""
    if rgb0 is not None and rgb1 is not None:
        return (
            int(round(lerp(rgb0[0], rgb1[0], frac))),
            int(round(lerp(rgb0[1], rgb1[1], frac))),
            int(round(lerp(rgb0[2], rgb1[2], frac))),
        )
    if rgb0 is None and rgb1 is None:
        return None
    return rgb0 if frac < 0.5 else rgb1


def interpolate_cyclic(
    anchors: list[Anchor], hour: float
) -> tuple[float, float, RgbColor | None]:
    """Interpolate (brightness, colorTemp, rgb) at fractional ``hour`` over 24h."""
    hour = hour % HOURS_PER_DAY
    h0 = int(math.floor(hour)) % HOURS_PER_DAY
    h1 = (h0 + 1) % HOURS_PER_DAY
    frac = hour - math.floor(hour)
    bri = lerp(anchors[h0][0], anchors[h1][0], frac)
    temp = lerp(anchors[h0][1], anchors[h1][1], frac)
    rgb = _interp_rgb(anchors[h0][2], anchors[h1][2], frac)
    return bri, temp, rgb


def light_target(
    light: LightConfig, sun: SunConfig, drives: list[DriveSignal], hour: float
) -> Target:
    """The concrete :class:`Target` for a light at fractional ``hour``."""
    anchors = light_anchors(light, sun_values(sun, drives))
    bri, temp, rgb = interpolate_cyclic(anchors, hour)
    return Target(
        brightness_pct=int(round(bri)),
        color_temp_kelvin=_round5(temp),
        rgb_color=rgb,
    )


def target_changed(
    target: Target | None,
    brightness_255: int | None,
    color_temp_kelvin: int | None,
) -> bool:
    """Whether a *present* actual value diverges from ``target`` beyond the
    manual-control thresholds.

    Returns ``False`` when there is no baseline target or the actual value is
    absent, so settled/transition state updates aren't misread as manual
    control.
    """
    if target is None:
        return False
    if (
        target.brightness_pct is not None
        and brightness_255 is not None
        and abs(brightness_255 - round(target.brightness_pct / 100 * 255))
        > BRIGHTNESS_CHANGE
    ):
        return True
    return bool(
        target.color_temp_kelvin is not None
        and color_temp_kelvin is not None
        and abs(color_temp_kelvin - target.color_temp_kelvin) > COLOR_TEMP_CHANGE
    )
