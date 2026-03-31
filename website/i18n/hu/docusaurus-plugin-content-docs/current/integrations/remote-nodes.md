---
sidebar_position: 4
title: Távoli csomópontok
description: Köss össze több 3DPrintForge példányt, hogy az összes nyomtatót egy központi dashboardból lásd
---

# Távoli csomópontok (Remote Nodes)

A távoli csomópontok funkció lehetővé teszi több 3DPrintForge példány összekapcsolását, hogy az összes nyomtatót egy központi felületből lássad és irányítsd — függetlenül attól, hogy ugyanabban a hálózatban vagy különböző helyszíneken találhatók.

Navigálj ide: **https://localhost:3443/#settings** → **Integrációk → Távoli szerverek**

## Felhasználási esetek

- **Otthon + irodában** — Mindkét helyszín nyomtatóit látod ugyanabból a dashboardból
- **Makerspace** — Központi dashboard a szoba összes példányához
- **Vendégpéldányok** — Korlátozott betekintés az ügyfeleknek teljes hozzáférés nélkül

## Architektúra

```
Elsődleges példány (a te számítógéped)
  ├── A nyomtató (helyi MQTT)
  ├── B nyomtató (helyi MQTT)
  └── Távoli szerver: Másodlagos példány
        ├── C nyomtató (MQTT a távoli helyszínen)
        └── D nyomtató (MQTT a távoli helyszínen)
```

Az elsődleges példány REST API-n keresztül kérdezi le a távoli szervereket, és helyben összesíti az adatokat.

## Távoli szerver hozzáadása

### 1. lépés: API-kulcs generálása a távoli példányon

1. Jelentkezz be a távoli példányba (pl. `https://192.168.2.50:3443`)
2. Navigálj a **Beállítások → API kulcsok** menüpontra
3. Kattints az **Új kulcs** gombra → adj nevet „Elsődleges csomópont"-nak
4. Állítsd be az engedélyeket: **Olvasás** (minimum) vagy **Olvasás + Írás** (távirányításhoz)
5. Másold a kulcsot

### 2. lépés: Csatlakozás az elsődleges példányból

1. Navigálj a **Beállítások → Távoli szerverek** menüpontra
2. Kattints a **Távoli szerver hozzáadása** gombra
3. Töltsd ki:
   - **Név**: pl. „Iroda" vagy „Garázs"
   - **URL**: `https://192.168.2.50:3443` vagy külső URL
   - **API kulcs**: az 1. lépésből
4. Kattints a **Kapcsolat tesztelése** gombra
5. Kattints a **Mentés** gombra

:::warning Önaláírt tanúsítvány
Ha a távoli példány önaláírt tanúsítványt használ, aktiváld a **TLS hibák figyelmen kívül hagyása** opciót — de ezt csak belső hálózati kapcsolatokhoz tedd meg.
:::

## Összesített nézet

A csatlakozás után a távoli nyomtatók a következőkben jelennek meg:

- **Flottaáttekintés** — a távoli szerver nevével és felhő ikonnal jelölve
- **Statisztika** — összesítve az összes példányon keresztül
- **Filamentraktár** — összesített áttekintés

## Távirányítás

**Olvasás + Írás** engedéllyel közvetlenül irányíthatod a távoli nyomtatókat:

- Szünet / Folytatás / Leállítás
- Hozzáadás a nyomtatási sorhoz (a feladat a távoli példányra kerül küldésre)
- Kamerafolyam megtekintése (a távoli példányon keresztül proxyolva)

:::info Késés
A kamerafolyam a távoli szerveren keresztül észlelhető késéssel járhat a hálózati sebességtől és távolságtól függően.
:::

## Hozzáférés-vezérlés

Korlátozd, mely adatokat oszt meg a távoli szerver:

1. A távoli példányon: navigálj a **Beállítások → API kulcsok → [Kulcsnév]** menüpontra
2. Korlátozd a hozzáférést:
   - Csak konkrét nyomtatókhoz
   - Kamerafolyam nélkül
   - Írásvédett (csak olvasás)

## Állapot és figyelés

Minden távoli szerver állapota a **Beállítások → Távoli szerverek** menüponton jelenik meg:

- **Csatlakoztatva** — az utolsó lekérdezés sikeres volt
- **Offline** — nem érhető el a távoli szerver
- **Hitelesítési hiba** — az API kulcs érvénytelen vagy lejárt
- **Utolsó szinkronizálás** — az utolsó sikeres adatszinkronizálás időbélyege
