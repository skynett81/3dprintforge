---
sidebar_position: 1
title: Välkommen till 3DPrintForge
description: En kraftfull, självhostad instrumentpanel för Bambu Lab 3D-skrivare
---

# Välkommen till 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** är en självhostad, fullständig kontrollpanel för Bambu Lab 3D-skrivare. Den ger dig full överblick och kontroll över skrivare, filamentlager, utskriftshistorik och mer — allt från en enda webbläsarflik.

## Vad är 3DPrintForge?

3DPrintForge ansluter direkt till din skrivare via MQTT över LAN, utan beroende av Bambu Labs servrar. Du kan även ansluta till Bambu Cloud för synkronisering av modeller och utskriftshistorik.

### Viktigaste funktioner

- **Live-instrumentpanel** — realtidstemperatur, förlopp, kamera, AMS-status med LIVE-indikator
- **Filamentlager** — spåra alla spolar med AMS-synk, EXT-spolstöd, materialinfo, plattkompatibilitet och torkguide
- **Filamentspårning** — noggrann spårning med 4-nivå fallback (AMS-sensor → EXT-uppskattning → cloud → varaktighet)
- **Materialguide** — 15 material med temperaturer, plattkompatibilitet, torkning, egenskaper och tips
- **Utskriftshistorik** — komplett logg med modellnamn, MakerWorld-länkar, filamentförbrukning och kostnader
- **Schemaläggare** — kalendervy, utskriftskö med lastbalansering och filamentkontroll
- **Skrivarstyrning** — temperatur, hastighet, fläktar, G-code-konsol
- **Print Guard** — automatiskt skydd med xcam + 5 sensormonitorer
- **Kostnadsberäknare** — material, el, arbete, slitage, påslag med förslag på försäljningspris
- **Underhåll** — spårning med KB-baserade intervall, munstyckets livslängd, plattans livslängd och guide
- **Ljudvarningar** — 9 konfigurerbara events med anpassad ljuduppladdning och skrivarens högtalare (M300)
- **Aktivitetslogg** — beständig tidslinje från alla händelser (utskrifter, fel, underhåll, filament)
- **Aviseringar** — 7 kanaler (Telegram, Discord, e-post, ntfy, Pushover, SMS, webhook)
- **Multi-skrivare** — stöder hela Bambu Lab-serien
- **17 språk** — norska, engelska, tyska, franska, spanska, italienska, japanska, koreanska, nederländska, polska, portugisiska, svenska, turkiska, ukrainska, kinesiska, tjeckiska, ungerska
- **Självhostad** — inget molnberoende, dina data på din maskin

### Nytt i v1.1.14

- **AdminLTE 4-integration** — komplett HTML-omstrukturering med treeview-sidebar, modernt layout och CSP-stöd för CDN
- **CRM-system** — fullständig kundhantering med 4 paneler: kunder, ordrar, fakturor och företagsinställningar med historikintegration
- **Modernt UI** — teal-accent, gradienttitlar, hover glow, svävande orbar och förbättrat mörkt tema
- **Achievements: 18 landmärken** — vikingaskepp, Frihetsgudinnan, Eiffel Tower, Big Ben, Brandenburger Tor, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, nederländsk väderkvarn, Wawel-draken, Cristo Redentor, Turning Torso, Hagia Sophia, Moderlandet, Kinesiska muren, Pragklockan, Budapests parlament — med detaljpopup, XP och sällsynthet
- **AMS-fuktighet/temperatur** — 5-nivåbedömning med rekommendationer för förvaring och torkning
- **Live filamentspårning** — realtidsuppdatering under utskrift via cloud-uppskattning-fallback
- **Filamentsektion omdesignad** — stora spolar med fullständig info (märke, vikt, temperatur, RFID, färg), horisontellt layout och klicka-för-detaljer
- **EXT-spole inline** — extern spole visas tillsammans med AMS-spolar med bättre platsanvändning
- **Instrumentpanel-layout optimerad** — 2-kolumners standard för 24–27"-skärmar, stor 3D/kamera, kompakt filament/AMS
- **Filamentbytestid** i kostnadsberäknaren med synlig bytesräknare
- **Globalt varningssystem** — varningsfält med toast-aviseringar i nedre högra hörnet, blockerar inte navigeringsfältet
- **Guidad tur i18n** — alla 14 turnycklar översatta till 17 språk
- **5 nya KB-sidor** — kompatibilitetsmatris och nya filamentguider översatta till 17 språk
- **Komplett i18n** — alla 3252 nycklar översatta till 17 språk inklusive CRM och landmärkes-achievements

