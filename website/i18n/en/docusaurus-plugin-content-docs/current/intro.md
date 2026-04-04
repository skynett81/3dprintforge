---
sidebar_position: 1
title: Welcome to 3DPrintForge
description: A powerful, self-hosted dashboard for all your 3D printers
---

# Welcome to 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** is a self-hosted, full-featured control panel for all your 3D printers. It gives you complete visibility and control over your printer, filament inventory, print history, and more — all from a single browser tab.

## What is 3DPrintForge?

3DPrintForge connects to your printers via MQTT (Bambu Lab) or Moonraker WebSocket (Snapmaker, Voron, Creality K1, and other Klipper printers) over LAN. Sync models and print history via Bambu Cloud, Snapmaker Cloud, or fetch data directly from your printer.

### Key features

- **Live dashboard** — real-time temperature, progress, camera, AMS status with LIVE indicator
- **3D model viewing** — 3MFConsortium 3mfViewer for 3MF files, gcode toolpath viewer with per-layer colours, Three.js-based rendering
- **AdminLTE 4** — modern dashboard framework with treeview sidebar and responsive design
- **CRM system** — customers, orders, invoices, company settings with history integration
- **Filament inventory** — track all spools with AMS sync, EXT spool support, material info, plate compatibility, and drying guide
- **Filament tracking** — live tracking during printing with 4-level fallback (AMS sensor → EXT estimate → cloud → duration)
- **Material guide** — 15 materials with temperatures, plate compatibility, drying, properties, and tips
- **Print history** — complete log with model names, MakerWorld links, filament consumption, costs, and 3D preview
- **Planner** — calendar view, print queue with load balancing and filament check
- **Printer control** — temperature, speed, fans, G-code console
- **Print Guard** — automatic protection with xcam + 5 sensor monitors
- **Cost estimator** — material, electricity, labour, wear, markup, filament change time, and suggested sale price
- **Maintenance** — tracking with KB-based intervals, nozzle lifespan, plate lifespan, and guide
- **Sound alerts** — 9 configurable events with custom sound upload and printer speaker (M300)
- **Activity log** — persistent timeline from all events (prints, errors, maintenance, filament)
- **AMS humidity/temperature** — 5-level rating with recommendations for optimal storage
- **Achievements** — 18 world landmarks as milestones for filament consumption with XP progression
- **Notifications** — 7 channels (Telegram, Discord, email, ntfy, Pushover, SMS, webhook)
- **Multi-printer, multi-brand** — Bambu Lab (MQTT) + Snapmaker, Voron, Creality and all Klipper/Moonraker printers
- **Printer capabilities** — per-brand configuration for file access, camera, and features
- **File library** — 3MF/STL/gcode library with thumbnails, categories, tags, and 3D preview
- **English UI** — entire application in English, documentation available in English and Norwegian
- **Self-hosted** — no cloud dependency, your data on your machine

### New in v1.1.15

- **3MF Consortium integration** — lib3mf WASM for spec-compliant 3MF parsing, 3mfViewer embed for full 3D viewing
- **Gcode toolpath viewer** — per-layer colour visualisation for all Moonraker/Klipper printers
- **Three.js EnhancedViewer** — smooth shading, orbit controls, clipping planes for print progress
- **Universal 3D preview** — works for all printer types (Bambu FTPS, Moonraker HTTP, local files)
- **Printer capabilities** — per-brand/model configuration (Bambu Lab, Snapmaker, Voron, Creality, etc.)
- **History 3MF linking** — upload, replace and delete 3MF files linked to print history
- **Auto 3MF caching** — saves model name and metadata from Bambu printer at print start
- **3D buttons everywhere** — history, library, queue, scheduler and gallery

### New in v1.1.14

