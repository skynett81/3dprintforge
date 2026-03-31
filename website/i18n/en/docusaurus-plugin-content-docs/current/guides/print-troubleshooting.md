---
sidebar_position: 5
title: Troubleshooting a failed print
description: Diagnose and resolve common print failures using 3DPrintForge's error logs and tools
---

# Troubleshooting a failed print

Something went wrong? Don't worry — most print failures have simple solutions. 3DPrintForge helps you find the cause quickly.

## Step 1 — Check the HMS error codes

HMS (Handling, Monitoring, Sensing) is Bambu Labs' error system. All errors are automatically logged in the dashboard.

1. Go to **Monitoring → Errors**
2. Find the failed print
3. Click on the error code for a detailed description and suggested solution

Common HMS codes:

| Code | Description | Quick fix |
|------|-------------|----------|
| 0700 1xxx | AMS error (jammed, motor problem) | Check filament path in AMS |
| 0300 0xxx | Extrusion error (under/over-extrusion) | Clean nozzle, check filament |
| 0500 xxxx | Calibration error | Run recalibration |
| 1200 xxxx | Temperature deviation | Check cable connections |
| 0C00 xxxx | Camera error | Restart printer |

:::tip Error codes in history
Under **History → [Print] → HMS log** you can see all error codes that occurred during a print — even if the print "completed".
:::

## Common errors and solutions

### Poor adhesion (first layer won't stick)

**Symptoms:** Print comes loose from the plate, curls up, first layer missing

**Causes and solutions:**

| Cause | Solution |
|-------|---------|
| Dirty plate | Wipe with IPA alcohol |
| Wrong plate temperature | Increase by 5°C |
| Z-offset incorrect | Run Auto Bed Leveling again |
| Missing glue stick (PETG/ABS) | Apply a thin layer of glue stick |
| First layer speed too fast | Reduce to 20–30 mm/s for first layer |

**Quick checklist:**
1. Is the plate clean? (IPA + lint-free cloth)
2. Are you using the right plate for the filament type? (see [Choosing the right plate](./choosing-plate))
3. Has Z-calibration been done after the last plate change?

---

### Warping (corners lifting)

**Symptoms:** Corners bend up from the plate, especially on large flat models

**Causes and solutions:**

| Cause | Solution |
|-------|---------|
| Temperature difference | Close the front door on the printer |
| Missing brim | Enable brim in Bambu Studio (3–5 mm) |
| Plate too cold | Increase plate temperature by 5–10°C |
| High-shrinkage filament (ABS) | Use Engineering Plate + chamber >40°C |

**ABS and ASA are especially prone to this.** Always ensure:
- Front door closed
- Minimal ventilation
- Engineering Plate + glue stick
- Chamber temperature 40°C+

---

### Stringing (threads between parts)

**Symptoms:** Fine plastic threads between separate parts of the model

**Causes and solutions:**

| Cause | Solution |
|-------|---------|
| Wet filament | Dry filament 6–8 hours (60–70°C) |
| Nozzle temperature too high | Lower by 5°C |
| Too little retraction | Increase retraction length in Bambu Studio |
| Travel speed too low | Increase travel speed to 200+ mm/s |

**The moisture test:** Listen for popping sounds or look for bubbles in the extrusion — that indicates wet filament. Bambu AMS has built-in humidity measurement; check humidity under **AMS status**.

:::tip Filament dryer
Invest in a filament dryer (e.g. Bambu Filament Dryer) if you work with nylon or TPU — these absorb moisture in under 12 hours.
:::

---

### Spaghetti (print collapses into a mess)

**Symptoms:** Filament hanging in loose strands in the air, print is unrecognizable

**Causes and solutions:**

| Cause | Solution |
|-------|---------|
| Poor adhesion early → came loose → collapsed | See the adhesion section above |
| Speed too high | Reduce speed by 20–30% |
| Wrong support configuration | Enable supports in Bambu Studio |
| Overhang too steep | Split the model or rotate 45° |

**Use Print Guard to stop spaghetti automatically** — see the next section.

---

### Under-extrusion (thin, weak layers)

**Symptoms:** Layers are not solid, holes in walls, weak model

**Causes and solutions:**

| Cause | Solution |
|-------|---------|
| Partially clogged nozzle | Run Cold Pull (see maintenance) |
| Filament too wet | Dry filament |
| Temperature too low | Increase nozzle temperature by 5–10°C |
| Speed too high | Reduce by 20–30% |
| PTFE tube damaged | Inspect and replace PTFE tube |

## Using Print Guard for automatic protection

Print Guard monitors camera images using image recognition and automatically stops the print if spaghetti is detected.

**Enabling Print Guard:**
1. Go to **Monitoring → Print Guard**
2. Enable **Automatic detection**
3. Select action: **Pause** (recommended) or **Cancel**
4. Set sensitivity (start with **Medium**)

**When Print Guard intervenes:**
1. You receive a notification with a camera image of what was detected
2. The print is paused
3. You can choose: **Continue** (if false positive) or **Cancel print**

:::info False positives
Print Guard can occasionally react to models with many thin columns. Lower the sensitivity or temporarily disable it for complex models.
:::

## Diagnostic tools in the dashboard

### Temperature log
Under **History → [Print] → Temperatures** you can see the temperature curve throughout the entire print. Look for:
- Sudden temperature drops (nozzle or plate problem)
- Uneven temperatures (calibration needed)

### Filament statistics
Check whether the filament consumed matches the estimate. Large discrepancies can indicate under-extrusion or filament breakage.

## When to contact support?

Contact Bambu Labs support if:
- The HMS code repeats itself after you have followed all the suggested solutions
- You see mechanical damage to the printer (bent rods, broken gears)
- Temperature values are impossible (e.g. nozzle reads -40°C)
- A firmware update does not solve the problem

**Useful information to have ready for support:**
- HMS error codes from the dashboard's error log
- Camera image of the failure
- Which filament and settings were used (can be exported from history)
- Printer model and firmware version (shown under **Settings → Printer → Info**)
