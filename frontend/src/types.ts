// Shapes mirroring the Python dataclasses (models.py) and WebSocket payloads
// (panel.py). A schema owns the sun config and one timeline row per light.

export interface SunConfig {
  min_brightness: number;
  max_brightness: number;
  min_color_temp: number;
  max_color_temp: number;
  ramp_dark: number;
  ramp_light: number;
  sunrise_time: string | null;
  sunset_time: string | null;
  sunrise_offset: number;
  sunset_offset: number;
  min_sunrise_time: string | null;
  max_sunrise_time: string | null;
  min_sunset_time: string | null;
  max_sunset_time: string | null;
}

// An hour cell is either an explicit override or null (follow the sun).
// rgb_color (when set) overrides color_temp for RGB-capable lights.
export type RgbColor = [number, number, number];
export type HourCell = {
  brightness: number;
  color_temp: number;
  rgb_color?: RgbColor | null;
} | null;

export interface LightConfig {
  min_brightness: number;
  max_brightness: number;
  min_color_temp: number;
  max_color_temp: number;
  separate_turn_on_commands: boolean;
  // "cap" clamps the sun's value into the range; "scale" maps the sun's 0..1
  // signal onto the range (used on sun-following hours).
  limit_mode: "cap" | "scale";
  hours: HourCell[]; // length 24
}

export interface Schema {
  id: string;
  name: string;
  sun: SunConfig;
  lights: Record<string, LightConfig>;
}

export interface GlobalSettings {
  interval: number;
  transition: number;
  initial_transition: number;
  send_split_delay: number;
  autoreset_control: number;
  take_over_control: boolean;
  // null = use Home Assistant's configured location for sun calculation.
  sun_latitude: number | null;
  sun_longitude: number | null;
}

export interface LightInfo {
  entity_id: string;
  name: string;
  area_name: string | null;
  supports_rgb: boolean;
}

export interface ConfigPayload {
  settings: GlobalSettings;
  schemas: Record<string, Schema>;
  active_schema_id: string;
  lights: LightInfo[];
  // The home's configured coordinates (the blank-field fallback).
  home_latitude: number;
  home_longitude: number;
  // Integration manifest version, for the settings footer.
  version: string;
}

// Computed per-hour values for rendering the timeline (from ha_adapt/timeline).
export interface TimelineCell {
  brightness: number;
  color_temp: number;
  rgb_color: RgbColor | null;
  explicit: boolean;
}

export interface TimelineData {
  sun: { brightness: number; color_temp: number }[]; // length 24
  lights: Record<string, TimelineCell[]>; // entity_id -> length 24
}

// Minimal slice of the Home Assistant object the panel relies on.
export interface HomeAssistant {
  connection: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  };
}
