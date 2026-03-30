---
sidebar_position: 7
title: Időköz-felvétel
description: Aktiválj automatikus időköz-felvételt a 3D nyomtatásokhoz, kezeld a videókat, és játszd le azokat közvetlenül a dashboardban
---

# Időköz-felvétel

A Bambu Dashboard automatikusan képeket készíthet nyomtatás közben, és összefűzi azokat egy időköz-felvétel videóvá. A videók helyben tárolódnak, és közvetlenül a dashboardban lejátszhatók.

Navigálj ide: **https://localhost:3443/#timelapse**

## Aktiválás

1. Navigálj a **Beállítások → Időköz-felvétel** menüpontra
2. Kapcsold be az **Időköz-felvétel engedélyezése** opciót
3. Válassz **Felvételi módot**:
   - **Rétegenként** — egy kép rétegenként (ajánlott magas minőséghez)
   - **Időalapú** — egy kép minden N másodpercben (pl. minden 30. másodpercben)
4. Válaszd ki, melyik nyomtatókhoz legyen időköz-felvétel aktiválva
5. Kattints a **Mentés** gombra

:::tip Képintervallum
A „Rétegenként" mód egyenletes animációt ad, mert a mozgás konzisztens. Az „Időalapú" mód kevesebb tárhelyet használ.
:::

## Felvételi beállítások

| Beállítás | Alapértelmezett | Leírás |
|---|---|---|
| Felbontás | 1280×720 | Képméret (640×480 / 1280×720 / 1920×1080) |
| Képminőség | 85% | JPEG tömörítési minőség |
| FPS a videóban | 30 | Képkocka per másodperc a kész videóban |
| Videoformátum | MP4 (H.264) | Kimeneti formátum |
| Kép forgatása | Ki | Forgatás 90°/180°/270° a csatolási irányhoz |

:::warning Tárhely
Egy 500 képből álló, 1080p minőségű időköz-felvétel körülbelül 200–400 MB-t használ összefűzés előtt. A kész MP4 videó általában 20–80 MB.
:::

## Tárolás

Az időköz-felvétel képei és videói a `data/timelapse/` könyvtárban tárolódnak a projekt mappájában. A struktúra nyomtatónként és nyomtatásonként van szervezve:

```
data/timelapse/
├── <nyomtato-id>/                     ← Egyedi nyomtató azonosító
│   ├── 2026-03-22_modellnev/          ← Nyomtatás-munkamenet (datum_modellnev)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                        ← Nyers képek (összefűzés után törlődnek)
│   ├── 2026-03-22_modellnev.mp4       ← Kész időköz-felvétel videó
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_telefonallvany.mp4
├── <nyomtato-id-2>/                   ← Több nyomtató esetén
│   └── ...
```

:::tip Külső tárolás
A rendszerlemez helyének megspórolásához szimlinket hozhatsz létre az időköz-felvétel mappájához egy külső lemezre:
```bash
# Példa: áthelyezés a /mnt/storage-ra csatolt külső lemezre
mv data/timelapse /mnt/storage/timelapse

# Szimlink visszafelé létrehozása
ln -s /mnt/storage/timelapse data/timelapse
```
A dashboard automatikusan követi a szimlinket. Bármilyen lemezt vagy hálózati megosztást használhatsz.
:::

## Automatikus összefűzés

Amikor a nyomtatás kész, a képek automatikusan összefűzésre kerülnek videóvá ffmpeg segítségével:

1. A Bambu Dashboard fogadja a „print complete" eseményt az MQTT-ről
2. Az ffmpeg meghívódik az összegyűjtött képekkel
3. A videó a tárolási mappába kerül
4. Az időköz-felvétel oldal frissül az új videóval

A haladást az **Időköz-felvétel → Feldolgozás** fülön láthatod.

## Lejátszás

1. Navigálj a **https://localhost:3443/#timelapse** oldalra
2. Válassz nyomtatót a legördülő listából
3. Kattints egy videóra a listában a lejátszáshoz
4. Használd a lejátszási vezérlőket:
   - ▶ / ⏸ — Lejátszás / Szünet
   - ⏪ / ⏩ — Visszatekerés / Előretekerés
   - Sebesség gombok: 0,5× / 1× / 2× / 4×
5. Kattints a **Teljes képernyő** gombra a teljes képernyős megjelenítéshez
6. Kattints a **Letöltés** gombra az MP4 fájl letöltéséhez

## Időköz-felvétel törlése

1. Válaszd ki a videót a listában
2. Kattints a **Törlés** (kuka ikon) gombra
3. Erősítsd meg a párbeszédablakban

:::danger Végleges törlés
A törölt időköz-felvétel videók és nyers képek nem állíthatók vissza. Töltsd le a videót először, ha meg szeretnéd tartani.
:::

## Időköz-felvétel megosztása

Az időköz-felvétel videók időkorlátos linkkel megoszthatók:

1. Válaszd ki a videót, és kattints a **Megosztás** gombra
2. Állítsd be a lejárati időt (1 óra / 24 óra / 7 nap / lejárat nélkül)
3. Másold a generált linket, és oszd meg
4. A fogadónak nem kell bejelentkeznie a videó megtekintéséhez
