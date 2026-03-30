---
sidebar_position: 3
title: Diagnose
description: Gesundheitsscore, Telemetriediagramme, Bed-Mesh-Visualisierung und Komponentenüberwachung für Bambu Lab-Drucker
---

# Diagnose

Die Diagnoseseite bietet Ihnen einen tiefgehenden Überblick über den Gesundheitszustand, die Leistung und den Zustand des Druckers über die Zeit.

Navigieren Sie zu: **https://localhost:3443/#diagnostics**

## Gesundheitsscore

Jeder Drucker berechnet einen **Gesundheitsscore** von 0–100 basierend auf:

| Faktor | Gewichtung | Beschreibung |
|---|---|---|
| Erfolgsrate (30d) | 30 % | Anteil erfolgreicher Drucke in den letzten 30 Tagen |
| Komponentenverschleiß | 25 % | Durchschnittlicher Verschleiß kritischer Teile |
| HMS-Fehler (30d) | 20 % | Anzahl und Schweregrad von Fehlern |
| Kalibrierungsstatus | 15 % | Zeit seit letzter Kalibrierung |
| Temperaturstabilität | 10 % | Abweichung von der Zieltemperatur während des Druckens |

**Score-Interpretation:**
- 🟢 80–100 — Ausgezeichneter Zustand
- 🟡 60–79 — Gut, aber einiges sollte untersucht werden
- 🟠 40–59 — Reduzierte Leistung, Wartung empfohlen
- 🔴 0–39 — Kritisch, Wartung erforderlich

:::tip Historie
Klicken Sie auf den Gesundheitsgraphen, um die Entwicklung des Scores über die Zeit anzuzeigen. Große Einbrüche können auf ein bestimmtes Ereignis hinweisen.
:::

## Telemetriediagramme

Die Telemetrieseite zeigt interaktive Diagramme für alle Sensorwerte:

### Verfügbare Datensätze

- **Düsentemperatur** — tatsächlich vs. Ziel
- **Betttemperatur** — tatsächlich vs. Ziel
- **Kammertemperatur** — Umgebungstemperatur im Inneren der Maschine
- **Extrudermotor** — Stromverbrauch und Temperatur
- **Lüftergeschwindigkeiten** — Werkzeugkopf, Kammer, AMS
- **Druck** (X1C) — Kammerdruck für AMS
- **Beschleunigung** — Vibrationsdaten (ADXL345)

### In Diagrammen navigieren

1. **Zeitraum** auswählen: Letzte Stunde / 24 Stunden / 7 Tage / 30 Tage / Benutzerdefiniert
2. **Drucker** aus der Dropdown-Liste auswählen
3. **Datensätze** zum Anzeigen auswählen (Mehrfachauswahl möglich)
4. Scrollen zum Vergrößern der Zeitlinie
5. Klicken und ziehen zum Verschieben
6. Doppelklicken zum Zurücksetzen des Zooms

### Telemetriedaten exportieren

1. Klicken Sie auf **Exportieren** im Diagramm
2. Format auswählen: **CSV**, **JSON** oder **PNG** (Bild)
3. Der ausgewählte Zeitraum und Datensatz werden exportiert

## Bed Mesh

Die Bed-Mesh-Visualisierung zeigt die Ebenheitskalibrierung der Druckplatte:

1. Gehen Sie zu **Diagnose → Bed Mesh**
2. Drucker auswählen
3. Das letzte Mesh wird als 3D-Oberfläche und Heatmap angezeigt:
   - **Blau** — niedriger als Mitte (konkav)
   - **Grün** — annähernd flach
   - **Rot** — höher als Mitte (konvex)
4. Fahren Sie mit der Maus über einen Punkt, um die genaue Abweichung in mm zu sehen

### Bed Mesh über UI scannen

1. Klicken Sie auf **Jetzt scannen** (erfordert, dass der Drucker frei ist)
2. Im Dialog bestätigen — der Drucker startet automatisch die Kalibrierung
3. Warten Sie bis der Scan abgeschlossen ist (ca. 3–5 Minuten)
4. Das neue Mesh wird automatisch angezeigt

:::warning Zuerst aufheizen
Bed Mesh sollte mit aufgeheiztem Bett (50–60 °C für PLA) gescannt werden, um eine genaue Kalibrierung zu erhalten.
:::

## Komponentenverschleiß

Siehe [Verschleißprognose](./wearprediction) für detaillierte Dokumentation.

Die Diagnoseseite zeigt eine komprimierte Übersicht:
- Prozentualer Score pro Komponente
- Nächste empfohlene Wartung
- Klicken Sie auf **Details** für vollständige Verschleißanalyse
