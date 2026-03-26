---
sidebar_position: 6
title: ASA
description: Guide til ASA-printing med Bambu Lab — UV-resistent, utendørs bruk, temperatur og tips
---

# ASA

ASA (Acrylonitrile Styrene Acrylate) er en UV-resistent variant av ABS som er spesielt utviklet for utendørs bruk. Materialet kombinerer styrken og stivheten til ABS med vesentlig bedre motstand mot UV-stråling, aldring og værpåvirkning.

## Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 240–260 °C |
| Sengtemperatur | 90–110 °C |
| Kammertemperatur | 40–50 °C (anbefalt) |
| Del-kjøling | 30–50% |
| Hastighet | 80–100% |
| Tørking nødvendig | Ja |

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate | Utmerket | Nei |
| High Temp Plate | God | Ja |
| Textured PEI | Akseptabel | Ja |
| Cool Plate (Smooth PEI) | Ikke anbefalt | — |

:::tip Engineering Plate er best for ASA
Engineering Plate gir den mest pålitelige heften for ASA uten limstift. Platen tåler de høye sengtemperaturene og gir god adhesjon uten at delen sitter fast permanent.
:::

## Krav til printer

ASA krever **innelukket kammer (enclosure)** for best resultat. Uten innelukke vil du oppleve:

- **Warping** — hjørner løfter seg fra byggplaten
- **Lagdeling** — dårlig binding mellom lagene
- **Overflatesprekker** — synlige sprekker langs printen

| Printer | Egnet for ASA? | Merknad |
|---------|---------------|---------|
| X1C | Utmerket | Fullt innelukket, aktiv oppvarming |
| X1E | Utmerket | Fullt innelukket, aktiv oppvarming |
| P1S | God | Innelukket, passiv oppvarming |
| P1P | Mulig med tillegg | Krever innelukke-tilbehør |
| A1 | Ikke anbefalt | Åpen ramme |
| A1 Mini | Ikke anbefalt | Åpen ramme |

## ASA vs ABS — sammenligning

| Egenskap | ASA | ABS |
|----------|-----|-----|
| UV-motstand | Utmerket | Dårlig |
| Utendørs bruk | Ja | Nei (gulner og blir sprø) |
| Warping | Moderat | Høy |
| Overflate | Matt, jevn | Matt, jevn |
| Kjemisk motstand | God | God |
| Pris | Noe høyere | Lavere |
| Lukt under printing | Moderat | Sterk |
| Slagfasthet | God | God |
| Temperaturbestandighet | ~95–105 °C | ~95–105 °C |

:::warning Ventilasjon
ASA avgir gasser under printing som kan være irriterende. Print i godt ventilert rom eller med et luftfiltersystem. Ikke print ASA i rom der du oppholder deg over lengre tid uten ventilasjon.
:::

## Tørking

ASA er **medium hygroskopisk** og absorberer fuktighet fra luften over tid.

| Parameter | Verdi |
|-----------|-------|
| Tørketemperatur | 65 °C |
| Tørketid | 4–6 timer |
| Hygroskopisk nivå | Medium |
| Tegn på fukt | Poppende lyder, bobler, dårlig overflate |

- Oppbevar i forseglet pose med silikagel etter åpning
- AMS med tørkemiddel er tilstrekkelig for korttidslagring
- For lengre oppbevaring: bruk vakuumpose eller filament-tørkeboks

## Bruksområder

ASA er det foretrukne materialet for alt som skal brukes **utendørs**:

- **Bilkomponenter** — speilhus, dashborddetaljer, ventilhetter
- **Hageverktøy** — fester, klemmer, deler til hagemøbler
- **Utendørs skilt** — skilter, bokstaver, logoer
- **Drone-deler** — landinggear, kamerafester
- **Solcelle-monteringer** — fester og vinkler
- **Postkasse-deler** — mekanismer og dekorasjoner

## Tips for vellykket ASA-printing

### Brim og adhesjon

- **Bruk brim** for store deler og deler med liten kontaktflate
- Brim på 5–8 mm forebygger warping effektivt
- For mindre deler kan du prøve uten brim, men ha det klart som backup

### Unngå trekk

- **Lukk alle dører og vinduer** i rommet under printing
- Trekk og kald luft er ASAs verste fiende
- Ikke åpne kammerdøren under printing

### Temperaturstabilitet

- La kammeret varme opp i **10–15 minutter** før printing starter
- Stabil kammertemperatur gir jevnere resultater
- Unngå å plassere printeren nær vinduer eller ventilasjonsåpninger

### Kjøling

- ASA trenger **begrenset delkjøling** — 30–50% er typisk
- For overheng og broer kan du øke til 60–70%, men forvent noe lagdeling
- For mekaniske deler: prioriter lagbinding over detaljer ved å senke kjølingen

:::tip Første gang med ASA?
Start med en liten testdel (f.eks. en 30 mm kube) for å kalibrere innstillingene dine. ASA oppfører seg svært likt ABS, men med litt lavere tendenser til warping. Har du erfaring med ABS, vil ASA føles som en oppgradering.
:::

---

## Krymping

ASA krymper mer enn PLA og PETG, men generelt litt mindre enn ABS:

| Materiale | Krymping |
|-----------|----------|
| PLA | ~0.3–0.5% |
| PETG | ~0.3–0.6% |
| ASA | ~0.5–0.7% |
| ABS | ~0.7–0.8% |

For deler med stramme toleranser: kompenser med 0.5–0.7% i sliceren, eller test med prøvedeler først.

---

## Etterbehandling

- **Acetongletting** — ASA kan glattes med acetondamp, akkurat som ABS
- **Sliping** — slipes godt med 200–400 grit sandpapir
- **Liming** — CA-lim eller acetonliming fungerer utmerket
- **Maling** — tar maling godt etter lett sliping

:::danger Acetonhåndtering
Aceton er brannfarlig og avgir giftige gasser. Bruk alltid i godt ventilert rom, unngå åpen flamme, og bruk verneutstyr (hansker og briller).
:::
