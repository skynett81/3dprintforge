---
sidebar_position: 2
title: Aktivitätskalender
description: GitHub-artige Heatmap-Kalender, der die Druckeraktivität pro Tag über das Jahr anzeigt, mit Jahresauswahl und Detailansicht
---

# Aktivitätskalender

Der Aktivitätskalender zeigt eine visuelle Übersicht Ihrer Druckeraktivitäten über das gesamte Jahr — inspiriert von der Beitragsübersicht von GitHub.

Navigieren Sie zu: **https://localhost:3443/#calendar**

## Heatmap-Übersicht

Der Kalender zeigt 365 Tage (52 Wochen) als Raster farbiger Kästchen:

- **Grau** — keine Drucke an diesem Tag
- **Hellgrün** — 1–2 Drucke
- **Grün** — 3–5 Drucke
- **Dunkelgrün** — 6–10 Drucke
- **Tiefgrün** — 11+ Drucke

Die Kästchen sind mit Wochentagen vertikal (Mo–So) und Wochen horizontal von links (Januar) nach rechts (Dezember) angeordnet.

:::tip Farbcodierung
Sie können die Heatmap-Metrik von **Anzahl Drucke** auf **Stunden** oder **Gramm Filament** über den Selektor über dem Kalender umschalten.
:::

## Jahresauswahl

Klicken Sie auf **< Jahr >**, um zwischen Jahren zu navigieren:

- Alle Jahre mit registrierter Druckaktivität sind verfügbar
- Das aktuelle Jahr wird standardmäßig angezeigt
- Die Zukunft ist grau (keine Daten)

## Detailansicht pro Tag

Klicken Sie auf ein Kästchen, um Details für den betreffenden Tag zu sehen:

- **Datum** und Wochentag
- **Anzahl Drucke** — erfolgreiche und fehlgeschlagene
- **Gesamtfilament verwendet** (Gramm)
- **Gesamte Druckstunden**
- **Liste der Drucke** — klicken, um in der Historie zu öffnen

## Monatsübersicht

Unterhalb der Heatmap wird eine Monatsübersicht angezeigt mit:
- Gesamtdrucke pro Monat als Balkendiagramm
- Bester Tag im Monat hervorgehoben
- Vergleich mit demselben Monat im Vorjahr (%)

## Druckerfilter

Wählen Sie einen Drucker aus der Dropdown-Liste oben, um nur die Aktivität für einen Drucker anzuzeigen, oder wählen Sie **Alle** für eine aggregierte Ansicht.

Die Mehrdruckeransicht zeigt gestapelte Farben, wenn Sie auf **Gestapelt** im Ansichtsselektor klicken.

## Serien und Rekorde

Unterhalb des Kalenders wird angezeigt:

| Statistik | Beschreibung |
|---|---|
| **Längste Serie** | Meiste aufeinanderfolgende Tage mit mindestens einem Druck |
| **Aktuelle Serie** | Laufende Reihe aktiver Tage |
| **Aktivster Tag** | Tag mit den meisten Drucken insgesamt |
| **Aktivste Woche** | Woche mit den meisten Drucken |
| **Aktivster Monat** | Monat mit den meisten Drucken |

## Export

Klicken Sie auf **Exportieren**, um Kalenderdaten herunterzuladen:

- **PNG** — Bild der Heatmap (zum Teilen)
- **CSV** — Rohdaten mit einer Zeile pro Tag (Datum, Anzahl, Gramm, Stunden)

Der PNG-Export ist für das Teilen in sozialen Medien mit dem Druckernamen und dem Jahr als Untertitel optimiert.
