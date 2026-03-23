---
sidebar_position: 3
title: ABS
description: Guide til ABS-printing — temperatur, innelukke, warping og limstift
---

# ABS

ABS (Acrylonitrile Butadiene Styrene) er et termoplast med god varmestabilitet og slagfasthet. Det krever innelukke og er mer krevende enn PLA/PETG, men gir holdbare funksjonelle deler.

## Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 240–260 °C |
| Sengtemperatur | 90–110 °C |
| Kammertemperatur | 45–55 °C (X1C/P1S) |
| Del-kjøling | 0–20% |
| Aux fan | 0% |
| Hastighet | 80–100% |
| Tørking | Anbefalt (4–6 t ved 70 °C) |

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmerket | Ja (anbefalt) |
| High Temp Plate | Utmerket | Ja |
| Cool Plate (Smooth PEI) | Unngå | — |
| Textured PEI | Bra | Ja |

:::tip Limstift for ABS
Bruk alltid limstift på Engineering Plate ved ABS. Det bedrer heften og gjør det lettere å løsne printen uten å skade platen.
:::

## Innelukke (kammer)

ABS **krever** et lukket kammer for å hindre warping:

- **X1C og P1S:** Innebygd kammer med aktiv varmestyring — ideelt for ABS
- **P1P:** Delvis åpen — legg til toppkapper (kappe over toppen) for bedre resultater
- **A1 / A1 Mini:** Åpen CoreXY — **ikke anbefalt** for ABS uten egenbygd innhylling

Hold kammeret lukket under hele printen. Åpne det ikke for å sjekke printen — venter du til avkjøling, slipper du også warping ved slipp.

## Warping

ABS er svært utsatt for warping (hjørnene løfter seg):

- **Øk sengtemperatur** — prøv 105–110 °C
- **Bruk brim** — 5–10 mm brim i Bambu Studio
- **Unngå trekk** — lukk alle luftstrømmer rundt printeren
- **Senk del-kjøling til 0%** — kjøling forårsaker vridning

:::warning Damper
ABS avgir styrenedamp under printing. Sørg for god ventilasjon i rommet, eller bruk HEPA/aktivt kull-filter. Bambu P1S har innebygd filter.
:::

## Etterbehandling

ABS kan slipes, males og limes lettere enn PETG og PLA. Det kan også damputjevnes med aceton for glatt overflate — men vær svært forsiktig med acetoneksponering.

## Oppbevaring

Tørk ved **70 °C i 4–6 timer** før printing. Oppbevar i forseglet boks — ABS absorberer fuktighet, noe som gir poppende lyder og svake lag.

---

## ABS-varianter

### ABS-GF (glassfiberforsterket)

Glassfibertilsetning gir økt stivhet og bedre dimensjonsstabilitet enn standard ABS:

- Reduserer vridning og krymping noe
- Fortsatt krevende med innelukke og høy sengtemperatur
- **Abrasivt — herdet stål-dyse påkrevd**
- God for innkapsler og strukturelle deler som også trenger varmebestandighet

### ABS-CF (karbonfiberforsterket)

Karbonfiber i ABS-matrise gir det beste av begge verdener — stivhet og varmebestandighet:

- Svært stiv og dimensjonsstabil
- Tåler høye temperaturer (glassoversgang ~105 °C)
- **Abrasivt — herdet stål-dyse er et absolutt krav**
- Mer krevende å printe enn standard ABS — innelukke er enda viktigere

---

## Innelukke er KRITISK for ABS

ABS reagerer svært negativt på temperaturforskjeller under printing. Uten innelukke:

- **Warping:** Hjørner og kanter løfter seg fra byggplaten, spesielt på store flater
- **Lagdeling (delamination):** Lag separeres fra hverandre og gir svak print
- **Sprekker:** Vertikale sprekker i vegger fra termisk stress

:::danger Åpen printer gir ødelagte ABS-prints
Prøv aldri å printe ABS på A1 eller A1 Mini uten egenbygd innhylling. Selv P1P trenger toppkapper. X1C og P1S er de eneste Bambu-printerne som håndterer ABS pålitelig uten ekstra tiltak.
:::

**Tips for bedre innelukke-resultater på X1C/P1S:**
- Start med lukket dør og hold den lukket gjennom hele printen
- La kammeret nå driftstemperatur (45–55 °C) før selve printen starter
- Deaktiver aux-fan (ekstra kjølevifte) helt
- Senk del-kjøling til 0–10%

---

## Aceton-smoothing

En av ABS sine store fordeler er muligheten for kjemisk overflateglatting med aceton:

**Metode:**
1. Hell litt aceton i en beholder tett for printen (ikke la printen stå i aceton)
2. La acetondam sive inn i en lukket beholder i 5–15 minutter
3. Overflaten smelter mikron-tynt og flyter jevnt ut
4. La tørke i åpen luft i 30+ minutter

Resultatet er en **perfekt glatt overflate** uten synlige lag — nesten som støpt plast.

:::danger Brannfare og helsefarer ved aceton
Aceton er svært brannfarlig (flammepunkt −17 °C). Arbeid kun i godt ventilert rom, unngå åpen flamme og elektriske gnister. Bruk hansker og øyevern. Ikke inhaler dampene.
:::

---

## Krymping

ABS har en av de høyeste krymp-ratene i vanlig 3D-printing: **0.7–0.8%**. Dette er årsaken til warping og hvorfor innelukke er så viktig.

Praktiske konsekvenser:
- Bruk alltid **brim** (5–15 mm) for å holde kanter nede
- Legg inn toleranser i modeller som må passe presist
- Store, flate deler er vanskeligst — del opp om mulig

---

## Helse og ventilasjon

ABS avgir **styrendamp** og andre flyktige organiske forbindelser (VOC) under printing. Styren er klassifisert som mulig kreftfremkallende (IARC gruppe 2B).

:::warning Ventiler alltid ved ABS-printing
- Print i et godt ventilert rom, eller bruk printer med innebygd HEPA + aktivt kull-filter
- Bambu P1S har innebygd luftrenser — aktiver den
- Unngå å sitte tett på åpen ABS-printing i lang tid
- Et egenbygd kammer med filterviftc er bedre enn ingen tiltak
:::

---

## ASA som alternativ til ABS

Trenger du ABS sine egenskaper men bedre UV-bestandighet? Velg **ASA**:

| Egenskap | ABS | ASA |
|----------|-----|-----|
| Varmebestandighet | ~105 °C | ~100 °C |
| UV-resistens | Dårlig — gulner og sprekker | Utmerket |
| Printbarhet | Krevende | Krevende (likt ABS) |
| Aceton-smoothing | Ja | Nei (løses ikke i aceton) |
| Innelukke nødvendig | Ja | Ja |

ASA printer på tilnærmet samme innstillinger som ABS og gir bedre resultater utendørs. For innendørs brukstilfeller er de likeverdige.
