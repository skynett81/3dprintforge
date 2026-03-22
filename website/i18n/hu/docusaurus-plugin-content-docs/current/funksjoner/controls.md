---
sidebar_position: 5
title: Nyomtatóvezérlés
description: Szabályozd a hőmérsékletet, sebességet, ventilátorokat, és küldj G-kódot közvetlenül a nyomtatóra
---

# Nyomtatóvezérlés

A vezérlőpanel teljes manuális irányítást biztosít a nyomtató felett közvetlenül a dashboardból.

## Hőmérséklet-szabályozás

### Fúvóka
- Célhőmérséklet beállítása 0–350 °C között
- Kattints a **Beállítás** gombra a parancs elküldéséhez
- A valós idejű leolvasás animált gyűrűmérővel jelenik meg

### Fűtőágy
- Célhőmérséklet beállítása 0–120 °C között
- Automatikus kikapcsolás nyomtatás után (konfigurálható)

### Kamra
- Kamrahőmérséklet megtekintése (valós idejű leolvasás)
- **X1E, H2S, H2D, H2C**: Aktív kamrafűtés vezérlése M141 paranccsal (szabályozható célhőmérséklet)
- **X1C**: Passzív burkolat — a kamrahőmérséklet megjelenik, de nem vezérelhető közvetlenül
- **P1S**: Passzív burkolat — hőmérsékletet mutat, nincs aktív kamrafűtés-vezérlés
- **P1P, A1, A1 mini és H sorozat chamberHeat nélkül**: Nincs kamraérzékelő

:::warning Maximális hőmérsékletek
Ne lépd túl a fúvóka és az ágy ajánlott hőmérsékleteit. Edzett acél fúvókánál (HF típus): max. 300 °C. Réznél: max. 260 °C. Lásd a nyomtató kézikönyvét.
:::

## Sebességprofilok

A sebességvezérlés négy előre beállított profilt kínál:

| Profil | Sebesség | Alkalmazás |
|--------|----------|------------|
| Csendes | 50% | Zajcsökkentés, éjszakai nyomtatás |
| Normál | 100% | Normál használat |
| Sport | 124% | Gyorsabb nyomtatások |
| Turbo | 166% | Maximális sebesség (minőségcsökkenéssel) |

A csúszka lehetővé teszi egyedi százalék beállítását 50–200% között.

## Ventilátorvezérlés

A ventilátorsebességek manuális vezérlése:

| Ventilátor | Leírás | Tartomány |
|------------|---------|-----------|
| Part cooling fan | Kinyomtatott tárgy hűtése | 0–100% |
| Auxiliary fan | Kamra-cirkuláció | 0–100% |
| Chamber fan | Aktív kamrahűtés | 0–100% |

:::tip Ajánlott beállítások
- **PLA/PETG:** Alkatrészhűtés 100%, aux 30%
- **ABS/ASA:** Alkatrészhűtés 0–20%, kamraventilátor ki
- **TPU:** Alkatrészhűtés 50%, alacsony sebesség
:::

## G-kód konzol

G-kód parancsok közvetlen küldése a nyomtatóra:

```gcode
; Példa: Fejpozíció mozgatása
G28 ; Összes tengely kezdőpozícióba
G1 X150 Y150 Z10 F3000 ; Mozgás a középre
M104 S220 ; Fúvóka hőmérsékletének beállítása
M140 S60  ; Ágy hőmérsékletének beállítása
```

:::danger Légy óvatos a G-kóddal
Helytelen G-kód megrongálhatja a nyomtatót. Csak olyan parancsokat küldj, amelyeket értesz. Kerüld az `M600` (filamentcsere) használatát nyomtatás közepén.
:::

## Filamentműveletek

A vezérlőpanelről elvégezhető műveletek:

- **Filament betöltése** — felmelegíti a fúvókát és behúzza a filamentet
- **Filament eltávolítása** — felmelegíti és kihúzza a filamentet
- **Fúvóka tisztítása** — tisztítási ciklus futtatása

## Makrók

G-kód parancssorozatok mentése és futtatása makróként:

1. Kattints az **Új makró** gombra
2. Adj nevet a makrónak
3. Írd be a G-kód sorozatot
4. Mentsd el és futtasd egy kattintással

Példa makró ágy-kalibrációhoz:
```gcode
G28
M84
M500
```

## Nyomtatásvezérlés

Aktív nyomtatás közben lehetséges műveletek:

- **Szünet** — nyomtatás szüneteltetése az aktuális réteg után
- **Folytatás** — szüneteltetett nyomtatás folytatása
- **Leállítás** — nyomtatás megszakítása (nem visszafordítható)
- **Vészleállítás** — összes motor azonnali leállítása
