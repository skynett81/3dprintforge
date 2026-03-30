---
sidebar_position: 4
title: High Temp Plate
description: Høytemperaturplate for ABS, ASA, PC og PA — tåler opptil 120 °C sengtemperatur
---

# High Temp Plate

High Temp Plate er designet for materialer som krever høy sengtemperatur. Den tåler opptil 120 °C og er nødvendig for polykarbonal (PC) og høytemperatur-varianter av PA.

## Egenskaper

- **Overflate:** Smooth (glatt) med høytemperatur-belegg
- **Maks sengtemperatur:** 120 °C
- **Underflate på print:** Blank/glatt
- **Heft:** God ved høy temperatur — slipper ved avkjøling

## Best egnet for

| Materiale | Sengtemperatur | Limstift |
|-----------|---------------|---------|
| ABS | 90–110 °C | Ja |
| ASA | 90–110 °C | Ja |
| PC | 100–120 °C | Ja (påkrevd) |
| PA6 | 80–90 °C | Ja |
| PA12 | 70–85 °C | Ja |
| PA-CF | 90–100 °C | Ja |

## Ikke egnet for

- PLA — platen er for varm, PLA hefter for mye
- PETG — risiko for platesskade uten limstift
- TPU — Engineering Plate er bedre

## Limstift

Limstift er sterkt anbefalt (og for PC påkrevd) for å:
1. Forbedre heften ved første lag
2. Beskytte platens belegg
3. Lette fjerning av print etter avkjøling

Påfør et tynt, jevnt lag. For PC og PA: bruk litt mer enn for ABS.

:::warning PC krever ekstra forsiktighet
Polykarbonal (PC) printer ved 250–280 °C dyse og 100–120 °C seng. Uten innelukke (kammer) og uten High Temp Plate er suksessrate svært lav. Bare X1C og P1S anbefales for PC-printing.
:::

## Vedlikehold

```bash
# Etter PC/ABS med limstift:
1. La platen avkjøle til 50 °C
2. Fjern print forsiktig (bøy platen)
3. Vask med varmt vann og oppvaskmiddel
4. Tørk grundig — vann på varm plate kan skade belegget

# Mellom prints:
1. Tørk av med IPA
2. Sjekk belegg for slitasje
```

:::danger Unngå varmesjokk
Aldri sett en kald plate på en varm seng, eller spray kald IPA på en varm plate. Temperaturforskjeller kan skade belegget eller forårsake deformasjon av stålplaten.
:::

## Levetid

High Temp Plate varer kortere enn Engineering Plate pga. høyere termisk belastning:
- **Normal bruk (ABS/ASA):** 200–400 prints
- **Intensiv bruk (PC):** 100–200 prints

Bytt ved synlig slitasje på belegg, eller ved vedvarende hefteproblemer.

---

## Spesialbelagt for ekstreme temperaturer

High Temp Plate er ikke en standard PEI-plate — den har et **spesialbelegg** formulert for å tåle og prestere ved sengetemperaturer over 100 °C. Standard PEI-belegg kan bli mykt og skades over tid ved slike temperaturer, men High Temp-belegget er termisk stabilt opp til 120 °C.

Dette gjør den **uerstattelig** for:
- Polykarbonal (PC) — krever 100–120 °C
- PAHT-CF (høytemperatur nylon med karbonfiber) — påkrevd
- PA-CF — sterkt anbefalt

:::danger PA-CF og PAHT-CF — denne platen er PÅKREVD
For PA-CF og PAHT-CF er High Temp Plate ikke bare et godt valg, den er **nødvendig**. Disse materialene krever sengetemperaturer på 90–110 °C for å hfte og unngå warping. Engineering Plate tåler ikke dette over tid. Bruk alltid limstift i tillegg.
:::

---

## Termisk sjokk — viktig advarsel

:::danger Unngå termisk sjokk ved oppvarming
La platen **varmes opp gradvis** med printeren. Ikke forvarm sengen til 110 °C og sett inn en kald plate etterpå — den brå temperaturforskjellen kan skade belegget eller deformere stålplaten.

**Riktig prosedyre:**
1. Sett inn platen på kald seng
2. Start print-jobben — sengen varmes opp gradvis
3. La temperaturen stige rolig til ønsket nivå

Gjelder spesielt for plater som har vært lagret kaldt (for eksempel tatt ut av et kjølig rom).
:::

---

## Polykarbonal (PC) — brim anbefales sterkt

PC er et av de mest krevende materialene for 3D-printing. Selv med High Temp Plate og limstift kan warping oppstå.

:::tip Bruk alltid brim for PC
Legg til en brim (kant rundt objektet) i slicer-innstillingene for PC-prints. En brim på 5–10 mm øker kontaktarealet mot platen og reduserer warping betraktelig.

Anbefalte innstillinger for PC:
- **Brim:** 5–10 mm
- **Første lag hastighet:** 20–25 mm/s
- **Sengtemperatur:** 100–120 °C
- **Limstift:** Påkrevd
:::

Uten innelukke (kammer) er PC-printing svært krevende. Kun X1C og P1S anbefales.

---

## PA-CF og PAHT-CF

Disse komposittmaterialene kombinerer nylon med karbonfiberfyll og krever høy sengtemperatur for riktig heft:

| Materiale | Sengtemperatur | Limstift | Plate |
|-----------|---------------|---------|-------|
| PA-CF | 90–100 °C | Påkrevd | High Temp |
| PAHT-CF | 100–110 °C | Påkrevd | High Temp (påkrevd) |

Bruk tørket filament (helst lagret i AMS med tørking aktivert) — nylon absorberer fuktighet fra luften og gir dårlig printresultat hvis det er fuktig.

---

## Levetid — revidert

High Temp Plate har **kortere levetid enn Engineering Plate** på grunn av den høyere termiske belastningen. Gjentatte sykluser med oppvarming til over 100 °C og avkjøling sliter på belegget raskere.

| Brukstype | Forventet levetid |
|-----------|-------------------|
| Normal (ABS/ASA, 90–110 °C) | 200–400 prints |
| Intensiv (PC/PAHT, 110–120 °C) | 100–200 prints |
| Blandet bruk | 150–300 prints |

:::tip Forleng levetiden
- Varier utskriftsposisjonen mellom prints
- La platen avkjøle naturlig — ikke bruk vifte eller kaldt vann
- Vask alltid etter limstift-bruk — resterende limstift som stekes fast skader belegget
:::
