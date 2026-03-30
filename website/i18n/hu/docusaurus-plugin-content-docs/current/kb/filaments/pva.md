---
sidebar_position: 8
title: PVA és támasztóanyagok
description: PVA, HIPS, PVB és egyéb támasztóanyagok útmutatója Bambu Lab nyomtatókhoz
---

# PVA és támasztóanyagok

A támasztóanyagokat összetett geometriák nyomtatásához használják, amelyek túlnyúlásokat, hidakat és belső üregeket tartalmaznak, és ideiglenes támasz nélkül nem nyomtathatók. A nyomtatás után a támasztóanyagot eltávolítják — mechanikusan vagy oldószerben történő feloldással.

## Áttekintés

| Anyag | Oldószer | Kombinálás | Oldási idő | Nehézség |
|-----------|-----------|-------------|----------------|-------------------|
| PVA | Víz | PLA, PETG | 12–24 óra | Nehéz |
| HIPS | d-Limonén | ABS, ASA | 12–24 óra | Közepes |
| PVB | Izopropanol (IPA) | PLA, PETG | 6–12 óra | Közepes |
| BVOH | Víz | PLA, PETG, PA | 4–8 óra | Nehéz |

---

## PVA (Polivinil-alkohol)

A PVA vízben oldódó támasztóanyag, amely a leggyakrabban használt választás összetett támasztószerkezetekkel rendelkező PLA-alapú nyomatokhoz.

### Beállítások

| Paraméter | Érték |
|-----------|-------|
| Fúvóka hőmérséklet | 190–210 °C |
| Tálca hőmérséklet | 45–60 °C |
| Alkatrész hűtés | 100% |
| Sebesség | 60–80% |
| Visszahúzás | Megnövelt (6–8 mm) |

### Ajánlott építőlapok

| Lap | Alkalmasság | Ragasztó? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Kiváló | Nem |
| Textured PEI | Jó | Nem |
| Engineering Plate | Jó | Nem |
| High Temp Plate | Kerülje | — |

### Kompatibilitás

A PVA a **hasonló hőmérsékleteken** nyomtató anyagokkal működik a legjobban:

| Főanyag | Kompatibilitás | Megjegyzés |
|---------------|---------------|---------|
| PLA | Kiváló | Ideális kombináció |
| PETG | Jó | A tálcahőmérséklet kissé magas lehet a PVA-nak |
| ABS/ASA | Gyenge | Túl magas kamrahőmérséklet — PVA degradálódik |
| PA (Nylon) | Gyenge | Túl magas hőmérsékletek |

### Feloldás

- Helyezze a kész nyomatot **langyos vízbe** (kb. 40 °C)
- A PVA a vastagságtól függően **12–24 óra** alatt oldódik fel
- Rendszeresen keverje a vizet a folyamat felgyorsításához
- 6–8 óránként cserélje a vizet a gyorsabb feloldásért
- Ultrahangos tisztító lényegesen gyorsabb eredményt ad (2–6 óra)

:::danger A PVA rendkívül higroszkópos
A PVA **nagyon gyorsan** szívja fel a nedvességet a levegőből — akár órák kitettség is tönkreteheti a nyomtatási eredményt. A nedvességet felszívott PVA okozza:

- Intenzív buborékolás és pattogó hangok
- Rossz tapadás a főanyaghoz
- Szálhúzás és ragacsos felület
- Eltömődött fúvóka

**Mindig szárítsa a PVA-t közvetlenül használat előtt**, és száraz környezetből (szárítódoboz) nyomtasson.
:::

### PVA szárítás

| Paraméter | Érték |
|-----------|-------|
| Szárítási hőmérséklet | 45–55 °C |
| Szárítási idő | 6–10 óra |
| Higroszkópikus szint | Rendkívül magas |
| Tárolási módszer | Szárítószeres lezárt doboz, mindig |

---

## HIPS (Nagy ütésállóságú polisztirol)

A HIPS d-limonénben (citrusos oldószer) oldódó támasztóanyag. Az ABS és ASA preferált támasztóanyaga.

### Beállítások

| Paraméter | Érték |
|-----------|-------|
| Fúvóka hőmérséklet | 220–240 °C |
| Tálca hőmérséklet | 90–100 °C |
| Kamra hőmérséklet | 40–50 °C (ajánlott) |
| Alkatrész hűtés | 20–40% |
| Sebesség | 70–90% |

### Kompatibilitás

| Főanyag | Kompatibilitás | Megjegyzés |
|---------------|---------------|---------|
| ABS | Kiváló | Ideális kombináció — hasonló hőmérsékletek |
| ASA | Kiváló | Nagyon jó tapadás |
| PLA | Gyenge | Túl nagy hőmérséklet-különbség |
| PETG | Gyenge | Eltérő termikus viselkedés |

### Feloldás d-limonénben

- Helyezze a nyomatot **d-limonénbe** (citrusos oldószer)
- Feloldási idő: szobahőmérsékleten **12–24 óra**
- 35–40 °C-ra melegítés felgyorsítja a folyamatot
- A d-limonén 2–3-szor újra felhasználható
- Feloldás után öblítse le a részt vízzel és szárítsa meg

