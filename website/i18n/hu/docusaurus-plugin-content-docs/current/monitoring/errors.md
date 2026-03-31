---
sidebar_position: 2
title: Hibanapló
description: A nyomtatók HMS hibakódjainak teljes áttekintése súlyossági fokozattal, kereséssel és Bambu Wiki hivatkozásokkal
---

# Hibanapló

A hibanapló összegyűjti az összes hibát és HMS riasztást (Health, Maintenance, Safety) a nyomtatóidból. A 3DPrintForge beépített adatbázissal rendelkezik 269+ HMS kóddal a Bambu Lab nyomtatókhoz.

Navigálj ide: **https://localhost:3443/#errors**

## HMS kódok

A Bambu Lab nyomtatók HMS kódokat küldenek MQTT-n keresztül, amikor valami nem stimmel. A 3DPrintForge ezeket automatikusan olvasható hibaüzenetekre fordítja:

| Kód | Példa | Kategória |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Fúvóka/extruder |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Nyomtatóágy |
| `0700 0500 0001 0001` | MC disconnect | Elektronika |

A teljes lista lefedi az összes 269+ ismert kódot X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D és H2C esetén.

## Súlyossági fokozat

A hibák négy szintre vannak osztályozva:

| Szint | Szín | Leírás |
|---|---|---|
| **Kritikus** | Piros | Azonnali beavatkozást igényel — nyomtatás leállt |
| **Magas** | Narancssárga | Gyorsan kell kezelni — a nyomtatás folytatódhat |
| **Közepes** | Sárga | Meg kell vizsgálni — nincs közvetlen veszély |
| **Tájékoztató** | Kék | Tájékoztató üzenet, nincs szükséges teendő |

## Keresés és szűrés

Használd a hibanapló tetején lévő eszköztárat:

1. **Szabad szöveges keresés** — keresés hibaüzenetben, HMS kódban vagy nyomtatóleírásban
2. **Nyomtató** — csak egy nyomtató hibáinak megjelenítése
3. **Kategória** — AMS / Fúvóka / Lemez / Elektronika / Kalibrálás / Egyéb
4. **Súlyossági fokozat** — Összes / Kritikus / Magas / Közepes / Tájékoztató
5. **Dátum** — szűrés dátumtartomány szerint
6. **Nem nyugtázott** — csak a nem nyugtázott hibák megjelenítése

Kattints a **Szűrő törlése** gombra az összes hiba megtekintéséhez.

## Wiki-hivatkozások

Minden HMS kódhoz hivatkozás jelenik meg a Bambu Lab Wikire:

- Teljes hibaleírás
- Lehetséges okok
- Lépésről lépésre hibaelhárítási útmutató
- Hivatalos Bambu Lab javaslatok

Kattints a **Wiki megnyitása** gombra egy hibabejegyzésnél a releváns wiki oldal új lapon való megnyitásához.

:::tip Helyi másolat
A 3DPrintForge gyorsítótárban tárolja a wiki tartalmát helyi offline használathoz. A tartalom automatikusan hetente frissül.
:::

## Hibák nyugtázása

A nyugtázás megjelöli a hibát kezeltként anélkül, hogy törölné:

1. Kattints egy hibára a listában
2. Kattints a **Nyugtázás** (pipa ikon) gombra
3. Írj be egy opcionális megjegyzést arról, mi történt
4. A hiba pipával jelölődik meg, és a „Nyugtázottak" listába kerül

### Tömeges nyugtázás

1. Válassz ki több hibát jelölőnégyzetekkel
2. Kattints a **Kijelöltek nyugtázása** gombra
3. Az összes kijelölt hiba egyszerre nyugtázódik

## Statisztika

A hibanapló tetején a következők jelennek meg:

- Hibák teljes száma az utolsó 30 napban
- Nem nyugtázott hibák száma
- Leggyakrabban előforduló HMS kód
- Legtöbb hibával rendelkező nyomtató

## Exportálás

1. Kattints az **Exportálás** (letöltés ikon) gombra
2. Válassz formátumot: **CSV** vagy **JSON**
3. A szűrő az exportálásra is érvényes — először állítsd be a kívánt szűrőt
4. A fájl automatikusan letöltődik

## Értesítések új hibákhoz

Értesítések aktiválása az új HMS hibákhoz:

1. Navigálj a **Beállítások → Értesítések** menüpontra
2. Jelöld be az **Új HMS hibák** opciót
3. Válassz minimum súlyossági fokozatot az értesítéshez (ajánlott: **Magas** és felette)
4. Válassz értesítési csatornát

Lásd az [Értesítések](../features/notifications) oldalt a csatorna beállításhoz.
