// Shapes mirroring the Python dataclasses (models.py) and the WebSocket
// payloads (panel.py). Kept intentionally permissive — the backend is the
// source of truth and tolerates unknown keys.

export type Mode = "sun" | "hourly" | "sensor";
export type BrightnessMode = "default" | "linear" | "tanh";

export interface HourlyKeyframe {
  hour: number;
  brightness: number;
  color_temp: number;
}

export interface Schema {
  id: string;
  name: string;
  mode: Mode;

  min_brightness: number;
  max_brightness: number;
  min_color_temp: number;
  max_color_temp: number;
  transition: number | null;
  adapt_brightness: boolean;
  adapt_color: boolean;
  separate_turn_on_commands: boolean;

  brightness_mode: BrightnessMode;
  brightness_mode_time_dark: number;
  brightness_mode_time_light: number;
  sunrise_time: string | null;
  sunset_time: string | null;
  sunrise_offset: number;
  sunset_offset: number;
  min_sunrise_time: string | null;
  max_sunrise_time: string | null;
  min_sunset_time: string | null;
  max_sunset_time: string | null;

  hourly_keyframes: HourlyKeyframe[];

  sensor_entity_id: string | null;
  sensor_min: number;
  sensor_max: number;
}

export interface GlobalSettings {
  interval: number;
  transition: number;
  initial_transition: number;
  send_split_delay: number;
  autoreset_control: number;
  take_over_control: boolean;
  detect_non_ha_changes: boolean;
  sleep_brightness: number;
  sleep_color_temp: number;
}

export interface LightInfo {
  entity_id: string;
  name: string;
  state: string;
  schema_id: string;
  manual_control: boolean;
  target: {
    brightness_pct: number | null;
    color_temp_kelvin: number | null;
  };
}

export interface ConfigPayload {
  settings: GlobalSettings;
  schemas: Record<string, Schema>;
  assignments: Record<string, string>;
  lights: LightInfo[];
  enabled: boolean;
  sleep: boolean;
}

// Minimal slice of the Home Assistant object the panel relies on.
export interface HomeAssistant {
  connection: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  };
}
