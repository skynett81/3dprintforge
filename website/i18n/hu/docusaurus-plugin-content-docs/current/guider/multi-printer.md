---
sidebar_position: 6
title: Több nyomtató
description: Több Bambu nyomtató beállítása és kezelése a Bambu Dashboard-ban — flotta áttekintés, sor és fokozatos indítás
---

# Több nyomtató

Van több mint egy nyomtatod? A Bambu Dashboard flotta-kezelésre épül — az összes nyomtatót egy helyről figyelheti, irányíthatja és koordinálhatja.

## Új nyomtató hozzáadása

1. Lépjen a **Beállítások → Nyomtatók** menübe
2. Kattintson a **+ Nyomtató hozzáadása** gombra
3. Töltse ki:

| Mező | Példa | Magyarázat |
|------|----------|------------|
| Sorozatszám (SN) | 01P... | Megtalálható a Bambu Handy-ban vagy a nyomtató képernyőjén |
| IP-cím | 192.168.1.101 | LAN-módban (ajánlott) |
| Hozzáférési kód | 12345678 | 8 jegyű kód a nyomtató képernyőjén |
| Név | "Bambu #2 - P1S" | Az irányítópulton jelenik meg |
| Modell | P1P, P1S, X1C, A1 | Válassza a megfelelő modellt a megfelelő ikonok és funkciók

4. Kattintson a **Teszt kapcsolat** gombra — zöld státuszt kell látnia
5. Kattintson a **Mentés** gombra

:::tip Adjon leírást a nyomtatóknak
A "Bambu 1" és a "Bambu 2" zavaró. Használj olyan neveket, mint az "X1C - Termelés" és "P1S - Prototípusok" az áttekintés megtartásához.
:::

## Flotta áttekintés

Az összes nyomtató hozzáadása után egyként megjelenik a **Flotta** panelben. Itt megtekintheti:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Termelés  │  │ P1S - Prototípus│  │ A1 - Hobbisor   │
│ ████████░░ 82%  │  │ Szabad          │  │ ████░░░░░░ 38%  │
│ 1ó 24p maradt   │  │ Nyomtatásra kész│  │ 3ó 12p maradt   │
│ Temp: 220/60°C  │  │ AMS: 4 orsó     │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

A következőket teheti:
- Kattintson egy nyomtatóra a teljes részlet nézethez
- Tekintse meg az összes hőmérsékletet, AMS-státuszt és aktív hibákat egyszerre
- Szűrő státusz alapján (aktív nyomtatások, szabad, hibák)

## Nyomtatási sor — munka elosztása

A nyomtatási sor lehetővé teszi az összes nyomtató nyomtatásos megtervezését egy helyről.

**Hogyan működik:**
1. Lépjen a **Sorhoz**
2. Kattintson a **+ Feladat hozzáadása** gombra
3. Válassza ki a fájlt és a beállításokat
4. Válassza ki a nyomtatót, vagy válassza az **Automatikus hozzárendelés** lehetőséget

### Automatikus hozzárendelés
Az automatikus hozzárendeléssel az irányítópult nyomtatót választ az alapján:
- Szabad kapacitás
- A filament elérhető az AMS-ben
- Tervezett karbantartási ablakok

Aktiválja a **Beállítások → Sor → Automatikus hozzárendelés** alatt.

### Prioritizálás
Húzza és ejtse el a sorban lévő feladatokat a sorrend megváltoztatásához. Az **Magas prioritás** feladat közötti szokásos feladatok előtt lép.

## Fokozatos kezdés — az áram csúcsának elkerülése

Ha sok nyomtatót indít egyszerre, a felmelegítési fázis erős áramfelvételt adhat. A fokozatos indítás elosztja az indítást:

**Így aktiválod:**
1. Lépjen a **Beállítások → Flotta → Fokozatos kezdés** menübe
2. Engedélyezze az **Elosztott indítást**
3. Állítsa be a késleltetést a nyomtatók között (ajánlott: 2–5 perc)

**Példa 3 nyomtatóval és 3 perces késleltetéssel:**
```
08:00 — Az 1. nyomtató felmelegítésének indítása
08:03 — A 2. nyomtató felmelegítésének indítása
08:06 — A 3. nyomtató felmelegítésének indítása
```

:::tip Releváns a biztosíték méretéhez
Egy X1C a felmelegítés alatt körülbelül 1000W-ot húz. Három nyomtató egyszerre = 3000W, ami a 16A biztosítékot aktiválhatja. A fokozatos indítás kiküszöböli a problémát.
:::

## Nyomtató csoportok

A nyomtató csoportok lehetővé teszik a nyomtatók logikus szervezését és parancsok küldését a teljes csoportnak:

**Csoport létrehozása:**
1. Lépjen a **Beállítások → Nyomtató csoportok** menübe
2. Kattintson a **+ Új csoport** gombra
3. Adjon nevet a csoportnak (pl. "Termelési emelet", "Hobbisor")
4. Adja hozzá a nyomtatókat a csoporthoz

**Csoport funkciók:**
- Tekintse meg a csoport kombinált statisztikáját
- Szünet parancs küldése az egész csoportnak egyszerre
- Karbantartási ablak beállítása a csoporthoz

## Az összes nyomtató monitorozása

### Többnyomtatós kamera
Lépjen a **Flotta → Kamera nézet** menübe az összes kamera feed megtekintéséhez egymás mellett:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [Élő]       │  │  [Szabad]    │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Hozzáadás │
│  [Élő]       │  │              │
└──────────────┘  └──────────────┘
```

### Értesítések nyomtatónként
Különböző értesítési szabályokat konfigurálhat az eltérő nyomtatók számára:
- Termelési nyomtató: mindig figyelmeztessen, beleértve az éjszakát
- Hobby nyomtató: csak nappal figyelmeztesse

Lásd az [Értesítések](./varsler-oppsett) beállítását.

## Tippek a flottaműködéshez

- **Szabványosítsa a filament nyílásokat**: A PLA fehér tartsa az 1. nyílásban, a PLA fekete az 2. nyílásban minden nyomtatón — így könnyebb a munka elosztása
- **Naponta ellenőrizze az AMS-szinteket**: Lásd a [Napi használat](./daglig-bruk) reggel rutint
- **Karbantartás forgalomban**: Ne karbantartson minden nyomtatót egyszerre — tartsa legalább az egyik aktívat
- **Egyértelműen írja be a fájlokat**: Az olyan fájlnevezés, mint a `logo_x1c_pla_0.2mm.3mf`, könnyen kiválaszthatja a megfelelő nyomtatót
