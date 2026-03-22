---
sidebar_position: 1
title: Home Assistant
description: Integrieren Sie Bambu Dashboard mit Home Assistant über MQTT-Discovery, automatisierte Entitäten und Automatisierungsbeispiele
---

# Home Assistant

Die Home-Assistant-Integration macht alle Bambu Lab-Drucker als Geräte in Home Assistant über MQTT Discovery verfügbar — automatisch, ohne manuelle YAML-Konfiguration.

Navigieren Sie zu: **https://localhost:3443/#settings** → Reiter **Integrationen → Home Assistant**

## Voraussetzungen

- Home Assistant läuft im Netzwerk
- MQTT-Broker (Mosquitto) in Home Assistant installiert und konfiguriert
- Bambu Dashboard und Home Assistant verwenden denselben MQTT-Broker

## MQTT Discovery aktivieren

1. Gehen Sie zu **Einstellungen → Integrationen → Home Assistant**
2. MQTT-Broker-Einstellungen ausfüllen (sofern noch nicht konfiguriert):
   - **Broker-Adresse**: z.B. `192.168.1.100`
   - **Port**: `1883` (oder `8883` für TLS)
   - **Benutzername und Passwort**: wenn vom Broker erforderlich
3. **MQTT Discovery** aktivieren
4. **Discovery-Präfix** festlegen: Standard ist `homeassistant`
5. Klicken Sie auf **Speichern und aktivieren**

Bambu Dashboard veröffentlicht nun Discovery-Nachrichten für alle registrierten Drucker.

## Geräte in Home Assistant

Nach der Aktivierung erscheint ein neues Gerät pro Drucker in Home Assistant (**Einstellungen → Geräte & Dienste → MQTT**):

### Entitäts-ID-Muster

Entitäts-IDs folgen dem Muster `sensor.{drucker_name_slug}_{sensor_id}`, wobei `drucker_name_slug` der Druckername in Kleinbuchstaben mit Sonderzeichen als Unterstriche ist. Beispiel: ein Drucker mit dem Namen „Mein P1S" ergibt `sensor.mein_p1s_status`.

### Sensoren (Lesen)

| Sensor-ID | Einheit | Beispiel |
|---|---|---|
| `{slug}_status` | Text | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | Min | `83` |
| `{slug}_layer` | Zahl | `124` |
| `{slug}_total_layers` | Zahl | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | Text | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | Text | `-65dBm` |

### Binäre Sensoren

| Sensor-ID | Zustand |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Hinweis
Schaltflächen (Pause/Fortsetzen/Stopp) werden nicht über MQTT Discovery veröffentlicht. Verwenden Sie die Bambu Dashboard-API, um Befehle aus Automatisierungen zu senden.
:::

## Automatisierungsbeispiele

### Mobil benachrichtigen, wenn Druck fertig ist

Ersetzen Sie `mein_p1s` mit dem Namen-Slug Ihres Druckers.

```yaml
automation:
  - alias: "Bambu - Druck fertig"
    trigger:
      - platform: state
        entity_id: binary_sensor.mein_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.mein_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_mein_telefon
        data:
          title: "Druck fertig!"
          message: "{{ states('sensor.mein_p1s_current_file') }} ist fertig."
```

### Licht dimmen, wenn Druck startet

```yaml
automation:
  - alias: "Bambu - Licht während des Drucks dimmen"
    trigger:
      - platform: state
        entity_id: binary_sensor.mein_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.keller
        data:
          brightness_pct: 30
```

## Energieüberwachung

Strommessung über Shelly oder Tasmota wird separat behandelt und nicht direkt über MQTT Discovery an Home Assistant weitergegeben. Siehe [Strommessung](./power) für die Einrichtung eines Smart Plugs.
