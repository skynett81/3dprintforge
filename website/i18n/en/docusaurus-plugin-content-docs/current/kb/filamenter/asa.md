---
sidebar_position: 6
title: ASA
description: Guide to ASA printing with Bambu Lab — UV-resistant, outdoor use, temperatures and tips
---

# ASA

ASA (Acrylonitrile Styrene Acrylate) is a UV-resistant variant of ABS specifically developed for outdoor use. The material combines the strength and rigidity of ABS with significantly better resistance to UV radiation, aging, and weather exposure.

## Settings

| Parameter | Value |
|-----------|-------|
| Nozzle temperature | 240–260 °C |
| Bed temperature | 90–110 °C |
| Chamber temperature | 40–50 °C (recommended) |
| Part cooling | 30–50% |
| Speed | 80–100% |
| Drying required | Yes |

## Recommended build plates

| Plate | Suitability | Glue stick? |
|-------|------------|------------|
| Engineering Plate | Excellent | No |
| High Temp Plate | Good | Yes |
| Textured PEI | Acceptable | Yes |
| Cool Plate (Smooth PEI) | Not recommended | — |

:::tip Engineering Plate is best for ASA
Engineering Plate provides the most reliable adhesion for ASA without glue stick. The plate withstands the high bed temperatures and provides good adhesion without the part sticking permanently.
:::

## Printer requirements

ASA requires an **enclosed chamber (enclosure)** for best results. Without an enclosure you will experience:

- **Warping** — corners lifting from the build plate
- **Layer separation** — poor bonding between layers
- **Surface cracks** — visible cracks along the print

| Printer | Suitable for ASA? | Note |
|---------|------------------|------|
| X1C | Excellent | Fully enclosed, active heating |
| X1E | Excellent | Fully enclosed, active heating |
| P1S | Good | Enclosed, passive heating |
| P1P | Possible with add-on | Requires enclosure accessory |
| A1 | Not recommended | Open frame |
| A1 Mini | Not recommended | Open frame |

## ASA vs ABS — comparison

| Property | ASA | ABS |
|----------|-----|-----|
| UV resistance | Excellent | Poor |
| Outdoor use | Yes | No (yellows and becomes brittle) |
| Warping | Moderate | High |
| Surface | Matte, even | Matte, even |
| Chemical resistance | Good | Good |
| Price | Somewhat higher | Lower |
| Odor during printing | Moderate | Strong |
| Impact resistance | Good | Good |
| Temperature resistance | ~95–105 °C | ~95–105 °C |

:::warning Ventilation
ASA emits fumes during printing that can be irritating. Print in a well-ventilated room or with an air filtration system. Do not print ASA in a room where you spend extended time without ventilation.
:::

## Drying

ASA is **moderately hygroscopic** and absorbs moisture from the air over time.

| Parameter | Value |
|-----------|-------|
| Drying temperature | 65 °C |
| Drying time | 4–6 hours |
| Hygroscopic level | Medium |
| Signs of moisture | Popping sounds, bubbles, poor surface |

- Store in a sealed bag with silica gel after opening
- AMS with desiccant is sufficient for short-term storage
- For longer storage: use vacuum bags or a filament dryer box

## Applications

ASA is the preferred material for anything intended for **outdoor use**:

- **Automotive components** — mirror housings, dashboard details, vent caps
- **Garden tools** — brackets, clamps, parts for garden furniture
- **Outdoor signage** — signs, letters, logos
- **Drone parts** — landing gear, camera mounts
- **Solar panel mounts** — brackets and angles
- **Mailbox parts** — mechanisms and decorations

## Tips for successful ASA printing

### Brim and adhesion

- **Use brim** for large parts and parts with small contact area
- Brim of 5–8 mm effectively prevents warping
- For smaller parts you can try without brim, but have it ready as a backup

### Avoid drafts

- **Close all doors and windows** in the room during printing
- Drafts and cold air are ASA's worst enemy
- Do not open the chamber door during printing

### Temperature stability

- Let the chamber warm up for **10–15 minutes** before printing starts
- Stable chamber temperature gives more consistent results
- Avoid placing the printer near windows or ventilation openings

### Cooling

- ASA needs **limited part cooling** — 30–50% is typical
- For overhangs and bridges you can increase to 60–70%, but expect some layer separation
- For mechanical parts: prioritize layer bonding over details by reducing cooling

:::tip First time with ASA?
Start with a small test part (e.g., a 30 mm cube) to calibrate your settings. ASA behaves very similarly to ABS, but with slightly lower warping tendencies. If you have experience with ABS, ASA will feel like an upgrade.
:::

---

## Shrinkage

ASA shrinks more than PLA and PETG, but generally slightly less than ABS:

| Material | Shrinkage |
|----------|----------|
| PLA | ~0.3–0.5% |
| PETG | ~0.3–0.6% |
| ASA | ~0.5–0.7% |
| ABS | ~0.7–0.8% |

For parts with tight tolerances: compensate with 0.5–0.7% in the slicer, or test with sample parts first.

---

## Post-processing

- **Acetone smoothing** — ASA can be smoothed with acetone vapor, just like ABS
- **Sanding** — sands well with 200–400 grit sandpaper
- **Gluing** — CA glue or acetone welding works excellently
- **Painting** — takes paint well after light sanding

:::danger Acetone handling
Acetone is flammable and emits toxic fumes. Always use in a well-ventilated room, avoid open flames, and use protective equipment (gloves and goggles).
:::
