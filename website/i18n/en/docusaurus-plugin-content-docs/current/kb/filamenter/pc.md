---
sidebar_position: 7
title: PC
description: Guide to polycarbonate printing with Bambu Lab — high strength, heat resistance and requirements
---

# PC (Polycarbonate)

Polycarbonate is one of the strongest thermoplastic materials available for FDM printing. It combines extremely high impact resistance, heat resistance up to 110–130 °C, and natural transparency. PC is a demanding material to print, but delivers results approaching injection-molded quality.

## Settings

| Parameter | Pure PC | PC-ABS blend | PC-CF |
|-----------|--------|-------------|-------|
| Nozzle temperature | 260–280 °C | 250–270 °C | 270–290 °C |
| Bed temperature | 100–120 °C | 90–110 °C | 100–120 °C |
| Chamber temperature | 50–60 °C (required) | 45–55 °C | 50–60 °C |
| Part cooling | 0–20% | 20–30% | 0–20% |
| Speed | 60–80% | 70–90% | 50–70% |
| Drying required | Yes (critical) | Yes | Yes (critical) |

## Recommended build plates

| Plate | Suitability | Glue stick? |
|-------|------------|------------|
| High Temp Plate | Excellent (required) | No |
| Engineering Plate | Acceptable | Yes |
| Textured PEI | Not recommended | — |
| Cool Plate (Smooth PEI) | Do not use | — |

:::danger High Temp Plate is required
PC requires bed temperatures of 100–120 °C. Cool Plate and Textured PEI cannot withstand these temperatures and will be damaged. **Always** use High Temp Plate for pure PC.
:::

## Printer and equipment requirements

### Enclosure (required)

PC requires a **fully enclosed chamber** with stable temperature of 50–60 °C. Without this you will experience severe warping, layer separation, and delamination.

### Hardened nozzle (strongly recommended)

Pure PC is not abrasive, but PC-CF and PC-GF **require a hardened steel nozzle** (e.g., Bambu Lab HS01). For pure PC, a hardened nozzle is still recommended due to the high temperatures.

### Printer compatibility

| Printer | Suitable for PC? | Note |
|---------|-----------------|------|
| X1C | Excellent | Fully enclosed, HS01 available |
| X1E | Excellent | Designed for engineering materials |
| P1S | Limited | Enclosed, but lacks active chamber heating |
| P1P | Not recommended | Lacks enclosure |
| A1 / A1 Mini | Do not use | Open frame, temperatures too low |

:::warning Only X1C and X1E recommended
PC requires active chamber heating for consistent results. P1S can give acceptable results with small parts, but expect warping and layer separation with larger parts.
:::

## Drying

PC is **highly hygroscopic** and absorbs moisture rapidly. Moist PC gives catastrophic print results.

| Parameter | Value |
|-----------|-------|
| Drying temperature | 70–80 °C |
| Drying time | 6–8 hours |
| Hygroscopic level | High |
| Max recommended moisture | < 0.02% |

- **Always** dry PC before printing — even freshly opened spools may have absorbed moisture
- Print directly from a dryer box if possible
- AMS is **not sufficient** for PC storage — the humidity is too high
- Use a dedicated filament dryer with active heating

:::danger Moisture destroys PC prints
Signs of moist PC: loud popping sounds, bubbles on the surface, very poor layer bonding, stringing. Moist PC cannot be compensated with settings — it **must** be dried first.
:::

## Properties

| Property | Value |
|----------|-------|
| Tensile strength | 55–75 MPa |
| Impact resistance | Extremely high |
| Heat resistance (HDT) | 110–130 °C |
| Transparency | Yes (natural/clear variant) |
| Chemical resistance | Moderate |
| UV resistance | Moderate (yellows over time) |
| Shrinkage | ~0.5–0.7% |

## PC blends

### PC-ABS

A blend of polycarbonate and ABS that combines the strengths of both materials:

- **Easier to print** than pure PC — lower temperatures and less warping
- **Impact resistance** between ABS and PC
- **Popular in industry** — used in automotive interiors and electronics housings
- Prints at 250–270 °C nozzle, 90–110 °C bed

### PC-CF (carbon fiber)

Carbon fiber reinforced PC for maximum rigidity and strength:

- **Extremely rigid** — ideal for structural parts
- **Lightweight** — carbon fiber reduces weight
- **Requires hardened nozzle** — brass wears out in hours
- Prints at 270–290 °C nozzle, 100–120 °C bed
- More expensive than pure PC, but provides mechanical properties close to aluminum

### PC-GF (glass fiber)

Glass fiber reinforced PC:

- **Cheaper than PC-CF** with good rigidity
- **Whiter surface** than PC-CF
- **Requires hardened nozzle** — glass fibers are highly abrasive
- Somewhat less rigid than PC-CF, but better impact resistance

## Applications

PC is used where you need **maximum strength and/or heat resistance**:

- **Mechanical parts** — gears, brackets, couplings under load
- **Optical parts** — lenses, light guides, transparent covers (clear PC)
- **Heat-resistant parts** — engine bays, near heating elements
- **Electronics housings** — protective enclosures with good impact resistance
- **Tools and jigs** — precise assembly tools

## Tips for successful PC printing

### First layer

- Reduce speed to **30–40%** for the first layer
- Increase bed temperature by 5 °C above standard for the first 3–5 layers
- **Brim is mandatory** for most PC parts — use 8–10 mm

### Chamber temperature

- Let the chamber reach **50 °C+** before printing starts
- **Do not open the chamber door** during printing — the temperature drop causes immediate warping
- After printing: let the part cool **slowly** in the chamber (1–2 hours)

### Cooling

- Use **minimal part cooling** (0–20%) for best layer bonding
- For bridges and overhangs: temporarily increase to 30–40%
- Prioritize layer strength over aesthetics with PC

### Design considerations

- **Avoid sharp corners** — round off with minimum 1 mm radius
- **Uniform wall thickness** — uneven thickness creates internal stresses
- **Large flat surfaces** are difficult — split up or add ribs

:::tip New to PC? Start with PC-ABS
If you haven't printed PC before, start with a PC-ABS blend. It's much more forgiving than pure PC and gives you experience with the material without the extreme requirements. Once you master PC-ABS, move on to pure PC.
:::

---

## Post-processing

- **Sanding** — PC sands well, but use wet sanding for clear PC
- **Polishing** — clear PC can be polished to near-optical quality
- **Gluing** — dichloromethane bonding gives invisible joints (use protective equipment!)
- **Painting** — requires primer for good adhesion
- **Annealing** — 120 °C for 1–2 hours reduces internal stresses

:::warning Dichloromethane bonding
Dichloromethane is toxic and requires extraction, chemical-resistant gloves, and safety goggles. Always work in a well-ventilated room or fume hood.
:::
