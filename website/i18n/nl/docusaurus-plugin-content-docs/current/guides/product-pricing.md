---
sidebar_position: 11
title: Productprijzen — verkoopprijs berekenen
description: Complete gids voor het prijzen van 3D-prints voor verkoop met alle kostenfactoren
---

# Productprijzen — verkoopprijs berekenen

Deze gids legt uit hoe je de kostencalculator gebruikt om de juiste verkoopprijs te vinden voor 3D-prints die je verkoopt.

## Kostenoverzicht

De kosten van een 3D-print bestaan uit deze componenten:

| Component | Beschrijving | Voorbeeld |
|-----------|-------------|---------|
| **Filament** | Materiaalkosten op basis van gewicht en spoelprijs | 100g × 0,25 kr/g = 25 kr |
| **Afval** | Materiaalverspilling (purge, mislukte prints, ondersteuning) | 10% extra = 2,50 kr |
| **Elektriciteit** | Stroomverbruik tijdens het printen | 3,5u × 150W × 1,50 kr/kWh = 0,79 kr |
| **Slijtage** | Nozzle + machinewaarde over levensduur | 3,5u × 0,15 kr/u = 0,53 kr |
| **Arbeid** | Jouw tijd voor instelling, nabewerking, verpakking | 10 min × 200 kr/u = 33,33 kr |
| **Opslag** | Winstmarge | 20% = 12,43 kr |

**Totale productiekosten** = som van alle componenten

## Instellingen configureren

### Basisinstellingen

Ga naar **Filament → ⚙ Instellingen** en vul in:

1. **Stroomprijs (kr/kWh)** — jouw stroomprijs. Controleer je stroomrekening of gebruik de Nordpool-integratie
2. **Printervermogen (W)** — typisch 150W voor Bambu Lab-printers
3. **Machinekosten (kr)** — wat je voor de printer hebt betaald
4. **Machinelevensduur (uren)** — verwachte levensduur (3000-8000 uur)
5. **Arbeidskosten (kr/uur)** — jouw uurtarief
6. **Insteltijd (min)** — gemiddelde tijd voor filamentwissel, plaatcontrole, verpakking
7. **Opslag (%)** — gewenste winstmarge
8. **Nozzlekosten (kr/uur)** — nozzleslijtage (HS01 ≈ 0,05 kr/u)
9. **Afvalfactor** — materiaalverspilling (1,1 = 10% extra, 1,15 = 15%)

:::tip Typische waarden voor Bambu Lab
| Instelling | Hobbyist | Semi-pro | Professioneel |
|---|---|---|---|
| Stroomprijs | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Printervermogen | 150W | 150W | 150W |
| Machinekosten | 5 000 kr | 12 000 kr | 25 000 kr |
| Machinelevensduur | 3 000u | 5 000u | 8 000u |
| Arbeidskosten | 0 kr/u | 150 kr/u | 250 kr/u |
| Insteltijd | 5 min | 10 min | 15 min |
| Opslag | 0% | 30% | 50% |
| Afvalfactor | 1,05 | 1,10 | 1,15 |
:::

## Kosten berekenen

1. Ga naar de **Kostencalculator** (`https://localhost:3443/#costestimator`)
2. **Sleep en laat vallen** een `.3mf`- of `.gcode`-bestand
3. Het systeem leest automatisch: filamentgewicht, geschatte tijd, kleuren
4. **Koppel spoelen** — selecteer welke spoelen uit de voorraad worden gebruikt
5. Klik op **Bereken kosten**

### Het resultaat toont:

- **Filament** — materiaalkosten per kleur
- **Afval/verspilling** — gebaseerd op de afvalfactor
- **Elektriciteit** — gebruikt live spotprijs van Nordpool indien beschikbaar
- **Slijtage** — nozzle + machinewaarde
- **Arbeid** — uurtarief + insteltijd
- **Productiekosten** — som van alles hierboven
- **Opslag** — jouw winstmarge
- **Totale kosten** — wat je minimaal zou moeten vragen
- **Voorgestelde verkoopprijzen** — 2×, 2,5×, 3× marge

## Prijsstrategieën

### 2× marge (aanbevolen minimum)
Dekt productiekosten + onvoorziene uitgaven. Gebruik voor vrienden/familie en eenvoudige geometrie.

### 2,5× marge (standaard)
Goede balans tussen prijs en waarde. Werkt voor de meeste producten.

### 3× marge (premium)
Voor complexe modellen, multicolor, hoge kwaliteit of nichemarkten.

:::warning Vergeet de verborgen kosten niet
- Mislukte prints (5-15% van alle prints mislukt)
- Filament dat niet wordt opgebruikt (de laatste 50g is vaak lastig)
- Tijd besteed aan klantenservice
- Verpakking en verzending
- Onderhoud van de printer
:::

## Voorbeeld: Een telefoonhouder prijzen

| Parameter | Waarde |
|-----------|-------|
| Filamentgewicht | 45g PLA |
| Printtijd | 2 uur |
| Spotprijs | 1,20 kr/kWh |

**Berekening:**
- Filament: 45g × 0,25 kr/g = 11,25 kr
- Afval (10%): 1,13 kr
- Elektriciteit: 2u × 0,15kW × 1,20 = 0,36 kr
- Slijtage: 2u × 0,15 = 0,30 kr
- Arbeid: (2u + 10min) × 200 kr/u = 433 kr (of 0 voor hobby)
- **Productiekosten (hobby)**: ~13 kr
- **Verkoopprijs 2,5×**: ~33 kr

## Schatting opslaan

Klik op **Schatting opslaan** om de berekening te archiveren. Opgeslagen schattingen vind je onder het tabblad **Opgeslagen** in de kostencalculator.

## E-commerce

Als je de [e-commercemodule](../integrations/ecommerce) gebruikt, kun je kostenschattingen direct aan bestellingen koppelen voor automatische prijsberekening.
