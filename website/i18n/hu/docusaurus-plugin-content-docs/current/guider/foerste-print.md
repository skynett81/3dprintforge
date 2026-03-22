---
sidebar_position: 1
title: Az első nyomtatás
description: Lépésről lépésre útmutató az első 3D nyomtatás elindításához és figyeléséhez a Bambu Dashboardban
---

# Az első nyomtatás

Ez az útmutató végigvezet a teljes folyamaton — a csatlakoztatott nyomtatótól a kész nyomatig — a Bambu Dashboard vezérlőközpontként való használatával.

## 1. lépés — Ellenőrizd, hogy a nyomtató csatlakoztatva van-e

Amikor megnyitod a dashboardot, a nyomtató állapotkártyája megjelenik az oldalsáv tetején vagy az áttekintő panelen.

**Zöld állapot** azt jelenti, hogy a nyomtató online és készen áll.

| Állapot | Szín | Jelentés |
|---------|------|----------|
| Online | Zöld | Nyomtatásra kész |
| Tétlen | Szürke | Csatlakoztatva, de nem aktív |
| Nyomtat | Kék | Nyomtatás folyamatban |
| Hiba | Piros | Figyelmet igényel |

Ha a nyomtató piros állapotot mutat:
1. Ellenőrizd, hogy a nyomtató be van-e kapcsolva
2. Győződj meg arról, hogy ugyanazon a hálózaton van, mint a dashboard
3. Menj a **Beállítások → Nyomtatók** menüpontra, és erősítsd meg az IP-címet és a hozzáférési kódot

:::tip Használj LAN módot a gyorsabb válaszidőért
A LAN mód kisebb késleltetést biztosít, mint a felhő mód. Engedélyezd a nyomtató beállításainál, ha a nyomtató és a dashboard ugyanazon a hálózaton vannak.
:::

## 2. lépés — Töltsd fel a modelledet

A Bambu Dashboard nem indít el nyomtatásokat közvetlenül — ez a Bambu Studio vagy a MakerWorld feladata. A dashboard akkor veszi át az irányítást, amint a nyomtatás megkezdődik.

**A Bambu Studio segítségével:**
1. Nyisd meg a Bambu Studiót a számítógépeden
2. Importáld vagy nyisd meg a `.stl` vagy `.3mf` fájlt
3. Szeleteld a modellt (válaszd ki a filamentet, a tartókat, a kitöltést stb.)
4. Kattints a **Nyomtatás** gombra a jobb felső sarokban

**A MakerWorld segítségével:**
1. Keresd meg a modellt a [makerworld.com](https://makerworld.com) oldalon
2. Kattints a **Nyomtatás** gombra közvetlenül a weboldalon
3. A Bambu Studio automatikusan megnyílik a modellel készen

## 3. lépés — Indítsd el a nyomtatást

A Bambu Studioban válaszd ki a küldési módot:

| Módszer | Követelmény | Előnyök |
|---------|-------------|---------|
| **Felhő** | Bambu-fiók + internet | Mindenhonnan működik |
| **LAN** | Azonos hálózat | Gyorsabb, felhő nélkül |
| **SD-kártya** | Fizikai hozzáférés | Nincs hálózati követelmény |

Kattints a **Küldés** gombra — a nyomtató megkapja a feladatot, és automatikusan elkezdi a felmelegítési fázist.

:::info A nyomtatás megjelenik a dashboardban
Néhány másodperccel azután, hogy a Bambu Studio elküldi a feladatot, az aktív nyomtatás megjelenik a dashboardban az **Aktív nyomtatás** alatt.
:::

## 4. lépés — Figyeld a dashboardban

Amíg a nyomtatás folyamatban van, a dashboard teljes áttekintést nyújt:

### Előrehaladás
- A befejezett százalék és a becsült hátralévő idő megjelenik a nyomtató kártyán
- Kattints a kártyára a részletes nézethez réteginformációkkal

### Hőmérsékletek
A részletek panel valós idejű hőmérsékleteket mutat:
- **Fúvóka** — jelenlegi és célhőmérséklet
- **Építőlemez** — jelenlegi és célhőmérséklet
- **Kamra** — a nyomtató belsejének hőmérséklete (fontos az ABS/ASA esetén)

### Kamera
Kattints a kamera ikonra a nyomtató kártyán az élő kép megtekintéséhez közvetlenül a dashboardban. A kamerát nyitva tarthatod egy külön ablakban, miközben mást csinálsz.

:::warning Ellenőrizd az első rétegeket
Az első 3–5 réteg kritikus. A rossz tapadás most sikertelen nyomtatást jelent később. Nézd a kamerát, és ellenőrizd, hogy a filament szépen és egyenletesen rakódik le.
:::

### Print Guard
A Bambu Dashboard rendelkezik egy MI-vezérelt **Print Guard** funkcióval, amely automatikusan észleli a spagetti hibákat, és szüneteltetheti a nyomtatást. Engedélyezd a **Megfigyelés → Print Guard** menüpontban.

## 5. lépés — A nyomtatás befejezése után

Amikor a nyomtatás kész, a dashboard befejezési üzenetet jelenít meg (és értesítést küld, ha beállítottad az [értesítéseket](./varsler-oppsett)).

### Ellenőrizd az előzményeket
Menj az **Előzmények** menüpontra az oldalsávban a befejezett nyomtatás megtekintéséhez:
- Teljes nyomtatási idő
- Filamentfelhasználás (felhasznált gramm, becsült költség)
- Hibák vagy HMS-események a nyomtatás során
- Kamerakép a befejezéskor (ha engedélyezve van)

### Írj megjegyzést
Kattints a nyomtatásra az előzményekben, és adj hozzá megjegyzést — pl. „Kicsit több brim kellett" vagy „Tökéletes eredmény". Ez hasznos, ha ugyanazt a modellt nyomtatod újra.

### Ellenőrizd a filamentfelhasználást
A **Filament** menüpontban láthatod, hogy a tekercs súlya frissítve lett a felhasznált mennyiség alapján. A dashboard automatikusan levonja.

## Tippek kezdőknek

:::tip Ne hagyd el az első nyomtatást
Kísérd figyelemmel az első 10–15 percet. Ha meggyőződtél arról, hogy a nyomtatás jól tapad, hagyd a dashboardot figyelni a többit.
:::

- **Mérlegeld az üres tekercseket** — add meg a tekercseknél a kezdősúlyt a pontos maradékszámításhoz (lásd [Filamentkészlet](./filament-oppsett))
- **Állíts be Telegram-értesítést** — kapj értesítést, amikor a nyomtatás kész, anélkül, hogy várnod kellene (lásd [Értesítések](./varsler-oppsett))
- **Ellenőrizd az építőlemezt** — tiszta lemez = jobb tapadás. Töröld meg IPA-val (izopropanol) a nyomtatások között
- **Használd a megfelelő lemezt** — lásd [Megfelelő építőlemez kiválasztása](./velge-rett-plate), hogy mi illik a filamentedhez
