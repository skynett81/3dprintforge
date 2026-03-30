---
sidebar_position: 1
title: Features Overview
description: Complete overview of all features in Bambu Dashboard
---

# Features Overview

Bambu Dashboard brings everything you need to monitor and control your Bambu Lab printers together in one place.

## Dashboard

The main dashboard shows real-time status for the active printer:

- **Temperature** — animated SVG ring gauges for nozzle and bed
- **Progress** — percentage progress with estimated finish time
- **Camera** — live camera view (RTSPS → MPEG1 via ffmpeg)
- **AMS panel** — visual representation of all AMS slots with filament color
- **Speed control** — slider to adjust speed (Silent, Standard, Sport, Turbo)
- **Statistics panels** — Grafana-style panels with scrolling graphs
- **Telemetry** — live values for fans, temperatures, pressure

Panels can be dragged and dropped to customize the layout. Use the lock button to lock the layout.

## Filament inventory

See [Filament](./filament) for full documentation.

- Track all spools with name, color, weight, and vendor
- AMS synchronization — see which spools are loaded in the AMS
- Drying log and drying schedule
- Color card and NFC tag support
- Import/export (CSV)

## Print history

See [History](./history) for full documentation.

- Complete log of all prints
- Filament tracking per print
- Links to MakerWorld models
- Statistics and export to CSV

## Scheduler

See [Scheduler](./scheduler) for full documentation.

- Calendar view of prints
- Print queue with prioritization
- Multi-printer dispatch

## Printer control

See [Controls](./controls) for full documentation.

- Temperature control (nozzle, bed, chamber)
- Speed profile control
- Fan control
- G-code console
- Filament load/unload

## Notifications

Bambu Dashboard supports 7 notification channels:

| Channel | Events |
|---------|--------|
| Telegram | Print complete, error, pause |
| Discord | Print complete, error, pause |
| Email | Print complete, error |
| ntfy | All events |
| Pushover | All events |
| SMS (Twilio) | Critical errors |
| Webhook | Custom payload |

Configure under **Settings → Notifications**.

## Print Guard

Print Guard monitors an active print via camera (xcam) and sensors:

- Automatic pause on spaghetti failure
- Configurable sensitivity level
- Log of detected events

## Maintenance

The maintenance section tracks:

- Next recommended service per component (nozzle, plates, AMS)
- Wear tracking based on print history
- Manual registration of maintenance tasks

## Multi-printer

With multi-printer support you can:

- Manage multiple printers from one dashboard
- Switch between printers with the printer selector
- View status overview for all printers simultaneously
- Distribute print jobs with the print queue

## OBS overlay

A dedicated `obs.html` page provides a clean overlay for OBS Studio integration when livestreaming prints.

## Updates

Built-in auto-update via GitHub Releases. Notification and update directly from the dashboard under **Settings → Update**.
