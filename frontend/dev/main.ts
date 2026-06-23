// Entry point for the local dev harness (npm run dev). Mounts the real panel
// against the mock backend so the UI runs entirely in the browser.

import "../src/ha-adapt-panel";
import { createMockHass } from "./mock-backend";

const panel = document.createElement("ha-adapt-panel");
// The panel only reads `hass.connection.sendMessagePromise`.
(panel as unknown as { hass: unknown }).hass = createMockHass();
document.body.appendChild(panel);
