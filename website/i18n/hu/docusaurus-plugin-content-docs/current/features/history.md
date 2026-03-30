---
sidebar_position: 3
title: Nyomtatási előzmények
description: Teljes napló az összes nyomtatásról statisztikával, filamentkövetéssel és exportálással
---

# Nyomtatási előzmények

A nyomtatási előzmények teljes naplót nyújtanak a dashboarddal elvégzett összes nyomtatásról, beleértve a statisztikákat, filamentfelhasználást és a modellforrásokhivatkozásokat.

## Előzménytáblázat

A táblázat az összes nyomtatást mutatja:

| Oszlop | Leírás |
|--------|---------|
| Dátum/idő | Kezdési időpont |
| Modell neve | Fájlnév vagy MakerWorld cím |
| Nyomtató | Melyik nyomtatót használták |
| Időtartam | Összes nyomtatási idő |
| Filament | Anyag és felhasznált gramm |
| Rétegek | Rétegek száma és súly (g) |
| Állapot | Befejezett, megszakított, sikertelen |
| Kép | Bélyegkép (cloud integráció esetén) |

## Keresés és szűrés

Használd a keresőmezőt és szűrőket a nyomtatások megtalálásához:

- Szabad szöveges keresés modellnév szerint
- Szűrés nyomtató, anyag, állapot, dátum szerint
- Rendezés az összes oszlop szerint

## Modellforrás-linkek

Ha a nyomtatást MakerWorldről indítottuk, közvetlen hivatkozás jelenik meg a modell oldalára. Kattints a modell nevére a MakerWorld új lapon való megnyitásához.

:::info Bambu Cloud
Modelllinkek és bélyegképek Bambu Cloud integrációt igényelnek. Lásd [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Filamentkövetés

Minden nyomtatáshoz rögzítve van:

- **Anyag** — PLA, PETG, ABS stb.
- **Felhasznált gramm** — becsült felhasználás
- **Orsó** — melyik orsót használták (ha regisztrálva van a raktárban)
- **Szín** — a szín hex kódja

Ez pontos képet ad az idők folyamán történt filamentfelhasználásról, és segít a beszerzés tervezésében.

## Statisztika

Az **Előzmények → Statisztika** menüpont alatt összesített adatokat találsz:

- **Nyomtatások teljes száma** — és sikerességi arány
- **Összes nyomtatási idő** — óra és nap
- **Filamentfelhasználás** — gramm és km anyagonként
- **Nyomtatás naponta** — görgetős grafikon
- **Legtöbbet használt anyagok** — kördiagram
- **Nyomtatás hosszának eloszlása** — hisztogram

A statisztika szűrhető időszak szerint (7 nap, 30 nap, 90 nap, 1 év, összes).

## Exportálás

### CSV export
Az egész előzmény vagy szűrt eredmények exportálása:
**Előzmények → Export → CSV letöltése**

A CSV fájlok minden oszlopot tartalmaznak, és megnyithatók az Excelben, LibreOffice Calcban, vagy más eszközökbe importálhatók.

### Automatikus mentés
Az előzmények a SQLite adatbázis részei, amelyek automatikusan mentésre kerülnek frissítéseknél. Manuális mentés a **Beállítások → Mentés** menüponton.

## Szerkesztés

Nyomtatásnapló-bejegyzések utólag szerkeszthetők:

- Modellnév javítása
- Megjegyzések hozzáadása
- Filamentfelhasználás javítása
- Hibásan rögzített nyomtatások törlése

Jobb klikk egy soron és válaszd a **Szerkesztés** lehetőséget, vagy kattints a ceruza ikonra.
