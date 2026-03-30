---
sidebar_position: 11
title: Product Pricing — Calculating Sale Price
description: Complete guide to pricing 3D prints for sale with all cost factors
---

# Product Pricing — Calculating Sale Price

This guide explains how to use the cost calculator to find the right sale price for 3D prints you sell.

## Cost Overview

The cost of a 3D print consists of these components:

| Component | Description | Example |
|-----------|-------------|---------|
| **Filament** | Material cost based on weight and spool price | 100g × 0.25 kr/g = 25 kr |
| **Waste** | Material waste (purge, failed prints, support) | 10% extra = 2.50 kr |
| **Electricity** | Power consumption during printing | 3.5h × 150W × 1.50 kr/kWh = 0.79 kr |
| **Wear** | Nozzle + machine value over lifetime | 3.5h × 0.15 kr/h = 0.53 kr |
| **Labor** | Your time for setup, post-processing, packaging | 10 min × 200 kr/h = 33.33 kr |
| **Markup** | Profit margin | 20% = 12.43 kr |

**Total production cost** = sum of all components

## Configuring Settings

### Basic Settings

Go to **Filament → ⚙ Settings** and fill in:

1. **Electricity price (kr/kWh)** — your electricity price. Check your electricity bill or use the Nordpool integration
2. **Printer power (W)** — typically 150W for Bambu Lab printers
3. **Machine cost (kr)** — what you paid for the printer
4. **Machine lifetime (hours)** — expected lifetime (3000-8000 hours)
5. **Labor cost (kr/hour)** — your hourly rate
6. **Setup time (min)** — average time for filament change, plate check, packaging
7. **Markup (%)** — profit margin you want
8. **Nozzle cost (kr/hour)** — nozzle wear (HS01 ≈ 0.05 kr/h)
9. **Waste factor** — material waste (1.1 = 10% extra, 1.15 = 15%)

:::tip Typical values for Bambu Lab
| Setting | Hobbyist | Semi-pro | Professional |
|---|---|---|---|
| Electricity price | 1.50 kr/kWh | 1.50 kr/kWh | 1.00 kr/kWh |
| Printer power | 150W | 150W | 150W |
| Machine cost | 5 000 kr | 12 000 kr | 25 000 kr |
| Machine lifetime | 3 000h | 5 000h | 8 000h |
| Labor cost | 0 kr/h | 150 kr/h | 250 kr/h |
| Setup time | 5 min | 10 min | 15 min |
| Markup | 0% | 30% | 50% |
| Waste factor | 1.05 | 1.10 | 1.15 |
:::

## Calculating Cost

1. Go to **Cost Calculator** (`https://localhost:3443/#costestimator`)
2. **Drag and drop** a `.3mf` or `.gcode` file
3. The system automatically reads: filament weight, estimated time, colors
4. **Link spools** — select which spools from inventory are used
5. Click **Calculate Cost**

### The result shows:

- **Filament** — material cost per color
- **Waste/scrap** — based on the waste factor
- **Electricity** — uses live spot price from Nordpool if available
- **Wear** — nozzle + machine value
- **Labor** — hourly rate + setup time
- **Production cost** — sum of everything above
- **Markup** — your profit margin
- **Total cost** — what you should charge as a minimum
- **Suggested sale prices** — 2×, 2.5×, 3× margin

## Pricing Strategies

### 2× margin (recommended minimum)
Covers production cost + unforeseen expenses. Use for friends/family and simple geometry.

### 2.5× margin (standard)
Good balance between price and value. Works for most products.

### 3× margin (premium)
For complex models, multicolor, high quality, or niche markets.

:::warning Don't forget hidden costs
- Failed prints (5-15% of all prints fail)
- Filament that isn't used up (the last 50g is often difficult)
- Time spent on customer service
- Packaging and shipping
- Printer maintenance
:::

## Example: Pricing a Phone Holder

| Parameter | Value |
|-----------|-------|
| Filament weight | 45g PLA |
| Print time | 2 hours |
| Spot price | 1.20 kr/kWh |

**Calculation:**
- Filament: 45g × 0.25 kr/g = 11.25 kr
- Waste (10%): 1.13 kr
- Electricity: 2h × 0.15kW × 1.20 = 0.36 kr
- Wear: 2h × 0.15 = 0.30 kr
- Labor: (2h + 10min) × 200 kr/h = 433 kr (or 0 for hobby)
- **Production cost (hobby)**: ~13 kr
- **Sale price 2.5×**: ~33 kr

## Save Estimate

Click **Save Estimate** to archive the calculation. Saved estimates can be found under the **Saved** tab in the cost calculator.

## E-commerce

If you use the [e-commerce module](../integrations/ecommerce), you can link cost estimates directly to orders for automatic price calculation.
