import { html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

import { TabBase } from "../base-tab";
import { baseStyles } from "../theme";
import { defaultSchema } from "../utils";
import "./schema-editor";

@customElement("ha-adapt-schemas-tab")
export class SchemasTab extends TabBase {
  static override styles = baseStyles;

  @state() private _selectedId?: string;

  private get _currentId(): string {
    if (this._selectedId && this.config.schemas[this._selectedId]) {
      return this._selectedId;
    }
    return this.config.active_schema_id;
  }

  override render(): TemplateResult {
    const schemas = Object.values(this.config.schemas);
    const currentId = this._currentId;
    const selected = this.config.schemas[currentId];
    return html`
      <div class="card">
        <h2>Schemas</h2>
        <p class="muted">
          Each schema configures every light. One schema is active at a time.
        </p>
        <div class="row">
          <select
            class="grow"
            @change=${(e: Event) =>
              (this._selectedId = (e.target as HTMLSelectElement).value)}
          >
            ${schemas.map(
              (schema) =>
                html`<option
                  value=${schema.id}
                  ?selected=${schema.id === currentId}
                >
                  ${schema.name}${schema.id === this.config.active_schema_id
                    ? " (active)"
                    : ""}
                </option>`
            )}
          </select>
          <button class="btn ghost" @click=${this._new}>+ New</button>
        </div>
      </div>
      ${selected
        ? html`<ha-adapt-schema-editor
            .schema=${selected}
            .lights=${this.config.lights}
            .api=${this.api}
            .active=${currentId === this.config.active_schema_id}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>`
        : nothing}
    `;
  }

  private async _new(): Promise<void> {
    const id = `schema_${Date.now().toString(36)}`;
    this._selectedId = id;
    await this.run(this.api.saveSchema(defaultSchema(id, "New schema")));
  }

  private async _onDelete(e: CustomEvent<string>): Promise<void> {
    this._selectedId = this.config.active_schema_id;
    await this.run(this.api.deleteSchema(e.detail));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-adapt-schemas-tab": SchemasTab;
  }
}
