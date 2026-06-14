import type { Mode, Schema } from "./types";

export const MODE_LABELS: Record<Mode, string> = {
  sun: "Sun (automatic)",
  hourly: "By hour",
  sensor: "Sensor input",
};

export const BRIGHTNESS_MODE_LABELS: Record<string, string> = {
  default: "Default",
  linear: "Linear ramp",
  tanh: "Tanh (smooth)",
};

export function defaultSchema(id: string, name: string): Schema {
  return {
    id,
    name,
    mode: "sun",
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2000,
    max_color_temp: 5500,
    transition: null,
    adapt_brightness: true,
    adapt_color: true,
    separate_turn_on_commands: false,
    brightness_mode: "default",
    brightness_mode_time_dark: 900,
    brightness_mode_time_light: 3600,
    sunrise_time: null,
    sunset_time: null,
    sunrise_offset: 0,
    sunset_offset: 0,
    min_sunrise_time: null,
    max_sunrise_time: null,
    min_sunset_time: null,
    max_sunset_time: null,
    hourly_keyframes: [],
    sensor_entity_id: null,
    sensor_min: 0,
    sensor_max: 100,
  };
}

// Rough Kelvin -> CSS color, used only for the little preview swatches.
export function kelvinToCss(kelvin: number | null): string {
  if (kelvin == null) return "transparent";
  const temp = Math.max(1000, Math.min(12000, kelvin)) / 100;
  let r: number;
  let g: number;
  let b: number;
  if (temp <= 66) {
    r = 255;
    g = 99.47 * Math.log(temp) - 161.12;
  } else {
    r = 329.7 * Math.pow(temp - 60, -0.1332);
    g = 288.12 * Math.pow(temp - 60, -0.0755);
  }
  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = 138.52 * Math.log(temp - 10) - 305.04;
  }
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}
