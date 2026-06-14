import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../theme";
import type { LightInfo, TimelineCell, TimelineData } from "../types";
import { HOURS, hourLabel, kelvinToCss } from "../utils";

export interface CellRef {
  entityId: string;
  hour: number;
}

// Renders the 24-hour grid: a read-only sun row plus one clickable row per
// light. Emits `select-cell` (CellRef) and `select-light` (entity id).
@customElement("ha-adapt-timeline-grid")
export class TimelineGrid extends LitElement {
  static override styles = [
    baseStyles,
    css`
      .scroll {
        overflow-x: auto;
        padding-bottom: 6px;
      }
      .grid {
        display: grid;
        grid-auto-rows: minmax(0, auto);
        gap: 2px;
      }
      .gridrow {
        display: grid;
        grid-template-columns: 130px repeat(24, 30px);
        gap: 2px;
        align-items: center;
      }
      .label {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 6px;
      }
      .label.clickable {
        cursor: pointer;
      }
      .hourhead {
        font-size: 0.7rem;
        text-align: center;
        color: var(--text-soft);
      }
      .hourhead.now {
        color: var(--accent-strong);
        font-weight: 700;
      }
      .cell {
        position: relative;
        height: 42px;
        border-radius: 4px;
        background: var(--surface-alt);
        overflow: hidden;
        cursor: pointer;
        border: 1px solid var(--border);
      }
      .cell.readonly {
        cursor: default;
      }
      .cell .fill {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .cell.explicit {
        border-color: var(--accent-strong);
        box-shadow: inset 0 0 0 1px var(--accent-strong);
      }
      .cell.selected {
        outline: 2px solid var(--accent-strong);
        outline-offset: 1px;
      }
      .cell.now {
        border-bottom: 3px solid var(--accent);
      }
    `,
  ];

  @property({ attribute: false }) lights: LightInfo[] = [];
  @property({ attribute: false }) timeline?: TimelineData;
  @property({ attribute: false }) selected: CellRef | null = null;
  @property({ type: Number }) previewHour = 12;

  override render(): TemplateResult {
    if (!this.timeline) {
      return html`<div class="card"><div class="empty">Loading timeline…</div></div>`;
    }
    const nowHour = Math.floor(this.previewHour) % 24;
    return html`<div class="card">
      <div class="scroll">
        <div class="grid">
          ${this._headerRow(nowHour)}
          ${this._sunRow(nowHour)}
          ${this.lights.map((light) => this._lightRow(light, nowHour))}
        </div>
      </div>
    </div>`;
  }

  private _headerRow(nowHour: number): TemplateResult {
    return html`<div class="gridrow">
      <div class="label"></div>
      ${HOURS.map(
        (h) => html`<div class="hourhead ${h === nowHour ? "now" : ""}">
          ${hourLabel(h)}
        </div>`
      )}
    </div>`;
  }

  private _sunRow(nowHour: number): TemplateResult {
    const row = this.timeline!.sun;
    return html`<div class="gridrow">
      <div class="label">☀️ Sun</div>
      ${HOURS.map((h) =>
        this._cell(row[h], h === nowHour, "readonly", false, false)
      )}
    </div>`;
  }

  private _lightRow(light: LightInfo, nowHour: number): TemplateResult {
    const row = this.timeline!.lights[light.entity_id] ?? [];
    return html`<div class="gridrow">
      <div
        class="label clickable"
        title="Edit light range"
        @click=${() => this._emit("select-light", light.entity_id)}
      >
        ${light.name}
      </div>
      ${HOURS.map((h) => {
        const cell = row[h];
        const selected =
          this.selected?.entityId === light.entity_id &&
          this.selected?.hour === h;
        return this._cell(
          cell,
          h === nowHour,
          "",
          Boolean(cell?.explicit),
          selected,
          () => this._emit("select-cell", { entityId: light.entity_id, hour: h })
        );
      })}
    </div>`;
  }

  private _cell(
    cell: TimelineCell | { brightness: number; color_temp: number } | undefined,
    isNow: boolean,
    extra: string,
    explicit: boolean,
    selected: boolean,
    onClick?: () => void
  ): TemplateResult {
    const brightness = cell ? cell.brightness : 0;
    const color = cell ? kelvinToCss(cell.color_temp) : "transparent";
    const classes = [
      "cell",
      extra,
      explicit ? "explicit" : "",
      selected ? "selected" : "",
      isNow ? "now" : "",
    ].join(" ");
    return html`<div
      class=${classes}
      @click=${onClick}
      title=${cell ? `${cell.brightness}% · ${cell.color_temp} K` : ""}
    >
      <div
        class="fill"
        style="height:${brightness}%;background:${color}"
      ></div>
    </div>`;
  }

  private _emit(type: string, detail: unknown): void {
    this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-timeline-grid": TimelineGrid;
  }
}
