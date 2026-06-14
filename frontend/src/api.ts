// Thin wrapper over the Home Assistant WebSocket connection.

import type {
  ConfigPayload,
  GlobalSettings,
  HomeAssistant,
  Schema,
  TimelineData,
} from "./types";

interface PreviewResult {
  targets: Record<
    string,
    { brightness_pct: number | null; color_temp_kelvin: number | null }
  >;
}

export class HaAdaptApi {
  constructor(private hass: HomeAssistant) {}

  setHass(hass: HomeAssistant): void {
    this.hass = hass;
  }

  getConfig(): Promise<ConfigPayload> {
    return this.send("ha_adapt/get_config");
  }

  updateSettings(settings: Partial<GlobalSettings>): Promise<ConfigPayload> {
    return this.send("ha_adapt/update_settings", { settings });
  }

  saveSchema(schema: Schema): Promise<ConfigPayload> {
    return this.send("ha_adapt/save_schema", { schema });
  }

  deleteSchema(schemaId: string): Promise<ConfigPayload> {
    return this.send("ha_adapt/delete_schema", { schema_id: schemaId });
  }

  setActiveSchema(schemaId: string): Promise<ConfigPayload> {
    return this.send("ha_adapt/set_active_schema", { schema_id: schemaId });
  }

  setManualControl(entityId: string, manual: boolean): Promise<ConfigPayload> {
    return this.send("ha_adapt/set_manual_control", {
      entity_id: entityId,
      manual_control: manual,
    });
  }

  timeline(schemaId: string): Promise<TimelineData> {
    return this.send("ha_adapt/timeline", { schema_id: schemaId });
  }

  preview(schemaId: string, hour: number, apply: boolean): Promise<PreviewResult> {
    return this.send("ha_adapt/preview", {
      schema_id: schemaId,
      hour,
      apply,
    });
  }

  apply(entityId?: string): Promise<ConfigPayload> {
    return this.send("ha_adapt/apply", entityId ? { entity_id: entityId } : {});
  }

  private send<T>(type: string, payload: Record<string, unknown> = {}): Promise<T> {
    return this.hass.connection.sendMessagePromise<T>({ type, ...payload });
  }
}
