---
sidebar_position: 5
title: PA / Nylon
description: Útmutató nylon nyomtatáshoz — szárítás, ragasztóstift, beállítások és változatok
---

# PA / Nylon

A nylon (poliamid / PA) az egyik legerősebb és legkopásállóbb 3D nyomtatóanyag. Ideális mechanikus alkatrészekhez, fogaskerekekhez, csapágyakhoz és más nagy terhelésnek kitett részekhez.

## Beállítások

| Paraméter | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Fúvóka hőmérséklete | 260–280 °C | 250–270 °C | 270–290 °C |
| Ágy hőmérséklete | 70–90 °C | 60–80 °C | 80–100 °C |
| Részleges hűtés | 0–30% | 0–30% | 0–20% |
| Szárítás (kötelező) | 80 °C / 8–12 óra | 80 °C / 8 óra | 80 °C / 12 óra |

## Szárítás — kritikus a nylon esetén

A nylon **rendkívül higroszkopikus**. Órákon belül nedvességet szív a levegőből.

:::danger Mindig szárítsd a nylont
A nedves nylon rossz eredményeket ad — gyenge nyomat, buborékok, buborékos felület és rossz rétegfúzió. Szárítsd a nylont **közvetlenül** nyomtatás előtt, és nyomtasd ki néhány órán belül.

- **Hőmérséklet:** 75–85 °C
- **Idő:** 8–12 óra
- **Módszer:** Filamentszárító vagy ventilátoros sütő
:::

A Bambu AMS nem ajánlott nylonhoz lezárt és száraz konfiguráció nélkül. Lehetőség szerint használj külső filamentadagolót közvetlenül a nyomtatóhoz.

## Építőlemezek

| Lemez | Alkalmasság | Ragasztóstift? |
|-------|------------|----------------|
| Engineering Plate (Textúrált PEI) | Kiváló | Igen (kötelező) |
| High Temp Plate | Jó | Igen (kötelező) |
| Cool Plate | Gyenge | — |

:::warning A ragasztóstift kötelező
A nylon rosszul tapad ragasztóstift nélkül. Használj vékony, egyenletes réteg ragasztóstiftet (Bambu Lab vagy Pritt stick). Ragasztóstift nélkül a nylon felemelkedik a lemezről.
:::

## Warping

A nylon jelentős mértékben warpolódik:
- Használj brimet (8–15 mm)
- Zárd le a kamrát (X1C/P1S adja a legjobb eredményeket)
- Kerüld a nagy lapos részeket brim nélkül
- Minimalizáld a szellőztetést

## Változatok

### PA6 (Nylon 6)
Leggyakoribb, jó szilárdság és rugalmasság. Sok nedvességet szív.

### PA12 (Nylon 12)
Méretstabilabb és valamivel kevesebb nedvességet szív, mint a PA6. Könnyebben nyomtatható.

### PA-CF (szénszál)
Rendkívül merev és könnyű. Edzett acél fúvókát igényel. Szárazabban nyomtat, mint a normál nylon.

### PA-GF (üvegszál-töltetes)
Jó merevség alacsonyabb költségen, mint a CF. Edzett acél fúvókát igényel.

## Tárolás

Tárold a nylont lezárt dobozban agresszív szilika-géllel. A Bambu Lab szárítódoboz ideális. Soha ne hagyd a nylont nyitva egy éjszakán át.
