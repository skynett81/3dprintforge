---
sidebar_position: 1
title: Print Guard
description: Automatische Überwachung mit XCam-Ereigniserkennung, Sensorüberwachung und konfigurierbaren Aktionen bei Abweichungen
---

# Print Guard

Print Guard ist das Echtzeit-Überwachungssystem von 3DPrintForge. Es überwacht kontinuierlich Kamera, Sensoren und Druckerdaten und führt konfigurierbare Aktionen aus, wenn etwas nicht stimmt.

Navigieren Sie zu: **https://localhost:3443/#protection**

## XCam-Ereigniserkennung

Bambu Lab-Drucker senden XCam-Ereignisse über MQTT, wenn die KI-Kamera Probleme erkennt:

| Ereignis | Code | Schweregrad |
|---|---|---|
| Spaghetti erkannt | `xcam_spaghetti` | Kritisch |
| Plattenablösung | `xcam_detach` | Hoch |
| Fehlfunktion erste Lage | `xcam_first_layer` | Hoch |
| Stringing | `xcam_stringing` | Mittel |
| Extrusionsfehler | `xcam_extrusion` | Hoch |

Für jeden Ereignistyp können Sie eine oder mehrere Aktionen konfigurieren:

- **Benachrichtigen** — Benachrichtigung über aktive Benachrichtigungskanäle senden
- **Pausieren** — Druck für manuelle Überprüfung pausieren
- **Stoppen** — Druck sofort abbrechen
- **Keine** — Ereignis ignorieren (trotzdem protokollieren)

:::danger Standardverhalten
Standardmäßig sind XCam-Ereignisse auf **Benachrichtigen** und **Pausieren** gesetzt. Ändern Sie es auf **Stoppen**, wenn Sie der KI-Erkennung vollständig vertrauen.
:::

## Sensorüberwachung

Print Guard überwacht Sensordaten kontinuierlich und schlägt bei Abweichungen Alarm:

### Temperaturabweichung

1. Gehen Sie zu **Print Guard → Temperatur**
2. Setzen Sie **Maximale Abweichung von der Zieltemperatur** (empfohlen: ±5 °C für Düse, ±3 °C für Bett)
3. Wählen Sie **Aktion bei Abweichung**: Benachrichtigen / Pausieren / Stoppen
4. Setzen Sie **Verzögerung** (Sekunden) vor der Aktion — gibt der Temperatur Zeit zur Stabilisierung

### Filament niedrig

Das System berechnet das verbleibende Filament auf den Spulen:

1. Gehen Sie zu **Print Guard → Filament**
2. Setzen Sie den **Mindestschwellenwert** in Gramm (z.B. 50 g)
3. Aktion wählen: **Pausieren und benachrichtigen** (empfohlen) zum manuellen Spulenwechsel

### Druckstopp-Erkennung

Erkennt, wenn der Druck unerwartet gestoppt wurde (MQTT-Timeout, Filamentbruch usw.):

1. Aktivieren Sie **Stopperkennung**
2. Setzen Sie den **Timeout** (empfohlen: 120 Sekunden ohne Daten = gestoppt)
3. Aktion: Immer benachrichtigen — der Druck kann bereits gestoppt sein

## Konfiguration

### Print Guard aktivieren

1. Gehen Sie zu **Einstellungen → Print Guard**
2. Aktivieren Sie **Print Guard aktivieren**
3. Wählen Sie, welche Drucker überwacht werden sollen
4. Klicken Sie auf **Speichern**

### Druckerspezifische Regeln

Verschiedene Drucker können unterschiedliche Regeln haben:

1. Klicken Sie auf einen Drucker in der Print Guard-Übersicht
2. Deaktivieren Sie **Globale Regeln übernehmen**
3. Konfigurieren Sie eigene Regeln für diesen Drucker

## Protokoll und Ereignishistorie

Alle Print Guard-Ereignisse werden protokolliert:

- Gehen Sie zu **Print Guard → Protokoll**
- Filtern nach Drucker, Ereignistyp, Datum und Schweregrad
- Klicken Sie auf ein Ereignis, um detaillierte Informationen und durchgeführte Aktionen anzuzeigen
- Protokoll als CSV exportieren

:::tip Falsch-Positive
Wenn Print Guard unnötige Pausen auslöst, passen Sie die Empfindlichkeit unter **Print Guard → Einstellungen → Empfindlichkeit** an. Beginnen Sie mit „Niedrig" und erhöhen Sie schrittweise.
:::
