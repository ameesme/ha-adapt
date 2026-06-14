import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import type { HaAdaptApi } from "./api";
import type { ConfigPayload } from "./types";

// Shared base for the tab components. Each receives the current config + api,
// and reports results upward via bubbling events so the panel owns state.
export class TabBase extends LitElement {
  @property({ attribute: false }) config!: ConfigPayload;
  @property({ attribute: false }) api!: HaAdaptApi;

  /** Run an API mutation and bubble the resulting config (or error) up. */
  protected async run(promise: Promise<ConfigPayload>): Promise<void> {
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
}
