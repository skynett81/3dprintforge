---
sidebar_position: 3
title: Stringing
description: A stringing okai és megoldásai — visszahúzás, hőmérséklet és szárítás
---

# Stringing

A stringing (vagy „oozing") vékony műanyagszálak, amelyek az objektum külön részei között képződnek, miközben a fúvóka extrudálás nélkül mozog. Ez „pókháló"-szerű megjelenést ad a nyomatnak.

## A stringing okai

1. **Túl magas fúvóka hőmérséklete** — a meleg műanyag folyékony és csepeg
2. **Rossz visszahúzási beállítások** — a filament nem húzódik vissza elég gyorsan
3. **Nedves filament** — a nedvesség gőzt és extra folyást okoz
4. **Túl alacsony sebesség** — a fúvóka sokáig van tranzit-pozícióban

## Diagnózis

**Nedves filament?** Hallasz kattogó/pukkanó hangot nyomtatás közben? Akkor a filament nedves — szárítsd ki először, mielőtt más beállításokat módosítasz.

**Túl magas hőmérséklet?** Látsz csepegést a fúvókáról a „szünet" pillanataiban? Csökkentsd a hőmérsékletet 5–10 °C-kal.

## Megoldások

### 1. Szárítsd ki a filamentet

A nedves filament a leggyakoribb oka a stringnek, amely nem korrigálható beállításokkal:

| Anyag | Szárítási hőmérséklet | Idő |
|-------|----------------------|-----|
| PLA | 45–55 °C | 4–6 óra |
| PETG | 60–65 °C | 6–8 óra |
| TPU | 55–60 °C | 6–8 óra |
| PA | 75–85 °C | 8–12 óra |

### 2. Csökkentsd a fúvóka hőmérsékletét

Kezdj egyszerre 5 °C-os csökkentéssel:
- PLA: próbálj 210–215 °C-ot (220 °C-ről csökkentve)
- PETG: próbálj 235–240 °C-ot (245 °C-ről csökkentve)

:::warning A túl alacsony hőmérséklet rossz rétegfúziót okoz
Óvatosan csökkentsd a hőmérsékletet. A túl alacsony hőmérséklet rossz rétegfúziót, gyenge nyomatot és extrudálási problémákat okoz.
:::

### 3. Állítsd be a visszahúzási beállításokat

A visszahúzás visszahúzza a filamentet a fúvókába a „travel" mozgás közben, hogy megakadályozza a csepegést:

```
Bambu Studio → Filament → Visszahúzás:
- Visszahúzási távolság: 0,4–1,0 mm (közvetlen meghajtás)
- Visszahúzási sebesség: 30–45 mm/s
```

:::tip A Bambu Lab nyomtatók közvetlen meghajtást használnak
Az összes Bambu Lab nyomtató (X1C, P1S, A1) közvetlen meghajtású extrudert használ. A közvetlen meghajtás **rövidebb** visszahúzási távolságot igényel, mint a Bowden-rendszerek (tipikusan 0,5–1,5 mm vs. 3–7 mm).
:::

### 4. Növeld az utazási sebességet

A gyors mozgás a pontok között kevesebb időt hagy a fúvókának csepegni:
- Növeld a „travel speed"-et 200–300 mm/s-ra
- A Bambu Lab nyomtatók ezt jól kezelik

### 5. Aktiváld az „Avoid Crossing Perimeters" funkciót

Slicer-beállítás, amely miatt a fúvóka elkerüli a nyílt területeket, ahol a stringing látható lenne:
```
Bambu Studio → Minőség → Avoid crossing perimeters
```

### 6. Csökkentsd a sebességet (TPU esetén)

TPU-nál a megoldás ellentétes más anyagokhoz képest:
- Csökkentsd a nyomtatási sebességet 20–35 mm/s-ra
- A TPU rugalmas és összenyomódik túl magas sebességnél — ez „utófolyást" eredményez

## Beállítások után

Teszteld egy standard stringing-teszt modellel (pl. „torture tower" a MakerWorldről). Egyszerre csak egy változót állíts, és figyeld a változást.

:::note A tökéletesség ritkán érhető el
Némi stringing a legtöbb anyagnál normális. Koncentrálj a csökkentésre elfogadható szintre, ne a teljes elimináció. A PETG-nek mindig lesz valamivel több stringje, mint a PLA-nak.
:::
