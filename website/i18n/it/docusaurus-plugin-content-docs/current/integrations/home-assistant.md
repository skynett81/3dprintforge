---
sidebar_position: 1
title: Home Assistant
description: Integra Bambu Dashboard con Home Assistant tramite rilevamento MQTT, entità automatizzate ed esempi di automazione
---

# Home Assistant

L'integrazione Home Assistant espone tutte le stampanti Bambu Lab come dispositivi in Home Assistant tramite MQTT Discovery — automaticamente, senza configurazione manuale in YAML.

Vai a: **https://localhost:3443/#settings** → scheda **Integrazioni → Home Assistant**

## Prerequisiti

- Home Assistant in esecuzione nella rete
- Broker MQTT (Mosquitto) installato e configurato in Home Assistant
- Bambu Dashboard e Home Assistant usano lo stesso broker MQTT

## Attivare MQTT Discovery

1. Vai a **Impostazioni → Integrazioni → Home Assistant**
2. Compila le impostazioni del broker MQTT (se non già configurato):
   - **Indirizzo broker**: ad es. `192.168.1.100`
   - **Porta**: `1883` (o `8883` per TLS)
   - **Nome utente e password**: se richiesto dal broker
3. Attiva **MQTT Discovery**
4. Imposta il **Prefisso discovery**: il predefinito è `homeassistant`
5. Clicca su **Salva e attiva**

Bambu Dashboard pubblica ora i messaggi di discovery per tutte le stampanti registrate.

## Dispositivi in Home Assistant

Dopo l'attivazione, viene mostrato un nuovo dispositivo per stampante in Home Assistant (**Impostazioni → Dispositivi e servizi → MQTT**):

### Schema ID Entità

Gli ID entità seguono lo schema `sensor.{printer_name_slug}_{sensor_id}`, dove `printer_name_slug` è il nome della stampante in minuscolo con i caratteri speciali sostituiti da trattini bassi. Esempio: una stampante con nome «La mia P1S» dà `sensor.la_mia_p1s_status`.

### Sensori (lettura)

| ID sensore | Unità | Esempio |
|---|---|---|
| `{slug}_status` | testo | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | numero | `124` |
| `{slug}_total_layers` | numero | `280` |
| `{slug}_nozzle_temp` | °C | `220,5` |
| `{slug}_nozzle_target` | °C | `220,0` |
| `{slug}_bed_temp` | °C | `60,1` |
| `{slug}_bed_target` | °C | `60,0` |
| `{slug}_chamber_temp` | °C | `34,2` |
| `{slug}_current_file` | testo | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | testo | `-65dBm` |

### Sensori Binari

| ID sensore | Stato |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Nota
I pulsanti (pausa/riprendi/stop) non vengono pubblicati tramite MQTT Discovery. Usa l'API di Bambu Dashboard per inviare comandi dalle automazioni.
:::

## Esempi di Automazione

### Notifica su telefono quando la stampa è terminata

Sostituisci `la_mia_p1s` con lo slug del nome della tua stampante.

```yaml
automation:
  - alias: "Bambu - Stampa terminata"
    trigger:
      - platform: state
        entity_id: binary_sensor.la_mia_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.la_mia_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_il_mio_telefono
        data:
          title: "Stampa terminata!"
          message: "{{ states('sensor.la_mia_p1s_current_file') }} è pronta."
```

### Abbassa le luci quando la stampa inizia

```yaml
automation:
  - alias: "Bambu - Abbassa luci durante la stampa"
    trigger:
      - platform: state
        entity_id: binary_sensor.la_mia_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.officina
        data:
          brightness_pct: 30
```

## Monitoraggio Energia

La misurazione di potenza tramite Shelly o Tasmota viene gestita separatamente e non viene esposta direttamente tramite MQTT Discovery a Home Assistant. Vedi [Misuratore di Potenza](./power) per la configurazione della presa smart.
