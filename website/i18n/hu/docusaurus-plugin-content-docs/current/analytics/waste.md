---
sidebar_position: 5
title: Hulladékkövetés
description: Kövesd az AMS-purge-ból és tartóanyagból származó filamenthulladékot, számítsd ki a költségeket, és optimalizáld a hatékonyságot
---

# Hulladékkövetés

A hulladékkövetés teljes betekintést nyújt abba, hogy mennyi filament vész el nyomtatás közben — AMS-purge, anyagváltáskor történő öblítés és tartóanyag — és mennyibe kerül.

Navigálj ide: **https://localhost:3443/#waste**

## Hulladékkategóriák

A 3DPrintForge háromféle hulladékot különböztet meg:

| Kategória | Forrás | Tipikus mennyiség |
|---|---|---|
| **AMS-purge** | Színváltás AMS-ben többszínű nyomtatás közben | 5–30 g váltásonként |
| **Anyagváltásos öblítés** | Tisztítás különböző anyagok közötti váltásnál | 10–50 g váltásonként |
| **Tartóanyag** | Nyomtatás után eltávolított tartószerkezetek | Változó |

## AMS-purge követés

Az AMS-purge adatok közvetlenül az MQTT telemetriából és a G-kód elemzéséből érkeznek:

- **Gramm színváltásonként** — a G-kód purge blokkjából kiszámítva
- **Színváltások száma** — a nyomtatásnapló alapján megszámlálva
- **Összes purge-felhasználás** — a kiválasztott időszak összege

:::tip Purge csökkentése
A Bambu Studio purge-kötet beállításokat tartalmaz színkombinációnként. Csökkentsd a purge kötetét alacsony színkülönbségű színpároknál (pl. fehér → világosszürke) a filament megspórolásához.
:::

## Hatékonyságszámítás

A hatékonyság kiszámítása:

```
Hatékonyság % = (modellanyag / összes felhasználás) × 100

Összes felhasználás = modellanyag + purge + tartóanyag
```

**Példa:**
- Modell: 45 g
- Purge: 12 g
- Tartó: 8 g
- Összesen: 65 g
- **Hatékonyság: 69%**

A hatékonyság trenddiagramként jelenik meg az idők folyamán, hogy lásd, fejlődsz-e.

## Hulladékköltség

A rögzített filamentárak alapján a következők számítódnak ki:

| Tétel | Számítás |
|---|---|
| Purge-költség | Purge-gramm × ár/gramm színenként |
| Tartóköltség | Tartó-gramm × ár/gramm |
| **Összes hulladékköltség** | A fentiek összege |
| **Költség sikeres nyomtatásonként** | Hulladékköltség / nyomtatások száma |

## Hulladék nyomtatónként és anyagonként

Szűrd a nézetet a következők szerint:

- **Nyomtató** — melyik nyomtató termeli a legtöbb hulladékot
- **Anyag** — hulladék filamenttípusonként
- **Időszak** — nap, hét, hónap, év

A táblázatos nézet rangsorolt listát mutat a legtöbb hulladékkal az elején, beleértve a becsült költséget.

## Optimalizálási tippek

A rendszer automatikusan javaslatokat generál a hulladék csökkentésére:

- **Megfordított színsorrend** — Ha az A→B szín többet purge-öl, mint B→A, a rendszer javasolja a sorrend megfordítását
- **Színváltó rétegek összevonása** — Az azonos színű rétegek csoportosítása a váltások minimalizálásához
- **Tartószerkezet optimalizálása** — Becsüli a tartóredukciót a tájolás megváltoztatásával

:::info Pontosság
A purge számítások a G-kódból becsültek. A tényleges hulladék 10–20%-kal eltérhet a nyomtató viselkedése miatt.
:::

## Exportálás és jelentéskészítés

1. Kattints a **Hulladékadatok exportálása** gombra
2. Válassz időszakot és formátumot (CSV / PDF)
3. A hulladékadatok projektjelentésekbe és számlákba is beilleszthetők költségtételként

Lásd még a [Filamentelemzés](./filamentanalytics) oldalt az összesített felhasználási áttekintéshez.
