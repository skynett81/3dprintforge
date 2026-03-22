---
sidebar_position: 1
title: Statistiken
description: Erfolgsrate, Filamentverbrauch, Trends und Kennzahlen für alle Bambu Lab-Drucker über die Zeit
---

# Statistiken

Die Statistikseite bietet Ihnen einen vollständigen Überblick über Ihre Druckeraktivitäten mit Kennzahlen, Trends und Filamentverbrauch über einen wählbaren Zeitraum.

Navigieren Sie zu: **https://localhost:3443/#statistics**

## Kennzahlen

Oben auf der Seite werden vier KPI-Karten angezeigt:

| Kennzahl | Beschreibung |
|---|---|
| **Erfolgsrate** | Anteil erfolgreicher Drucke an der Gesamtanzahl |
| **Gesamtfilament** | In gewähltem Zeitraum verwendete Gramm |
| **Gesamte Druckstunden** | Kumulierte Druckzeit |
| **Durchschnittliche Druckdauer** | Mediane Dauer pro Druck |

Jede Kennzahl zeigt die Änderung gegenüber dem vorherigen Zeitraum (↑ auf / ↓ ab) als prozentualer Unterschied.

## Erfolgsrate

Die Erfolgsrate wird pro Drucker und gesamt berechnet:

- **Erfolgreich** — Druck ohne Unterbrechung abgeschlossen
- **Abgebrochen** — manuell vom Benutzer gestoppt
- **Fehlgeschlagen** — durch Print Guard, HMS-Fehler oder Hardwareausfall gestoppt

Klicken Sie auf das Erfolgsratendiagramm, um zu sehen, welche Drucke fehlgeschlagen sind und warum.

:::tip Erfolgsrate verbessern
Verwenden Sie die [Fehlermusteranalyse](../overvaaking/erroranalysis), um Ursachen für fehlgeschlagene Drucke zu identifizieren und zu beheben.
:::

## Trends

Die Trendansicht zeigt die Entwicklung über die Zeit als Liniendiagramm:

1. **Zeitraum** wählen: Letzte 7 / 30 / 90 / 365 Tage
2. **Gruppierung** wählen: Tag / Woche / Monat
3. **Metrik** wählen: Anzahl Drucke / Stunden / Gramm / Erfolgsrate
4. Klicken Sie auf **Vergleichen**, um zwei Metriken zu überlagern

Das Diagramm unterstützt Zoomen (Scrollen) und Verschieben (Klicken und Ziehen).

## Filamentverbrauch

Der Filamentverbrauch wird angezeigt als:

- **Balkendiagramm** — Verbrauch pro Tag/Woche/Monat
- **Kreisdiagramm** — Verteilung zwischen Materialien (PLA, PETG, ABS usw.)
- **Tabelle** — detaillierte Liste mit Gesamt-Gramm, Metern und Kosten pro Material

### Verbrauch pro Drucker

Verwenden Sie den Mehrfachauswahl-Filter oben, um:
- Nur einen Drucker anzuzeigen
- Zwei Drucker nebeneinander zu vergleichen
- Aggregiertes Total für alle Drucker anzuzeigen

## Aktivitätskalender

Sehen Sie eine kompakte GitHub-artige Heatmap direkt auf der Statistikseite (vereinfachte Ansicht), oder gehen Sie zum vollständigen [Aktivitätskalender](./calendar) für eine detailliertere Ansicht.

## Export

1. Klicken Sie auf **Statistiken exportieren**
2. Datumsbereich und gewünschte Metriken auswählen
3. Format wählen: **CSV** (Rohdaten), **PDF** (Bericht) oder **JSON**
4. Datei wird heruntergeladen

Der CSV-Export ist kompatibel mit Excel und Google Sheets für weitere Analysen.

## Vergleich mit vorherigem Zeitraum

Aktivieren Sie **Vorherigen Zeitraum anzeigen**, um Diagramme mit dem entsprechenden vorherigen Zeitraum zu überlagern:

- Letzte 30 Tage vs. die 30 Tage davor
- Laufender Monat vs. letzter Monat
- Laufendes Jahr vs. letztes Jahr

Dies macht es einfach zu sehen, ob Sie mehr oder weniger drucken als zuvor und ob sich die Erfolgsrate verbessert.
