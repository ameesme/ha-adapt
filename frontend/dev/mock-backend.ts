// In-memory fake of the integration's WebSocket backend, so the panel can run
// fully in the browser (npm run dev) with no Home Assistant. It mirrors the WS
// commands in custom_components/ha_adapt/panel.py and computes timeline/preview
// with the ported engine in ./engine.ts.

import type {
  ConfigPayload,
  GlobalSettings,
  HomeAssistant,
  HourCell,
  LightConfig,
  Schema,
} from "../src/types";
import { currentHour, defaultLightConfig, defaultSunConfig } from "../src/utils";
import { computeTargets, computeTimeline } from "./engine";

// --- fake devices ------------------------------------------------------------

interface FakeLight {
  entity_id: string;
  name: string;
  supports_rgb: boolean;
}

const FAKE_LIGHTS: FakeLight[] = [
  { entity_id: "light.living_room", name: "Living Room", supports_rgb: true },
  { entity_id: "light.kitchen", name: "Kitchen Spots", supports_rgb: false },
  { entity_id: "light.bedroom", name: "Bedroom", supports_rgb: true },
  { entity_id: "light.hallway", name: "Hallway", supports_rgb: false },
];

const cell = (brightness: number, color_temp: number, rgb_color?: [number, number, number]): HourCell => ({
  brightness,
  color_temp,
  ...(rgb_color ? { rgb_color } : {}),
});

function lightWith(overrides: Record<number, HourCell>): LightConfig {
  const cfg = defaultLightConfig();
  cfg.hours = cfg.hours.map((h, hour) => overrides[hour] ?? h);
  return cfg;
}

function defaultSchema(): Schema {
  return {
    id: "default",
    name: "Default",
    sun: defaultSunConfig(),
    lights: {
      // A mix of explicit cells (incl. an RGB override) and sun-following hours
      // so the timeline shows off every feature on first load.
      "light.living_room": lightWith({
        0: cell(5, 2000),
        7: cell(60, 2700),
        20: cell(45, 2200, [255, 90, 30]),
        22: cell(20, 2000, [200, 40, 120]),
      }),
      "light.bedroom": lightWith({
        22: cell(10, 2000),
        23: cell(5, 2000),
      }),
    },
  };
}

function eveningSchema(): Schema {
  const sun = defaultSunConfig();
  sun.max_color_temp = 4000;
  return {
    id: "evening",
    name: "Cosy Evening",
    sun,
    lights: {
      "light.living_room": lightWith({ 19: cell(35, 2200, [255, 120, 40]) }),
    },
  };
}

const defaultSettings = (): GlobalSettings => ({
  interval: 90,
  transition: 1,
  initial_transition: 1,
  send_split_delay: 350,
  autoreset_control: 0,
  take_over_control: true,
  detect_non_ha_changes: false,
});

// --- store + WS dispatch -----------------------------------------------------

interface Store {
  settings: GlobalSettings;
  schemas: Record<string, Schema>;
  active_schema_id: string;
  manual: Record<string, boolean>;
}

function newStore(): Store {
  return {
    settings: defaultSettings(),
    schemas: { default: defaultSchema(), evening: eveningSchema() },
    active_schema_id: "default",
    manual: {},
  };
}

const entityIds = () => FAKE_LIGHTS.map((l) => l.entity_id);

function configPayload(store: Store): ConfigPayload {
  const active = store.schemas[store.active_schema_id] ?? defaultSchema();
  const targets = computeTargets(active, currentHour(), entityIds(), defaultLightConfig);
  return {
    settings: store.settings,
    schemas: store.schemas,
    active_schema_id: store.active_schema_id,
    enabled: true,
    lights: FAKE_LIGHTS.map((l) => ({
      entity_id: l.entity_id,
      name: l.name,
      state: "on",
      manual_control: store.manual[l.entity_id] ?? false,
      supports_rgb: l.supports_rgb,
      target: targets[l.entity_id] ?? { brightness_pct: null, color_temp_kelvin: null },
    })),
  };
}

type Msg = Record<string, unknown>;

function handle(store: Store, msg: Msg): unknown {
  switch (msg.type) {
    case "ha_adapt/get_config":
      return configPayload(store);

    case "ha_adapt/update_settings":
      store.settings = { ...store.settings, ...(msg.settings as Partial<GlobalSettings>) };
      return configPayload(store);

    case "ha_adapt/save_schema": {
      const schema = msg.schema as Schema;
      store.schemas[schema.id] = schema;
      return configPayload(store);
    }

    case "ha_adapt/delete_schema": {
      const id = msg.schema_id as string;
      delete store.schemas[id];
      if (store.active_schema_id === id) store.active_schema_id = "default";
      return configPayload(store);
    }

    case "ha_adapt/set_active_schema":
      store.active_schema_id = msg.schema_id as string;
      return configPayload(store);

    case "ha_adapt/set_manual_control":
      store.manual[msg.entity_id as string] = msg.manual_control as boolean;
      return configPayload(store);

    case "ha_adapt/timeline":
      return computeTimeline(msg.schema as Schema, entityIds(), defaultLightConfig);

    case "ha_adapt/preview":
      return {
        targets: computeTargets(
          msg.schema as Schema,
          msg.hour as number,
          entityIds(),
          defaultLightConfig,
        ),
      };

    case "ha_adapt/apply":
      return configPayload(store);

    case "ha_adapt/export":
      return {
        settings: store.settings,
        schemas: store.schemas,
        active_schema_id: store.active_schema_id,
      };

    case "ha_adapt/import": {
      const data = msg.data as Partial<Store>;
      store.settings = (data.settings as GlobalSettings) ?? store.settings;
      store.schemas = (data.schemas as Record<string, Schema>) ?? store.schemas;
      store.active_schema_id = (data.active_schema_id as string) ?? store.active_schema_id;
      return configPayload(store);
    }

    default:
      throw new Error(`mock backend: unhandled message ${String(msg.type)}`);
  }
}

// A HomeAssistant-shaped object whose WS connection talks to the in-memory
// store. A small delay mimics real latency so debounced saves behave naturally.
export function createMockHass(): HomeAssistant {
  const store = newStore();
  return {
    connection: {
      sendMessagePromise<T>(message: Msg): Promise<T> {
        return new Promise((resolve) => {
          setTimeout(() => resolve(handle(store, message) as T), 40);
        });
      },
    },
  };
}
