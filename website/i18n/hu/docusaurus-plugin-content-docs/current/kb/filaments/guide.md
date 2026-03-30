---
sidebar_position: 0
title: Filament útmutató
description: Teljes útmutató az összes 3D nyomtatási filamenthez — hőmérsékletek, lemezek, szárítás és tulajdonságok
---

# Filament útmutató

Teljes referencia az összes általános 3D nyomtatási anyaghoz. Használja ezt az útmutatót a projektjéhez megfelelő filament és beállítások kiválasztásához.

## Áttekintés — Hőmérséklet-beállítások

| Anyag | Fúvóka (°C) | Tálca (°C) | Kamra (°C) | Nehézség |
|-----------|-----------|-----------|-------------|--------------|
| PLA | 190–230 (210) | 35–65 (55) | — | Kezdő |
| PLA-CF | 210–240 (220) | 45–65 (55) | — | Közepes |
| PETG | 220–260 (240) | 60–80 (70) | — | Kezdő |
| PETG-CF | 230–270 (250) | 65–80 (70) | — | Közepes |
| ABS | 240–270 (255) | 90–110 (100) | 40–60 | Közepes |
| ASA | 240–270 (260) | 90–110 (100) | 40–60 | Közepes |
| TPU | 210–240 (225) | 40–60 (50) | — | Haladó |
| PA (Nylon) | 260–290 (275) | 80–100 (90) | 40–60 | Haladó |
| PA-CF | 270–300 (285) | 80–100 (90) | 45–65 | Szakértő |
| PA-GF | 270–300 (285) | 80–100 (90) | 45–65 | Szakértő |
| PC | 260–300 (280) | 100–120 (110) | 50–70 | Szakértő |
| PVA | 190–220 (200) | 45–60 (55) | — | Közepes |
| PVB | 200–230 (215) | 50–70 (60) | — | Közepes |
| HIPS | 220–250 (235) | 80–100 (90) | 35–50 | Közepes |
| PET-CF | 250–280 (265) | 65–85 (75) | — | Haladó |

*A zárójelben lévő értékek az ajánlott értékek.*

## Lemez-kompatibilitás

| Anyag | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI |
|-----------|:----------:|:-----------------:|:---------------:|:------------:|
| PLA | ★★★ | ★★ | ✗ | ★★★ |
| PLA-CF | ★★ | ★★★ | ✗ | ★★★ |
| PETG | ✗ (ragasztó) | ★★★ | ★★ | ★★★ |
| PETG-CF | ✗ (ragasztó) | ★★★ | ★★ | ★★★ |
| ABS | ⊘ | ★★★ | ★★★ | ★★ |
| ASA | ⊘ | ★★★ | ★★★ | ★★ |
| TPU | ★★★ | ★★ | ✗ | ★★ |
| PA (Nylon) | ⊘ | ★★ (ragasztó) | ★★★ | ★★ (ragasztó) |
| PA-CF | ⊘ | ★★ (ragasztó) | ★★★ | ★★ (ragasztó) |
| PA-GF | ⊘ | ★★ (ragasztó) | ★★★ | ★★ (ragasztó) |
| PC | ⊘ | ★★ (ragasztó) | ★★★ | ✗ (ragasztó) |
| PVA | ★★ | ★★ | ✗ | ★★ |
| PVB | ★★ | ★★ | ✗ | ★★ |
| HIPS | ⊘ | ★★ | ★★★ | ★★ |
| PET-CF | ✗ (ragasztó) | ★★★ | ★★ | ★★★ |

**Jelmagyarázat:** ★★★ = Kiváló, ★★ = Jó, ✗ = Gyenge, ⊘ = Nem ajánlott, (ragasztó) = Ragasztóstift szükséges

## Szárítás

| Anyag | Hőmérséklet | Idő | Nedvességérzékenység |
|-----------|:----------:|:---:|:----------------:|
| PLA | 50 °C | 4ó | Alacsony |
| PLA-CF | 55 °C | 6ó | Alacsony |
| PETG | 65 °C | 6ó | Közepes |
| PETG-CF | 65 °C | 8ó | Közepes |
| ABS | 65 °C | 6ó | Közepes |
| ASA | 65 °C | 6ó | Közepes |
| TPU | 50 °C | 6ó | Magas |
| PA (Nylon) | 80 °C | 12ó | Extrém |
| PA-CF | 80 °C | 12ó | Extrém |
| PA-GF | 80 °C | 12ó | Extrém |
| PC | 80 °C | 8ó | Magas |
| PVA | 45 °C | 8ó | Extrém |
| PVB | 50 °C | 6ó | Közepes |
| HIPS | 60 °C | 6ó | Alacsony |
| PET-CF | 65 °C | 8ó | Közepes |

