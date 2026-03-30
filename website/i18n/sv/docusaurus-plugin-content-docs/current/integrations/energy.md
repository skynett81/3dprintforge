---
sidebar_position: 2
title: Elpris
description: Koppla till Tibber eller Nordpool för live timedpriser, prishistorik och prisaviseringar
---

# Elpris

Elprisintegrationen hämtar live elpriser från Tibber eller Nordpool för att ge noggranna elkostnadsberäkningar per utskrift och aviseringar om bra eller dåliga pristider för utskrift.

Gå till: **https://localhost:3443/#settings** → **Integrationer → Elpris**

## Tibber-integration

Tibber är en nordisk elleverantör med öppet API för spotpriser.

### Inställningar

1. Logga in på [developer.tibber.com](https://developer.tibber.com)
2. Generera en **Personal Access Token**
3. I Bambu Dashboard: klistra in token under **Tibber API Token**
4. Välj **Hem** (varifrån priserna ska hämtas, om du har flera hem)
5. Klicka **Testa anslutning**
6. Klicka **Spara**

### Tillgänglig data från Tibber

- **Spotpris nu** — omedelbart pris inkl. avgifter (kr/kWh)
- **Priser nästa 24 timmar** — Tibber levererar morgondagens priser från ca. kl. 13:00
- **Prishistorik** — upp till 30 dagar bakåt
- **Kostnad per utskrift** — beräknad utifrån faktisk utskriftstid × timedpriser

## Nordpool-integration

Nordpool är energibörsen som levererar råspotpriser för Norden.

### Inställningar

1. Gå till **Integrationer → Nordpool**
2. Välj **Prisområde**: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen)
3. Välj **Valuta**: NOK / EUR
4. Välj **Skatter och avgifter**:
   - Kryssa i **Inkludera moms** (25 %)
   - Fyll i **Nätavgift** (kr/kWh) — se faktura från nätbolaget
   - Fyll i **Energiskatt** (kr/kWh)
5. Klicka **Spara**

:::info Nätavgift
Nätavgiften varierar beroende på nätbolag och prismodell. Kontrollera din senaste elräkning för rätt sats.
:::

## Timedpriser

Timedpriser visas som ett stapeldiagram för de nästa 24–48 timmarna:

- **Grön** — billiga timmar (under genomsnitt)
- **Gul** — genomsnittspris
- **Röd** — dyra timmar (över genomsnitt)
- **Grå** — timmar utan tillgänglig prisprognoser

Hovra över en timme för att se exakt pris (kr/kWh).

## Prishistorik

Gå till **Elpris → Historik** för att se:

- Dagligt genomsnittspris senaste 30 dagar
- Dyraste och billigaste timme per dag
- Total elkostnad för utskrifter per dag

## Prisaviseringar

Ställ in automatiska aviseringar baserade på elpriset:

1. Gå till **Elpris → Prisaviseringar**
2. Klicka **Ny avisering**
3. Välj aviseringstyp:
   - **Pris under gräns** — avisera när elpriset sjunker under X kr/kWh
   - **Pris över gräns** — avisera när priset stiger över X kr/kWh
   - **Billigaste timme idag** — avisera när dagens billigaste timme börjar
4. Välj aviseringskanal
5. Klicka **Spara**

:::tip Smart planering
Kombinera prisaviseringar med utskriftskön: ställ in en automatisering som skickar köjobb automatiskt när elpriset är lågt (kräver webhook-integration eller Home Assistant).
:::

## Elpris i kostnadskalkylatorn

Aktiverad elprisintegration ger noggranna elkostnader i [Kostnadskalkylatorn](../analytics/costestimator). Välj **Live-pris** istället för fast pris för att använda aktuellt Tibber/Nordpool-pris.
