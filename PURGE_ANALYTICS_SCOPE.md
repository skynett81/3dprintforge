# Purge / multi-colour waste analytics — scope

## What already exists (do NOT rebuild)

The dashboard already tracks and surfaces multi-colour waste end-to-end:
- **Capture:** `print-tracker.js` counts `colorChanges` per print and writes
  `waste_g` + `color_changes` to `print_history`.
- **Storage:** `print_history.waste_g`, `.color_changes`.
- **Analytics:** `getWasteAnalysis()` / `getMaterialEfficiency()` (db/spools.js) —
  total waste, waste-ratio %, color-changes, avg waste/print, grouped by
  material/brand/status.
- **API:** `/api/waste/stats|history|export|backfill`, `/api/filament-analytics/waste`.
- **UI:** `waste-panel.js`, `filament-analytics.js`, `analytics-panel.js`.

## The actual gap: accuracy, not coverage

`waste_g = startup_purge_g + colorChanges × waste_per_change_g`, with a single
global `waste_per_change_g` (default 5 g). That is wrong by ~50–100× depending on
printer hardware:

| Printer type | Real per-change waste | Current estimate |
|---|---|---|
| **Tool changer** (Snapmaker U1, Prusa XL) — separate hotends, no purge | ~0.05–0.2 g (prime tower amortised; U1 ≈ 4.4 g / 90 swaps) | **5 g — ~50× too high** |
| **Single-nozzle MMU** (Bambu AMS, MMU3, ERCF) — full purge each change | colour-pair dependent, often 1–8 g | 5 g — rough |

So tool-changer users see wildly inflated waste, and single-nozzle waste ignores
colour-pair flush volumes. The analytics are only as good as `waste_g`.

## This change (phase 1 — tool-changer awareness)

Make per-change waste **hardware-aware**:
1. Detect a tool changer during the print (live state exposes `_extra_extruders`
   / `_active_extruder = extruderN`).
2. New setting `waste_per_change_toolchanger_g` (default 0.2 g) used for tool
   changers; keep `waste_per_change_g` (5 g) for single-nozzle.
3. Persist a `print_history.is_tool_changer` flag for transparency / backfill.

This makes the **existing** analytics accurate without touching the UI/API.

## Later phases (not in this change)

- Phase 2: derive single-nozzle per-change waste from the slicer's colour-aware
  flush volumes (the slicer already computes them) when exposed in gcode metadata,
  instead of a flat 5 g.
- Phase 3: surface a pre-print "purge X g vs part Y g" estimate from slicer
  metadata at job start.
