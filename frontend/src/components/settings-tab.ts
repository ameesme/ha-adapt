import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HaAdaptApi } from "../api";
import {
  checkboxField,
  coordField,
  numberField,
  sectionHeading,
} from "../form-fields";
import { baseStyles } from "../theme";
import type { ConfigPayload, GlobalSettings } from "../types";

// Receives the current config + api, and reports results upward via bubbling
// events so the panel owns state.
@customElement("ha-adapt-settings-tab")
export class SettingsTab extends LitElement {
  static override styles = baseStyles;

  @property({ attribute: false }) config!: ConfigPayload;
  @property({ attribute: false }) api!: HaAdaptApi;

  /** Run an API mutation and bubble the resulting config (or error) up. */
  private async run(promise: Promise<ConfigPayload>): Promise<void> {
    try {
      const config = await promise;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: config,
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.dispatchEvent(
        new CustomEvent("panel-error", {
          detail: String(err),
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  override render(): TemplateResult {
    const s = this.config.settings;
    const save = (patch: Partial<GlobalSettings>) =>
      void this.run(this.api.updateSettings(patch));

    return html`
      ${sectionHeading("Adaptation")}
      <div class="grid">
        ${numberField("Interval (s)", s.interval, (v) => save({ interval: v }))}
        ${numberField("Transition (s)", s.transition, (v) =>
          save({ transition: v })
        )}
        ${numberField(
          "Turn-on transition (s)",
          s.initial_transition,
          (v) => save({ initial_transition: v })
        )}
      </div>
      ${sectionHeading(
        "Manual control",
        "When a light is changed by hand, adaptation pauses for it. " +
          "Auto-reset hands control back after this many seconds (0 = never)."
      )}
      <div class="actions">
        ${checkboxField("Take over control", s.take_over_control, (v) =>
          save({ take_over_control: v })
        )}
      </div>
      <div class="grid">
        ${numberField(
          "Auto-reset override (s)",
          s.autoreset_control,
          (v) => save({ autoreset_control: v })
        )}
      </div>
      ${sectionHeading(
        "Light commands",
        "Gap between the two turn-on calls for lights with the per-light " +
          '"Split commands" option enabled (e.g. IKEA).'
      )}
      <div class="grid">
        ${numberField(
          "Split-command delay (ms)",
          s.send_split_delay,
          (v) => save({ send_split_delay: v })
        )}
      </div>
      ${sectionHeading(
        "Location",
        "Optional coordinates for the sun calculation. Leave blank to use " +
          "Home Assistant's own location."
      )}
      <div class="pair">
        ${coordField("Sun latitude", s.sun_latitude, (v) =>
          save({ sun_latitude: v })
        )}
        ${coordField("Sun longitude", s.sun_longitude, (v) =>
          save({ sun_longitude: v })
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-settings-tab": SettingsTab;
  }
}
