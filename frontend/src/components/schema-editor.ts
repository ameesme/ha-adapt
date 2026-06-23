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
import {
  KELVIN_MAX,
  KELVIN_MIN,
  currentHour,
  defaultLightConfig,
  hexToRgb,
  rgbToHex,
} from "../utils";
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
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      .app-title {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0;
      }
      input.name {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text);
        border: none;
        border-bottom: 2px solid var(--border);
        background: transparent;
        border-radius: 0;
        padding: 4px 2px;
        min-width: 0;
        flex: 0 1 260px;
      }
      input.name:focus {
        outline: none;
        border-bottom-color: var(--accent);
      }
      .switcher {
        position: relative;
        display: inline-flex;
        align-items: center;
        color: var(--text-soft);
      }
      .switcher .chev {
        width: 18px;
        height: 18px;
        pointer-events: none;
      }
      .switcher select {
        position: absolute;
        inset: 0;
        width: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .grow {
        flex: 1;
      }
      input[type="color"] {
        width: 52px;
        height: 34px;
        padding: 2px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
        cursor: pointer;
      }
      @media (max-width: 960px) {
        .app-title {
          display: none;
        }
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 340px;
        gap: 16px;
        align-items: stretch;
      }
      /* Let both columns shrink below their content so the timeline scrolls
         internally instead of overflowing the viewport. */
      .main,
      .side {
        min-width: 0;
      }
      /* The side holds global settings flat by default; when something is
         selected it becomes a temporary editing card. */
      .side {
        position: relative;
        align-self: stretch;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .side.editing {
        background: var(--surface);
        border: 1px solid var(--accent);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 18px;
      }
      .side h2 {
        margin: 0 0 4px;
        font-size: 1.05rem;
        font-weight: 650;
        padding-right: 28px;
      }
      .close {
        position: absolute;
        top: 12px;
        right: 12px;
        border: none;
        background: transparent;
        color: var(--text-soft);
        font-size: 1.1rem;
        line-height: 1;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
      }
      .close:hover {
        color: var(--accent-strong);
        background: var(--accent-soft);
      }
      @media (max-width: 960px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
        /* Flatten the editing card on mobile (no second horizontal padding). */
        .side.editing {
          padding-left: 0;
          padding-right: 0;
          border: none;
          border-radius: 0;
          box-shadow: none;
          background: transparent;
        }
      }
    `,
  ];

  @property({ attribute: false }) schema!: Schema;
  @property({ attribute: false }) config!: ConfigPayload;
  @property({ attribute: false }) api!: HaAdaptApi;
  @property({ type: Boolean }) preview = false;

  @state() private _draft!: Schema;
  @state() private _timeline?: TimelineData;
  @state() private _sel: Selection = null;
  @state() private _previewHour = currentHour();

  private _previewTimer?: number;
  private _saveTimer?: number;
  private _timelineTimer?: number;

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
    // React to the preview toggle (driven from the header or the timeline).
    if (changed.has("preview") && changed.get("preview") !== undefined) {
      if (this.preview) this._sendPreview();
      else void this.api.apply();
    }
  }

  override disconnectedCallback(): void {
    this._flushSave();
    super.disconnectedCallback();
  }

  // Render/preview the *draft* (unsaved) schema so edits are visible live.
  private async _loadTimeline(): Promise<void> {
    try {
      this._timeline = await this.api.timeline(this._draft);
    } catch {
      this._timeline = undefined;
    }
  }

  // Called after every edit: fast visual refresh + live preview, with a
  // slower debounce for the actual save.
  private _afterEdit(): void {
    this._scheduleSave();
    this._scheduleTimeline();
    if (this.preview) this._sendPreview();
  }

  private _scheduleTimeline(): void {
    window.clearTimeout(this._timelineTimer);
    this._timelineTimer = window.setTimeout(() => void this._loadTimeline(), 120);
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
    } catch (err) {
      this._emit("panel-error", String(err));
    }
  }

  private _lightCfg(entityId: string): LightConfig {
    return this._draft.lights[entityId] ?? defaultLightConfig();
  }

  private _patchSchema(patch: Partial<Schema>): void {
    this._draft = { ...this._draft, ...patch };
    this._afterEdit();
  }

  private _patchLight(entityId: string, patch: Partial<LightConfig>): void {
    const next = { ...this._lightCfg(entityId), ...patch };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [entityId]: next },
    };
    this._afterEdit();
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
        <h1 class="app-title">Adaptive Lighting</h1>
        <input
          class="name"
          .value=${this._draft.name}
          @input=${(e: Event) =>
            this._patchSchema({ name: (e.target as HTMLInputElement).value })}
        />
        <div class="switcher" title="Switch schema">
          <svg class="chev" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M8 10l4-4 4 4M8 14l4 4 4-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <select
            @change=${(e: Event) =>
              this._emit("schema-select", (e.target as HTMLSelectElement).value)}
          >
            ${Object.values(this.config.schemas).map(
              (s) => html`<option
                value=${s.id}
                ?selected=${s.id === this.schema.id}
              >
                ${s.name}${s.id === this.config.active_schema_id
                  ? " (active)"
                  : ""}
              </option>`
            )}
          </select>
        </div>
        <span class="grow"></span>
        <button class="btn ghost" @click=${() => this._emit("schema-new", null)}>
          + New
        </button>
        <button
          class="btn ${this.preview ? "" : "ghost"}"
          @click=${() => this._emit("preview-toggle", !this.preview)}
        >
          Preview
        </button>
        ${this._active
          ? nothing
          : html`<button class="btn ghost" @click=${this._setActive}>
              Set active
            </button>`}
        ${this._draft.id !== "default"
          ? html`<button class="btn danger" @click=${this._delete}>Delete</button>`
          : nothing}
      </div>

      <div class="layout">
        <div class="main">
          <ha-adapt-timeline-grid
            .lights=${this.config.lights}
            .timeline=${this._timeline}
            .selected=${this._sel?.kind === "cell" ? this._sel.ref : null}
            .selectedRow=${this._selectedRow}
            .previewHour=${this._previewHour}
            @select-cell=${(e: CustomEvent<CellRef>) => this._onSelectCell(e.detail)}
            @select-light=${(e: CustomEvent<string>) =>
              (this._sel = { kind: "light", entityId: e.detail })}
            @select-sun=${() => (this._sel = { kind: "sun" })}
            @scrub=${(e: CustomEvent<number>) => this._onScrub(e.detail)}
          ></ha-adapt-timeline-grid>
        </div>

        <div class="side ${this._sel ? "editing" : ""}">
          ${this._sel
            ? html`<button
                class="close"
                title="Close"
                @click=${() => (this._sel = null)}
              >
                ✕
              </button>`
            : nothing}
          ${this._renderContext()}
        </div>
      </div>
    `;
  }

  private get _selectedRow(): string | null {
    const sel = this._sel;
    if (!sel) return null;
    if (sel.kind === "sun") return "sun";
    if (sel.kind === "light") return sel.entityId;
    return sel.ref.entityId;
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
    return html`<h2>Global settings</h2>
      <ha-adapt-settings-tab
        .config=${this.config}
        .api=${this.api}
      ></ha-adapt-settings-tab>`;
  }

  private _renderCellEditor(ref: CellRef): TemplateResult {
    const light = this.config.lights.find((l) => l.entity_id === ref.entityId);
    const explicit = this._lightCfg(ref.entityId).hours[ref.hour];
    const effective = this._timeline?.lights[ref.entityId]?.[ref.hour];
    const brightness = explicit?.brightness ?? effective?.brightness ?? 50;
    const colorTemp = explicit?.color_temp ?? effective?.color_temp ?? 3000;
    const rgb = explicit?.rgb_color ?? null;
    const setCell = (patch: Partial<NonNullable<HourCell>>) =>
      this._setCell(ref, {
        brightness,
        color_temp: colorTemp,
        rgb_color: rgb,
        ...patch,
      });
    return html`
      <h2>
        ${light?.name ?? ref.entityId} · ${String(ref.hour).padStart(2, "0")}:00
      </h2>
      <p class="muted">
        ${explicit
          ? "Explicit override for this hour."
          : "Following the sun — set a value to override."}
      </p>
      ${rangeField("Brightness", brightness, 0, 100, 1, "%", (v) =>
        setCell({ brightness: v })
      )}
      ${rangeField("Color temp", colorTemp, KELVIN_MIN, KELVIN_MAX, 50, "K", (v) =>
        setCell({ color_temp: v })
      )}
      ${light?.supports_rgb
        ? html`<label class="toggle">
              <input
                type="checkbox"
                .checked=${rgb !== null}
                @change=${(e: Event) =>
                  setCell({
                    rgb_color: (e.target as HTMLInputElement).checked
                      ? rgb ?? [255, 255, 255]
                      : null,
                  })}
              />
              RGB colour (overrides temp)
            </label>
            ${rgb !== null
              ? html`<input
                  type="color"
                  .value=${rgbToHex(rgb)}
                  @input=${(e: Event) =>
                    setCell({
                      rgb_color: hexToRgb((e.target as HTMLInputElement).value),
                    })}
                />`
              : nothing}`
        : nothing}
      ${explicit
        ? html`<div class="actions">
            <button class="btn ghost" @click=${() => this._setCell(ref, null)}>
              Use sun (clear)
            </button>
          </div>`
        : nothing}
    `;
  }

  private _renderLightEditor(entityId: string): TemplateResult {
    const light = this.config.lights.find((l) => l.entity_id === entityId);
    const cfg = this._lightCfg(entityId);
    return html`
      <h2>${light?.name ?? entityId}</h2>
      ${rangeField("Min brightness", cfg.min_brightness, 0, 100, 1, "%", (v) =>
        this._patchLight(entityId, { min_brightness: v })
      )}
      ${rangeField("Max brightness", cfg.max_brightness, 0, 100, 1, "%", (v) =>
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
      </div>
    `;
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
    if (this.preview) this._sendPreview();
  }

  // Selecting an hour cell opens its editor and moves the playhead/preview to
  // that hour.
  private _onSelectCell(ref: CellRef): void {
    this._sel = { kind: "cell", ref };
    this._previewHour = ref.hour;
    if (this.preview) this._sendPreview();
  }

  private _sendPreview(): void {
    window.clearTimeout(this._previewTimer);
    this._previewTimer = window.setTimeout(() => {
      void this.api.preview(this._draft, this._previewHour, true);
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
