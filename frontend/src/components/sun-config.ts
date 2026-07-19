import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  durationField,
  minMaxField,
  sectionHeading,
  timeField,
} from "../form-fields";
import { KELVIN_MAX, KELVIN_MIN, kelvinGradientCss } from "../utils";
import { baseStyles } from "../theme";
import type { SunConfig } from "../types";

// Slider bounds for offsets (± both ways) and ramp widths, in seconds. Soft
// caps: a stored value beyond them stretches the slider instead of being
// clamped away on the first drag.
const OFFSET_MAX = 4 * 3600;
const RAMP_MAX = 4 * 3600;

// Editor for a schema's sun. Emits `sun-changed` with the updated SunConfig.
// The title header is rendered by the container (side panel / drawer).
@customElement("sundial-sun-config")
export class SunConfigEditor extends LitElement {
  static override styles = baseStyles;

  @property({ attribute: false }) sun!: SunConfig;

  override render(): TemplateResult {
    const s = this.sun;
    return html`
      ${sectionHeading(
        "Brightness",
        "The sun drives every light's fallback: empty timeline cells follow " +
          "it, scaled into each light's own range."
      )}
      ${minMaxField("Range", "%", s.min_brightness, s.max_brightness, 0, 100, 1, (lo, hi) =>
        this._patch({ min_brightness: lo, max_brightness: hi })
      )}
      ${s.min_brightness <= 0
        ? html`<p class="warn">
            At 0% lights following the sun can turn off at night, and adaptation
            won't turn them back on automatically.
          </p>`
        : nothing}
      ${sectionHeading("Color temperature")}
      ${minMaxField(
        "Range",
        " K",
        s.min_color_temp,
        s.max_color_temp,
        KELVIN_MIN,
        KELVIN_MAX,
        50,
        (lo, hi) => this._patch({ min_color_temp: lo, max_color_temp: hi }),
        kelvinGradientCss(KELVIN_MIN, KELVIN_MAX)
      )}
      ${sectionHeading(
        "Sunrise & sunset",
        "Fixed times override the location-based calculation; offsets shift " +
          "the calculated moment."
      )}
      <div class="pair">
        ${timeField("Fixed sunrise", s.sunrise_time, (v) =>
          this._patch({ sunrise_time: v })
        )}
        ${timeField("Fixed sunset", s.sunset_time, (v) =>
          this._patch({ sunset_time: v })
        )}
      </div>
      <div class="pair">
        ${durationField(
          "Sunrise offset",
          s.sunrise_offset,
          Math.min(-OFFSET_MAX, s.sunrise_offset),
          Math.max(OFFSET_MAX, s.sunrise_offset),
          (v) => this._patch({ sunrise_offset: v })
        )}
        ${durationField(
          "Sunset offset",
          s.sunset_offset,
          Math.min(-OFFSET_MAX, s.sunset_offset),
          Math.max(OFFSET_MAX, s.sunset_offset),
          (v) => this._patch({ sunset_offset: v })
        )}
      </div>
      ${sectionHeading(
        "Ramp",
        "Width of the smooth brightness ramp around sunrise and sunset: the " +
          "dark side eases in from night, the light side out into full day."
      )}
      <div class="pair">
        ${durationField(
          "Dark side",
          s.ramp_dark,
          0,
          Math.max(RAMP_MAX, s.ramp_dark),
          (v) => this._patch({ ramp_dark: v })
        )}
        ${durationField(
          "Light side",
          s.ramp_light,
          0,
          Math.max(RAMP_MAX, s.ramp_light),
          (v) => this._patch({ ramp_light: v })
        )}
      </div>
    `;
  }

  private _patch(patch: Partial<SunConfig>): void {
    this.dispatchEvent(
      new CustomEvent("sun-changed", {
        detail: { ...this.sun, ...patch },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sundial-sun-config": SunConfigEditor;
  }
}
