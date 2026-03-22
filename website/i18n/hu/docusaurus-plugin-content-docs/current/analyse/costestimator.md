---
sidebar_position: 4
title: Költségkalkulátor
description: Tölts fel 3MF- vagy GCode-fájlt, és számítsd ki a filament, áram és gépkopás teljes költségét nyomtatás előtt
---

# Költségkalkulátor

A költségkalkulátor lehetővé teszi a nyomtatás teljes költségének becslését, mielőtt a nyomtatóra küldenéd — filamentfelhasználás, áramár és gépkopás alapján.

Navigálj ide: **https://localhost:3443/#cost-estimator**

## Fájl feltöltése

1. Navigálj a **Költségkalkulátor** oldalra
2. Húzd és ejtsd a fájlt a feltöltési mezőbe, vagy kattints a **Fájl kiválasztása** gombra
3. Támogatott formátumok: `.3mf`, `.gcode`, `.bgcode`
4. Kattints az **Elemzés** gombra

:::info Elemzés
A rendszer elemzi a G-kódot a filamentfelhasználás, a becsült nyomtatási idő és az anyagprofil kinyeréséhez. Ez általában 2–10 másodpercet vesz igénybe.
:::

## Filamentszámítás

Az elemzés után a következők jelennek meg:

| Mező | Érték (példa) |
|---|---|
| Becsült filament | 47,3 g |
| Anyag (fájlból) | PLA |
| Ár grammönként | 0,025 Ft (a filamentraktárból) |
| **Filamentköltség** | **1,18 Ft** |

Válts anyagot a legördülő listából a különböző filamenttípusok vagy szállítók költségeinek összehasonlításához.

:::tip Anyag-felülírás
Ha a G-kód nem tartalmaz anyaginformációt, manuálisan válassz anyagot a listából. Az ár automatikusan lekérhető a filamentraktárból.
:::

## Áramköltség-számítás

Az áramköltség kiszámítása a következők alapján történik:

- **Becsült nyomtatási idő** — G-kód elemzéséből
- **Nyomtató teljesítménye** — nyomtatómodell szerint konfigurálva (W)
- **Áramár** — fix ár (Ft/kWh) vagy élő ár a Tibber/Nordpool-tól

| Mező | Érték (példa) |
|---|---|
| Becsült nyomtatási idő | 3 óra 22 perc |
| Nyomtató teljesítménye | 350 W (X1C) |
| Becsült fogyasztás | 1,17 kWh |
| Áramár | 1,85 Ft/kWh |
| **Áramköltség** | **2,16 Ft** |

Aktiváld a Tibber- vagy Nordpool-integrációt, hogy a kívánt kezdési időpont alapján tervezett óránkénti árakat használj.

## Gépkopás

A kopási költség becslése a következők alapján történik:

- Nyomtatási idő × óránkénti kopási költség nyomtatómodell szerint
- Extra kopás abrazív anyagoknál (CF, GF stb.)

| Mező | Érték (példa) |
|---|---|
| Nyomtatási idő | 3 óra 22 perc |
| Óránkénti kopási költség | 0,80 Ft/óra |
| **Kopási költség** | **2,69 Ft** |

Az óránkénti költség az alkatrészárakból és a várható élettartamból számítódik (lásd [Kopásbecslés](../overvaaking/wearprediction)).

## Végösszeg

| Költségelem | Összeg |
|---|---|
| Filament | 1,18 Ft |
| Áram | 2,16 Ft |
| Gépkopás | 2,69 Ft |
| **Összesen** | **6,03 Ft** |
| + Felár (30%) | 1,81 Ft |
| **Értékesítési ár** | **7,84 Ft** |

Módosítsd a felárat a százalékos mezőben az ügyfélnek ajánlott ár kiszámításához.

## Becslés mentése

Kattints a **Becslés mentése** gombra az elemzés projekthez csatolásához:

1. Válassz meglévő projektet, vagy hozz létre újat
2. A becslés mentésre kerül, és számlaként alapul használható
3. A tényleges költség (nyomtatás után) automatikusan összehasonlításra kerül a becsléssel

## Kötegelt számítás

Tölts fel egyszerre több fájlt egy teljes készlet teljes költségének kiszámításához:

1. Kattints a **Kötegelt mód** gombra
2. Tölts fel minden `.3mf`/`.gcode`-fájlt
3. A rendszer egyenként és összesítve is kiszámítja a költséget
4. Exportáld az összefoglalót PDF- vagy CSV-formátumban
