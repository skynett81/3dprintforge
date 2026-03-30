---
sidebar_position: 5
title: PA / Nylon
description: Guide til nylon-printing — tørking, limstift, innstillinger og varianter
---

# PA / Nylon

Nylon (Polyamide / PA) er et av de sterkeste og mest slitesterke 3D-printmaterialene. Det er ideelt for mekaniske deler, tannhjul, lager og andre høy-belastningsdeler.

## Innstillinger

| Parameter | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Dysetemperatur | 260–280 °C | 250–270 °C | 270–290 °C |
| Sengtemperatur | 70–90 °C | 60–80 °C | 80–100 °C |
| Del-kjøling | 0–30% | 0–30% | 0–20% |
| Tørking (påkrevd) | 80 °C / 8–12 t | 80 °C / 8 t | 80 °C / 12 t |

## Tørking — kritisk for nylon

Nylon er **ekstremt hygroskopisk**. Det absorberer fuktighet fra luften på timer.

:::danger Tørk alltid nylon
Fuktig nylon gir dårlige resultater — svak print, bobler, boblende overflate og dårlig lagfusing. Tørk nylon **umiddelbart** før printing, og bruk det innen noen timer etterpå.

- **Temperatur:** 75–85 °C
- **Tid:** 8–12 timer
- **Metode:** Filamenttørker eller ovn med vifte
:::

Bambu AMS er ikke anbefalt for nylon uten forseglet og tørr konfigurasjon. Bruk ekstern filamentmater direkte til printeren om mulig.

## Byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmerket | Ja (påkrevd) |
| High Temp Plate | Bra | Ja (påkrevd) |
| Cool Plate | Dårlig | — |

:::warning Limstift er påkrevd
Nylon hefter dårlig uten limstift. Bruk en tynn, jevn strøk limstift (Bambu Lab eller Pritt stick). Uten limstift løfter nylon seg fra platen.
:::

## Warping

Nylon warper betydelig:
- Bruk brim (8–15 mm)
- Lukk kammeret (X1C/P1S gir best resultater)
- Unngå store flate deler uten brim
- Hold ventilasjon minimal

## Varianter

### PA6 (Nylon 6)
Vanligst, god styrke og fleksibilitet. Absorberer mye fuktighet.

### PA12 (Nylon 12)
Mer dimensjonsstabil og absorberer noe mindre fuktighet enn PA6. Lettere å printe.

### PA-CF (karbonfiber)
Svært stiv og lett. Krever herdet stål-dyse. Printer tørrere enn standard nylon.

### PA-GF (glassfiberfylt)
God stivhet til lavere kostnad enn CF. Krever herdet stål-dyse.

## Oppbevaring

Oppbevar nylon i forseglet boks med aggressivt silikagel. Bambu Lab tørkeboks er ideell. Aldri la nylon ligge åpent over natten.

---

## PA-typer i detalj

### PA6 (Nylon 6)

Den vanligste nylon-typen i 3D-printing:

- God balanse mellom styrke, seighet og fleksibilitet
- **Svært hygroskopisk** — absorberer fuktighet raskest av de tre
- Glassoversgangstemperatur: ~55 °C (kan økes etter annealing)
- Dyse: 260–280 °C, seng: 70–90 °C
- Egnet for generelle mekaniske deler

### PA12 (Nylon 12)

Forbedret variant med bedre dimensjonsstabilitet:

- Absorberer **vesentlig mindre fuktighet** enn PA6 — mer forutsigbar printing
- Lavere smeltetemperatur enn PA6 — lettere å printe
- Noe lavere styrke enn PA6, men bedre kjemikalieresistens
- God for deler som krever presise mål
- Dyse: 250–270 °C, seng: 60–80 °C

### PA66 (Nylon 66)

Industristandard, sterkere og varmere enn PA6:

- Glassoversgangstemperatur: ~70 °C (vs ~55 °C for PA6)
- Sterkere og hardere enn PA6
- Krever enda høyere dysetemperatur (270–290 °C)
- Vanskeligere å printe — mye warping
- Sjelden brukt i hobbyprinting, vanlig i industrielle maskiner

| Type | Fuktighetsfølsomhet | Styrke | Printbarhet |
|------|---------------------|--------|------------|
| PA6 | Høy | God | Moderat |
| PA12 | Lav-moderat | Moderat | Lettere |
| PA66 | Moderat | Høy | Krevende |

### PAHT-CF (høytemperatur karbonfiber nylon)

Det sterkeste alternativet for Bambu-printere i nylon-familien:

- **PA** (høytemp-variant, glassoversgang ~100–120 °C) + **karbonfiber**
- Tåler temperaturer langt over vanlig PA
- Svært stiv og lett — industriell styrke
- **Krever herdet stål-dyse og innelukke**
- Bambu Labs PAHT-CF kjøres typisk ved 280–300 °C
- Egnet for motorrom, elektronikk-innkapsler, luft- og romfartskomponenter

:::warning PAHT-CF er krevende
Forbered deg på nøye tørking (80 °C / 12+ timer), brim, og lukket kammer. Start med en enkel testdel — dette er ikke et materiale for nybegynnere.
:::

---

## Fuktabsorpsjon — nylon er ekstremt hygroskopisk

Nylon er det mest fuktfølsomme vanlige 3D-printmaterialet. Det absorberer fuktighet til det punkt at en spole som har ligget åpen over natten i normalt innemiljø kan gi klart dårligere resultater.

**Visuell test:** Ser du damp, bobler eller hissing fra dysespissen under printing? Filamenten er fuktig. Stopp og tørk.

:::danger Tørk nylon umiddelbart før printing
Tørk nylon rett FØR du printer — ikke dagen før. Etter tørking ved 80 °C i 8–12 timer er nylon klar. Ha den klar i printeren innen 1–2 timer for beste resultat. Bruk tørrbox-feeding under printing om mulig.
:::

**Optimal tørking:**
- Temperatur: 70–85 °C
- Tid: 8–12 timer (PA6/PA12), 10–14 timer (PA66, PAHT-CF)
- Metode: Dedikert filamenttørker, ovn med vifte eller Bambu AMS Lite med tørke-funksjon

---

## Krymping

Nylon har svært høy krymping sammenlignet med andre materialer: **1–2%** avhengig av type og geometri.

Dette betyr i praksis:
- **Bruk alltid brim** (10–15 mm minimum)
- **Lukket innelukke er nødvendig** for å minimere termisk gradient
- Store, flate deler warper alvorlig uten begge tiltakene
- Legg inn 0.3–0.5 mm ekstra toleranse på passdeler

---

## Kjemikalieresistens

Et av nylons store fortrinn er motstandsdyktighet mot kjemikalier:

| Stoff | Resistens |
|-------|-----------|
| Olje og smøremidler | Utmerket |
| Bensin | Bra |
| Alkohol | Bra |
| Syrer (svake) | Moderat |
| Sterke syrer / baser | Unngå |
| Vann (langtids) | Absorberes — påvirker dimensjoner |

Nylon egner seg godt til deler som utsettes for maskinolje, hydraulikkolje og løsemidler i industrielle miljøer.

---

## Bruksområder

Nylon er det foretrukne materialet for mekaniske deler med høye krav:

- **Tannhjul og kjedehjul** — høy slitestyrke, lett, stille
- **Hengsler og clips** — tåler gjentatt bøying uten å sprekke
- **Klemmer og festeelementer** — god mekanisk styrke
- **Lagerbussinger** — glider godt mot metall
- **Verktøygrep** — kombinasjon av styrke og litt fleksibilitet
- **Karosseriklips og brakets** i bil — tåler varme og oljeeksponering
