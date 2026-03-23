---
sidebar_position: 7
title: Spesialmaterialer
description: ASA, PC, PP, PVA, HIPS og andre spesialmaterialer for avanserte bruksområder
---

# Spesialmaterialer

Utover de vanlige materialene finnes det en rekke spesialmaterialer for spesifikke brukstilfeller — fra UV-bestandige utendørsdeler til vannløselig støttemateriale. Her er en praktisk oversikt.

---

## ASA (Acrylonitrile Styrene Acrylate)

ASA er det beste alternativet til ABS for utendørs bruk. Det printer tilnærmet likt ABS, men tåler sollys og vær langt bedre.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 240–260 °C |
| Sengtemperatur | 90–110 °C |
| Kammertemperatur | 45–55 °C |
| Del-kjøling | 0–20% |
| Tørking | Anbefalt (70 °C / 4–6 t) |

### Egenskaper

- **UV-bestandig:** Designet spesielt for langvarig soleksponering uten at det gulner eller sprekker
- **Varmestabilt:** Glassoversgangstemperatur ~100 °C
- **Slagfast:** Bedre slagmotstand enn ABS
- **Innelukke nødvendig:** Warper på samme måte som ABS — X1C/P1S gir best resultat

:::tip ASA i stedet for ABS utendørs
Skal delen leve utendørs i norsk klima (sol, regn, frost)? Velg ASA fremfor ABS. ASA tåler mange år uten synlig degradering. ABS begynner å sprekke og gulne etter måneder.
:::

### Bruksområder
- Utendørs brakets, kapsler og festepunkter
- Bilskyver-deler, antenne-fester
- Hagemøbler og utemiljø
- Skilting og dispensere på utsiden av bygninger

---

## PC (Polykarbonat)

Polykarbonat er en av de sterkeste og mest slagfaste plastene som kan 3D-printes. Det er gjennomsiktig og tåler ekstreme temperaturer.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 260–310 °C |
| Sengtemperatur | 100–120 °C |
| Kammertemperatur | 50–70 °C |
| Del-kjøling | 0–20% |
| Tørking | Påkrevd (80 °C / 8–12 t) |

:::danger PC krever all-metal hotend og høy temperatur
PC smelter ikke ved standard PLA-temperaturer. Bambu X1C med riktig dyseoppsett håndterer PC. Sjekk alltid at PTFE-komponentene i hotend tåler temperaturen din — standard PTFE tåler ikke over 240–250 °C kontinuerlig.
:::

### Egenskaper

- **Svært slagfast:** Motstandsdyktig mot brudd selv ved lave temperaturer
- **Transparent:** Kan brukes til vinduer, linser og optiske komponenter
- **Varmestabilt:** Glassoversgangstemperatur ~147 °C — høyest av vanlige materialer
- **Hygroskopisk:** Absorberer fuktighet raskt — tørk alltid grundig
- **Warping:** Kraftig krymping — krever innelukke og brim

### Bruksområder
- Sikkerhetsvisir og beskyttende deksler
- Elektriske innkapsler som tåler varme
- Linseholdere og optiske komponenter
- Robotrammer og dronekropper

---

## PP (Polypropylen)

Polypropylen er en av de vanskeligste materialene å printe, men gir unike egenskaper som ingen andre plastmaterialer kan matche.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 220–250 °C |
| Sengtemperatur | 80–100 °C |
| Del-kjøling | 20–50% |
| Tørking | Anbefalt (70 °C / 6 t) |

### Egenskaper

- **Kjemisk resistent:** Tåler sterke syrer, baser, alkohol og de fleste løsemidler
- **Lett og fleksibel:** Lav tetthet, tåler gjentatt bøying (levende hengsel-effekt)
- **Lav heft:** Hefter dårlig mot seg selv og mot byggplaten — det er utfordringen
- **Ikke giftig:** Trygt for matkontakt (avhengig av farge og tilsetninger)

:::warning PP hefter dårlig på alt
PP er beryktet for å ikke hefte mot byggplaten. Bruk PP-tape (som Tesa-tape eller dedikert PP-tape) på Engineering Plate, eller bruk limstift spesialformulert for PP. Brim på 15–20 mm er nødvendig.
:::

### Bruksområder
- Laboratorieflasker og kjemikaliebeholdere
- Matlagringsdeler og kjøkkenutstyr
- Levende hengsler (boks-lokk som tåler tusenvis av åpne/lukke-sykluser)
- Bilkomponenter som tåler kjemikalier

