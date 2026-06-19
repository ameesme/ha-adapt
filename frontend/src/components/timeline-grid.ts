import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../theme";
import type { LightInfo, TimelineCell, TimelineData } from "../types";
import { HOURS, hourLabel, kelvinToCss } from "../utils";

export interface CellRef {
  entityId: string;
  hour: number;
}

type GridCell = TimelineCell | { brightness: number; color_temp: number };

// The 24-hour grid: an integrated time scrubber, an hour header, a distinct
// sun row, and one clickable row per light. Row labels stay pinned while the
// columns scroll horizontally. Emits `select-cell`, `select-light`, `scrub`,
// and `live-toggle`.
@customElement("ha-adapt-timeline-grid")
export class TimelineGrid extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }
      .card {
        height: 100%;
        box-sizing: border-box;
      }
      .scroll {
        overflow-x: auto;
        max-width: 100%;
        padding-bottom: 6px;
      }
      .rows {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: max-content;
      }
      .gridrow {
        display: grid;
        grid-template-columns: 140px repeat(24, 30px);
        gap: 2px;
        align-items: center;
      }
      .label {
        position: sticky;
        left: 0;
        z-index: 3;
        align-self: stretch;
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--surface);
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        padding: 0 12px;
        box-shadow: 1px 0 0 var(--border);
      }
      .label.clickable {
        cursor: pointer;
      }
      .label .lname {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .label .cog {
        width: 14px;
        height: 14px;
        flex: none;
        margin-left: auto;
        opacity: 0.4;
      }
      .label.clickable:hover .cog {
        opacity: 0.9;
      }
      .sunrow .label {
        color: var(--accent-strong);
      }
      .gridrow.rowselected .label {
        background: var(--accent-soft);
        color: var(--accent-strong);
      }
      .label.section-label {
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.68rem;
        font-weight: 700;
        color: var(--text-soft);
        padding-top: 8px;
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
      .scrubrow .track {
        grid-column: 2 / -1;
        display: flex;
        align-items: center;
      }
      .scrubrow input[type="range"] {
        width: 100%;
      }
      .clock {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        color: var(--accent-strong);
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
      @media (max-width: 960px) {
        .card {
          padding: 0;
        }
        /* Match the page background (the card is flat on mobile) so the sticky
           labels and the right-side scroll cutoff blend in. */
        .label {
          background: var(--bg);
          padding: 0 6px;
        }
      }
    `,
  ];

  @property({ attribute: false }) lights: LightInfo[] = [];
  @property({ attribute: false }) timeline?: TimelineData;
  @property({ attribute: false }) selected: CellRef | null = null;
  // "sun" or an entity_id — the row to highlight as selected.
  @property({ attribute: false }) selectedRow: string | null = null;
  @property({ type: Number }) previewHour = 12;

  override render(): TemplateResult {
    if (!this.timeline) {
      return html`<div class="card"><div class="empty">Loading timeline…</div></div>`;
    }
    const nowHour = Math.floor(this.previewHour) % 24;
    return html`<div class="card">
      <div class="scroll">
        <div class="rows">
          ${this._scrubRow()}
          ${this._headerRow(nowHour)}
          ${this._sunRow(nowHour)}
          <div class="gridrow">
            <div class="label section-label">Lights</div>
          </div>
          ${this.lights.map((light) => this._lightRow(light, nowHour))}
        </div>
      </div>
    </div>`;
  }

  private _scrubRow(): TemplateResult {
    const h = Math.floor(this.previewHour);
    const m = Math.round((this.previewHour - h) * 60);
    const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return html`<div class="gridrow scrubrow">
      <div class="label">
        <span class="clock">${label}</span>
      </div>
      <div class="track">
        <input
          type="range"
          min="0"
          max="23.5"
          step="0.5"
          .value=${String(this.previewHour)}
          @input=${(e: Event) =>
            this._emit("scrub", Number((e.target as HTMLInputElement).value))}
        />
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
    const selected = this.selectedRow === "sun" ? "rowselected" : "";
    return html`<div class="gridrow sunrow ${selected}">
      <div
        class="label clickable"
        title="Edit the sun"
        @click=${() => this._emit("select-sun", null)}
      >
        <span class="lname">☀️ Sun</span>
        ${this._cogIcon()}
      </div>
      ${HOURS.map((h) =>
        this._cell(row[h], h === nowHour, "readonly", false, false)
      )}
    </div>`;
  }

  private _lightRow(light: LightInfo, nowHour: number): TemplateResult {
    const row = this.timeline!.lights[light.entity_id] ?? [];
    const selected = this.selectedRow === light.entity_id ? "rowselected" : "";
    return html`<div class="gridrow ${selected}">
      <div
        class="label clickable"
        title="Edit light range"
        @click=${() => this._emit("select-light", light.entity_id)}
      >
        <span class="lname">${light.name}</span>
        ${this._cogIcon()}
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
    cell: GridCell | undefined,
    isNow: boolean,
    extra: string,
    explicit: boolean,
    selected: boolean,
    onClick?: () => void
  ): TemplateResult {
    const brightness = cell ? cell.brightness : 0;
    const rgb = cell && "rgb_color" in cell ? cell.rgb_color : null;
    const color = !cell
      ? "transparent"
      : rgb
        ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        : kelvinToCss(cell.color_temp);
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
      <div class="fill" style="height:${brightness}%;background:${color}"></div>
    </div>`;
  }

  private _cogIcon(): TemplateResult {
    return html`<svg class="cog" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7 7 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.31 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96a7 7 0 0 0 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7 7 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
      />
    </svg>`;
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
