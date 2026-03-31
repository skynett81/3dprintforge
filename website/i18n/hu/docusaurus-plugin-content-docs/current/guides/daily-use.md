---
sidebar_position: 3
title: Napi használat
description: Gyakorlati útmutató a 3DPrintForge napi használatához — reggeli rutin, figyelés, nyomtatás után és karbantartás
---

# Napi használat

Ez az útmutató bemutatja, hogyan használd hatékonyan a 3DPrintForgeot a mindennapokban — a nap kezdetétől a lefekvésig.

## Reggeli rutin

Nyisd meg a dashboardot, és végezd el gyorsan az alábbi pontokat:

### 1. Ellenőrizd a nyomtatók állapotát
Az áttekintő panel megjeleníti az összes nyomtatód állapotát. Figyeld:
- **Piros ikonok** — figyelmet igénylő hibák
- **Függőben lévő üzenetek** — éjszakai HMS-figyelmeztetések
- **Befejezetlen nyomtatások** — ha volt éjszakai nyomtatás, elkészült?

### 2. Ellenőrizd az AMS szintjeket
Menj a **Filament** menüpontra, vagy tekintsd meg az AMS-widgetet a dashboardon:
- Van-e tekercs 100 g alatt? Cseréld ki, vagy rendelj újat
- Megfelelő filament van-e a megfelelő helyen a mai nyomtatásokhoz?

### 3. Ellenőrizd az értesítéseket és eseményeket
Az **Értesítési napló** alatt (harang ikon) láthatod:
- Az éjszaka folyamán történt eseményeket
- Automatikusan naplózott hibákat
- HMS-kódokat, amelyek riasztást váltottak ki

## Nyomtatás indítása

### Fájlból (Bambu Studio)
1. Nyisd meg a Bambu Studiót
2. Töltsd be és szeleteld a modellt
3. Küldd a nyomtatóra — a dashboard automatikusan frissül

### A sorból
Ha előre tervezett nyomtatásaid vannak:
1. Menj a **Sor** menüpontra
2. Kattints a **Következő indítása** gombra, vagy húzz egy feladatot a tetejére
3. Erősítsd meg a **Küldés a nyomtatóra** gombbal

Lásd az [Nyomtatási sor dokumentációja](../features/queue) oldalt a sorkezelés teljes leírásáért.

### Ütemezett nyomtatás (ütemező)
Nyomtatás indításához egy meghatározott időpontban:
1. Menj az **Ütemező** menüpontra
2. Kattints a **+ Új feladat** gombra
3. Válaszd ki a fájlt, a nyomtatót és az időpontot
4. Engedélyezd az **Áramár-optimalizálás** funkciót a legolcsóbb időszak automatikus kiválasztásához

Lásd az [Ütemező](../features/scheduler) oldalt a részletekért.

## Aktív nyomtatás figyelése

### Kameranézet
Kattints a kamera ikonra a nyomtató kártyán. Lehetőségeid:
- Élő kép megtekintése a dashboardban
- Megnyitás külön fülön a háttérben való figyeléshez
- Kézi képernyőkép készítése

### Előrehaladási információk
Az aktív nyomtatás kártya mutatja:
- Befejezett százalék
- Becsült hátralévő idő
- Jelenlegi réteg / összes réteg száma
- Aktív filament és szín

### Hőmérsékletek
A részletek panelen valós idejű hőmérsékleti görbék láthatók:
- Fúvókahőmérséklet — ±2°C-on belül kell maradnia stabilnak
- Lemezhőmérséklet — fontos a jó tapadáshoz
- Kamrahőmérséklet — fokozatosan emelkedik, különösen releváns az ABS/ASA esetén

### Print Guard
Ha a **Print Guard** engedélyezve van, a dashboard automatikusan figyeli a spagetti hibákat és a volumetrikus eltéréseket. Ha valamit észlel:
1. A nyomtatás szünetel
2. Értesítést kapsz
3. A kameraképek mentésre kerülnek az utólagos ellenőrzéshez

## Nyomtatás után — ellenőrző rutin

### Minőség ellenőrzése
1. Nyisd meg a kamerát, és nézd meg az eredményt, miközben még a lemezen van
2. Menj az **Előzmények → Utolsó nyomtatás** menüpontra a statisztikák megtekintéséhez
3. Írj megjegyzést: mi ment jól, mi javítható

### Archiválás
Az előzményekben lévő nyomtatások soha nem kerülnek automatikusan archiválásra — ott maradnak. Ha rendet szeretnél tenni:
- Kattints egy nyomtatásra → **Archiválás** az archívumba való áthelyezéséhez
- Használj **Projekteket** a kapcsolódó nyomtatások csoportosításához

### Filament súlyának frissítése
Ha lemérlegel egy tekercset a pontosság érdekében (ajánlott):
1. Mérlegeld le a tekercset
2. Menj a **Filament → [Tekercs]** menüpontra
3. Frissítsd a **Maradék súly** mezőt

## Karbantartási emlékeztetők

A dashboard automatikusan követi a karbantartási intervallumokat. A **Karbantartás** menüpontban láthatod:

| Feladat | Intervallum | Állapot |
|---------|-------------|---------|
| Fúvóka tisztítása | Minden 50 óra | Automatikusan ellenőrzött |
| Rudak kenése | Minden 200 óra | Követve a dashboardban |
| Lemez kalibrálása | Lemezcsere után | Manuális emlékeztető |
| AMS tisztítása | Havonta | Naptár-értesítés |

Engedélyezd a karbantartási értesítéseket a **Megfigyelés → Karbantartás → Értesítések** menüpontban.

:::tip Állíts be heti karbantartási napot
Egy fix heti karbantartási nap (pl. vasárnap este) megkímél a szükségtelen leállásktól. Használd a dashboard emlékeztető funkcióját.
:::

## Áramár — a legjobb nyomtatási idő

Ha csatlakoztattad az áramár-integrációt (Nordpool / Home Assistant):

1. Menj az **Elemzés → Áramár** menüpontra
2. Tekintsd meg az árgörbét a következő 24 órára
3. A legolcsóbb órák zölddel vannak jelölve

Használd az **Ütemezőt** engedélyezett **Áramár-optimalizálással** — ekkor a dashboard automatikusan elindítja a feladatot a legolcsóbb elérhető időablakban.

:::info Jellemzően a legolcsóbb időszakok
Az éjszaka (01:00–06:00) általában a legolcsóbb Magyarországon is. Egy este sorba állított 8 órás nyomtatás 30–50%-ot takaríthat meg az áramköltségen.
:::
