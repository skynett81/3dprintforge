---
sidebar_position: 1
title: Print Guard
description: Automatic monitoring with XCam event detection, sensor monitoring, and configurable actions on anomalies
---

# Print Guard

Print Guard is Bambu Dashboard's real-time monitoring system. It continuously monitors the camera, sensors, and printer data, and performs configurable actions when something is wrong.

Go to: **https://localhost:3443/#protection**

## XCam event detection

Bambu Lab printers send XCam events via MQTT when the AI camera detects issues:

| Event | Code | Severity |
|-------|------|----------|
| Spaghetti detected | `xcam_spaghetti` | Critical |
| Plate detachment | `xcam_detach` | High |
| First layer malfunction | `xcam_first_layer` | High |
| Stringing | `xcam_stringing` | Medium |
| Extrusion error | `xcam_extrusion` | High |

For each event type you can configure one or more actions:

- **Notify** — send notification via active notification channels
- **Pause** — pause the print for manual inspection
- **Stop** — cancel the print immediately
- **None** — ignore the event (still log it)

:::danger Default behavior
By default, XCam events are set to **Notify** and **Pause**. Change to **Stop** if you fully trust the AI detection.
:::

## Sensor monitoring

Print Guard continuously monitors sensor data and triggers alerts on anomalies:

### Temperature deviation

1. Go to **Print Guard → Temperature**
2. Set **Max deviation from target temperature** (recommended: ±5°C for nozzle, ±3°C for bed)
3. Choose **Action on deviation**: Notify / Pause / Stop
4. Set **Delay** (seconds) before action is taken — gives the temperature time to stabilize

### Filament low

The system calculates remaining filament on spools:

1. Go to **Print Guard → Filament**
2. Set **Minimum threshold** in grams (e.g. 50 g)
3. Choose action: **Pause and notify** (recommended) to change spool manually

### Print stop detection

Detects when a print has stopped unexpectedly (MQTT timeout, filament break, etc.):

1. Enable **Stop detection**
2. Set **Timeout** (recommended: 120 seconds without data = stopped)
3. Action: Always notify — the print may already have stopped

## Configuration

### Enabling Print Guard

1. Go to **Settings → Print Guard**
2. Turn on **Enable Print Guard**
3. Select which printers should be monitored
4. Click **Save**

### Per-printer rules

Different printers can have different rules:

1. Click on a printer in the Print Guard overview
2. Turn off **Inherit global rules**
3. Configure custom rules for this printer

## Log and event history

All Print Guard events are logged:

- Go to **Print Guard → Log**
- Filter by printer, event type, date, and severity
- Click on an event to see detailed information and any actions that were taken
- Export log to CSV

:::tip False positives
If Print Guard triggers unnecessary pauses, adjust the sensitivity under **Print Guard → Settings → Sensitivity**. Start with "Low" and increase gradually.
:::
