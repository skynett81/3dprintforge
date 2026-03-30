---
sidebar_position: 6
title: Kompositmaterial (CF/GF)
description: Kolfiberfyllda och glasfiberfyllda filament — härdat stålmunstycke, slitage och inställningar
---

# Kompositmaterial (CF/GF)

Kompositfilament innehåller korta kolfiber (CF) eller glasfiber (GF) blandade i en basplast som PLA, PETG, PA eller ABS. De ger ökad styvhet, reducerad vikt och bättre dimensionsstabilitet.

## Tillgängliga typer

| Filament | Bas | Styvhet | Viktminskning | Svårighetsgrad |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Hög | Måttlig | Lätt |
| PETG-CF | PETG | Hög | Måttlig | Måttlig |
| PA6-CF | Nylon 6 | Mycket hög | God | Krävande |
| PA12-CF | Nylon 12 | Mycket hög | God | Måttlig |
| ABS-CF | ABS | Hög | Måttlig | Måttlig |
| PLA-GF | PLA | Hög | Måttlig | Lätt |

## Härdat stålmunstycke krävs

:::danger Använd aldrig messingmunstycke med CF/GF
Kolfiber och glasfiber är mycket abrasiva. De sliter ned ett standard messingmunstycke på timmar till dagar. Använd alltid **härdat stålmunstycke** (Hardened Steel) eller **HS01-munstycke** med alla CF- och GF-material.

- Bambu Lab Hardened Steel Nozzle (0.4 mm)
- Bambu Lab HS01 Nozzle (speciell beläggning, längre livslängd)
:::

## Inställningar (PA-CF exempel)

| Parameter | Värde |
|-----------|-------|
| Munstycketemperatur | 270–290 °C |
| Bäddtemperatur | 80–100 °C |
| Delavkylning | 0–20% |
| Hastighet | 80% |
| Torkning | 80 °C / 12 timmar |

För PLA-CF: munstycke 220–230 °C, bädd 35–50 °C — mycket enklare än PA-CF.

## Byggplattor

| Platta | Lämplighet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmärkt | Ja (för PA-bas) |
| High Temp Plate | Bra | Ja |
| Cool Plate | Undvik (CF repar) | — |
| Textured PEI | Bra | Ja |

:::warning Plattan kan repas
CF-material kan repa glatta plattor vid borttagning. Använd alltid Engineering Plate eller Textured PEI. Dra inte av utskriften — böj plattan försiktigt.
:::

## Ytbehandling

CF-filament ger en matt, kolliknande yta som inte behöver målas. Ytan är något porös och kan impregneras med epoxy för slätare finish.

## Slitage och munstyckets livslängd

| Munstycketyp | Livslängd med CF | Kostnad |
|----------|---------------|---------|
| Messing (standard) | Timmar–dagar | Låg |
| Härdat stål | 200–500 timmar | Måttlig |
| HS01 (Bambu) | 500–1000 timmar | Hög |

Byt munstycke vid synligt slitage: utvidgat munstyckhål, tunna väggar, dålig dimensionsnoggrannhet.

## Torkning

CF-varianter av PA och PETG kräver torkning precis som basmaterialet:
- **PLA-CF:** Torkning rekommenderas, men inte kritiskt
- **PETG-CF:** 65 °C / 6–8 timmar
- **PA-CF:** 80 °C / 12 timmar — kritiskt
