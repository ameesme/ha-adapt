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
import { checkboxField, numberField } from "../form-fields";
import { baseStyles } from "../theme";
import type {
  ConfigPayload,
  HourCell,
  LightConfig,
  LightInfo,
  Schema,
  SunConfig,
  TimelineData,
} from "../types";
import { defaultLightConfig } from "../utils";
import type { CellRef } from "./timeline-grid";
import "./timeline-grid";
import "./sun-config";

// Edits one schema: name, sun, the 24-hour timeline, and the contextual cell /
// light editors. Persists through the api and bubbles `config-changed`; emits
// `schema-delete` for the parent to handle selection.
@customElement("ha-adapt-schema-editor")
export class SchemaEditor extends LitElement {
  static override styles = [
    baseStyles,
    css`
      .toolbar {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      .scrubber {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .scrubber input[type="range"] {
        flex: 1;
        accent-color: var(--accent);
      }
      .clock {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        color: var(--accent-strong);
        min-width: 52px;
      }
    `,
  ];

  @property({ attribute: false }) schema!: Schema;
  @property({ attribute: false }) lights: LightInfo[] = [];
  @property({ attribute: false }) api!: HaAdaptApi;
  @property({ type: Boolean }) active = false;

  @state() private _draft!: Schema;
  @state() private _timeline?: TimelineData;
  @state() private _selectedCell: CellRef | null = null;
  @state() private _selectedLight: string | null = null;
  @state() private _previewHour = 12;
  @state() private _livePreview = false;

