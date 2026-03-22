---
sidebar_position: 3
title: Filamentanalyse
description: Detaillierte Analyse des Filamentverbrauchs, Kosten, Prognosen, Verbrauchsraten und Abfall pro Material und Hersteller
---

# Filamentanalyse

Die Filamentanalyse gibt Ihnen vollständige Einblicke in Ihren Filamentverbrauch — was Sie verwenden, was es kostet und was Sie einsparen können.

Navigieren Sie zu: **https://localhost:3443/#filament-analytics**

## Verbrauchsübersicht

Oben wird eine Zusammenfassung für den gewählten Zeitraum angezeigt:

- **Gesamtverbrauch** — Gramm und Meter für alle Materialien
- **Geschätzte Kosten** — basierend auf registriertem Preis pro Spule
- **Meistverwendetes Material** — Typ und Hersteller
- **Wiederverwendungsrate** — Anteil des Filaments im tatsächlichen Modell vs. Stützen/Spülung

### Verbrauch pro Material

Kreisdiagramm und Tabelle zeigen die Verteilung zwischen Materialien:

| Spalte | Beschreibung |
|---|---|
| Material | PLA, PETG, ABS, PA usw. |
| Hersteller | Bambu Lab, PolyMaker, Prusament usw. |
| Verwendete Gramm | Gesamtgewicht |
| Meter | Geschätzte Länge |
| Kosten | Gramm × Preis pro Gramm |
| Drucke | Anzahl Drucke mit diesem Material |

Klicken Sie auf eine Zeile, um auf Einzelspulen-Ebene zu gelangen.

## Verbrauchsraten

Die Verbrauchsrate zeigt den durchschnittlichen Filamentverbrauch pro Zeiteinheit:

- **Gramm pro Stunde** — während des aktiven Druckens
- **Gramm pro Woche** — einschließlich Drucker-Stillstandszeiten
- **Gramm pro Druck** — Durchschnitt pro Ausdruck

Diese werden verwendet, um Prognosen für den zukünftigen Bedarf zu berechnen.

:::tip Einkaufsplanung
Verwenden Sie die Verbrauchsrate zur Planung des Spulenlagers. Das System warnt automatisch, wenn der geschätzte Bestand innerhalb von 14 Tagen ausgeht (konfigurierbar).
:::

## Kostenprognose

Basierend auf der historischen Verbrauchsrate wird berechnet:

- **Geschätzter Verbrauch in den nächsten 30 Tagen** (Gramm pro Material)
- **Geschätzte Kosten in den nächsten 30 Tagen**
- **Empfohlener Lagerbestand** (ausreichend für 30 / 60 / 90 Tage Betrieb)

Die Prognose berücksichtigt saisonale Schwankungen, wenn Sie Daten von mindestens einem Jahr haben.

## Abfall und Effizienz

Siehe [Abfallverfolgung](./waste) für vollständige Dokumentation. Die Filamentanalyse zeigt eine Zusammenfassung:

- **AMS-Spülung** — Gramm und Anteil am Gesamtverbrauch
- **Stützmaterial** — Gramm und Anteil
- **Tatsächliches Modellmaterial** — verbleibender Anteil (Effizienz %)
- **Geschätzte Abfallkosten** — was der Abfall kostet

## Spulenprotokoll

Alle Spulen (aktive und leere) werden protokolliert:

| Feld | Beschreibung |
|---|---|
| Spulenname | Materialname und Farbe |
| Ursprüngliches Gewicht | Bei der Einlagerung registriertes Gewicht |
| Verbleibendes Gewicht | Berechnetes Restgewicht |
| Verwendet | Gesamtverbrauch in Gramm |
| Zuletzt verwendet | Datum des letzten Drucks |
| Status | Aktiv / Leer / Eingelagert |

## Preisregistrierung

Für genaue Kostenanalysen registrieren Sie Preise pro Spule:

1. Gehen Sie zum **Filamentlager**
2. Klicken Sie auf eine Spule → **Bearbeiten**
3. Geben Sie **Kaufpreis** und **Gewicht beim Kauf** ein
4. Das System berechnet automatisch den Preis pro Gramm

Spulen ohne registrierten Preis verwenden den **Standardpreis pro Gramm** (einstellbar unter **Einstellungen → Filament → Standardpreis**).

## Export

1. Klicken Sie auf **Filamentdaten exportieren**
2. Zeitraum und Format wählen (CSV / PDF)
3. CSV enthält eine Zeile pro Druck mit Gramm, Kosten und Material
