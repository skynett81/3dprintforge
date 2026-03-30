---
sidebar_position: 2
title: Error Log
description: Complete overview of HMS error codes from the printers with severity, search, and links to Bambu Wiki
---

# Error Log

The error log collects all errors and HMS alerts (Health, Maintenance, Safety) from your printers. Bambu Dashboard has a built-in database of 268 HMS codes for Bambu Lab printers.

Go to: **https://localhost:3443/#errors**

## HMS codes

Bambu Lab printers send HMS codes via MQTT when something is wrong. Bambu Dashboard automatically translates these into readable error messages:

| Code | Example | Category |
|------|---------|----------|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Nozzle/extruder |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Build plate |
| `0700 0500 0001 0001` | MC disconnect | Electronics |

The complete list covers all 268 known codes for X1C, P1S, P1P, A1, and A1 Mini.

## Severity levels

Errors are classified into four levels:

| Level | Color | Description |
|-------|-------|-------------|
| **Critical** | Red | Requires immediate action — print stopped |
| **High** | Orange | Should be addressed quickly — print may continue |
| **Medium** | Yellow | Should be investigated — no immediate danger |
| **Info** | Blue | Informational message, no action needed |

## Search and filtering

Use the toolbar at the top of the error log:

1. **Free-text search** — search in error message, HMS code, or printer description
2. **Printer** — show errors from one printer only
3. **Category** — AMS / Nozzle / Plate / Electronics / Calibration / Other
4. **Severity** — All / Critical / High / Medium / Info
5. **Date** — filter by date range
6. **Unacknowledged** — show only errors that have not been acknowledged

Click **Reset filter** to see all errors.

## Wiki links

For each HMS code a link to the Bambu Lab Wiki is displayed with:

- Full error description
- Possible causes
- Step-by-step troubleshooting guide
- Official Bambu Lab recommendations

Click **Open wiki** on an error entry to open the relevant wiki page in a new tab.

:::tip Local copy
Bambu Dashboard caches wiki content locally for offline use. Content is updated automatically weekly.
:::

## Acknowledging errors

Acknowledgment marks an error as handled without deleting it:

1. Click on an error in the list
2. Click **Acknowledge** (checkmark icon)
3. Enter an optional note about what was done
4. The error is marked with a checkmark and moved to the "Acknowledged" list

### Bulk acknowledgment

1. Select multiple errors with checkboxes
2. Click **Acknowledge selected**
3. All selected errors are acknowledged simultaneously

## Statistics

At the top of the error log:

- Total number of errors in the last 30 days
- Number of unacknowledged errors
- Most frequently occurring HMS code
- Printer with the most errors

## Export

1. Click **Export** (download icon)
2. Choose format: **CSV** or **JSON**
3. The current filter is applied to the export — set your desired filter first
4. The file downloads automatically

## Notifications for new errors

Enable notifications for new HMS errors:

1. Go to **Settings → Notifications**
2. Check **New HMS errors**
3. Choose minimum severity level for notification (recommended: **High** and above)
4. Choose notification channel

See [Notifications](../features/notifications) for channel setup.
