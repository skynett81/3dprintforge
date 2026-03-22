---
sidebar_position: 4
title: Choosing the right build plate
description: Overview of Bambu Labs build plates and which one suits your filament best
---

# Choosing the right build plate

The right build plate is essential for good adhesion and easy print removal. The wrong combination results in either poor adhesion or the print sticking so firmly that it damages the plate.

## Quick reference table

| Filament | Recommended plate | Glue stick | Plate temperature |
|----------|------------------|------------|------------------|
| PLA | Cool Plate / Textured PEI | No / Yes | 35–45°C |
| PETG | Textured PEI | **Yes (required)** | 70°C |
| ABS | Engineering Plate / High Temp | Yes | 90–110°C |
| ASA | Engineering Plate / High Temp | Yes | 90–110°C |
| TPU | Textured PEI | No | 35–45°C |
| PA (Nylon) | Engineering Plate | Yes | 90°C |
| PC | High Temp Plate | Yes | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Yes | 45–90°C |
| PVA | Cool Plate | No | 35°C |

## Plate descriptions

### Cool Plate (Smooth PEI)
**Best for:** PLA, PVA
**Surface:** Smooth, gives a smooth underside on the print
**Removal:** Flex the plate gently or wait until it cools down — the print releases on its own

Do not use the Cool Plate with PETG — it adheres **too well** and can tear coating off the plate.

### Textured PEI (Patterned)
**Best for:** PETG, TPU, PLA (gives a rough surface)
**Surface:** Patterned, gives a textured and aesthetic underside
**Removal:** Wait until room temperature — the print pops off on its own

:::warning PETG requires glue stick on Textured PEI
Without a glue stick, PETG adheres extremely strongly to Textured PEI and can peel off coating when removed. Always apply a thin layer of glue stick (Bambu glue stick or Elmer's Disappearing Purple Glue) across the entire surface.
:::

### Engineering Plate
**Best for:** ABS, ASA, PA, PLA-CF, PETG-CF
**Surface:** Has a matte PEI surface with lower adhesion than Textured PEI
**Removal:** Easy to remove after cooling. Use glue stick for ABS/ASA

### High Temp Plate
**Best for:** PC, PA-CF, ABS at high temperatures
**Surface:** Withstands plate temperatures up to 120°C without deformation
**Removal:** Cool down to room temperature

## Common mistakes

### PETG on smooth Cool Plate (without glue stick)
**Problem:** PETG bonds so strongly that the print cannot be removed without damage
**Solution:** Always use Textured PEI with glue stick, or Engineering Plate

### ABS on Cool Plate
**Problem:** Warping — corners lift during print
**Solution:** Engineering Plate + glue stick + raise chamber temperature (close the front door)

### PLA on High Temp Plate
**Problem:** Too-high plate temperature gives excessive adhesion, making removal difficult
**Solution:** Cool Plate or Textured PEI for PLA

### Too much glue stick
**Problem:** Thick glue stick causes elephant foot (spreading first layer)
**Solution:** One thin layer — the glue stick should barely be visible

## Changing plates

1. **Let the plate cool** to room temperature (or use gloves — the plate may be hot)
2. Lift the plate from the front and pull out
3. Place the new plate — the magnet holds it in place
4. **Run automatic calibration** (Flow Rate and Bed Leveling) after a plate change in Bambu Studio or via the dashboard under **Controls → Calibration**

:::info Remember to calibrate after changing
Plates have slightly different thicknesses. Without calibration, the first layer may be too far away from or may crash into the plate.
:::

## Plate maintenance

### Cleaning (after every 2–5 prints)
- Wipe with IPA (isopropyl alcohol 70–99%) and a lint-free cloth
- Avoid touching the surface with bare hands — skin oils reduce adhesion
- For Textured PEI: wash with lukewarm water and mild dish soap after many prints

### Removing glue stick residue
- Heat the plate to 60°C
- Wipe with a damp cloth
- Finish with an IPA wipe

### Replacement
Replace the plate when you see:
- Visible pits or marks from print removal
- Consistently poor adhesion even after cleaning
- Bubbles or spots in the coating

Bambu plates typically last 200–500 prints depending on filament type and handling.

:::tip Store plates correctly
Store unused plates in their original packaging or standing upright in a holder — do not stack with heavy objects on top. Deformed plates cause uneven first layers.
:::
