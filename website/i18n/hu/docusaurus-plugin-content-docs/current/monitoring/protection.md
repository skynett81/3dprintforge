---
sidebar_position: 1
title: Print Guard
description: Automatikus figyelés XCam esemény-detektálással, érzékelőfigyeléssel és konfigurálható eltérési műveletekkel
---

# Print Guard

A Print Guard a 3DPrintForge valós idejű figyelőrendszere. Folyamatosan figyeli a kamerát, érzékelőket és nyomtatóadatokat, és konfigurálható műveleteket hajt végre, ha valami nem stimmel.

Navigálj ide: **https://localhost:3443/#protection**

## XCam esemény-detektálás

A Bambu Lab nyomtatók XCam eseményeket küldenek MQTT-n keresztül, amikor az AI kamera problémákat észlel:

| Esemény | Kód | Súlyosság |
|---|---|---|
| Spagetti észlelve | `xcam_spaghetti` | Kritikus |
| Ágy-leválás | `xcam_detach` | Magas |
| Az első réteg hibás működése | `xcam_first_layer` | Magas |
| Stringing | `xcam_stringing` | Közepes |
| Extrudálási hiba | `xcam_extrusion` | Magas |

Minden eseménytípushoz egy vagy több műveletet konfigurálhatsz:

- **Értesítés** — értesítés küldése az aktív értesítési csatornákon
- **Szüneteltetés** — nyomtatás szüneteltetése manuális ellenőrzéshez
- **Leállítás** — nyomtatás azonnali megszakítása
- **Semmi** — esemény figyelmen kívül hagyása (de naplózása)

:::danger Alapértelmezett viselkedés
Alapértelmezetten az XCam események **Értesítés** és **Szüneteltetés** beállításúak. Változtasd **Leállításra**, ha teljesen megbízol az AI detektálásban.
:::

## Érzékelőfigyelés

A Print Guard folyamatosan figyeli az érzékelőadatokat, és riaszt eltérés esetén:

### Hőmérséklet-eltérés

1. Navigálj a **Print Guard → Hőmérséklet** menüpontra
2. Állítsd be a **Max. eltérés a célhőmérséklettől** értéket (ajánlott: ±5°C fúvókánál, ±3°C ágynál)
3. Válassz **Műveletet eltérésnél**: Értesítés / Szüneteltetés / Leállítás
4. Állíts be **Késleltetést** (másodperc) a művelet végrehajtása előtt — időt ad a hőmérsékletnek a stabilizálódáshoz

### Alacsony filament

A rendszer kiszámítja az orsókon lévő fennmaradó filamentet:

1. Navigálj a **Print Guard → Filament** menüpontra
2. Állítsd be a **Minimum korlátot** grammban (pl. 50 g)
3. Válassz műveletet: **Szüneteltetés és értesítés** (ajánlott) az orsó manuális cseréjéhez

### Nyomtatás megállás detektálás

Észleli, amikor a nyomtatás váratlanul leáll (MQTT timeout, filamentszakadás stb.):

1. Aktiváld a **Megállás detektálást**
2. Állítsd be az **Időtúllépést** (ajánlott: 120 másodperc adat nélkül = megállt)
3. Művelet: Mindig értesítés — a nyomtatás esetleg már leállt

## Konfiguráció

### Print Guard aktiválása

1. Navigálj a **Beállítások → Print Guard** menüpontra
2. Kapcsold be az **Print Guard engedélyezése** opciót
3. Válaszd ki, melyik nyomtatókat kell figyelni
4. Kattints a **Mentés** gombra

### Nyomtatónkénti szabályok

Különböző nyomtatóknak eltérő szabályaik lehetnek:

1. Kattints egy nyomtatóra a Print Guard áttekintésben
2. Kapcsold ki a **Globális szabályok öröklése** opciót
3. Konfiguráld az adott nyomtatóhoz egyéni szabályokat

## Napló és esemény-előzmények

Az összes Print Guard esemény naplózva van:

- Navigálj a **Print Guard → Napló** menüpontra
- Szűrj nyomtató, eseménytípus, dátum és súlyosság szerint
- Kattints egy eseményre a részletes információk és a végrehajtott műveletek megtekintéséhez
- Napló exportálása CSV-be

:::tip Téves riasztások
Ha a Print Guard szükségtelen szüneteltetéseket vált ki, módosítsd az érzékenységet a **Print Guard → Beállítások → Érzékenység** menüponton. Kezdj az „Alacsony" értékkel, és fokozatosan növeld.
:::
