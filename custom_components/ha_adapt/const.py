"""Constants for the HA Adapt adaptive lighting integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "ha_adapt"
PLATFORMS: Final = ["switch"]

# --- Storage -----------------------------------------------------------------
STORAGE_KEY: Final = "ha_adapt"
STORAGE_VERSION: Final = 1

# --- Config entry ------------------------------------------------------------
# The config entry is intentionally minimal: it only holds the entity-ids of
# the lights/groups to control. Everything else lives in the web-ui panel and
# is persisted via the Store (see store.py).
CONF_LIGHTS: Final = "lights"

# --- Timeline --------------------------------------------------------------
# Each light row on a schema's 24-hour timeline has one cell per hour.
HOURS_PER_DAY: Final = 24

# --- Manual-control detection thresholds -------------------------------------
# How much an attribute must change (vs. the value we last applied) before we
# treat it as a manual override.
BRIGHTNESS_CHANGE: Final = 25  # on the 0-255 scale
COLOR_TEMP_CHANGE: Final = 100  # Kelvin
RGB_REDMEAN_CHANGE: Final = 80

# --- Defaults (global settings) ----------------------------------------------
DEFAULT_INTERVAL: Final = 90  # seconds between adaptation passes
DEFAULT_TRANSITION: Final = 45  # seconds
DEFAULT_INITIAL_TRANSITION: Final = 1  # seconds
DEFAULT_SEND_SPLIT_DELAY: Final = 0  # milliseconds between split commands
DEFAULT_AUTORESET_CONTROL: Final = 0  # seconds, 0 disables auto-reset

# --- Defaults (per schema) ---------------------------------------------------
DEFAULT_MIN_BRIGHTNESS: Final = 1  # percent
DEFAULT_MAX_BRIGHTNESS: Final = 100  # percent
DEFAULT_MIN_COLOR_TEMP: Final = 2000  # Kelvin
DEFAULT_MAX_COLOR_TEMP: Final = 5500  # Kelvin
# --- Sun defaults ----------------------------------------------------------
DEFAULT_SUN_MIN_BRIGHTNESS: Final = 5  # percent
DEFAULT_SUNRISE_OFFSET: Final = 5000  # seconds
DEFAULT_SUNSET_OFFSET: Final = -5000  # seconds
# Width of the tanh brightness ramp on each side of sunrise/sunset (seconds).
DEFAULT_RAMP_DARK: Final = 5000  # night side of the ramp
DEFAULT_RAMP_LIGHT: Final = 9000  # day side of the ramp

DEFAULT_SCHEMA_ID: Final = "default"

# --- Services ----------------------------------------------------------------
SERVICE_APPLY: Final = "apply"
SERVICE_SET_MANUAL_CONTROL: Final = "set_manual_control"

ATTR_MANUAL_CONTROL: Final = "manual_control"

# --- Frontend ----------------------------------------------------------------
PANEL_URL_PATH: Final = "ha-adapt"
PANEL_TITLE: Final = "Adaptive Lighting"
PANEL_ICON: Final = "mdi:theme-light-dark"
PANEL_STATIC_PATH: Final = "/ha_adapt_panel/ha-adapt-panel.js"
PANEL_ELEMENT: Final = "ha-adapt-panel"

# Dispatcher signal fired when stored config changes so entities can refresh.
SIGNAL_CONFIG_UPDATED: Final = f"{DOMAIN}_config_updated"
