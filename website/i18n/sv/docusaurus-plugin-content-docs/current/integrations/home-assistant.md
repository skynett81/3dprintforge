---
sidebar_position: 1
title: Home Assistant
description: Integrera 3DPrintForge med Home Assistant via MQTT-discovery, automatiserade enheter och automatiseringsexempel
---

# Home Assistant

Home Assistant-integrationen exponerar alla Bambu Lab-skrivare som enheter i Home Assistant via MQTT Discovery — automatiskt, utan manuell konfiguration av YAML.

Gå till: **https://localhost:3443/#settings** → fliken **Integrationer → Home Assistant**

## Förutsättningar

- Home Assistant körs i nätverket
- MQTT-broker (Mosquitto) installerad och konfigurerad i Home Assistant
- 3DPrintForge och Home Assistant använder samma MQTT-broker

## Aktivera MQTT Discovery

1. Gå till **Inställningar → Integrationer → Home Assistant**
2. Fyll i MQTT-brokerinställningar (om de inte redan är konfigurerade):
   - **Brokeradress**: t.ex. `192.168.1.100`
   - **Port**: `1883` (eller `8883` för TLS)
   - **Användarnamn och lösenord**: om det krävs av brokern
3. Aktivera **MQTT Discovery**
4. Ange **Discovery-prefix**: standard är `homeassistant`
5. Klicka **Spara och aktivera**

3DPrintForge publicerar nu discovery-meddelanden för alla registrerade skrivare.

## Enheter i Home Assistant

Efter aktivering visas en ny enhet per skrivare i Home Assistant (**Inställningar → Enheter och tjänster → MQTT**):

### Entitets-ID-mönster

Entitets-ID:n följer mönstret `sensor.{printer_name_slug}_{sensor_id}`, där `printer_name_slug` är skrivarnamnet i lowercase med specialtecken ersatta av understreck. Exempel: en skrivare med namnet «Min P1S» ger `sensor.min_p1s_status`.

### Sensorer (läsa)

| Sensor-ID | Enhet | Exempel |
|---|---|---|
| `{slug}_status` | text | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | tal | `124` |
| `{slug}_total_layers` | tal | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | text | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | text | `-65dBm` |

### Binära sensorer

| Sensor-ID | Tillstånd |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Notera
Knappar (pause/återuppta/stopp) publiceras inte via MQTT Discovery. Använd 3DPrintForge-API:et för att skicka kommandon från automatiseringar.
:::

## Automatiseringsexempel

### Avisera på mobil när utskriften är klar

Ersätt `min_p1s` med din skrivares namnslug.

```yaml
automation:
  - alias: "Bambu - Utskrift klar"
    trigger:
      - platform: state
        entity_id: binary_sensor.min_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.min_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_min_telefon
        data:
          title: "Utskrift klar!"
          message: "{{ states('sensor.min_p1s_current_file') }} är klar."
```

### Dimma belysning när utskriften startar

```yaml
automation:
  - alias: "Bambu - Dimma ljus under utskrift"
    trigger:
      - platform: state
        entity_id: binary_sensor.min_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.källaren
        data:
          brightness_pct: 30
```

## Energiövervakning

Strömätning via Shelly eller Tasmota hanteras separat och exponeras inte direkt via MQTT Discovery till Home Assistant. Se [Strömätning](./power) för inställning av smart-plug.
