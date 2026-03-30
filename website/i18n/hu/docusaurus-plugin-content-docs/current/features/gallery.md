---
sidebar_position: 8
title: Galéria
description: Tekintsd meg az összes nyomtatásnál 25, 50, 75 és 100%-os haladásnál automatikusan készített mérföldkő-képernyőképeket
---

# Galéria

A galéria gyűjti az egyes nyomtatások során automatikusan készített képernyőképeket. A képek rögzített mérföldkőknél készülnek, és vizuális naplót adnak a nyomtatás fejlődéséről.

Navigálj ide: **https://localhost:3443/#gallery**

## Mérföldkő-képernyőképek

A Bambu Dashboard automatikusan képernyőképet készít a kameráról a következő mérföldkőknél:

| Mérföldkő | Időpont |
|---|---|
| **25%** | Negyed úttal a nyomtatásban |
| **50%** | Félúton |
| **75%** | Háromnegyed úttal |
| **100%** | Nyomtatás befejezve |

A képernyőképek az adott nyomtatási előzmény-bejegyzéshez kapcsolódnak, és a galériában jelennek meg.

:::info Követelmények
A mérföldkő-képernyőképekhez a kamerának csatlakoztatva és aktívnak kell lennie. Letiltott kamerák nem generálnak képeket.
:::

## A képernyőkép funkció aktiválása

1. Navigálj a **Beállítások → Galéria** menüpontra
2. Kapcsold be az **Automatikus mérföldkő-képernyőképek** opciót
3. Válaszd ki, melyik mérföldkőket szeretnéd aktiválni (mind a négy alapértelmezetten be van kapcsolva)
4. Válassz **Képminőséget**: Alacsony (640×360) / Közepes (1280×720) / Magas (1920×1080)
5. Kattints a **Mentés** gombra

## Képmegjelenítés

A galéria nyomtatásonként van rendezve:

1. Használd a felső **szűrőt** a nyomtató, dátum vagy fájlnév kiválasztásához
2. Kattints egy nyomtatás-sorra a kibontáshoz és mind a négy kép megtekintéséhez
3. Kattints egy képre az előnézet megnyitásához

### Előnézet

Az előnézet a következőket mutatja:
- Teljes méretű kép
- Mérföldkő és időbélyeg
- Nyomtatás neve és nyomtató
- **←** / **→** az ugyanabban a nyomtatásban lévő képek közötti lapozáshoz

## Teljes képernyős nézet

Kattints a **Teljes képernyő** gombra (vagy nyomj `F`-et) az előnézetben a teljes képernyő kitöltéséhez. Használd a nyílbillentyűket a képek közötti lapozáshoz.

## Képek letöltése

- **Egyetlen kép**: Kattints a **Letöltés** gombra az előnézetben
- **Nyomtatás összes képe**: Kattints az **Összes letöltése** gombra a nyomtatás sorában — `.zip` fájlt kapsz
- **Több kiválasztása**: Jelöld be a jelölőnégyzeteket, és kattints a **Kijelöltek letöltése** gombra

## Képek törlése

:::warning Tárhely
A galériafotók idővel jelentős helyet foglalhatnak. Állíts be automatikus törlést a régi képekhez.
:::

### Manuális törlés

1. Válassz ki egy vagy több képet (jelöld be)
2. Kattints a **Kijelöltek törlése** gombra
3. Erősítsd meg a párbeszédablakban

### Automatikus takarítás

1. Navigálj a **Beállítások → Galéria → Automatikus takarítás** menüpontra
2. Aktiváld a **Ennél régebbi képek törlése** opciót
3. Add meg a napok számát (pl. 90 nap)
4. A takarítás automatikusan fut minden éjjel 03:00-kor

## Kapcsolat a nyomtatási előzményekkel

Minden kép egy előzmény-bejegyzéshez van kapcsolva:

- Kattints a **Megtekintés az előzményekben** gombra egy galériabeli nyomtatásnál az előzmény-bejegyzésre ugráshoz
- Az előzményekben megjelenik a 100%-os kép bélyegképe, ha elérhető

## Megosztás

Galériafotók megosztása időkorlátos linkkel:

1. Nyisd meg a képet az előnézetben
2. Kattints a **Megosztás** gombra
3. Válassz lejárati időt, és másold a linket
