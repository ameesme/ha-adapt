"""Unit tests for the pure lighting engine (no Home Assistant required)."""

from __future__ import annotations

import datetime as dt

import pytest

from ha_adapt import engine
from ha_adapt.models import LightConfig, SunConfig

UTC = dt.UTC


def _day_events(date: dt.datetime, sunrise_h: int = 6, sunset_h: int = 21):
    """Sunrise/sunset events spanning yesterday/today/tomorrow."""
    events = []
    for offset in (-1, 0, 1):
        day = date + dt.timedelta(days=offset)
        events.append((day + dt.timedelta(hours=sunrise_h), "sunrise"))
        events.append((day + dt.timedelta(hours=sunset_h), "sunset"))
    events.sort(key=lambda e: e[0])
    return events


def _sun_drives(sun: SunConfig, base: dt.datetime):
    """24 hourly drive signals, mirroring what the coordinator builds."""
    events = _day_events(base)
    return [
        engine.sun_drive(
            base + dt.timedelta(hours=h),
            engine.sun_snapshot(base + dt.timedelta(hours=h), events),
            sun,
        )
        for h in range(24)
    ]


# --- numeric helpers ---------------------------------------------------------


def test_clamp_and_lerp():
    assert engine.clamp(5, 0, 1) == 1
    assert engine.clamp(-5, 0, 1) == 0
    assert engine.lerp(0, 10, 0.25) == 2.5


def test_scaled_tanh_is_monotonic_and_centered():
    assert engine.scaled_tanh(0.5, 0.0, 1.0) == pytest.approx(0.5, abs=1e-9)
    lo = engine.scaled_tanh(0.0, 0.0, 1.0)
    hi = engine.scaled_tanh(1.0, 0.0, 1.0)
    assert lo == pytest.approx(0.05, abs=1e-9)
    assert hi == pytest.approx(0.95, abs=1e-9)


def test_color_difference_redmean():
    assert engine.color_difference_redmean((10, 20, 30), (10, 20, 30)) == 0.0
    assert engine.color_difference_redmean((0, 0, 0), (255, 255, 255)) > 0


# --- sun snapshot ------------------------------------------------------------


def test_sun_position_peaks_at_solar_noon():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    noon = base + dt.timedelta(hours=13, minutes=30)  # midpoint of 6h..21h
    snap = engine.sun_snapshot(noon, _day_events(base))
    assert snap.is_day is True
    assert snap.position == pytest.approx(1.0, abs=1e-6)


def test_sun_position_negative_at_night():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    midnight = base + dt.timedelta(hours=1, minutes=30)
    snap = engine.sun_snapshot(midnight, _day_events(base))
    assert snap.is_day is False
    assert snap.position < 0


def test_sun_drive_bright_warm_at_noon_dim_cool_at_night():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    events = _day_events(base)
    noon = base + dt.timedelta(hours=13, minutes=30)
    night = base + dt.timedelta(hours=1)
    sun = SunConfig()

    day = engine.sun_drive(noon, engine.sun_snapshot(noon, events), sun)
    assert day.brightness == pytest.approx(1.0)
    assert day.warmth == pytest.approx(1.0, abs=1e-3)

    dark = engine.sun_drive(night, engine.sun_snapshot(night, events), sun)
    assert dark.brightness == pytest.approx(0.0)
    assert dark.warmth == 0.0


# --- sun row / mapping -------------------------------------------------------


def test_drive_to_values_scales_midpoint():
    bri, temp = engine.drive_to_values(
        engine.DriveSignal(0.5, 0.5), 0, 100, 2000, 6000
    )
    assert bri == pytest.approx(50)
    assert temp == pytest.approx(4000)


def test_sun_row_has_24_entries():
    sun = SunConfig()
    drives = _sun_drives(sun, dt.datetime(2026, 6, 14, tzinfo=UTC))
    row = engine.sun_row(sun, drives)
    assert len(row) == 24
    assert all(isinstance(b, int) and isinstance(t, int) for b, t in row)


# --- per-light timeline ------------------------------------------------------


def test_empty_light_follows_sun_scaled_to_its_range():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    sun = SunConfig()
    drives = _sun_drives(sun, base)
    light = LightConfig(min_brightness=1, max_brightness=100)

    midday = engine.light_target(light, drives, 13.0)
    assert midday.brightness_pct == 100  # sun is at full by day
    assert midday.color_temp_kelvin >= 5400

    night = engine.light_target(light, drives, 1.0)
    assert night.brightness_pct <= 5
    assert night.color_temp_kelvin == light.min_color_temp


def test_explicit_cell_overrides_and_interpolates():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    drives = _sun_drives(SunConfig(), base)
    light = LightConfig()
    light.hours[9] = {"brightness": 40, "color_temp": 3000}
    light.hours[10] = {"brightness": 80, "color_temp": 4000}

    at_nine = engine.light_target(light, drives, 9.0)
    assert at_nine.brightness_pct == 40
    assert at_nine.color_temp_kelvin == 3000

    halfway = engine.light_target(light, drives, 9.5)
    assert halfway.brightness_pct == pytest.approx(60, abs=1)
    assert halfway.color_temp_kelvin == pytest.approx(3500, abs=5)


def test_explicit_cell_is_clamped_to_light_range():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    drives = _sun_drives(SunConfig(), base)
    light = LightConfig(
        max_brightness=100, min_color_temp=2000, max_color_temp=5500
    )
    light.hours[0] = {"brightness": 200, "color_temp": 9000}
    target = engine.light_target(light, drives, 0.0)
    assert target.brightness_pct == 100
    assert target.color_temp_kelvin == 5500
