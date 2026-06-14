"""Pure lighting math for HA Adapt.

This module has **no** Home Assistant imports so every function can be unit
tested in isolation. It is organised around one small abstraction:

    input source  ->  DriveSignal (normalized 0..1)  ->  map_drive -> Target

The sun is just the *default* input source: ``sun_drive`` turns a sun snapshot
into a normalized ``DriveSignal``. A physical light/lux sensor is another source
(``sensor_drive``) producing the same shape, so it can replace the sun without
touching the downstream mapping. The hourly keyframe mode is the one exception:
it maps time directly to absolute brightness/color values.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import math

from .const import (
    BRIGHTNESS_MODE_LINEAR,
    BRIGHTNESS_MODE_TANH,
    MODE_HOURLY,
    MODE_SENSOR,
)
from .models import Schema

# --- small numeric helpers ---------------------------------------------------


def clamp(value: float, lo: float, hi: float) -> float:
    """Clamp ``value`` into the inclusive ``[lo, hi]`` range."""
    return max(lo, min(hi, value))


def lerp(a: float, b: float, t: float) -> float:
    """Linear interpolation between ``a`` and ``b`` for ``t`` in ``[0, 1]``."""
    return a + (b - a) * t


def _round5(value: float) -> int:
    """Round Kelvin to the nearest 5 for stable, comparable values."""
    return int(round(value / 5.0) * 5)


def find_a_b(x1: float, x2: float, y1: float, y2: float) -> tuple[float, float]:
    """Solve for ``a``/``b`` so ``0.5*(1+tanh(a*x+b))`` passes through 2 points.

    ``(x1, y1)`` and ``(x2, y2)`` are two points on the S-curve (y in 0..1).
    """
    ya = math.atanh(2.0 * y1 - 1.0)
    yb = math.atanh(2.0 * y2 - 1.0)
    a = (yb - ya) / (x2 - x1)
    b = ya - a * x1
    return a, b


def scaled_tanh(
    x: float, x1: float, x2: float, y1: float = 0.05, y2: float = 0.95
) -> float:
    """A smooth S-curve mapping ``x`` to ``0..1``.

    The curve reaches ``y1`` at ``x1`` and ``y2`` at ``x2``; outside that it
    saturates towards 0 and 1.
    """
    a, b = find_a_b(x1, x2, y1, y2)
    return 0.5 * (1.0 + math.tanh(a * x + b))


def color_difference_redmean(
    rgb1: tuple[int, int, int], rgb2: tuple[int, int, int]
) -> float:
    """Perceptual ("redmean") distance between two RGB colors.

    Used by override detection to decide whether a manual color change is
    significant. See https://en.wikipedia.org/wiki/Color_difference#sRGB.
    """
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


# --- the sun as an input source ----------------------------------------------


@dataclass
class SunSnapshot:
    """A point-in-time view of the sun, computed by the coordinator.

    The coordinator owns all astral/timezone logic and the per-schema time
    overrides (fixed sunrise/sunset, offsets, bounds). This snapshot is the
    pure result that the engine consumes.
    """

    position: float  # -1 (solar midnight) .. 1 (solar noon)
    is_day: bool  # sun currently above the horizon
    nearest_sunrise: datetime
    nearest_sunset: datetime


def sun_snapshot(now: datetime, events: list[tuple[datetime, str]]) -> SunSnapshot:
    """Build a :class:`SunSnapshot` from sorted sun events around ``now``.

    ``events`` is a sorted list of ``(datetime, "sunrise"|"sunset")`` spanning
    at least the day before and after ``now`` so ``now`` is always bracketed.
    """
    prev = None
    nxt = None
    for event in events:
        if event[0] <= now:
            prev = event
        elif nxt is None:
            nxt = event
            break

    if prev is None or nxt is None:
        # Degenerate input; treat as flat daytime so we never crash.
        sunrises = [t for t, kind in events if kind == "sunrise"]
        sunsets = [t for t, kind in events if kind == "sunset"]
        return SunSnapshot(
            position=0.0,
            is_day=True,
            nearest_sunrise=sunrises[0] if sunrises else now,
            nearest_sunset=sunsets[0] if sunsets else now,
        )

    span = (nxt[0] - prev[0]).total_seconds() or 1.0
    frac = clamp((now - prev[0]).total_seconds() / span, 0.0, 1.0)
    is_day = prev[1] == "sunrise"
    # A smooth half-sine: 0 at the boundary events, peaking mid-interval.
    position = math.sin(math.pi * frac)
    if not is_day:
        position = -position

    nearest_sunrise = min(
        (t for t, kind in events if kind == "sunrise"),
        key=lambda t: abs((t - now).total_seconds()),
        default=now,
    )
    nearest_sunset = min(
        (t for t, kind in events if kind == "sunset"),
        key=lambda t: abs((t - now).total_seconds()),
        default=now,
    )
    return SunSnapshot(
        position=position,
        is_day=is_day,
        nearest_sunrise=nearest_sunrise,
        nearest_sunset=nearest_sunset,
    )


def _ramp(
    now: datetime, start: datetime, end: datetime, rising: bool, mode: str
) -> float:
    """Return a 0..1 transition factor across the ``[start, end]`` window."""
    total = (end - start).total_seconds() or 1.0
    frac = clamp((now - start).total_seconds() / total, 0.0, 1.0)
    value = scaled_tanh(frac, 0.0, 1.0) if mode == BRIGHTNESS_MODE_TANH else frac
    return value if rising else (1.0 - value)


def _day_factor(now: datetime, snap: SunSnapshot, schema: Schema, mode: str) -> float:
    """Brightness demand (0..1) for the linear/tanh sun brightness modes.

    The light ramps up over a window centred on sunrise and down over a window
    centred on sunset. ``time_dark`` is the night-side half, ``time_light`` the
    day-side half.
    """
    from datetime import timedelta

    dark = timedelta(seconds=schema.brightness_mode_time_dark)
    light = timedelta(seconds=schema.brightness_mode_time_light)

    sr_start, sr_end = snap.nearest_sunrise - dark, snap.nearest_sunrise + light
    ss_start, ss_end = snap.nearest_sunset - light, snap.nearest_sunset + dark

    if sr_start <= now <= sr_end:
        return _ramp(now, sr_start, sr_end, rising=True, mode=mode)
    if ss_start <= now <= ss_end:
        return _ramp(now, ss_start, ss_end, rising=False, mode=mode)
    return 1.0 if snap.is_day else 0.0


def sun_drive(now: datetime, snap: SunSnapshot, schema: Schema) -> DriveSignal:
    """Convert the sun snapshot into a normalized :class:`DriveSignal`."""
    mode = schema.brightness_mode
    if mode in (BRIGHTNESS_MODE_LINEAR, BRIGHTNESS_MODE_TANH):
        brightness = _day_factor(now, snap, schema, mode)
    else:  # "default": full brightness by day, dimming after sunset
        brightness = 1.0 if snap.is_day else clamp(1.0 + snap.position, 0.0, 1.0)
    # Warmth follows the sun's height: warmest at/under the horizon.
    warmth = clamp(snap.position, 0.0, 1.0)
    return DriveSignal(brightness=brightness, warmth=warmth)


# --- a generic sensor as an input source -------------------------------------


def sensor_drive(value: float, schema: Schema) -> DriveSignal:
    """Convert a raw sensor value into a normalized :class:`DriveSignal`.

    The same shape as :func:`sun_drive`, so a real sensor can stand in for the
    sun. ``sensor_min``/``sensor_max`` define the input scaling.
    """
    lo, hi = schema.sensor_min, schema.sensor_max
    frac = 0.0 if hi == lo else clamp((value - lo) / (hi - lo), 0.0, 1.0)
    return DriveSignal(brightness=frac, warmth=frac)


# --- shared mapping: drive signal -> concrete light target -------------------


@dataclass
class DriveSignal:
    """Normalized driving signal from an input source.

    brightness: 0..1 demand scaled between ``min``/``max_brightness``.
    warmth: 0..1 where 0 = warmest (min_color_temp), 1 = coolest (max).
    """

    brightness: float
    warmth: float


@dataclass
class Target:
    """The concrete values to send to a light. ``None`` means "don't set"."""

    brightness_pct: int | None
    color_temp_kelvin: int | None

    @property
    def is_empty(self) -> bool:
        return self.brightness_pct is None and self.color_temp_kelvin is None


def map_drive(drive: DriveSignal, schema: Schema) -> Target:
    """Map a normalized drive signal to a concrete :class:`Target`."""
    brightness_pct = None
    if schema.adapt_brightness:
        brightness_pct = int(
            round(
                lerp(
                    schema.min_brightness,
                    schema.max_brightness,
                    clamp(drive.brightness, 0.0, 1.0),
                )
            )
        )
    color_temp = None
    if schema.adapt_color:
        color_temp = _round5(
            lerp(
                schema.min_color_temp,
                schema.max_color_temp,
                clamp(drive.warmth, 0.0, 1.0),
            )
        )
    return Target(brightness_pct=brightness_pct, color_temp_kelvin=color_temp)


# --- hourly keyframe mode (direct time -> values) ----------------------------


def _interp_cyclic(
    frames: list[dict[str, float]], hour: float
) -> tuple[float, float]:
    """Interpolate (brightness, color_temp) at ``hour`` over 24h, cyclically."""
    ordered = sorted(frames, key=lambda f: f["hour"])
    first, last = ordered[0], ordered[-1]

    if hour < first["hour"] or hour >= last["hour"]:
        # Wrap-around segment from the last keyframe to the first across midnight.
        span = (24.0 - last["hour"]) + first["hour"]
        elapsed = hour - last["hour"]
        if elapsed < 0:
            elapsed += 24.0
        t = elapsed / span if span else 0.0
        lo, hi = last, first
    else:
        lo = max((f for f in ordered if f["hour"] <= hour), key=lambda f: f["hour"])
        hi = min((f for f in ordered if f["hour"] > hour), key=lambda f: f["hour"])
        span = hi["hour"] - lo["hour"]
        t = (hour - lo["hour"]) / span if span else 0.0

    brightness = lerp(lo["brightness"], hi["brightness"], t)
    color_temp = lerp(lo["color_temp"], hi["color_temp"], t)
    return brightness, color_temp


def hourly_target(schema: Schema, now: datetime) -> Target:
    """Compute a target from the schema's hourly keyframes."""
    if not schema.hourly_keyframes:
        return Target(None, None)
    hour = now.hour + now.minute / 60.0 + now.second / 3600.0
    brightness, color_temp = _interp_cyclic(schema.hourly_keyframes, hour)
    return Target(
        brightness_pct=int(round(brightness)) if schema.adapt_brightness else None,
        color_temp_kelvin=_round5(color_temp) if schema.adapt_color else None,
    )


# --- the one entry point the coordinator calls -------------------------------


def compute_target(
    schema: Schema,
    now: datetime,
    snapshot: SunSnapshot | None = None,
    sensor_value: float | None = None,
) -> Target:
    """Compute the light :class:`Target` for ``schema`` at ``now``.

    The coordinator supplies the bits that need Home Assistant: a sun
    ``snapshot`` (always) and the current ``sensor_value`` when the schema is
    in sensor mode.
    """
    if schema.mode == MODE_HOURLY:
        return hourly_target(schema, now)
    if schema.mode == MODE_SENSOR:
        if sensor_value is None:
            return Target(None, None)
        return map_drive(sensor_drive(sensor_value, schema), schema)
    # MODE_SUN (default): the sun is just the default input source.
    if snapshot is None:
        return Target(None, None)
    return map_drive(sun_drive(now, snapshot, schema), schema)
