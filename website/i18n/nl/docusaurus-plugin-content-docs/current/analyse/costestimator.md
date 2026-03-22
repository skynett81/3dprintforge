---
sidebar_position: 4
title: Kostencalculator
description: Upload een 3MF- of GCode-bestand en bereken de totale kosten voor filament, stroom en machineslijtage vóór het printen
---

# Kostencalculator

De kostencalculator laat u de totale kosten van een print schatten voordat u deze naar de printer stuurt — op basis van filamentverbruik, elektriciteitsprijs en machineslijtage.

Ga naar: **https://localhost:3443/#cost-estimator**

## Bestand uploaden

1. Ga naar **Kostencalculator**
2. Sleep een bestand naar het uploadveld, of klik op **Bestand kiezen**
3. Ondersteunde formaten: `.3mf`, `.gcode`, `.bgcode`
4. Klik op **Analyseren**

:::info Analyse
Het systeem analyseert de G-code om filamentverbruik, geschatte printtijd en materiaalprofielen te extraheren. Dit duurt doorgaans 2–10 seconden.
:::

## Filamentberekening

Na analyse wordt het volgende getoond:

| Veld | Waarde (voorbeeld) |
|---|---|
| Geschat filament | 47,3 g |
| Materiaal (uit bestand) | PLA |
| Prijs per gram | €0,025 (uit filamentopslag) |
| **Filamentkosten** | **€1,18** |

Wissel van materiaal in de vervolgkeuzelijst om kosten te vergelijken met verschillende filamenttypen of leveranciers.

:::tip Materiaaloverschrijving
Als de G-code geen materiaalinformatie bevat, selecteer het materiaal handmatig uit de lijst. De prijs wordt automatisch opgehaald uit de filamentopslag.
:::

## Stroomberekening

De stroomkosten worden berekend op basis van:

- **Geschatte printtijd** — uit G-code-analyse
- **Printerverbruik** — geconfigureerd per printermodel (W)
- **Elektriciteitsprijs** — vaste prijs (€/kWh) of live van Tibber/Nordpool

| Veld | Waarde (voorbeeld) |
|---|---|
| Geschatte printtijd | 3 uur 22 min |
| Printerverbruik | 350 W (X1C) |
| Geschat verbruik | 1,17 kWh |
| Elektriciteitsprijs | €0,35/kWh |
| **Stroomkosten** | **€0,41** |

Activeer de Tibber- of Nordpool-integratie om geplande uurtarieven te gebruiken op basis van het gewenste starttijdstip.

## Machineslijtage

De slijtagekosten worden geschat op basis van:

- Printtijd × uurtarief per printermodel
- Extra slijtage voor abrasief materiaal (CF, GF, enz.)

| Veld | Waarde (voorbeeld) |
|---|---|
| Printtijd | 3 uur 22 min |
| Uurtarief (slijtage) | €0,15/uur |
| **Slijtagekosten** | **€0,51** |

Het uurtarief wordt berekend op basis van componentprijzen en verwachte levensduur (zie [Slijtagepredictie](../overvaaking/wearprediction)).

## Totaalbedrag

| Kostenpost | Bedrag |
|---|---|
| Filament | €1,18 |
| Stroom | €0,41 |
| Machineslijtage | €0,51 |
| **Totaal** | **€2,10** |
| + Opslag (30%) | €0,63 |
| **Verkoopprijs** | **€2,73** |

Pas het opslagpercentage aan in het percentageveld om een aanbevolen verkoopprijs voor de klant te berekenen.

## Schatting opslaan

Klik op **Schatting opslaan** om de analyse aan een project te koppelen:

1. Selecteer een bestaand project of maak een nieuw aan
2. De schatting wordt opgeslagen en kan worden gebruikt als basis voor een factuur
3. De werkelijke kosten (na het printen) worden automatisch vergeleken met de schatting

## Batchberekening

Upload meerdere bestanden tegelijk om de totale kosten voor een complete set te berekenen:

1. Klik op **Batchmodus**
2. Upload alle `.3mf`/`.gcode`-bestanden
3. Het systeem berekent individueel en gecombineerde kosten
4. Exporteer de samenvatting als PDF of CSV
