// In-memory fake of the integration's WebSocket backend, so the panel can run
// fully in the browser (npm run dev) with no Home Assistant. It mirrors the WS
// commands in custom_components/sundial/panel.py and computes timeline/preview
// with the ported engine in ./engine.ts.

import type {
  ConfigPayload,
  GlobalSettings,
  HomeAssistant,
  HourCell,
  LightConfig,
  Schema,
} from "../src/types";
import { defaultLightConfig, defaultSunConfig } from "../src/utils";
import { computeTargets, computeTimeline } from "./engine";

// --- fake devices ------------------------------------------------------------

interface FakeLight {
  entity_id: string;
  name: string;
  area_name: string | null;
  supports_rgb: boolean;
}

const FAKE_LIGHTS: FakeLight[] = [
  { entity_id: "light.living_room", name: "Living Room", area_name: "Living Room", supports_rgb: true },
  { entity_id: "light.kitchen", name: "Kitchen Spots", area_name: "Kitchen", supports_rgb: false },
  { entity_id: "light.bedroom", name: "Bedroom", area_name: "Bedroom", supports_rgb: true },
  { entity_id: "light.hallway", name: "Hallway", area_name: null, supports_rgb: false },
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
  sun_latitude: null,
  sun_longitude: null,
});

// --- store + WS dispatch -----------------------------------------------------

interface Store {
  settings: GlobalSettings;
  schemas: Record<string, Schema>;
  active_schema_id: string;
}

function newStore(): Store {
  return {
    settings: defaultSettings(),
    schemas: { default: defaultSchema(), evening: eveningSchema() },
    active_schema_id: "default",
  };
}

const entityIds = () => FAKE_LIGHTS.map((l) => l.entity_id);

function configPayload(store: Store): ConfigPayload {
  return {
    settings: store.settings,
    schemas: store.schemas,
    active_schema_id: store.active_schema_id,
    lights: FAKE_LIGHTS.map((l) => ({
      entity_id: l.entity_id,
      name: l.name,
      area_name: l.area_name,
      supports_rgb: l.supports_rgb,
    })),
    home_latitude: 52.3731,
    home_longitude: 4.8922,
    version: "0.0.0-dev",
  };
}

type Msg = Record<string, unknown>;

function handle(store: Store, msg: Msg): unknown {
  switch (msg.type) {
    case "sundial/get_config":
      return configPayload(store);

    case "sundial/update_settings":
      store.settings = { ...store.settings, ...(msg.settings as Partial<GlobalSettings>) };
      return configPayload(store);

    case "sundial/save_schema": {
      const schema = msg.schema as Schema;
      store.schemas[schema.id] = schema;
      return configPayload(store);
    }

    case "sundial/delete_schema": {
      const id = msg.schema_id as string;
      delete store.schemas[id];
      if (store.active_schema_id === id) store.active_schema_id = "default";
      return configPayload(store);
    }

    case "sundial/set_active_schema":
      store.active_schema_id = msg.schema_id as string;
      return configPayload(store);

    case "sundial/timeline":
      return computeTimeline(msg.schema as Schema, entityIds(), defaultLightConfig);

    case "sundial/preview":
      return {
        targets: computeTargets(
          msg.schema as Schema,
          msg.hour as number,
          entityIds(),
          defaultLightConfig,
        ),
      };

    case "sundial/apply":
      return configPayload(store);

    case "sundial/export":
      return {
        settings: store.settings,
        schemas: store.schemas,
        active_schema_id: store.active_schema_id,
      };

    case "sundial/import": {
      const data = msg.data as Partial<Store>;
      store.settings = data.settings ?? store.settings;
      store.schemas = data.schemas ?? store.schemas;
      store.active_schema_id = data.active_schema_id ?? store.active_schema_id;
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
