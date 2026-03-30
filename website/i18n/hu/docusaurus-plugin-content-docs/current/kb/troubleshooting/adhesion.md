---
sidebar_position: 1
title: Gyenge tapadás
description: A gyenge első réteg tapadásának okai és megoldásai — lemez, hőmérséklet, ragasztóstift, sebesség, Z-eltolás
---

# Gyenge tapadás

A gyenge tapadás az egyik leggyakoribb probléma a 3D nyomtatásban. Az első réteg nem tapad, vagy a nyomatok félidőben leválnak.

## Tünetek

- Az első réteg nem tapad — a nyomat elmozdul vagy felemelkedik
- A sarkok és élek felemelkednek (warping)
- A nyomat a munka közepén leválik
- Egyenetlen első réteg lyukakkal vagy laza szálakkal

## Ellenőrzőlista — próbáld ki ebben a sorrendben

### 1. Tisztítsd meg a lemezt
A gyenge tapadás leggyakoribb oka a zsír vagy szennyeződés a lemezen.

```
1. Töröld le a lemezt IPA-val (izopropil-alkohol)
2. Kerüld a nyomtatási felület érintését csupasz ujjal
3. Tartós problémák esetén: mosd meg vízzel és enyhe mosogatószerrel
```

### 2. Kalibráld a Z-eltolást

A Z-eltolás a fúvóka és a lemez közötti magasság az első rétegnél. Túl magas = a szál lazán lóg. Túl alacsony = a fúvóka kapargatja a lemezt.

**Helyes Z-eltolás:**
- Az első réteg enyhén átlátszónak kell látszani
- A szálat le kell nyomni a lemezre, egy kis "squish"-sel
- A szálaknak enyhén össze kell olvadniuk

Állítsd be a Z-eltolást a **Vezérlés → Élő Z-állítás** menüponton keresztül nyomtatás közben.

:::tip Élő beállítás nyomtatás közben
A Bambu Dashboard Z-eltolás-állítási gombokat mutat aktív nyomtatás közben. Állítsd be ±0,02 mm-es lépésekben, miközben figyeled az első réteget.
:::

### 3. Ellenőrizd az ágy hőmérsékletét

| Anyag | Túl alacsony hőmérséklet | Ajánlott |
|-------|--------------------------|---------|
| PLA | 30 °C alatt | 35–45 °C |
| PETG | 60 °C alatt | 70–85 °C |
| ABS | 80 °C alatt | 90–110 °C |
| TPU | 25 °C alatt | 30–45 °C |

Próbálj meg egyszerre 5 °C-kal növelni az ágy hőmérsékletét.

### 4. Használj ragasztóstiftet

A ragasztóstift javítja a tapadást a legtöbb anyagnál és a legtöbb lemezen:
- Vits fel vékony, egyenletes réteget
- Hagyd megszáradni 30 másodpercig az indítás előtt
- Különösen fontos: ABS, PA, PC, PETG (sima PEI-en)

### 5. Csökkentsd az első réteg sebességét

Az első rétegnél alacsonyabb sebesség jobb kontaktust biztosít a filament és a lemez között:
- Normál: 50 mm/s az első réteghez
- Próbálj: 30–40 mm/s
- Bambu Studio: a **Minőség → Első réteg sebessége** menüponton

### 6. Ellenőrizd a lemez állapotát

Egy elkopott lemez gyenge tapadást okoz még tökéletes beállítások esetén is. Cseréld ki a lemezt, ha:
- A PEI-bevonat láthatóan sérült
- A tisztítás nem segít

### 7. Használj brimet

Warpingra hajlamos anyagoknál (ABS, PA, nagy lapos objektumok):
- Adj hozzá brimet a slicerben: 5–10 mm szélesség
- Növeli a kontaktfelületet és lenyomja az éleket

## Speciális esetek

### Nagy lapos objektumok
A nagy lapos objektumok a legérzékenyebbek a leválásra. Intézkedések:
- Brim 8–10 mm
- Növeld az ágy hőmérsékletét
- Zárd le a kamrát (ABS/PA)
- Csökkentsd a részleges hűtést

### Mázszerű felületek
A túl sok ragasztóstifttel kezelt lemezek idővel mázszerűvé válhatnak. Mosd meg alaposan vízzel, és kezdj újra.

### Filamentcsere után
A különböző anyagok különböző beállításokat igényelnek. Ellenőrizd, hogy az ágy hőmérséklete és a lemez konfigurálva van-e az új anyaghoz.
