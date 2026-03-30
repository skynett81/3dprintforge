---
sidebar_position: 1
title: Funktionsöversikt
description: Komplett översikt över alla funktioner i Bambu Dashboard
---

# Funktionsöversikt

Bambu Dashboard samlar allt du behöver för att övervaka och styra dina Bambu Lab-skrivare på ett ställe.

## Instrumentpanel

Huvudinstrumentpanelen visar realtidsstatus för den aktiva skrivaren:

- **Temperatur** — Animerade SVG-ringmätare för munstycke och bädd
- **Förlopp** — Procentuellt förlopp med beräknad färdigtid
- **Kamera** — Live-kameravy (RTSPS → MPEG1 via ffmpeg)
- **AMS-panel** — Visuell visning av alla AMS-fack med filamentfärg
- **Hastighetskontroll** — Reglage för att justera hastighet (Tyst, Standard, Sport, Turbo)
- **Statistikpaneler** — Grafana-liknande paneler med rullande grafer
- **Telemetri** — Live-värden för fläktar, temperaturer, tryck

Panelerna kan dras och släppas för att anpassa layouten. Använd låsknappen för att låsa layouten.

## Filamentlager

Se [Filament](./filament) för fullständig dokumentation.

- Hantera alla spolar med namn, färg, vikt och tillverkare
- AMS-synkronisering — se vilka spolar som sitter i AMS
- Torkningslogg och torkningsplan
- Färgkort och NFC-tagg-stöd
- Import/export (CSV)

## Utskriftshistorik

Se [Historik](./history) för fullständig dokumentation.

- Komplett logg över alla utskrifter
- Filamentspårning per utskrift
- Länkar till MakerWorld-modeller
- Statistik och CSV-export

## Schemaläggare

Se [Schemaläggare](./scheduler) för fullständig dokumentation.

- Kalendervy för utskrifter
- Utskriftskö med prioritering
- Multi-skrivarfördelning

## Skrivarstyrning

Se [Styrning](./controls) för fullständig dokumentation.

- Temperaturkontroll (munstycke, bädd, kammare)
- Hastighetsprofil-kontroll
- Fläktstyrning
- G-code-konsol
- Filament ladda/lossa

## Aviseringar

Bambu Dashboard stöder 7 aviseringskanaler:

| Kanal | Händelser |
|-------|----------|
| Telegram | Utskrift klar, fel, paus |
| Discord | Utskrift klar, fel, paus |
| E-post | Utskrift klar, fel |
| ntfy | Alla händelser |
| Pushover | Alla händelser |
| SMS (Twilio) | Kritiska fel |
| Webhook | Anpassad nyttolast |

Konfigurera under **Inställningar → Aviseringar**.

## Print Guard

Print Guard övervakar aktiv utskrift via kamera (xcam) och sensorer:

- Automatisk paus vid spaghetti-fel
- Konfigurerbar känslighetsnivå
- Logg över detekterade händelser

## Underhåll

Underhållssektionen spårar:

- Nästa rekommenderade service per komponent (munstycke, plattor, AMS)
- Slitsspårning baserad på utskriftshistorik
- Manuell registrering av underhållsuppgifter

## Multi-skrivare

Med flerskrivare-stöd kan du:

- Hantera flera skrivare från en instrumentpanel
- Växla mellan skrivare med skrivarväljaren
- Se statusöversikt för alla skrivare samtidigt
- Fördela utskriftsjobb med utskriftskön

## OBS-overlay

En dedikerad `obs.html`-sida ger ett rent overlay för OBS Studio-integration vid livestreaming av utskrifter.

## Uppdateringar

Inbyggd automatisk uppdatering via GitHub Releases. Avisering och uppdatering direkt från instrumentpanelen under **Inställningar → Uppdatering**.
