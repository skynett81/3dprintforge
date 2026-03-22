---
sidebar_position: 4
title: Kostenkalkulator
description: Laden Sie eine 3MF- oder GCode-Datei hoch und berechnen Sie die Gesamtkosten für Filament, Strom und Maschinenverschleiß vor dem Druck
---

# Kostenkalkulator

Der Kostenkalkulator ermöglicht es Ihnen, die Gesamtkosten eines Drucks zu schätzen, bevor Sie ihn an den Drucker senden — basierend auf Filamentverbrauch, Strompreis und Maschinenverschleiß.

Navigieren Sie zu: **https://localhost:3443/#cost-estimator**

## Datei hochladen

1. Gehen Sie zum **Kostenkalkulator**
2. Ziehen Sie eine Datei in das Uploadfeld oder klicken Sie auf **Datei auswählen**
3. Unterstützte Formate: `.3mf`, `.gcode`, `.bgcode`
4. Klicken Sie auf **Analysieren**

:::info Analyse
Das System analysiert den G-Code, um Filamentverbrauch, geschätzte Druckdauer und das Materialprofil zu extrahieren. Dies dauert normalerweise 2–10 Sekunden.
:::

## Filamentberechnung

Nach der Analyse wird folgendes angezeigt:

| Feld | Wert (Beispiel) |
|---|---|
| Geschätztes Filament | 47,3 g |
| Material (aus Datei) | PLA |
| Preis pro Gramm | 0,025 € (aus Filamentlager) |
| **Filamentkosten** | **1,18 €** |

Wechseln Sie das Material in der Dropdown-Liste, um Kosten mit verschiedenen Filamenttypen oder Herstellern zu vergleichen.

:::tip Material-Override
Wenn der G-Code keine Materialinformationen enthält, wählen Sie das Material manuell aus der Liste. Der Preis wird automatisch aus dem Filamentlager abgerufen.
:::

## Stromberechnung

Die Stromkosten werden berechnet basierend auf:

- **Geschätzte Druckdauer** — aus der G-Code-Analyse
- **Druckerleistung** — konfiguriert pro Druckermodell (W)
- **Strompreis** — fester Preis (€/kWh) oder Live von Tibber/Nordpool

| Feld | Wert (Beispiel) |
|---|---|
| Geschätzte Druckdauer | 3 Stunden 22 Min |
| Druckerleistung | 350 W (X1C) |
| Geschätzter Verbrauch | 1,17 kWh |
| Strompreis | 0,30 €/kWh |
| **Stromkosten** | **0,35 €** |

Aktivieren Sie die Tibber- oder Nordpool-Integration, um geplante Stundenpreise basierend auf der gewünschten Startzeit zu verwenden.

## Maschinenverschleiß

Die Verschleißkosten werden geschätzt basierend auf:

- Druckzeit × Stundenkosten pro Druckermodell
- Zusätzlicher Verschleiß für abrasive Materialien (CF, GF usw.)

| Feld | Wert (Beispiel) |
|---|---|
| Druckdauer | 3 Stunden 22 Min |
| Stundenkosten (Verschleiß) | 0,12 €/Stunde |
| **Verschleißkosten** | **0,40 €** |

Die Stundenkosten werden aus Komponentenpreisen und der erwarteten Lebensdauer berechnet (siehe [Verschleißprognose](../overvaaking/wearprediction)).

## Gesamtsumme

| Kostenposition | Betrag |
|---|---|
| Filament | 1,18 € |
| Strom | 0,35 € |
| Maschinenverschleiß | 0,40 € |
| **Gesamt** | **1,93 €** |
| + Aufschlag (30 %) | 0,58 € |
| **Verkaufspreis** | **2,51 €** |

Passen Sie den Aufschlag im Prozentfeld an, um den empfohlenen Verkaufspreis für den Kunden zu berechnen.

## Schätzung speichern

Klicken Sie auf **Schätzung speichern**, um die Analyse mit einem Projekt zu verknüpfen:

1. Vorhandenes Projekt auswählen oder neues erstellen
2. Die Schätzung wird gespeichert und kann als Grundlage für eine Rechnung verwendet werden
3. Die tatsächlichen Kosten (nach dem Druck) werden automatisch mit der Schätzung verglichen

## Batch-Berechnung

Laden Sie mehrere Dateien gleichzeitig hoch, um die Gesamtkosten für ein vollständiges Set zu berechnen:

1. Klicken Sie auf **Batch-Modus**
2. Alle `.3mf`/`.gcode`-Dateien hochladen
3. Das System berechnet individuelle und summierte Kosten
4. Zusammenfassung als PDF oder CSV exportieren
