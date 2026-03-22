---
sidebar_position: 2
title: PETG
description: Guide til PETG-printing — temperatur, VIKTIG om limstift, plate og tips
---

# PETG

PETG (Polyethylene Terephthalate Glycol) er et populært materialet for funksjonelle deler. Det er sterkere og mer varmestabilt enn PLA, og tåler lett kjemisk eksponering.

## Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 230–250 °C |
| Sengtemperatur | 70–85 °C |
| Del-kjøling | 30–60% |
| Hastighet | Standard |
| Tørking | Anbefalt (6–8 t ved 65 °C) |

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmerket | Nei/Ja* |
| Textured PEI | Bra | Ja** |
| Cool Plate (Smooth PEI) | Se advarsel | Se advarsel |
| High Temp Plate | Bra | Ja |

:::danger VIKTIG: Limstift på Smooth PEI med PETG
PETG hefter **ekstremt godt** på Smooth PEI (Cool Plate). Uten limstift risikerer du å **rive av belegg fra platen** når du fjerner printen. Bruk alltid et tynt lag limstift på Smooth PEI når du printer PETG — dette fungerer som en barriere.

**Alternativt:** Bruk Engineering Plate eller Textured PEI — disse gir god heft uten å ødelegge platen.
:::

## Tips for vellykket printing

- **Reduser del-kjøling** — for mye kjøling gir lagdeling og sprø print
- **Øk dysetemperatur** — ved stringing, prøv å gå ned 5–10 °C; ved dårlig lagfusing, gå opp
- **Første lag sengtemperatur** — 80–85 °C for god heft, senk til 70 °C etter første lag
- **Sakk ned hastigheten** — PETG er mer krevende enn PLA, start med 80% hastighet

:::warning Stringing
PETG er tilbøyelig til stringing. Øk retract-avstand (prøv 0.8–1.5 mm for direct drive), øk retract-hastighet, og senk dysetemperatur 5 °C om gangen.
:::

## Tørking

PETG absorberer fuktighet raskere enn PLA. Fuktig PETG gir:
- Bobler og hissing under printing
- Svake lag med porøs overflate
- Økt stringing

**Tørk ved 65 °C i 6–8 timer** før printing, spesielt om spolet har vært åpent lenge.

## Oppbevaring

Oppbevar alltid i forseglet pose eller tørreboks med silikagel. PETG bør ikke stå åpent mer enn noen dager i fuktig miljø.