- **AdminLTE 4 integration** — complete HTML restructuring with treeview sidebar, modern layout and CSP support for CDN
- **CRM system** — full customer management with 4 panels: customers, orders, invoices and company settings with history integration
- **Modern UI** — teal accent, gradient titles, hover glow, floating orbs and improved dark theme
- **Achievements: 18 landmarks** — Viking ship, Statue of Liberty, Eiffel Tower, Big Ben, Brandenburg Gate, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, Dutch windmill, Wawel Dragon, Cristo Redentor, Turning Torso, Hagia Sophia, The Motherland, Great Wall of China, Prague Astronomical Clock, Budapest Parliament — with detail popup, XP and rarity
- **AMS humidity/temperature** — 5-level rating with recommendations for storage and drying
- **Live filament tracking** — real-time updates during printing via cloud estimate fallback
- **Complete i18n** — all keys translated, now English-only UI with Norwegian documentation

## Quick start

| Task | Link |
|------|------|
| Install the dashboard | [Installation](./getting-started/installation) |
| Configure first printer | [Setup](./getting-started/setup) |
| Connect to Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Explore all features | [Features](./features/overview) |
| Filament guide | [Material guide](./kb/filaments/guide) |
| Maintenance guide | [Maintenance](./kb/maintenance/nozzle) |
| API documentation | [API](./advanced/api) |

:::tip Demo mode
You can try the dashboard without a physical printer by running `npm run demo`. This starts 3 simulated printers with live print cycles.
:::

## Supported printers

### Bambu Lab (via MQTT)
- **X1 series**: X1C, X1C Combo, X1E
- **P1 series**: P1S, P1S Combo, P1P
- **P2 series**: P2S, P2S Combo
- **A series**: A1, A1 Combo, A1 mini
- **H2 series**: H2S, H2D (dual nozzle), H2C (tool changer, 6 heads)

### Klipper/Moonraker printers (via WebSocket + REST API)
- **Snapmaker**: U1 (up to 4 toolheads), J1, A350T, A250T
- **Voron**: V0, Trident, V2.4
- **Creality**: K1, K1 Max, K2 Plus (with Klipper firmware)
- **Sovol**: SV06, SV07, SV08
- **QIDI**: X-Max 3, X-Plus 3, Q1 Pro
- **Ratrig**: V-Core, V-Minion
- **Any other** Klipper + Moonraker-based printer

## 3D model viewing

3DPrintForge integrates the 3MF Consortium's official tools for 3D model viewing:

### 3MF files (Library and History)
- **3mfViewer** from [3MFConsortium](https://github.com/3MFConsortium/3mfViewer) — full 3D viewer with scene tree, materials, wireframe and colours
- **lib3mf WASM** for spec-compliant parsing of metadata, thumbnails and mesh data
- Upload 3MF files directly to print history for 3D viewing

### Gcode toolpath (Moonraker and Bambu)
- Per-layer colour visualisation (blue bottom → red top)
- Automatic download from Moonraker HTTP API or Bambu FTPS
- Downsampling for large files (max 100k segments)

### Printer-specific access
| Printer type | 3MF access | Gcode access |
|-------------|------------|--------------|
| Bambu Lab | FTPS (port 990) | Embedded in gcode.3mf |
| Moonraker/Klipper | Not on printer | HTTP API `/server/files/gcodes/` |
| Library files | Local disk | N/A |

## Technical overview

3DPrintForge is built with Node.js 22 and vanilla HTML/CSS/JS — no heavy frameworks, no build step. The database is SQLite, built into Node.js 22.

- **Backend**: Node.js 22 with 6 npm packages (mqtt, ws, basic-ftp, admin-lte, ssh2, @3mfconsortium/lib3mf)
- **Frontend**: AdminLTE 4 + vanilla HTML/CSS/JS + Three.js (vendored) + 3mfViewer (embedded), no build step
- **Database**: SQLite (built into Node.js 22)
- **3D viewing**: Three.js r183 + 3MFConsortium 3mfViewer + lib3mf WASM
- **Documentation**: Docusaurus with English and Norwegian, automatically built at installation
- **API**: 180+ endpoints, OpenAPI documentation at `/api/docs`

See [Architecture](./advanced/architecture) for details.
