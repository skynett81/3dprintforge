---
sidebar_position: 4
title: TPU
description: Útmutató TPU nyomtatáshoz — hőmérséklet, sebesség és visszahúzási beállítások
---

# TPU

A TPU (Termoplasztikus poliuretán) rugalmas anyag, amelyet tokhoz, tömítésekhez, kerekekhez és más rugalmasságot igénylő alkatrészekhez használnak.

## Beállítások

| Paraméter | Érték |
|-----------|-------|
| Fúvóka hőmérséklete | 220–240 °C |
| Ágy hőmérséklete | 30–45 °C |
| Részleges hűtés | 50–80% |
| Sebesség | 30–50% (FONTOS) |
| Visszahúzás | Minimális vagy letiltva |
| Szárítás | Ajánlott (6–8 óra 60 °C-on) |

:::danger Az alacsony sebesség kritikus
A TPU-t lassan kell nyomtatni. A túl magas sebesség az extruderben való összenyomódáshoz és elakadáshoz vezet. Kezdj 30% sebességgel, és óvatosan növelj.
:::

## Ajánlott építőlemezek

| Lemez | Alkalmasság | Ragasztóstift? |
|-------|------------|----------------|
| Textured PEI | Kiváló | Nem |
| Cool Plate (Sima PEI) | Jó | Nem |
| Engineering Plate | Jó | Nem |

## Visszahúzási beállítások

A TPU rugalmas, és rosszul reagál az agresszív visszahúzásra:

- **Közvetlen meghajtás (X1C/P1S/A1):** Visszahúzás 0,5–1,0 mm, 25 mm/s
- **Bowden (kerülendő TPU-val):** Nagyon nehéz, nem ajánlott

Nagyon puha TPU esetén (Shore A 85 vagy alacsonyabb): tiltsd le teljesen a visszahúzást, és támaszkodj a hőmérséklet- és sebességszabályozásra.

## Tippek

- **Szárítsd a filamentet** — a nedves TPU rendkívül nehezen nyomtatható
- **Használj közvetlen extrudert** — a Bambu Lab P1S/X1C/A1 mind közvetlen meghajtású
- **Kerüld a magas hőmérsékletet** — 250 °C felett a TPU degradálódik és elszínezett nyomatot eredményez
- **Hajlam** — a TPU hajlamos stringet képezni; csökkentsd a hőmérsékletet 5 °C-kal, vagy növeld a hűtést

:::tip Shore-keménység
A TPU különböző Shore-keménységben kapható (A85, A95, A98). Minél alacsonyabb a Shore A, annál puhább és annál nehezebb nyomtatni. A Bambu Lab TPU-ja Shore A 95 — jó kiindulási pont.
:::

## Tárolás

A TPU rendkívül higroszkopikus (nedvességet szív). A nedves TPU következményei:
- Buborékok és sziszegés
- Gyenge és törékeny nyomat (paradox módon egy rugalmas anyagnál)
- Stringing

**Mindig szárítsd a TPU-t** 60 °C-on 6–8 órán át nyomtatás előtt. Tárold lezárt dobozban szilika-géllel.
