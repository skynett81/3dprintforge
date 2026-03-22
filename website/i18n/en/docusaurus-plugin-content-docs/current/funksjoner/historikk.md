---
sidebar_position: 3
title: Print History
description: Complete log of all prints with statistics, filament tracking, and export
---

# Print History

The print history provides a complete log of all prints performed with the dashboard, including statistics, filament consumption, and links to model sources.

## The history table

The table shows all prints with:

| Column | Description |
|--------|-------------|
| Date/time | Start timestamp |
| Model name | File name or MakerWorld title |
| Printer | Which printer was used |
| Duration | Total print time |
| Filament | Material and grams used |
| Plates | Number of layers and weight (g) |
| Status | Completed, cancelled, failed |
| Image | Thumbnail (with cloud integration) |

## Search and filtering

Use the search field and filters to find prints:

- Free-text search on model name
- Filter by printer, material, status, date
- Sort by any column

## Model source links

If the print was started from MakerWorld, a link to the model page is displayed directly. Click on the model name to open MakerWorld in a new tab.

:::info Bambu Cloud
Model links and thumbnails require Bambu Cloud integration. See [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Filament tracking

For each print the following is recorded:

- **Material** — PLA, PETG, ABS, etc.
- **Grams used** — estimated consumption
- **Spool** — which spool was used (if registered in the inventory)
- **Color** — the color's hex code

This provides an accurate picture of filament consumption over time and helps you plan purchases.

## Statistics

Under **History → Statistics** you will find aggregated data:

- **Total number of prints** — and success rate
- **Total print time** — hours and days
- **Filament consumption** — grams and km per material
- **Prints per day** — scrolling graph
- **Most used materials** — pie chart
- **Print duration distribution** — histogram

Statistics can be filtered by time period (7d, 30d, 90d, 1 year, all).

## Export

### CSV export
Export the entire history or filtered results:
**History → Export → Download CSV**

CSV files contain all columns and can be opened in Excel, LibreOffice Calc, or imported into other tools.

### Automatic backup
The history is part of the SQLite database which is automatically backed up during updates. Manual backup under **Settings → Backup**.

## Editing

You can edit print log entries after the fact:

- Correct model names
- Add notes
- Correct filament consumption
- Delete incorrectly recorded prints

Right-click a row and select **Edit** or click the pencil icon.
