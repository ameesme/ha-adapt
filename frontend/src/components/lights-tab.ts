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
          options, then assign schemas here.
        </div>
      </div>`;
    }
    return html`<div class="card">
      <h2>Controlled lights</h2>
      ${this.config.lights.map((light) => this._renderRow(light))}
    </div>`;
  }

  private _renderRow(light: LightInfo): TemplateResult {
    const schemas = Object.values(this.config.schemas);
    const { brightness_pct, color_temp_kelvin } = light.target;
    return html`<div class="row">
      <div
        class="swatch"
        style="background:${kelvinToCss(color_temp_kelvin)}"
        title="Preview color"
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
      <select
        @change=${(e: Event) =>
          void this.run(
            this.api.assignLight(
              light.entity_id,
              (e.target as HTMLSelectElement).value
            )
          )}
      >
        ${schemas.map(
          (schema) =>
            html`<option
              value=${schema.id}
              ?selected=${schema.id === light.schema_id}
            >
              ${schema.name}
            </option>`
        )}
      </select>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-lights-tab": LightsTab;
  }
}
