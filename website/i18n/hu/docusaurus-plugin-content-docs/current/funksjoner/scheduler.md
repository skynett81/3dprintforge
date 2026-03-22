---
sidebar_position: 4
title: Ütemező
description: Tervezz nyomtatásokat, kezeld a nyomtatási sort, és állíts be automatikus kiadást
---

# Ütemező

Az ütemező lehetővé teszi nyomtatási feladatok rendszerezését és automatizálását naptárnézettel és intelligens nyomtatási sorral.

## Naptárnézet

A naptárnézet áttekintést nyújt az összes tervezett és elvégzett nyomtatásról:

- **Havi, heti és napi nézet** — válassz részletezési szintet
- **Színkódolás** — különböző színek nyomtatónként és állapotonként
- **Kattints egy eseményre** — tekintsd meg a nyomtatás részleteit

A befejezett nyomtatások automatikusan jelennek meg a nyomtatási előzmények alapján.

## Nyomtatási sor

A nyomtatási sor lehetővé teszi feladatok sorba állítását, amelyek sorrendben kerülnek a nyomtatóra:

### Feladat hozzáadása a sorhoz

1. Kattints a **+ Feladat hozzáadása** gombra
2. Válassz fájlt (nyomtató SD-ről, helyi feltöltésről, vagy FTP-ről)
3. Add meg a prioritást (magas, normál, alacsony)
4. Válassz célnyomtatót (vagy "automatikus")
5. Kattints a **Hozzáadás** gombra

### Sorkezelés

| Művelet | Leírás |
|---------|---------|
| Húzd és ejtsd | Sorrend átrendezése |
| Sor szüneteltetése | Kiadás ideiglenes leállítása |
| Ugrás | Következő feladat küldése várakozás nélkül |
| Törlés | Feladat eltávolítása a sorból |

:::tip Több nyomtatós kiadás
Több nyomtatóval a sor automatikusan eloszthatja a feladatokat a szabad nyomtatókra. Aktiváld az **Automatikus kiadást** az **Ütemező → Beállítások** menüponton.
:::

## Tervezett nyomtatások

Állíts be nyomtatásokat, amelyek meghatározott időpontban indulnak:

1. Kattints a **+ Nyomtatás ütemezése** gombra
2. Válassz fájlt és nyomtatót
3. Add meg az indítási időpontot
4. Konfiguráld az értesítéseket (opcionális)
5. Mentsd el

:::warning A nyomtatónak szabadnak kell lennie
A tervezett nyomtatások csak akkor indulnak el, ha a nyomtató készenlétben van a megadott időpontban. Ha a nyomtató foglalt, az indítás a következő szabad időpontra tolódik (konfigurálható).
:::

## Terheléselosztás

Automatikus terheléselosztással a feladatok intelligensen elosztódnak a nyomtatók között:

- **Körözős** — egyenletes elosztás az összes nyomtató között
- **Legkevésbé foglalt** — küldés a nyomtatóra a legrövidebb becsült befejezési idővel
- **Manuális** — te választod a nyomtatót minden egyes feladathoz

Konfiguráld az **Ütemező → Terheléselosztás** menüponton.

## Értesítések

Az ütemező integrálódik az értesítési csatornákkal:

- Értesítés, amikor egy feladat elindul
- Értesítés, amikor egy feladat befejezik
- Értesítés hiba vagy késedelem esetén

Lásd a [Funkciók áttekintése](./oversikt#értesítések) oldalt az értesítési csatornák konfigurálásához.
