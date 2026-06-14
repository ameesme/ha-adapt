"""HA Adapt — adaptive lighting for Home Assistant.

Setup wiring: one coordinator per config entry, the web-ui panel and services
registered once, and the turn-on interceptor attached. Most logic lives in the
modules this file ties together (coordinator, engine, panel, interceptor).
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .const import (
    ATTR_MANUAL_CONTROL,
    DOMAIN,
    PLATFORMS,
    SERVICE_APPLY,
    SERVICE_SET_MANUAL_CONTROL,
)
from .coordinator import AdaptCoordinator, get_coordinator
from .interceptor import async_setup_interceptor
from .panel import async_remove_panel, async_setup_panel
from .store import HaAdaptStore

_PANEL_REGISTERED = "_panel_registered"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up HA Adapt from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    store = HaAdaptStore(hass)
    await store.async_load()
    coordinator = AdaptCoordinator(hass, entry, store)
    await coordinator.async_start()
    hass.data[DOMAIN][entry.entry_id] = coordinator

    if not hass.data[DOMAIN].get(_PANEL_REGISTERED):
        await async_setup_panel(hass, coordinator)
        hass.data[DOMAIN][_PANEL_REGISTERED] = True

    coordinator.register_unsub(await async_setup_interceptor(hass, coordinator))

    _async_register_services(hass)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """React to the controlled-lights list changing via the options flow."""
    coordinator: AdaptCoordinator = hass.data[DOMAIN][entry.entry_id]
    await coordinator.async_update_lights()


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Tear down a config entry."""
    coordinator: AdaptCoordinator = hass.data[DOMAIN][entry.entry_id]
    await coordinator.async_unload()

    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not _remaining_coordinators(hass):
            async_remove_panel(hass)
            hass.data[DOMAIN].pop(_PANEL_REGISTERED, None)
            for service in (SERVICE_APPLY, SERVICE_SET_MANUAL_CONTROL):
                hass.services.async_remove(DOMAIN, service)
    return unloaded


def _remaining_coordinators(hass: HomeAssistant) -> list[AdaptCoordinator]:
    return [
        value
        for value in hass.data.get(DOMAIN, {}).values()
        if isinstance(value, AdaptCoordinator)
    ]


def _async_register_services(hass: HomeAssistant) -> None:
    if hass.services.has_service(DOMAIN, SERVICE_APPLY):
        return

    async def handle_apply(call: ServiceCall) -> None:
        entity_ids = call.data.get(ATTR_ENTITY_ID)
        coordinator = get_coordinator(hass)
        if coordinator is not None:
            await coordinator.async_apply(entity_ids, force=True)

    async def handle_set_manual_control(call: ServiceCall) -> None:
        coordinator = get_coordinator(hass)
        if coordinator is None:
            return
        manual = call.data[ATTR_MANUAL_CONTROL]
        for entity_id in call.data[ATTR_ENTITY_ID]:
            coordinator.set_manual_control(entity_id, manual)

    hass.services.async_register(
        DOMAIN,
        SERVICE_APPLY,
        handle_apply,
        schema=vol.Schema(
            {vol.Optional(ATTR_ENTITY_ID): cv.entity_ids}
        ),
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_SET_MANUAL_CONTROL,
        handle_set_manual_control,
        schema=vol.Schema(
            {
                vol.Required(ATTR_ENTITY_ID): cv.entity_ids,
                vol.Required(ATTR_MANUAL_CONTROL, default=True): cv.boolean,
            }
        ),
    )
