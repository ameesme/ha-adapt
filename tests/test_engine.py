"""Unit tests for the pure lighting engine (no Home Assistant required)."""

from __future__ import annotations

import datetime as dt

import pytest

from ha_adapt import engine
from ha_adapt.const import (
    BRIGHTNESS_MODE_LINEAR,
    BRIGHTNESS_MODE_TANH,
    MODE_HOURLY,
    MODE_SENSOR,
    MODE_SUN,
)
from ha_adapt.models import Schema

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


# --- numeric helpers ---------------------------------------------------------


def test_clamp_and_lerp():
    assert engine.clamp(5, 0, 1) == 1
    assert engine.clamp(-5, 0, 1) == 0
    assert engine.lerp(0, 10, 0.25) == 2.5


def test_scaled_tanh_is_monotonic_and_centered():
    assert engine.scaled_tanh(0.5, 0.0, 1.0) == pytest.approx(0.5, abs=1e-9)
    lo = engine.scaled_tanh(0.0, 0.0, 1.0)
    hi = engine.scaled_tanh(1.0, 0.0, 1.0)
    assert lo < 0.5 < hi
    # endpoints reach the requested y1/y2
    assert lo == pytest.approx(0.05, abs=1e-9)
    assert hi == pytest.approx(0.95, abs=1e-9)


def test_color_difference_redmean_zero_for_equal():
    assert engine.color_difference_redmean((10, 20, 30), (10, 20, 30)) == 0.0
    assert engine.color_difference_redmean((0, 0, 0), (255, 255, 255)) > 0


# --- sun snapshot ------------------------------------------------------------


def test_sun_position_peaks_at_solar_noon():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    events = _day_events(base)
    noon = base + dt.timedelta(hours=13, minutes=30)  # midpoint of 6h..21h
    snap = engine.sun_snapshot(noon, events)
    assert snap.is_day is True
    assert snap.position == pytest.approx(1.0, abs=1e-6)


def test_sun_position_negative_at_night():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    events = _day_events(base)
    midnight = base + dt.timedelta(hours=1, minutes=30)
    snap = engine.sun_snapshot(midnight, events)
    assert snap.is_day is False
    assert snap.position < 0


# --- sun mode targets --------------------------------------------------------


def test_sun_target_bright_and_cool_at_noon():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    events = _day_events(base)
    noon = base + dt.timedelta(hours=13, minutes=30)
    snap = engine.sun_snapshot(noon, events)
    schema = Schema(id="default", name="d", mode=MODE_SUN)
    target = engine.compute_target(schema, noon, snap)
    assert target.brightness_pct == 100
    assert target.color_temp_kelvin == schema.max_color_temp


def test_sun_target_dim_and_warm_at_night():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    events = _day_events(base)
    midnight = base + dt.timedelta(hours=1, minutes=30)
    snap = engine.sun_snapshot(midnight, events)
    schema = Schema(id="default", name="d", mode=MODE_SUN)
    target = engine.compute_target(schema, midnight, snap)
    assert target.color_temp_kelvin == schema.min_color_temp
    assert target.brightness_pct <= 5


@pytest.mark.parametrize("mode", [BRIGHTNESS_MODE_LINEAR, BRIGHTNESS_MODE_TANH])
def test_sun_brightness_modes_full_by_day(mode):
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    events = _day_events(base)
    noon = base + dt.timedelta(hours=13, minutes=30)
    snap = engine.sun_snapshot(noon, events)
    schema = Schema(id="d", name="d", mode=MODE_SUN, brightness_mode=mode)
    target = engine.compute_target(schema, noon, snap)
    assert target.brightness_pct == 100


def test_adapt_flags_disable_outputs():
    base = dt.datetime(2026, 6, 14, tzinfo=UTC)
    events = _day_events(base)
    noon = base + dt.timedelta(hours=13, minutes=30)
    snap = engine.sun_snapshot(noon, events)
    schema = Schema(
        id="d", name="d", mode=MODE_SUN, adapt_brightness=False, adapt_color=True
    )
    target = engine.compute_target(schema, noon, snap)
    assert target.brightness_pct is None
    assert target.color_temp_kelvin is not None


# --- sensor mode -------------------------------------------------------------


def test_sensor_mode_scales_between_bounds():
    schema = Schema(
        id="s",
        name="s",
        mode=MODE_SENSOR,
        sensor_min=0,
        sensor_max=1000,
        min_brightness=1,
        max_brightness=100,
        min_color_temp=2000,
        max_color_temp=6000,
    )
    now = dt.datetime(2026, 6, 14, tzinfo=UTC)
    midpoint = engine.compute_target(schema, now, sensor_value=500)
    assert midpoint.brightness_pct == pytest.approx(50, abs=1)
    assert midpoint.color_temp_kelvin == 4000

    high = engine.compute_target(schema, now, sensor_value=5000)  # clamped
    assert high.brightness_pct == 100


def test_sensor_mode_without_value_is_empty():
    schema = Schema(id="s", name="s", mode=MODE_SENSOR)
    now = dt.datetime(2026, 6, 14, tzinfo=UTC)
    assert engine.compute_target(schema, now, sensor_value=None).is_empty


# --- hourly mode -------------------------------------------------------------


def test_hourly_interpolates_between_keyframes():
    schema = Schema(
        id="h",
        name="h",
        mode=MODE_HOURLY,
        hourly_keyframes=[
            {"hour": 6, "brightness": 20, "color_temp": 2200},
            {"hour": 12, "brightness": 100, "color_temp": 5000},
            {"hour": 22, "brightness": 10, "color_temp": 2000},
        ],
    )
    nine = dt.datetime(2026, 6, 14, 9, tzinfo=UTC)
    target = engine.compute_target(schema, nine)
    # 9:00 is halfway between the 06:00 and 12:00 keyframes.
    assert target.brightness_pct == pytest.approx(60, abs=1)
    assert target.color_temp_kelvin == pytest.approx(3600, abs=5)


def test_hourly_empty_keyframes_is_empty():
    schema = Schema(id="h", name="h", mode=MODE_HOURLY)
    now = dt.datetime(2026, 6, 14, 9, tzinfo=UTC)
    assert engine.compute_target(schema, now).is_empty
