---
sidebar_position: 2
title: Filament Inventory
description: Manage filament spools, AMS synchronization, drying, and more
---

# Filament Inventory

The filament inventory gives you a complete overview of all filament spools, integrated with AMS and print history.

## Overview

The inventory displays all registered spools with:

- **Color** — visual color card
- **Material** — PLA, PETG, ABS, TPU, PA, etc.
- **Vendor** — Bambu Lab, Polymaker, eSUN, etc.
- **Weight** — remaining grams (estimated or weighed)
- **AMS slot** — which slot the spool is loaded in
- **Status** — active, empty, drying, stored

## Adding spools

1. Click **+ New spool**
2. Fill in material, color, vendor, and weight
3. Scan NFC tag if available, or enter manually
4. Save

:::tip Bambu Lab spools
Bambu Lab's official spools can be imported automatically via the Bambu Cloud integration. See [Bambu Cloud](../getting-started/bambu-cloud).
:::

## AMS synchronization

When the dashboard is connected to the printer, AMS status synchronizes automatically:

- Slots are shown with the correct color and material from AMS
- Consumption updates after each print
- Empty spools are marked automatically

To link a local spool to an AMS slot:
1. Go to **Filament → AMS**
2. Click on the slot you want to link
3. Select a spool from the inventory

## Drying

Register drying cycles to track moisture exposure:

| Field | Description |
|-------|-------------|
| Date dried | When the spool was dried |
| Temperature | Drying temperature (°C) |
| Duration | Number of hours |
| Method | Oven, drying box, filament dryer |

:::info Recommended drying temperatures
See the [Knowledge Base](../kb/intro) for material-specific drying times and temperatures.
:::

## Color card

The color card view organizes spools visually by color. Useful for quickly finding the right color. Filter by material, vendor, or status.

## NFC tags

3DPrintForge supports NFC tags for quick identification of spools:

1. Write the NFC tag ID to the spool in the inventory
2. Scan the tag with your phone
3. The spool opens directly in the dashboard

## Import and export

### Export
Export the entire inventory as CSV: **Filament → Export → CSV**

### Import
Import spools from CSV: **Filament → Import → Select file**

CSV format:
```
name,material,color_hex,vendor,weight_grams,nfc_id
PLA White,PLA,#FFFFFF,Bambu Lab,1000,
PETG Black,PETG,#000000,Polymaker,850,ABC123
```

## Statistics

Under **Filament → Statistics** you will find:

- Total consumption per material (last 30/90/365 days)
- Consumption per printer
- Estimated remaining lifetime per spool
- Most used colors and vendors

## Expiry & shelf-life

Give a spool an expiry date when adding or editing it, or click *Suggest from shelf life* to fill one in from the material's typical shelf life (hygroscopic materials like TPU, Nylon and PVA are shortest; PLA/PETG/ABS longest). Spool cards then show an **Expires in N days** (amber) or **Expired** (red) badge, and the Inventory Health overview counts how many are expiring so you can use them first.

## Purchases (procurement)

The **Purchases** tab (under the Storage group) tracks the order→receive→shelf cycle. Log what you bought (item, brand, cost, date), see pending vs received totals and this month's spend, then **Receive** a purchase to add it to inventory as a new spool or link it to an existing one. You can also press **Buy again** on a low-stock restock suggestion to start a purchase pre-filled.

## Scan to act & stocktake

Scan a spool's QR or short code (or type it) to open a quick-action sheet: view details, edit, check out/in, weigh in, or mark empty. **Stocktake** mode (in the inventory *More* menu) lets you scan through the shelf and tick each spool off with a live counted/uncounted progress list.

## Reports

The **Reports** tab (under the Statistics group) gives a period-scoped (30/90/365-day), exportable summary: consumed weight, filament cost, success rate and waste, plus a per-material table with usage share. Export the table to CSV with one click.
