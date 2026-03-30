---
sidebar_position: 3
title: Druckhistorie
description: Vollständiges Protokoll aller Drucke mit Statistiken, Filamentverfolgung und Export
---

# Druckhistorie

Die Druckhistorie bietet ein vollständiges Protokoll aller mit dem Dashboard durchgeführten Drucke, einschließlich Statistiken, Filamentverbrauch und Links zu Modellquellen.

## Die Historietabelle

Die Tabelle zeigt alle Drucke mit:

| Spalte | Beschreibung |
|---------|-------------|
| Datum/Zeit | Startzeitpunkt |
| Modellname | Dateiname oder MakerWorld-Titel |
| Drucker | Welcher Drucker verwendet wurde |
| Dauer | Gesamte Druckzeit |
| Filament | Material und verwendete Gramm |
| Lagen | Anzahl der Lagen und Gewicht (g) |
| Status | Abgeschlossen, abgebrochen, fehlgeschlagen |
| Bild | Vorschaubild (bei Cloud-Integration) |

## Suche und Filterung

Verwenden Sie das Suchfeld und die Filter, um Drucke zu finden:

- Volltextsuche nach Modellname
- Filtern nach Drucker, Material, Status, Datum
- Sortieren nach allen Spalten

## Modellquellen-Links

Wenn der Druck von MakerWorld gestartet wurde, wird ein direkter Link zur Modellseite angezeigt. Klicken Sie auf den Modellnamen, um MakerWorld in einem neuen Tab zu öffnen.

:::info Bambu Cloud
Modell-Links und Vorschaubilder erfordern die Bambu Cloud-Integration. Siehe [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Filamentverfolgung

Für jeden Druck wird folgendes aufgezeichnet:

- **Material** — PLA, PETG, ABS usw.
- **Verwendete Gramm** — geschätzter Verbrauch
- **Spule** — welche Spule verwendet wurde (wenn im Lager registriert)
- **Farbe** — Hex-Code der Farbe

Dies liefert ein genaues Bild des Filamentverbrauchs über die Zeit und hilft bei der Planung von Einkäufen.

## Statistiken

Unter **Historie → Statistiken** finden Sie aggregierte Daten:

- **Gesamtanzahl der Drucke** — und Erfolgsrate
- **Gesamte Druckzeit** — Stunden und Tage
- **Filamentverbrauch** — Gramm und km pro Material
- **Drucke pro Tag** — rollierendes Diagramm
- **Meistverwendete Materialien** — Kreisdiagramm
- **Druckdauerverteilung** — Histogramm

Statistiken können nach Zeitraum gefiltert werden (7d, 30d, 90d, 1 Jahr, alles).

## Export

### CSV-Export
Exportieren Sie die gesamte Historie oder gefilterte Ergebnisse:
**Historie → Export → CSV herunterladen**

CSV-Dateien enthalten alle Spalten und können in Excel, LibreOffice Calc geöffnet oder in andere Tools importiert werden.

### Automatisches Backup
Die Historie ist Teil der SQLite-Datenbank, die bei Updates automatisch gesichert wird. Manuelles Backup unter **Einstellungen → Backup**.

## Bearbeitung

Sie können Druckprotokolleinträge nachträglich bearbeiten:

- Modellnamen korrigieren
- Notizen hinzufügen
- Filamentverbrauch korrigieren
- Falsch erfasste Drucke löschen

Rechtsklicken Sie auf eine Zeile und wählen Sie **Bearbeiten** oder klicken Sie auf das Stift-Symbol.