---

## PVA (Polyvinyl Alcohol) — vannløselig støttemateriale

PVA er et spesialmateriale brukt eksklusivt som støttemateriale. Det løser seg opp i vann og etterlater en ren overflate på modellen.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 180–220 °C |
| Sengtemperatur | 35–60 °C |
| Tørking | Kritisk (55 °C / 6–8 t) |

:::danger PVA er ekstremt hygroskopisk
PVA absorberer fuktighet raskere enn noe annet vanlig filament. Tørk PVA grundig FØR printing, og oppbevar alltid i forseglet boks med silika. Fuktig PVA klistrer seg fast i dysen og er svært vanskelig å fjerne.
:::

### Bruk og oppløsning

1. Print modell med PVA som støttemateriale (krever multi-material printer — AMS)
2. Legg ferdig print i varmt vann (30–40 °C)
3. La stå i 30–120 minutter, bytt vann ved behov
4. Skyll med rent vann og la tørke

**Bruk alltid dedikert ekstruder for PVA** om mulig — PVA-rester i en standard ekstruder kan ødelegge neste print.

### Bruksområder
- Komplekse støttestrukturer som er umulige å fjerne manuelt
- Intern overhengstøtte uten merkbart overflateavtrykk
- Modeller med hulrom og indre kanaler

---

## HIPS (High Impact Polystyrene) — løsemiddelløselig støttemateriale

HIPS er et annet støttemateriale, designet for å brukes med ABS. Det løser seg i **limonen** (sitrus-løsemiddel).

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 220–240 °C |
| Sengtemperatur | 90–110 °C |
| Kammertemperatur | 45–55 °C |
| Tørking | Anbefalt (65 °C / 4–6 t) |

### Bruk med ABS

HIPS printer på samme temperaturer som ABS og hefter godt mot det. Etter printing løses HIPS opp ved å legge printen i D-limonen i 30–60 minutter.

:::warning Limonen er ikke vann
D-limonen er et løsemiddel utvunnet fra appelsinskall. Det er relativt ufarlig, men bruk likevel hansker og jobb i ventilert rom. Ikke kast brukt limonen i avløpet — lever til miljøstasjon.
:::

### Sammenligning: PVA vs HIPS

| Egenskap | PVA | HIPS |
|----------|-----|------|
| Løsemiddel | Vann | D-limonen |
| Eget materiale | PLA-kompatibel | ABS-kompatibel |
| Fuktfølsomhet | Ekstremt høy | Moderat |
| Kostnad | Høy | Moderat |
| Tilgjengelighet | God | Moderat |

---

## PVB / Fibersmooth — etanolglattbart materiale

PVB (Polyvinyl Butyral) er et unikt materiale som kan **glattes med etanol (sprit)** — på samme måte som ABS kan glattes med aceton, men mye tryggere.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 190–210 °C |
| Sengtemperatur | 35–55 °C |
| Del-kjøling | 80–100% |
| Tørking | Anbefalt (55 °C / 4 t) |

### Etanol-smoothing

1. Print modellen på standard PVB-innstillinger
2. Pensle på 99% isopropylalkohol (IPA) eller etanol med pensel
3. La tørke i 10–15 minutter — overflaten flyter jevnt ut
4. Gjenta om nødvendig for glattere overflate
5. Alternativt: Pensle og legg i lukket beholder i 5 minutter for dampbehandling

:::tip Tryggere enn aceton
IPA/etanol er langt sikrere å håndtere enn aceton. Flammepunktet er høyere og dampene er langt mindre giftige. God ventilasjon anbefales likevel.
:::

### Bruksområder
- Figuriner og dekorasjon der glatt overflate ønskes
- Prototyper som skal presenteres
- Deler som skal males — glatt overflate gir bedre maling

---

## Anbefalte byggplater for spesialmaterialer

| Materiale | Anbefalt plate | Limstift? |
|-----------|---------------|----------|
| ASA | Engineering Plate / High Temp Plate | Ja |
| PC | High Temp Plate | Ja (påkrevd) |
| PP | Engineering Plate + PP-tape | PP-spesifikk tape |
| PVA | Cool Plate / Textured PEI | Nei |
| HIPS | Engineering Plate / High Temp Plate | Ja |
| PVB | Cool Plate / Textured PEI | Nei |
