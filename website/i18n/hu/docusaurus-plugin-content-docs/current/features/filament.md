---
sidebar_position: 2
title: Filamentraktár
description: Kezeld a filamentorsókat, AMS-szinkronizálást, szárítást és egyebeket
---

# Filamentraktár

A filamentraktár teljes áttekintést nyújt az összes filamentorsóról, integrálva az AMS-szel és a nyomtatási előzményekkel.

## Áttekintés

A raktár az összes regisztrált orsót mutatja:

- **Szín** — vizuális színkártya
- **Anyag** — PLA, PETG, ABS, TPU, PA stb.
- **Szállító** — Bambu Lab, Polymaker, eSUN stb.
- **Súly** — fennmaradó gramm (becsült vagy mért)
- **AMS-nyílás** — melyik nyílásban van az orsó
- **Állapot** — aktív, üres, szárítás alatt, tárolt

## Orsók hozzáadása

1. Kattints az **+ Új orsó** gombra
2. Töltsd ki az anyagot, színt, szállítót és súlyt
3. Ha elérhető, olvasd be az NFC-cimkét, vagy írd be kézzel
4. Mentsd el

:::tip Bambu Lab orsók
A Bambu Lab hivatalos orsói automatikusan importálhatók a Bambu Cloud integráción keresztül. Lásd [Bambu Cloud](../getting-started/bambu-cloud).
:::

## AMS-szinkronizálás

Amikor a dashboard csatlakoztatva van a nyomtatóhoz, az AMS-állapot automatikusan szinkronizálódik:

- A nyílások a megfelelő színnel és anyaggal jelennek meg az AMS-ből
- A felhasználás minden nyomtatás után frissül
- Az üres orsók automatikusan megjelölődnek

Helyi orsó AMS-nyíláshoz való csatolásához:
1. Navigálj a **Filament → AMS** menüpontra
2. Kattints a csatolni kívánt nyílásra
3. Válaszd ki az orsót a raktárból

## Szárítás

Szárítási ciklusok rögzítése a nedvesség-kitettség nyomon követéséhez:

| Mező | Leírás |
|------|---------|
| Szárítás dátuma | Mikor szárították az orsót |
| Hőmérséklet | Szárítási hőmérséklet (°C) |
| Időtartam | Órák száma |
| Módszer | Sütő, szárítódoboz, filamentszárító |

:::info Ajánlott szárítási hőmérsékletek
Anyag-specifikus szárítási időkért és hőmérsékletekért lásd a [Tudásbázist](../kb/intro).
:::

## Színkártyák

A színkártya-nézet vizuálisan rendezi az orsókat szín szerint. Hasznos a megfelelő szín gyors megtalálásához. Szűrj anyagra, szállítóra vagy állapotra.

## NFC-cimkék

A 3DPrintForge NFC-cimkéket támogat az orsók gyors azonosításához:

1. Írd be az NFC-cimke azonosítóját az orsóhoz a raktárban
2. Olvasd be a cimkét a telefonnal
3. Az orsó közvetlenül megnyílik a dashboardban

## Import és export

### Export
Az egész raktár exportálása CSV-ként: **Filament → Export → CSV**

### Import
Orsók importálása CSV-ből: **Filament → Import → Fájl kiválasztása**

CSV formátum:
```
nev,anyag,szin_hex,szallito,suly_gramm,nfc_id
PLA Fehér,PLA,#FFFFFF,Bambu Lab,1000,
PETG Fekete,PETG,#000000,Polymaker,850,ABC123
```

## Statisztika

A **Filament → Statisztika** menüpont alatt találod:

- Összes felhasználás anyagonként (utolsó 30/90/365 nap)
- Felhasználás nyomtatónként
- Becsült hátralévő élettartam orsónként
- Legtöbbet használt színek és szállítók
