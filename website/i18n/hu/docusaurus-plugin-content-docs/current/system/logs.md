---
sidebar_position: 8
title: Szerverlnapló
description: Valós idejű szervernapló megtekintése, szűrés szint és modul szerint, valamint problémák elhárítása a Bambu Dashboardban
---

# Szervernapló

A szervernapló betekintést nyújt a Bambu Dashboard belső működésébe — hasznos hibaelhárításhoz, figyeléshez és diagnosztikához.

Navigálj ide: **https://localhost:3443/#logs**

## Valós idejű nézet

A naplófolyam valós időben frissül WebSocketen keresztül:

1. Navigálj a **Rendszer → Szervernapló** menüpontra
2. Az új napló sorok automatikusan megjelennek alul
3. Kattints az **Aljára zárolás** gombra, hogy mindig a legutóbbi naplóhoz görögj
4. Kattints a **Befagyasztás** gombra az automatikus görgetés leállításához és a meglévő sorok olvasásához

Az alapértelmezett nézet az utolsó 500 naplósort mutatja.

## Naplószintek

Minden naplósornak van szintje:

| Szint | Szín | Leírás |
|---|---|---|
| **ERROR** | Piros | A funkcionalitást érintő hibák |
| **WARN** | Narancssárga | Figyelmeztetések — valami rosszul mehet |
| **INFO** | Kék | Normál működési információ |
| **DEBUG** | Szürke | Részletes fejlesztői információ |

:::info Naplószint konfiguráció
Módosítsd a naplószintet a **Beállítások → Rendszer → Naplószint** menüponton. Normál működéshez használd az **INFO** szintet. A **DEBUG** szintet csak hibaelhárításhoz használd, mivel sokkal több adatot generál.
:::

## Szűrés

Használd a napló nézet tetején lévő szűrőeszköztárat:

1. **Naplószint** — csak ERROR / WARN / INFO / DEBUG megjelenítése, vagy kombinációjuk
2. **Modul** — szűrés rendszermodul szerint:
   - `mqtt` — MQTT kommunikáció nyomtatókkal
   - `api` — API kérések
   - `db` — adatbázis műveletek
   - `auth` — hitelesítési események
   - `queue` — nyomtatási sor eseményei
   - `guard` — Print Guard események
   - `backup` — biztonsági mentési műveletek
3. **Szabad szöveg** — keresés a napló szövegében (regex támogatott)
4. **Időpont** — szűrés dátumtartomány szerint

Kombináld a szűrőket a pontos hibaelhárításhoz.

## Gyakori hibás helyzetek

### MQTT csatlakozási problémák

Keresd az `mqtt` modulból származó naplósorokat:

```
ERROR [mqtt] A csatlakozás a XXXX nyomtatóhoz sikertelen: Connection refused
```

**Megoldás:** Ellenőrizd, hogy a nyomtató be van-e kapcsolva, a hozzáférési kód helyes-e, és a hálózat működik-e.

### Adatbázis hibák

```
ERROR [db] A v95 migráció sikertelen: SQLITE_CONSTRAINT
```

**Megoldás:** Készíts biztonsági mentést, és futtasd az adatbázis javítást a **Beállítások → Rendszer → Adatbázis javítása** menüponton.

### Hitelesítési hibák

```
WARN [auth] Sikertelen bejelentkezési kísérlet az admin felhasználóra a 192.168.1.x IP-ről
```

Sok sikertelen bejelentkezési kísérlet brute-force támadást jelezhet. Ellenőrizd, hogy szükséges-e az IP engedélyezési lista aktiválása.

## Naplók exportálása

1. Kattints a **Napló exportálása** gombra
2. Válassz időszakot (alapértelmezett: utolsó 24 óra)
3. Válassz formátumot: **TXT** (ember által olvasható) vagy **JSON** (gép által olvasható)
4. A fájl letöltődik

Az exportált naplók hasznosak hibajelentések benyújtásakor vagy ügyfélszolgálathoz való forduláskor.

## Napló-rotáció

A naplók automatikusan rotálódnak:

| Beállítás | Alapértelmezett |
|---|---|
| Max. napló fájlméret | 50 MB |
| Megtartandó rotált fájlok száma | 5 |
| Max. összes naplóméret | 250 MB |

Módosítás a **Beállítások → Rendszer → Napló-rotáció** menüponton. A régebbi naplófájlok automatikusan gzip-pel tömörítődnek.

## Naplófájl elhelyezkedése

A naplófájlok a szerveren tárolódnak:

```
./data/logs/
├── bambu-dashboard.log          (aktív napló)
├── bambu-dashboard.log.1.gz     (rotált)
├── bambu-dashboard.log.2.gz     (rotált)
└── ...
```

:::tip SSH hozzáférés
Naplók közvetlen olvasásához a szerveren SSH-n keresztül:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
