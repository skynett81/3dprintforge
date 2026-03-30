---
sidebar_position: 10
title: Kompatibilitási mátrix
description: Anyagok kompatibilitásának teljes áttekintése Bambu Lab lapokkal, nyomtatókkal és fúvókákkal
---

# Kompatibilitási mátrix

Ez az oldal teljes áttekintést nyújt arról, mely anyagok mely építőlapokkal, nyomtatókkal és fúvókatípusokkal kompatibilisek. Használja a táblázatokat referenciaként új anyagokkal történő nyomtatás tervezésekor.

---

## Anyagok és építőlapok

| Anyag | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Ragasztó |
|-----------|-----------|-------------------|-----------------|--------------|----------|
| PLA | Kiváló | Jó | Nem ajánlott | Jó | Nem |
| PLA+ | Kiváló | Jó | Nem ajánlott | Jó | Nem |
| PLA-CF | Kiváló | Jó | Nem ajánlott | Jó | Nem |
| PLA Silk | Kiváló | Jó | Nem ajánlott | Jó | Nem |
| PETG | Gyenge | Kiváló | Jó | Jó | Igen (Cool) |
| PETG-CF | Gyenge | Kiváló | Jó | Elfogadható | Igen (Cool) |
| ABS | Nem ajánlott | Kiváló | Jó | Elfogadható | Igen (HT) |
| ASA | Nem ajánlott | Kiváló | Jó | Elfogadható | Igen (HT) |
| TPU | Jó | Jó | Nem ajánlott | Kiváló | Nem |
| PA (Nylon) | Nem ajánlott | Kiváló | Jó | Gyenge | Igen |
| PA-CF | Nem ajánlott | Kiváló | Jó | Gyenge | Igen |
| PA-GF | Nem ajánlott | Kiváló | Jó | Gyenge | Igen |
| PC | Nem ajánlott | Elfogadható | Kiváló | Nem ajánlott | Igen (Eng) |
| PC-CF | Nem ajánlott | Elfogadható | Kiváló | Nem ajánlott | Igen (Eng) |
| PVA | Kiváló | Jó | Nem ajánlott | Jó | Nem |
| HIPS | Nem ajánlott | Jó | Jó | Elfogadható | Nem |
| PVB | Jó | Jó | Nem ajánlott | Jó | Nem |

**Jelmagyarázat:**
- **Kiváló** — optimálisan működik, ajánlott kombináció
- **Jó** — jól működik, elfogadható alternatíva
- **Elfogadható** — működik, de nem ideális — további intézkedések szükségesek
- **Gyenge** — módosításokkal működhet, de nem ajánlott
- **Nem ajánlott** — gyenge eredmények vagy lap sérülésének kockázata

:::tip PETG és Cool Plate
A PETG **túl erősen tapad** a Cool Plate-hez (Smooth PEI), és az alkatrész eltávolításakor letépheti a PEI-bevonatot. Mindig használjon ragasztót elválasztó filmként, vagy válassza az Engineering Plate-et.
:::

:::warning PC és lapválasztás
A PC a magas tálcahőmérsékletek (100–120 °C) miatt High Temp Plate-et igényel. Más lapok ezeknél a hőmérsékleteknél tartósan deformálódhatnak.
:::

---

## Anyagok és nyomtatók

| Anyag | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|-----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen |
| PLA+ | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen |
| PLA-CF | Igen* | Igen* | Igen* | Igen* | Igen* | Igen | Igen | Igen* | Igen* | Igen* |
| PETG | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen |
| PETG-CF | Igen* | Igen* | Igen* | Igen* | Igen* | Igen | Igen | Igen* | Igen* | Igen* |
| ABS | Nem | Nem | Lehetséges** | Igen | Igen | Igen | Igen | Igen | Igen | Igen |
| ASA | Nem | Nem | Lehetséges** | Igen | Igen | Igen | Igen | Igen | Igen | Igen |
| TPU | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen |
| PA (Nylon) | Nem | Nem | Nem | Lehetséges** | Lehetséges** | Igen | Igen | Igen | Igen | Igen |
| PA-CF | Nem | Nem | Nem | Nem | Nem | Igen | Igen | Lehetséges** | Lehetséges** | Lehetséges** |
| PA-GF | Nem | Nem | Nem | Nem | Nem | Igen | Igen | Lehetséges** | Lehetséges** | Lehetséges** |
| PC | Nem | Nem | Nem | Lehetséges** | Nem | Igen | Igen | Lehetséges** | Lehetséges** | Lehetséges** |
| PC-CF | Nem | Nem | Nem | Nem | Nem | Igen | Igen | Nem | Nem | Nem |
| PVA | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen | Igen |
| HIPS | Nem | Nem | Lehetséges** | Igen | Igen | Igen | Igen | Igen | Igen | Igen |

**Jelmagyarázat:**
- **Igen** — teljes mértékben támogatott és ajánlott
- **Igen*** — edzett acél fúvókát igényel (HS01 vagy egyenértékű)
- **Lehetséges**** — korlátozásokkal működhet, hivatalosan nem ajánlott
- **Nem** — nem alkalmas (nincs burkolat, alacsony hőmérsékletek stb.)

