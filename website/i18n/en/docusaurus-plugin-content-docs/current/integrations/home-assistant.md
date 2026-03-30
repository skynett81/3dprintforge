---
sidebar_position: 1
title: Home Assistant
description: Integrate Bambu Dashboard with Home Assistant via MQTT discovery, automated entities, and automation examples
---

# Home Assistant

The Home Assistant integration exposes all Bambu Lab printers as devices in Home Assistant via MQTT Discovery — automatically, without manual YAML configuration.

Go to: **https://localhost:3443/#settings** → the **Integrations → Home Assistant** tab

## Prerequisites

- Home Assistant running on the network
- MQTT broker (Mosquitto) installed and configured in Home Assistant
- Bambu Dashboard and Home Assistant using the same MQTT broker

## Enabling MQTT Discovery

1. Go to **Settings → Integrations → Home Assistant**
2. Fill in MQTT broker settings (if not already configured):
   - **Broker address**: e.g. `192.168.1.100`
   - **Port**: `1883` (or `8883` for TLS)
   - **Username and password**: if required by the broker
3. Enable **MQTT Discovery**
4. Set **Discovery prefix**: default is `homeassistant`
5. Click **Save and enable**

Bambu Dashboard now publishes discovery messages for all registered printers.

## Devices in Home Assistant

After activation, a new device per printer appears in Home Assistant (**Settings → Devices & Services → MQTT**):

### Sensors (read)

| Entity | Unit | Example |
|--------|------|---------|
| `sensor.printer_nozzle_temp` | °C | `220.5` |
| `sensor.printer_bed_temp` | °C | `60.1` |
| `sensor.printer_chamber_temp` | °C | `34.2` |
| `sensor.printer_progress` | % | `47` |
| `sensor.printer_remaining_time` | min | `83` |
| `sensor.printer_filament_used` | g | `23.4` |
| `sensor.printer_status` | text | `printing` |
| `sensor.printer_current_file` | text | `benchy.3mf` |
| `sensor.printer_layer` | text | `124 / 280` |

### Binary sensors

| Entity | State |
|--------|-------|
| `binary_sensor.printer_printing` | `on` / `off` |
| `binary_sensor.printer_error` | `on` / `off` |
| `binary_sensor.printer_door_open` | `on` / `off` (X1C) |

### Buttons (actions)

| Entity | Action |
|--------|--------|
| `button.printer_pause` | Pause ongoing print |
| `button.printer_resume` | Resume paused print |
| `button.printer_stop` | Stop ongoing print |

:::danger Stop button
The stop button in Home Assistant cancels the print without a confirmation dialog. Use with caution in automations.
:::

## Automation examples

### Notify on phone when print is complete

```yaml
automation:
  - alias: "Bambu - Print complete"
    trigger:
      - platform: state
        entity_id: binary_sensor.printer_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.printer_status
        state: "finish"
    action:
      - service: notify.mobile_app_my_phone
        data:
          title: "Print complete!"
          message: "{{ states('sensor.printer_current_file') }} is done."
```

### Dim lights when print starts

```yaml
automation:
  - alias: "Bambu - Dim lights during printing"
    trigger:
      - platform: state
        entity_id: binary_sensor.printer_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.basement
        data:
          brightness_pct: 30
```

## Energy monitoring

Combined with [Energy monitoring](./power), the following are also exposed:

- `sensor.printer_power_watts` — instantaneous power
- `sensor.printer_energy_kwh` — energy consumption for the ongoing print

See [Energy monitoring](./power) for smart plug setup.
