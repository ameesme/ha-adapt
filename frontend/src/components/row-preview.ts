import { LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { RgbColor } from "../types";
import { kelvinToCss } from "../utils";

export interface PreviewCell {
  brightness: number;
  color_temp: number;
  rgb_color?: RgbColor | null;
  explicit?: boolean;
}

// A non-interactive 24-hour strip mirroring a timeline row, rendered above
// the sun/light editors as a live preview of the edits.
@customElement("sundial-row-preview")
export class RowPreview extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .strip {
      display: grid;
      grid-template-columns: repeat(24, minmax(0, 1fr));
      gap: 1px;
      height: 42px;
      overflow: hidden;
    }
    .cell {
      position: relative;
      overflow: hidden;
    }
    /* Dim 100% reference line, mirroring the timeline cells. */
    .cell::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border);
      opacity: 0.5;
    }
    .cell.explicit {
      background: var(--border);
    }
    .fill {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `;

  @property({ attribute: false }) cells: PreviewCell[] = [];

  override render(): TemplateResult {
    return html`<div class="strip">
      ${this.cells.map((cell) => {
        const rgb = cell.rgb_color;
        const color = rgb
          ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
          : kelvinToCss(cell.color_temp);
        return html`<div class="cell ${cell.explicit ? "explicit" : ""}">
          <div
            class="fill"
            style="height:${cell.brightness}%;background:${color}"
          ></div>
        </div>`;
      })}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sundial-row-preview": RowPreview;
  }
}
