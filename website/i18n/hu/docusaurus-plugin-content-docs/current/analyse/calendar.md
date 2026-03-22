---
sidebar_position: 2
title: Tevékenységnaptár
description: GitHub-stílusú hőtérkép-naptár, amely az éves nyomtatási tevékenységet jeleníti meg naponta, évválasztóval és részletes nézettel
---

# Tevékenységnaptár

A tevékenységnaptár vizuális áttekintést nyújt az éves nyomtatási tevékenységedről — a GitHub közreműködési nézetének mintájára.

Navigálj ide: **https://localhost:3443/#calendar**

## Hőtérkép-áttekintés

A naptár 365 napot (52 hetet) jelenít meg színes négyzetek rácsaként:

- **Szürke** — ezen a napon nem volt nyomtatás
- **Világoszöld** — 1–2 nyomtatás
- **Zöld** — 3–5 nyomtatás
- **Sötétzöld** — 6–10 nyomtatás
- **Mélyzöld** — 11+ nyomtatás

A négyzetek a hét napjai szerint vannak rendezve függőlegesen (Hétfő–Vasárnap), és a hetek vízszintesen balról (január) jobbra (december) haladnak.

:::tip Színkódolás
A hőtérkép mérőszámát átválthatod **Nyomtatások száma** értékről **Óra** vagy **Gramm filament** értékre a naptár feletti választóval.
:::

## Évválasztó

Kattints a **< Év >** gombra az évek közötti navigáláshoz:

- Minden év elérhető, ahol nyomtatási tevékenység volt rögzítve
- Az aktuális év jelenik meg alapértelmezetten
- A jövő szürke (nincs adat)

## Napi részletes nézet

Kattints egy négyzetre az adott nap részleteinek megtekintéséhez:

- **Dátum** és a hét napja
- **Nyomtatások száma** — sikeres és sikertelen
- **Felhasznált filament összesen** (gramm)
- **Összes nyomtatási óra**
- **Nyomtatások listája** — kattints a megnyitáshoz az előzményekben

## Havi áttekintés

A hőtérkép alatt havi összefoglaló jelenik meg:
- Havi összes nyomtatás oszlopdiagramként
- A hónap legjobb napja kiemelve
- Összehasonlítás az előző év azonos hónapjával (%)

## Nyomtató-szűrő

Válassz nyomtatót a felső legördülő listából, hogy csak egy nyomtató tevékenységét jelenítsd meg, vagy válaszd az **Összes** lehetőséget az összesített nézethez.

Több nyomtatós nézetben a színek egymásra halmozva jelennek meg a **Halmozott** nézet kiválasztásakor.

## Sorozatok és rekordok

A naptár alatt a következők jelennek meg:

| Statisztika | Leírás |
|---|---|
| **Leghosszabb sorozat** | Egymást követő legtöbb nap legalább egy nyomtatással |
| **Aktuális sorozat** | Folyamatban lévő aktív napok sorozata |
| **Legaktívabb nap** | A nap a legtöbb nyomtatással összesen |
| **Legaktívabb hét** | A hét a legtöbb nyomtatással |
| **Legaktívabb hónap** | A hónap a legtöbb nyomtatással |

## Exportálás

Kattints az **Exportálás** gombra a naptáradatok letöltéséhez:

- **PNG** — a hőtérkép képe (megosztáshoz)
- **CSV** — nyers adatok naponként egy sorral (dátum, darab, gramm, óra)

A PNG exportálás optimalizált a közösségi médiában való megosztáshoz, a nyomtató nevével és az évvel alcímként.
