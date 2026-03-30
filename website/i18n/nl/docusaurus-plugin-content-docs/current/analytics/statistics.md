---
sidebar_position: 1
title: Statistieken
description: Slagingspercentage, filamentverbruik, trends en kerncijfers voor alle Bambu Lab-printers over tijd
---

# Statistieken

De statistiekenpagina geeft u een volledig overzicht van uw printeractiviteit met kerncijfers, trends en filamentverbruik over een door u gekozen tijdsperiode.

Ga naar: **https://localhost:3443/#statistics**

## Kerncijfers

Bovenaan de pagina worden vier KPI-kaarten getoond:

| Kerncijfer | Beschrijving |
|---|---|
| **Slagingspercentage** | Aandeel geslaagde prints van het totale aantal prints |
| **Totaal filament** | Gram gebruikt in de geselecteerde periode |
| **Totale printuren** | Gecumuleerde printtijd |
| **Gemiddelde printtijd** | Mediaanduur per print |

Elk kerncijfer toont de wijziging ten opzichte van de vorige periode (↑ omhoog / ↓ omlaag) als procentuele afwijking.

## Slagingspercentage

Het slagingspercentage wordt per printer en totaal berekend:

- **Geslaagd** — print voltooid zonder onderbreking
- **Afgebroken** — handmatig gestopt door gebruiker
- **Mislukt** — gestopt door Print Guard, HMS-fout of hardwarestoring

Klik op het slagingspercentagediagram om te zien welke prints zijn mislukt en waarom.

:::tip Slagingspercentage verbeteren
Gebruik [Foutpatroonanalyse](../monitoring/erroranalysis) om oorzaken van mislukte prints te identificeren en te corrigeren.
:::

## Trends

De trendweergave toont de ontwikkeling over tijd als lijndiagram:

1. Selecteer **Tijdsperiode**: Afgelopen 7 / 30 / 90 / 365 dagen
2. Selecteer **Groepering**: Dag / Week / Maand
3. Selecteer **Metriek**: Aantal prints / Uren / Gram / Slagingspercentage
4. Klik op **Vergelijk** om twee metrieken te overlappen

De grafiek ondersteunt zoomen (scrollen) en pannen (klikken en slepen).

## Filamentverbruik

Filamentverbruik wordt weergegeven als:

- **Staafdiagram** — verbruik per dag/week/maand
- **Cirkeldiagram** — verdeling tussen materialen (PLA, PETG, ABS, enz.)
- **Tabel** — gedetailleerde lijst met totaal gram, meter en kosten per materiaal

### Verbruik per printer

Gebruik het meervoudig selectiefilter bovenaan om:
- Slechts één printer te tonen
- Twee printers naast elkaar te vergelijken
- Het gecombineerde totaal voor alle printers te bekijken

## Activiteitskalender

Bekijk een compacte GitHub-stijl heatmap direct op de statistiekenpagina (vereenvoudigde weergave), of ga naar de volledige [Activiteitskalender](./calendar) voor een meer gedetailleerde weergave.

## Exporteren

1. Klik op **Statistieken exporteren**
2. Selecteer het datumbereik en welke metrieken u wilt opnemen
3. Kies het formaat: **CSV** (ruwe data), **PDF** (rapport) of **JSON**
4. Het bestand wordt gedownload

De CSV-export is compatibel met Excel en Google Sheets voor verdere analyse.

## Vergelijking met vorige periode

Activeer **Vorige periode tonen** om grafieken te overlappen met de overeenkomstige vorige periode:

- Afgelopen 30 dagen vs. de 30 dagen daarvoor
- Huidige maand vs. vorige maand
- Huidig jaar vs. vorig jaar

Dit maakt het eenvoudig om te zien of u meer of minder print dan voorheen en of het slagingspercentage verbetert.
