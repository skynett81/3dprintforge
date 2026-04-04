---
sidebar_position: 1
title: Funksjoner oversikt
description: Komplett oversikt over alle funksjoner i 3DPrintForge
---

# Funksjoner oversikt

3DPrintForge samler alt du trenger for å overvåke og styre Bambu Lab-printerne dine på ett sted.

## Dashboard

Hoveddashboardet viser sanntidsstatus for aktiv printer:

- **Temperatur** — animerte SVG-ringmålere for dyse og seng
- **Fremgang** — prosentvis fremgang med estimert ferdig-tid
- **Kamera** — live kameravisning (RTSPS → MPEG1 via ffmpeg)
- **AMS-panel** — visuell fremstilling av alle AMS-sporer med filamentfarge
- **Hastighets-kontroll** — skyveknapp for å justere hastighet (Stille, Standard, Sport, Turbo)
- **Statistikkpaneler** — Grafana-style paneler med rullegrafar
- **Telemetri** — live-verdier for fans, temperaturer, trykk

Panelene kan dras og slippes for å tilpasse layouten. Bruk lås-knappen for å låse layouten.

## Filamentlager

Se [Filament](./filament) for full dokumentasjon.

- Spor alle spoler med navn, farge, vekt og leverandør
- AMS-synkronisering — se hvilke spoler som sitter i AMS
- Tørkelogg og tørkeplan
- Fargekort og NFC-tagg-støtte
- Import/eksport (CSV)

## Printhistorikk

Se [Historikk](./history) for full dokumentasjon.

- Komplett logg over alle prints
- Filament-sporing per print
- Lenker til MakerWorld-modeller
- Statistikk og eksport til CSV
- 3D-forhåndsvisning med 3mfViewer (3MF) eller gcode toolpath, med mulighet for å laste opp 3MF-filer

## Planlegger

Se [Planlegger](./scheduler) for full dokumentasjon.

- Kalendervisning av prints
- Print-kø med prioritering
- Multi-printer dispatch

## Printerkontroll

Se [Kontroll](./controls) for full dokumentasjon.

- Temperaturkontroll (dyse, seng, kammer)
- Hastighetsprofilkontroll
- Vifte-kontroll
- G-code konsoll
- Filament-last/avlast

## Varsler

3DPrintForge støtter 7 varslingskanaler:

| Kanal | Hendelser |
|-------|----------|
| Telegram | Print ferdig, feil, pause |
| Discord | Print ferdig, feil, pause |
| E-post | Print ferdig, feil |
| ntfy | Alle hendelser |
| Pushover | Alle hendelser |
| SMS (Twilio) | Kritiske feil |
| Webhook | Tilpasset payload |

Konfigurer under **Innstillinger → Varsler**.

## Print Guard

Print Guard overvåker aktiv print via kamera (xcam) og sensorer:

- Automatisk pause ved spaghetti-feil
- Konfigurerbart sensitivitetsnivå
- Logg over detekterte hendelser

## Vedlikehold

Vedlikeholdsseksjonen sporer:

- Neste anbefalt service per komponent (dyse, plater, AMS)
- Slitasjesporing basert på printhistorikk
- Manuell registrering av vedlikeholdsoppgaver

## Multi-printer

Med flerprinter-støtte kan du:

- Administrere opptil flere printere fra ett dashboard
- Bytte mellom printere med printer-velgeren
- Se statusoversikt for alle printere simultant
- Fordele printjobber med print-køen

## OBS-overlay

En dedikert `obs.html`-side gir en ren overlay for OBS Studio-integrasjon under livestreaming av prints.

## Oppdateringer

Innebygd auto-oppdatering via GitHub Releases. Varsling og oppdatering direkte fra dashboardet under **Innstillinger → Oppdatering**.
