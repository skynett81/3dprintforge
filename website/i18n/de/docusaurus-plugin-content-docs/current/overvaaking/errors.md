---
sidebar_position: 2
title: Fehlerprotokoll
description: Vollständige Übersicht über HMS-Fehlercodes der Drucker mit Schweregrad, Suche und Links zum Bambu Wiki
---

# Fehlerprotokoll

Das Fehlerprotokoll sammelt alle Fehler und HMS-Meldungen (Health, Maintenance, Safety) Ihrer Drucker. Bambu Dashboard verfügt über eine integrierte Datenbank mit 269+ HMS-Codes für Bambu Lab-Drucker.

Navigieren Sie zu: **https://localhost:3443/#errors**

## HMS-Codes

Bambu Lab-Drucker senden HMS-Codes über MQTT, wenn etwas nicht stimmt. Bambu Dashboard übersetzt diese automatisch in lesbare Fehlermeldungen:

| Code | Beispiel | Kategorie |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Düse/Extruder |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Druckplatte |
| `0700 0500 0001 0001` | MC disconnect | Elektronik |

Die vollständige Liste deckt alle 269+ bekannten Codes für X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D und H2C ab.

## Schweregrad

Fehler werden in vier Stufen klassifiziert:

| Stufe | Farbe | Beschreibung |
|---|---|---|
| **Kritisch** | Rot | Sofortiges Handeln erforderlich — Druck gestoppt |
| **Hoch** | Orange | Sollte schnell behoben werden — Druck kann fortgesetzt werden |
| **Mittel** | Gelb | Sollte untersucht werden — keine unmittelbare Gefahr |
| **Info** | Blau | Informationsmeldung, keine Aktion erforderlich |

## Suche und Filterung

Verwenden Sie die Symbolleiste oben im Fehlerprotokoll:

1. **Volltextsuche** — in Fehlermeldung, HMS-Code oder Druckerbeschreibung suchen
2. **Drucker** — nur Fehler eines bestimmten Druckers anzeigen
3. **Kategorie** — AMS / Düse / Platte / Elektronik / Kalibrierung / Sonstiges
4. **Schweregrad** — Alle / Kritisch / Hoch / Mittel / Info
5. **Datum** — nach Datumsbereich filtern
6. **Unquittierte** — nur nicht quittierte Fehler anzeigen

Klicken Sie auf **Filter zurücksetzen**, um alle Fehler anzuzeigen.

## Wiki-Links

Für jeden HMS-Code wird ein Link zum Bambu Lab Wiki angezeigt mit:

- Vollständiger Fehlerbeschreibung
- Möglichen Ursachen
- Schritt-für-Schritt-Fehlerbehebungsanleitung
- Offizielle Bambu Lab-Empfehlungen

Klicken Sie auf **Wiki öffnen** bei einem Fehlereintrag, um die entsprechende Wiki-Seite in einem neuen Tab zu öffnen.

:::tip Lokale Kopie
Bambu Dashboard speichert Wiki-Inhalte lokal zur Offline-Nutzung. Die Inhalte werden wöchentlich automatisch aktualisiert.
:::

## Fehler quittieren

Das Quittieren markiert einen Fehler als behandelt, ohne ihn zu löschen:

1. Klicken Sie auf einen Fehler in der Liste
2. Klicken Sie auf **Quittieren** (Haken-Symbol)
3. Geben Sie eine optionale Notiz ein, was getan wurde
4. Der Fehler wird mit einem Haken markiert und in die „Quittierte"-Liste verschoben

### Massenquittierung

1. Wählen Sie mehrere Fehler mit Kontrollkästchen aus
2. Klicken Sie auf **Ausgewählte quittieren**
3. Alle ausgewählten Fehler werden gleichzeitig quittiert

## Statistiken

Oben im Fehlerprotokoll wird angezeigt:

- Gesamtanzahl der Fehler in den letzten 30 Tagen
- Anzahl der nicht quittierten Fehler
- Häufigster HMS-Code
- Drucker mit den meisten Fehlern

## Export

1. Klicken Sie auf **Exportieren** (Download-Symbol)
2. Format auswählen: **CSV** oder **JSON**
3. Der Filter wird auf den Export angewendet — setzen Sie zuerst den gewünschten Filter
4. Die Datei wird automatisch heruntergeladen

## Benachrichtigungen für neue Fehler

Benachrichtigungen für neue HMS-Fehler aktivieren:

1. Gehen Sie zu **Einstellungen → Benachrichtigungen**
2. Haken Sie **Neue HMS-Fehler** an
3. Wählen Sie den Mindest-Schweregrad für Benachrichtigungen (empfohlen: **Hoch** und höher)
4. Benachrichtigungskanal auswählen

Siehe [Benachrichtigungen](../funksjoner/notifications) für die Kanaleinrichtung.