## Snabbstart

| Uppgift | Länk |
|---------|------|
| Installera instrumentpanelen | [Installation](./getting-started/installation) |
| Konfigurera första skrivaren | [Inställning](./getting-started/setup) |
| Anslut Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Utforska alla funktioner | [Funktioner](./features/overview) |
| Filamentguide | [Materialguide](./kb/filaments/guide) |
| Underhållsguide | [Underhåll](./kb/maintenance/nozzle) |
| API-dokumentation | [API](./advanced/api) |

:::tip Demo-läge
Du kan prova instrumentpanelen utan en fysisk skrivare genom att köra `npm run demo`. Detta startar 3 simulerade skrivare med live-utskriftscykler.
:::

## Skrivare som stöds

Alla Bambu Lab-skrivare med LAN-läge:

- **X1-serien**: X1C, X1C Combo, X1E
- **P1-serien**: P1S, P1S Combo, P1P
- **P2-serien**: P2S, P2S Combo
- **A-serien**: A1, A1 Combo, A1 mini
- **H2-serien**: H2S, H2D (dubbelmunstycke), H2C (verktygsbytare, 6 huvuden)

## Funktioner i detalj

### Filamentspårning

Instrumentpanelen spårar filamentförbrukning automatiskt med 4-nivå fallback:

1. **AMS-sensor diff** — mest noggrann, jämför start/slut remain%
2. **EXT direkt** — för P2S/A1 utan vt_tray, använder cloud-uppskattning
3. **Cloud-uppskattning** — från Bambu Cloud-utskriftsjobbdata
4. **Varaktighetsuppskattning** — ~30 g/timme som sista fallback

Alla värden visas som minimum av AMS-sensor och spoldatabas för att undvika fel efter misslyckade utskrifter.

### Materialguide

Inbyggd databas med 15 material inklusive:
- Temperaturer (munstycke, bädd, kammare)
- Plattkompatibilitet (Cool, Engineering, High Temp, Textured PEI)
- Torkinformation (temperatur, tid, hygroskopicitet)
- 8 egenskaper (styrka, flexibilitet, värmebeständighet, UV, yta, användarvänlighet)
- Svårighetsgrad och särskilda krav (härdat munstycke, hölje)

### Ljudvarningar

9 konfigurerbara events med stöd för:
- **Anpassade ljudklipp** — ladda upp MP3/OGG/WAV (max 10 sekunder, 500 KB)
- **Inbyggda toner** — metalliska/synth-ljud genererade med Web Audio API
- **Skrivarens högtalare** — M300 G-code-melodier direkt på skrivarens summer
- **Nedräkning** — ljudlarm när 1 minut återstår av utskriften

### Underhåll

Komplett underhållssystem med:
- Komponentspårning (munstycke, PTFE-rör, stänger, lager, AMS, platta, torkning)
- KB-baserade intervall från dokumentationen
- Munstyckets livslängd per typ (mässing, härdat stål, HS01)
- Plattans livslängd per typ (Cool, Engineering, High Temp, Textured PEI)
- Guideflik med tips och länkar till fullständig dokumentation

## Teknisk översikt

3DPrintForge är byggt med Node.js 22 och vanlig HTML/CSS/JS — inga tunga ramverk, inget byggsteg. Databasen är SQLite, inbyggd i Node.js 22.

- **Backend**: Node.js 22 med endast 3 npm-paket (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, inget byggsteg
- **Databas**: SQLite via Node.js 22 built-in `--experimental-sqlite`
- **Dokumentation**: Docusaurus med 17 språk, automatiskt byggd vid installation
- **API**: 177+ endpoints, OpenAPI-dokumentation på `/api/docs`

Se [Arkitektur](./advanced/architecture) för detaljer.
