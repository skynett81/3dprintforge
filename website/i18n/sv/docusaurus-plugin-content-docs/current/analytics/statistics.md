---
sidebar_position: 1
title: Statistik
description: Framgångsrate, filamentförbrukning, trender och nyckeltal för alla Bambu Lab-skrivare över tid
---

# Statistik

Statistiksidan ger dig en komplett översikt över din skrivaraktivitet med nyckeltal, trender och filamentförbrukning över valfri tidsperiod.

Gå till: **https://localhost:3443/#statistics**

## Nyckeltal

Överst på sidan visas fyra KPI-kort:

| Nyckeltal | Beskrivning |
|---|---|
| **Framgångsrate** | Andel lyckade utskrifter av totalt antal utskrifter |
| **Totalt filament** | Gram använt i vald period |
| **Totala utskriftstimmar** | Ackumulerad utskriftstid |
| **Genomsnittlig utskriftstid** | Median varaktighet per utskrift |

Varje nyckeltal visar förändring från föregående period (↑ upp / ↓ ned) som procentavvikelse.

## Framgångsrate

Framgångsraten beräknas per skrivare och totalt:

- **Lyckad** — utskrift slutförd utan avbrott
- **Avbruten** — manuellt stoppad av användare
- **Misslyckad** — stoppad av Print Guard, HMS-fel eller maskinvarufel

Klicka på framgångsrate-diagrammet för att se vilka utskrifter som misslyckades och orsaken.

:::tip Förbättra framgångsraten
Använd [Felmönsteranalys](../monitoring/erroranalysis) för att identifiera och rätta orsaker till misslyckade utskrifter.
:::

## Trender

Trendvisningen visar utveckling över tid som linjediagram:

1. Välj **Tidsperiod**: Senaste 7 / 30 / 90 / 365 dagar
2. Välj **Gruppering**: Dag / Vecka / Månad
3. Välj **Mätvärde**: Antal utskrifter / Timmar / Gram / Framgångsrate
4. Klicka **Jämför** för att överlappa två mätvärden

Grafen stödjer zoom (scrolla) och panorering (klicka och dra).

## Filamentförbrukning

Filamentförbrukning visas som:

- **Stapeldiagram** — förbrukning per dag/vecka/månad
- **Cirkeldiagram** — fördelning mellan material (PLA, PETG, ABS, osv.)
- **Tabell** — detaljerad lista med totalt gram, meter och kostnad per material

### Förbrukning per skrivare

Använd flervalsfiltret överst för att:
- Visa bara en skrivare
- Jämföra två skrivare sida vid sida
- Se aggregerat totalt för alla skrivare

## Aktivitetskalender

Se en kompakt GitHub-stil heatmap direkt på statistiksidan (förenklad visning), eller gå till fullständig [Aktivitetskalender](./calendar) för mer detaljerad visning.

## Export

1. Klicka **Exportera statistik**
2. Välj datumintervall och vilka mätvärden du vill ha med
3. Välj format: **CSV** (rådata), **PDF** (rapport) eller **JSON**
4. Filen laddas ner

CSV-exporten är kompatibel med Excel och Google Sheets för vidare analys.

## Jämförelse med föregående period

Aktivera **Visa föregående period** för att överlappa grafer med motsvarande föregående period:

- Senaste 30 dagarna vs. 30 dagarna innan
- Innevarande månad vs. föregående månad
- Innevarande år vs. föregående år

Detta gör det enkelt att se om du skriver ut mer eller mindre än tidigare, och om framgångsraten förbättras.
