---
sidebar_position: 3
title: ABS
description: Handleiding voor ABS-printen — temperatuur, behuizing, warping en lijmstift
---

# ABS

ABS (Acrylonitrile Butadiene Styrene) is een thermoplast met goede warmtestabiliteit en slagvastheid. Het vereist een gesloten behuizing en is veeleisender dan PLA/PETG, maar geeft duurzame functionele onderdelen.

## Instellingen

| Parameter | Waarde |
|-----------|-------|
| Spuittemperatuur | 240–260 °C |
| Bedtemperatuur | 90–110 °C |
| Kammertemperatuur | 45–55 °C (X1C/P1S) |
| Deelkoeling | 0–20 % |
| Aux fan | 0 % |
| Snelheid | 80–100 % |
| Drogen | Aanbevolen (4–6 u bij 70 °C) |

## Aanbevolen printbedden

| Bed | Geschiktheid | Lijmstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Uitstekend | Ja (aanbevolen) |
| High Temp Plate | Uitstekend | Ja |
| Cool Plate (Smooth PEI) | Vermijden | — |
| Textured PEI | Goed | Ja |

:::tip Lijmstift voor ABS
Gebruik altijd lijmstift op de Engineering Plate bij ABS. Dit verbetert de hechting en maakt het makkelijker de print te verwijderen zonder het bed te beschadigen.
:::

## Gesloten behuizing (kammer)

ABS **vereist** een gesloten behuizing om warping te voorkomen:

- **X1C en P1S:** Ingebouwde kammer met actieve temperatuurregeling — ideaal voor ABS
- **P1P:** Gedeeltelijk open — voeg bovenste afdekkapjes toe voor betere resultaten
- **A1 / A1 Mini:** Open CoreXY — **niet aanbevolen** voor ABS zonder zelfgebouwde behuizing

Houd de kammer gesloten tijdens de gehele print. Open hem niet om de print te controleren — als u wacht tot afkoeling, voorkomt u ook warping bij het loslaten.

## Warping

ABS is zeer gevoelig voor warping (hoeken lichten op):

- **Verhoog bedtemperatuur** — probeer 105–110 °C
- **Gebruik brim** — 5–10 mm brim in Bambu Studio
- **Vermijd tocht** — sluit alle luchtstromingen rond de printer
- **Verlaag deelkoeling naar 0 %** — koeling veroorzaakt kromtrekken

:::warning Dampen
ABS geeft styreenrook af tijdens het printen. Zorg voor goede ventilatie in de ruimte, of gebruik een HEPA/actief koolfilter. De Bambu P1S heeft een ingebouwd filter.
:::

## Nabehandeling

ABS kan makkelijker worden geslepen, geverfd en gelijmd dan PETG en PLA. Het kan ook worden glad gemaakt met acetonverdamping voor een glad oppervlak — maar wees uiterst voorzichtig met acetonblootstelling.

## Bewaring

Droog bij **70 °C gedurende 4–6 uur** voor het printen. Bewaar in een afgesloten doos — ABS absorbeert vocht, wat knallende geluiden en zwakke lagen geeft.
