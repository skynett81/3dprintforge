---
sidebar_position: 6
title: Nyomtatás-összehasonlítás
description: Hasonlíts össze két nyomtatást egymás mellett részletes mérőszámokkal, grafikonokkal és galériafotókkal A/B elemzéshez
---

# Nyomtatás-összehasonlítás

A nyomtatás-összehasonlítás lehetővé teszi két nyomtatás egymás melletti elemzését — hasznos beállítások, anyagok, nyomtatók vagy ugyanazon modell verzióinak összehasonlításához.

Navigálj ide: **https://localhost:3443/#comparison**

## Összehasonlítandó nyomtatások kiválasztása

1. Navigálj a **Nyomtatás-összehasonlítás** oldalra
2. Kattints az **A nyomtatás kiválasztása** gombra, és keress az előzményekben
3. Kattints a **B nyomtatás kiválasztása** gombra, és keress az előzményekben
4. Kattints az **Összehasonlítás** gombra az összehasonlítási nézet betöltéséhez

:::tip Gyorsabb hozzáférés
Az **Előzmények** oldalon jobb gombbal kattinthatsz egy nyomtatásra, és kiválaszthatod az **Beállítás A nyomtatásként** vagy az **Összehasonlítás...**  lehetőséget az összehasonlítási módba való közvetlen ugráshoz.
:::

## Mérőszám-összehasonlítás

A mérőszámok két oszlopban jelennek meg (A és B), jelölve, melyik a jobb:

| Mérőszám | Leírás |
|---|---|
| Siker | Befejezett / Megszakított / Sikertelen |
| Időtartam | Összes nyomtatási idő |
| Filamentfelhasználás | Gramm összesen és színenként |
| Filamenthatékonyság | Modell-% az összes felhasználásból |
| Max. fúvóka-hőmérséklet | Legmagasabb rögzített fúvóka-hőmérséklet |
| Max. ágy-hőmérséklet | Legmagasabb rögzített ágy-hőmérséklet |
| Sebesség-beállítás | Csendes / Normál / Sport / Turbo |
| AMS-váltások | Színváltások száma |
| HMS-hibák | Nyomtatás közbeni esetleges hibák |
| Nyomtató | Melyik nyomtatót használták |

A legjobb értékű cellák zöld háttérrel jelennek meg.

## Hőmérséklet-grafikonok

Két hőmérséklet-grafikon jelenik meg egymás mellett (vagy egymásra fedve):

- **Külön nézet** — A grafikon balra, B grafikon jobbra
- **Fedett nézet** — mindkettő ugyanazon a grafikonon különböző színekkel

Használd a fedett nézetet a hőmérséklet-stabilitás és a felmelegítési sebesség közvetlen összehasonlításához.

## Galériafotók

Ha mindkét nyomtatáshoz vannak mérföldkő-képernyőképek, rácsban jelennek meg:

| A nyomtatás | B nyomtatás |
|---|---|
| A 25%-os kép | B 25%-os kép |
| A 50%-os kép | B 50%-os kép |
| A 75%-os kép | B 75%-os kép |
| A 100%-os kép | B 100%-os kép |

Kattints egy képre a teljes képernyős előnézet megnyitásához csúszó animációval.

## Időköz-összehasonlítás

Ha mindkét nyomtatáshoz van időköz-felvétel, a videók egymás mellett jelennek meg:

- Szinkronizált lejátszás — mindkettő egyszerre indul és áll meg
- Független lejátszás — minden videót külön vezérelhetsz

## Beállítási különbségek

A rendszer automatikusan kiemeli a nyomtatási beállítások különbségeit (G-kód metaadatokból):

- Eltérő rétegvastagságok
- Eltérő kitöltési minták vagy százalékok
- Eltérő támasz-beállítások
- Eltérő sebességprofilok

A különbségek narancssárga jelöléssel jelennek meg a beállítástáblázatban.

## Összehasonlítás mentése

1. Kattints az **Összehasonlítás mentése** gombra
2. Adj nevet az összehasonlításnak (pl. „PLA vs PETG - Benchy")
3. Az összehasonlítás mentésre kerül, és elérhető az **Előzmények → Összehasonlítások** menüponton keresztül

## Exportálás

1. Kattints az **Exportálás** gombra
2. Válassz **PDF** formátumot az összes mérőszámot és képet tartalmazó jelentéshez
3. A jelentés projekthez csatolható az anyagválasztás dokumentálásához
