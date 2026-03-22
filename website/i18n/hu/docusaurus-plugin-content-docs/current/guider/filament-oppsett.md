---
sidebar_position: 2
title: Filamentkészlet beállítása
description: Hogyan hozd létre, konfiguráld és kövesd nyomon a filamenttekercseidet a Bambu Dashboardban
---

# Filamentkészlet beállítása

A Bambu Dashboard filamentkészlete teljes áttekintést nyújt az összes tekercsedről — mennyi maradt, mennyit használtál el, és melyik tekercsek vannak éppen az AMS-ben.

## Automatikus létrehozás az AMS-ből

Amikor csatlakoztatod az AMS-sel rendelkező nyomtatót, a dashboard automatikusan beolvassa az RFID-chipek információit a Bambu tekercsekről:

- Filament típusa (PLA, PETG, ABS, TPU stb.)
- Szín (hexadecimális kóddal)
- Márka (Bambu Lab)
- Tekercs súlya és maradék mennyisége

**Ezek a tekercek automatikusan létrejönnek a készletben** — nem kell semmit tenned. Tekintsd meg őket a **Filament → Készlet** menüpontban.

:::info Csak a Bambu tekercsek rendelkeznek RFID-del
A harmadik féltől származó tekercek (pl. eSUN, Polymaker, Bambu-utántöltők chip nélkül) nem kerülnek automatikusan felismerésre. Ezeket manuálisan kell felvenni.
:::

## Tekercek manuális hozzáadása

RFID nélküli tekercsekhez, vagy az AMS-ben nem lévő tekercsekhez:

1. Menj a **Filament → Készlet** menüpontra
2. Kattints a **+ Új tekercs** gombra a jobb felső sarokban
3. Töltsd ki a mezőket:

| Mező | Példa | Kötelező |
|------|-------|----------|
| Márka | eSUN, Polymaker, Bambu | Igen |
| Típus | PLA, PETG, ABS, TPU | Igen |
| Szín | #FF5500 vagy válassz a színkerékből | Igen |
| Kezdősúly | 1000 g | Ajánlott |
| Maradék | 850 g | Ajánlott |
| Átmérő | 1.75 mm | Igen |
| Megjegyzés | „Vásárolva 2025-01, jól működik" | Opcionális |

4. Kattints a **Mentés** gombra

## Színek és márka konfigurálása

Bármikor szerkeszthetsz egy tekercset, ha rákattintasz a készlet áttekintőjében:

- **Szín** — Válassz a színkerékből, vagy írd be a hexadecimális értéket. A szín vizuális jelölőként használatos az AMS-áttekintőben
- **Márka** — Megjelenik a statisztikákban és a szűrésben. Hozz létre saját márkákat a **Filament → Márkák** menüpontban
- **Hőmérsékletprofil** — Add meg a filamentgyártó által ajánlott fúvóka- és lemezhőmérsékletet. A dashboard ekkor figyelmeztethet, ha rossz hőmérsékletet választasz

## Az AMS-szinkronizáció megértése

A dashboard valós időben szinkronizálja az AMS állapotát:

```
AMS 1. hely → Tekercs: Bambu PLA Fehér  [███████░░░] 72% maradt
AMS 2. hely → Tekercs: eSUN PETG Szürke [████░░░░░░] 41% maradt
AMS 3. hely → (üres)
AMS 4. hely → Tekercs: Bambu PLA Piros  [██████████] 98% maradt
```

A szinkronizálás frissül:
- **Nyomtatás közben** — a felhasználás valós időben levonódik
- **Nyomtatás végén** — a végső felhasználás naplózásra kerül az előzményekben
- **Manuálisan** — kattints a szinkronizálás ikonra egy tekercsen az AMS frissített adatainak lekéréséhez

:::tip AMS-becslés korrigálása
Az RFID-ből származó AMS-becslés nem mindig 100%-ig pontos az első használat után. Mérlegeld le a tekercset, és frissítsd a súlyt manuálisan a legjobb pontosság érdekében.
:::

## Felhasználás és maradék ellenőrzése

### Tekercsenként
Kattints egy tekercsre a készletben a megtekintéséhez:
- Összes felhasznált mennyiség (gramm, az összes nyomtatásból)
- Becsült maradék mennyiség
- Az összes nyomtatás listája, amely ezt a tekercset használta

### Összesített statisztikák
Az **Elemzés → Filementelemzés** menüpontban láthatod:
- Felhasználás filamenttípusonként az idő függvényében
- Melyik márkákat használod a legtöbbet
- Becsült költség az 1 kg-onkénti vételár alapján

### Alacsony szintű értesítések
Állíts be értesítéseket, amikor egy tekercs közeledik a végéhez:

1. Menj a **Filament → Beállítások** menüpontra
2. Engedélyezd az **Értesítés alacsony készletnél** opciót
3. Állítsd be a küszöböt (pl. 100 g maradt)
4. Válassz értesítési csatornát (Telegram, Discord, e-mail)

## Tipp: Mérlegeld a tekercseket a pontosságért

Az AMS-tól és a nyomtatási statisztikáktól származó becslések soha nem teljesen pontosak. A legpontosabb módszer a tekercs lemérlése:

**Így csináld:**

1. Keresd meg a tára súlyt (üres tekercs) — általában 200–250 g, ellenőrizd a gyártó weboldalán vagy a tekercs alján
2. Mérlegeld le a tekercset a filamenttel együtt egy konyhai mérlegen
3. Vond le a tára súlyt
4. Frissítsd a **Maradék** mezőt a tekercsprofiban

**Példa:**
```
Mért súly:        743 g
Tára (üres):    - 230 g
Maradék filament: 513 g
```

:::tip Tekercscímke-generátor
A **Eszközök → Címkék** menüpontban QR-kóddal ellátott címkéket nyomtathatsz a tekercseidhez. Olvasd be a kódot a telefonnal a tekercsprofil gyors megnyitásához.
:::
