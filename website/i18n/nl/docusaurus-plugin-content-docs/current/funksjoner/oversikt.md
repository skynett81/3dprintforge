---
sidebar_position: 1
title: Functieoverzicht
description: Volledig overzicht van alle functies in Bambu Dashboard
---

# Functieoverzicht

Bambu Dashboard bundelt alles wat u nodig heeft om uw Bambu Lab-printers te monitoren en te besturen op één plek.

## Dashboard

Het hoofddashboard toont de realtime status van de actieve printer:

- **Temperatuur** — geanimeerde SVG-ringmeters voor spuitmond en bed
- **Voortgang** — procentuele voortgang met geschatte eindtijd
- **Camera** — live cameraweergave (RTSPS → MPEG1 via ffmpeg)
- **AMS-paneel** — visuele weergave van alle AMS-sporen met filamentkleur
- **Snelheidsbesturing** — schuifregelaar om de snelheid aan te passen (Stil, Standaard, Sport, Turbo)
- **Statistiekpanelen** — Grafana-stijl panelen met scrollende grafieken
- **Telemetrie** — live-waarden voor ventilatoren, temperaturen, druk

Panelen kunnen worden gesleept en neergezet om de lay-out aan te passen. Gebruik de vergrendelknop om de lay-out te vergrendelen.

## Filamentopslag

Zie [Filament](./filament) voor volledige documentatie.

- Volg alle spoelen met naam, kleur, gewicht en leverancier
- AMS-synchronisatie — zie welke spoelen in AMS zitten
- Drooglog en droogplanning
- Kleurkaart en NFC-tag-ondersteuning
- Importeren/exporteren (CSV)

## Printgeschiedenis

Zie [Geschiedenis](./historikk) voor volledige documentatie.

- Volledig logboek van alle prints
- Filamenttracking per print
- Links naar MakerWorld-modellen
- Statistieken en export naar CSV

## Planner

Zie [Planner](./scheduler) voor volledige documentatie.

- Kalenderweergave van prints
- Printwachtrij met prioritering
- Multi-printer dispatch

## Printerbesturing

Zie [Besturing](./controls) voor volledige documentatie.

- Temperatuurbesturing (spuitmond, bed, kamer)
- Snelheidsprofielbesturing
- Ventilatorbesturing
- G-code console
- Filament laden/verwijderen

## Meldingen

Bambu Dashboard ondersteunt 7 meldingskanalen:

| Kanaal | Gebeurtenissen |
|-------|----------|
| Telegram | Print klaar, fout, pauze |
| Discord | Print klaar, fout, pauze |
| E-mail | Print klaar, fout |
| ntfy | Alle gebeurtenissen |
| Pushover | Alle gebeurtenissen |
| SMS (Twilio) | Kritieke fouten |
| Webhook | Aangepaste payload |

Configureer via **Instellingen → Meldingen**.

## Print Guard

Print Guard monitort de actieve print via camera (xcam) en sensoren:

- Automatisch pauzeren bij spaghetti-fouten
- Configureerbaar gevoeligheidsniveau
- Log van gedetecteerde gebeurtenissen

## Onderhoud

De onderhoudssectie volgt:

- Volgende aanbevolen service per component (spuitmond, platen, AMS)
- Slijtagetracking op basis van printgeschiedenis
- Handmatige registratie van onderhoudstaken

## Multi-printer

Met multi-printer-ondersteuning kunt u:

- Meerdere printers beheren vanuit één dashboard
- Wisselen tussen printers met de printerkiezer
- Statusoverzicht van alle printers tegelijkertijd bekijken
- Printtaken verdelen met de printwachtrij

## OBS-overlay

Een speciale `obs.html`-pagina biedt een schone overlay voor OBS Studio-integratie tijdens het livestreamen van prints.

## Updates

Ingebouwde auto-update via GitHub Releases. Meldingen en updates direct vanuit het dashboard via **Instellingen → Update**.
