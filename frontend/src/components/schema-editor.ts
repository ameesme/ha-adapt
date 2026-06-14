import {
  LitElement,
  html,
  css,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  checkboxField,
  numberField,
  selectField,
  textField,
  timeField,
} from "../form-fields";
import { baseStyles } from "../theme";
import type { HourlyKeyframe, Mode, Schema } from "../types";
import { BRIGHTNESS_MODE_LABELS, MODE_LABELS } from "../utils";

// Edits a single schema. Holds a local draft so edits are uncommitted until
// "Save"; emits `schema-save` / `schema-delete` for the parent to persist.
@customElement("ha-adapt-schema-editor")
export class SchemaEditor extends LitElement {
  static override styles = [
    baseStyles,
    css`
      .keyframe {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 8px;
        align-items: end;
        margin-bottom: 8px;
      }
    `,
  ];

  @property({ attribute: false }) schema!: Schema;
  @state() private _draft!: Schema;

  protected override willUpdate(changed: PropertyValues): void {
    // Reset the draft only when switching to a different schema, so in-progress
    // edits survive unrelated re-renders.
    if (changed.has("schema") && this._draft?.id !== this.schema.id) {
      this._draft = { ...this.schema };
    }
  }

  override render(): TemplateResult {
    const draft = this._draft;
    return html`<div class="card">
      <div class="grid">
        ${textField("Name", draft.name, "", (v) => this._patch({ name: v }))}
        ${selectField(
          "Mode",
          draft.mode,
          (Object.keys(MODE_LABELS) as Mode[]).map((mode) => ({
            value: mode,
            label: MODE_LABELS[mode],
          })),
          (v) => this._patch({ mode: v as Mode })
        )}
      </div>

      <div class="grid" style="margin-top:14px">
        ${numberField("Min brightness %", draft.min_brightness, (v) =>
          this._patch({ min_brightness: v })
        )}
        ${numberField("Max brightness %", draft.max_brightness, (v) =>
          this._patch({ max_brightness: v })
        )}
        ${numberField("Min color temp K", draft.min_color_temp, (v) =>
          this._patch({ min_color_temp: v })
        )}
        ${numberField("Max color temp K", draft.max_color_temp, (v) =>
          this._patch({ max_color_temp: v })
        )}
      </div>

      <div class="actions">
        ${checkboxField("Adapt brightness", draft.adapt_brightness, (v) =>
          this._patch({ adapt_brightness: v })
        )}
        ${checkboxField("Adapt color", draft.adapt_color, (v) =>
          this._patch({ adapt_color: v })
        )}
        ${checkboxField(
          "Split commands (IKEA)",
          draft.separate_turn_on_commands,
          (v) => this._patch({ separate_turn_on_commands: v })
        )}
      </div>

      ${draft.mode === "sun" ? this._renderSun(draft) : nothing}
      ${draft.mode === "hourly" ? this._renderHourly(draft) : nothing}
      ${draft.mode === "sensor" ? this._renderSensor(draft) : nothing}

      <div class="actions">
        <button class="btn" @click=${this._save}>Save schema</button>
        ${draft.id !== "default"
          ? html`<button class="btn danger" @click=${this._delete}>
              Delete
            </button>`
          : nothing}
      </div>
    </div>`;
  }

  private _renderSun(draft: Schema): TemplateResult {
    return html`<h2 style="margin-top:18px">Sun settings</h2>
      <div class="grid">
        ${selectField(
          "Brightness curve",
          draft.brightness_mode,
          Object.keys(BRIGHTNESS_MODE_LABELS).map((mode) => ({
            value: mode,
            label: BRIGHTNESS_MODE_LABELS[mode],
          })),
          (v) =>
            this._patch({ brightness_mode: v as Schema["brightness_mode"] })
        )}
        ${timeField("Fixed sunrise", draft.sunrise_time, (v) =>
          this._patch({ sunrise_time: v })
        )}
        ${timeField("Fixed sunset", draft.sunset_time, (v) =>
          this._patch({ sunset_time: v })
        )}
        ${numberField("Sunrise offset (s)", draft.sunrise_offset, (v) =>
          this._patch({ sunrise_offset: v })
        )}
        ${numberField("Sunset offset (s)", draft.sunset_offset, (v) =>
          this._patch({ sunset_offset: v })
        )}
        ${numberField(
          "Ramp – dark side (s)",
          draft.brightness_mode_time_dark,
          (v) => this._patch({ brightness_mode_time_dark: v })
        )}
        ${numberField(
          "Ramp – light side (s)",
          draft.brightness_mode_time_light,
          (v) => this._patch({ brightness_mode_time_light: v })
        )}
      </div>`;
  }

  private _renderHourly(draft: Schema): TemplateResult {
    return html`<h2 style="margin-top:18px">Hourly keyframes</h2>
      <p class="muted">
        Brightness and color temperature are interpolated between these points
        across the day.
      </p>
      ${draft.hourly_keyframes.map(
        (frame, index) => html`<div class="keyframe">
          ${numberField("Hour", frame.hour, (v) =>
            this._patchKeyframe(index, { hour: v })
          )}
          ${numberField("Brightness %", frame.brightness, (v) =>
            this._patchKeyframe(index, { brightness: v })
          )}
          ${numberField("Color temp K", frame.color_temp, (v) =>
            this._patchKeyframe(index, { color_temp: v })
          )}
          <button class="btn danger" @click=${() => this._removeKeyframe(index)}>
            ✕
          </button>
        </div>`
      )}
      <button class="btn ghost" @click=${this._addKeyframe}>
        + Add keyframe
      </button>`;
  }

  private _renderSensor(draft: Schema): TemplateResult {
    return html`<h2 style="margin-top:18px">Sensor input</h2>
      <p class="muted">
        Drive brightness and color from a sensor. The sun is the built-in
        default source — this lets a real sensor take over.
      </p>
      <div class="grid">
        ${textField(
          "Sensor entity id",
          draft.sensor_entity_id ?? "",
          "sensor.illuminance",
          (v) => this._patch({ sensor_entity_id: v || null })
        )}
        ${numberField("Sensor min", draft.sensor_min, (v) =>
          this._patch({ sensor_min: v })
        )}
        ${numberField("Sensor max", draft.sensor_max, (v) =>
          this._patch({ sensor_max: v })
        )}
      </div>`;
  }

  private _patch(patch: Partial<Schema>): void {
    this._draft = { ...this._draft, ...patch };
  }

  private _patchKeyframe(index: number, patch: Partial<HourlyKeyframe>): void {
    const frames = this._draft.hourly_keyframes.map((frame, i) =>
      i === index ? { ...frame, ...patch } : frame
    );
    this._draft = { ...this._draft, hourly_keyframes: frames };
  }

  private _addKeyframe = (): void => {
    this._draft = {
      ...this._draft,
      hourly_keyframes: [
        ...this._draft.hourly_keyframes,
        { hour: 12, brightness: 80, color_temp: 4000 },
      ],
    };
  };

  private _removeKeyframe(index: number): void {
    this._draft = {
      ...this._draft,
      hourly_keyframes: this._draft.hourly_keyframes.filter(
        (_, i) => i !== index
      ),
    };
  }

  private _save = (): void => {
    this.dispatchEvent(
      new CustomEvent("schema-save", {
        detail: this._draft,
        bubbles: true,
        composed: true,
      })
    );
  };

  private _delete = (): void => {
    this.dispatchEvent(
      new CustomEvent("schema-delete", {
        detail: this._draft.id,
        bubbles: true,
        composed: true,
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-schema-editor": SchemaEditor;
  }
}
