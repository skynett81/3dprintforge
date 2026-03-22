---
sidebar_position: 5
title: Printer Controls
description: Control temperature, speed, fans, and send G-code directly to the printer
---

# Printer Controls

The control panel gives you full manual control over the printer directly from the dashboard.

## Temperature control

### Nozzle
- Set target temperature between 0–350 °C
- Click **Set** to send the command
- Real-time reading displayed with animated ring gauge

### Heated bed
- Set target temperature between 0–120 °C
- Automatic shutoff after print (configurable)

### Chamber (X1C and P1S only)
- View chamber temperature (passive — not controllable)

:::warning Maximum temperatures
Do not exceed recommended temperatures for nozzle and bed. For hardened steel nozzle (HF type): max 300 °C. For brass: max 260 °C. See the printer manual.
:::

## Speed profiles

The speed control provides four preset profiles:

| Profile | Speed | Use case |
|---------|-------|----------|
| Silent | 50% | Noise reduction, night printing |
| Standard | 100% | Normal use |
| Sport | 124% | Faster prints |
| Turbo | 166% | Maximum speed (quality reduction) |

The slider lets you set a custom percentage between 50–200%.

## Fan control

Control fan speeds manually:

| Fan | Description | Range |
|-----|-------------|-------|
| Part cooling fan | Cools the printed object | 0–100% |
| Auxiliary fan | Chamber circulation | 0–100% |
| Chamber fan | Active chamber cooling | 0–100% |

:::tip Good settings
- **PLA/PETG:** Part cooling 100%, aux 30%
- **ABS/ASA:** Part cooling 0–20%, chamber fan off
- **TPU:** Part cooling 50%, low speed
:::

## G-code console

Send G-code commands directly to the printer:

```gcode
; Example: Move head position
G28 ; Home all axes
G1 X150 Y150 Z10 F3000 ; Move to center
M104 S220 ; Set nozzle temperature
M140 S60  ; Set bed temperature
```

:::danger Be careful with G-code
Incorrect G-code can damage the printer. Only send commands you understand. Avoid `M600` (filament change) in the middle of a print.
:::

## Filament operations

From the control panel you can:

- **Load filament** — heats up the nozzle and feeds filament
- **Unload filament** — heats up and retracts filament
- **Purge nozzle** — run a purge cycle

## Macros

Save and run sequences of G-code commands as macros:

1. Click **New macro**
2. Give the macro a name
3. Write the G-code sequence
4. Save and run with one click

Example macro for bed calibration:
```gcode
G28
M84
M500
```

## Print control

During an active print you can:

- **Pause** — pauses the print after the current layer
- **Resume** — continues a paused print
- **Stop** — cancels the print (not reversible)
- **Emergency stop** — immediate stop of all motors
