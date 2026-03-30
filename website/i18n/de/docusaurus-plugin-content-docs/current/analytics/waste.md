---
sidebar_position: 5
title: Abfallverfolgung
description: Verfolgen Sie Filamentabfall aus AMS-Spülung und Stützmaterial, berechnen Sie Kosten und optimieren Sie die Effizienz
---

# Abfallverfolgung

Die Abfallverfolgung gibt Ihnen vollständige Einblicke, wie viel Filament beim Drucken verschwendet wird — AMS-Spülung, Spülung bei Materialwechseln und Stützmaterial — und was es kostet.

Navigieren Sie zu: **https://localhost:3443/#waste**

## Abfallkategorien

Bambu Dashboard unterscheidet zwischen drei Arten von Abfall:

| Kategorie | Quelle | Typischer Anteil |
|---|---|---|
| **AMS-Spülung** | Farbwechsel im AMS während Mehrfarbendruck | 5–30 g pro Wechsel |
| **Materialwechsel-Spülung** | Reinigung beim Wechsel zwischen verschiedenen Materialien | 10–50 g pro Wechsel |
| **Stützmaterial** | Stützstrukturen, die nach dem Druck entfernt werden | Variiert |

## AMS-Spülungsverfolgung

AMS-Spülungsdaten werden direkt aus MQTT-Telemetrie und G-Code-Analyse abgerufen:

- **Gramm pro Farbwechsel** — aus G-Code-Spülblock berechnet
- **Anzahl Farbwechsel** — aus Druckprotokoll gezählt
- **Gesamter Spülverbrauch** — Summe über den gewählten Zeitraum

:::tip Spülung reduzieren
Bambu Studio hat Einstellungen für das Spülvolumen pro Farbkombination. Reduzieren Sie das Spülvolumen für Farbpaare mit geringem Farbunterschied (z.B. Weiß → Hellgrau), um Filament zu sparen.
:::

## Effizienzberechnung

Die Effizienz wird berechnet als:

```
Effizienz % = (Modellmaterial / Gesamtverbrauch) × 100

Gesamtverbrauch = Modellmaterial + Spülung + Stützmaterial
```

**Beispiel:**
- Modell: 45 g
- Spülung: 12 g
- Stütze: 8 g
- Gesamt: 65 g
- **Effizienz: 69 %**

Die Effizienz wird als Trenddiagramm über die Zeit angezeigt, damit Sie sehen, ob Sie sich verbessern.

## Kosten des Abfalls

Basierend auf registrierten Filamentpreisen wird berechnet:

| Posten | Berechnung |
|---|---|
| Spülkosten | Spül-Gramm × Preis/Gramm pro Farbe |
| Stützkosten | Stütz-Gramm × Preis/Gramm |
| **Gesamte Abfallkosten** | Summe der obigen |
| **Kosten pro erfolgreichem Druck** | Abfallkosten / Anzahl Drucke |

## Abfall pro Drucker und Material

Filtern Sie die Ansicht nach:

- **Drucker** — sehen, welcher Drucker den meisten Abfall erzeugt
- **Material** — Abfall pro Filamenttyp sehen
- **Zeitraum** — Tag, Woche, Monat, Jahr

Die Tabellenansicht zeigt eine sortierte Liste mit dem höchsten Abfall oben, einschließlich geschätzter Kosten.

## Optimierungstipps

Das System generiert automatisch Vorschläge zur Abfallreduzierung:

- **Umgekehrte Farbreihenfolge** — Wenn Farbe A→B mehr spült als B→A, schlägt das System vor, die Reihenfolge umzukehren
- **Farbwechsellagen zusammenführen** — Gruppiert Lagen mit gleicher Farbe, um Wechsel zu minimieren
- **Stützstruktur-Optimierung** — Schätzt Stützreduktion durch Änderung der Ausrichtung

:::info Genauigkeit
Spülberechnungen sind aus G-Code geschätzt. Der tatsächliche Abfall kann um 10–20 % variieren aufgrund des Druckerverhaltens.
:::

## Export und Berichterstattung

1. Klicken Sie auf **Abfalldaten exportieren**
2. Zeitraum und Format wählen (CSV / PDF)
3. Abfalldaten können in Projektberichten und Rechnungen als Kostenposition aufgenommen werden

Siehe auch [Filamentanalyse](./filamentanalytics) für eine Gesamtverbrauchsübersicht.
