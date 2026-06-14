import { html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import { TabBase } from "../base-tab";
import { baseStyles } from "../theme";
import type { LightInfo } from "../types";
import { kelvinToCss } from "../utils";

@customElement("ha-adapt-lights-tab")
export class LightsTab extends TabBase {
  static override styles = baseStyles;

  override render(): TemplateResult {
    if (this.config.lights.length === 0) {
      return html`<div class="card">
        <div class="empty">
          No lights are configured. Add light entities in the integration's
          options, then design schemas on the Schemas tab.
        </div>
      </div>`;
    }
    return html`<div class="card">
      <h2>Controlled lights</h2>
      <p class="muted">
        Live status of every light. Behaviour is configured per schema on the
        Schemas tab.
      </p>
      ${this.config.lights.map((light) => this._renderRow(light))}
    </div>`;
  }

  private _renderRow(light: LightInfo): TemplateResult {
    const { brightness_pct, color_temp_kelvin } = light.target;
    return html`<div class="row">
      <div
        class="swatch"
        style="background:${color_temp_kelvin
          ? kelvinToCss(color_temp_kelvin)
          : "transparent"}"
      ></div>
      <div class="grow">
        <div>${light.name}</div>
        <div class="muted">
          ${light.state === "on"
            ? html`${brightness_pct ?? "–"}% · ${color_temp_kelvin ?? "–"} K`
            : html`${light.state}`}
        </div>
      </div>
      ${light.manual_control
        ? html`<span class="badge manual">Manual</span>
            <button
              class="btn ghost"
              @click=${() =>
                void this.run(
                  this.api.setManualControl(light.entity_id, false)
                )}
            >
              Reset
            </button>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-lights-tab": LightsTab;
  }
}
