"""Web-ui backend for HA Adapt: static asset, sidebar panel, WebSocket API.

The Lit panel (served from ``frontend/dist``) talks to these WebSocket commands
to read and write the stored configuration. All mutations go through the
coordinator so the running adaptation reflects changes immediately.
"""

from __future__ import annotations

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

# Bump to bust the browser cache when the bundle changes.
PANEL_CACHE_VERSION = "0.1.0"


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
                "module_url": f"{PANEL_STATIC_PATH}?v={PANEL_CACHE_VERSION}",
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
                "schema_id": coordinator.data.assignments.get(
                    entity_id, DEFAULT_SCHEMA_ID
                ),
                "manual_control": coordinator.is_manual(entity_id),
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
        "assignments": dict(data.assignments),
        "lights": _lights_payload(hass, coordinator),
        "enabled": coordinator.enabled,
        "sleep": coordinator.sleep,
    }


# --- WebSocket commands ------------------------------------------------------


def _register_ws_commands(hass: HomeAssistant) -> None:
    for handler in (
        ws_get_config,
        ws_update_settings,
        ws_save_schema,
        ws_delete_schema,
        ws_assign_light,
        ws_set_manual_control,
        ws_apply,
        ws_export,
        ws_import,
    ):
        websocket_api.async_register_command(hass, handler)


@websocket_api.websocket_command({vol.Required("type"): "ha_adapt/get_config"})
@websocket_api.async_response
async def ws_get_config(hass, connection, msg) -> None:
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/update_settings",
        vol.Required("settings"): dict,
    }
)
@websocket_api.async_response
async def ws_update_settings(hass, connection, msg) -> None:
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
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
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    schema = Schema.from_dict(msg["schema"])
    if not schema.id:
        connection.send_error(msg["id"], "invalid_schema", "Schema id is required")
        return
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
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    schema_id = msg["schema_id"]
    if schema_id == DEFAULT_SCHEMA_ID:
        connection.send_error(
            msg["id"], "invalid_schema", "The default schema cannot be deleted"
        )
        return
    coordinator.data.schemas.pop(schema_id, None)
    # Lights assigned to the removed schema fall back to the default.
    coordinator.data.assignments = {
        entity_id: sid
        for entity_id, sid in coordinator.data.assignments.items()
        if sid != schema_id
    }
    await coordinator.async_apply_config_change()
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/assign_light",
        vol.Required("entity_id"): str,
        vol.Required("schema_id"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_assign_light(hass, connection, msg) -> None:
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    entity_id = msg["entity_id"]
    schema_id = msg["schema_id"]
    if not schema_id or schema_id == DEFAULT_SCHEMA_ID:
        coordinator.data.assignments.pop(entity_id, None)
    else:
        coordinator.data.assignments[entity_id] = schema_id
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
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    coordinator.set_manual_control(msg["entity_id"], msg["manual_control"])
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/apply",
        vol.Optional("entity_id"): vol.Any(str, [str], None),
    }
)
@websocket_api.async_response
async def ws_apply(hass, connection, msg) -> None:
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    raw = msg.get("entity_id")
    entity_ids = [raw] if isinstance(raw, str) else raw
    await coordinator.async_apply(entity_ids, force=True)
    connection.send_result(msg["id"], _config_payload(hass, coordinator))


@websocket_api.websocket_command({vol.Required("type"): "ha_adapt/export"})
@websocket_api.async_response
async def ws_export(hass, connection, msg) -> None:
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    connection.send_result(msg["id"], coordinator.data.to_dict())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ha_adapt/import",
        vol.Required("data"): dict,
    }
)
@websocket_api.async_response
async def ws_import(hass, connection, msg) -> None:
    coordinator = get_coordinator(hass)
    if coordinator is None:
        connection.send_error(msg["id"], "not_ready", "Integration not set up")
        return
    coordinator.store.data = StoreData.from_dict(msg["data"])
    await coordinator.async_apply_config_change()
    connection.send_result(msg["id"], _config_payload(hass, coordinator))
