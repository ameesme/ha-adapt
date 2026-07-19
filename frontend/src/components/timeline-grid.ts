import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { cogFilledIcon } from "../icons";
import { baseStyles } from "../theme";
import type { LightInfo, TimelineCell, TimelineData } from "../types";
import { HOURS, currentHour, hourLabel, kelvinToCss } from "../utils";

export interface CellRef {
  entityId: string;
  hour: number;
}

type GridCell = TimelineCell | { brightness: number; color_temp: number };

// The 24-hour grid: an integrated time scrubber, an hour header, a distinct
// sun row, and one clickable row per light. Row labels stay pinned while the
// columns scroll horizontally. Emits `select-cell`, `select-light`,
// `select-sun`, and `scrub`.
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
        box-sizing: border-box;
      }
      .scroll {
        max-width: 100%;
        padding-bottom: 6px;
      }
      .rows {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .gridrow {
        display: grid;
        grid-template-columns: 100px repeat(24, 1fr);
        gap: 1px;
        align-items: center;
      }
      .label {
        z-index: 3;
        align-self: stretch;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.82rem;
        font-weight: 500;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        padding-right: 4px;
      }
      .label .text-col {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .label .lname {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .label svg {
        width: 12px;
        height: 12px;
        flex: none;
        opacity: 0.4;
      }
      .label.clickable:hover svg {
        opacity: 0.9;
      }
      .label.clickable {
        cursor: pointer;
      }
      .sunrow .label {
        color: var(--accent-strong);
      }
      .gridrow.rowselected .label {
        color: var(--accent-strong);
      }
      /* Matches the form section headings (.section in baseStyles). */
      .label.section-label {
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text);
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
      .now-btn {
        background: none;
        border: none;
        padding: 0;
        margin-left: auto;
        font-size: 0.7rem;
        color: var(--text-soft);
        cursor: pointer;
        text-transform: lowercase;
      }
      .now-btn:hover {
        color: var(--accent-strong);
      }
      /* Sun-following cells have no background — that's the default state;
         only overrides get a marker. */
      .cell {
        position: relative;
        height: 42px;
        overflow: hidden;
        cursor: pointer;
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
        background: var(--border);
      }
      .cell.selected {
        border: 2px var(--accent-strong) solid;
      }
      .legend {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        padding-top: 10px;
        font-size: 0.75rem;
        color: var(--text-soft);
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
      .legend-dot.overridden {
        background: var(--border);
      }
      .legend-dot.selected {
        border: 2px var(--accent-strong) solid;
      }
      @media (max-width: 960px) {
        :host {
          min-height: 0;
        }
        /* Fill the viewport; the grid fits the width (no horizontal
           scrolling) and scrolls internally only vertically. */
        .card {
          padding: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
        }
        .scrubrow {
          display: none;
        }
        .scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .scroll.locked {
          overflow: hidden;
          touch-action: none;
        }
        /* Stacked rows: the name spans the full width and the 24 cells
           auto-flow underneath, edge to edge. minmax(0, 1fr) so the cells
           can shrink below the hour digits' width. */
        .gridrow {
          grid-template-columns: repeat(24, minmax(0, 1fr));
          margin-bottom: 6px;
        }
        .gridrow .label {
          grid-column: 1 / -1;
          font-size: 0.8rem;
          padding: 4px 0 2px;
          margin-bottom: 3px;
        }
        .gridrow .label.section-label {
          padding-top: 18px;
        }
        /* Keep the room heading tight to the first light under it. */
        .section-row {
          margin-bottom: 0;
        }
        .section-row .label {
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .headrow .label {
          display: none;
        }
        .headrow {
          margin-bottom: 0;
          padding-bottom: 4px;
        }
        .hourhead {
          font-size: 0.55rem;
          overflow: hidden;
        }
        .headrow {
          position: sticky;
          top: 0;
          z-index: 4;
          background: var(--bg);
        }
        /* Keep the legend clear of the iOS home indicator / navigation bar. */
        .legend {
          flex: none;
          padding-top: 8px;
          padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
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
  // True while a modal drawer is open: freezes the internal scroll so touch
  // scrolling can't chain through to the timeline behind the sheet.
  @property({ type: Boolean }) scrollLocked = false;

  override render(): TemplateResult {
    if (!this.timeline) {
      return html`<div class="card"><div class="empty">Loading timeline…</div></div>`;
    }
    const nowHour = Math.floor(this.previewHour) % 24;
    return html`<div class="card">
      <div class="scroll ${this.scrollLocked ? "locked" : ""}">
        <div class="rows">
          ${this._scrubRow()}
          ${this._headerRow(nowHour)}
          ${this._sunRow()}
          ${this._lightGroups().map(
            (group) => html`
              <div class="gridrow section-row">
                <div class="label section-label">${group.area}</div>
              </div>
              ${group.lights.map((light) => this._lightRow(light))}
            `
          )}
        </div>
      </div>
      <div class="legend">
        <span class="legend-item"><span class="legend-dot overridden"></span>Overridden</span>
        <span class="legend-item"><span class="legend-dot selected"></span>Selected</span>
      </div>
    </div>`;
  }

  private get _clockLabel(): string {
    const h = Math.floor(this.previewHour);
    const m = Math.round((this.previewHour - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  private _slider(): TemplateResult {
    return html`<input
      type="range"
      min="0"
      max="23.5"
      step="0.5"
      .value=${String(this.previewHour)}
      @input=${(e: Event) =>
        this._emit("scrub", Number((e.target as HTMLInputElement).value))}
    />`;
  }

  // Desktop: part of the grid, so the track lines up with the hour columns.
  private _scrubRow(): TemplateResult {
    return html`<div class="gridrow scrubrow">
      <div class="label">
        <span class="clock">${this._clockLabel}</span>
        <button class="now-btn" @click=${this._jumpToNow} title="Jump to now">now</button>
      </div>
      <div class="track">${this._slider()}</div>
    </div>`;
  }

  private _jumpToNow(): void {
    this._emit("scrub", currentHour());
  }

  private _headerRow(nowHour: number): TemplateResult {
    return html`<div class="gridrow headrow">
      <div class="label"></div>
      ${HOURS.map(
        (h) => html`<div class="hourhead ${h === nowHour ? "now" : ""}">
          ${hourLabel(h)}
        </div>`
      )}
    </div>`;
  }

  private _sunRow(): TemplateResult {
    const row = this.timeline!.sun;
    const selected = this.selectedRow === "sun" ? "rowselected" : "";
    return html`<div class="gridrow sunrow ${selected}">
      <div
        class="label clickable"
        title="Edit the sun"
        @click=${() => this._emit("select-sun", null)}
      >
        <span class="text-col">
          <span class="lname">☀️ Sun</span>
        </span>
        ${cogFilledIcon}
      </div>
      ${HOURS.map((h) => this._cell(row[h], "readonly", false, false))}
    </div>`;
  }

  // Consecutive lights that share an area render under one area heading (the
  // backend sorts by area already); unassigned lights group under "Other".
  private _lightGroups(): { area: string; lights: LightInfo[] }[] {
    const groups: { area: string; lights: LightInfo[] }[] = [];
    for (const light of this.lights) {
      const area = light.area_name ?? "Other";
      const last = groups[groups.length - 1];
      if (last && last.area === area) last.lights.push(light);
      else groups.push({ area, lights: [light] });
    }
    if (groups.length === 1 && groups[0].area === "Other") {
      groups[0].area = "Lights";
    }
    return groups;
  }

  private _lightRow(light: LightInfo): TemplateResult {
    const row = this.timeline!.lights[light.entity_id] ?? [];
    const selected = this.selectedRow === light.entity_id ? "rowselected" : "";
    return html`<div class="gridrow ${selected}">
      <div
        class="label clickable"
        title="Edit light range"
        @click=${() => this._emit("select-light", light.entity_id)}
      >
        <span class="text-col">
          <span class="lname">${light.name}</span>
        </span>
        ${cogFilledIcon}
      </div>
      ${HOURS.map((h) => {
        const cell = row[h];
        const selected =
          this.selected?.entityId === light.entity_id &&
          this.selected?.hour === h;
        return this._cell(cell, "", Boolean(cell?.explicit), selected, () =>
          this._emit("select-cell", { entityId: light.entity_id, hour: h })
        );
      })}
    </div>`;
  }

  private _cell(
    cell: GridCell | undefined,
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
    ].join(" ");
    return html`<div
      class=${classes}
      @click=${onClick}
      title=${cell ? `${cell.brightness}% · ${cell.color_temp} K` : ""}
    >
      <div class="fill" style="height:${brightness}%;background:${color}"></div>
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
