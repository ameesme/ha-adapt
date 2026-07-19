# Sundial

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/release/ameesme/ha-adapt.svg)](https://github.com/ameesme/ha-adapt/releases)
[![License](https://img.shields.io/github/license/ameesme/ha-adapt.svg)](LICENSE)

Adaptive lighting for Home Assistant, configured on a timeline.

Sundial adapts the brightness and colour temperature of your lights across the
day. A configurable **sun** drives every light by default; a 24-hour
**timeline** lets you pin exact values for any light at any hour. Everything is
edited in a purpose-built panel that works just as well on a phone as on a
desktop.

## How it works

- **Schemas are timelines.** A schema covers all your lights: the sun row on
  top, one row per light beneath it, grouped by room.
- **The sun is the default.** Empty timeline cells follow the sun's curve —
  smooth tanh ramps around sunrise and sunset, warm at night, cool at midday —
  scaled into each light's own brightness and colour-temperature range.
- **Override any hour.** Tap a cell to pin an explicit brightness, colour
  temperature, or RGB colour for that light at that hour. Values between hours
  are interpolated smoothly around the clock.
- **One schema is active at a time.** Build variants (movie night, holiday…)
  and switch between them from the panel, a dashboard, or an automation.

## Features

- Live **preview**: scrub through the day and optionally push the values to
  your lights as you drag.
- **Manual-control detection** — changing a light by hand pauses Sundial
  for it, with an optional auto-reset that hands control back.
- **Per-light ranges** with cap (clamp to range) or scale (sweep the whole
  range) behaviour.
- **Split commands** for lights that drop combined brightness + colour calls
  (e.g. IKEA), with a configurable delay.
- Fixed sunrise/sunset times, offsets, and ramp widths; custom coordinates or
  your home's location.
- **Backup**: export and import the whole configuration as JSON.
- Master **switch** and active-schema **select** entities for automations.

## Installation

**HACS** — add `https://github.com/ameesme/ha-adapt` as a custom repository
(category *Integration*), install **Sundial**, restart Home Assistant.

**Manual** — copy `custom_components/sundial` into
`<config>/custom_components/` and restart.

Then: **Settings → Devices & Services → Add Integration → Sundial**, pick the
lights to control, and open **Sundial** in the sidebar. That's the only thing
the config flow asks — everything else lives in the panel.

## Services

- `sundial.apply` — have Sundial apply the scheduled values immediately
  (optionally per light, with `turn_on` to light up lights that are off).
- `sundial.set_manual_control` — pause or resume Sundial for given lights.

## Architecture

| File             | Responsibility                                                 |
| ---------------- | -------------------------------------------------------------- |
| `engine.py`      | **Pure** math: sun curve, hourly anchors, cyclic interpolation. |
| `coordinator.py` | Runtime: scheduling, applying values, override tracking.        |
| `interceptor.py` | Flags manual control from explicit `light.turn_on` calls.       |
| `models.py`      | JSON-serialisable dataclasses (schema, sun, lights, settings).  |
| `panel.py`       | Sidebar panel, static asset, WebSocket API.                     |
| `store.py`       | Persistence via HA's `Store` (`<config>/.storage/sundial`).     |

The sun produces a normalized drive signal; each light builds 24 hourly
anchors from it (explicit cells win) and interpolates between them. The
engine has no Home Assistant imports and is unit-tested standalone.

## Development

```bash
# Python: lint + pure-logic tests (no Home Assistant required)
ruff check .
python -m pytest

# Frontend (Lit + TypeScript, built with Vite)
cd frontend
npm install
npm run build   # type-check + bundle into custom_components/sundial/frontend/dist
npm run dev     # dev harness on :5173 — the real panel against a mock backend
```

The dev harness runs the full panel in a plain browser with fake lights and a
TypeScript port of the engine — no Home Assistant needed. Re-run
`npm run build` and commit the regenerated bundle whenever the frontend
changes; CI fails if the committed bundle is stale.

**Releasing** — bump `version` in `custom_components/sundial/manifest.json`,
commit, tag `vX.Y.Z`, push the tag. The release workflow validates the tag and
bundle, then publishes a zip.

## License

MIT
