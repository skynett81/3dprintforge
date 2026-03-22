---
sidebar_position: 3
title: AMS-vedlikehold
description: Vedlikehold av AMS — PTFE-rør, filament-vei og fuktighetsforebygging
---

# AMS-vedlikehold

AMS (Automatic Material System) er et presist system som krever regelmessig vedlikehold for å fungere pålitelig. De vanligste problemene er skitten filament-vei og fuktighet i huset.

## PTFE-rør

PTFE-rørene transporterer filamentet fra AMS til printeren. De er blant de første delene som slites.

### Inspeksjon
Sjekk PTFE-rørene for:
- **Knekker eller bøyer** — hindrer filamentflyten
- **Slitasje ved koblinger** — hvit støv rundt inngangene
- **Fasong-deformasjon** — særlig ved bruk av CF-materialer

### Bytte PTFE-rør
1. Frigjør filament fra AMS (kjør avlastingssyklus)
2. Trykk inn den blå låseringen rundt røret ved koblingen
3. Trekk røret ut (krever et fast tak)
4. Klipp nytt rør til riktig lengde (ikke kortere enn originalen)
5. Skyv inn til det stopper og lås

:::tip AMS Lite vs. AMS
AMS Lite (A1/A1 Mini) har enklere PTFE-konfigurasjon enn full AMS (P1S/X1C). Rørene er kortere og lettere å bytte.
:::

## Filament-vei

### Rengjøring av filamentbane
Filamenter etterlater støv og rester i filamentbanen, spesielt CF-materialer:

1. Kjør avlasting av alle sporer
2. Bruk trykkluft eller en myk pensel til å blåse ut løst støv
3. Kjør et rent stykke nylon eller PTFE-rengjøringsfilament gjennom banen

### Sensorer
AMS bruker sensorer for å detektere filamentposisjon og filamentbrudd. Hold sensorvinduene rene:
- Tørk forsiktig av sensorlinser med en ren pensel
- Unngå IPA direkte på sensorer

## Fuktighet

AMS beskytter ikke filament mot fuktighet. For hygroskopiske materialer (PA, PETG, TPU) anbefales:

### Tørre AMS-alternativer
- **Forseglet boks:** Plasser spoler i en tett boks med silikagel
- **Bambu Dry Box:** Offisiell tørkeboks-aksessor
- **Ekstern mater:** Bruk filamentmater utenfor AMS for sensitive materialer

### Fuktighets-indikatorer
Legg fuktighetsindikatorkort (hygrometer) i AMS-huset. Bytt silikagel-poser ved over 30% relativ fuktighet.

## Drivhjul og klem-mekanisme

### Inspeksjon
Kontroller drivhjulene (extruder-hjulene i AMS) for:
- Filamentrester mellom tenner
- Slitasje på tannsett
- Ujevn friksjon ved manuell trekk

### Rengjøring
1. Bruk en tannbørste eller børste til å fjerne rester mellom drivhjulets tenner
2. Blås med trykkluft
3. Unngå olje og smøremiddel — treknivået er kalibrert for tørr drift

## Vedlikeholdsintervaller

| Aktivitet | Intervall |
|-----------|---------|
| Visuell inspeksjon PTFE-rør | Månedlig |
| Rengjøring filamentbane | Hver 100 timer |
| Kontroll av sensorer | Månedlig |
| Bytte silikagel (tørk-oppsett) | Etter behov (ved 30%+ RF) |
| Bytte PTFE-rør | Ved synlig slitasje |