:::tip Szárítási szabály
A **magas** vagy **extrém** nedvességérzékenységű anyagokat használat előtt mindig szárítani kell, és páramentesítő szerrel kell tárolni.
:::

## Különleges követelmények

| Anyag | Burkolat | Edzett fúvóka | Kompatibilis nyomtatók |
|-----------|:---------:|:-----------:|:-------------------:|
| PLA | Nem | Nem | Összes |
| PLA-CF | Nem | **Igen** | Összes |
| PETG | Nem | Nem | Összes |
| PETG-CF | Nem | **Igen** | Összes |
| ABS | **Igen** | Nem | Csak zárt |
| ASA | **Igen** | Nem | Csak zárt |
| TPU | Nem | Nem | Összes |
| PA (Nylon) | **Igen** | Nem | Csak zárt |
| PA-CF | **Igen** | **Igen** | Csak zárt |
| PA-GF | **Igen** | **Igen** | Csak zárt |
| PC | **Igen** | Nem | Csak zárt |
| PVA | Nem | Nem | Összes |
| PVB | Nem | Nem | Összes |
| HIPS | **Igen** | Nem | Csak zárt |
| PET-CF | Nem | **Igen** | Összes |

## Tulajdonságok (1–5)

| Anyag | Szilárdság | Rugalmasság | Hő | UV | Felület | Nyomtathatóság |
|-----------|:------:|:-------------:|:-----:|:--:|:---------:|:-----------:|
| PLA | 3 | 2 | 2 | 1 | 4 | 5 |
| PLA-CF | 4 | 1 | 2 | 2 | 3 | 4 |
| PETG | 4 | 3 | 3 | 3 | 3 | 4 |
| PETG-CF | 5 | 2 | 3 | 3 | 3 | 3 |
| ABS | 4 | 3 | 4 | 2 | 3 | 2 |
| ASA | 4 | 3 | 4 | 5 | 3 | 2 |
| TPU | 3 | 5 | 2 | 3 | 3 | 2 |
| PA (Nylon) | 5 | 4 | 4 | 2 | 3 | 2 |
| PA-CF | 5 | 2 | 5 | 3 | 3 | 1 |
| PA-GF | 5 | 2 | 5 | 3 | 2 | 1 |
| PC | 5 | 3 | 5 | 3 | 3 | 1 |
| PVA | 1 | 2 | 1 | 1 | 3 | 2 |
| PVB | 3 | 3 | 2 | 2 | 5 | 3 |
| HIPS | 3 | 2 | 3 | 2 | 3 | 3 |
| PET-CF | 5 | 2 | 4 | 3 | 3 | 3 |

## Tippek anyagonként

### Standard (PLA, PETG)
- A PLA a legegyszerűbb anyag — tökéletes prototípusokhoz és díszítéshez
- A PETG jobb szilárdságot és hőállóságot kínál, de jobban szálazhat
- Mindkettő működik burkolat nélkül és standard réz fúvókával

### Mérnöki (ABS, ASA, PC)
- Zárt nyomtatót igényel a vetemedés elkerüléséhez
- Az ASA UV-álló — használja kültéri alkatrészekhez
- A PC a legnagyobb szilárdságot és hőállóságot kínálja, de a legnehezebb nyomtatni

### Kompozit (CF/GF)
- **Mindig** használjon edzett acél fúvókát — a szénszál gyorsan koptatja a réz fúvókákat
- A CF változatok merevebb és könnyebb alkatrészeket adnak matt felülettel
- A GF változatok olcsóbbak, de durvább felületet adnak

### Rugalmas (TPU)
- Nyomtasson lassan (50 mm/s vagy alatta) a legjobb eredményekért
- Csökkentse a visszahúzást az eltömődés elkerüléséhez
- A közvetlen meghajtású extruderek sokkal jobban működnek, mint a Bowden

### Támasz (PVA, HIPS)
- A PVA vízben oldódik — tökéletes PLA támaszhoz
- A HIPS limonénben oldódik — ABS-sel együtt használják
- Mindkettő nagyon nedvességérzékeny — szárazon tárolja

:::warning Nylon anyagok
A PA, PA-CF és PA-GF **rendkívül** higroszkópos. Perceken belül felszívják a levegő nedvességét. Használat előtt mindig szárítsa 12+ órán át, és ha lehetséges, közvetlenül szárítódobozból nyomtasson.
:::
