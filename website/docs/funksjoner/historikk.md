---
sidebar_position: 3
title: Printhistorikk
description: Komplett logg over alle prints med statistikk, filamentsporing og eksport
---

# Printhistorikk

Printhistorikken gir en komplett logg over alle prints utført med dashboardet, inkludert statistikk, filamentforbruk og lenker til modellkildene.

## Historikktabellen

Tabellen viser alle prints med:

| Kolonne | Beskrivelse |
|---------|-------------|
| Dato/tid | Starttidspunkt |
| Modellnavn | Filnavn eller MakerWorld-tittel |
| Printer | Hvilken printer som ble brukt |
| Varighet | Total printtid |
| Filament | Materiale og gram brukt |
| Plater | Antall lag og vekt (g) |
| Status | Fullført, avbrutt, feilet |
| Bilde | Thumbnail (ved cloud-integrasjon) |

## Søk og filtrering

Bruk søkefeltet og filtrene til å finne prints:

- Fritekst-søk på modellnavn
- Filtrer på printer, materiale, status, dato
- Sorter på alle kolonner

## Modellkilde-lenker

Dersom printen ble startet fra MakerWorld, vises en lenke direkte til modellsiden. Klikk på modellnavnet for å åpne MakerWorld i ny fane.

:::info Bambu Cloud
Modelllenker og thumbnails krever Bambu Cloud-integrasjon. Se [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Filamentsporing

For hver print registreres:

- **Materiale** — PLA, PETG, ABS, osv.
- **Gram brukt** — estimert forbruk
- **Spole** — hvilken spole som ble brukt (om registrert i lageret)
- **Farge** — fargens hex-kode

Dette gir et nøyaktig bilde av filamentforbruk over tid og hjelper deg med å planlegge innkjøp.

## Statistikk

Under **Historikk → Statistikk** finner du aggregerte data:

- **Totalt antall prints** — og suksessrate
- **Total printtid** — timer og dager
- **Filamentforbruk** — gram og km per materiale
- **Prints per dag** — rullegraf
- **Mest brukte materialer** — kakediagram
- **Print-lengde fordeling** — histogram

Statistikken kan filtreres på tidsperiode (7d, 30d, 90d, 1år, alt).

## Eksport

### CSV-eksport
Eksporter hele historikken eller filtrerte resultater:
**Historikk → Eksport → Last ned CSV**

CSV-filene inneholder alle kolonner og kan åpnes i Excel, LibreOffice Calc eller importeres i andre verktøy.

### Automatisk backup
Historikken er en del av SQLite-databasen som automatisk sikkerhetskopieres ved oppdateringer. Manuell backup under **Innstillinger → Backup**.

## Redigering

Du kan redigere printlogg-oppføringer i ettertid:

- Korrigere modellnavn
- Legge til notater
- Korrigere filamentforbruk
- Slette feilregistrerte prints

Høyreklikk en rad og velg **Rediger** eller klikk blyant-ikonet.
