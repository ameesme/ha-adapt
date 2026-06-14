import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { HaAdaptApi } from "./api";
import { baseStyles, tokenStyles } from "./theme";
import type { ConfigPayload, HomeAssistant } from "./types";

import "./components/lights-tab";
import "./components/schemas-tab";
import "./components/settings-tab";

type Tab = "lights" | "schemas" | "settings";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "lights", label: "Lights" },
  { id: "schemas", label: "Schemas" },
  { id: "settings", label: "Settings" },
];

// The panel is a thin shell: it owns the API + config state and renders the
// active tab. Tabs report changes via bubbling `config-changed`/`panel-error`
// events, keeping all data flow in one place.
@customElement("ha-adapt-panel")
export class HaAdaptPanel extends LitElement {
  static override styles = [
    tokenStyles,
    baseStyles,
    css`
      .wrap {
        max-width: 920px;
        margin: 0 auto;
        padding: 24px 20px 64px;
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
      nav.tabs {
        display: flex;
        gap: 6px;
        margin-bottom: 22px;
        border-bottom: 2px solid var(--border);
      }
      nav.tabs button {
        border: none;
        background: none;
        padding: 10px 16px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-soft);
        cursor: pointer;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
      }
      nav.tabs button.active {
        color: var(--accent-strong);
        border-bottom-color: var(--accent);
      }
      .error {
        border-color: var(--danger);
        color: var(--danger);
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) narrow = false;

  @state() private _config?: ConfigPayload;
  @state() private _tab: Tab = "lights";
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

      <nav class="tabs">
        ${TABS.map(
          (tab) => html`<button
            class=${this._tab === tab.id ? "active" : ""}
            @click=${() => (this._tab = tab.id)}
          >
            ${tab.label}
          </button>`
        )}
      </nav>

      ${this._renderTab(config)}
    </div>`;
  }

  private _renderTab(config: ConfigPayload): TemplateResult {
    switch (this._tab) {
      case "schemas":
        return html`<ha-adapt-schemas-tab
          .config=${config}
          .api=${this._api!}
        ></ha-adapt-schemas-tab>`;
      case "settings":
        return html`<ha-adapt-settings-tab
          .config=${config}
          .api=${this._api!}
        ></ha-adapt-settings-tab>`;
      default:
        return html`<ha-adapt-lights-tab
          .config=${config}
          .api=${this._api!}
        ></ha-adapt-lights-tab>`;
    }
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
