import { html, type TemplateResult } from "lit";

// Small presentational field builders shared by every editor/tab. They rely on
// the `.field`/`.toggle` classes from baseStyles being present in the host.

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
// Fires on change (blur/enter), so decimals and minus signs can be typed.
export function coordField(
  label: string,
  value: number | null,
  onChange: (value: number | null) => void
): TemplateResult {
  return html`<label class="field"
    >${label}
    <input
      type="number"
      step="any"
      placeholder="HA location"
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
  onChange: (value: number) => void
): TemplateResult {
  return html`<label class="field">
    <span class="field-head">
      <span>${label}</span>
      <b>${value}${unit}</b>
    </span>
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

export function textField(
  label: string,
  value: string,
  placeholder: string,
  onChange: (value: string) => void
): TemplateResult {
  return html`<label class="field"
    >${label}
    <input
      type="text"
      placeholder=${placeholder}
      .value=${value}
      @input=${(e: Event) => onChange((e.target as HTMLInputElement).value)}
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

export function selectField(
  label: string,
  value: string,
  options: Array<{ value: string; label: string }>,
  onChange: (value: string) => void
): TemplateResult {
  return html`<label class="field"
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
