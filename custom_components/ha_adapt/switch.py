"""Switch entities for HA Adapt.

Two simple switches expose the instance state that users toggle most often:
a master "adaptive lighting" switch and a "sleep mode" switch. Everything else
is configured in the web-ui panel.
"""

from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN, PANEL_TITLE, SIGNAL_CONFIG_UPDATED
from .coordinator import AdaptCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the master and sleep switches."""
    coordinator: AdaptCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        [
            AdaptMasterSwitch(coordinator, entry),
            AdaptSleepSwitch(coordinator, entry),
        ]
    )


class _BaseAdaptSwitch(SwitchEntity, RestoreEntity):
    """Shared wiring: device grouping and config-update refresh."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, coordinator: AdaptCoordinator, entry: ConfigEntry) -> None:
        self.coordinator = coordinator
        self._entry = entry

    @property
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name=PANEL_TITLE,
            manufacturer="HA Adapt",
            entry_type=None,
        )

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_CONFIG_UPDATED, self._handle_update
            )
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()


class AdaptMasterSwitch(_BaseAdaptSwitch):
    """Enable/disable adaptation for the whole instance."""

    _attr_name = "Adaptive lighting"
    _attr_icon = "mdi:theme-light-dark"

    @property
    def unique_id(self) -> str:
        return f"{self._entry.entry_id}_master"

    @property
    def is_on(self) -> bool:
        return self.coordinator.enabled

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        last_state = await self.async_get_last_state()
        if last_state is not None:
            self.coordinator.set_enabled(last_state.state == "on")

    async def async_turn_on(self, **kwargs) -> None:
        self.coordinator.set_enabled(True)
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        self.coordinator.set_enabled(False)
        self.async_write_ha_state()


class AdaptSleepSwitch(_BaseAdaptSwitch):
    """Apply the dim, warm 'sleep' values to all controlled lights."""

    _attr_name = "Sleep mode"
    _attr_icon = "mdi:weather-night"

    @property
    def unique_id(self) -> str:
        return f"{self._entry.entry_id}_sleep"

    @property
    def is_on(self) -> bool:
        return self.coordinator.sleep

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        last_state = await self.async_get_last_state()
        if last_state is not None:
            self.coordinator.set_sleep(last_state.state == "on")

    async def async_turn_on(self, **kwargs) -> None:
        self.coordinator.set_sleep(True)
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        self.coordinator.set_sleep(False)
        self.async_write_ha_state()
