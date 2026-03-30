---
sidebar_position: 8
title: PVA and support materials
description: Guide to PVA, HIPS, PVB and other support materials for Bambu Lab printers
---

# PVA and support materials

Support materials are used to print complex geometries with overhangs, bridges, and internal cavities that cannot be printed without temporary support. After printing, the support material is removed — either mechanically or by dissolution in a solvent.

## Overview

| Material | Solvent | Combine with | Dissolution time | Difficulty |
|----------|---------|-------------|-----------------|------------|
| PVA | Water | PLA, PETG | 12–24 hours | Demanding |
| HIPS | d-Limonene | ABS, ASA | 12–24 hours | Moderate |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 hours | Moderate |
| BVOH | Water | PLA, PETG, PA | 4–8 hours | Demanding |

---

## PVA (Polyvinyl Alcohol)

PVA is a water-soluble support material that is the most commonly used choice for PLA-based prints with complex support structures.

### Settings

| Parameter | Value |
|-----------|-------|
| Nozzle temperature | 190–210 °C |
| Bed temperature | 45–60 °C |
| Part cooling | 100% |
| Speed | 60–80% |
| Retraction | Increased (6–8 mm) |

### Recommended build plates

| Plate | Suitability | Glue stick? |
|-------|------------|------------|
| Cool Plate (Smooth PEI) | Excellent | No |
| Textured PEI | Good | No |
| Engineering Plate | Good | No |
| High Temp Plate | Avoid | — |

### Compatibility

PVA works best with materials that print at **similar temperatures**:

| Main material | Compatibility | Note |
|--------------|--------------|------|
| PLA | Excellent | Ideal combination |
| PETG | Good | Bed temp can be slightly high for PVA |
| ABS/ASA | Poor | Chamber temp too high — PVA degrades |
| PA (Nylon) | Poor | Temperatures too high |

### Dissolution

- Place the finished print in **lukewarm water** (approx. 40 °C)
- PVA dissolves within **12–24 hours** depending on thickness
- Stir the water periodically to accelerate the process
- Change the water every 6–8 hours for faster dissolution
- An ultrasonic cleaner gives significantly faster results (2–6 hours)

:::danger PVA is extremely hygroscopic
PVA absorbs moisture from the air **very rapidly** — even hours of exposure can ruin print results. PVA that has absorbed moisture causes:

- Heavy bubbling and popping sounds
- Poor adhesion to the main material
- Stringing and sticky surface
- Clogged nozzle

**Always dry PVA immediately before use** and print from a dry environment (dryer box).
:::

### Drying PVA

| Parameter | Value |
|-----------|-------|
| Drying temperature | 45–55 °C |
| Drying time | 6–10 hours |
| Hygroscopic level | Extremely high |
| Storage method | Sealed box with desiccant, always |

---

## HIPS (High Impact Polystyrene)

HIPS is a support material that dissolves in d-limonene (citrus-based solvent). It is the preferred support material for ABS and ASA.

### Settings

| Parameter | Value |
|-----------|-------|
| Nozzle temperature | 220–240 °C |
| Bed temperature | 90–100 °C |
| Chamber temperature | 40–50 °C (recommended) |
| Part cooling | 20–40% |
| Speed | 70–90% |

### Compatibility

| Main material | Compatibility | Note |
|--------------|--------------|------|
| ABS | Excellent | Ideal combination — similar temperatures |
| ASA | Excellent | Very good adhesion |
| PLA | Poor | Temperature difference too large |
| PETG | Poor | Different thermal behavior |

### Dissolution in d-Limonene

- Place the print in **d-limonene** (citrus-based solvent)
- Dissolution time: **12–24 hours** at room temperature
- Heating to 35–40 °C accelerates the process
- d-Limonene can be reused 2–3 times
- Rinse the part in water and dry after dissolution

### Advantages over PVA

- **Much less moisture-sensitive** — easier to store and handle
- **Stronger as support material** — withstands more without breaking down
- **Better thermal compatibility** with ABS/ASA
- **Easier to print** — fewer clogs and problems

:::warning d-Limonene is a solvent
Use gloves and work in a ventilated room. d-Limonene can irritate skin and mucous membranes. Store out of reach of children.
:::

---

## PVB (Polyvinyl Butyral)

PVB is a unique support material that dissolves in isopropanol (IPA) and can be used to smooth surfaces with IPA vapor.

### Settings

| Parameter | Value |
|-----------|-------|
| Nozzle temperature | 200–220 °C |
| Bed temperature | 55–75 °C |
| Part cooling | 80–100% |
| Speed | 70–80% |

### Compatibility

| Main material | Compatibility | Note |
|--------------|--------------|------|
| PLA | Good | Acceptable adhesion |
| PETG | Moderate | Bed temp can vary |
| ABS/ASA | Poor | Temperatures too high |

### Surface smoothing with IPA vapor

PVB's unique property is that the surface can be smoothed with IPA vapor:

1. Place the part in a sealed container
2. Place an IPA-dampened cloth at the bottom (no direct contact with the part)
3. Let the vapor work for **30–60 minutes**
4. Remove and let dry for 24 hours
5. The result is a smooth, semi-glossy surface

:::tip PVB as surface finish
Although PVB is primarily a support material, it can be printed as the outermost layer on PLA parts to give a surface that can be IPA-smoothed. This gives a finish reminiscent of acetone-smoothed ABS.
:::

---

## Support material comparison

| Property | PVA | HIPS | PVB | BVOH |
|----------|-----|------|-----|------|
| Solvent | Water | d-Limonene | IPA | Water |
| Dissolution time | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Moisture sensitivity | Extremely high | Low | Moderate | Extremely high |
| Difficulty | Demanding | Moderate | Moderate | Demanding |
| Price | High | Moderate | High | Very high |
| Best with | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Availability | Good | Good | Limited | Limited |
| AMS compatible | Yes (with desiccant) | Yes | Yes | Problematic |

---

## Tips for dual extrusion and multicolor

### General guidelines

- **Purge amount** — support materials require good purging during material changes (at least 150–200 mm³)
- **Interface layers** — use 2–3 interface layers between support and main part for a clean surface
- **Distance** — set support distance to 0.1–0.15 mm for easy removal after dissolution
- **Support pattern** — use triangle pattern for PVA/BVOH, grid for HIPS

### AMS setup

- Place the support material in an **AMS slot with desiccant**
- For PVA: consider an external dryer box with Bowden connection
- Configure the correct material profile in Bambu Studio
- Test with a simple overhang model before printing complex parts

### Common problems and solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| Support doesn't adhere | Distance too large | Reduce interface distance to 0.05 mm |
| Support adheres too well | Distance too small | Increase interface distance to 0.2 mm |
| Bubbles in support material | Moisture | Dry the filament thoroughly |
| Stringing between materials | Insufficient retraction | Increase retraction by 1–2 mm |
| Poor surface against support | Too few interface layers | Increase to 3–4 interface layers |

:::tip Start simple
For your first print with support material: use PLA + PVA, a simple model with clear overhang (45°+), and default settings in Bambu Studio. Optimize as you gain experience.
:::
