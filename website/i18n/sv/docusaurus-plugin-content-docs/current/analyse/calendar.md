---
sidebar_position: 2
title: Aktivitetskalender
description: GitHub-stil heatmap-kalender som visar skrivaraktivitet per dag genom året med årsväljare och detaljvisning
---

# Aktivitetskalender

Aktivitetskalendern visar en visuell översikt över din skrivaraktivitet genom hela året — inspirerad av GitHubs bidragsöversikt.

Gå till: **https://localhost:3443/#calendar**

## Heatmap-översikt

Kalendern visar 365 dagar (52 veckor) som ett rutnät av färgade rutor:

- **Grå** — inga utskrifter den dagen
- **Ljusgrön** — 1–2 utskrifter
- **Grön** — 3–5 utskrifter
- **Mörkgrön** — 6–10 utskrifter
- **Djupgrön** — 11+ utskrifter

Rutorna är organiserade med veckodagar vertikalt (Mån–Sön) och veckor horisontellt från vänster (januari) till höger (december).

:::tip Färgkodning
Du kan byta heatmap-metrik från **Antal utskrifter** till **Timmar** eller **Gram filament** via väljaren ovanför kalendern.
:::

## Årsväljare

Klicka **< År >** för att navigera mellan år:

- Alla år med registrerad utskriftsaktivitet är tillgängliga
- Det aktuella året visas som standard
- Framtiden är grå (inga data)

## Detaljvisning per dag

Klicka på en ruta för att se detaljer för den aktuella dagen:

- **Datum** och veckodag
- **Antal utskrifter** — lyckade och misslyckade
- **Totalt filament använt** (gram)
- **Totala utskriftstimmar**
- **Lista över utskrifter** — klicka för att öppna i historiken

## Månadsöversikt

Under heatmapen visas en månadsöversikt med:
- Total utskrifter per månad som stapeldiagram
- Bästa dag i månaden markerad
- Jämförelse med samma månad föregående år (%)

## Skrivarfilter

Välj skrivare från rullgardinsmenyn överst för att visa aktivitet bara för en skrivare, eller välj **Alla** för aggregerad visning.

Flerskrivarvisning visar färgerna staplade genom att klicka **Staplad** i visningsväljaren.

## Serier och rekord

Under kalendern visas:

| Statistik | Beskrivning |
|---|---|
| **Längsta serie** | Flest påföljande dagar med minst en utskrift |
| **Nuvarande serie** | Pågående rad av aktiva dagar |
| **Mest aktiv dag** | Dagen med flest utskrifter totalt |
| **Mest aktiv vecka** | Veckan med flest utskrifter |
| **Mest aktiv månad** | Månaden med flest utskrifter |

## Export

Klicka **Exportera** för att ladda ner kalenderdata:

- **PNG** — bild av heatmapen (för delning)
- **CSV** — rådata med en rad per dag (datum, antal, gram, timmar)

PNG-exporten är optimerad för delning i sociala medier med skrivarnamnet och året som undertitel.
