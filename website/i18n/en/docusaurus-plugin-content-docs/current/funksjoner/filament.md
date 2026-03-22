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
Bambu Lab's official spools can be imported automatically via the Bambu Cloud integration. See [Bambu Cloud](../kom-i-gang/bambu-cloud).
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

Bambu Dashboard supports NFC tags for quick identification of spools:

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
