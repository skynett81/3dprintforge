---
sidebar_position: 2
title: Biztonsági mentés
description: 3DPrintForge adatok biztonsági mentésének létrehozása, visszaállítása és automatikus ütemezése
---

# Biztonsági mentés

A 3DPrintForge az összes konfigurációt, előzményt és adatot biztonsági mentésbe tudja helyezni, hogy egyszerűen visszaállítható legyen rendszerhiba, szervermigráció vagy frissítési problémák esetén.

Navigálj ide: **https://localhost:3443/#settings** → **Rendszer → Biztonsági mentés**

## Mi szerepel a biztonsági mentésben

| Adattípus | Benne van | Megjegyzés |
|---|---|---|
| Nyomtatókonfiguráció | ✅ | |
| Nyomtatási előzmények | ✅ | |
| Filamentraktár | ✅ | |
| Felhasználók és szerepek | ✅ | A jelszavak hashelve tárolódnak |
| Beállítások | ✅ | Értesítési konfigurációkat is beleértve |
| Karbantartási napló | ✅ | |
| Projektek és számlák | ✅ | |
| Fájlkönyvtár (metaadatok) | ✅ | |
| Fájlkönyvtár (fájlok) | Opcionális | Nagy lehet |
| Időköz-felvétel videók | Opcionális | Nagyon nagy lehet |
| Galériafotók | Opcionális | |

## Manuális biztonsági mentés létrehozása

1. Navigálj a **Beállítások → Biztonsági mentés** menüpontra
2. Válaszd ki, mit szeretnél belefoglalni (lásd a fenti táblázatot)
3. Kattints a **Biztonsági mentés létrehozása most** gombra
4. Haladásjelző jelenik meg a mentés létrehozása közben
5. Kattints a **Letöltés** gombra, ha a mentés kész

A mentés `.zip` fájlként kerül mentésre időbélyeggel a fájlnévben:
```
3dprintforge-backup-2026-03-22T14-30-00.zip
```

## Biztonsági mentés letöltése

A mentési fájlok a szerveren lévő mentési mappában tárolódnak (konfigurálható). Ezenkívül közvetlenül is letölthetők:

1. Navigálj a **Biztonsági mentés → Meglévő mentések** menüpontra
2. Keresd meg a mentést a listában (dátum szerint rendezve)
3. Kattints a **Letöltés** (letöltés ikon) gombra

:::info Tárolási mappa
Alapértelmezett tárolási mappa: `./data/backups/`. Módosítás a **Beállítások → Biztonsági mentés → Tárolási mappa** menüponton.
:::

## Automatikus ütemezett biztonsági mentés

1. Aktiváld az **Automatikus biztonsági mentés** opciót a **Biztonsági mentés → Ütemezés** menüponton
2. Válassz intervallumot:
   - **Napi** — 03:00-kor fut (konfigurálható)
   - **Heti** — meghatározott napon és időpontban
   - **Havi** — a hónap első napján
3. Válaszd ki a **Megtartandó mentések számát** (pl. 7 — a régebbiek automatikusan törlődnek)
4. Kattints a **Mentés** gombra

:::tip Külső tárolás
Fontos adatok esetén: csatolj egy külső lemezt vagy hálózati meghajtót mentési mappaként. Ekkor a mentések akkor is megmaradnak, ha a rendszerlemez meghibásodik.
:::

## Visszaállítás biztonsági mentésből

:::warning A visszaállítás felülírja a meglévő adatokat
A visszaállítás az összes meglévő adatot a mentési fájl tartalmával helyettesíti. Győződj meg róla, hogy van egy friss mentésed a jelenlegi adatokról.
:::

### Szerveren lévő meglévő mentésből

1. Navigálj a **Biztonsági mentés → Meglévő mentések** menüpontra
2. Keresd meg a mentést a listában
3. Kattints a **Visszaállítás** gombra
4. Erősítsd meg a párbeszédablakban
5. A rendszer automatikusan újraindul visszaállítás után

### Letöltött mentési fájlból

1. Kattints a **Mentés feltöltése** gombra
2. Válaszd ki a `.zip` fájlt a számítógépedről
3. A fájl érvényesítődik — látni fogod, mi szerepel benne
4. Kattints a **Visszaállítás fájlból** gombra
5. Erősítsd meg a párbeszédablakban

## Biztonsági mentés érvényesítése

A 3DPrintForge visszaállítás előtt érvényesíti az összes mentési fájlt:

- Ellenőrzi, hogy a ZIP formátum érvényes-e
- Ellenőrzi, hogy az adatbázis séma kompatibilis-e az aktuális verzióval
- Figyelmeztetést jelenít meg, ha a mentés régebbi verzióból származik (a migráció automatikusan elvégződik)
