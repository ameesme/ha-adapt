"""Web-ui backend for HA Adapt: static asset, sidebar panel, WebSocket API.

The Lit panel (served from ``frontend/dist``) talks to these WebSocket commands
to read and write the stored configuration. All mutations go through the
coordinator so the running adaptation reflects changes immediately.
"""

from __future__ import annotations

import hashlib
import os

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
import voluptuous as vol

from .const import (
    DEFAULT_SCHEMA_ID,
    PANEL_ELEMENT,
    PANEL_ICON,
    PANEL_STATIC_PATH,
    PANEL_TITLE,
    PANEL_URL_PATH,
)
from .coordinator import AdaptCoordinator, get_coordinator
from .models import GlobalSettings, Schema, StoreData


def _bundle_token(path: str) -> str:
    """Short content hash of the built bundle, for cache-busting the panel URL."""
    try:
        with open(path, "rb") as handle:
            return hashlib.md5(handle.read()).hexdigest()[:8]  # noqa: S324
    except OSError:
        return "0"


async def async_setup_panel(
    hass: HomeAssistant, coordinator: AdaptCoordinator
) -> None:
    """Serve the bundle, register the sidebar panel, and the WS commands."""
    js_path = os.path.join(
        os.path.dirname(__file__), "frontend", "dist", "ha-adapt-panel.js"
    )
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_STATIC_PATH, js_path, False)]
    )
    # Hash the bundle so the browser always fetches a new build.
    token = await hass.async_add_executor_job(_bundle_token, js_path)
    module_url = f"{PANEL_STATIC_PATH}?v={token}"

    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=PANEL_URL_PATH,
        require_admin=True,
        config={
            "_panel_custom": {
                "name": PANEL_ELEMENT,
                "embed_iframe": False,
                "trust_external": False,
                "module_url": module_url,
            }
        },
    )

    _register_ws_commands(hass)


def async_remove_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, PANEL_URL_PATH)


# --- payload helpers ---------------------------------------------------------


def _lights_payload(hass: HomeAssistant, coordinator: AdaptCoordinator) -> list[dict]:
    lights = []
    for entity_id in coordinator.controlled_lights:
        state = hass.states.get(entity_id)
        target = coordinator.compute_preview(entity_id)
        lights.append(
            {
                "entity_id": entity_id,
                "name": state.name if state else entity_id,
                "state": state.state if state else "unavailable",
                "manual_control": coordinator.is_manual(entity_id),
                "supports_rgb": coordinator.supports_rgb(entity_id),
                "target": {
                    "brightness_pct": target.brightness_pct,
                    "color_temp_kelvin": target.color_temp_kelvin,
                },
            }
        )
    return lights


def _config_payload(hass: HomeAssistant, coordinator: AdaptCoordinator) -> dict:
    data = coordinator.data
    return {
        "settings": data.settings.to_dict(),
        "schemas": {sid: schema.to_dict() for sid, schema in data.schemas.items()},
        "active_schema_id": data.active_schema_id,
        "lights": _lights_payload(hass, coordinator),
        "enabled": coordinator.enabled,
    }


def _error_if_not_ready(connection, msg) -> AdaptCoordinator | None:
    coordinator = get_coordinator(connection.hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return None
    return coordinator


# --- WebSocket commands ------------------------------------------------------


def _register_ws_commands(hass: HomeAssistant) -> None:
    for handler in (
        ws_get_config,
        ws_update_settings,
        ws_save_schema,
        ws_delete_schema,
        ws_set_active_schema,
        ws_set_manual_control,
        ws_timeline,
        ws_preview,
        ws_apply,
        ws_export,
        ws_import,
    ):
        websocket_api.async_register_command(hass, handler)


@websocket_api.websocket_command({vol.Required("type"): "ha_adapt/get_config"})
@websocket_api.async_response
async def ws_get_config(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is not None:
        connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/update_settings",
        vol.Required("settings"): dict,
    }
)
@websocket_api.async_response
async def ws_update_settings(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    merged = coordinator.data.settings.to_dict()
    merged.update(msg["settings"])
    coordinator.data.settings = GlobalSettings.from_dict(merged)
    await coordinator.async_apply_config_change()
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/save_schema",
        vol.Required("schema"): dict,
    }
)
@websocket_api.async_response
async def ws_save_schema(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    if not msg["schema"].get("id"):
        connection.send_error(msg["id"], "invalid_schema", "Schema id is required")
        return
    schema = Schema.from_dict(msg["schema"])
    coordinator.data.schemas[schema.id] = schema
    await coordinator.async_apply_config_change()
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/delete_schema",
        vol.Required("schema_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_schema(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    schema_id = msg["schema_id"]
    if schema_id == DEFAULT_SCHEMA_ID:
        connection.send_error(
            msg["id"], "invalid_schema", "The default schema cannot be deleted"
        )
        return
    coordinator.data.schemas.pop(schema_id, None)
    if coordinator.data.active_schema_id == schema_id:
        coordinator.data.active_schema_id = DEFAULT_SCHEMA_ID
    await coordinator.async_apply_config_change()
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/set_active_schema",
        vol.Required("schema_id"): str,
    }
)
@websocket_api.async_response
async def ws_set_active_schema(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    coordinator.set_active_schema(msg["schema_id"])
    await coordinator.async_apply_config_change()
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/set_manual_control",
        vol.Required("entity_id"): str,
        vol.Required("manual_control"): bool,
    }
)
@websocket_api.async_response
async def ws_set_manual_control(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    coordinator.set_manual_control(msg["entity_id"], msg["manual_control"])
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


def _resolve_schema(coordinator: AdaptCoordinator, msg) -> Schema | None:
    """The inline draft ``schema`` if given, else the stored one by id."""
    if msg.get("schema"):
        return Schema.from_dict(msg["schema"])
    return coordinator.data.schemas.get(msg.get("schema_id"))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/timeline",
        vol.Optional("schema_id"): str,
        vol.Optional("schema"): dict,
    }
)
@websocket_api.async_response
async def ws_timeline(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    schema = _resolve_schema(coordinator, msg)
    if schema is None:
        connection.send_error(msg["id"], "not_found", "Unknown schema")
        return
    connection.send_result(msg["id"], coordinator.compute_timeline(schema))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/preview",
        vol.Optional("schema_id"): str,
        vol.Optional("schema"): dict,
        vol.Required("hour"): vol.Coerce(float),
        vol.Optional("apply", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_preview(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    schema = _resolve_schema(coordinator, msg) or coordinator.data.active_schema
    targets = await coordinator.async_preview(schema, msg["hour"], msg["apply"])
    connection.send_result(msg["id"], {"targets": targets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/apply",
        vol.Optional("entity_id"): vol.Any(str, [str], None),
    }
)
@websocket_api.async_response
async def ws_apply(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    raw = msg.get("entity_id")
    entity_ids = [raw] if isinstance(raw, str) else raw
    await coordinator.async_apply(entity_ids, force=True)
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command({vol.Required("type"): "ha_adapt/export"})
@websocket_api.async_response
async def ws_export(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is not None:
        connection.send_result(msg["id"], coordinator.data.to_dict())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/import",
        vol.Required("data"): dict,
    }
)
@websocket_api.async_response
async def ws_import(hass, connection, msg) -> None:
    coordinator = _error_if_not_ready(connection, msg)
    if coordinator is None:
        return
    coordinator.store.data = StoreData.from_dict(msg["data"])
    await coordinator.async_apply_config_change()
    connection.send_result(msg["id"], _config_payload(hass, coordinator))
