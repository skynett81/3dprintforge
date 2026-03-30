---
sidebar_position: 1
title: Byggplater oversikt
description: Kompatibilitetsmatrise for alle Bambu Lab byggplater og materialer
---

# Byggplater oversikt

Bambu Lab tilbyr fire ulike byggplater, hver optimalisert for ulike materialer og brukstilfeller. Velg riktig plate for å unngå mislykkede prints og plasskader.

## Kompatibilitetsmatrise

| Materiale | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Limstift? |
|-----------|:----------:|:-----------------:|:---------------:|:------------:|:---------:|
| PLA | ★★★★★ | ★★★★ | ★★ | ★★★★ | Nei |
| PLA+ | ★★★★★ | ★★★★ | ★★ | ★★★★ | Nei |
| PLA Silk | ★★★★★ | ★★★★ | ★★ | ★★★ | Nei |
| PLA-CF | ★★★★ | ★★★★ | ★★ | ★★★★ | Nei |
| PETG | ⚠️ + limstift | ★★★★★ | ★★★ | ★★★★ | ⚠️ Påkrevd på Cool Plate |
| PETG-CF | ⚠️ + limstift | ★★★★★ | ★★★ | ★★★★ | ⚠️ Påkrevd på Cool Plate |
| ABS | ★ | ★★★★ | ★★★★★ | ★★★ | Ja |
| ASA | ★ | ★★★★ | ★★★★★ | ★★★ | Ja |
| TPU | ★★★ | ★★★ | ★★★ | ★★★★★ | Nei |
| PA6 | ★ | ★★★★★ | ★★★★ | ★★★ | Ja (påkrevd) |
| PA12 | ★ | ★★★★★ | ★★★★ | ★★★ | Ja (påkrevd) |
| PA-CF | ★ | ★★★★★ | ★★★★ | ★★★ | Ja (påkrevd) |
| PC | ★ | ★★ | ★★★★★ | ★★ | Ja (påkrevd) |
| PVA/støttemateriale | ★★★ | ★★★★ | ★★ | ★★★ | Nei |

**Forklaring:** ★★★★★ = Utmerket, ★★★★ = Bra, ★★★ = OK, ★★ = Unngå, ★ = Ikke anbefalt, ⚠️ = Bruk med forsiktighet

## Plateoversikt

### Cool Plate (Smooth PEI)
Glatt PEI-plate. Best for PLA og PLA-varianter. **Ikke bruk PETG uten limstift** — PETG hefter for godt og kan rive av belegget.

[Les mer →](./cool-plate)

### Engineering Plate (Textured PEI)
Teksturert PEI med bedre heft for tekniske materialer. Gir fin mønstret underflate på printene. Beste allround-platen.

[Les mer →](./engineering-plate)

### High Temp Plate
For materialer med høye temperaturkrav: ABS, ASA, PC, PA. Tåler sengetemperaturer opp til 120 °C.

[Les mer →](./high-temp-plate)

### Textured PEI Plate
Gir grov tekstur. Utmerket for TPU og materialer som krever god mekanisk heft. Lett å løsne prints etter avkjøling.

[Les mer →](./textured-pei)

## Bruk av limstift

Limstift har to formål:
1. **Barriere** (PETG på Smooth PEI) — hindrer for sterk heft og plateskade
2. **Forbedret heft** (ABS, PA på alle plater) — bedrer kontakten mellom materiale og plate

**Anbefalt limstift:** Bambu Lab sin egen, eller standard Pritt Stick. Påfør ett tynt, jevnt lag og la tørke 30 sekunder.

:::tip Rengjøring etter limstift
Vask platen med lunkent vann og mild såpe etter bruk av limstift. La tørke helt før neste print.
:::

---

## Adhesjonshjelpmidler — detaljert guide

Noen ganger er ikke platen alene nok. Her er en oversikt over de vanligste hjelpemidlene, når de brukes og hvordan.

### Limstift (PVA-basert)

Standard limstift (Pritt Stick, Bambu Lab sin egen, eller generisk kontorklister) er den mest brukte adhesjonshjelperen i 3D-printing.

**Sammensetning:** PVA (polyvinylalkohol) i vannbasert løsning — ufarlig og lett å vaske av.

