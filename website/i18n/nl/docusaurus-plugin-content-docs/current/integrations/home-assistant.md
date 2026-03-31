---
sidebar_position: 1
title: Home Assistant
description: Integreer 3DPrintForge met Home Assistant via MQTT-detectie, geautomatiseerde entiteiten en automatiseringsvoorbeelden
---

# Home Assistant

De Home Assistant-integratie maakt alle Bambu Lab-printers beschikbaar als apparaten in Home Assistant via MQTT Discovery — automatisch, zonder handmatige YAML-configuratie.

Ga naar: **https://localhost:3443/#settings** → tabblad **Integraties → Home Assistant**

## Vereisten

- Home Assistant actief in het netwerk
- MQTT-broker (Mosquitto) geïnstalleerd en geconfigureerd in Home Assistant
- 3DPrintForge en Home Assistant gebruiken dezelfde MQTT-broker

## MQTT Discovery activeren

1. Ga naar **Instellingen → Integraties → Home Assistant**
2. Vul de MQTT-brokerinstellingen in (indien nog niet geconfigureerd):
   - **Brokeradres**: bijv. `192.168.1.100`
   - **Poort**: `1883` (of `8883` voor TLS)
   - **Gebruikersnaam en wachtwoord**: indien vereist door de broker
3. Activeer **MQTT Discovery**
4. Stel het **Discovery-prefix** in: standaard is `homeassistant`
5. Klik op **Opslaan en activeren**

3DPrintForge publiceert nu discovery-berichten voor alle geregistreerde printers.

## Apparaten in Home Assistant

Na activering verschijnt er een nieuw apparaat per printer in Home Assistant (**Instellingen → Apparaten en diensten → MQTT**):

### Entiteit-ID-patroon

Entiteit-ID's volgen het patroon `sensor.{printer_name_slug}_{sensor_id}`, waarbij `printer_name_slug` de printernaam is in kleine letters met speciale tekens vervangen door underscores. Voorbeeld: een printer met de naam «Mijn P1S» geeft `sensor.mijn_p1s_status`.

### Sensoren (lezen)

| Sensor-ID | Eenheid | Voorbeeld |
|---|---|---|
| `{slug}_status` | tekst | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | getal | `124` |
| `{slug}_total_layers` | getal | `280` |
| `{slug}_nozzle_temp` | °C | `220,5` |
| `{slug}_nozzle_target` | °C | `220,0` |
| `{slug}_bed_temp` | °C | `60,1` |
| `{slug}_bed_target` | °C | `60,0` |
| `{slug}_chamber_temp` | °C | `34,2` |
| `{slug}_current_file` | tekst | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | tekst | `-65dBm` |

### Binaire sensoren

| Sensor-ID | Toestand |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Opmerking
Knoppen (pauzeren/hervatten/stoppen) worden niet gepubliceerd via MQTT Discovery. Gebruik de 3DPrintForge-API om opdrachten te sturen vanuit automatiseringen.
:::

## Automatiseringsvoorbeelden

### Melding op telefoon wanneer print klaar is

Vervang `mijn_p1s` door de naam-slug van uw printer.

```yaml
automation:
  - alias: "Bambu - Print klaar"
    trigger:
      - platform: state
        entity_id: binary_sensor.mijn_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.mijn_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_mijn_telefoon
        data:
          title: "Print klaar!"
          message: "{{ states('sensor.mijn_p1s_current_file') }} is klaar."
```

### Lichten dimmen wanneer print start

```yaml
automation:
  - alias: "Bambu - Lichten dimmen tijdens printen"
    trigger:
      - platform: state
        entity_id: binary_sensor.mijn_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.werkruimte
        data:
          brightness_pct: 30
```

## Energiemonitoring

Stroommetingen via Shelly of Tasmota worden afzonderlijk afgehandeld en worden niet direct via MQTT Discovery naar Home Assistant gepubliceerd. Zie [Stroommonitoring](./power) voor het instellen van de slimme stekker.
