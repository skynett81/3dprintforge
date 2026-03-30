---
sidebar_position: 11
title: Produktpreisgestaltung — Verkaufspreis berechnen
description: Vollständige Anleitung zur Preisgestaltung von 3D-Drucken für den Verkauf mit allen Kostenfaktoren
---

# Produktpreisgestaltung — Verkaufspreis berechnen

Diese Anleitung erklärt, wie Sie den Kostenkalkulator verwenden, um den richtigen Verkaufspreis für 3D-Drucke zu finden, die Sie verkaufen.

## Kostenübersicht

Die Kosten eines 3D-Drucks bestehen aus diesen Komponenten:

| Komponente | Beschreibung | Beispiel |
|-----------|-------------|---------|
| **Filament** | Materialkosten basierend auf Gewicht und Spulenpreis | 100g × 0,25 kr/g = 25 kr |
| **Abfall** | Materialverschwendung (Purge, Fehldrucke, Stützstruktur) | 10% extra = 2,50 kr |
| **Strom** | Stromverbrauch während des Druckens | 3,5h × 150W × 1,50 kr/kWh = 0,79 kr |
| **Verschleiß** | Düse + Maschinenwert über Lebensdauer | 3,5h × 0,15 kr/h = 0,53 kr |
| **Arbeit** | Ihre Zeit für Einrichtung, Nachbearbeitung, Verpackung | 10 Min × 200 kr/h = 33,33 kr |
| **Aufschlag** | Gewinnmarge | 20% = 12,43 kr |

**Gesamtproduktionskosten** = Summe aller Komponenten

## Einstellungen konfigurieren

### Grundeinstellungen

Gehen Sie zu **Filament → ⚙ Einstellungen** und füllen Sie aus:

1. **Strompreis (kr/kWh)** — Ihr Strompreis. Überprüfen Sie Ihre Stromrechnung oder nutzen Sie die Nordpool-Integration
2. **Druckerleistung (W)** — typischerweise 150W für Bambu Lab-Drucker
3. **Maschinenkosten (kr)** — was Sie für den Drucker bezahlt haben
4. **Maschinenlebensdauer (Stunden)** — erwartete Lebensdauer (3000-8000 Stunden)
5. **Arbeitskosten (kr/Stunde)** — Ihr Stundensatz
6. **Einrichtungszeit (Min)** — durchschnittliche Zeit für Filamentwechsel, Plattenkontrolle, Verpackung
7. **Aufschlag (%)** — gewünschte Gewinnmarge
8. **Düsenkosten (kr/Stunde)** — Düsenverschleiß (HS01 ≈ 0,05 kr/h)
9. **Abfallfaktor** — Materialverschwendung (1,1 = 10% extra, 1,15 = 15%)

:::tip Typische Werte für Bambu Lab
| Einstellung | Hobbyist | Semi-Pro | Professionell |
|---|---|---|---|
| Strompreis | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Druckerleistung | 150W | 150W | 150W |
| Maschinenkosten | 5 000 kr | 12 000 kr | 25 000 kr |
| Maschinenlebensdauer | 3 000h | 5 000h | 8 000h |
| Arbeitskosten | 0 kr/h | 150 kr/h | 250 kr/h |
| Einrichtungszeit | 5 Min | 10 Min | 15 Min |
| Aufschlag | 0% | 30% | 50% |
| Abfallfaktor | 1,05 | 1,10 | 1,15 |
:::

## Kosten berechnen

1. Gehen Sie zum **Kostenkalkulator** (`https://localhost:3443/#costestimator`)
2. **Ziehen und ablegen** Sie eine `.3mf`- oder `.gcode`-Datei
3. Das System liest automatisch: Filamentgewicht, geschätzte Zeit, Farben
4. **Spulen zuordnen** — wählen Sie aus, welche Spulen aus dem Lager verwendet werden
5. Klicken Sie auf **Kosten berechnen**

### Das Ergebnis zeigt:

- **Filament** — Materialkosten pro Farbe
- **Abfall/Verschnitt** — basierend auf dem Abfallfaktor
- **Strom** — verwendet Live-Spotpreis von Nordpool, falls verfügbar
- **Verschleiß** — Düse + Maschinenwert
- **Arbeit** — Stundensatz + Einrichtungszeit
- **Produktionskosten** — Summe von allem oben
- **Aufschlag** — Ihre Gewinnmarge
- **Gesamtkosten** — was Sie mindestens verlangen sollten
- **Vorgeschlagene Verkaufspreise** — 2×, 2,5×, 3× Marge

## Preisstrategien

### 2× Marge (empfohlenes Minimum)
Deckt Produktionskosten + unvorhergesehene Ausgaben. Verwenden Sie dies für Freunde/Familie und einfache Geometrie.

### 2,5× Marge (Standard)
Gute Balance zwischen Preis und Wert. Funktioniert für die meisten Produkte.

### 3× Marge (Premium)
Für komplexe Modelle, Multicolor, hohe Qualität oder Nischenmärkte.

:::warning Vergessen Sie nicht die versteckten Kosten
- Fehldrucke (5-15% aller Drucke schlagen fehl)
- Filament, das nicht aufgebraucht wird (die letzten 50g sind oft schwierig)
- Zeitaufwand für Kundenservice
- Verpackung und Versand
- Wartung des Druckers
:::

## Beispiel: Einen Handyhalter bepreisen

| Parameter | Wert |
|-----------|-------|
| Filamentgewicht | 45g PLA |
| Druckzeit | 2 Stunden |
| Spotpreis | 1,20 kr/kWh |

**Berechnung:**
- Filament: 45g × 0,25 kr/g = 11,25 kr
- Abfall (10%): 1,13 kr
- Strom: 2h × 0,15kW × 1,20 = 0,36 kr
- Verschleiß: 2h × 0,15 = 0,30 kr
- Arbeit: (2h + 10Min) × 200 kr/h = 433 kr (oder 0 für Hobby)
- **Produktionskosten (Hobby)**: ~13 kr
- **Verkaufspreis 2,5×**: ~33 kr

## Schätzung speichern

Klicken Sie auf **Schätzung speichern**, um die Berechnung zu archivieren. Gespeicherte Schätzungen finden Sie unter dem Tab **Gespeichert** im Kostenkalkulator.

## E-Commerce

Wenn Sie das [E-Commerce-Modul](../integrations/ecommerce) verwenden, können Sie Kostenschätzungen direkt mit Bestellungen verknüpfen für automatische Preisberechnung.
