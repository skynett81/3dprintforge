---
sidebar_position: 1
title: Dysevedlikehold
description: Rengjøring, cold pull, dysbytte og dystyper for Bambu Lab-printere
---

# Dysevedlikehold

Dysen er en av de mest kritiske komponentene i printeren. Riktig vedlikehold forlenger levetiden og sikrer gode printresultater.

## Dysetyper

| Dysetype | Materialer | Levetid (estimert) | Maks temp |
|----------|-----------|-------------------|----------|
| Messing (standard) | PLA, PETG, ABS, TPU | 200–500 timer | 300 °C |
| Herdet stål | Alle inkl. CF/GF | 300–600 timer | 300 °C |
| HS01 (Bambu) | Alle inkl. CF/GF | 500–1000 timer | 300 °C |

:::danger Aldri bruk messingdyse med CF/GF
Karbonfiber og glassfiberfylte filamenter sliter ned messingdyser på timer. Bytt til herdet stål før du printer CF/GF-materialer.
:::

## Rengjøring

### Enkel rengjøring (mellom spolar)
1. Varm opp dysen til 200–220 °C
2. Trykk manuelt filament gjennom til det rensner
3. Trekk raskt ut filamentet ("cold pull" - se under)

### IPA-rengjøring
For hardnakket rester:
1. Varm opp dysen til 200 °C
2. Drypp 1–2 dråper IPA på dyseenden (forsiktig!)
3. La dampen løse opp rester
4. Trekk gjennom friskt filament

:::warning Vær forsiktig med IPA på varm dyse
IPA koker ved 83 °C og damper kraftig på varm dyse. Bruk lite mengder og unngå innånding.
:::

## Cold Pull (Kald Trekk)

Cold pull er den mest effektive metoden for å fjerne forurensning og karbonrester fra dysen.

**Steg for steg:**
1. Varm opp dysen til 200–220 °C
2. Skyv nylonfilament (eller det som er i dysen) inn manuelt
3. La nylon mette seg i dysen i 1–2 minutter
4. Senk temperaturen til 80–90 °C (for nylon)
5. Vent til dysen er avkjølt til målet
6. Trekk filamentet ut raskt og bestemt i én bevegelse
7. Se på enden: skal ha form av dyseinnsiden — rent og uten rester
8. Gjenta 3–5 ganger til filamentet trekkes ut rent og hvitt

:::tip Nylon for cold pull
Nylon gir det beste resultatet for cold pull fordi det henger godt i forurensningene. Hvit nylon gjør det lett å se om trekket er rent.
:::

## Dyseskifte

### Tegn på at dysen bør byttes
- Klumpete underflater og dårlig dimensjonsnøyaktighet
- Vedvarende ekstuderingsproblemer etter rengjøring
- Synlig slitasje eller deformasjon av dysehullet
- Dysen har passert estimert levetid

### Fremgangsmåte (P1S/X1C)
1. Varm opp dysen til 200 °C
2. Bremse extrudermotor (frigjør filament)
3. Bruk nøkkel til å løsne dysen (mot klokken)
4. Bytt dyse mens den er varm — **ikke la dysen avkjøle med verktøy på**
5. Stram til ønsket verdi (ikke overtrekk)
6. Kjør kalibrering etter bytte

:::warning Bytt alltid varm
Tightningsmoment fra kald dyse kan sprenge delet under oppvarmning. Bytt og stram alltid mens dysen er varm (200 °C).
:::

## Vedlikeholdsintervaller

| Aktivitet | Intervall |
|-----------|---------|
| Rengjøring (cold pull) | Etter 50 timer, eller ved byttemateriale |
| Visuelle kontroll | Ukentlig |
| Dyseskifte (messing) | 200–500 timer |
| Dyseskifte (herdet stål) | 300–600 timer |
