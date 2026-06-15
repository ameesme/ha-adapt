import {
  LitElement,
  html,
  css,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HaAdaptApi } from "../api";
import { checkboxField, rangeField } from "../form-fields";
import { baseStyles } from "../theme";
import type {
  ConfigPayload,
  HourCell,
  LightConfig,
  Schema,
  SunConfig,
  TimelineData,
} from "../types";
import { KELVIN_MAX, KELVIN_MIN, defaultLightConfig } from "../utils";
import type { CellRef } from "./timeline-grid";
import "./timeline-grid";
import "./sun-config";
import "./settings-tab";

type Selection =
  | { kind: "cell"; ref: CellRef }
  | { kind: "light"; entityId: string }
  | { kind: "sun" }
  | null;

// Edits one schema: an inline editable name, the 24-hour timeline on the left,
// and a right-hand side panel that shows the editor for whatever is selected
// (the sun, a light, or an hour cell) plus the global settings.
@customElement("ha-adapt-schema-editor")
export class SchemaEditor extends LitElement {
  static override styles = [
    baseStyles,
    css`
      .head {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      input.name {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text);
        border: none;
        border-bottom: 2px solid var(--border);
        background: transparent;
        border-radius: 0;
        padding: 4px 2px;
        width: 100%;
        max-width: 360px;
      }
      input.name:focus {
        outline: none;
        border-bottom-color: var(--accent);
      }
      .head-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 340px;
        gap: 16px;
        align-items: start;
      }
      .side {
        position: sticky;
        top: 14px;
        display: flex;
        flex-direction: column;
      }
      @media (max-width: 960px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .side {
          position: static;
        }
      }
    `,
  ];

  @property({ attribute: false }) schema!: Schema;
  @property({ attribute: false }) config!: ConfigPayload;
  @property({ attribute: false }) api!: HaAdaptApi;

  @state() private _draft!: Schema;
  @state() private _timeline?: TimelineData;
  @state() private _sel: Selection = null;
  @state() private _previewHour = 12;
  @state() private _livePreview = false;

  private _previewTimer?: number;
  private _saveTimer?: number;

