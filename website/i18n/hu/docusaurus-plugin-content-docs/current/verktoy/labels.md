---
sidebar_position: 1
title: Címkék
description: QR-kódok, tekercscímkék termikus nyomtatókhoz (ZPL), színkártyák és megosztott színpalettók generálása a filamentraktárhoz
---

# Címkék

A címkézőeszköz professzionális címkéket generál a filamenttekercseitekhez — QR-kódokat, tekercscímkéket termikus nyomtatókhoz és színkártyákat a vizuális azonosításhoz.

Menj ide: **https://localhost:3443/#labels**

## QR-kódok

Generálj QR-kódokat, amelyek a filamentinformációhoz irányítanak a dashboardon:

1. Menj a **Címkék → QR-kódok** menüpontra
2. Válaszd ki azt a tekercset, amelyhez QR-kódot szeretnél generálni
3. A QR-kód automatikusan generálódik és megjelenik az előnézetben
4. Kattints a **PNG letöltése** vagy a **Nyomtatás** gombra

A QR-kód tartalmaz egy URL-t a filamentprofilhoz a dashboardon. Szkenneld be a mobiloddal a tekercs információinak gyors eléréséhez.

### Kötegelt generálás

1. Kattints az **Összes kijelölése** gombra, vagy jelöld be az egyes tekercscímkéket
2. Kattints az **Összes QR-kód generálása** gombra
3. Töltsd le ZIP-ként (tekercsenkénti PNG-vel), vagy nyomtasd ki az összeset egyszerre

## Tekercscímkék

Professzionális címkék termikus nyomtatókhoz, teljes tekercsinformációval:

### Címketartalom (alapértelmezett)

- Tekercsszín (kitöltött színblokk)
- Anyagnév (nagy betűkkel)
- Gyártó
- Szín hex-kódja
- Hőmérsékleti ajánlások (fúvóka és ágy)
- QR-kód
- Vonalkód (opcionális)

### ZPL termikus nyomtatókhoz

Generálj ZPL-kódot (Zebra Programming Language) Zebra, Brother és Dymo nyomtatókhoz:

1. Menj a **Címkék → Termikus nyomtatás** menüpontra
2. Válaszd ki a címkeméretet: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Válaszd ki a tekercset/tekercscímkéket
4. Kattints a **ZPL generálása** gombra
5. Küldd a ZPL-kódot a nyomtatónak:
   - **Közvetlen nyomtatás** (USB-kapcsolat)
   - **ZPL másolása** és küldése terminálos paranccsal
   - **Letöltés .zpl-fájlként**

:::tip Nyomtatóbeállítás
Az automatikus nyomtatáshoz konfiguráld a nyomtatóállomást a **Beállítások → Címkenyomtató** menüpontban IP-cím és port megadásával (alapértelmezett: 9100 RAW TCP-hez).
:::

### PDF-címkék

Hagyományos nyomtatókhoz generálj helyes méretű PDF-et:

1. Válaszd ki a címkeméretet a sablonból
2. Kattints a **PDF generálása** gombra
3. Nyomtasd öntapadós papírra (Avery vagy hasonló)

## Színkártyák

A színkártyák egy kompakt rács, amely vizuálisan megjeleníti az összes tekercset:

1. Menj a **Címkék → Színkártyák** menüpontra
2. Válaszd ki, mely tekercscímkék szerepeljenek (összes aktív, vagy manuális kijelölés)
3. Válaszd ki a kártyaformátumot: **A4** (4×8), **A3** (6×10), **Letter**
4. Kattints a **PDF generálása** gombra

Minden mező mutatja:
- Színblokk a tényleges színnel
- Anyagnév és szín hex-kód
- Anyagszám (gyors referenciához)

Ideális laminálásra és a nyomtatóállomásnál való felakasztásra.

## Megosztott színpalettók

Exportálj egy kiválasztott szín-összeállítást megosztott palettaként:

1. Menj a **Címkék → Színpalettók** menüpontra
2. Válaszd ki a palettába kerülő tekercscímkéket
3. Kattints a **Paletta megosztása** gombra
4. Másold a hivatkozást — mások importálhatják a palettát a saját dashboardjukba
5. A paletta megjelenik hex-kódokkal, és exportálható **Adobe Swatch** (`.ase`) vagy **Procreate** (`.swatches`) formátumba