  private _previewTimer?: number;

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("schema") && this._draft?.id !== this.schema.id) {
      this._draft = structuredClone(this.schema);
      this._selectedCell = null;
      this._selectedLight = null;
      void this._loadTimeline();
    }
  }

  private async _loadTimeline(): Promise<void> {
    try {
      this._timeline = await this.api.timeline(this._draft.id);
    } catch {
      this._timeline = undefined;
    }
  }

  // --- persistence ---------------------------------------------------------

  private async _saveAndRefresh(): Promise<void> {
    try {
      const config = await this.api.saveSchema(this._draft);
      this.dispatchEvent(
        new CustomEvent<ConfigPayload>("config-changed", {
          detail: config,
          bubbles: true,
          composed: true,
        })
      );
      await this._loadTimeline();
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

  private _lightCfg(entityId: string): LightConfig {
    return this._draft.lights[entityId] ?? defaultLightConfig();
  }

  private _patchLight(entityId: string, patch: Partial<LightConfig>): void {
    const next = { ...this._lightCfg(entityId), ...patch };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [entityId]: next },
    };
    void this._saveAndRefresh();
  }

  // --- render --------------------------------------------------------------

  override render(): TemplateResult {
    return html`
      <div class="card">
        <div class="toolbar">
          <input
            type="text"
            style="max-width:260px"
            .value=${this._draft.name}
            @change=${(e: Event) =>
              this._patchSchema({
                name: (e.target as HTMLInputElement).value,
              })}
          />
          ${this.active
            ? html`<span class="badge">Active</span>`
            : html`<button
                class="btn ghost"
                @click=${() => void this._setActive()}
              >
                Set active
              </button>`}
          <span class="grow"></span>
          ${this._draft.id !== "default"
            ? html`<button class="btn danger" @click=${this._delete}>
                Delete
              </button>`
            : nothing}
        </div>
      </div>

      <ha-adapt-sun-config
        .sun=${this._draft.sun}
        @sun-changed=${(e: CustomEvent<SunConfig>) =>
          this._patchSchema({ sun: e.detail })}
      ></ha-adapt-sun-config>

      <ha-adapt-timeline-grid
        .lights=${this.lights}
        .timeline=${this._timeline}
        .selected=${this._selectedCell}
        .previewHour=${this._previewHour}
        @select-cell=${(e: CustomEvent<CellRef>) => {
          this._selectedCell = e.detail;
          this._selectedLight = null;
        }}
        @select-light=${(e: CustomEvent<string>) => {
          this._selectedLight = e.detail;
          this._selectedCell = null;
        }}
      ></ha-adapt-timeline-grid>

      ${this._renderScrubber()}
      ${this._selectedCell ? this._renderCellEditor() : nothing}
      ${this._selectedLight ? this._renderLightEditor() : nothing}
    `;
  }

  private _renderScrubber(): TemplateResult {
    const h = Math.floor(this._previewHour);
    const m = Math.round((this._previewHour - h) * 60);
    const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return html`<div class="card">
      <div class="scrubber">
        <span class="clock">${label}</span>
        <input
          type="range"
          min="0"
          max="23.5"
          step="0.5"
          .value=${String(this._previewHour)}
          @input=${(e: Event) =>
            this._onScrub(Number((e.target as HTMLInputElement).value))}
        />
        ${checkboxField("Live preview to lights", this._livePreview, (v) => {
          this._livePreview = v;
          if (v) this._sendPreview();
        })}
      </div>
      <p class="muted">
        Drag to step through the day. With live preview on, the lights that are
        currently on follow the slider.
      </p>
    </div>`;
  }

  private _renderCellEditor(): TemplateResult {
    const ref = this._selectedCell!;
    const light = this.lights.find((l) => l.entity_id === ref.entityId);
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
          : "Currently following the sun — set a value to override."}
      </p>
      <div class="grid">
        ${numberField("Brightness %", brightness, (v) =>
          this._setCell(ref, { brightness: v, color_temp: colorTemp })
        )}
        ${numberField("Color temp K", colorTemp, (v) =>
          this._setCell(ref, { brightness, color_temp: v })
        )}
      </div>
      <div class="actions">
        ${explicit
          ? html`<button
              class="btn ghost"
              @click=${() => this._setCell(ref, null)}
            >
              Use sun (clear)
            </button>`
          : nothing}
        <button class="btn ghost" @click=${() => (this._selectedCell = null)}>
          Close
        </button>
      </div>
    </div>`;
  }

  private _renderLightEditor(): TemplateResult {
    const entityId = this._selectedLight!;
    const light = this.lights.find((l) => l.entity_id === entityId);
    const cfg = this._lightCfg(entityId);
    return html`<div class="card">
      <h2>${light?.name ?? entityId} · range</h2>
      <div class="grid">
        ${numberField("Min brightness %", cfg.min_brightness, (v) =>
          this._patchLight(entityId, { min_brightness: v })
        )}
        ${numberField("Max brightness %", cfg.max_brightness, (v) =>
          this._patchLight(entityId, { max_brightness: v })
        )}
        ${numberField("Min color temp K", cfg.min_color_temp, (v) =>
          this._patchLight(entityId, { min_color_temp: v })
        )}
        ${numberField("Max color temp K", cfg.max_color_temp, (v) =>
          this._patchLight(entityId, { max_color_temp: v })
        )}
      </div>
      <div class="actions">
        ${checkboxField(
          "Split commands (IKEA)",
          cfg.separate_turn_on_commands,
          (v) => this._patchLight(entityId, { separate_turn_on_commands: v })
        )}
        <span class="grow"></span>
        <button class="btn ghost" @click=${() => (this._selectedLight = null)}>
          Close
        </button>
      </div>
    </div>`;
  }

  // --- actions -------------------------------------------------------------

  private _patchSchema(patch: Partial<Schema>): void {
    this._draft = { ...this._draft, ...patch };
    void this._saveAndRefresh();
  }

  private _setCell(ref: CellRef, cell: HourCell): void {
    const cfg = this._lightCfg(ref.entityId);
    const hours = [...cfg.hours];
    hours[ref.hour] = cell;
    this._patchLight(ref.entityId, { hours });
  }

  private async _setActive(): Promise<void> {
    try {
      const config = await this.api.setActiveSchema(this._draft.id);
      this.dispatchEvent(
        new CustomEvent<ConfigPayload>("config-changed", {
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

  private _delete = (): void => {
    this.dispatchEvent(
      new CustomEvent("schema-delete", {
        detail: this._draft.id,
        bubbles: true,
        composed: true,
      })
    );
  };

  private _onScrub(hour: number): void {
    this._previewHour = hour;
    if (this._livePreview) this._sendPreview();
  }

  private _sendPreview(): void {
    window.clearTimeout(this._previewTimer);
    this._previewTimer = window.setTimeout(() => {
      void this.api.preview(this._draft.id, this._previewHour, true);
    }, 150);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-schema-editor": SchemaEditor;
  }
}
