---
sidebar_position: 2
title: Setting up filament inventory
description: How to create, configure and keep track of your filament spools in 3DPrintForge
---

# Setting up filament inventory

The filament inventory in 3DPrintForge gives you a complete overview of all your spools — what is left, what you have used, and which spools are currently loaded in the AMS.

## Automatic creation from AMS

When you connect a printer with AMS, the dashboard automatically reads information from the RFID chips on Bambu spools:

- Filament type (PLA, PETG, ABS, TPU, etc.)
- Color (with color hex)
- Brand (Bambu Lab)
- Spool weight and remaining amount

**These spools are created automatically in the inventory** — you do not need to do anything. View them under **Filament → Inventory**.

:::info Only Bambu spools have RFID
Third-party spools (e.g. eSUN, Polymaker, Bambu refills without a chip) are not recognized automatically. These must be added manually.
:::

## Manually adding spools

For spools without RFID, or for spools not loaded in the AMS:

1. Go to **Filament → Inventory**
2. Click **+ New spool** in the top right corner
3. Fill in the fields:

| Field | Example | Required |
|-------|---------|---------|
| Brand | eSUN, Polymaker, Bambu | Yes |
| Type | PLA, PETG, ABS, TPU | Yes |
| Color | #FF5500 or choose from color wheel | Yes |
| Starting weight | 1000 g | Recommended |
| Remaining | 850 g | Recommended |
| Diameter | 1.75 mm | Yes |
| Note | "Purchased 2025-01, works well" | Optional |

4. Click **Save**

## Configuring colors and brand

You can edit a spool at any time by clicking on it in the inventory overview:

- **Color** — Choose from the color wheel or enter a hex value. The color is used as a visual marker in the AMS overview
- **Brand** — Shown in statistics and filtering. Create custom brands under **Filament → Brands**
- **Temperature profile** — Enter the recommended nozzle and plate temperature from the filament manufacturer. The dashboard can then warn you if you select the wrong temperature

## Understanding AMS synchronization

The dashboard synchronizes AMS status in real time:

```
AMS Slot 1 → Spool: Bambu PLA White  [███████░░░] 72% remaining
AMS Slot 2 → Spool: eSUN PETG Gray   [████░░░░░░] 41% remaining
AMS Slot 3 → (empty)
AMS Slot 4 → Spool: Bambu PLA Red    [██████████] 98% remaining
```

Synchronization updates:
- **During print** — consumption is deducted in real time
- **At print end** — final consumption is logged in the history
- **Manually** — click the sync icon on a spool to fetch updated data from the AMS

:::tip Correcting AMS estimates
The AMS estimate from RFID is not always 100% accurate after the first use. Weigh the spool and update the weight manually for best accuracy.
:::

## Checking consumption and remaining amount

### Per spool
Click on a spool in the inventory to see:
- Total used (grams, all prints)
- Estimated remaining amount
- List of all prints that used this spool

### Overall statistics
Under **Analytics → Filament Analysis** you can see:
- Consumption per filament type over time
- Which brands you use the most
- Estimated cost based on purchase price per kg

### Low-level alerts
Set up alerts for when a spool is running low:

1. Go to **Filament → Settings**
2. Enable **Alert on low stock**
3. Set threshold (e.g. 100 g remaining)
4. Select notification channel (Telegram, Discord, email)

## Tip: Weigh spools for accuracy

The estimates from AMS and from print statistics are never completely exact. The most accurate method is to weigh the spool itself:

**How to do it:**

1. Find the tare weight (empty spool) — typically 200–250 g, check the manufacturer's website or the bottom of the spool
2. Weigh the spool with filament on a kitchen scale
3. Subtract the tare weight
4. Update **Remaining** in the spool profile

**Example:**
```
Measured weight:  743 g
Tare (empty):   - 230 g
Filament left:    513 g
```

:::tip Spool label generator
Under **Tools → Labels** you can print labels with a QR code for your spools. Scan the code with your phone to quickly open the spool profile.
:::
