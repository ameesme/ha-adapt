import { html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import { TabBase } from "../base-tab";
import { baseStyles } from "../theme";
import type { Schema } from "../types";
import { defaultSchema } from "../utils";
import "./schema-editor";

@customElement("ha-adapt-schemas-tab")
export class SchemasTab extends TabBase {
  static override styles = baseStyles;

  @state() private _selectedId = "default";
  // Holds an unsaved "New schema" until it is saved or abandoned.
  @state() private _newSchema?: Schema;

  private get _selected(): Schema | undefined {
    if (this._newSchema && this._newSchema.id === this._selectedId) {
      return this._newSchema;
    }
    return this.config.schemas[this._selectedId] ?? this.config.schemas.default;
  }

  override render(): TemplateResult {
    const schemas = Object.values(this.config.schemas);
    const selected = this._selected;
    return html`
      <div class="card">
        <h2>Schemas</h2>
        <div class="row">
          <select
            class="grow"
            @change=${(e: Event) =>
              this._select((e.target as HTMLSelectElement).value)}
          >
            ${schemas.map(
              (schema) =>
                html`<option
                  value=${schema.id}
                  ?selected=${schema.id === this._selectedId}
                >
                  ${schema.name}
                </option>`
            )}
            ${this._newSchema
              ? html`<option value=${this._newSchema.id} selected>
                  ${this._newSchema.name} (unsaved)
                </option>`
              : nothing}
          </select>
          <button class="btn ghost" @click=${this._new}>+ New</button>
        </div>
      </div>
      ${selected
        ? html`<ha-adapt-schema-editor
            .schema=${selected}
            @schema-save=${this._onSave}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>`
        : nothing}
    `;
  }

  private _select(id: string): void {
    this._selectedId = id;
  }

  private _new(): void {
    const id = `schema_${Date.now().toString(36)}`;
    this._newSchema = defaultSchema(id, "New schema");
    this._selectedId = id;
  }

  private async _onSave(e: CustomEvent<Schema>): Promise<void> {
    this._newSchema = undefined;
    this._selectedId = e.detail.id;
    await this.run(this.api.saveSchema(e.detail));
  }

  private async _onDelete(e: CustomEvent<string>): Promise<void> {
    this._newSchema = undefined;
    this._selectedId = "default";
    await this.run(this.api.deleteSchema(e.detail));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-schemas-tab": SchemasTab;
  }
}
