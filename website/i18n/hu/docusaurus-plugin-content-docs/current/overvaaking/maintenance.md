---
sidebar_position: 4
title: Karbantartás
description: Kövesd nyomon a fúvókacseréket, kenést és más karbantartási feladatokat emlékeztetőkkel, intervallumokkal és költségnaplóval
---

# Karbantartás

A karbantartási modul segít megtervezni és nyomon követni a Bambu Lab nyomtatóid összes karbantartását — a fúvókacserétől a sínek kenéséig.

Navigálj ide: **https://localhost:3443/#maintenance**

## Karbantartási terv

A Bambu Dashboard előre konfigurált karbantartási intervallumokkal érkezik az összes Bambu Lab nyomtatómodellhez:

| Feladat | Intervallum (alap) | Modell |
|---|---|---|
| Fúvóka tisztítása | Minden 200 óra | Összes |
| Fúvókadó (réz) cseréje | Minden 500 óra | Összes |
| Fúvóka (edzett) cseréje | Minden 2000 óra | Összes |
| X tengely kenése | Minden 300 óra | X1C, P1S |
| Z tengely kenése | Minden 300 óra | Összes |
| AMS fogaskerék tisztítása | Minden 200 óra | AMS |
| Kamra tisztítása | Minden 500 óra | X1C |
| PTFE cső cseréje | Szükség szerint / 1000 óra | Összes |
| Kalibrálás (teljes) | Havonta | Összes |

Az összes intervallum testreszabható nyomtatónként.

## Fúvókasere napló

1. Navigálj a **Karbantartás → Fúvókák** menüpontra
2. Kattints a **Fúvókacsere naplózása** gombra
3. Töltsd ki:
   - **Dátum** — automatikusan a mai napra van beállítva
   - **Fúvóka anyaga** — Réz / Edzett acél / Réz / Rubinrúd
   - **Fúvóka átmérője** — 0,2 / 0,4 / 0,6 / 0,8 mm
   - **Márka/modell** — opcionális
   - **Ár** — a költségnaplóhoz
   - **Óra cserekor** — automatikusan lekérve a nyomtatási időszámlálóból
4. Kattints a **Mentés** gombra

A napló az összes fúvóka-előzményt dátum szerint rendezve mutatja.

:::tip Előzetes emlékeztető
Állíts be **Értesítés X órával előre** (pl. 50 óra) riasztást, hogy jó előre értesülj a következő ajánlott cseréről.
:::

## Karbantartási feladatok létrehozása

1. Kattints az **Új feladat** (+ ikon) gombra
2. Töltsd ki:
   - **Feladat neve** — pl. „Y tengely kenése"
   - **Nyomtató** — válassz érintett nyomtatót/nyomtatókat
   - **Intervallum típusa** — Óra / Nap / Nyomtatások száma
   - **Intervallum** — pl. 300 óra
   - **Utoljára elvégezve** — add meg, mikor volt utoljára elvégezve (visszamenőleges dátum)
3. Kattints a **Létrehozás** gombra

## Intervallumok és emlékeztetők

Az aktív feladatoknál a következők jelennek meg:
- **Zöld** — a következő karbantartásig > 50% az intervallumból
- **Sárga** — a következő karbantartásig < 50% maradt
- **Narancssárga** — a következő karbantartásig < 20% maradt
- **Piros** — a karbantartás lejárt

### Emlékeztetők konfigurálása

1. Kattints egy feladatra → **Szerkesztés**
2. Aktiváld az **Emlékeztetők** opciót
3. Állítsd be a **Értesítés ekkor** értéket, pl. 10% maradt az esedékességig
4. Válassz értesítési csatornát (lásd [Értesítések](../funksjoner/notifications))

## Megjelölés elvégzettként

1. Keresd meg a feladatot a listában
2. Kattints az **Elvégezve** (pipa ikon) gombra
3. Az intervallum visszaáll a mai dátumtól/órától
4. Naplóbejegyzés automatikusan létrejön

## Költségnapló

Az összes karbantartási feladathoz kapcsolódó költség:

- **Alkatrészek** — fúvókák, PTFE csövek, kenőanyagok
- **Idő** — felhasznált óra × órabér
- **Külső szerviz** — fizetett javítás

A költségek nyomtatónként összesítve jelennek meg a statisztika áttekintésben.

## Karbantartási előzmények

Navigálj a **Karbantartás → Előzmények** menüpontra a megtekintéshez:
- Az összes elvégzett karbantartási feladat
- Dátum, óra és költség
- Ki végezte (több felhasználós rendszerben)
- Megjegyzések és feljegyzések

Exportáld az előzményeket CSV-be könyvelési célokra.
