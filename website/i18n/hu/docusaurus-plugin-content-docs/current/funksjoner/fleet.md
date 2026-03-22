---
sidebar_position: 3
title: Flottaáttekintés
description: Az összes Bambu Lab nyomtató kezelése és figyelése egy rácsban rendezéssel, szűréssel és valós idejű állapottal
---

# Flottaáttekintés

A flottaáttekintés kompakt áttekintést nyújt az összes csatlakozott nyomtatóról egy oldalon. Tökéletes műhelyeknek, iskolai tantermeknek, vagy mindenkinek, akinek több nyomtatója van.

Navigálj ide: **https://localhost:3443/#fleet**

## Több nyomtatós rács

Az összes regisztrált nyomtató egy reszponzív rácsban jelenik meg:

- **Kártya mérete** — Kicsi (kompakt), Közepes (normál), Nagy (részletes)
- **Oszlopok száma** — Automatikusan igazodik a képernyőszélességhez, vagy állítsd be kézzel
- **Frissítés** — Minden kártya egymástól függetlenül frissül az MQTT-n keresztül

Minden nyomtatókártya a következőket mutatja:
| Mező | Leírás |
|---|---|
| Nyomtató neve | Konfigurált név modell ikonnal |
| Állapot | Szabad / Nyomtat / Szünet / Hiba / Offline |
| Haladás | Százalékos sáv hátralévő idővel |
| Hőmérséklet | Fúvóka és ágy (kompakt) |
| Aktív filament | Szín és anyag az AMS-ből |
| Kamera-bélyegkép | 30 másodpercenként frissülő állókép |

## Állapotjelző nyomtatónként

Az állapotszínek megkönnyítik az állapot távolról való megítélését:

- **Zöld pulzálás** — Aktívan nyomtat
- **Kék** — Szabad és készen áll
- **Sárga** — Szüneteltetve (manuálisan vagy Print Guard által)
- **Piros** — Hiba észlelve
- **Szürke** — Offline vagy elérhetetlen

:::tip Kioszk mód
Használd a flottaáttekintést kioszk módban egy falra szerelt képernyőn. Lásd a [Kioszk mód](../system/kiosk) beállítási útmutatót.
:::

## Rendezés

Kattints a **Rendezés** gombra a sorrend kiválasztásához:

1. **Név** — Ábécé sorrendben A–Z
2. **Állapot** — Aktív nyomtatók elöl
3. **Haladás** — Legtöbbet befejezett elöl
4. **Utolsó aktivitás** — Legutóbb használt elöl
5. **Modell** — Nyomtatómodell szerint csoportosítva

A rendezés a következő látogatásig megmarad.

## Szűrés

Használd a felső szűrőmezőt a nézet szűkítéséhez:

- Írd be a nyomtató nevét vagy annak egy részét
- Válassz **Állapotot** a legördülő listából (Összes / Nyomtat / Szabad / Hiba)
- Válassz **Modellt** csak egy nyomtatótípus megjelenítéséhez (X1C, P1S, A1 stb.)
- Kattints a **Szűrő törlése** gombra az összes megjelenítéséhez

:::info Keresés
A keresés valós időben szűr anélkül, hogy az oldalt újra kellene tölteni.
:::

## Műveletek a flottaáttekintésből

Jobb gombbal kattints egy kártyára (vagy kattints a három pontra) a gyorsműveletekhez:

- **Dashboard megnyitása** — Közvetlenül a nyomtató főpaneljére ugrik
- **Nyomtatás szüneteltetése** — Szünetelteti a nyomtatót
- **Nyomtatás leállítása** — Megszakítja a folyamatban lévő nyomtatást (megerősítést kér)
- **Kamera megtekintése** — Megnyitja a kameranézetet felugró ablakban
- **Beállításokhoz ugrik** — Megnyitja a nyomtatóbeállításokat

:::danger Nyomtatás leállítása
A nyomtatás leállítása nem visszafordítható. Mindig erősítsd meg a megjelenő párbeszédablakban.
:::

## Összesített statisztika

A flottaáttekintés tetején összefoglaló sor jelenik meg:

- Nyomtatók teljes száma
- Aktív nyomtatások száma
- Összes filamentfelhasználás ma
- A leghosszabb folyamatban lévő nyomtatás becsült befejezési ideje
