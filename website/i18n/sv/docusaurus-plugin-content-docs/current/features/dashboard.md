---
sidebar_position: 2
title: Huvudpanel
description: Realtidsöversikt över aktiv skrivare med 3D-modellvisning, AMS-status, kamera och anpassningsbara widgets
---

# Huvudpanel

Huvudpanelen är det centrala kontrollcentret i 3DPrintForge. Den visar realtidsstatus för den valda skrivaren och låter dig övervaka, styra och anpassa visningen efter behov.

Gå till: **https://localhost:3443/**

## Realtidsöversikt

När en skrivare är aktiv uppdateras alla värden kontinuerligt via MQTT:

- **Munstyckstemperatur** — animerad SVG-ringmätare med måltemperatur
- **Bäddtemperatur** — motsvarande ringmätare för byggplattan
- **Framstegsprocent** — stor procentindikator med återstående tid
- **Lagerräknare** — aktuellt lager / totalt antal lager
- **Hastighet** — Tyst / Standard / Sport / Turbo med skjutreglage

:::tip Realtidsuppdatering
Alla värden uppdateras direkt från skrivaren via MQTT utan att ladda om sidan. Fördröjningen är typiskt under 1 sekund.
:::

## 3D-modellvisning

Om skrivaren skickar en `.3mf`-fil med modellen visas en interaktiv 3D-förhandsgranskning:

1. Modellen laddas automatiskt när en utskrift startar
2. Rotera modellen genom att dra med musen
3. Scrolla för att zooma in/ut
4. Klicka **Återställ** för att gå tillbaka till standardvisning

:::info Stöd
3D-visning kräver att skrivaren skickar modelldata. Inte alla utskriftsjobb inkluderar detta.
:::

## AMS-status

AMS-panelen visar alla monterade AMS-enheter med spår och filament:

- **Spårfärg** — visuell färgrepresentation från Bambu-metadata
- **Filamentnamn** — material och märke
- **Aktivt spår** — markerat med pulsanimation under utskrift
- **Fel** — röd indikator vid AMS-fel (blockering, tomt, fuktigt)

Klicka på ett spår för att se fullständig filamentinfo och koppla det till filamentlagret.

## Kamera-feed

Live-kameravisning konverteras via ffmpeg (RTSPS → MPEG1):

1. Kameran startar automatiskt när du öppnar dashboardet
2. Klicka på kamerabilden för att öppna helskärm
3. Använd **Snapshot**-knappen för att ta en stillbild
4. Klicka **Dölj kamera** för att frigöra utrymme

:::warning Prestanda
Kameraström använder ca. 2–5 Mbit/s. Inaktivera kameran på långsamma nätverksanslutningar.
:::

## Temperatur-sparklines

Under AMS-panelen visas mini-grafer (sparklines) för de senaste 30 minuterna:

- Munstyckstemperatur över tid
- Bäddtemperatur över tid
- Kammartemperatur (där tillgängligt)

Klicka på en sparkline för att öppna fullständig telemetri-grafvisning.

## Widget-anpassning

Dashboardet använder ett dra-och-släpp-rutnät (grid layout):

1. Klicka **Anpassa layout** (pennikonen uppe till höger)
2. Dra widgets till önskad position
3. Ändra storlek genom att dra i hörnet
4. Klicka **Lås layout** för att frysa placeringen
5. Klicka **Spara** för att bevara layouten

Tillgängliga widgets:
| Widget | Beskrivning |
|---|---|
| Kamera | Live-kameravisning |
| AMS | Spol- och filamentstatus |
| Temperatur | Ringmätare för munstycke och bädd |
| Framsteg | Procentindikator och tidsuppskattning |
| Telemetri | Fläktar, tryck, hastighet |
| 3D-modell | Interaktiv modellvisning |
| Sparklines | Mini-temperaturgrafer |

:::tip Sparning
Layouten sparas per användare i webbläsaren (localStorage). Olika användare kan ha olika layouter.
:::
