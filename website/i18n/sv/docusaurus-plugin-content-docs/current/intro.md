---
sidebar_position: 1
title: Välkommen till Bambu Dashboard
description: En kraftfull, självhostad instrumentpanel för Bambu Lab 3D-skrivare
---

# Välkommen till Bambu Dashboard

**Bambu Dashboard** är en självhostad, fullständig kontrollpanel för Bambu Lab 3D-skrivare. Den ger dig full överblick och kontroll över skrivare, filamentlager, utskriftshistorik och mer — allt från en webbläsarflik.

## Vad är Bambu Dashboard?

Bambu Dashboard ansluter direkt till din skrivare via MQTT över LAN, utan beroende av Bambu Labs servrar. Du kan även ansluta till Bambu Cloud för synkronisering av modeller och utskriftshistorik.

### Viktigaste funktioner

- **Live-instrumentpanel** — Realtidstemperaturer, förlopp, kamera, AMS-status
- **Filamentlager** — Spåra alla spolar, färger, AMS-synk, torkning
- **Utskriftshistorik** — Komplett logg med statistik och export
- **Schemaläggare** — Kalendervy och utskriftskö
- **Skrivarstyrning** — Temperatur, hastighet, fläktar, G-code-konsol
- **Aviseringar** — 7 kanaler (Telegram, Discord, e-post, ntfy, Pushover, SMS, webhook)
- **Multi-skrivare** — Stöder hela Bambu Lab-serien: X1C, X1E, P1S, P1P, P2S, A1, A1 mini, A1 Combo, H2S, H2D, H2C och mer
- **Självhostad** — Inget molnberoende, dina data på din maskin

## Snabbstart

| Uppgift | Länk |
|---------|------|
| Installera instrumentpanelen | [Installation](./kom-i-gang/installasjon) |
| Konfigurera första skrivaren | [Inställning](./kom-i-gang/oppsett) |
| Anslut Bambu Cloud | [Bambu Cloud](./kom-i-gang/bambu-cloud) |
| Utforska alla funktioner | [Funktioner](./funksjoner/oversikt) |
| API-dokumentation | [API](./avansert/api) |

:::tip Demo-läge
Du kan prova instrumentpanelen utan en fysisk skrivare genom att köra `npm run demo`. Detta startar 3 simulerade skrivare med live-utskriftscykler.
:::

## Skrivare som stöds

- **X1-serien**: X1C, X1C Combo, X1E
- **P1-serien**: P1S, P1S Combo, P1P
- **P2-serien**: P2S, P2S Combo
- **A-serien**: A1, A1 Combo, A1 mini
- **H2-serien**: H2S, H2D (dubbelmunstycke), H2C (verktygsbytare, 6 huvuden)

## Teknisk översikt

Bambu Dashboard är byggt med Node.js 22 och vanligt HTML/CSS/JS — inga tunga ramverk, inget byggsteg. Databasen är SQLite, inbyggd i Node.js 22. Se [Arkitektur](./avansert/arkitektur) för detaljer.
