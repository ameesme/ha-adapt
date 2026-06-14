# HA Adapt — Adaptive Lighting

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/release/ameesme/ha-adapt.svg)](https://github.com/ameesme/ha-adapt/releases)
[![License](https://img.shields.io/github/license/ameesme/ha-adapt.svg)](LICENSE)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ameesme&repository=ha-adapt&category=integration)

A Home Assistant custom integration that adapts the **brightness** and **color
temperature** of your lights over the day. It offers an API surface comparable
to [`basnijholt/adaptive-lighting`](https://github.com/basnijholt/adaptive-lighting),
but everything except the list of controlled lights is configured from a warm,
purpose-built **web-ui panel** in the sidebar.

> Status: early (v0.1). Core engine, control loop, and panel are in place.
> Light-sensor scaling UI and the sun graphs are planned.

## Highlights

- **Schemas are timelines.** A schema covers *all* your lights. It has a
  configurable **sun** plus a **24-hour timeline** with one row per light:
  - The **sun row** (top) shows the computed brightness/color per hour.
  - Each **light row** can pin an explicit brightness + color temp for any
    hour; empty cells follow the sun, scaled into that light's range.
  - Each light has its own **min/max brightness and color temp**.
  - **Step through the day** with the time slider and optionally push the
    preview live to your lights.
- **One active schema at a time** — switch which schema drives the lights.
- **Location-based sun temperature** — uses your Home Assistant location
  (astral), with fixed `sunrise`/`sunset` times and offsets.
- **Tanh dawn/dusk ramps** — a single smooth brightness curve around
  sunrise/sunset (ramp widths configurable).
- **Turn-on interception & override detection** — manual changes pause
  adaptation, with a configurable **auto-reset** that hands control back.
- **Split commands** — per light, send brightness and color as separate
  `light.turn_on` calls for devices that need it (e.g. IKEA).
- **File-backed storage** — all configuration lives in
  `<config>/.storage/ha_adapt`.
- **Warm, monotone web-ui** — themed in a single amber/terracotta palette.

## Configuration that maps to adaptive-lighting

These familiar options are exposed in the panel:

| Option         | Where    | Meaning                                    |
| -------------- | -------- | ------------------------------------------ |
| `interval`     | Settings | How often to adapt the lights (seconds).   |
| `transition`   | Settings | Light transition duration (seconds).       |
| `sunset_time`  | Sun      | Fixed `HH:MM:SS` sunset overriding astral. |
| `autoreset`    | Settings | Auto-reset manual control after N seconds. |
| split commands | Light    | Separate brightness/color calls (IKEA).    |

## Installation

### HACS (custom repository)

Click the **"Open in HACS"** badge above, or in HACS go to ⋮ →
**Custom repositories**, add `https://github.com/ameesme/ha-adapt` with the
category **Integration**, then install **HA Adapt — Adaptive Lighting** and
restart Home Assistant.

### Manual

Copy `custom_components/ha_adapt` into your `<config>/custom_components/` and
restart Home Assistant.

## Usage

1. **Settings → Devices & Services → Add Integration → Adaptive Lighting.**
2. Select the lights or light groups to control. (This is the *only* thing the
   config flow asks — by design.)
3. Open **Adaptive Lighting** in the sidebar:
   - **Lights** — live status of every light; reset manual control.
   - **Schemas** — the timeline editor: tune the sun, click timeline cells to
     pin per-hour values, set per-light ranges, mark a schema active, and step
     the day with the preview slider.
   - **Settings** — `interval`, `transition`, auto-reset, etc.

A master *Adaptive lighting* switch is also created to enable/disable
adaptation for the whole instance.

### Services

- `ha_adapt.apply` — force an immediate adaptation (optionally for specific
  lights).
- `ha_adapt.set_manual_control` — pause/resume adaptation for given lights.

## Architecture

The integration is split into small, focused modules:

| File             | Responsibility                                                  |
| ---------------- | --------------------------------------------------------------- |
| `engine.py`      | **Pure** math: sun snapshot, tanh ramp, per-light hour anchors. |
| `coordinator.py` | The runtime manager: scheduling, applying, override + auto-reset. |
| `interceptor.py` | Listens for `light.turn_on` to flag manual control.             |
| `models.py`      | Dataclasses (`Schema`, `SunConfig`, `LightConfig`, `StoreData`). |
| `store.py`       | File-backed persistence via HA's `Store`.                       |
| `panel.py`       | Static asset, sidebar panel, and WebSocket API.                 |
| `switch.py`      | Master switch.                                                  |
| `config_flow.py` | Entity-id selection only.                                       |

The key idea: the sun produces a normalized `DriveSignal`; scaling it into a
light's range yields that light's hourly fallback. For each light the engine
builds 24 **anchors** — explicit cells where set, sun-derived otherwise — and
the live value is a cyclic interpolation across them. The same `DriveSignal`
shape means a real sensor could feed the pipeline later instead of the sun.

The web-ui (`frontend/`, Lit + TypeScript) is built with Vite into a single
bundle committed at `custom_components/ha_adapt/frontend/dist/ha-adapt-panel.js`.

## Development

```bash
# Python: lint + pure-logic tests (no Home Assistant required)
ruff check .
python -m pytest

# Frontend: type-check + build the panel bundle
cd frontend
npm install
npm run build   # outputs to ../custom_components/ha_adapt/frontend/dist
```

The engine and model tests run without Home Assistant installed. Re-run
`npm run build` and commit the bundle whenever the panel changes.

### Releasing

1. Bump `version` in `custom_components/ha_adapt/manifest.json`.
2. Commit, then tag and push: `git tag vX.Y.Z && git push origin vX.Y.Z`.

The release workflow checks the tag matches the manifest version, rebuilds and
verifies the panel bundle, and publishes a GitHub release (with a `ha_adapt.zip`
asset). HACS then offers that version; without a release it installs from the
default branch.

## License

MIT
