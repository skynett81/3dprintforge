---
sidebar_position: 10
title: Compatibility matrix
description: Complete overview of material compatibility with Bambu Lab plates, printers and nozzles
---

# Compatibility matrix

This page provides a complete overview of which materials work with which build plates, printers, and nozzle types. Use the tables as a reference when planning prints with new materials.

---

## Materials and build plates

| Material | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Glue stick |
|----------|-----------|-------------------|-----------------|--------------|-----------|
| PLA | Excellent | Good | Not recommended | Good | No |
| PLA+ | Excellent | Good | Not recommended | Good | No |
| PLA-CF | Excellent | Good | Not recommended | Good | No |
| PLA Silk | Excellent | Good | Not recommended | Good | No |
| PETG | Poor | Excellent | Good | Good | Yes (Cool) |
| PETG-CF | Poor | Excellent | Good | Acceptable | Yes (Cool) |
| ABS | Not recommended | Excellent | Good | Acceptable | Yes (HT) |
| ASA | Not recommended | Excellent | Good | Acceptable | Yes (HT) |
| TPU | Good | Good | Not recommended | Excellent | No |
| PA (Nylon) | Not recommended | Excellent | Good | Poor | Yes |
| PA-CF | Not recommended | Excellent | Good | Poor | Yes |
| PA-GF | Not recommended | Excellent | Good | Poor | Yes |
| PC | Not recommended | Acceptable | Excellent | Not recommended | Yes (Eng) |
| PC-CF | Not recommended | Acceptable | Excellent | Not recommended | Yes (Eng) |
| PVA | Excellent | Good | Not recommended | Good | No |
| HIPS | Not recommended | Good | Good | Acceptable | No |
| PVB | Good | Good | Not recommended | Good | No |

**Legend:**
- **Excellent** — works optimally, recommended combination
- **Good** — works well, acceptable alternative
- **Acceptable** — works, but not ideal — requires extra measures
- **Poor** — can work with modifications, but not recommended
- **Not recommended** — poor results or risk of damage to the plate

:::tip PETG and Cool Plate
PETG adheres **too well** to Cool Plate (Smooth PEI) and can tear off the PEI coating when removing the part. Always use glue stick as a release film, or choose Engineering Plate.
:::

:::warning PC and plate selection
PC requires High Temp Plate due to the high bed temperatures (100–120 °C). Other plates can become permanently deformed at these temperatures.
:::

---

## Materials and printers

| Material | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| PLA+ | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| PLA-CF | Yes* | Yes* | Yes* | Yes* | Yes* | Yes | Yes | Yes* | Yes* | Yes* |
| PETG | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| PETG-CF | Yes* | Yes* | Yes* | Yes* | Yes* | Yes | Yes | Yes* | Yes* | Yes* |
| ABS | No | No | Possible** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| ASA | No | No | Possible** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| TPU | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| PA (Nylon) | No | No | No | Possible** | Possible** | Yes | Yes | Yes | Yes | Yes |
| PA-CF | No | No | No | No | No | Yes | Yes | Possible** | Possible** | Possible** |
| PA-GF | No | No | No | No | No | Yes | Yes | Possible** | Possible** | Possible** |
| PC | No | No | No | Possible** | No | Yes | Yes | Possible** | Possible** | Possible** |
| PC-CF | No | No | No | No | No | Yes | Yes | No | No | No |
| PVA | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| HIPS | No | No | Possible** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

**Legend:**
- **Yes** — fully supported and recommended
- **Yes*** — requires hardened steel nozzle (HS01 or equivalent)
- **Possible**** — may work with limitations, not officially recommended
- **No** — not suitable (lacks enclosure, temperatures too low, etc.)

:::danger Enclosure requirements
Materials that require an enclosure (ABS, ASA, PA, PC):
- **A1 and A1 Mini** have an open frame — not suitable
- **P1P** has an open frame — requires enclosure accessory
- **P1S** has an enclosure, but no active chamber heating
- **X1C and X1E** have full enclosure with active heating — recommended for demanding materials
:::

