---
sidebar_position: 3
title: Filamentelemzés
description: Részletes elemzés a filamentfelhasználásról, költségekről, előrejelzésekről, felhasználási arányokról és hulladékról anyagonként és szállítónként
---

# Filamentelemzés

A filamentelemzés teljes betekintést nyújt a filamentfelhasználásodba — mit használsz, mennyibe kerül, és mit takaríthatsz meg.

Navigálj ide: **https://localhost:3443/#filament-analytics**

## Felhasználási áttekintés

A tetején a kiválasztott időszak összefoglalója látható:

- **Összes felhasználás** — gramm és méter minden anyagra
- **Becsült költség** — az orsónként rögzített ár alapján
- **Legtöbbet használt anyag** — típus és szállító
- **Újrahasznosítási arány** — a tényleges modellben lévő filament aránya vs. tartó/purge

### Felhasználás anyagonként

Kördiagram és táblázat mutatja az anyagok közötti megoszlást:

| Oszlop | Leírás |
|---|---|
| Anyag | PLA, PETG, ABS, PA stb. |
| Szállító | Bambu Lab, PolyMaker, Prusament stb. |
| Felhasznált gramm | Összsúly |
| Méter | Becsült hossz |
| Költség | Gramm × ár grammönként |
| Nyomtatások | Az ezzel az anyaggal készült nyomtatások száma |

Kattints egy sorra az egyedi orsó szintjéig való lehatoláshoz.

## Felhasználási arányok

A felhasználási arány az időegységenkénti átlagos filamentfelhasználást mutatja:

- **Gramm per óra** — aktív nyomtatás közben
- **Gramm per hét** — a nyomtató leállási idejét is beleértve
- **Gramm per nyomtatás** — átlag nyomtatásonként

Ezeket a jövőbeli igények előrejelzéseinek kiszámításához használják.

:::tip Beszerzéstervezés
Használd a felhasználási arányt az orsókészlet tervezéséhez. A rendszer automatikusan figyelmeztet, ha a becsült készlet 14 napon belül elfogy (konfigurálható).
:::

## Költség-előrejelzés

A múltbeli felhasználási arány alapján a következők számítódnak ki:

- **Becsült felhasználás a következő 30 napban** (gramm anyagonként)
- **Becsült költség a következő 30 napban**
- **Ajánlott készletmennyiség** (elegendő 30 / 60 / 90 napos működéshez)

Az előrejelzés figyelembe veszi a szezonális változásokat, ha legalább egy éves adattal rendelkezel.

## Hulladék és hatékonyság

A teljes dokumentációért lásd az [Hulladékkövetés](./waste) oldalt. A filamentelemzés összefoglalót mutat:

- **AMS-purge** — gramm és az összes felhasználás aránya
- **Tartóanyag** — gramm és arány
- **Tényleges modellanyag** — fennmaradó arány (hatékonyság %)
- **Becsült hulladékköltség** — mennyibe kerül a hulladék

## Orsónapló

Minden orsó (aktív és üres) naplózva van:

| Mező | Leírás |
|---|---|
| Orsónév | Anyagnév és szín |
| Eredeti súly | Indításkor rögzített súly |
| Fennmaradó súly | Kiszámított fennmaradó mennyiség |
| Felhasznált | Összes felhasznált gramm |
| Utoljára használt | Utolsó nyomtatás dátuma |
| Állapot | Aktív / Üres / Tárolt |

## Árregisztráció

A pontos költségelemzéshez regisztrálj árakat orsónként:

1. Navigálj a **Filamentraktár** oldalra
2. Kattints egy orsóra → **Szerkesztés**
3. Töltsd ki a **Vételár** és az **Vásárláskori súly** mezőket
4. A rendszer automatikusan kiszámítja a grammankénti árat

Az ár nélküli orsók a **standard grammankénti árat** használják (beállítható az **Beállítások → Filament → Alapértelmezett ár** menüponton).

## Exportálás

1. Kattints a **Filamentadatok exportálása** gombra
2. Válassz időszakot és formátumot (CSV / PDF)
3. A CSV nyomtatásonként egy sort tartalmaz grammal, költséggel és anyaggal
