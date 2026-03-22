---
sidebar_position: 4
title: Kostnadsberäknare
description: Ladda upp 3MF- eller GCode-fil och beräkna totalkostnad för filament, el och maskinslitage innan du skriver ut
---

# Kostnadsberäknare

Kostnadsberäknaren låter dig uppskatta totalkostnaden för en utskrift innan du skickar den till skrivaren — baserat på filamentförbrukning, elpris och maskinslitage.

Gå till: **https://localhost:3443/#cost-estimator**

## Ladda upp fil

1. Gå till **Kostnadsberäknare**
2. Dra och släpp en fil i uppladdningsfältet, eller klicka **Välj fil**
3. Format som stöds: `.3mf`, `.gcode`, `.bgcode`
4. Klicka **Analysera**

:::info Analys
Systemet analyserar G-koden för att extrahera filamentförbrukning, uppskattad utskriftstid och materialprofil. Detta tar vanligtvis 2–10 sekunder.
:::

## Filamentberäkning

Efter analys visas:

| Fält | Värde (exempel) |
|---|---|
| Uppskattat filament | 47.3 g |
| Material (från fil) | PLA |
| Pris per gram | 0.025 kr (från filamentlager) |
| **Filamentkostnad** | **1.18 kr** |

Byt material i rullgardinsmenyn för att jämföra kostnader med olika filamenttyper eller leverantörer.

:::tip Materialöverstyring
Om G-koden inte innehåller materialinformation, välj material manuellt från listan. Priset hämtas automatiskt från filamentlagret.
:::

## Elberäkning

Elkostnaden beräknas baserat på:

- **Uppskattad utskriftstid** — från G-code-analys
- **Skrivarens effekt** — konfigurerad per skrivarmodell (W)
- **Elpris** — fast pris (kr/kWh) eller live från Tibber/Nordpool

| Fält | Värde (exempel) |
|---|---|
| Uppskattad utskriftstid | 3 timmar 22 min |
| Skrivareffekt | 350 W (X1C) |
| Uppskattad förbrukning | 1.17 kWh |
| Elpris | 1.85 kr/kWh |
| **Elkostnad** | **2.16 kr** |

Aktivera Tibber- eller Nordpool-integrationen för att använda planerade timpriser baserade på önskat starttidpunkt.

## Maskinslitage

Slitagekostnaden uppskattas baserat på:

- Utskriftstid × timkostnad per skrivarmodell
- Extra slitage för abrasivt material (CF, GF, osv.)

| Fält | Värde (exempel) |
|---|---|
| Utskriftstid | 3 timmar 22 min |
| Timkostnad (slitage) | 0.80 kr/timme |
| **Slitagekostnad** | **2.69 kr** |

Timkostnaden beräknas från komponentpriser och förväntad livslängd (se [Slitageprediktion](../overvaaking/wearprediction)).

## Totalsumma

| Kostnadspost | Belopp |
|---|---|
| Filament | 1.18 kr |
| El | 2.16 kr |
| Maskinslitage | 2.69 kr |
| **Totalt** | **6.03 kr** |
| + Pålägg (30 %) | 1.81 kr |
| **Försäljningspris** | **7.84 kr** |

Justera pålägget i procentfältet för att beräkna rekommenderat försäljningspris till kunden.

## Spara uppskattning

Klicka **Spara uppskattning** för att koppla analysen till ett projekt:

1. Välj befintligt projekt eller skapa nytt
2. Uppskattningen sparas och kan användas som underlag för faktura
3. Faktisk kostnad (efter utskrift) jämförs automatiskt med uppskattningen

## Batchberäkning

Ladda upp flera filer samtidigt för att beräkna totalkostnad för en komplett uppsättning:

1. Klicka **Batchläge**
2. Ladda upp alla `.3mf`/`.gcode`-filer
3. Systemet beräknar individuellt och summerat kostnad
4. Exportera sammanfattningen som PDF eller CSV
