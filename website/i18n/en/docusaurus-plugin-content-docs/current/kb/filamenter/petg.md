---
sidebar_position: 2
title: PETG
description: Guide to PETG printing — temperature, IMPORTANT note on glue stick, plates, and tips
---

# PETG

PETG (Polyethylene Terephthalate Glycol) is a popular material for functional parts. It is stronger and more heat-stable than PLA, and tolerates mild chemical exposure.

## Settings

| Parameter | Value |
|-----------|-------|
| Nozzle temperature | 230–250 °C |
| Bed temperature | 70–85 °C |
| Part cooling | 30–60% |
| Speed | Standard |
| Drying | Recommended (6–8 h at 65 °C) |

## Recommended build plates

| Plate | Suitability | Glue stick? |
|-------|------------|------------|
| Engineering Plate (Textured PEI) | Excellent | No/Yes* |
| Textured PEI | Good | Yes** |
| Cool Plate (Smooth PEI) | See warning | See warning |
| High Temp Plate | Good | Yes |

:::danger IMPORTANT: Glue stick on Smooth PEI with PETG
PETG adheres **extremely well** to Smooth PEI (Cool Plate). Without a glue stick you risk **tearing the coating off the plate** when removing the print. Always apply a thin layer of glue stick on Smooth PEI when printing PETG — this acts as a barrier.

**Alternatively:** Use the Engineering Plate or Textured PEI — these provide good adhesion without damaging the plate.
:::

## Tips for successful printing

- **Reduce part cooling** — too much cooling causes layer delamination and brittle prints
- **Adjust nozzle temperature** — for stringing, try going down 5–10 °C; for poor layer fusion, go up
- **First layer bed temperature** — 80–85 °C for good adhesion, lower to 70 °C after the first layer
- **Slow down** — PETG is more demanding than PLA, start at 80% speed

:::warning Stringing
PETG is prone to stringing. Increase retract distance (try 0.8–1.5 mm for direct drive), increase retract speed, and lower nozzle temperature by 5 °C at a time.
:::

## Drying

PETG absorbs moisture faster than PLA. Moist PETG causes:
- Bubbling and hissing during printing
- Weak layers with porous surfaces
- Increased stringing

**Dry at 65 °C for 6–8 hours** before printing, especially if the spool has been open for a while.

## Storage

Always store in a sealed bag or dry box with silica gel. PETG should not be left open for more than a few days in a humid environment.
