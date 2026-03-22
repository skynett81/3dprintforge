---
sidebar_position: 1
title: Welcome to Bambu Dashboard
description: A powerful, self-hosted dashboard for Bambu Lab 3D printers
---

# Welcome to Bambu Dashboard

**Bambu Dashboard** is a self-hosted, full-featured control panel for Bambu Lab 3D printers. It gives you complete visibility and control over your printer, filament inventory, print history, and more — all from a single browser tab.

## What is Bambu Dashboard?

Bambu Dashboard connects directly to your printer via MQTT over LAN, with no dependency on Bambu Lab's servers. You can also connect to Bambu Cloud for synchronization of models and print history.

### Key features

- **Live dashboard** — real-time temperature, progress, camera, AMS status
- **Filament inventory** — track all spools, colors, AMS sync, drying
- **Print history** — complete log with statistics and export
- **Scheduler** — calendar view and print queue
- **Printer control** — temperature, speed, fans, G-code console
- **Notifications** — 7 channels (Telegram, Discord, email, ntfy, Pushover, SMS, webhook)
- **Multi-printer** — supports P1S, P1P, X1C, A1, and A1 Mini
- **Self-hosted** — no cloud dependency, your data on your machine

## Quick start

| Task | Link |
|------|------|
| Install the dashboard | [Installation](./kom-i-gang/installasjon) |
| Configure your first printer | [Setup](./kom-i-gang/oppsett) |
| Connect to Bambu Cloud | [Bambu Cloud](./kom-i-gang/bambu-cloud) |
| Explore all features | [Features](./funksjoner/oversikt) |
| API documentation | [API](./avansert/api) |

:::tip Demo mode
You can try the dashboard without a physical printer by running `npm run demo`. This starts 3 simulated printers with live print cycles.
:::

## Supported printers

- Bambu Lab **X1C** / X1E
- Bambu Lab **P1S** / P1P
- Bambu Lab **A1** / A1 Mini

## Technical overview

Bambu Dashboard is built with Node.js 22 and vanilla HTML/CSS/JS — no heavy frameworks, no build step. The database is SQLite, built into Node.js 22. See [Architecture](./avansert/arkitektur) for details.
