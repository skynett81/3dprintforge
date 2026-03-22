---
sidebar_position: 7
title: Jelentések
description: Automatikus heti és havi e-mail jelentések statisztikákkal, tevékenységösszefoglalóval és karbantartási emlékeztetőkkel
---

# Jelentések

A Bambu Dashboard automatikus e-mail jelentéseket tud küldeni statisztikákkal és tevékenységösszefoglalóval — hetente, havonta vagy mindkettő.

Navigálj ide: **https://localhost:3443/#settings** → **Rendszer → Jelentések**

## Előfeltételek

A jelentések megkövetelik az e-mail értesítések konfigurálását. Állítsd be az SMTP-t a **Beállítások → Értesítések → E-mail** menüponton, mielőtt aktiválnád a jelentéseket. Lásd: [Értesítések](../funksjoner/notifications).

## Automatikus jelentések aktiválása

1. Navigálj a **Beállítások → Jelentések** menüpontra
2. Aktiváld a **Heti jelentés** és/vagy a **Havi jelentés** opciót
3. Válassz **Küldési időpontot**:
   - Heti: hét napja és időpontja
   - Havi: hónap napja (pl. 1. / utolsó péntek)
4. Add meg a **Címzett e-mail** mezőt (több cím vesszővel elválasztva)
5. Kattints a **Mentés** gombra

Küldj egy tesztjelentést a formátum megtekintéséhez: kattints a **Tesztjelentés küldése most** gombra.

## Heti jelentés tartalma

A heti jelentés az utolsó 7 napot fedi le:

### Összefoglaló
- Összes nyomtatás száma
- Sikeres / sikertelen / megszakított nyomtatások száma
- Sikerességi arány és változás az előző héthez képest
- Legaktívabb nyomtató

### Tevékenység
- Napi nyomtatások (minigrafikon)
- Összes nyomtatási óra
- Összes filamentfelhasználás (gramm és költség)

### Filament
- Anyag- és gyártónkénti felhasználás
- Becsült maradék tekercsenkénti (20% alatti tekercseknél kiemelve)

### Karbantartás
- Ezen a héten elvégzett karbantartási feladatok
- Lejárt karbantartási feladatok (piros figyelmeztetés)
- Következő héten esedékes feladatok

### HMS-hibák
- HMS-hibák száma ezen a héten nyomtatónként
- Nyugtázatlan hibák (figyelmet igényelnek)

## Havi jelentés tartalma

A havi jelentés az utolsó 30 napot fedi le, és tartalmaz mindent a heti jelentésből, plusz:

### Trend
- Összehasonlítás az előző hónappal (%)
- Tevékenységtérkép (havi hőtérkép-miniatűr)
- Havi sikerességi arány alakulása

### Költségek
- Összes filamentköltsége
- Összes energiaköltség (ha az energiafelügyelet konfigurálva van)
- Összes kopási költség
- Összesített karbantartási költség

### Kopás és egészség
- Nyomtatónkénti egészségpontszám (változással az előző hónaphoz képest)
- Cseréhez közelítő komponensek

### Statisztikai kiemelések
- Leghosszabb sikeres nyomtatás
- Legtöbbet használt filamenttípus
- Legmagasabb aktivitású nyomtató

## Jelentés testreszabása

1. Navigálj a **Beállítások → Jelentések → Testreszabás** menüpontra
2. Jelöld be/ki az includálni kívánt szekciókat
3. Válassz **Nyomtatószűrőt**: összes nyomtató vagy egy választék
4. Válassz **Logó megjelenítést**: mutassa a Bambu Dashboard logót a fejlécben, vagy kapcsolja ki
5. Kattints a **Mentés** gombra

## Jelentésarchívum

Az összes elküldött jelentés tárolódik és újra megnyitható:

1. Navigálj a **Beállítások → Jelentések → Archívum** menüpontra
2. Válassz jelentést a listából (dátum szerint rendezve)
3. Kattints a **Megnyitás** gombra a HTML-verzió megtekintéséhez
4. Kattints a **PDF letöltése** gombra a jelentés letöltéséhez

A jelentések automatikusan törlődnek **90 nap** után (konfigurálható).
