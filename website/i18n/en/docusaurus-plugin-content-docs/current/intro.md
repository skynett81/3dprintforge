---
sidebar_position: 1
title: Welcome to Bambu Dashboard
description: A powerful, self-hosted dashboard for Bambu Lab 3D printers
---

# Welcome to Bambu Dashboard

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**Bambu Dashboard** is a self-hosted, full-featured control panel for Bambu Lab 3D printers. It gives you complete visibility and control over your printer, filament inventory, print history, and more — all from a single browser tab.

## What is Bambu Dashboard?

Bambu Dashboard connects directly to your printer via MQTT over LAN, with no dependency on Bambu Lab's servers. You can also connect to Bambu Cloud for synchronisation of models and print history.

### Key features

- **Live dashboard** — real-time temperature, progress, camera, AMS status with LIVE indicator
- **Filament inventory** — track all spools with AMS sync, EXT spool support, material info, plate compatibility, and drying guide
- **Filament tracking** — accurate tracking with 4-level fallback (AMS sensor → EXT estimate → cloud → duration)
- **Material guide** — 15 materials with temperatures, plate compatibility, drying, properties, and tips
- **Print history** — complete log with model names, MakerWorld links, filament consumption, and costs
- **Planner** — calendar view, print queue with load balancing and filament check
- **Printer control** — temperature, speed, fans, G-code console
- **Print Guard** — automatic protection with xcam + 5 sensor monitors
- **Cost estimator** — material, electricity, labour, wear, markup with suggested sale price
- **Maintenance** — tracking with KB-based intervals, nozzle lifespan, plate lifespan, and guide
- **Sound alerts** — 9 configurable events with custom sound upload and printer speaker (M300)
- **Activity log** — persistent timeline from all events (prints, errors, maintenance, filament)
- **Notifications** — 7 channels (Telegram, Discord, email, ntfy, Pushover, SMS, webhook)
- **Multi-printer** — supports the entire Bambu Lab range
- **17 languages** — Norwegian, English, German, French, Spanish, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Swedish, Turkish, Ukrainian, Chinese, Czech, Hungarian
- **Self-hosted** — no cloud dependency, your data on your machine

### New in v1.1.14

- **AdminLTE 4 integration** — complete HTML restructuring with treeview sidebar, modern layout and CSP support for CDN
- **CRM system** — full customer management with 4 panels: customers, orders, invoices and company settings with history integration
- **Modern UI** — teal accent, gradient titles, hover glow, floating orbs and improved dark theme
- **Achievements: 18 landmarks** — Viking ship, Statue of Liberty, Eiffel Tower, Big Ben, Brandenburg Gate, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, Dutch windmill, Wawel Dragon, Cristo Redentor, Turning Torso, Hagia Sophia, The Motherland, Great Wall of China, Prague Astronomical Clock, Budapest Parliament — with detail popup, XP and rarity
- **AMS humidity/temperature** — 5-level rating with recommendations for storage and drying
- **Live filament tracking** — real-time updates during printing via cloud estimate fallback
- **Filament section redesign** — large spools with full info (brand, weight, temp, RFID, colour), horizontal layout and click-for-details
- **EXT spool inline** — external spool displayed alongside AMS spools with better space usage
- **Dashboard layout optimised** — 2-column default for 24-27" monitors, large 3D/camera, compact filament/AMS
- **Filament change time** in cost estimator with visible change counter
- **Global alert system** — alert bar with toast notifications in bottom-right, does not block navbar
- **Guided tour i18n** — all 14 tour keys translated into 17 languages
- **5 new KB pages** — compatibility matrix and new filament guides translated into 17 languages
- **Complete i18n** — all 3252 keys translated into 17 languages including CRM and landmark achievements

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

All Bambu Lab printers with LAN mode:

- **X1 series**: X1C, X1C Combo, X1E
- **P1 series**: P1S, P1S Combo, P1P
- **P2 series**: P2S, P2S Combo
- **A series**: A1, A1 Combo, A1 mini
- **H2 series**: H2S, H2D (dual nozzle), H2C (tool changer, 6 heads)

## Features in detail

### Filament tracking

The dashboard tracks filament consumption automatically with a 4-level fallback:

1. **AMS sensor diff** — most accurate, compares start/end remain%
2. **EXT direct** — for P2S/A1 without vt_tray, uses cloud estimate
3. **Cloud estimate** — from Bambu Cloud print job data
4. **Duration estimate** — ~30g/hour as last fallback

All values are shown as the minimum of AMS sensor and spool database to avoid errors after failed prints.

### Material guide

Built-in database with 15 materials including:
- Temperatures (nozzle, bed, chamber)
- Plate compatibility (Cool, Engineering, High Temp, Textured PEI)
- Drying information (temperature, time, hygroscopicity)
- 8 properties (strength, flexibility, heat resistance, UV, surface, ease of use)
- Difficulty level and special requirements (hardened nozzle, enclosure)

### Sound alerts

9 configurable events with support for:
- **Custom audio clips** — upload MP3/OGG/WAV (max 10 seconds, 500 KB)
- **Built-in tones** — metallic/synth sounds generated with Web Audio API
- **Printer speaker** — M300 G-code melodies directly on the printer's buzzer
- **Countdown** — audio alert when 1 minute remains of the print

### Maintenance

Complete maintenance system with:
- Component tracking (nozzle, PTFE tube, rods, bearings, AMS, plate, drying)
- KB-based intervals from documentation
- Nozzle lifespan per type (brass, hardened steel, HS01)
- Plate lifespan per type (Cool, Engineering, High Temp, Textured PEI)
- Guide tab with tips and links to full documentation

## Technical overview

Bambu Dashboard is built with Node.js 22 and vanilla HTML/CSS/JS — no heavy frameworks, no build step. The database is SQLite, built into Node.js 22.

- **Backend**: Node.js 22 with only 3 npm packages (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, no build step
- **Database**: SQLite via Node.js 22 built-in `--experimental-sqlite`
- **Documentation**: Docusaurus with 17 languages, automatically built at installation
- **API**: 177+ endpoints, OpenAPI documentation at `/api/docs`

See [Architecture](./advanced/architecture) for details.