  private get _active(): boolean {
    return this.schema.id === this.config.active_schema_id;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("schema") && this._draft?.id !== this.schema.id) {
      this._flushSave();
      this._draft = structuredClone(this.schema);
      this._sel = null;
      void this._loadTimeline();
    }
  }

  override disconnectedCallback(): void {
    this._flushSave();
    super.disconnectedCallback();
  }

  private async _loadTimeline(): Promise<void> {
    try {
      this._timeline = await this.api.timeline(this._draft.id);
    } catch {
      this._timeline = undefined;
    }
  }

  // --- persistence ---------------------------------------------------------

  private _scheduleSave(): void {
    window.clearTimeout(this._saveTimer);
    this._saveTimer = window.setTimeout(() => {
      this._saveTimer = undefined;
      void this._saveAndRefresh();
    }, 400);
  }

  private _flushSave(): void {
    if (this._saveTimer !== undefined) {
      window.clearTimeout(this._saveTimer);
      this._saveTimer = undefined;
      void this._saveAndRefresh();
    }
  }

  private async _saveAndRefresh(): Promise<void> {
    try {
      const config = await this.api.saveSchema(this._draft);
      this._emit("config-changed", config);
      await this._loadTimeline();
    } catch (err) {
      this._emit("panel-error", String(err));
    }
  }

  private _lightCfg(entityId: string): LightConfig {
    return this._draft.lights[entityId] ?? defaultLightConfig();
  }

  private _patchSchema(patch: Partial<Schema>): void {
    this._draft = { ...this._draft, ...patch };
    this._scheduleSave();
  }

  private _patchLight(entityId: string, patch: Partial<LightConfig>): void {
    const next = { ...this._lightCfg(entityId), ...patch };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [entityId]: next },
    };
    this._scheduleSave();
  }

  private _setCell(ref: CellRef, cell: HourCell): void {
    const cfg = this._lightCfg(ref.entityId);
    const hours = [...cfg.hours];
    hours[ref.hour] = cell;
    this._patchLight(ref.entityId, { hours });
  }

  // --- render --------------------------------------------------------------

  override render(): TemplateResult {
    return html`
      <div class="head">
        <input
          class="name"
          .value=${this._draft.name}
          @input=${(e: Event) =>
            this._patchSchema({ name: (e.target as HTMLInputElement).value })}
        />
        <div class="head-actions">
          ${this._active
            ? html`<span class="badge">Active</span>`
            : html`<button class="btn ghost" @click=${this._setActive}>
                Set active
              </button>`}
          ${this._draft.id !== "default"
            ? html`<button class="btn danger" @click=${this._delete}>
                Delete
              </button>`
            : nothing}
        </div>
      </div>

      <div class="layout">
        <div class="main">
          <ha-adapt-timeline-grid
            .lights=${this.config.lights}
            .timeline=${this._timeline}
            .selected=${this._sel?.kind === "cell" ? this._sel.ref : null}
            .previewHour=${this._previewHour}
            .live=${this._livePreview}
            @select-cell=${(e: CustomEvent<CellRef>) =>
              (this._sel = { kind: "cell", ref: e.detail })}
            @select-light=${(e: CustomEvent<string>) =>
              (this._sel = { kind: "light", entityId: e.detail })}
            @select-sun=${() => (this._sel = { kind: "sun" })}
            @scrub=${(e: CustomEvent<number>) => this._onScrub(e.detail)}
            @live-toggle=${(e: CustomEvent<boolean>) =>
              this._onLiveToggle(e.detail)}
          ></ha-adapt-timeline-grid>
        </div>

        <div class="side">
          ${this._renderContext()}
          <ha-adapt-settings-tab
            .config=${this.config}
            .api=${this.api}
          ></ha-adapt-settings-tab>
        </div>
      </div>
    `;
  }

  private _renderContext(): TemplateResult {
    const sel = this._sel;
    if (sel?.kind === "sun") {
      return html`<ha-adapt-sun-config
        .sun=${this._draft.sun}
        @sun-changed=${(e: CustomEvent<SunConfig>) =>
          this._patchSchema({ sun: e.detail })}
      ></ha-adapt-sun-config>`;
    }
    if (sel?.kind === "light") return this._renderLightEditor(sel.entityId);
    if (sel?.kind === "cell") return this._renderCellEditor(sel.ref);
    return html`<div class="card">
      <div class="empty">
        Click the ☀️ sun row, a light, or an hour cell to edit it here.
      </div>
    </div>`;
  }

  private _renderCellEditor(ref: CellRef): TemplateResult {
    const light = this.config.lights.find((l) => l.entity_id === ref.entityId);
    const explicit = this._lightCfg(ref.entityId).hours[ref.hour];
    const effective = this._timeline?.lights[ref.entityId]?.[ref.hour];
    const brightness = explicit?.brightness ?? effective?.brightness ?? 50;
    const colorTemp = explicit?.color_temp ?? effective?.color_temp ?? 3000;
    return html`<div class="card">
      <h2>
        ${light?.name ?? ref.entityId} · ${String(ref.hour).padStart(2, "0")}:00
      </h2>
      <p class="muted">
        ${explicit
          ? "Explicit override for this hour."
          : "Following the sun — set a value to override."}
      </p>
      ${rangeField("Brightness", brightness, 1, 100, 1, "%", (v) =>
        this._setCell(ref, { brightness: v, color_temp: colorTemp })
      )}
      ${rangeField("Color temp", colorTemp, KELVIN_MIN, KELVIN_MAX, 50, "K", (v) =>
        this._setCell(ref, { brightness, color_temp: v })
      )}
      <div class="actions">
        ${explicit
          ? html`<button class="btn ghost" @click=${() => this._setCell(ref, null)}>
              Use sun (clear)
            </button>`
          : nothing}
        <button class="btn ghost" @click=${() => (this._sel = null)}>Close</button>
      </div>
    </div>`;
  }

  private _renderLightEditor(entityId: string): TemplateResult {
    const light = this.config.lights.find((l) => l.entity_id === entityId);
    const cfg = this._lightCfg(entityId);
    return html`<div class="card">
      <h2>${light?.name ?? entityId}</h2>
      ${rangeField("Min brightness", cfg.min_brightness, 1, 100, 1, "%", (v) =>
        this._patchLight(entityId, { min_brightness: v })
      )}
      ${rangeField("Max brightness", cfg.max_brightness, 1, 100, 1, "%", (v) =>
        this._patchLight(entityId, { max_brightness: v })
      )}
      ${rangeField(
        "Min color temp",
        cfg.min_color_temp,
        KELVIN_MIN,
        KELVIN_MAX,
        50,
        "K",
        (v) => this._patchLight(entityId, { min_color_temp: v })
      )}
      ${rangeField(
        "Max color temp",
        cfg.max_color_temp,
        KELVIN_MIN,
        KELVIN_MAX,
        50,
        "K",
        (v) => this._patchLight(entityId, { max_color_temp: v })
      )}
      <div class="actions">
        ${checkboxField(
          "Split commands (IKEA)",
          cfg.separate_turn_on_commands,
          (v) => this._patchLight(entityId, { separate_turn_on_commands: v })
        )}
        <span class="grow"></span>
        <button class="btn ghost" @click=${() => (this._sel = null)}>Close</button>
      </div>
    </div>`;
  }

  // --- actions -------------------------------------------------------------

  private _setActive = (): void => {
    void this.api
      .setActiveSchema(this._draft.id)
      .then((config) => this._emit("config-changed", config))
      .catch((err) => this._emit("panel-error", String(err)));
  };

  private _delete = (): void => {
    this._emit("schema-delete", this._draft.id);
  };

  private _onScrub(hour: number): void {
    this._previewHour = hour;
    if (this._livePreview) this._sendPreview();
  }

  private _onLiveToggle(live: boolean): void {
    this._livePreview = live;
    if (live) {
      this._sendPreview();
    } else {
      void this.api.apply();
    }
  }

  private _sendPreview(): void {
    window.clearTimeout(this._previewTimer);
    this._previewTimer = window.setTimeout(() => {
      void this.api.preview(this._draft.id, this._previewHour, true);
    }, 150);
  }

  private _emit(type: string, detail: unknown): void {
    this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-schema-editor": SchemaEditor;
  }
}