### Előnyök a PVA-val szemben

- **Sokkal kevésbé nedvességérzékeny** — könnyebb tárolni és kezelni
- **Erősebb támasztóanyagként** — többet bír szétesés nélkül
- **Jobb termikus kompatibilitás** ABS/ASA-val
- **Könnyebb nyomtatni** — kevesebb eltömődés és probléma

:::warning A d-limonén oldószer
Használjon kesztyűt és szellőztetett helyiségben dolgozzon. A d-limonén irritálhatja a bőrt és a nyálkahártyákat. Tartsa gyermekektől elzárva.
:::

---

## PVB (Polivinil-butirál)

A PVB egy egyedülálló támasztóanyag, amely izopropanolban (IPA) oldódik, és IPA-gőzzel történő felületsimításra is használható.

### Beállítások

| Paraméter | Érték |
|-----------|-------|
| Fúvóka hőmérséklet | 200–220 °C |
| Tálca hőmérséklet | 55–75 °C |
| Alkatrész hűtés | 80–100% |
| Sebesség | 70–80% |

### Kompatibilitás

| Főanyag | Kompatibilitás | Megjegyzés |
|---------------|---------------|---------|
| PLA | Jó | Elfogadható tapadás |
| PETG | Közepes | A tálcahőmérséklet változhat |
| ABS/ASA | Gyenge | Túl magas hőmérsékletek |

### Felületsimítás IPA-gőzzel

A PVB egyedülálló tulajdonsága, hogy felülete IPA-gőzzel simítható:

1. Helyezze az alkatrészt zárt tartályba
2. Tegyen IPA-val nedvesített ruhát az aljára (ne legyen közvetlen érintkezés az alkatrésszel)
3. Hagyja a gőzt hatni **30–60 percig**
4. Vegye ki és hagyja száradni 24 órán át
5. Az eredmény sima, félfényes felület

:::tip PVB mint felületkezelés
Bár a PVB elsősorban támasztóanyag, PLA alkatrészek külső rétegeként is nyomtatható, hogy IPA-gőzzel simítható felületet kapjon. Ez az acetonnal simított ABS-hez hasonló felületet ad.
:::

---

## Támasztóanyagok összehasonlítása

| Tulajdonság | PVA | HIPS | PVB | BVOH |
|----------|-----|------|-----|------|
| Oldószer | Víz | d-Limonén | IPA | Víz |
| Oldási idő | 12–24 ó | 12–24 ó | 6–12 ó | 4–8 ó |
| Nedvességérzékenység | Rendkívül magas | Alacsony | Közepes | Rendkívül magas |
| Nehézség | Nehéz | Közepes | Közepes | Nehéz |
| Ár | Magas | Közepes | Magas | Nagyon magas |
| Legjobb párosítás | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Elérhetőség | Jó | Jó | Korlátozott | Korlátozott |
| AMS-kompatibilis | Igen (szárítószerrel) | Igen | Igen | Problémás |

---

## Tippek kettős extrudáláshoz és többszínű nyomtatáshoz

### Általános irányelvek

- **Tisztítási mennyiség** — a támasztóanyagok jó tisztítást igényelnek anyagváltáskor (minimum 150–200 mm³)
- **Felületi rétegek** — használjon 2–3 interfész réteget a támasz és a fő alkatrész között a tiszta felületért
- **Távolság** — állítsa a támaszmezőt 0.1–0.15 mm-re a feloldás utáni könnyű eltávolításhoz
- **Támaszminta** — PVA/BVOH-hoz háromszög mintát, HIPS-hez rácsot használjon

### AMS beállítás

- Helyezze a támasztóanyagot **szárítószeres AMS helyre**
- PVA esetén: fontolja meg a külső szárítódobozt Bowden-csatlakozással
- Konfigurálja a helyes anyagprofilt a Bambu Studio-ban
- Teszteljen egyszerű túlnyúlás-modellel a bonyolult alkatrészek nyomtatása előtt

### Gyakori problémák és megoldások

| Probléma | Ok | Megoldás |
|---------|-------|---------|
| Támasz nem tapad | Túl nagy távolság | Csökkentse az interfész távolságot 0.05 mm-re |
| Támasz túl erősen tapad | Túl kis távolság | Növelje az interfész távolságot 0.2 mm-re |
| Buborékok a támasztóanyagban | Nedvesség | Alaposan szárítsa a filamentet |
| Szálhúzás anyagok között | Elégtelen visszahúzás | Növelje a visszahúzást 1–2 mm-rel |
| Rossz felület a támasz oldalán | Kevés interfész réteg | Növelje 3–4 interfész rétegre |

:::tip Kezdje egyszerűen
Első nyomtatásához támasztóanyaggal: használjon PLA + PVA-t, egyszerű modellt nyilvánvaló túlnyúlással (45°+), és a Bambu Studio alapértelmezett beállításait. Optimalizáljon a tapasztalatok gyarapodásával.
:::
