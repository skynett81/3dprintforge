---
sidebar_position: 6
title: Komposittmaterialer (CF/GF)
description: Karbonfiber og glassfiberfylte filamenter — herdet stål dyse, slitasje og innstillinger
---

# Komposittmaterialer (CF/GF)

Komposittfilamenter inneholder korte karbonfiberfibre (CF) eller glassfiberfibre (GF) blandet i en basisplast som PLA, PETG, PA eller ABS. De gir økt stivhet, redusert vekt og bedre dimensjonsstabilitet.

## Tilgjengelige typer

| Filament | Basis | Stivhet | Vektreduksjon | Vanskelighetsgrad |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Høy | Moderat | Lett |
| PETG-CF | PETG | Høy | Moderat | Moderat |
| PA6-CF | Nylon 6 | Svært høy | God | Krevende |
| PA12-CF | Nylon 12 | Svært høy | God | Moderat |
| ABS-CF | ABS | Høy | Moderat | Moderat |
| PLA-GF | PLA | Høy | Moderat | Lett |

## Herdet stål-dyse er påkrevd

:::danger Aldri bruk messingdyse med CF/GF
Karbon- og glassfibre er svært abrasive. De vil slite ned en standard messingdyse på timer til dager. Bruk alltid **herdet stål-dyse** (Hardened Steel) eller **HS01-dyse** med alle CF og GF-materialer.

- Bambu Lab Hardened Steel Nozzle (0.4 mm)
- Bambu Lab HS01 Nozzle (spesiell belegg, lenger levetid)
:::

## Innstillinger (PA-CF eksempel)

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 270–290 °C |
| Sengtemperatur | 80–100 °C |
| Del-kjøling | 0–20% |
| Hastighet | 80% |
| Tørking | 80 °C / 12 timer |

For PLA-CF: dyse 220–230 °C, seng 35–50 °C — mye enklere enn PA-CF.

## Byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmerket | Ja (for PA-base) |
| High Temp Plate | Bra | Ja |
| Cool Plate | Unngå (CF riper) | — |
| Textured PEI | Bra | Ja |

:::warning Platen kan ripes
CF-materialer kan ripe glatte plater ved fjerning. Bruk alltid Engineering Plate eller Textured PEI. Ikke dra printen av — bøy platen forsiktig.
:::

## Overflatebehandling

CF-filamenter gir en matt, karbonlignende overflate som ikke trenger maling. Overflaten er noe porøs og kan impregneres med epoxy for glattere finish.

## Slitasje og dyselevetid

| Dysetype | Levetid med CF | Kostnad |
|----------|---------------|---------|
| Messing (standard) | Timer–dager | Lav |
| Herdet stål | 200–500 timer | Moderat |
| HS01 (Bambu) | 500–1000 timer | Høy |

Bytt dyse ved synlig slitasje: utvidet dysehull, tynne vegger, dårlig dimensjonsnøyaktighet.

## Tørking

CF-varianter av PA og PETG krever tørking akkurat som basen:
- **PLA-CF:** Tørking anbefalt, men ikke kritisk
- **PETG-CF:** 65 °C / 6–8 timer
- **PA-CF:** 80 °C / 12 timer — kritisk
