---
sidebar_position: 1
title: Welkom bij Bambu Dashboard
description: Een krachtig, zelf-gehost dashboard voor Bambu Lab 3D-printers
---

# Welkom bij Bambu Dashboard

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**Bambu Dashboard** is een zelf-gehost, volledig uitgerust controlepaneel voor Bambu Lab 3D-printers. Het geeft je volledig inzicht en controle over je printer, filamentvoorraad, printgeschiedenis en meer — allemaal vanuit één browsertabblad.

## Wat is Bambu Dashboard?

Bambu Dashboard verbindt rechtstreeks met je printer via MQTT over LAN, zonder afhankelijkheid van de servers van Bambu Lab. Je kunt ook verbinding maken met Bambu Cloud voor synchronisatie van modellen en printgeschiedenis.

### Belangrijkste functies

- **Live dashboard** — realtime temperatuur, voortgang, camera, AMS-status met LIVE-indicator
- **Filamentvoorraad** — volg alle spoelen met AMS-synchronisatie, EXT-spoelondersteuning, materiaalinfo, plaatcompatibiliteit en drooggids
- **Filamenttracking** — nauwkeurige tracking met 4-niveau fallback (AMS-sensor → EXT-schatting → cloud → duur)
- **Materiaalhandleiding** — 15 materialen met temperaturen, plaatcompatibiliteit, drogen, eigenschappen en tips
- **Printgeschiedenis** — volledig logboek met modelnamen, MakerWorld-links, filamentverbruik en kosten
- **Planner** — kalenderweergave, printwachtrij met taakverdeling en filamentcontrole
- **Printerbesturing** — temperatuur, snelheid, ventilatoren, G-code console
- **Print Guard** — automatische bescherming met xcam + 5 sensormonitoren
- **Kostenschatter** — materiaal, stroom, arbeid, slijtage, opslag met aanbevolen verkoopprijs
- **Onderhoud** — tracking met KB-gebaseerde intervallen, levensduur nozzle, levensduur plaat en handleiding
- **Geluidsalarmen** — 9 configureerbare events met aangepaste geluidsupload en printerluidspreker (M300)
- **Activiteitenlogboek** — persistente tijdlijn van alle events (prints, fouten, onderhoud, filament)
- **Meldingen** — 7 kanalen (Telegram, Discord, e-mail, ntfy, Pushover, SMS, webhook)
- **Multi-printer** — ondersteunt de volledige Bambu Lab-serie
- **17 talen** — Noors, Engels, Duits, Frans, Spaans, Italiaans, Japans, Koreaans, Nederlands, Pools, Portugees, Zweeds, Turks, Oekraïens, Chinees, Tsjechisch, Hongaars
- **Zelf-gehost** — geen cloudafhankelijkheid, jouw gegevens op jouw machine

### Nieuw in v1.1.14

- **AdminLTE 4-integratie** — volledige HTML-herstructurering met treeview-sidebar, modern layout en CSP-ondersteuning voor CDN
- **CRM-systeem** — volledige klantbeheer met 4 panelen: klanten, bestellingen, facturen en bedrijfsinstellingen met geschiedenisintegratie
- **Modern UI** — teal accent, gradiënttitels, hover glow, zwevende orbs en verbeterd donker thema
- **Achievements: 18 monumenten** — Vikingschip, Vrijheidsbeeld, Eiffel Tower, Big Ben, Brandenburger Tor, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, Nederlandse windmolen, Wawel-draak, Cristo Redentor, Turning Torso, Hagia Sophia, Het Moederland, Chinese Muur, Praagse Astronomische Klok, Parlement van Boedapest — met detail-popup, XP en zeldzaamheid
- **AMS-vochtigheid/temperatuur** — 5-niveaubeoordeling met aanbevelingen voor opslag en drogen
- **Live filamenttracking** — realtime updates tijdens het printen via cloud-schatting-fallback
- **Filament-sectie herontwerp** — grote spoelen met volledige info (merk, gewicht, temperatuur, RFID, kleur), horizontaal layout en klik-voor-details
- **EXT-spoel inline** — externe spoel weergegeven naast AMS-spoelen met beter ruimtegebruik
- **Dashboard-layout geoptimaliseerd** — 2-kolommen standaard voor 24–27" monitoren, grote 3D/camera, compact filament/AMS
- **Filamentwisseltijd** in de kostenschatter met zichtbare wisselteller
- **Globaal waarschuwingssysteem** — waarschuwingsbalk met toast-meldingen rechtsonder, blokkeert de navigatiebalk niet
- **Rondleiding i18n** — alle 14 rondleidingssleutels vertaald naar 17 talen
- **5 nieuwe KB-pagina's** — compatibiliteitsmatrix en nieuwe filamentgidsen vertaald naar 17 talen
- **Volledig i18n** — alle 3252 sleutels vertaald naar 17 talen, inclusief CRM en monument-achievements

