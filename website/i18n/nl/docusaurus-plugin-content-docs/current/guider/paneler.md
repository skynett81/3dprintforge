---
sidebar_position: 8
title: Navigeren in het dashboard
description: Leer navigeren in Bambu Dashboard — zijpaneel, panels, sneltoetsen en aanpassing
---

# Navigeren in het dashboard

Deze handleiding geeft je een snelle introductie over hoe het dashboard is georganiseerd en hoe je efficiënt navigeert.

## Het zijpaneel

Het zijpaneel aan de linkerkant is je navigatiecentrum. Het is georganiseerd in secties:

```
┌────────────────────┐
│ 🖨  Printerstatussen│  ← Één rij per printer
├────────────────────┤
│ Overzicht          │
│ Vloot              │
│ Actieve print      │
├────────────────────┤
│ Filament           │
│ Geschiedenis       │
│ Projecten          │
│ Wachtrij           │
│ Planner            │
├────────────────────┤
│ Bewaking           │
│  └ Print Guard     │
│  └ Fouten          │
│  └ Diagnostiek     │
│  └ Onderhoud       │
├────────────────────┤
│ Analyse            │
│ Hulpmiddelen       │
│ Integraties        │
│ Systeem            │
├────────────────────┤
│ ⚙ Instellingen    │
└────────────────────┘
```

**Het zijpaneel kan worden verborgen** door te klikken op het hamburger-pictogram (☰) linksboven. Handig op kleinere schermen of in kioskmodus.

## Het hoofdpaneel

Wanneer je op een element in het zijpaneel klikt, wordt de inhoud weergegeven in het hoofdpaneel aan de rechterkant. De lay-out varieert:

| Panel | Lay-out |
|-------|---------|
| Overzicht | Kaartgrid met alle printers |
| Actieve print | Groot detailkaart + temperatuurcurven |
| Geschiedenis | Filterbare tabel |
| Filament | Kaartweergave met spoelen |
| Analyse | Grafieken en diagrammen |

## Klikken op printerstatus voor details

De printerkaart op het overzichtspaneel is klikbaar:

**Enkelvoudige klik** → Opent het detailpaneel voor die printer:
- Realtime temperaturen
- Actieve print (indien bezig)
- AMS-status met alle slots
- Laatste fouten en gebeurtenissen
- Snelknoppen: Pauzeren, Stoppen, Lamp aan/uit

**Klik op het camerapictogram** → Opent live cameraweergave

**Klik op het ⚙-pictogram** → Printerinstellingen

## Sneltoets — opdrachtpalet

Het opdrachtpalet biedt snelle toegang tot alle functies zonder te navigeren:

| Sneltoets | Actie |
|-----------|-------|
| `Ctrl + K` (Linux/Windows) | Opdrachtpalet openen |
| `Cmd + K` (macOS) | Opdrachtpalet openen |
| `Esc` | Palet sluiten |

In het opdrachtpalet kun je:
- Zoeken naar pagina's en functies
- Direct een print starten
- Actieve prints pauzeren / hervatten
- Wisselen van thema (licht/donker)
- Naar elke pagina navigeren

**Voorbeeld:** Druk op `Ctrl+K`, typ "pause" → selecteer "Alle actieve prints pauzeren"

## Widget-aanpassing

Het overzichtspaneel kan worden aangepast met widgets naar eigen keuze:

**Zo bewerk je het dashboard:**
1. Klik **Lay-out bewerken** (potloodpictogram) rechtsboven op het overzichtspaneel
2. Sleep widgets naar de gewenste positie
3. Klik en sleep in de hoek van een widget om de grootte te wijzigen
4. Klik **+ Widget toevoegen** om nieuwe toe te voegen:

Beschikbare widgets:

| Widget | Toont |
|--------|-------|
| Printerstatus | Kaarten voor alle printers |
| Actieve print (groot) | Gedetailleerde weergave van lopende print |
| AMS-overzicht | Alle slots en filamentniveaus |
| Temperatuurcurve | Realtimegrafiek |
| Stroomprijs | Prijsgrafiek volgende 24 uur |
| Filamentmeter | Totaal verbruik afgelopen 30 dagen |
| Geschiedenis-snelkoppeling | Laatste 5 prints |
| Camera-feed | Live camerabeeld |

5. Klik **Lay-out opslaan**

:::tip Meerdere lay-outs opslaan
Je kunt verschillende lay-outs voor verschillende doeleinden hebben — een compacte voor dagelijks gebruik, een grote om op een groot scherm te hangen. Wissel ertussen met de lay-outkiezer.
:::

## Thema — wisselen tussen licht en donker

**Snel wisselen:**
- Klik op het zon/maan-pictogram rechtsboven in de navigatie
- Of: `Ctrl+K` → typ "thema"

**Permanente instelling:**
1. Ga naar **Systeem → Thema's**
2. Kies tussen:
   - **Licht** — witte achtergrond
   - **Donker** — donkere achtergrond (aanbevolen 's nachts)
   - **Automatisch** — volgt de systeeminstelling van je apparaat
3. Kies kleuraccent (blauw, groen, paars, enz.)
4. Klik **Opslaan**

## Toetsenbordnavigatie

Voor efficiënte navigatie zonder muis:

| Sneltoets | Actie |
|-----------|-------|
| `Tab` | Volgend interactief element |
| `Shift+Tab` | Vorig element |
| `Enter` / `Spatie` | Knop/koppeling activeren |
| `Esc` | Modaal/dropdown sluiten |
| `Ctrl+K` | Opdrachtpalet |
| `Alt+1` – `Alt+9` | Direct naar de 9 eerste pagina's navigeren |

## PWA — installeren als app

Bambu Dashboard kan worden geïnstalleerd als een progressive web-app (PWA) en als een zelfstandige app draaien zonder browsermenu's:

1. Ga naar het dashboard in Chrome, Edge of Safari
2. Klik op het pictogram **App installeren** in de adresbalk
3. Bevestig de installatie

Zie [PWA-documentatie](../system/pwa) voor meer details.

## Kioskmodus

Kioskmodus verbergt alle navigatie en toont alleen het dashboard — perfect voor een toegewijd scherm in de printworkshop:

1. Ga naar **Systeem → Kiosk**
2. Activeer **Kioskmodus**
3. Kies welke widgets worden weergegeven
4. Stel het vernieuwingsinterval in

Zie [Kiosk-documentatie](../system/kiosk) voor de volledige instelling.
