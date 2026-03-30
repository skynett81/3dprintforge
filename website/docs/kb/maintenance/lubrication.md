---
sidebar_position: 4
title: Smøring
description: Smøring av lineære stenger, leiere og intervaller for Bambu Lab-printere
---

# Smøring

Riktig smøring av bevegelige deler reduserer slitasje, senker støynivå og sikrer presis bevegelse. Bambu Lab-printere bruker lineære bevegelsessystemer som krever periodisk smøring.

## Smøringstypene

| Komponent | Smøringstype | Produkt |
|-----------|-------------|---------|
| Lineære stenger (XY) | Lett maskinolje eller PTFE-spray | 3-i-1, Super Lube |
| Z-akse skruespindel | Tykt smørefett | Super Lube fett |
| Lineære leiere | Lett litiumfett | Bambu Lab grease |
| Kabelkjede-ledd | Ingen (tørr) | — |

## Lineære stenger

### X og Y-aksen
Stengene er podet stålstenger som glir gjennom lineære leiere:

```
Intervall: Hver 200–300 timer, eller ved knirkende lyder
Mengde: Svært lite — én dråpe per stengpunkt er nok
Metode:
1. Slå av printeren
2. Flytt vognen manuelt til enden
3. Påfør 1 dråpe lett olje midt på stangen
4. Flytt vognen sakte frem og tilbake 10 ganger
5. Tørk av overflødig olje med lofritt papir
```

:::warning Ikke oversmør
For mye olje trekker til seg støv og skaper slipende pasta. Bruk minimale mengder og tørk alltid av overskudd.
:::

### Z-akse (vertikal)
Z-aksen bruker en skruespindel (leadscrew) som krever fett (ikke olje):

```
Intervall: Hver 200 timer
Metode:
1. Slå av printeren
2. Smør et tynt lag fett langs skruespindelen
3. Kjør Z-aksen opp og ned manuelt (eller via vedlikeholdsmeny)
4. Fett fordeles automatisk
```

## Lineære leiere

Bambu Lab P1S og X1C bruker lineære leiere (MGN12) på Y-aksen:

```
Intervall: Hver 300–500 timer
Metode:
1. Fjern litt fett med en nål eller tannpirker fra innskuddsåpningen
2. Sprøyt inn ny grease med en sprøyte og tynn kanyle
3. Kjør aksen frem og tilbake for å fordele fettet
```

Bambu Lab selger offisiell smørefett (Bambu Lubricant) som er kalibrert for systemet.

## Vedlikehold av smøring for ulike modeller

### X1C / P1S
- Y-akse: Lineære leiere — fettet fra Bambu
- X-akse: Karbonstenger — lett olje
- Z-akse: Dobbel skruespindel — Bambu fett

### A1 / A1 Mini
- Alle akser: Stålstenger — lett olje
- Z-akse: Enkelt skruespindel — Bambu fett

## Tegn på at smøring trengs

- **Knirkende eller skrapende lyder** ved bevegelse
- **Vibrasjonsmønstre** synlige på vertikale vegger (VFA)
- **Unøyaktig dimensjoner** uten andre årsaker
- **Økt lydhøyde** fra bevegelsessystemet

## Smøringsintervaller

| Aktivitet | Intervall |
|-----------|---------|
| Olje XY-stenger | Hver 200–300 timer |
| Fett Z-spindel | Hver 200 timer |
| Fett lineære leiere (X1C/P1S) | Hver 300–500 timer |
| Full vedlikeholdssyklus | Halvårlig (eller 500 timer) |

Bruk vedlikeholdsmodulen i dashboardet for å spore intervaller automatisk.
