---
sidebar_position: 4
title: A megfelelő építőlemez kiválasztása
description: A Bambu Labs építőlemezek áttekintése és hogy melyik illik legjobban a filamentedhez
---

# A megfelelő építőlemez kiválasztása

A megfelelő építőlemez elengedhetetlen a jó tapadáshoz és a nyomtatás egyszerű eltávolításához. Rossz kombináció esetén vagy gyenge a tapadás, vagy a nyomtatás annyira rátapad a lemezre, hogy károsítja azt.

## Áttekintő táblázat

| Filament | Ajánlott lemez | Ragasztóstift | Lemez hőmérséklete |
|----------|---------------|----------|-----------------|
| PLA | Cool Plate / Textured PEI | Nem / Igen | 35–45°C |
| PETG | Textured PEI | **Igen (kötelező)** | 70°C |
| ABS | Engineering Plate / High Temp | Igen | 90–110°C |
| ASA | Engineering Plate / High Temp | Igen | 90–110°C |
| TPU | Textured PEI | Nem | 35–45°C |
| PA (Nylon) | Engineering Plate | Igen | 90°C |
| PC | High Temp Plate | Igen | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Igen | 45–90°C |
| PVA | Cool Plate | Nem | 35°C |

## Lemezek leírása

### Cool Plate (Sima PEI)
**Legjobb ehhez:** PLA, PVA
**Felület:** Sima, sima alsó felületet ad a nyomatnak
**Eltávolítás:** Hajlítsd meg a lemezt enyhén, vagy várd meg, amíg lehűl — a nyomtatás magától leválik

Ne használj Cool Plate-et PETG-gel — **túl jól** rátapad, és lehasíthatja a bevonatot a lemezről.

### Textured PEI (Mintázott)
**Legjobb ehhez:** PETG, TPU, PLA (érdes felületet ad)
**Felület:** Mintázott, érdes és esztétikus alsó felületet ad
**Eltávolítás:** Várd meg, amíg szobahőmérsékletre hűl — magától leválik

:::warning PETG ragasztóstiftet igényel a Textured PEI-en
Ragasztóstift nélkül a PETG olyan erősen tapad a Textured PEI-hoz, hogy felszakíthatja a bevonást az eltávolításkor. Mindig vigyen fel egy vékony ragasztóstift réteget (Bambu ragasztóstift vagy Elmer's Disappearing Purple Glue) a teljes felületre.
:::

### Engineering Plate
**Legjobb ehhez:** ABS, ASA, PA, PLA-CF, PETG-CF
**Felület:** Matt PEI felülettel rendelkezik, alacsonyabb tapadással, mint a Textured PEI
**Eltávolítás:** Könnyen eltávolítható lehűlés után. Használj ragasztóstiftet ABS/ASA esetén

### High Temp Plate
**Legjobb ehhez:** PC, PA-CF, ABS magas hőmérsékleten
**Felület:** 120°C-ig elviseli a lemezhőmérsékletet deformáció nélkül
**Eltávolítás:** Hűtsd szobahőmérsékletre

## Gyakori hibák

### PETG sima Cool Plate-en (ragasztóstift nélkül)
**Probléma:** A PETG annyira rátapad, hogy a nyomtatás nem távolítható el sérülés nélkül
**Megoldás:** Mindig használj Textured PEI-t ragasztóstifttel, vagy Engineering Plate-et

### ABS Cool Plate-en
**Probléma:** Vetemedés — a sarkok felemelkednek nyomtatás közben
**Megoldás:** Engineering Plate + ragasztóstift + kamrahőmérséklet emelése (zárd be az elülső ajtót)

### PLA High Temp Plate-en
**Probléma:** A túl magas lemezhőmérséklet túlzottan jó tapadást eredményez, nehéz eltávolítani
**Megoldás:** Cool Plate vagy Textured PEI PLA-hoz

### Túl sok ragasztóstift
**Probléma:** A vastag ragasztóstift elefántlábat okoz (szétterülő első réteg)
**Megoldás:** Egy vékony réteg — a ragasztóstift alig látszódjon

## Lemez cseréje

1. **Hagyd lehűlni a lemezt** szobahőmérsékletre (vagy használj kesztyűt — a lemez forró lehet)
2. Emeld fel a lemezt az elejétől, és húzd ki
3. Helyezd be az új lemezt — a mágnes a helyén tartja
4. **Futtass automatikus kalibrálást** (Flow Rate és Bed Leveling) lemezcsere után a Bambu Studioban, vagy a dashboardon keresztül a **Vezérlés → Kalibrálás** menüpontban

:::info Ne felejtsd el a kalibrálást csere után
A lemezek kissé eltérő vastagságúak. Kalibrálás nélkül az első réteg lehet, hogy túl messze lesz, vagy beleütközik a lemezbe.
:::

## Lemezek karbantartása

### Tisztítás (minden 2–5 nyomtatás után)
- Töröld meg IPA-val (izopropanol 70–99%) és szálmentes törlőpapírral
- Kerüld a felület megérintését csupasz kézzel — a bőrből származó zsír csökkenti a tapadást
- Textured PEI esetén: mosd meg langyos vízzel és enyhe mosogatószerrel sok nyomtatás után

### Ragasztóstift maradványainak eltávolítása
- Melegítsd fel a lemezt 60°C-ra
- Töröld meg nedves ronggyal
- Fejezd be IPA-törlővel

### Csere
Cseréld ki a lemezt, ha látod:
- Látható gödrök vagy nyomok a nyomtatások eltávolítása után
- Következetesen rossz tapadás még tisztítás után is
- Buborékok vagy foltok a bevonatban

A Bambu lemezek általában 200–500 nyomtatásig tartanak, a filament típusától és a kezeléstől függően.

:::tip Tárold helyesen a lemezeket
Tárold a nem használt lemezeket az eredeti csomagolásban, vagy állva egy tartóban — ne helyezz rájuk nehéz tárgyakat. A deformált lemezek egyenetlen első réteget eredményeznek.
:::
