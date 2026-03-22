---
sidebar_position: 2
title: Warping
description: A warping okai és megoldásai — zárt kamra, brim, hőmérséklet és draft shield
---

# Warping

A warping akkor következik be, amikor a nyomat sarkai vagy élei felemelkednek a lemezről nyomtatás közben vagy után. Az anyag hőtágulásából ered.

## Mi az a warping?

Amikor a műanyag lehűl, összezsugorodik. A felső rétegek melegebbek, mint az alsók — ez feszültséget hoz létre, amely felfelé húzza az éleket és meghajlítja a nyomatot. Minél nagyobb a hőmérséklet-különbség, annál több a warping.

## Leginkább érintett anyagok

| Anyag | Warping kockázata | Zárt kamra szükséges |
|-------|------------------|---------------------|
| PLA | Alacsony | Nem |
| PETG | Alacsony–Közepes | Nem |
| ABS | Magas | Igen |
| ASA | Magas | Igen |
| PA/Nylon | Nagyon magas | Igen |
| PC | Nagyon magas | Igen |
| TPU | Alacsony | Nem |

## Megoldások

### 1. Használj zárt kamrát

A legfontosabb intézkedés ABS, ASA, PA és PC esetén:
- Tartsd a kamra hőmérsékletét 40–55 °C-on a legjobb eredményért
- X1C és P1S: aktiváld a kamraventilátorok „zárt" módját
- A1/P1P: használj fedősapkát a hő megtartásához

### 2. Használj brimet

A brim egy réteg extra széles él, amely rögzíti a nyomatot a lemezhez:

```
Bambu Studio:
1. Válaszd ki a nyomatot a slicerben
2. Menj a Támogatás → Brim menüpontra
3. Állítsd be a szélességet 5–10 mm-re (minél több a warping, annál szélesebb)
4. Típus: Outer Brim Only (ajánlott)
```

:::tip Brim-szélesség útmutató
- PLA (ritkán szükséges): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Növeld az ágy hőmérsékletét

A magasabb ágy-hőmérséklet csökkenti a rétegek közötti hőmérséklet-különbséget:
- ABS: Próbálj 105–110 °C-ot
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Csökkentsd a részleges hűtést

Warpingra hajlamos anyagoknál — csökkentsd vagy kapcsold ki a részleges hűtést:
- ABS/ASA: 0–20% részleges hűtés
- PA: 0–30% részleges hűtés

### 5. Kerüld a huzatot és a hideg levegőt

Tartsd a nyomtatót távol:
- Ablaktól és kültéri ajtóktól
- Légkondicionálótól és ventilátortól
- A helyiségben lévő huzatoktól

P1P és A1 esetén: nyomtatás közben takard be a nyílásokat kartonnal kritikus nyomtatásoknál.

### 6. Draft Shield

A draft shield egy vékony fal az objektum körül, amely belülről tartja a meleget:

```
Bambu Studio:
1. Menj a Támogatás → Draft Shield menüpontra
2. Aktiváld, és állítsd be a távolságot (3–5 mm)
```

Különösen hasznos magas, karcsú objektumoknál.

### 7. Modelldesign-intézkedések

Saját modellek tervezésekor:
- Kerüld a nagy lapos fenekeket (adj hozzá chanfer/lekerekítést a sarkokhoz)
- Oszd fel a nagy lapos részeket kisebb szekciókra
- Használj „egérfüleket" — kis köröket a sarkokban — a slicerben vagy CAD-ban

## Warping lehűlés után

Néha a nyomat jól néz ki, de a warping a lemezről való eltávolítás után következik be:
- Mindig várd meg, amíg a lemez és a nyomat **teljesen lehűl** (40 °C alatt), mielőtt eltávolítod
- ABS esetén: hagyd lehűlni a zárt kamrában a lassabb hűlésért
- Kerüld a meleg nyomat hideg felületre helyezését
