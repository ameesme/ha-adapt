import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { HaAdaptApi } from "./api";
import { baseStyles, tokenStyles } from "./theme";
import type { ConfigPayload, HomeAssistant } from "./types";

import "./components/schemas-tab";
import "./components/settings-tab";

// The panel is a thin, full-width shell around a single schema page. It owns the
// API + config state; children report changes via bubbling
// `config-changed`/`panel-error` events, keeping all data flow in one place.
@customElement("ha-adapt-panel")
export class HaAdaptPanel extends LitElement {
  static override styles = [
    tokenStyles,
    baseStyles,
    css`
      .wrap {
        width: 100%;
        padding: 24px 20px 64px;
        /* Clip (not hidden) so the page never scrolls sideways while the
           timeline keeps its own inner horizontal scroll. */
        overflow-x: clip;
      }
      header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }
      header h1 {
        font-size: 1.5rem;
        font-weight: 650;
        margin: 0;
      }
      .spacer {
        flex: 1;
      }
      .pill {
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
        background: var(--accent-soft);
        color: var(--accent-strong);
      }
      .pill.off {
        background: #ece2d3;
        color: var(--text-soft);
      }
      .error {
        border-color: var(--danger);
        color: var(--danger);
      }
      details.settings-fold {
        margin-top: 18px;
      }
      details.settings-fold > summary {
        cursor: pointer;
        font-weight: 650;
        color: var(--text-soft);
        padding: 6px 2px;
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) narrow = false;

  @state() private _config?: ConfigPayload;
  @state() private _error?: string;

  private _api?: HaAdaptApi;
  private _loaded = false;

  protected override updated(): void {
    if (!this.hass) return;
    if (!this._api) {
      this._api = new HaAdaptApi(this.hass);
    } else {
      this._api.setHass(this.hass);
    }
    if (!this._loaded) {
      this._loaded = true;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    try {
      this._config = await this._api!.getConfig();
      this._error = undefined;
    } catch (err) {
      this._error = String(err);
    }
  }

  private _onConfigChanged(e: CustomEvent<ConfigPayload>): void {
    this._config = e.detail;
    this._error = undefined;
  }

  private _onError(e: CustomEvent<string>): void {
    this._error = e.detail;
  }

  override render(): TemplateResult {
    if (!this._config) {
      return html`<div class="wrap">
        <div class="empty">${this._error ?? "Loading…"}</div>
      </div>`;
    }
    const config = this._config;
    return html`<div
      class="wrap"
      @config-changed=${this._onConfigChanged}
      @panel-error=${this._onError}
    >
      <header>
        <h1>Adaptive Lighting</h1>
        <span class="pill ${config.enabled ? "" : "off"}">
          ${config.enabled ? "Active" : "Paused"}
        </span>
        <span class="spacer"></span>
        <button class="btn ghost" @click=${this._applyNow}>Apply now</button>
      </header>

      ${this._error
        ? html`<div class="card error">${this._error}</div>`
        : nothing}

      <ha-adapt-schemas-tab
        .config=${config}
        .api=${this._api!}
      ></ha-adapt-schemas-tab>

      <details class="settings-fold">
        <summary>Global settings</summary>
        <ha-adapt-settings-tab
          .config=${config}
          .api=${this._api!}
        ></ha-adapt-settings-tab>
      </details>
    </div>`;
  }

  private async _applyNow(): Promise<void> {
    try {
      this._config = await this._api!.apply();
    } catch (err) {
      this._error = String(err);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-panel": HaAdaptPanel;
  }
}
