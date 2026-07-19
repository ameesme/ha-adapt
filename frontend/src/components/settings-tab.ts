import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HaAdaptApi } from "../api";
import { checkboxField, coordField, numberField } from "../form-fields";
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
        ${numberField(
          "Auto-reset override (s)",
          s.autoreset_control,
          (v) => save({ autoreset_control: v })
        )}
        ${numberField(
          "Split-command delay (ms)",
          s.send_split_delay,
          (v) => save({ send_split_delay: v })
        )}
        ${coordField("Sun latitude", s.sun_latitude, (v) =>
          save({ sun_latitude: v })
        )}
        ${coordField("Sun longitude", s.sun_longitude, (v) =>
          save({ sun_longitude: v })
        )}
      </div>
      <p class="muted">
        Leave the coordinates blank to use Home Assistant's own location for sun
        calculation. The split-command delay is the gap between the two turn-on
        calls for lights with "Split commands" enabled.
      </p>
      <div class="actions">
        ${checkboxField("Take over control", s.take_over_control, (v) =>
          save({ take_over_control: v })
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
