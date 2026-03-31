---
sidebar_position: 5
title: Nyomtatási sor
description: Tervezd meg és automatizáld a nyomtatásokat prioritásos sorral, automatikus kiadással és eltolt indítással
---

# Nyomtatási sor

A nyomtatási sor lehetővé teszi nyomtatások előzetes tervezését, és automatikusan elküldi azokat az elérhető nyomtatókra, amikor szabaddá válnak.

Navigálj ide: **https://localhost:3443/#queue**

## Sor létrehozása

1. Navigálj a **Nyomtatási sor** menüpontra a navigációs menüben
2. Kattints az **Új feladat** (+ ikon) gombra
3. Töltsd ki:
   - **Fájlnév** — töltsd fel a `.3mf` vagy `.gcode` fájlt
   - **Célnyomtató** — válassz konkrét nyomtatót vagy **Automatikus** lehetőséget
   - **Prioritás** — Alacsony / Normál / Magas / Kritikus
   - **Tervezett indítás** — most vagy egy meghatározott dátum/időpont
4. Kattints a **Sorba adás** gombra

:::tip Húzd és ejtsd
Fájlokat közvetlenül a fájlböngészőből húzhatsz a sor oldalára a gyors hozzáadáshoz.
:::

## Fájlok hozzáadása

### Fájl feltöltése

1. Kattints a **Feltöltés** gombra, vagy húzz egy fájlt a feltöltési mezőre
2. Támogatott formátumok: `.3mf`, `.gcode`, `.bgcode`
3. A fájl a fájlkönyvtárba kerül, és a sorfeladathoz kapcsolódik

### A fájlkönyvtárból

1. Navigálj a **Fájlkönyvtárhoz**, és keresd meg a fájlt
2. Kattints a **Sorba adás** gombra a fájlnál
3. A feladat alapértelmezett beállításokkal jön létre — szerkeszd szükség esetén

### Az előzményekből

1. Nyiss meg egy korábbi nyomtatást az **Előzmények** oldalon
2. Kattints a **Nyomtatás újra** gombra
3. A feladat ugyanazokkal a beállításokkal kerül hozzáadásra, mint az előző alkalommal

## Prioritás

A sor prioritási sorrendben dolgozza fel a feladatokat:

| Prioritás | Szín | Leírás |
|---|---|---|
| Kritikus | Piros | Az első szabad nyomtatóra küldve más feladatoktól függetlenül |
| Magas | Narancssárga | Normál és alacsony feladatok előtt |
| Normál | Kék | Alapértelmezett sorrend (FIFO) |
| Alacsony | Szürke | Csak akkor küldve, ha nincs magasabb prioritású feladat várakozásban |

Húzd és ejtsd a feladatokat a sorban a sorrend manuális megváltoztatásához ugyanazon a prioritási szinten belül.

## Automatikus kiadás

Ha az **Automatikus kiadás** aktiválva van, a 3DPrintForge figyeli az összes nyomtatót, és automatikusan elküldi a következő feladatot:

1. Navigálj a **Beállítások → Sor** menüpontra
2. Kapcsold be az **Automatikus kiadás** opciót
3. Válassz **Kiadási stratégiát**:
   - **Első szabad** — az első szabaddá váló nyomtatóra küld
   - **Legkevésbé használt** — a mai legtöbb nyomtatással rendelkező nyomtatót preferálja
   - **Körözős** — egyenletesen rotál az összes nyomtató között

:::warning Megerősítés
Aktiváld a **Megerősítés szükséges** opciót a beállításokban, ha minden kiadást manuálisan szeretnél jóváhagyni a fájl elküldése előtt.
:::

## Eltolt indítás

Az eltolt indítás hasznos, hogy elkerüld, hogy az összes nyomtató egyszerre induljon és fejezzen be:

1. Az **Új feladat** párbeszédablakban, bontsd ki a **Speciális beállítások** részt
2. Aktiváld az **Eltolt indítás** opciót
3. Állítsd be a **Késleltetés nyomtatók között** értékét (pl. 30 perc)
4. A rendszer automatikusan elosztja az indítási időpontokat

**Példa:** 4 azonos feladat 30 perces késleltetéssel 08:00-kor, 08:30-kor, 09:00-kor és 09:30-kor indul.

## Sorstatus és nyomon követés

A soráttekintés az összes feladatot állapottal mutatja:

| Állapot | Leírás |
|---|---|
| Várakozó | A feladat sorban van és nyomtatóra vár |
| Ütemezett | Jövőbeli tervezett indítási időpont van beállítva |
| Küldés | Átkerülés a nyomtatóra |
| Nyomtat | A kiválasztott nyomtatón folyamatban |
| Befejezett | Kész — az előzményekhez kapcsolódik |
| Sikertelen | Hiba a küldésnél vagy nyomtatás közben |
| Megszakított | Manuálisan megszakítva |

:::info Értesítések
Aktiválj értesítéseket a soreshemények számára a **Beállítások → Értesítések → Sor** menüponton, hogy értesülj, amikor egy feladat elindul, befejez vagy meghiúsul. Lásd [Értesítések](./notifications).
:::
