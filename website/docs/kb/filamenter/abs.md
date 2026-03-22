---
sidebar_position: 3
title: ABS
description: Guide til ABS-printing — temperatur, innelukke, warping og limstift
---

# ABS

ABS (Acrylonitrile Butadiene Styrene) er et termoplast med god varmestabilitet og slagfasthet. Det krever innelukke og er mer krevende enn PLA/PETG, men gir holdbare funksjonelle deler.

## Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 240–260 °C |
| Sengtemperatur | 90–110 °C |
| Kammertemperatur | 45–55 °C (X1C/P1S) |
| Del-kjøling | 0–20% |
| Aux fan | 0% |
| Hastighet | 80–100% |
| Tørking | Anbefalt (4–6 t ved 70 °C) |

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmerket | Ja (anbefalt) |
| High Temp Plate | Utmerket | Ja |
| Cool Plate (Smooth PEI) | Unngå | — |
| Textured PEI | Bra | Ja |

:::tip Limstift for ABS
Bruk alltid limstift på Engineering Plate ved ABS. Det bedrer heften og gjør det lettere å løsne printen uten å skade platen.
:::

## Innelukke (kammer)

ABS **krever** et lukket kammer for å hindre warping:

- **X1C og P1S:** Innebygd kammer med aktiv varmestyring — ideelt for ABS
- **P1P:** Delvis åpen — legg til toppkapper (kappe over toppen) for bedre resultater
- **A1 / A1 Mini:** Åpen CoreXY — **ikke anbefalt** for ABS uten egenbygd innhylling

Hold kammeret lukket under hele printen. Åpne det ikke for å sjekke printen — venter du til avkjøling, slipper du også warping ved slipp.

## Warping

ABS er svært utsatt for warping (hjørnene løfter seg):

- **Øk sengtemperatur** — prøv 105–110 °C
- **Bruk brim** — 5–10 mm brim i Bambu Studio
- **Unngå trekk** — lukk alle luftstrømmer rundt printeren
- **Senk del-kjøling til 0%** — kjøling forårsaker vridning

:::warning Damper
ABS avgir styrenedamp under printing. Sørg for god ventilasjon i rommet, eller bruk HEPA/aktivt kull-filter. Bambu P1S har innebygd filter.
:::

## Etterbehandling

ABS kan slipes, males og limes lettere enn PETG og PLA. Det kan også damputjevnes med aceton for glatt overflate — men vær svært forsiktig med acetoneksponering.

## Oppbevaring

Tørk ved **70 °C i 4–6 timer** før printing. Oppbevar i forseglet boks — ABS absorberer fuktighet, noe som gir poppende lyder og svake lag.
