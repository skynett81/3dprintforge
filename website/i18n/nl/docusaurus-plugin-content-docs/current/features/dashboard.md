---
sidebar_position: 2
title: Hoofdpaneel
description: Realtime overzicht van de actieve printer met 3D-modelweergave, AMS-status, camera en aanpasbare widgets
---

# Hoofdpaneel

Het hoofdpaneel is het centrale bedieningscentrum van 3DPrintForge. Het toont de realtime status van de geselecteerde printer en laat u de weergave monitoren, besturen en aanpassen naar wens.

Ga naar: **https://localhost:3443/**

## Realtime overzicht

Wanneer een printer actief is, worden alle waarden continu bijgewerkt via MQTT:

- **Spuitmondtemperatuur** — geanimeerde SVG-ringmeter met doeltemperatuur
- **Bedtemperatuur** — overeenkomstige ringmeter voor het bouwplatform
- **Voortgangspercentage** — grote percentageindicator met resterende tijd
- **Laagenteller** — huidige laag / totaal aantal lagen
- **Snelheid** — Stil / Standaard / Sport / Turbo met schuifregelaar

:::tip Realtime bijwerken
Alle waarden worden direct van de printer bijgewerkt via MQTT zonder de pagina opnieuw te laden. De vertraging is doorgaans minder dan 1 seconde.
:::

## 3D-modelweergave

Als de printer een `.3mf`-bestand met het model verstuurt, wordt een interactieve 3D-voorvertoning getoond:

1. Het model wordt automatisch geladen wanneer een print start
2. Draai het model door met de muis te slepen
3. Scroll om in/uit te zoomen
4. Klik op **Terugzetten** om terug te gaan naar de standaardweergave

:::info Ondersteuning
3D-weergave vereist dat de printer modeldata verstuurt. Niet alle printtaken bevatten dit.
:::

## AMS-status

Het AMS-paneel toont alle gemonteerde AMS-eenheden met sporen en filament:

- **Spoelkleur** — visuele kleurrepresentatie van Bambu-metadata
- **Filamentnaam** — materiaal en merk
- **Actief spoor** — gemarkeerd met pulsanimatie tijdens het printen
- **Fouten** — rode indicator bij AMS-fouten (blokkering, leeg, vochtig)

Klik op een spoor om volledige filamentinformatie te zien en het te koppelen aan de filamentopslag.

## Camerastream

Live cameraweergave wordt geconverteerd via ffmpeg (RTSPS → MPEG1):

1. De camera start automatisch wanneer u het dashboard opent
2. Klik op het camerabeeld om volledig scherm te openen
3. Gebruik de knop **Snapshot** om een stilstaand beeld te maken
4. Klik op **Camera verbergen** om ruimte vrij te maken

:::warning Prestaties
Camerastream gebruikt circa 2–5 Mbit/s. Schakel de camera uit bij trage netwerkverbindingen.
:::

## Temperatuur-sparklines

Onder het AMS-paneel worden minigrafieken (sparklines) weergegeven voor de afgelopen 30 minuten:

- Spuitmondtemperatuur over tijd
- Bedtemperatuur over tijd
- Kamertemperatuur (waar beschikbaar)

Klik op een sparkline om de volledige telemetriegrafiekweergave te openen.

## Widget-aanpassing

Het dashboard gebruikt een slepen-en-neerzetten raster (grid layout):

1. Klik op **Lay-out aanpassen** (potloodpictogram rechts bovenaan)
2. Sleep widgets naar de gewenste positie
3. Wijzig de grootte door aan de hoek te slepen
4. Klik op **Lay-out vergrendelen** om de plaatsing te bevriezen
5. Klik op **Opslaan** om de indeling te bewaren

Beschikbare widgets:
| Widget | Beschrijving |
|---|---|
| Camera | Live cameraweergave |
| AMS | Spoel- en filamentstatus |
| Temperatuur | Ringmeters voor spuitmond en bed |
| Voortgang | Percentageindicator en tijdschatting |
| Telemetrie | Ventilatoren, druk, snelheid |
| 3D-model | Interactieve modelweergave |
| Sparklines | Minitemperatuurgrafieken |

:::tip Opslaan
De lay-out wordt per gebruiker opgeslagen in de browser (localStorage). Verschillende gebruikers kunnen verschillende indelingen hebben.
:::
