import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { numberField, rangeField, timeField } from "../form-fields";
import { KELVIN_MAX, KELVIN_MIN } from "../utils";
import { baseStyles } from "../theme";
import type { SunConfig } from "../types";

// Editor for a schema's sun. Emits `sun-changed` with the updated SunConfig.
@customElement("ha-adapt-sun-config")
export class SunConfigEditor extends LitElement {
  static override styles = baseStyles;

  @property({ attribute: false }) sun!: SunConfig;

  override render(): TemplateResult {
    const s = this.sun;
    return html`<div class="card">
      <h2>☀️ Sun</h2>
      <p class="muted">
        The sun drives every light's fallback. Empty timeline cells follow it.
      </p>
      <div class="grid">
        ${rangeField("Min brightness", s.min_brightness, 1, 100, 1, "%", (v) =>
          this._patch({ min_brightness: v })
        )}
        ${rangeField("Max brightness", s.max_brightness, 1, 100, 1, "%", (v) =>
          this._patch({ max_brightness: v })
        )}
        ${rangeField(
          "Min color temp",
          s.min_color_temp,
          KELVIN_MIN,
          KELVIN_MAX,
          50,
          "K",
          (v) => this._patch({ min_color_temp: v })
        )}
        ${rangeField(
          "Max color temp",
          s.max_color_temp,
          KELVIN_MIN,
          KELVIN_MAX,
          50,
          "K",
          (v) => this._patch({ max_color_temp: v })
        )}
        ${timeField("Fixed sunrise", s.sunrise_time, (v) =>
          this._patch({ sunrise_time: v })
        )}
        ${timeField("Fixed sunset", s.sunset_time, (v) =>
          this._patch({ sunset_time: v })
        )}
        ${numberField("Sunrise offset (s)", s.sunrise_offset, (v) =>
          this._patch({ sunrise_offset: v })
        )}
        ${numberField("Sunset offset (s)", s.sunset_offset, (v) =>
          this._patch({ sunset_offset: v })
        )}
        ${numberField("Ramp – dark side (s)", s.ramp_dark, (v) =>
          this._patch({ ramp_dark: v })
        )}
        ${numberField("Ramp – light side (s)", s.ramp_light, (v) =>
          this._patch({ ramp_light: v })
        )}
      </div>
    </div>`;
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
    "ha-adapt-sun-config": SunConfigEditor;
  }
}
