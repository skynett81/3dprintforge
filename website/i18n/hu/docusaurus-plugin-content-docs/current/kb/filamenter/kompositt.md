---
sidebar_position: 6
title: Kompozit anyagok (CF/GF)
description: Szénszál- és üvegszál-töltetes filamentek — edzett acél fúvóka, kopás és beállítások
---

# Kompozit anyagok (CF/GF)

A kompozit filamentek rövid szénszál-rostokat (CF) vagy üvegszál-rostokat (GF) tartalmaznak, amelyek egy alapanyagba, például PLA-ba, PETG-be, PA-ba vagy ABS-be vannak keverve. Megnövelt merevséget, csökkentett súlyt és jobb méretstabilitást biztosítanak.

## Elérhető típusok

| Filament | Alapanyag | Merevség | Súlycsökkentés | Nehézség |
|----------|-----------|---------|----------------|---------|
| PLA-CF | PLA | Magas | Mérsékelt | Könnyű |
| PETG-CF | PETG | Magas | Mérsékelt | Közepes |
| PA6-CF | Nylon 6 | Nagyon magas | Jó | Nehéz |
| PA12-CF | Nylon 12 | Nagyon magas | Jó | Közepes |
| ABS-CF | ABS | Magas | Mérsékelt | Közepes |
| PLA-GF | PLA | Magas | Mérsékelt | Könnyű |

## Az edzett acél fúvóka kötelező

:::danger Soha ne használj sárgaréz fúvókát CF/GF anyagokkal
A szén- és üvegszál-rostok rendkívül abrazívak. Órákon vagy napokon belül eltömítik a normál sárgaréz fúvókát. Mindig használj **edzett acél fúvókát** (Hardened Steel) vagy **HS01-fúvókát** minden CF és GF anyaggal.

- Bambu Lab Hardened Steel fúvóka (0,4 mm)
- Bambu Lab HS01 fúvóka (speciális bevonat, hosszabb élettartam)
:::

## Beállítások (PA-CF példa)

| Paraméter | Érték |
|-----------|-------|
| Fúvóka hőmérséklete | 270–290 °C |
| Ágy hőmérséklete | 80–100 °C |
| Részleges hűtés | 0–20% |
| Sebesség | 80% |
| Szárítás | 80 °C / 12 óra |

PLA-CF esetén: fúvóka 220–230 °C, ágy 35–50 °C — sokkal könnyebb, mint a PA-CF.

## Építőlemezek

| Lemez | Alkalmasság | Ragasztóstift? |
|-------|------------|----------------|
| Engineering Plate (Textúrált PEI) | Kiváló | Igen (PA-alaphoz) |
| High Temp Plate | Jó | Igen |
| Cool Plate | Kerülendő (CF karcolja) | — |
| Textured PEI | Jó | Igen |

:::warning A lemez megkarcolódhat
A CF anyagok megkarcolhatják a sima lemezeket eltávolításkor. Mindig használj Engineering Plate-et vagy Textured PEI-t. Ne húzd le a nyomatot — hajtsd meg óvatosan a lemezt.
:::

## Felületkezelés

A CF filamentek matt, szénszerű felületet adnak, amely nem igényel festést. A felület kissé porózus, és epoxyval impregnálható a simább felületért.

## Kopás és fúvóka élettartama

| Fúvókatípus | Élettartam CF-fel | Költség |
|-------------|------------------|---------|
| Sárgaréz (normál) | Óra–nap | Alacsony |
| Edzett acél | 200–500 óra | Közepes |
| HS01 (Bambu) | 500–1000 óra | Magas |

Cseréld ki a fúvókát látható kopásnál: tágult fúvókalyuk, vékony falak, rossz méretpontosság.

## Szárítás

A PA és PETG CF-változatai ugyanúgy szárítást igényelnek, mint az alapanyaguk:
- **PLA-CF:** Szárítás ajánlott, de nem kritikus
- **PETG-CF:** 65 °C / 6–8 óra
- **PA-CF:** 80 °C / 12 óra — kritikus
