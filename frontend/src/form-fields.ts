import { html, nothing, type TemplateResult } from "lit";

import { infoIcon } from "./icons";
import { formatDuration } from "./utils";

// Small presentational field builders shared by every editor/tab. They rely on
// the `.field`/`.toggle`/`.section`/`.minmax` classes from baseStyles being
// present in the host.

// A small uppercase section heading. With `info`, the heading becomes a native
// <details>: tapping it (or its ⓘ) reveals the explanatory text underneath.
export function sectionHeading(title: string, info?: string): TemplateResult {
  if (!info) return html`<div class="section">${title}</div>`;
  return html`<details class="section">
    <summary>${title} ${infoIcon}</summary>
    <p class="muted">${info}</p>
  </details>`;
}

// A dual-thumb min–max range slider built from two overlapped native range
// inputs (pointer events on the thumbs only). Optional `gradient` renders an
// indication strip above the track (e.g. the Kelvin spectrum).
export function minMaxField(
  label: string,
  unit: string,
  lo: number,
  hi: number,
  min: number,
  max: number,
  step: number,
  onChange: (lo: number, hi: number) => void,
  gradient?: string
): TemplateResult {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return html`<div class="field">
    <span class="field-head">
      <span>${label}</span>
      <b>${lo}–${hi}${unit}</b>
    </span>
    ${gradient
      ? html`<div class="temp-gradient" style="background:${gradient}"></div>`
      : nothing}
    <div class="minmax">
      <div class="minmax-track">
        <div
          class="minmax-fill"
          style="left:${pct(lo)}%;width:${Math.max(0, pct(hi) - pct(lo))}%"
        ></div>
      </div>
      <input
        type="range"
        min=${min}
        max=${max}
        step=${step}
        .value=${String(lo)}
        @input=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          const v = Math.min(Number(el.value), hi);
          el.value = String(v);
          onChange(v, hi);
        }}
      />
      <input
        type="range"
        min=${min}
        max=${max}
        step=${step}
        .value=${String(hi)}
        @input=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          const v = Math.max(Number(el.value), lo);
          el.value = String(v);
          onChange(lo, v);
        }}
      />
    </div>
  </div>`;
}

// A duration slider (stored in seconds, 1-minute steps) with the parsed
// value — "45 min" / "1 h 23 min" — previewed underneath. ``zeroText``
// replaces the preview at exactly 0 (e.g. "Never").
export function durationField(
  label: string,
  seconds: number,
  min: number,
  max: number,
  onChange: (value: number) => void,
  zeroText?: string
): TemplateResult {
  const preview =
    seconds === 0 && zeroText ? zeroText : formatDuration(seconds);
  return html`<label class="field">
    ${label}
    <input
      type="range"
      min=${min}
      max=${max}
      step="60"
      .value=${String(seconds)}
      @input=${(e: Event) =>
        onChange(Number((e.target as HTMLInputElement).value))}
    />
    <span class="duration-preview">${preview}</span>
  </label>`;
}

export function numberField(
  label: string,
  value: number,
  onChange: (value: number) => void
): TemplateResult {
  return html`<label class="field"
    >${label}
    <input
      type="number"
      .value=${String(value)}
      @change=${(e: Event) =>
        onChange(Number((e.target as HTMLInputElement).value))}
    />
  </label>`;
}

// An optional numeric field: blank maps to null (e.g. "use the default").
// The placeholder shows the value the blank field falls back to.
// Fires on change (blur/enter), so decimals and minus signs can be typed.
export function coordField(
  label: string,
  value: number | null,
  placeholder: string,
  onChange: (value: number | null) => void
): TemplateResult {
  return html`<label class="field"
    >${label}
    <input
      type="number"
      step="any"
      placeholder=${placeholder}
      .value=${value != null ? String(value) : ""}
      @change=${(e: Event) => {
        const raw = (e.target as HTMLInputElement).value.trim();
        const n = Number(raw);
        onChange(raw === "" || !Number.isFinite(n) ? null : n);
      }}
    />
  </label>`;
}

export function rangeField(
  label: string,
  value: number,
  min: number,
  max: number,
  step: number,
  unit: string,
  onChange: (value: number) => void,
  gradient?: string
): TemplateResult {
  return html`<label class="field">
    <span class="field-head">
      <span>${label}</span>
      <b>${value}${unit}</b>
    </span>
    ${gradient
      ? html`<div class="temp-gradient" style="background:${gradient}"></div>`
      : nothing}
    <input
      type="range"
      min=${min}
      max=${max}
      step=${step}
      .value=${String(value)}
      @input=${(e: Event) =>
        onChange(Number((e.target as HTMLInputElement).value))}
    />
  </label>`;
}

export function timeField(
  label: string,
  value: string | null,
  onChange: (value: string | null) => void
): TemplateResult {
  return html`<label class="field"
    >${label}
    <input
      type="time"
      step="1"
      .value=${value ?? ""}
      @change=${(e: Event) =>
        onChange((e.target as HTMLInputElement).value || null)}
    />
  </label>`;
}

export function checkboxField(
  label: string,
  value: boolean,
  onChange: (value: boolean) => void
): TemplateResult {
  return html`<label class="toggle">
    <input
      type="checkbox"
      .checked=${value}
      @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)}
    />
    ${label}
  </label>`;
}

// iOS-style row: label on the left, the select on the right.
export function selectField(
  label: string,
  value: string,
  options: Array<{ value: string; label: string }>,
  onChange: (value: string) => void
): TemplateResult {
  return html`<label class="field inline"
    >${label}
    <select
      @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}
    >
      ${options.map(
        (option) =>
          html`<option value=${option.value} ?selected=${option.value === value}>
            ${option.label}
          </option>`
      )}
    </select>
  </label>`;
}
