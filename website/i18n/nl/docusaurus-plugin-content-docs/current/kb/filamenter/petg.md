---
sidebar_position: 2
title: PETG
description: Handleiding voor PETG-printen — temperatuur, BELANGRIJK over lijmstift, bed en tips
---

# PETG

PETG (Polyethylene Terephthalate Glycol) is een populair materiaal voor functionele onderdelen. Het is sterker en warmtevaster dan PLA, en bestand tegen lichte chemische blootstelling.

## Instellingen

| Parameter | Waarde |
|-----------|-------|
| Spuittemperatuur | 230–250 °C |
| Bedtemperatuur | 70–85 °C |
| Deelkoeling | 30–60 % |
| Snelheid | Standaard |
| Drogen | Aanbevolen (6–8 u bij 65 °C) |

## Aanbevolen printbedden

| Bed | Geschiktheid | Lijmstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Uitstekend | Nee/Ja* |
| Textured PEI | Goed | Ja** |
| Cool Plate (Smooth PEI) | Zie waarschuwing | Zie waarschuwing |
| High Temp Plate | Goed | Ja |

:::danger BELANGRIJK: Lijmstift op Smooth PEI met PETG
PETG hecht **extreem goed** op Smooth PEI (Cool Plate). Zonder lijmstift riskeert u **de coating van het bed te beschadigen** bij het verwijderen van de print. Gebruik altijd een dunne laag lijmstift op Smooth PEI bij PETG — dit werkt als barrière.

**Alternatief:** Gebruik de Engineering Plate of Textured PEI — deze geven goede hechting zonder het bed te beschadigen.
:::

## Tips voor succesvol printen

- **Verlaag deelkoeling** — te veel koeling geeft laagscheiding en een broze print
- **Verhoog spuittemperatuur** — bij stringing, probeer 5–10 °C lager; bij slechte laagverbinding, hoger
- **Eerste laag bedtemperatuur** — 80–85 °C voor goede hechting, verlaag naar 70 °C na de eerste laag
- **Verlaag de snelheid** — PETG is veeleisender dan PLA, begin met 80 % snelheid

:::warning Stringing
PETG heeft de neiging tot stringing. Verhoog de retract-afstand (probeer 0.8–1.5 mm voor direct drive), verhoog de retract-snelheid, en verlaag de spuittemperatuur met 5 °C per keer.
:::

## Drogen

PETG absorbeert vocht sneller dan PLA. Vochtig PETG geeft:
- Bellen en sissen tijdens het printen
- Zwakke lagen met poreus oppervlak
- Meer stringing

**Droog bij 65 °C gedurende 6–8 uur** voor het printen, vooral als de spoel lang open is geweest.

## Bewaring

Bewaar altijd in een afgesloten zak of droogdoos met silicagel. PETG mag niet meer dan een paar dagen open staan in een vochtige omgeving.
