---
sidebar_position: 1
title: Statisztika
description: Sikerességi arány, filamentfelhasználás, trendek és kulcsmutatók az összes Bambu Lab nyomtatóhoz az idők során
---

# Statisztika

A statisztika oldal teljes áttekintést nyújt a nyomtatási tevékenységedről kulcsmutatókkal, trendekkel és filamentfelhasználással tetszőleges időszakra vonatkozóan.

Navigálj ide: **https://localhost:3443/#statistics**

## Kulcsmutatók

Az oldal tetején négy KPI-kártya jelenik meg:

| Kulcsmutató | Leírás |
|---|---|
| **Sikerességi arány** | Sikeres nyomtatások aránya az összes nyomtatáshoz képest |
| **Összes filament** | A kiválasztott időszakban felhasznált gramm |
| **Összes nyomtatási óra** | Összesített nyomtatási idő |
| **Átlagos nyomtatási idő** | Nyomtatásonkénti mediánidőtartam |

Minden kulcsmutató az előző időszakhoz képesti változást mutatja (↑ fel / ↓ le) százalékos eltérésként.

## Sikerességi arány

A sikerességi arány nyomtatónként és összesítve számítódik:

- **Sikeres** — nyomtatás megszakítás nélkül befejezve
- **Megszakított** — felhasználó által manuálisan leállítva
- **Sikertelen** — Print Guard, HMS-hiba vagy hardverhiba által leállítva

Kattints a sikerességi arány diagramjára a sikertelen nyomtatások és azok okainak megtekintéséhez.

:::tip Sikerességi arány javítása
Használd a [Hibamintázat-elemzés](../monitoring/erroranalysis) funkciót a sikertelen nyomtatások okainak azonosításához és kijavításához.
:::

## Trendek

A trendnézet az időbeli fejlődést vonaldiagramként mutatja:

1. Válassz **Időszakot**: Utolsó 7 / 30 / 90 / 365 nap
2. Válassz **Csoportosítást**: Nap / Hét / Hónap
3. Válassz **Mérőszámot**: Nyomtatások száma / Óra / Gramm / Sikerességi arány
4. Kattints az **Összehasonlítás** gombra két mérőszám egymásra fedéséhez

A grafikon nagyítást (görgetés) és panorámázást (kattintás és húzás) is támogat.

## Filamentfelhasználás

A filamentfelhasználás a következőképpen jelenik meg:

- **Oszlopdiagram** — napi/heti/havi felhasználás
- **Kördiagram** — anyagok közötti megoszlás (PLA, PETG, ABS stb.)
- **Táblázat** — részletes lista anyagonként összes grammal, méterrel és költséggel

### Felhasználás nyomtatónként

Használd a felső többszörös kiválasztós szűrőt a következőkhöz:
- Csak egy nyomtató megjelenítése
- Két nyomtató egymás melletti összehasonlítása
- Az összes nyomtató összesített összegének megtekintése

## Tevékenységnaptár

Tekintsd meg a kompakt GitHub-stílusú hőtérképet közvetlenül a statisztika oldalon (egyszerűsített nézet), vagy navigálj a teljes [Tevékenységnaptárhoz](./calendar) részletesebb nézetért.

## Exportálás

1. Kattints a **Statisztika exportálása** gombra
2. Válassz dátumtartományt és a kívánt mérőszámokat
3. Válassz formátumot: **CSV** (nyers adat), **PDF** (jelentés) vagy **JSON**
4. A fájl letöltésre kerül

A CSV export kompatibilis az Excellel és a Google Táblázatokkal a további elemzéshez.

## Összehasonlítás az előző időszakkal

Aktiváld az **Előző időszak megjelenítése** opciót a grafikonok megfelelő előző időszakkal való átfedéséhez:

- Utolsó 30 nap vs. az előző 30 nap
- Aktuális hónap vs. előző hónap
- Aktuális év vs. előző év

Ez megkönnyíti annak megállapítását, hogy többet vagy kevesebbet nyomtatsz-e, mint korábban, és hogy a sikerességi arány javul-e.
