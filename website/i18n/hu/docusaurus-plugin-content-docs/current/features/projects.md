---
sidebar_position: 9
title: Projektek
description: Rendezd a nyomtatásokat projektekbe, kövesd nyomon a költségeket, generálj számlát, és ossz meg projekteket ügyfelekkel
---

# Projektek

A projektek lehetővé teszik a kapcsolódó nyomtatások csoportosítását, anyagköltségek nyomon követését, ügyfelek számlázását, és a munkád áttekintésének megosztását.

Navigálj ide: **https://localhost:3443/#projects**

## Projekt létrehozása

1. Kattints az **Új projekt** (+ ikon) gombra
2. Töltsd ki:
   - **Projektnév** — leíró név (max. 100 karakter)
   - **Ügyfél** — opcionális ügyfélfiók (lásd [E-kereskedelem](../integrations/ecommerce))
   - **Leírás** — rövid szöveges leírás
   - **Szín** — válassz színt a vizuális azonosításhoz
   - **Cimkék** — vesszővel elválasztott kulcsszavak
3. Kattints a **Projekt létrehozása** gombra

## Nyomtatások projekthez kapcsolása

### Nyomtatás közben

1. Nyisd meg a dashboardot nyomtatás közben
2. Kattints a **Projekthez kapcsolás** gombra az oldalpanelben
3. Válassz meglévő projektet, vagy hozz létre újat
4. A nyomtatás automatikusan a projekthez kapcsolódik, amikor befejezik

### Az előzményekből

1. Navigálj az **Előzmények** oldalra
2. Keresd meg az adott nyomtatást
3. Kattints a nyomtatásra → **Projekthez kapcsolás**
4. Válassz projektet a legördülő listából

### Tömeges kapcsolás

1. Válassz ki több nyomtatást az előzményekben jelölőnégyzetekkel
2. Kattints a **Műveletek → Projekthez kapcsolás** gombra
3. Válassz projektet — az összes kiválasztott nyomtatás kapcsolódik

## Költségáttekintés

Minden projekt teljes költségeket számít a következők alapján:

| Költségtípus | Forrás |
|---|---|
| Filamentfelhasználás | Gramm × ár grammonként anyagonként |
| Áram | kWh × áramár (Tibber/Nordpool-tól, ha konfigurálva) |
| Gépkopás | Kiszámítva a [Kopásbecslésből](../monitoring/wearprediction) |
| Manuális költség | Általad manuálisan hozzáadott szabad szöveges tételek |

A költségáttekintés táblázatként és kördiagramként jelenik meg nyomtatásonként és összesítve.

:::tip Óránkénti árak
Aktiváld a Tibber- vagy Nordpool-integrációt a pontos nyomtatásonkénti áramköltségekhez. Lásd [Áramár](../integrations/energy).
:::

## Számlázás

1. Nyiss meg egy projektet, és kattints a **Számla generálása** gombra
2. Töltsd ki:
   - **Számla dátuma** és **esedékessége**
   - **ÁFA-kulcs** (0%, 15%, 25%)
   - **Felár** (%)
   - **Megjegyzés az ügyfélnek**
3. Tekintsd meg a számlát PDF-előnézetben
4. Kattints a **PDF letöltése** vagy az **Küldés az ügyfélnek** gombra (e-mailben)

A számlák a projekt alatt tárolódnak, és az elküldésig újra megnyithatók és szerkeszthetők.

:::info Ügyféladatok
Az ügyféladatok (név, cím, cégjegyzékszám) a projekthez csatolt ügyfélfiókból kerülnek elő. Az ügyfelek kezeléséhez lásd az [E-kereskedelem](../integrations/ecommerce) oldalt.
:::

## Projekt állapota

| Állapot | Leírás |
|---|---|
| Aktív | A projekt folyamatban van |
| Befejezett | Minden nyomtatás kész, a számla elküldve |
| Archivált | Rejtett az alapértelmezett nézetből, de kereshető |
| Várakozó | Ideiglenesen szüneteltetett |

Változtasd meg az állapotot a projekt tetején lévő állapotjelzőre kattintva.

## Projekt megosztása

Generálj megosztható linket a projekt áttekintésének ügyfelek számára való bemutatásához:

1. Kattints a **Projekt megosztása** gombra a projekt menüjében
2. Válaszd ki, mi jelenjen meg:
   - ✅ Nyomtatások és képek
   - ✅ Összes filamentfelhasználás
   - ❌ Költségek és árak (alapértelmezetten rejtett)
3. Állítsd be a link lejárati idejét
4. Másold és oszd meg a linket

Az ügyfél egy írásvédett oldalt lát bejelentkezés nélkül.
