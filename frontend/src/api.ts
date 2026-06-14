// Thin wrapper over the Home Assistant WebSocket connection. Every mutation
// returns the fresh ConfigPayload from the backend, so the UI can update from
// the response without a second round-trip.

import type { ConfigPayload, GlobalSettings, HomeAssistant, Schema } from "./types";

export class HaAdaptApi {
  constructor(private hass: HomeAssistant) {}

  setHass(hass: HomeAssistant): void {
    this.hass = hass;
  }

  getConfig(): Promise<ConfigPayload> {
    return this.send<ConfigPayload>("ha_adapt/get_config");
  }

  updateSettings(settings: Partial<GlobalSettings>): Promise<ConfigPayload> {
    return this.send<ConfigPayload>("ha_adapt/update_settings", { settings });
  }

  saveSchema(schema: Schema): Promise<ConfigPayload> {
    return this.send<ConfigPayload>("ha_adapt/save_schema", { schema });
  }

  deleteSchema(schemaId: string): Promise<ConfigPayload> {
    return this.send<ConfigPayload>("ha_adapt/delete_schema", {
      schema_id: schemaId,
    });
  }

  assignLight(entityId: string, schemaId: string | null): Promise<ConfigPayload> {
    return this.send<ConfigPayload>("ha_adapt/assign_light", {
      entity_id: entityId,
      schema_id: schemaId,
    });
  }

  setManualControl(
    entityId: string,
    manual: boolean
  ): Promise<ConfigPayload> {
    return this.send<ConfigPayload>("ha_adapt/set_manual_control", {
      entity_id: entityId,
      manual_control: manual,
    });
  }

  apply(entityId?: string): Promise<ConfigPayload> {
    return this.send<ConfigPayload>(
      "ha_adapt/apply",
      entityId ? { entity_id: entityId } : {}
    );
  }

  export(): Promise<unknown> {
    return this.send<unknown>("ha_adapt/export");
  }

  import(data: unknown): Promise<ConfigPayload> {
    return this.send<ConfigPayload>("ha_adapt/import", { data });
  }

  private send<T>(type: string, payload: Record<string, unknown> = {}): Promise<T> {
    return this.hass.connection.sendMessagePromise<T>({ type, ...payload });
  }
}