**Bruk det til:**
- ABS og ASA — forbedrer heft på Engineering Plate og High Temp Plate
- PA/Nylon — nødvendig, nylon hefter ellers ikke godt nok
- PETG på Smooth PEI — **som barriere**, ikke heft (hindrer at PETG river av belegget)

**Påføring:**
1. Varm platen til ca. 30–40 °C (så limstiften tørker raskt og jevnt)
2. Påfør ett tynt, jevnt lag over hele print-området
3. La tørke 30–60 sekunder — skal se matt og usynlig ut, ikke hvitt og klumpete
4. Legg ikke på for mye — tykt lag gir ujevn første-lagkvalitet

:::tip Tynn er best
Et nesten usynlig tynt lag fungerer bedre enn et tykt hvitt strøk. Trykk lett og stryk jevnt.
:::

### Magigoo

Magigoo er et spesialisert adhesjonsmiddel i penn-format, formulert for spesifikke materialer:

| Variant | For materiale |
|---------|--------------|
| Magigoo Original | PLA, PETG, generell bruk |
| Magigoo PA | Nylon |
| Magigoo PC | Polykarbonat |
| Magigoo PP | Polypropylen |
| Magigoo Flex | TPU |

**Fordeler:** Bedre enn limstift for krevende materialer som PA og PC. Vaskes av med vann.

**Bruk:** Påfør på varm plate (40–60 °C), la tørke, print normalt. Printen løsner lett når platen avkjøles.

:::tip Verdt det for PA og PC
For nylon og polykarbonat gir Magigoo PA og Magigoo PC merkbart bedre heft enn vanlig limstift. Er du seriøs med disse materialene er en penn verdt investeringen.
:::

### Hårlakk

En gammel metode som fortsatt fungerer, særlig for PLA og ABS:

- **Når bruke:** PLA på glattere plater, ABS som alternativ til limstift
- **Metode:** Spray ett tynt lag på avkjølt plate, la tørke helt, varm opp og print
- **Ulemper:** Kan bygge seg opp over tid og påvirke dimensjonsnøyaktighet — vask platen jevnlig
- **Produkanter anbefaler det ikke** til Bambu Lab-plater — limstift er tryggere

### Kapton-tape

Kapton (polyimid-tape) er en varmebestandig tape originalt designet for elektronikkindustrien:

- **Primærbruk i 3D-printing:** ABS på ikke-PEI-plater eller egne glass/aluminiumsflater
- **Tåler temperaturer** opp til 260 °C kontinuerlig
- **ABS hefter direkte** på Kapton-overflate med varmeseng ved 100–110 °C
- Ikke nødvendig på Bambu Lab PEI-plater, men nyttig ved eksperimentering
- Påfør uten luftbobler (vanskelig) — bruk en kredittkort som rakkel

### Rengjøring mellom prints

Riktig rengjøring er like viktig som riktig adhesjonsmiddel:

:::warning IPA-rengjøring mellom alle prints
Fingeravtrykk og hudfett er den vanligste årsaken til dårlig heft. **Tørk alltid platen med IPA (isopropylalkohol) 90%+ og et risefritt tørkepapir** mellom prints.

- La IPA fordampe helt (30 sekunder) før du starter print
- Ikke ta på plate-overflaten med bare hender etter rengjøring
- Bambu-printere påminner deg om IPA-rengjøring i statusmeldinger
:::

**Rengjøringstrinn:**

1. **Etter print:** La platen kjøle til romtemperatur
2. **Fjern løst materiale:** Bruk plastspatel forsiktig om nødvendig
3. **IPA-rengjøring:** Fuktig klut eller papir med IPA 90%+, tørk i sirkulære bevegelser
4. **Etter limstift:** Vask med lunkent vann og mild såpe, skyll godt, tørk
5. **Etter hartnakket rest:** Varmt vann og myk svamp — aldri skurende midler

**IPA-konsentrasjon:** Bruk **90% eller høyere**. Apoteket IPA på 70% inneholder for mye vann og etterlater rester på platen. Teknisk IPA (99%) er ideelt.

---

## Typer byggplater

Byggplater for 3D-printing har utviklet seg betydelig siden de første printerene kom på markedet. Her er en oversikt over de tre hovedkategoriene:

### Glass (gammel standard)

De første Bambu Lab-printerene og mange eldre FDM-printere brukte glassbyggeplate som standard. Glassplater gir en perfekt flat overflate, men har ulemper:
- Krever alltid limstift eller annet adhesjonsmiddel
- Litt tunge og sprø — kan knuse ved fall
- Prints slipper ikke automatisk ved avkjøling
- Ikke lenger standard i Bambu Labs sortiment

