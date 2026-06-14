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

- **Three control modes per schema**
  - **Sun** — automatic brightness/color from the sun's position, with
    `default` / `linear` / `tanh` brightness curves.
  - **By hour** — interpolated brightness/color keyframes across the day.
  - **Sensor** — drive lighting from any numeric sensor with custom scaling.
    The sun is modelled as the *default* input source, so a real sensor is a
    drop-in replacement (see [Architecture](#architecture)).
- **Reusable schemas** — one default schema applies to every light; assign any
  light its own schema for per-light behaviour.
- **Location-based sun temperature** — uses your Home Assistant location
  (astral), with fixed `sunrise`/`sunset` times, offsets, and min/max bounds.
- **Turn-on interception & override detection** — manual changes pause
  adaptation, with a configurable **auto-reset** that hands control back.
- **Split commands** — send brightness and color as separate `light.turn_on`
  calls for devices that need it (e.g. IKEA).
- **Tanh-based curves** for smooth dawn/dusk ramps.
- **File-backed storage** — all configuration lives in
  `<config>/.storage/ha_adapt`; export/import via the panel for backups.
- **Warm, monotone web-ui** — the configuration panel is themed in a single
  amber/terracotta palette.

## Configuration that maps to adaptive-lighting

These familiar options are exposed in the panel:

| Option            | Where               | Meaning                                    |
| ----------------- | ------------------- | ------------------------------------------ |
| `interval`        | Settings            | How often to adapt the lights (seconds).   |
| `transition`      | Settings / schema   | Light transition duration (seconds).       |
| `sunset_time`     | Schema (Sun mode)   | Fixed `HH:MM:SS` sunset overriding astral. |
| `autoreset`       | Settings            | Auto-reset manual control after N seconds. |
| split commands    | Schema              | Separate brightness/color calls (IKEA).    |

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
   - **Lights** — see each light's live target, reset manual control, and
     assign a schema.
   - **Schemas** — create/edit schemas, pick a mode, and tune the curve.
   - **Settings** — `interval`, `transition`, auto-reset, sleep values, etc.

Two switches are also created: a master *Adaptive lighting* switch and a
*Sleep mode* switch.

### Services

- `ha_adapt.apply` — force an immediate adaptation (optionally for specific
  lights).
- `ha_adapt.set_manual_control` — pause/resume adaptation for given lights.

## Architecture

The integration is split into small, focused modules:

| File             | Responsibility                                                  |
| ---------------- | --------------------------------------------------------------- |
| `engine.py`      | **Pure** math: sun snapshot, tanh/linear curves, drive→target.  |
| `coordinator.py` | The runtime manager: scheduling, applying, override + auto-reset. |
| `interceptor.py` | Listens for `light.turn_on` to flag manual control.             |
| `models.py`      | Plain dataclasses (`Schema`, `GlobalSettings`, `StoreData`).    |
| `store.py`       | File-backed persistence via HA's `Store`.                       |
| `panel.py`       | Static asset, sidebar panel, and WebSocket API.                 |
| `switch.py`      | Master + sleep switches.                                        |
| `config_flow.py` | Entity-id selection only.                                       |

The key idea: an **input source** produces a normalized `DriveSignal`, which a
shared mapping turns into a concrete light `Target`. The sun is just the
default source (`sun_drive`); a sensor is another (`sensor_drive`). This keeps
the math pure and makes "replace the sun with a sensor" a one-line change.

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

## License

MIT
