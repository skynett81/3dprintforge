---
sidebar_position: 3
title: Utskriftshistorik
description: Komplett logg över alla utskrifter med statistik, filamentspårning och export
---

# Utskriftshistorik

Utskriftshistoriken ger en komplett logg över alla utskrifter som utförts med dashboardet, inklusive statistik, filamentförbrukning och länkar till modellkällorna.

## Historiktabellen

Tabellen visar alla utskrifter med:

| Kolumn | Beskrivning |
|---------|-------------|
| Datum/tid | Starttidpunkt |
| Modellnamn | Filnamn eller MakerWorld-titel |
| Skrivare | Vilken skrivare som användes |
| Varaktighet | Total utskriftstid |
| Filament | Material och gram använt |
| Lager | Antal lager och vikt (g) |
| Status | Slutförd, avbruten, misslyckad |
| Bild | Thumbnail (vid cloud-integration) |

## Sökning och filtrering

Använd sökfältet och filtren för att hitta utskrifter:

- Fritextsökning på modellnamn
- Filtrera på skrivare, material, status, datum
- Sortera på alla kolumner

## Modellkällelänkar

Om utskriften startades från MakerWorld visas en länk direkt till modellsidan. Klicka på modellnamnet för att öppna MakerWorld i en ny flik.

:::info Bambu Cloud
Modellänkar och thumbnails kräver Bambu Cloud-integration. Se [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Filamentspårning

För varje utskrift registreras:

- **Material** — PLA, PETG, ABS, osv.
- **Gram använt** — uppskattad förbrukning
- **Spole** — vilken spole som användes (om registrerad i lagret)
- **Färg** — färgens hex-kod

Detta ger en korrekt bild av filamentförbrukning över tid och hjälper dig att planera inköp.

## Statistik

Under **Historik → Statistik** hittar du aggregerade data:

- **Totalt antal utskrifter** — och framgångsrate
- **Total utskriftstid** — timmar och dagar
- **Filamentförbrukning** — gram och km per material
- **Utskrifter per dag** — rullande graf
- **Mest använda material** — cirkeldiagram
- **Utskriftslängd-fördelning** — histogram

Statistiken kan filtreras på tidsperiod (7d, 30d, 90d, 1år, allt).

## Export

### CSV-export
Exportera hela historiken eller filtrerade resultat:
**Historik → Export → Ladda ner CSV**

CSV-filerna innehåller alla kolumner och kan öppnas i Excel, LibreOffice Calc eller importeras i andra verktyg.

### Automatisk säkerhetskopia
Historiken är en del av SQLite-databasen som automatiskt säkerhetskopieras vid uppdateringar. Manuell säkerhetskopia under **Inställningar → Säkerhetskopia**.

## Redigering

Du kan redigera utskriftsloggposter i efterhand:

- Korrigera modellnamn
- Lägga till anteckningar
- Korrigera filamentförbrukning
- Ta bort felregistrerade utskrifter

Högerklicka på en rad och välj **Redigera** eller klicka pennikonen.
