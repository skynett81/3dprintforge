---
sidebar_position: 6
title: Kompozitní materiály (CF/GF)
description: Filamenty plněné karbonovými a skleněnými vlákny — tryska z kalené oceli, opotřebení a nastavení
---

# Kompozitní materiály (CF/GF)

Kompozitní filamenty obsahují krátká karbonová vlákna (CF) nebo skleněná vlákna (GF) smísená v základním plastu jako PLA, PETG, PA nebo ABS. Poskytují zvýšenou tuhost, redukci hmotnosti a lepší rozměrovou stabilitu.

## Dostupné typy

| Filament | Základ | Tuhost | Snížení hmotnosti | Obtížnost |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Vysoká | Střední | Snadná |
| PETG-CF | PETG | Vysoká | Střední | Střední |
| PA6-CF | Nylon 6 | Velmi vysoká | Dobrá | Náročná |
| PA12-CF | Nylon 12 | Velmi vysoká | Dobrá | Střední |
| ABS-CF | ABS | Vysoká | Střední | Střední |
| PLA-GF | PLA | Vysoká | Střední | Snadná |

## Tryska z kalené oceli je nutná

:::danger Nikdy nepoužívejte mosaznou trysku s CF/GF
Karbonová a skleněná vlákna jsou velmi abrazivní. Opotřebují standardní mosaznou trysku za hodiny až dny. Vždy používejte **trysku z kalené oceli** (Hardened Steel) nebo **trysku HS01** se všemi CF a GF materiály.

- Bambu Lab Hardened Steel Nozzle (0,4 mm)
- Bambu Lab HS01 Nozzle (speciální povlak, delší životnost)
:::

## Nastavení (příklad PA-CF)

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 270–290 °C |
| Teplota podložky | 80–100 °C |
| Chlazení dílu | 0–20% |
| Rychlost | 80% |
| Sušení | 80 °C / 12 hodin |

Pro PLA-CF: tryska 220–230 °C, podložka 35–50 °C — mnohem jednodušší než PA-CF.

## Podložky

| Podložka | Vhodnost | Lepidlo? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Vynikající | Ano (pro PA základ) |
| High Temp Plate | Dobré | Ano |
| Cool Plate | Vyhněte se (CF škrábe) | — |
| Textured PEI | Dobré | Ano |

:::warning Podložka může být poškrábána
CF materiály mohou škrábat hladké podložky při odstraňování. Vždy používejte Engineering Plate nebo Textured PEI. Netahejte tisk — opatrně ohněte podložku.
:::

## Povrchová úprava

CF filamenty dávají matný, uhlíkový povrch, který nepotřebuje lakování. Povrch je poněkud porézní a může být impregnován epoxidem pro hladší finish.

## Opotřebení a životnost trysky

| Typ trysky | Životnost s CF | Cena |
|----------|---------------|---------|
| Mosaz (standardní) | Hodiny–dny | Nízká |
| Kalená ocel | 200–500 hodin | Střední |
| HS01 (Bambu) | 500–1000 hodin | Vysoká |

Vyměňte trysku při viditelném opotřebení: rozšířený otvor, tenké stěny, špatná rozměrová přesnost.

## Sušení

CF varianty PA a PETG vyžadují sušení stejně jako základ:
- **PLA-CF:** Sušení doporučeno, ale není kritické
- **PETG-CF:** 65 °C / 6–8 hodin
- **PA-CF:** 80 °C / 12 hodin — kritické
