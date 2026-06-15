import type { LightConfig, Schema, SunConfig } from "./types";

export const HOURS = Array.from({ length: 24 }, (_, h) => h);

// Slider bounds for color-temperature inputs.
export const KELVIN_MIN = 1500;
export const KELVIN_MAX = 6500;

export function defaultSunConfig(): SunConfig {
  return {
    min_brightness: 5,
    max_brightness: 100,
    min_color_temp: 2000,
    max_color_temp: 5500,
    ramp_dark: 5000,
    ramp_light: 9000,
    sunrise_time: null,
    sunset_time: null,
    sunrise_offset: 5000,
    sunset_offset: -5000,
    min_sunrise_time: null,
    max_sunrise_time: null,
    min_sunset_time: null,
    max_sunset_time: null,
  };
}

export function defaultLightConfig(): LightConfig {
  return {
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2000,
    max_color_temp: 5500,
    separate_turn_on_commands: false,
    hours: Array.from({ length: 24 }, () => null),
  };
}

export function defaultSchema(id: string, name: string): Schema {
  return { id, name, sun: defaultSunConfig(), lights: {} };
}

// Rough Kelvin -> CSS color, used for the timeline swatches.
export function kelvinToCss(kelvin: number): string {
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

export function hourLabel(hour: number): string {
  return String(hour).padStart(2, "0");
}
