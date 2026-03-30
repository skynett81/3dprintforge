---
sidebar_position: 2
title: Activiteitskalender
description: GitHub-stijl heatmap-kalender die printeractiviteit per dag door het jaar toont met jaarselectie en detailweergave
---

# Activiteitskalender

De activiteitskalender toont een visueel overzicht van uw printeractiviteit door het hele jaar — geïnspireerd door de bijdrageoverzicht van GitHub.

Ga naar: **https://localhost:3443/#calendar**

## Heatmap-overzicht

De kalender toont 365 dagen (52 weken) als een raster van gekleurde vakjes:

- **Grijs** — geen prints op deze dag
- **Lichtgroen** — 1–2 prints
- **Groen** — 3–5 prints
- **Donkergroen** — 6–10 prints
- **Diepgroen** — 11+ prints

De vakjes zijn verticaal georganiseerd per weekdag (ma–zo) en horizontaal per week van links (januari) naar rechts (december).

:::tip Kleurcodering
U kunt de heatmap-metriek wijzigen van **Aantal prints** naar **Uren** of **Gram filament** via de selector boven de kalender.
:::

## Jaarselectie

Klik op **< Jaar >** om tussen jaren te navigeren:

- Alle jaren met geregistreerde printactiviteit zijn beschikbaar
- Het huidige jaar wordt standaard weergegeven
- De toekomst is grijs (geen data)

## Detailweergave per dag

Klik op een vakje om details voor die dag te zien:

- **Datum** en weekdag
- **Aantal prints** — geslaagd en mislukt
- **Totaal filament gebruikt** (gram)
- **Totale printuren**
- **Lijst van prints** — klik om te openen in de geschiedenis

## Maandoverzicht

Onder de heatmap wordt een maandoverzicht getoond met:
- Totale prints per maand als staafdiagram
- Beste dag van de maand gemarkeerd
- Vergelijking met dezelfde maand vorig jaar (%)

## Printerfilter

Selecteer een printer in de vervolgkeuzelijst bovenaan om activiteit voor slechts één printer te tonen, of kies **Alle** voor een geaggregeerde weergave.

De multi-printerweergave toont gestapelde kleuren door op **Gestapeld** in de weergaveselector te klikken.

## Reeksen en records

Onder de kalender worden de volgende statistieken getoond:

| Statistiek | Beschrijving |
|---|---|
| **Langste reeks** | Meeste opeenvolgende dagen met minimaal één print |
| **Huidige reeks** | Lopende reeks van actieve dagen |
| **Meest actieve dag** | De dag met de meeste prints totaal |
| **Meest actieve week** | De week met de meeste prints |
| **Meest actieve maand** | De maand met de meeste prints |

## Exporteren

Klik op **Exporteren** om kalenderdata te downloaden:

- **PNG** — afbeelding van de heatmap (voor delen)
- **CSV** — ruwe data met één rij per dag (datum, aantal, gram, uren)

De PNG-export is geoptimaliseerd voor delen op sociale media met de printernaam en het jaar als ondertitel.