### PEI-belagt fjærstål (moderne standard)

Alle Bambu Lab-plater i dag bruker fjærende stålplater med PEI-belegg (Polyetherimide). Dette er den dominerende teknologien fordi:
- PEI gir utmerket heft ved høy temperatur og slipper ved avkjøling
- Fjærstålplaten kan bøyes for lett å løsne prints
- Magnetfeste gjør montering og bytte enkelt og raskt
- Kan rengjøres med IPA uten å skade belegget

### Spesialplater

I tillegg til standard PEI-plater tilbyr Bambu Lab og tredjepartsprodusenter spesialplater for særskilte formål — se seksjonen nedenfor.

---

## Spesialplater

Spesialplater er varianter av standard PEI-fjærstålplater, men med et annerledes belegg eller overflatemønster for å gi unike egenskaper.

### PEO — Hologram/hexagon-mønster

PEO-platen har et karakteristisk hexagon- eller hologrammønster etset i belegget. Printen får et dekorativt geometrisk mønster på undersiden. Brukes primært når utseendet på undersiden er del av designet. Best med PLA og PETG.

### PEY — Glitter/stjerne-effekt

PEY-platen gir en glitter- eller stjernelignende tekstur på undersiden av printen. Populær for dekorative objekter, smykker og props. Belegget er delikat — unngå limstift da dette kan ødelegge mønsteret.

### PET — Karbonfiber-utseende

PET-platen gir undersiden av printen et karbonfiber-lignende utseende med et diagonalt vevd mønster. Mye brukt for RC-deler, droner og andre tekniske props der utseendet er viktig. Kompatibel med PLA, PETG og TPU.

### PEX — Høytemperatur smooth

PEX er en høytemperatur-variant av smooth PEI, designet for å tåle temperaturer opp mot 135 °C. Ekstremt holdbar og gir blank underflate som standard Cool Plate, men tåler krevende materialer som PC og PAHT. Se [Spesialplater](./special-plates) for full detaljer.

:::tip Dekorative plater — unngå limstift
På PEO, PEY og PET-plater bør du unngå limstift. Limstiften fyller igjen mønsteret og ødelegger den dekorative effekten. Velg materialer som hefter naturlig på PEI uten adhesjonsmiddel.
:::

---

## Tips: Roter utskriftsposisjonen

Etter mange prints vil midtsonen av platen bli mer slitt enn kantene, fordi de fleste objekter printes sentrert. Et enkelt triks for å forlenge platens levetid betraktelig:

:::tip Roter og flytt print-posisjonen
I slicer-programvaren (Bambu Studio, OrcaSlicer), flytt objektet litt bort fra midten mellom prints. Slik fordeler du slitasjen jevnt over hele platen. Du kan også rotere selve platen 180° med jevne mellomrom — magneten holder den fast uansett orientasjon.
:::

Plater som brukes utelukkende i midten vil typisk få 30–40 % kortere levetid enn plater der utskriftsposisjonen varieres.

---

## Forventet levetid per platetype

Levetiden avhenger av materiale, sengtemperatur, bruk av limstift og generell vedlikehold. Tallene nedenfor er basert på normalt bruk med god vedlikehold og regelmessig IPA-rengjøring.

| Platetype | Typisk bruksområde | Forventet levetid |
|-----------|-------------------|-------------------|
| Cool Plate (Smooth PEI) | PLA, PLA+ | 300–500 prints |
| Engineering Plate (Textured PEI) | PETG, ABS, PA | 500–800 prints |
| High Temp Plate | PC, PAHT-CF, PA-CF | 200–400 prints |
| Textured PEI Plate | TPU, PLA, PETG | 400–700 prints |
| PEO / PEY / PET (spesial) | PLA, PETG (dekorativ) | 200–400 prints |
| PEX (høytemp smooth) | PC, PAHT, ABS | 300–500 prints |

:::warning Kortere levetid ved intensiv bruk
Høye sengtemperaturer (over 100 °C), manglende rengjøring og bruk av skrapeverktøy i metall vil redusere levetiden betydelig. High Temp Plate har lavest forventet levetid fordi den konsekvent utsettes for høyest termisk belastning.
:::
