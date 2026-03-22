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
