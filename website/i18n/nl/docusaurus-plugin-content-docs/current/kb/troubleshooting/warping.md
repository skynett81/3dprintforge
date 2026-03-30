---
sidebar_position: 2
title: Warping
description: Oorzaken van warping en oplossingen — behuizing, brim, temperatuur en draft shield
---

# Warping

Warping treedt op wanneer hoeken of randen van de print oplichten van het bed tijdens of na het printen. Dit wordt veroorzaakt door thermische krimp van het materiaal.

## Wat is warping?

Wanneer plastic afkoelt, krimpt het. De bovenste lagen zijn warmer dan de onderste — dit creëert spanning die de randen omhoog trekt en de print buigt. Hoe groter het temperatuurverschil, hoe meer warping.

## Meest gevoelige materialen

| Materiaal | Warpingrisico | Behuizing vereist |
|-----------|-------------|-----------------|
| PLA | Laag | Nee |
| PETG | Laag–Matig | Nee |
| ABS | Hoog | Ja |
| ASA | Hoog | Ja |
| PA/Nylon | Zeer hoog | Ja |
| PC | Zeer hoog | Ja |
| TPU | Laag | Nee |

## Oplossingen

### 1. Gebruik een gesloten behuizing (kammer)

De belangrijkste maatregel voor ABS, ASA, PA en PC:
- Houd de kammertemperatuur 40–55 °C voor beste resultaat
- X1C en P1S: activeer kammerventilator in «gesloten» modus
- A1/P1P: gebruik een afdekkapje om de warmte vast te houden

### 2. Gebruik een brim

Een brim is een enkele laag met extra brede randen die de print aan het bed houdt:

```
Bambu Studio:
1. Kies de print in de slicer
2. Ga naar Ondersteuning → Brim
3. Stel de breedte in op 5–10 mm (hoe meer warping, hoe breder)
4. Type: Outer Brim Only (aanbevolen)
```

:::tip Brim-breedte gids
- PLA (zelden nodig): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Verhoog de bedtemperatuur

Een hogere bedtemperatuur verkleint het temperatuurverschil tussen lagen:
- ABS: probeer 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Verlaag deelkoeling

Voor materialen met neiging tot warping — verlaag of deactiveer deelkoeling:
- ABS/ASA: 0–20 % deelkoeling
- PA: 0–30 % deelkoeling

### 5. Vermijd tocht en koude lucht

Houd de printer weg van:
- Ramen en buitendeuren
- Airconditioning en ventilatoren
- Tocht in de ruimte

Voor P1P en A1: dek openingen af met karton tijdens kritieke prints.

### 6. Draft Shield

Een draft shield is een dunne wand rondom het object die de warmte vasthoudt:

```
Bambu Studio:
1. Ga naar Ondersteuning → Draft Shield
2. Activeer en stel de afstand in (3–5 mm)
```

Bijzonder nuttig voor hoge, slanke objecten.

### 7. Modelontwerpmaatregelen

Bij het ontwerpen van eigen modellen:
- Vermijd grote vlakke bodems (voeg een afschuining/afronding toe in hoeken)
- Verdeel grote vlakke onderdelen in kleinere secties
- Gebruik «mouse ears» — kleine cirkels in hoeken — in de slicer of CAD

## Warping na afkoeling

Soms ziet de print er goed uit, maar treedt de warping op nadat hij van het bed is verwijderd:
- Wacht altijd tot het bed en de print **volledig zijn afgekoeld** (onder 40 °C) voor verwijdering
- Voor ABS: laat afkoelen in de gesloten behuizing voor langzamere afkoeling
- Zet geen warme print op een koud oppervlak
