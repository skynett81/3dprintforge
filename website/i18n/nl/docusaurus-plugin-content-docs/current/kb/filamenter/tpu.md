---
sidebar_position: 4
title: TPU
description: Handleiding voor TPU-printen — temperatuur, snelheid en retract-instellingen
---

# TPU

TPU (Thermoplastic Polyurethane) is een flexibel materiaal dat wordt gebruikt voor hoesjes, pakkingen, wielen en andere onderdelen die elasticiteit vereisen.

## Instellingen

| Parameter | Waarde |
|-----------|-------|
| Spuittemperatuur | 220–240 °C |
| Bedtemperatuur | 30–45 °C |
| Deelkoeling | 50–80 % |
| Snelheid | 30–50 % (BELANGRIJK) |
| Retract | Minimaal of uitgeschakeld |
| Drogen | Aanbevolen (6–8 u bij 60 °C) |

:::danger Lage snelheid is kritiek
TPU moet langzaam worden geprint. Een te hoge snelheid zorgt ervoor dat het materiaal in de extruder wordt gecomprimeerd en verstopping veroorzaakt. Begin met 30 % snelheid en verhoog voorzichtig.
:::

## Aanbevolen printbedden

| Bed | Geschiktheid | Lijmstift? |
|-------|---------|----------|
| Textured PEI | Uitstekend | Nee |
| Cool Plate (Smooth PEI) | Goed | Nee |
| Engineering Plate | Goed | Nee |

## Retract-instellingen

TPU is elastisch en reageert slecht op agressieve retract:

- **Direct drive (X1C/P1S/A1):** Retract 0.5–1.0 mm, 25 mm/s
- **Bowden (vermijden met TPU):** Zeer veeleisend, niet aanbevolen

Voor zeer zachte TPU (Shore A 85 of lager): schakel retract volledig uit en vertrouw op temperatuur- en snelheidscontrole.

## Tips

- **Droog het filament** — vochtig TPU is extreem moeilijk te printen
- **Gebruik direct drive** — Bambu Lab P1S/X1C/A1 hebben allemaal direct drive
- **Vermijd hoge temperatuur** — boven 250 °C degradeert TPU en geeft verkleurde prints
- **Neiging** — TPU heeft de neiging tot stringing; verlaag de temperatuur met 5 °C of verhoog koeling

:::tip Shore-hardheid
TPU is verkrijgbaar in verschillende Shore-hardheden (A85, A95, A98). Hoe lager Shore A, hoe zachter en moeilijker te printen. De TPU van Bambu Lab is Shore A 95 — een goed startpunt.
:::

## Bewaring

TPU is sterk hygroscopisch (trekt vocht aan). Vochtig TPU geeft:
- Bellen en sissen
- Zwakke en broze print (paradoxaal voor een flexibel materiaal)
- Stringing

**Droog TPU altijd** bij 60 °C gedurende 6–8 uur voor het printen. Bewaar in een afgesloten doos met silicagel.