:::danger Burkolat követelmények
Burkolatot igénylő anyagok (ABS, ASA, PA, PC):
- **A1 és A1 Mini** nyitott váz — nem alkalmas
- **P1P** nyitott váz — burkolat kiegészítő szükséges
- **P1S** burkolattal rendelkezik, de nincs aktív kamrafűtés
- **X1C és X1E** aktív fűtésű teljes burkolattal — igényes anyagokhoz ajánlott
:::

---

## Anyagok és fúvókatípusok

| Anyag | Sárgaréz (standard) | Edzett acél (HS01) | Hardened Steel |
|-----------|--------------------|--------------------|----------------|
| PLA | Kiváló | Kiváló | Kiváló |
| PLA+ | Kiváló | Kiváló | Kiváló |
| PLA-CF | Ne használja | Kiváló | Kiváló |
| PLA Silk | Kiváló | Kiváló | Kiváló |
| PETG | Kiváló | Kiváló | Kiváló |
| PETG-CF | Ne használja | Kiváló | Kiváló |
| ABS | Kiváló | Kiváló | Kiváló |
| ASA | Kiváló | Kiváló | Kiváló |
| TPU | Kiváló | Jó | Jó |
| PA (Nylon) | Jó | Kiváló | Kiváló |
| PA-CF | Ne használja | Kiváló | Kiváló |
| PA-GF | Ne használja | Kiváló | Kiváló |
| PC | Jó | Kiváló | Kiváló |
| PC-CF | Ne használja | Kiváló | Kiváló |
| PVA | Kiváló | Jó | Jó |
| HIPS | Kiváló | Kiváló | Kiváló |
| PVB | Kiváló | Jó | Jó |

:::danger Szénszál és üvegszál edzett fúvókát igényel
Minden **-CF** (szénszál) vagy **-GF** (üvegszál) jelölésű anyag **edzett acél fúvókát** igényel. A sárgaréz ezekkel az anyagokkal órákon belül elkopik. Bambu Lab HS01 ajánlott.

Edzett fúvókát igénylő anyagok:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Sárgaréz vs edzett acél hagyományos anyagokhoz
A sárgaréz fúvóka **jobb hővezetést** biztosít, így egyenletesebb extrudálást hagyományos anyagokhoz (PLA, PETG, ABS). Az edzett acél is jól működik, de 5–10 °C-kal magasabb hőmérsékletet igényelhet. Mindennapi használathoz sárgaréz, CF/GF anyagokhoz edzett acél.
:::

---

## Anyagváltási tippek

AMS-ben vagy manuálisan történő anyagváltáskor a megfelelő tisztítás fontos a szennyeződés elkerüléséhez.

### Ajánlott tisztítási mennyiség

| Átmenet | Tisztítási mennyiség | Megjegyzés |
|-----------|-------------|---------|
| PLA → PLA (más szín) | 100–150 mm³ | Standard színváltás |
| PLA → PETG | 200–300 mm³ | Hőmérséklet-emelkedés, eltérő folyás |
| PETG → PLA | 200–300 mm³ | Hőmérséklet-csökkenés |
| ABS → PLA | 300–400 mm³ | Nagy hőmérséklet-különbség |
| PLA → ABS | 300–400 mm³ | Nagy hőmérséklet-különbség |
| PA → PLA | 400–500 mm³ | Nylon a hotendben marad |
| PC → PLA | 400–500 mm³ | PC alapos tisztítást igényel |
| Sötét → Világos szín | 200–300 mm³ | Sötét pigment nehezen tisztítható |
| Világos → Sötét szín | 100–150 mm³ | Könnyebb átmenet |

### Hőmérsékletváltozás anyagváltásnál

| Átmenet | Javaslat |
|----------|-----------|
| Hideg → Meleg (pl. PLA → ABS) | Melegítsen az új anyag hőmérsékletére, alaposan tisztítson |
| Meleg → Hideg (pl. ABS → PLA) | Először magas hőmérsékleten tisztítson, majd csökkentse |
| Hasonló hőmérsékletek (pl. PLA → PLA) | Standard tisztítás |
| Nagy különbség (pl. PLA → PC) | PETG-vel köztes lépés segíthet |

:::warning Nylon és PC maradékot hagy
PA (Nylon) és PC különösen nehéz tisztítani. Ezen anyagok használata után:
1. Tisztítson **PETG**-vel vagy **ABS**-sel magas hőmérsékleten (260–280 °C)
2. Használjon legalább **500 mm³** tisztítóanyagot
3. Vizuálisan ellenőrizze az extrudálást — teljesen tisztának kell lennie elszíneződés nélkül
:::

---

## Gyors referencia — anyagválasztás

Nem biztos benne, melyik anyagra van szüksége? Használja ezt az útmutatót:

| Igény | Ajánlott anyag |
|-------|-------------------|
| Prototípus-készítés / napi használat | PLA |
| Mechanikai szilárdság | PETG, PLA Tough |
| Kültéri használat | ASA |
| Hőállóság | ABS, ASA, PC |
| Rugalmas alkatrészek | TPU |
| Maximális szilárdság | PA-CF, PC-CF |
| Átlátszó | PETG (natúr), PC (natúr) |
| Esztétika / dekoráció | PLA Silk, PLA Sparkle |
| Pattintós illesztés / élő zsanér | PETG, PA |
| Élelmiszer-érintkezés | PLA (feltételekkel) |
