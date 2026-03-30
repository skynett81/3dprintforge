---
sidebar_position: 3
title: Engineering Plate (Textured PEI)
description: Teksturert PEI-plate for tekniske materialer — egenskaper, vedlikehold og kompatibilitet
---

# Engineering Plate (Textured PEI)

Engineering Plate er en teksturert PEI-plate designet for tekniske materialer som PETG, ABS, ASA og PA. Den gir en fin teksturert underflate og er den mest allsidige platen i Bambu Labs sortiment.

## Egenskaper

- **Overflate:** Teksturert PEI — gir mønstret/matt underflate på printen
- **Heft:** Bedre mekanisk heft enn glatt PEI
- **Maks sengtemperatur:** 110 °C
- **Fjerning:** Prints slipper lett etter avkjøling til 40–50 °C

## Best egnet for

- PETG og PETG-CF (uten limstift, eller med for ekstra sikkerhet)
- ABS og ASA (med limstift)
- PA6 / PA12 / PA-CF (med limstift — påkrevd)
- TPU (uten limstift)
- PLA (fungerer bra, gir teksturert underflate)

## Ikke egnet for

- Prints som krever glatt underflate (bruk Cool Plate)
- PC ved høye temperaturer (bruk High Temp Plate)

## Vedlikehold

### Rengjøring
```bash
# Ukentlig (eller etter limstift-bruk):
1. Vask med varmt vann og mildt oppvaskmiddel
2. Skyll grundig
3. La tørke, eller tørk med lofritt papir
4. Avsluttende tørk med IPA

# Mellom prints uten limstift:
1. Tørk av med IPA og lofritt papir
```

### Etter limstift
Vask alltid platen etter bruk av limstift. Resterende limstift kan gi ujevn heft på neste print.

:::tip Teksturens retning
Engineering Plate har en retning på teksturen. Monter alltid platen med klips i riktig orientasjon for å unngå at printen sitter fast i teksturens fordypninger.
:::

## Bytte platen

Engineering Plate er slitt når:
- Teksturen er utslitt/glatt i midtsonen (mest brukt)
- Prints hefter ikke selv etter rengjøring og limstift
- Platen har dype riper eller deformasjoner

Normal levetid: 300–700 prints ved god vedlikehold.

---

## Overflateresultat

Den teksturerte overflaten gir alle prints en **matt, mønstret underside**. Dette er ideelt for funksjonelle deler, prototyper og mekaniske komponenter der grep og ikke-reflekterende overflate er ønskelig.

- **Engineering Plate** → matt, fin tekstur på undersiden
- **Cool Plate** → blank, speilende underside
- **Textured PEI** → grovere, mer markert tekstur

---

## Fjerning av print

Engineering Plate er generelt **mye enklere å fjerne prints fra** enn Cool Plate. Den teksturerte overflaten reduserer det totale kontaktarealet mellom print og plate, noe som gir svakere heft etter avkjøling.

**Anbefalt fremgangsmåte:**
1. La platen avkjøle til 40–50 °C
2. Bøy platen forsiktig — de fleste prints slipper umiddelbart
3. Trenger du mer: vent til romtemperatur og bøy igjen

Sjelden behov for skrape eller frysemetoden.

---

## Z-offset toleranse

:::tip Mer tilgivende Z-offset
Engineering Plates teksturerte overflate kompenserer for litt unøyaktig Z-offset. Der Cool Plate krever millimeterpresisjon for å oppnå riktig adhesjon uten elefantfot, tolererer Engineering Plate litt variasjon.

Startpunkt ved kalibrering: bruk anbefalte verdier fra Bambu Studio, og juster deretter ±0,05 mm ved behov.
:::

Dette gjør Engineering Plate spesielt egnet for nybegynnere eller for printing av mange ulike modeller uten å rekalibrere mellom hver.

---

## PETG — ideell kombinasjon

Engineering Plate er den anbefalte platen for PETG av en viktig grunn: **den teksturerte overflaten binder ikke permanent med PETG**, i motsetning til glatt PEI (Cool Plate).

- PETG hefter godt nok for stabile prints
- Etter avkjøling slipper PETG lett fra teksturen
- Limstift er vanligvis ikke nødvendig, men kan brukes for ekstra sikkerhet ved store flatbunnede objekter

:::danger Aldri PETG på Cool Plate uten limstift
Bruk alltid Engineering Plate (eller limstift) for PETG. Se [Cool Plate-advarselen](./cool-plate#petg-advarsel--utvidet) for detaljer.
:::

---

## ABS, ASA og PA uten problemer

Engineering Plate er den eneste standardplaten som håndterer ABS, ASA og PA uten limstift i mange tilfeller — selv om limstift fortsatt anbefales for best resultat:

| Materiale | Uten limstift | Med limstift |
|-----------|-------------|-------------|
| ABS | Ofte OK | Bedre heft, tryggere |
| ASA | Ofte OK | Bedre heft, tryggere |
| PA6/PA12 | Dårlig | Påkrevd |
| PA-CF | Dårlig | Påkrevd |

Den teksturerte overflaten og høyere maks sengtemperatur (110 °C) gir Engineering Plate et fortrinn over Cool Plate for tekniske materialer.

---

## Levetid

Engineering Plate er den **mest holdbare standardplaten** i Bambu Labs sortiment, takket være den teksturerte overflaten som fordeler slitasje og tåler mekanisk bruk bedre.

| Vedlikeholdsadferd | Forventet levetid |
|-------------------|-------------------|
| God (IPA + regelmessig vask) | 600–800 prints |
| Gjennomsnittlig | 300–500 prints |
| Dårlig (metallskrape, manglende rengjøring) | Under 200 prints |

:::tip Forleng levetiden
Varier utskriftsposisjonen. Midtsonen er alltid mest utsatt — ved å flytte og rotere objekter i slicer-programvaren fordeler du slitasjen og kan oppnå 50 % lengre levetid.
:::