---

## Materials and nozzle types

| Material | Brass (standard) | Hardened steel (HS01) | Hardened Steel |
|----------|------------------|-----------------------|----------------|
| PLA | Excellent | Excellent | Excellent |
| PLA+ | Excellent | Excellent | Excellent |
| PLA-CF | Do not use | Excellent | Excellent |
| PLA Silk | Excellent | Excellent | Excellent |
| PETG | Excellent | Excellent | Excellent |
| PETG-CF | Do not use | Excellent | Excellent |
| ABS | Excellent | Excellent | Excellent |
| ASA | Excellent | Excellent | Excellent |
| TPU | Excellent | Good | Good |
| PA (Nylon) | Good | Excellent | Excellent |
| PA-CF | Do not use | Excellent | Excellent |
| PA-GF | Do not use | Excellent | Excellent |
| PC | Good | Excellent | Excellent |
| PC-CF | Do not use | Excellent | Excellent |
| PVA | Excellent | Good | Good |
| HIPS | Excellent | Excellent | Excellent |
| PVB | Excellent | Good | Good |

:::danger Carbon fiber and glass fiber require hardened nozzle
All materials with **-CF** (carbon fiber) or **-GF** (glass fiber) **require a hardened steel nozzle**. Brass wears out in hours to days with these materials. Bambu Lab HS01 is recommended.

Materials that require a hardened nozzle:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Brass vs hardened steel for regular materials
Brass nozzle provides **better thermal conductivity** and thus smoother extrusion for regular materials (PLA, PETG, ABS). Hardened steel works fine, but may require 5–10 °C higher temperature. Use brass for daily use and switch to hardened steel for CF/GF materials.
:::

---

## Tips for material changes

When switching between materials in AMS or manually, proper purging is important to avoid contamination.

### Recommended purge amount

| From → To | Purge amount | Note |
|-----------|-------------|------|
| PLA → PLA (different color) | 100–150 mm³ | Standard color change |
| PLA → PETG | 200–300 mm³ | Temperature increase, different flow |
| PETG → PLA | 200–300 mm³ | Temperature decrease |
| ABS → PLA | 300–400 mm³ | Large temperature difference |
| PLA → ABS | 300–400 mm³ | Large temperature difference |
| PA → PLA | 400–500 mm³ | Nylon lingers in hotend |
| PC → PLA | 400–500 mm³ | PC requires thorough purging |
| Dark → Light color | 200–300 mm³ | Dark pigment is hard to flush |
| Light → Dark color | 100–150 mm³ | Easier transition |

### Temperature change during material switch

| Transition | Recommendation |
|-----------|---------------|
| Cold → Hot (e.g., PLA → ABS) | Heat up to new material, purge thoroughly |
| Hot → Cold (e.g., ABS → PLA) | Purge first at high temp, then lower |
| Similar temperatures (e.g., PLA → PLA) | Standard purge |
| Large difference (e.g., PLA → PC) | Intermediate stop with PETG can help |

:::warning Nylon and PC leave residue
PA (Nylon) and PC are particularly difficult to purge out. After using these materials:
1. Purge with **PETG** or **ABS** at high temperature (260–280 °C)
2. Run at least **500 mm³** of purge material
3. Visually inspect the extrusion — it should be completely clean without discoloration
:::

---

## Quick reference — material selection

Unsure which material you need? Use this guide:

| Need | Recommended material |
|------|---------------------|
| Prototyping / daily use | PLA |
| Mechanical strength | PETG, PLA Tough |
| Outdoor use | ASA |
| Heat resistance | ABS, ASA, PC |
| Flexible parts | TPU |
| Maximum strength | PA-CF, PC-CF |
| Transparent | PETG (natural), PC (natural) |
| Aesthetics / decoration | PLA Silk, PLA Sparkle |
| Snap-fit / living hinges | PETG, PA |
| Food contact | PLA (with reservations) |
