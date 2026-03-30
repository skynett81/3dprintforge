---
sidebar_position: 2
title: Fájlkönyvtár
description: 3D-modellek és G-kód-fájlok feltöltése és kezelése, G-kód elemzése, valamint MakerWorld és Printables integráció
---

# Fájlkönyvtár

A fájlkönyvtár egy központi hely az összes 3D-modell és G-kód-fájl tárolásához és kezeléséhez — automatikus G-kód-elemzéssel és MakerWorld/Printables integrációval.

Menj ide: **https://localhost:3443/#library**

## Modellek feltöltése

### Egyszerű feltöltés

1. Menj a **Fájlkönyvtár** menüpontra
2. Kattints a **Feltöltés** gombra, vagy húzd a fájlokat a feltöltési területre
3. Támogatott formátumok: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. A fájl feltöltés után automatikusan elemzésre kerül

:::info Tárolási mappa
A fájlok a **Beállítások → Fájlkönyvtár → Tárolási mappa** menüpontban konfigurált mappában kerülnek tárolásra. Alapértelmezett: `./data/library/`
:::

### Kötegelt feltöltés

Húzz be egy egész mappát az összes támogatott fájl egyszerre történő feltöltéséhez. A fájlok a háttérben kerülnek feldolgozásra, és értesítést kapsz, amikor minden kész.

## G-kód-elemzés

Feltöltés után a `.gcode`- és `.bgcode`-fájlok automatikusan elemzésre kerülnek:

| Metrika | Leírás |
|---|---|
| Becsült nyomtatási idő | G-kód-parancsokból számított idő |
| Filamentfelhasználás | Gramm és méter anyagonként/színenként |
| Rétegszámláló | Összes réteg száma |
| Rétegvastagság | Regisztrált rétegvastagság |
| Anyagok | Észlelt anyagok (PLA, PETG stb.) |
| Kitöltési százalék | Ha elérhető a metaadatokban |
| Tartóanyag | Becsült tartósúly |
| Nyomtatómodell | Célnyomtató a metaadatokból |

Az elemzési adatok megjelennek a fájlkártyán, és a [Költségkalkulátor](../analytics/costestimator) is felhasználja azokat.

## Fájlkártyák és metaadatok

Minden fájlkártya mutatja:
- **Fájlnevet** és formátumot
- **Feltöltés dátumát**
- **Előnézeti képet** (`.3mf`-ből vagy generálva)
- **Elemzett nyomtatási idő** és filamentfelhasználás
- **Címkék** és kategória
- **Kapcsolódó nyomtatások** — hányszor lett kinyomtatva

Kattints egy kártyára a teljes metaadatokkal és előzményekkel rendelkező részletes nézet megnyitásához.

## Szervezés

### Címkék

Adj hozzá címkéket a könnyű kereséshez:
1. Kattints a fájlra → **Metaadatok szerkesztése**
2. Add meg a címkéket (vesszővel elválasztva): `benchy, teszt, PLA, kalibrálás`
3. Keress a könyvtárban címkeszűrővel

### Kategóriák

Szervezd fájlokat kategóriákba:
- Kattints az **Új kategória** gombra az oldalpanelen
- Húzd a fájlokat a kategóriába
- A kategóriák egymásba ágyazhatók (alkategóriák támogatottak)

## Csatolás a MakerWorldhöz

1. Menj a **Beállítások → Integrációk → MakerWorld** menüpontra
2. Jelentkezz be a Bambu Lab-fiókodddal
3. Vissza a könyvtárban: kattints egy fájlra → **Csatolás a MakerWorldhöz**
4. Keresd meg a modellt a MakerWorldön, és válaszd ki a megfelelő találatot
5. A metaadatok (tervező, licenc, értékelés) importálódnak a MakerWorldről

A csatolás a tervező nevét és az eredeti URL-t mutatja a fájlkártyán.

## Csatolás a Printableshöz

1. Menj a **Beállítások → Integrációk → Printables** menüpontra
2. Illeszd be a Printables API-kulcsodat
3. Csatold a fájlokat Printables-modellekhez ugyanúgy, mint a MakerWorldnél

## Küldés nyomtatóra

A fájlkönyvtárból közvetlenül küldhetsz a nyomtatóra:

1. Kattints a fájlra → **Küldés nyomtatóra**
2. Válaszd ki a célnyomtatót
3. Válaszd ki az AMS-helyet (többszínű nyomtatásokhoz)
4. Kattints a **Nyomtatás indítása** vagy a **Sorba helyezés** gombra

:::warning Közvetlen küldés
A közvetlen küldés azonnal elindítja a nyomtatást, a Bambu Studio megerősítése nélkül. Győződj meg arról, hogy a nyomtató készen áll.
:::
