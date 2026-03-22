---
sidebar_position: 2
title: Dateibibliothek
description: Laden Sie 3D-Modelle und G-Code-Dateien hoch und verwalten Sie diese, analysieren Sie G-Code und verbinden Sie sich mit MakerWorld und Printables
---

# Dateibibliothek

Die Dateibibliothek ist ein zentraler Ort zum Speichern und Verwalten Ihrer 3D-Modelle und G-Code-Dateien — mit automatischer G-Code-Analyse und Integration mit MakerWorld und Printables.

Navigieren Sie zu: **https://localhost:3443/#library**

## Modelle hochladen

### Einzelner Upload

1. Gehen Sie zur **Dateibibliothek**
2. Klicken Sie auf **Hochladen** oder ziehen Sie Dateien in den Upload-Bereich
3. Unterstützte Formate: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Die Datei wird nach dem Upload automatisch analysiert

:::info Speicherordner
Dateien werden im unter **Einstellungen → Dateibibliothek → Speicherordner** konfigurierten Ordner gespeichert. Standard: `./data/library/`
:::

### Batch-Upload

Ziehen Sie einen ganzen Ordner, um alle unterstützten Dateien auf einmal hochzuladen. Die Dateien werden im Hintergrund verarbeitet und Sie werden benachrichtigt, wenn alles fertig ist.

## G-Code-Analyse

Nach dem Hochladen werden `.gcode`- und `.bgcode`-Dateien automatisch analysiert:

| Metrik | Beschreibung |
|---|---|
| Geschätzte Druckzeit | Zeit berechnet aus G-Code-Befehlen |
| Filamentverbrauch | Gramm und Meter pro Material/Farbe |
| Lagenzähler | Gesamtanzahl der Lagen |
| Lagenstärke | Aufgezeichnete Lagenstärke |
| Materialien | Erkannte Materialien (PLA, PETG usw.) |
| Füllprozent | Falls in Metadaten verfügbar |
| Stützmaterial | Geschätztes Stützgewicht |
| Druckermodell | Zieldrucker aus Metadaten |

Die Analysedaten werden in der Dateikarte angezeigt und vom [Kostenkalkulator](../analyse/costestimator) verwendet.

## Dateikarten und Metadaten

Jede Dateikarte zeigt:
- **Dateiname** und Format
- **Hochladedatum**
- **Vorschaubild** (aus `.3mf` oder generiert)
- **Analysierte Druckzeit** und Filamentverbrauch
- **Tags** und Kategorie
- **Verknüpfte Drucke** — wie oft gedruckt

Klicken Sie auf eine Karte, um die Detailansicht mit vollständigen Metadaten und Historie zu öffnen.

## Organisation

### Tags

Tags für einfache Suche hinzufügen:
1. Klicken Sie auf die Datei → **Metadaten bearbeiten**
2. Tags eingeben (kommagetrennt): `benchy, test, PLA, kalibrierung`
3. In der Bibliothek mit Tag-Filter suchen

### Kategorien

Dateien in Kategorien organisieren:
- Klicken Sie auf **Neue Kategorie** in der Seitenleiste
- Dateien in die Kategorie ziehen
- Kategorien können verschachtelt werden (Unterkategorien werden unterstützt)

## Verknüpfung mit MakerWorld

1. Gehen Sie zu **Einstellungen → Integrationen → MakerWorld**
2. Mit Ihrem Bambu Lab-Konto anmelden
3. Zurück in der Bibliothek: klicken Sie auf eine Datei → **Mit MakerWorld verknüpfen**
4. Nach dem Modell auf MakerWorld suchen und den richtigen Treffer auswählen
5. Metadaten (Designer, Lizenzierung, Bewertung) werden von MakerWorld importiert

Die Verknüpfung zeigt den Designer-Namen und die ursprüngliche URL auf der Dateikarte.

## Verknüpfung mit Printables

1. Gehen Sie zu **Einstellungen → Integrationen → Printables**
2. Ihren Printables API-Schlüssel einfügen
3. Dateien genauso wie bei MakerWorld mit Printables-Modellen verknüpfen

## An Drucker senden

Aus der Dateibibliothek können Sie direkt an den Drucker senden:

1. Klicken Sie auf die Datei → **An Drucker senden**
2. Zieldrucker auswählen
3. AMS-Schacht auswählen (für Mehrfarbdrucke)
4. Klicken Sie auf **Druck starten** oder **In Warteschlange einreihen**

:::warning Direktes Senden
Das direkte Senden startet den Druck sofort ohne Bestätigung in Bambu Studio. Stellen Sie sicher, dass der Drucker bereit ist.
:::