## Snel aan de slag

| Taak | Link |
|------|------|
| Dashboard installeren | [Installatie](./getting-started/installation) |
| Eerste printer configureren | [Instellen](./getting-started/setup) |
| Verbinding maken met Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Alle functies verkennen | [Functies](./features/overview) |
| Filamenthandleiding | [Materiaalhandleiding](./kb/filaments/guide) |
| Onderhoudshandleiding | [Onderhoud](./kb/maintenance/nozzle) |
| API-documentatie | [API](./advanced/api) |

:::tip Demomodus
Je kunt het dashboard uitproberen zonder een fysieke printer door `npm run demo` uit te voeren. Dit start 3 gesimuleerde printers met live printcycli.
:::

## Ondersteunde printers

Alle Bambu Lab-printers met LAN-modus:

- **X1-serie**: X1C, X1C Combo, X1E
- **P1-serie**: P1S, P1S Combo, P1P
- **P2-serie**: P2S, P2S Combo
- **A-serie**: A1, A1 Combo, A1 mini
- **H2-serie**: H2S, H2D (dubbele nozzle), H2C (toolwisselaar, 6 koppen)

## Functies in detail

### Filamenttracking

Het dashboard houdt het filamentverbruik automatisch bij met een 4-niveau fallback:

1. **AMS-sensor diff** — meest nauwkeurig, vergelijkt start/einde remain%
2. **EXT direct** — voor P2S/A1 zonder vt_tray, gebruikt cloud-schatting
3. **Cloud-schatting** — van Bambu Cloud-printjobgegevens
4. **Duurschatting** — ~30 g/uur als laatste fallback

Alle waarden worden getoond als het minimum van AMS-sensor en spoeldatabase om fouten na mislukte prints te voorkomen.

### Materiaalhandleiding

Ingebouwde database met 15 materialen inclusief:
- Temperaturen (nozzle, bed, kamer)
- Plaatcompatibiliteit (Cool, Engineering, High Temp, Textured PEI)
- Drooginformatie (temperatuur, tijd, hygroscopiciteit)
- 8 eigenschappen (sterkte, flexibiliteit, warmtebestendigheid, UV, oppervlak, gebruiksgemak)
- Moeilijkheidsgraad en speciale vereisten (geharde nozzle, behuizing)

### Geluidsalarmen

9 configureerbare events met ondersteuning voor:
- **Aangepaste audioclips** — upload MP3/OGG/WAV (max. 10 seconden, 500 KB)
- **Ingebouwde tonen** — metallische/synth-geluiden gegenereerd met Web Audio API
- **Printerluidspreker** — M300 G-code melodieën direct op de buzzer van de printer
- **Aftellen** — geluidsalarm wanneer er nog 1 minuut van de print resteert

### Onderhoud

Volledig onderhoudssysteem met:
- Componenttracking (nozzle, PTFE-buis, stangen, lagers, AMS, plaat, drogen)
- KB-gebaseerde intervallen uit de documentatie
- Nozzle-levensduur per type (messing, gehard staal, HS01)
- Plaatlevensduur per type (Cool, Engineering, High Temp, Textured PEI)
- Handleidingtab met tips en links naar volledige documentatie

## Technisch overzicht

Bambu Dashboard is gebouwd met Node.js 22 en vanilla HTML/CSS/JS — geen zware frameworks, geen bouwstap. De database is SQLite, ingebouwd in Node.js 22.

- **Backend**: Node.js 22 met slechts 3 npm-pakketten (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, geen bouwstap
- **Database**: SQLite via Node.js 22 built-in `--experimental-sqlite`
- **Documentatie**: Docusaurus met 17 talen, automatisch gegenereerd bij installatie
- **API**: 177+ endpoints, OpenAPI-documentatie op `/api/docs`

Zie [Architectuur](./advanced/architecture) voor details.
