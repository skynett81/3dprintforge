---
sidebar_position: 3
title: Bambu Cloud integráció
description: Csatlakoztasd a dashboardot a Bambu Lab Cloudhoz modellek és nyomtatási előzmények szinkronizálásához
---

# Bambu Cloud integráció

A 3DPrintForge csatlakozhat a **Bambu Lab Cloudhoz** modellképek, nyomtatási előzmények és filamentadatok lekéréséhez. A dashboard tökéletesen működik felhőkapcsolat nélkül is, de a cloud integráció extra előnyöket nyújt.

## A cloud integráció előnyei

| Funkció | Cloud nélkül | Clouddal |
|---------|-------------|---------|
| Élő nyomtatóállapot | Igen | Igen |
| Nyomtatási előzmények (helyi) | Igen | Igen |
| Modellképek a MakerWorldről | Nem | Igen |
| Filamentprofilok a Bambútól | Nem | Igen |
| Nyomtatási előzmények szinkronizálása | Nem | Igen |
| AMS filament a felhőből | Nem | Igen |

## Csatlakozás a Bambu Cloudhoz

1. Navigálj a **Beállítások → Bambu Cloud** menüpontra
2. Add meg a Bambu Lab e-mail címedet és jelszavadat
3. Kattints a **Bejelentkezés** gombra
4. Válaszd ki, mely adatokat szinkronizálja

:::warning Adatvédelem
A felhasználónév és jelszó nem tárolódik plain text-ben. A dashboard a Bambu Labs API-ját használja OAuth token lekéréséhez, amely helyben tárolódik. Az adatok soha nem hagyják el a szerveredet.
:::

## Szinkronizálás

### Modellképek

Amikor a cloud csatlakoztatva van, a modellképek automatikusan lekérhetők a **MakerWorldről** és a következőkben jelennek meg:
- Nyomtatási előzmények
- Dashboard (aktív nyomtatás közben)
- 3D-modellnézet

### Nyomtatási előzmények

A cloud szinkronizálás importálja a nyomtatási előzményeket a Bambu Lab alkalmazásból. A duplikátumok automatikusan szűrésre kerülnek időbélyeg és sorozatszám alapján.

### Filamentprofilok

A Bambu Labs hivatalos filamentprofiljai szinkronizálódnak és megjelennek a filamentraktárban. Ezeket kiindulópontként használhatod saját profilokhoz.

## Mi működik cloud nélkül?

Az összes alapfunkció működik cloud kapcsolat nélkül:

- Közvetlen MQTT kapcsolat a nyomtatóhoz LAN-on keresztül
- Élő állapot, hőmérséklet, kamera
- Helyi nyomtatási előzmények és statisztika
- Filamentraktár (manuálisan kezelve)
- Értesítések és ütemező

:::tip Csak LAN mód
Szeretnéd a dashboardot teljesen internet-kapcsolat nélkül használni? Tökéletesen működik izolált hálózatban is — csak csatlakozz a nyomtatóhoz IP-n keresztül, és hagyd a cloud integrációt kikapcsolva.
:::

## Hibaelhárítás

**Bejelentkezés sikertelen:**
- Ellenőrizd, hogy az e-mail cím és jelszó helyes-e a Bambu Lab alkalmazáshoz
- Ellenőrizd, hogy a fiók kétfaktoros hitelesítést használ-e (még nem támogatott)
- Próbálj ki- és bejelentkezni

**Szinkronizálás leáll:**
- A token lejárhatott — jelentkezz ki és be újra a Beállítások alatt
- Ellenőrizd az internetkapcsolatot a szervereden
