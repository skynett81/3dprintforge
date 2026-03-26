---
sidebar_position: 6
title: ASA
description: ASA nyomtatási útmutató Bambu Lab-hoz — UV-ellenállás, kültéri használat, hőmérséklet és tippek
---

# ASA

Az ASA (Acrylonitrile Styrene Acrylate) az ABS UV-álló változata, amelyet kifejezetten kültéri használatra fejlesztettek ki. Az anyag az ABS szilárdságát és merevségét kombinálja a lényegesen jobb UV-sugárzás-, öregedés- és időjárásállósággal.

## Beállítások

| Paraméter | Érték |
|-----------|-------|
| Fúvóka hőmérséklet | 240–260 °C |
| Tálca hőmérséklet | 90–110 °C |
| Kamra hőmérséklet | 40–50 °C (ajánlott) |
| Alkatrész hűtés | 30–50% |
| Sebesség | 80–100% |
| Szárítás szükséges | Igen |

## Ajánlott építőlapok

| Lap | Alkalmasság | Ragasztó? |
|-------|---------|----------|
| Engineering Plate | Kiváló | Nem |
| High Temp Plate | Jó | Igen |
| Textured PEI | Elfogadható | Igen |
| Cool Plate (Smooth PEI) | Nem ajánlott | — |

:::tip Az Engineering Plate a legjobb ASA-hoz
Az Engineering Plate ragasztó nélkül biztosítja a legmegbízhatóbb tapadást ASA-hoz. A lap elviseli a magas tálcahőmérsékleteket, és jó tapadást biztosít anélkül, hogy az alkatrész véglegesen odaragadna.
:::

## Nyomtató követelmények

Az ASA **zárt kamrát (burkolatot)** igényel a legjobb eredményekhez. Burkolat nélkül a következőket tapasztalhatja:

- **Vetemedés (warping)** — a sarkok felemelkednek az építőlapról
- **Rétegszétválás** — gyenge kötés a rétegek között
- **Felületi repedések** — látható repedések a nyomaton

| Nyomtató | Alkalmas ASA-hoz? | Megjegyzés |
|---------|---------------|---------|
| X1C | Kiváló | Teljesen zárt, aktív fűtés |
| X1E | Kiváló | Teljesen zárt, aktív fűtés |
| P1S | Jó | Zárt, passzív fűtés |
| P1P | Kiegészítővel lehetséges | Burkolat kiegészítő szükséges |
| A1 | Nem ajánlott | Nyitott váz |
| A1 Mini | Nem ajánlott | Nyitott váz |

## ASA vs ABS — összehasonlítás

| Tulajdonság | ASA | ABS |
|----------|-----|-----|
| UV-ellenállás | Kiváló | Gyenge |
| Kültéri használat | Igen | Nem (sárgul és törékennyé válik) |
| Vetemedés | Mérsékelt | Magas |
| Felület | Matt, egyenletes | Matt, egyenletes |
| Kémiai ellenállás | Jó | Jó |
| Ár | Valamivel magasabb | Alacsonyabb |
| Szag nyomtatás közben | Mérsékelt | Erős |
| Ütésállóság | Jó | Jó |
| Hőállóság | ~95–105 °C | ~95–105 °C |

:::warning Szellőztetés
Az ASA nyomtatás közben irritáló gázokat bocsát ki. Jól szellőztetett helyiségben vagy légszűrő rendszerrel nyomtasson. Ne nyomtasson ASA-t olyan helyiségben, ahol hosszabb ideig tartózkodik szellőztetés nélkül.
:::

## Szárítás

Az ASA **közepesen higroszkópos**, és idővel elnyeli a levegő nedvességét.

| Paraméter | Érték |
|-----------|-------|
| Szárítási hőmérséklet | 65 °C |
| Szárítási idő | 4–6 óra |
| Higroszkópikus szint | Közepes |
| Nedvesség jelei | Pattogó hangok, buborékok, rossz felület |

- Bontás után tárolja lezárt tasakban szilika géllel
- Szárítószeres AMS elegendő rövid távú tároláshoz
- Hosszú távú tároláshoz: használjon vákuumtasakot vagy filamentszárító dobozt

## Felhasználási területek

Az ASA az előnyben részesített anyag mindenhez, ami **kültérben** lesz használva:

- **Autóipari alkatrészek** — tükörházak, műszerfal részletek, szelepsapkák
- **Kerti szerszámok** — klipszek, bilincsek, kerti bútor alkatrészek
- **Kültéri táblák** — feliratok, betűk, logók
- **Drón alkatrészek** — futómű, kameratartók
- **Napelem tartók** — konzolok és szögvasak
- **Postaláda alkatrészek** — mechanizmusok és díszítések

## Tippek a sikeres ASA nyomtatáshoz

### Brim és tapadás

- **Használjon brim-et** nagy alkatrészeknél és kis érintkezési felületű alkatrészeknél
- 5–8 mm-es brim hatékonyan megelőzi a vetemedést
- Kisebb alkatrészeknél próbálkozhat brim nélkül, de tartsa készenlétben

### Kerülje a huzatot

- Nyomtatás közben **zárja be az összes ajtót és ablakot** a helyiségben
- A huzat és a hideg levegő az ASA legnagyobb ellensége
- Ne nyissa ki a kamraajtót nyomtatás közben

### Hőmérséklet stabilitás

- Hagyja a kamrát **10–15 percig** felmelegedni nyomtatás előtt
- Stabil kamrahőmérséklet egyenletesebb eredményeket ad
- Kerülje a nyomtató ablak vagy szellőzőnyílás közelébe helyezését

### Hűtés

- Az ASA **korlátozott alkatrészhűtést** igényel — 30–50% a tipikus
- Túlnyúlásoknál és hidaknál 60–70%-ra növelhető, de számítson némi rétegszétválásra
- Mechanikus alkatrészeknél: csökkentse a hűtést, előnyben részesítve a rétegkötést a részletekkel szemben

:::tip Először próbálja az ASA-t?
Kezdjen egy kis tesztalkatrészen (pl. 30 mm-es kocka) a beállítások kalibrálásához. Az ASA nagyon hasonlóan viselkedik, mint az ABS, de kissé alacsonyabb vetemedési hajlammal. Ha van ABS tapasztalata, az ASA fejlesztésnek fog tűnni.
:::

---

## Zsugorodás

Az ASA jobban zsugorodik, mint a PLA és PETG, de általában valamivel kevésbé, mint az ABS:

| Anyag | Zsugorodás |
|-----------|----------|
| PLA | ~0.3–0.5% |
| PETG | ~0.3–0.6% |
| ASA | ~0.5–0.7% |
| ABS | ~0.7–0.8% |

Szoros tűrésű alkatrészeknél: kompenzáljon 0.5–0.7%-kal a szeletelőben, vagy először tesztelje próbadarabokkal.

---

## Utólagos feldolgozás

- **Acetonos simítás** — az ASA acetonpárával simítható, akárcsak az ABS
- **Csiszolás** — jól csiszolható 200–400-as csiszolópapírral
- **Ragasztás** — CA ragasztó vagy acetonos ragasztás kiválóan működik
- **Festés** — enyhe csiszolás után jól fogja a festéket

:::danger Acetonkezelés
Az aceton gyúlékony és mérgező gázokat bocsát ki. Mindig jól szellőztetett helyiségben használja, kerülje a nyílt lángot, és viseljen védőfelszerelést (kesztyű és szemüveg).
:::
