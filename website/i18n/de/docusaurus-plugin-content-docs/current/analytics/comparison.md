---
sidebar_position: 6
title: Druckvergleich
description: Vergleichen Sie zwei Drucke nebeneinander mit detaillierten Metriken, Diagrammen und Galeriebildern für A/B-Analysen
---

# Druckvergleich

Der Druckvergleich ermöglicht es Ihnen, zwei Drucke nebeneinander zu analysieren — nützlich zum Vergleichen von Einstellungen, Materialien, Druckern oder Versionen desselben Modells.

Navigieren Sie zu: **https://localhost:3443/#comparison**

## Zu vergleichende Drucke auswählen

1. Gehen Sie zu **Druckvergleich**
2. Klicken Sie auf **Druck A auswählen** und suchen Sie in der Historie
3. Klicken Sie auf **Druck B auswählen** und suchen Sie in der Historie
4. Klicken Sie auf **Vergleichen**, um die Vergleichsansicht zu laden

:::tip Schnellzugriff
In der **Historie** können Sie auf einen Druck rechtsklicken und **Als Druck A festlegen** oder **Vergleichen mit...** auswählen, um direkt in den Vergleichsmodus zu wechseln.
:::

## Metrikvergleich

Die Metriken werden in zwei Spalten (A und B) angezeigt, mit Markierung der besten:

| Metrik | Beschreibung |
|---|---|
| Erfolg | Abgeschlossen / Abgebrochen / Fehlgeschlagen |
| Dauer | Gesamte Druckzeit |
| Filamentverbrauch | Gramm gesamt und pro Farbe |
| Filamenteffizienz | Modell-% des Gesamtverbrauchs |
| Max. Düsentemperatur | Höchste aufgezeichnete Düsentemperatur |
| Max. Betttemperatur | Höchste aufgezeichnete Betttemperatur |
| Geschwindigkeitseinstellung | Leise / Standard / Sport / Turbo |
| AMS-Wechsel | Anzahl Farbwechsel |
| HMS-Fehler | Etwaige Fehler während des Drucks |
| Drucker | Welcher Drucker verwendet wurde |

Zellen mit dem besten Wert werden mit grünem Hintergrund angezeigt.

## Temperaturdiagramme

Zwei Temperaturdiagramme werden nebeneinander angezeigt (oder überlagert):

- **Getrennte Ansicht** — Diagramm A links, Diagramm B rechts
- **Überlagerte Ansicht** — beide im selben Diagramm mit verschiedenen Farben

Verwenden Sie die überlagerte Ansicht, um Temperaturstabilität und Aufheizgeschwindigkeit direkt zu vergleichen.

## Galeriebilder

Wenn beide Drucke Milestone-Screenshots haben, werden sie in einem Raster angezeigt:

| Druck A | Druck B |
|---|---|
| 25%-Bild A | 25%-Bild B |
| 50%-Bild A | 50%-Bild B |
| 75%-Bild A | 75%-Bild B |
| 100%-Bild A | 100%-Bild B |

Klicken Sie auf ein Bild, um die Vollbildvorschau mit Slide-Animation zu öffnen.

## Timelapse-Vergleich

Wenn beide Drucke einen Timelapse haben, werden die Videos nebeneinander angezeigt:

- Synchronisierte Wiedergabe — beide starten und pausieren gleichzeitig
- Unabhängige Wiedergabe — jedes Video separat steuern

## Einstellungsunterschiede

Das System hebt automatisch Unterschiede in den Druckeinstellungen hervor (aus G-Code-Metadaten):

- Unterschiedliche Lagenstärken
- Unterschiedliche Füllmuster oder -prozentsätze
- Unterschiedliche Stützeinstellungen
- Unterschiedliche Geschwindigkeitsprofile

Unterschiede werden mit oranger Markierung in der Einstellungstabelle angezeigt.

## Vergleich speichern

1. Klicken Sie auf **Vergleich speichern**
2. Geben Sie dem Vergleich einen Namen (z.B. „PLA vs PETG - Benchy")
3. Der Vergleich wird gespeichert und ist über **Historie → Vergleiche** verfügbar

## Export

1. Klicken Sie auf **Exportieren**
2. Wählen Sie **PDF** für einen Bericht mit allen Metriken und Bildern
3. Der Bericht kann mit einem Projekt für die Dokumentation der Materialauswahl verknüpft werden
