import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import { TabBase } from "../base-tab";
import { checkboxField, numberField } from "../form-fields";
import { baseStyles } from "../theme";
import type { GlobalSettings } from "../types";

@customElement("ha-adapt-settings-tab")
export class SettingsTab extends TabBase {
  static override styles = baseStyles;

  override render(): TemplateResult {
    const s = this.config.settings;
    const save = (patch: Partial<GlobalSettings>) =>
      void this.run(this.api.updateSettings(patch));

    return html`<div class="card">
      <h2>Global settings</h2>
      <div class="grid">
        ${numberField("Interval (s)", s.interval, (v) => save({ interval: v }))}
        ${numberField("Transition (s)", s.transition, (v) =>
          save({ transition: v })
        )}
        ${numberField(
          "Initial transition (s)",
          s.initial_transition,
          (v) => save({ initial_transition: v })
        )}
        ${numberField(
          "Auto-reset override (s)",
          s.autoreset_control,
          (v) => save({ autoreset_control: v })
        )}
      </div>
      <div class="actions">
        ${checkboxField("Take over control", s.take_over_control, (v) =>
          save({ take_over_control: v })
        )}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-settings-tab": SettingsTab;
  }
}
