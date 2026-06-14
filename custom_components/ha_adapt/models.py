"""Data model for HA Adapt.

These dataclasses are plain, JSON-serialisable structures. They hold *no*
Home Assistant references so they can be created and tested without a running
HA instance. Persistence happens in store.py; the engine consumes them.
"""

from __future__ import annotations

from dataclasses import dataclass, field, fields
from typing import Any

from .const import (
    BRIGHTNESS_MODE_DEFAULT,
    DEFAULT_AUTORESET_CONTROL,
    DEFAULT_BRIGHTNESS_MODE_TIME_DARK,
    DEFAULT_BRIGHTNESS_MODE_TIME_LIGHT,
    DEFAULT_INITIAL_TRANSITION,
    DEFAULT_INTERVAL,
    DEFAULT_MAX_BRIGHTNESS,
    DEFAULT_MAX_COLOR_TEMP,
    DEFAULT_MIN_BRIGHTNESS,
    DEFAULT_MIN_COLOR_TEMP,
    DEFAULT_SCHEMA_ID,
    DEFAULT_SEND_SPLIT_DELAY,
    DEFAULT_SLEEP_BRIGHTNESS,
    DEFAULT_SLEEP_COLOR_TEMP,
    DEFAULT_TRANSITION,
    MODE_SUN,
)


def _coerce(cls: type, data: dict[str, Any]) -> dict[str, Any]:
    """Keep only keys that are valid fields of ``cls``.

    Lets us load older/newer stored payloads without crashing on unknown keys.
    """
    valid = {f.name for f in fields(cls)}
    return {k: v for k, v in data.items() if k in valid}


@dataclass
class Schema:
    """A named, reusable lighting schema.

    A schema fully describes how to compute brightness and color temperature
    for the lights it is assigned to. The ``mode`` selects which inputs drive
    the calculation; the remaining fields parametrise the chosen mode.
    """

    id: str
    name: str
    mode: str = MODE_SUN

    # Shared output bounds / behaviour.
    min_brightness: int = DEFAULT_MIN_BRIGHTNESS
    max_brightness: int = DEFAULT_MAX_BRIGHTNESS
    min_color_temp: int = DEFAULT_MIN_COLOR_TEMP
    max_color_temp: int = DEFAULT_MAX_COLOR_TEMP
    transition: int | None = None  # None -> fall back to global transition
    adapt_brightness: bool = True
    adapt_color: bool = True
    # Send brightness and color as separate light.turn_on calls (e.g. IKEA).
    separate_turn_on_commands: bool = False

    # --- SUN mode --------------------------------------------------------
    brightness_mode: str = BRIGHTNESS_MODE_DEFAULT
    brightness_mode_time_dark: int = DEFAULT_BRIGHTNESS_MODE_TIME_DARK
    brightness_mode_time_light: int = DEFAULT_BRIGHTNESS_MODE_TIME_LIGHT
    sunrise_time: str | None = None  # fixed "HH:MM:SS" overrides astral
    sunset_time: str | None = None  # fixed "HH:MM:SS" overrides astral
    sunrise_offset: int = 0  # seconds
    sunset_offset: int = 0  # seconds
    min_sunrise_time: str | None = None  # earliest virtual sunrise "HH:MM:SS"
    max_sunrise_time: str | None = None
    min_sunset_time: str | None = None
    max_sunset_time: str | None = None

    # --- HOURLY mode -----------------------------------------------------
    # Each keyframe: {"hour": float 0-24, "brightness": pct, "color_temp": K}
    hourly_keyframes: list[dict[str, float]] = field(default_factory=list)

    # --- SENSOR mode -----------------------------------------------------
    sensor_entity_id: str | None = None
    sensor_min: float = 0.0  # sensor value mapped to the minimum outputs
    sensor_max: float = 100.0  # sensor value mapped to the maximum outputs

    def to_dict(self) -> dict[str, Any]:
        return {f.name: getattr(self, f.name) for f in fields(self)}

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Schema:
        return cls(**_coerce(cls, data))


@dataclass
class GlobalSettings:
    """Instance-wide settings (apply to every controlled light)."""

    interval: int = DEFAULT_INTERVAL
    transition: int = DEFAULT_TRANSITION
    initial_transition: int = DEFAULT_INITIAL_TRANSITION
    send_split_delay: int = DEFAULT_SEND_SPLIT_DELAY
    autoreset_control: int = DEFAULT_AUTORESET_CONTROL
    take_over_control: bool = True
    detect_non_ha_changes: bool = False
    sleep_brightness: int = DEFAULT_SLEEP_BRIGHTNESS
    sleep_color_temp: int = DEFAULT_SLEEP_COLOR_TEMP

    def to_dict(self) -> dict[str, Any]:
        return {f.name: getattr(self, f.name) for f in fields(self)}

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> GlobalSettings:
        return cls(**_coerce(cls, data))


@dataclass
class StoreData:
    """The full persisted document (one per integration instance)."""

    settings: GlobalSettings = field(default_factory=GlobalSettings)
    schemas: dict[str, Schema] = field(default_factory=dict)
    # entity_id -> schema_id. A missing entry means "use the default schema".
    assignments: dict[str, str] = field(default_factory=dict)

    def __post_init__(self) -> None:
        # Guarantee a default schema always exists.
        if DEFAULT_SCHEMA_ID not in self.schemas:
            self.schemas[DEFAULT_SCHEMA_ID] = Schema(
                id=DEFAULT_SCHEMA_ID, name="Default"
            )

    def schema_for(self, entity_id: str) -> Schema:
        """Return the schema assigned to ``entity_id`` (or the default)."""
        schema_id = self.assignments.get(entity_id, DEFAULT_SCHEMA_ID)
        return self.schemas.get(schema_id) or self.schemas[DEFAULT_SCHEMA_ID]

    def to_dict(self) -> dict[str, Any]:
        return {
            "settings": self.settings.to_dict(),
            "schemas": {sid: s.to_dict() for sid, s in self.schemas.items()},
            "assignments": dict(self.assignments),
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> StoreData:
        data = data or {}
        settings = GlobalSettings.from_dict(data.get("settings", {}))
        schemas = {
            sid: Schema.from_dict(sd)
            for sid, sd in (data.get("schemas") or {}).items()
        }
        assignments = dict(data.get("assignments") or {})
        return cls(settings=settings, schemas=schemas, assignments=assignments)
