---
sidebar_position: 2
title: PETG
description: Guide til PETG-printing — temperatur, VIKTIG om limstift, plate og tips
---

# PETG

PETG (Polyethylene Terephthalate Glycol) er et populært materialet for funksjonelle deler. Det er sterkere og mer varmestabilt enn PLA, og tåler lett kjemisk eksponering.

## Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 230–250 °C |
| Sengtemperatur | 70–85 °C |
| Del-kjøling | 30–60% |
| Hastighet | Standard |
| Tørking | Anbefalt (6–8 t ved 65 °C) |

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmerket | Nei/Ja* |
| Textured PEI | Bra | Ja** |
| Cool Plate (Smooth PEI) | Se advarsel | Se advarsel |
| High Temp Plate | Bra | Ja |

:::danger VIKTIG: Limstift på Smooth PEI med PETG
PETG hefter **ekstremt godt** på Smooth PEI (Cool Plate). Uten limstift risikerer du å **rive av belegg fra platen** når du fjerner printen. Bruk alltid et tynt lag limstift på Smooth PEI når du printer PETG — dette fungerer som en barriere.

**Alternativt:** Bruk Engineering Plate eller Textured PEI — disse gir god heft uten å ødelegge platen.
:::

## Tips for vellykket printing

- **Reduser del-kjøling** — for mye kjøling gir lagdeling og sprø print
- **Øk dysetemperatur** — ved stringing, prøv å gå ned 5–10 °C; ved dårlig lagfusing, gå opp
- **Første lag sengtemperatur** — 80–85 °C for god heft, senk til 70 °C etter første lag
- **Sakk ned hastigheten** — PETG er mer krevende enn PLA, start med 80% hastighet

:::warning Stringing
PETG er tilbøyelig til stringing. Øk retract-avstand (prøv 0.8–1.5 mm for direct drive), øk retract-hastighet, og senk dysetemperatur 5 °C om gangen.
:::

## Tørking

PETG absorberer fuktighet raskere enn PLA. Fuktig PETG gir:
- Bobler og hissing under printing
- Svake lag med porøs overflate
- Økt stringing

**Tørk ved 65 °C i 6–8 timer** før printing, spesielt om spolet har vært åpent lenge.

## Oppbevaring

Oppbevar alltid i forseglet pose eller tørreboks med silikagel. PETG bør ikke stå åpent mer enn noen dager i fuktig miljø.

---

## PETG vs PET — hva er forskjellen?

PET (Polyethylene Terephthalate) er plasten du finner i vannflasker. Den er vanskelig å printe fordi den krystalliserer raskt ved avkjøling og gir sprø, ujevne lag.

**PETG** er PET modifisert med glykol (derav G-en). Glykol-tilsetningen:
- Forhindrer krystallisering under printing
- Gjør materialet mer fleksibelt og seigt
- Senker glassoversgangstemperaturen litt
- Gjør det **dramatisk enklere** å printe enn ren PET

Resultatet er et materiale med mye av PETs kjemiske motstandsdyktighet, men med en printbarhet som nærmer seg PLA.

---

## PETG-varianter

### PETG-CF (karbonfiber)

Karbonfiberforsterket PETG kombinerer god kjemisk motstand med høyere stivhet:

- Stivere og dimensjonsstabil enn standard PETG
- Lavere warping enn PA-CF, men sterkere enn PLA-CF
- **Abrasivt — herdet stål-dyse påkrevd**
- Printer ved 240–260 °C, seng 70–80 °C
- God for mekaniske innkapsler og brakets som også tåler kjemikalier

### PETG-ESD (antistatisk)

Spesialisert variant for elektronikkindustri:

- Leder bort statisk elektrisitet (ESD = ElectroStatic Discharge)
- Brukes til innkapsling av kretskorter, IC-holdere, jigs
- Printer på standard PETG-innstillinger
- Dyrere enn standard PETG — bruk kun der ESD-beskyttelse er nødvendig

---

## Hygroskopisk materiale — fuktighet er fienden

PETG absorberer fuktighet fra luften og dette **ødelegger printresultatet**. Tegn på fuktig PETG:

- Hissing og poppende lyder fra dysespissen
- Bobler og rifler på overflaten
- Økt stringing
- Porøs, svak struktur på ferdige deler

:::danger Tørk PETG før viktige prints
PETG er et hygroskopisk materiale. Et spole som har ligget åpent i fuktig klima i noen dager kan gi elendig resultat. **Tørk alltid ved 65 °C i 6–8 timer** før du starter viktige prints.
:::

---

## Kjemikalieresistens

PETG har god motstand mot de fleste hverdagskjemikalier:

| Stoff | Resistens |
|-------|-----------|
| Vann | Utmerket |
| Svake syrer (eddik, sitronsyre) | Bra |
| Alkohol (IPA, etanol) | Bra |
| Bensin og olje | Moderat |
| Aceton | Dårlig (løses) |
| Sterke syrer / baser | Unngå |

PETG er et godt valg for beholdere og deler som utsettes for vann, lave konsentrasjoner av kjemikalier eller rengjøringsmidler.

---

## Utendørs bruk og UV-resistens

PETG tåler utendørs eksponering bedre enn PLA, men dårligere enn ASA:

| Materiale | UV-resistens utendørs |
|-----------|----------------------|
| PLA | Dårlig — gulner og sprekker |
| PETG | Moderat — tåler måneder til år |
| ASA | Utmerket — designet for utendørs |
| ABS | Dårlig — sprekker i sol |

For deler som henger ute i mange år (braketter, kapsler, utendørs utstyr): velg ASA. For kortvarig utendørsbruk eller beskyttede lokasjoner er PETG tilstrekkelig.

---

## Krymping

PETG krymper **0.3–0.6%** — lavere enn ABS men noe mer enn PLA. Dimensjonsnøyaktigheten er god og krever sjelden kompensasjon for vanlige brukstilfeller.
