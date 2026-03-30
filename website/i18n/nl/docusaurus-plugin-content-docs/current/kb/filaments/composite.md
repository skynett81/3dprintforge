---
sidebar_position: 6
title: Composietmaterialen (CF/GF)
description: Koolstofvezel en glasvezel gevulde filamenten — geharde stalen spuit, slijtage en instellingen
---

# Composietmaterialen (CF/GF)

Composietfilamenten bevatten korte koolstofvezels (CF) of glasvezels (GF) gemengd in een basisplastic zoals PLA, PETG, PA of ABS. Ze geven verhoogde stijfheid, verminderd gewicht en betere maatvastheid.

## Beschikbare typen

| Filament | Basis | Stijfheid | Gewichtsreductie | Moeilijkheidsgraad |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Hoog | Matig | Eenvoudig |
| PETG-CF | PETG | Hoog | Matig | Matig |
| PA6-CF | Nylon 6 | Zeer hoog | Goed | Veeleisend |
| PA12-CF | Nylon 12 | Zeer hoog | Goed | Matig |
| ABS-CF | ABS | Hoog | Matig | Matig |
| PLA-GF | PLA | Hoog | Matig | Eenvoudig |

## Geharde stalen spuit is vereist

:::danger Gebruik nooit een messingen spuit met CF/GF
Koolstof- en glasvezels zijn zeer abrasief. Ze slijten een standaard messingen spuit op in uren tot dagen. Gebruik altijd een **geharde stalen spuit** (Hardened Steel) of **HS01-spuit** met alle CF- en GF-materialen.

- Bambu Lab Hardened Steel Nozzle (0.4 mm)
- Bambu Lab HS01 Nozzle (speciale coating, langere levensduur)
:::

## Instellingen (PA-CF voorbeeld)

| Parameter | Waarde |
|-----------|-------|
| Spuittemperatuur | 270–290 °C |
| Bedtemperatuur | 80–100 °C |
| Deelkoeling | 0–20 % |
| Snelheid | 80 % |
| Drogen | 80 °C / 12 uur |

Voor PLA-CF: spuit 220–230 °C, bed 35–50 °C — veel eenvoudiger dan PA-CF.

## Printbedden

| Bed | Geschiktheid | Lijmstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Uitstekend | Ja (voor PA-basis) |
| High Temp Plate | Goed | Ja |
| Cool Plate | Vermijden (CF krast) | — |
| Textured PEI | Goed | Ja |

:::warning Het bed kan worden gekrast
CF-materialen kunnen gladde bedden krabben bij verwijdering. Gebruik altijd de Engineering Plate of Textured PEI. Trek de print er niet af — buig het bed voorzichtig.
:::

## Oppervlakteafwerking

CF-filamenten geven een matte, koolstofachtige afwerking die niet geschilderd hoeft te worden. Het oppervlak is enigszins poreus en kan worden geïmpregneerd met epoxy voor een gladdere afwerking.

## Slijtage en spuitLevensduur

| Spuittype | Levensduur met CF | Kostprijs |
|----------|---------------|---------|
| Messing (standaard) | Uren–dagen | Laag |
| Gehard staal | 200–500 uur | Matig |
| HS01 (Bambu) | 500–1000 uur | Hoog |

Vervang de spuit bij zichtbare slijtage: uitgebreid spuitgat, dunne wanden, slechte maatnauwkeurigheid.

## Drogen

CF-varianten van PA en PETG vereisen drogen net als de basisvariant:
- **PLA-CF:** Drogen aanbevolen, maar niet kritiek
- **PETG-CF:** 65 °C / 6–8 uur
- **PA-CF:** 80 °C / 12 uur — kritiek
