---
sidebar_position: 2
title: Hauptpanel
description: Echtzeit-Übersicht des aktiven Druckers mit 3D-Modellansicht, AMS-Status, Kamera und anpassbaren Widgets
---

# Hauptpanel

Das Hauptpanel ist die zentrale Steuerzentrale im 3DPrintForge. Es zeigt den Echtzeitstatus des ausgewählten Druckers und ermöglicht das Überwachen, Steuern und Anpassen der Ansicht nach Bedarf.

Navigieren Sie zu: **https://localhost:3443/**

## Echtzeit-Übersicht

Wenn ein Drucker aktiv ist, werden alle Werte kontinuierlich über MQTT aktualisiert:

- **Düsentemperatur** — animierter SVG-Ringmesser mit Zieltemperatur
- **Betttemperatur** — entsprechender Ringmesser für die Druckplatte
- **Fortschrittsanzeige** — große Prozentanzeige mit verbleibender Zeit
- **Lagenzähler** — aktuelle Lage / Gesamtanzahl der Lagen
- **Geschwindigkeit** — Leise / Standard / Sport / Turbo mit Schieberegler

:::tip Echtzeit-Aktualisierung
Alle Werte werden direkt vom Drucker über MQTT aktualisiert, ohne die Seite neu zu laden. Die Verzögerung beträgt typischerweise weniger als 1 Sekunde.
:::

## 3D-Modellansicht

Wenn der Drucker eine `.3mf`-Datei mit dem Modell sendet, wird eine interaktive 3D-Vorschau angezeigt:

1. Das Modell wird automatisch geladen, wenn ein Druck startet
2. Drehen Sie das Modell durch Ziehen mit der Maus
3. Scrollen Sie zum Vergrößern/Verkleinern
4. Klicken Sie auf **Zurücksetzen**, um zur Standardansicht zurückzukehren

:::info Unterstützung
Die 3D-Ansicht erfordert, dass der Drucker Modelldaten sendet. Nicht alle Druckaufträge enthalten dies.
:::

## AMS-Status

Das AMS-Panel zeigt alle montierten AMS-Einheiten mit Schächten und Filament:

- **Schachtfarbe** — visuelle Farbdarstellung aus Bambu-Metadaten
- **Filamentname** — Material und Marke
- **Aktiver Schacht** — bei aktiven Drucken mit Pulsanimation markiert
- **Fehler** — rote Anzeige bei AMS-Fehlern (Blockierung, leer, feucht)

Klicken Sie auf einen Schacht, um vollständige Filamentinformationen anzuzeigen und diesen mit dem Filamentlager zu verknüpfen.

## Kamera-Feed

Die Live-Kameraansicht wird über ffmpeg konvertiert (RTSPS → MPEG1):

1. Die Kamera startet automatisch, wenn Sie das Dashboard öffnen
2. Klicken Sie auf das Kamerabild, um es im Vollbild zu öffnen
3. Verwenden Sie die **Snapshot**-Schaltfläche, um ein Standbild aufzunehmen
4. Klicken Sie auf **Kamera ausblenden**, um Platz freizugeben

:::warning Leistung
Der Kamerastream verbraucht ca. 2–5 Mbit/s. Deaktivieren Sie die Kamera bei langsamen Netzwerkverbindungen.
:::

## Temperatur-Sparklines

Unterhalb des AMS-Panels werden Mini-Diagramme (Sparklines) für die letzten 30 Minuten angezeigt:

- Düsentemperatur über die Zeit
- Betttemperatur über die Zeit
- Kammertemperatur (wo verfügbar)

Klicken Sie auf eine Sparkline, um die vollständige Telemetrie-Diagrammansicht zu öffnen.

## Widget-Anpassung

Das Dashboard verwendet ein Drag-and-Drop-Raster (Grid Layout):

1. Klicken Sie auf **Layout anpassen** (Stift-Symbol oben rechts)
2. Ziehen Sie Widgets an die gewünschte Position
3. Ändern Sie die Größe durch Ziehen an der Ecke
4. Klicken Sie auf **Layout sperren**, um die Position einzufrieren
5. Klicken Sie auf **Speichern**, um das Layout zu sichern

Verfügbare Widgets:
| Widget | Beschreibung |
|---|---|
| Kamera | Live-Kameraansicht |
| AMS | Spulen- und Filamentstatus |
| Temperatur | Ringmesser für Düse und Bett |
| Fortschritt | Prozentanzeige und Zeitschätzung |
| Telemetrie | Lüfter, Druck, Geschwindigkeit |
| 3D-Modell | Interaktive Modellansicht |
| Sparklines | Mini-Temperaturdiagramme |

:::tip Speicherung
Das Layout wird pro Benutzer im Browser (localStorage) gespeichert. Verschiedene Benutzer können unterschiedliche Layouts haben.
:::
