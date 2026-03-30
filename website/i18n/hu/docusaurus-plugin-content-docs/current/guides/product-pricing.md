---
sidebar_position: 11
title: Termékárazás — eladási ár kiszámítása
description: Teljes útmutató a 3D nyomatok eladási árazásához az összes költségtényezővel
---

# Termékárazás — eladási ár kiszámítása

Ez az útmutató elmagyarázza, hogyan használd a költségkalkulátort az eladott 3D nyomatok megfelelő eladási árának meghatározásához.

## Költségáttekintés

Egy 3D nyomat költsége ezekből az összetevőkből áll:

| Összetevő | Leírás | Példa |
|-----------|-------------|---------|
| **Filament** | Anyagköltség súly és orsóár alapján | 100g × 0,25 kr/g = 25 kr |
| **Hulladék** | Anyagveszteség (öblítés, sikertelen nyomatok, támasz) | 10% extra = 2,50 kr |
| **Áram** | Energiafogyasztás nyomtatás közben | 3,5ó × 150W × 1,50 kr/kWh = 0,79 kr |
| **Kopás** | Fúvóka + gépérték az élettartam alatt | 3,5ó × 0,15 kr/ó = 0,53 kr |
| **Munka** | Az idő beállításra, utómunkára, csomagolásra | 10 perc × 200 kr/ó = 33,33 kr |
| **Felár** | Haszonkulcs | 20% = 12,43 kr |

**Teljes gyártási költség** = az összes összetevő összege

## Beállítások konfigurálása

### Alapbeállítások

Menj a **Filament → ⚙ Beállítások** menüpontra és töltsd ki:

1. **Áramár (kr/kWh)** — a te áramárad. Ellenőrizd a villanyszámlát vagy használd a Nordpool integrációt
2. **Nyomtató teljesítmény (W)** — jellemzően 150W Bambu Lab nyomtatókhoz
3. **Gépköltség (kr)** — mennyit fizettél a nyomtatóért
4. **Gép élettartam (óra)** — várható élettartam (3000-8000 óra)
5. **Munkaköltség (kr/óra)** — az óradíjad
6. **Előkészítési idő (perc)** — átlagos idő filamentcserére, lemez ellenőrzésre, csomagolásra
7. **Felár (%)** — kívánt haszonkulcs
8. **Fúvókaköltség (kr/óra)** — fúvóka kopása (HS01 ≈ 0,05 kr/ó)
9. **Hulladéktényező** — anyagveszteség (1,1 = 10% extra, 1,15 = 15%)

:::tip Tipikus értékek Bambu Lab-hoz
| Beállítás | Hobbista | Félprofi | Profi |
|---|---|---|---|
| Áramár | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Nyomtató teljesítmény | 150W | 150W | 150W |
| Gépköltség | 5 000 kr | 12 000 kr | 25 000 kr |
| Gép élettartam | 3 000ó | 5 000ó | 8 000ó |
| Munkaköltség | 0 kr/ó | 150 kr/ó | 250 kr/ó |
| Előkészítési idő | 5 perc | 10 perc | 15 perc |
| Felár | 0% | 30% | 50% |
| Hulladéktényező | 1,05 | 1,10 | 1,15 |
:::

## Költség kiszámítása

1. Menj a **Költségkalkulátorhoz** (`https://localhost:3443/#costestimator`)
2. **Húzd és ejtsd** a `.3mf` vagy `.gcode` fájlt
3. A rendszer automatikusan beolvassa: filament súly, becsült idő, színek
4. **Orsók hozzárendelése** — válaszd ki, melyik orsókat használod a készletből
5. Kattints a **Költség kiszámítása** gombra

### Az eredmény mutatja:

- **Filament** — anyagköltség színenként
- **Hulladék/veszteség** — a hulladéktényező alapján
- **Áram** — élő spotárat használ a Nordpool-ból, ha elérhető
- **Kopás** — fúvóka + gépérték
- **Munka** — óradíj + előkészítési idő
- **Gyártási költség** — a fentiek összege
- **Felár** — a te haszonkulcsod
- **Összköltség** — a minimum, amit kérned kellene
- **Javasolt eladási árak** — 2×, 2,5×, 3× árrés

## Árazási stratégiák

### 2× árrés (ajánlott minimum)
Fedezi a gyártási költséget + előre nem látható kiadásokat. Használd barátok/család és egyszerű geometria esetén.

### 2,5× árrés (standard)
Jó egyensúly az ár és az érték között. A legtöbb termékhez működik.

### 3× árrés (prémium)
Összetett modellekhez, többszínű, magas minőségű vagy szűk piaci termékekhez.

:::warning Ne feledkezz meg a rejtett költségekről
- Sikertelen nyomatok (az összes nyomat 5-15%-a sikertelen)
- Fel nem használt filament (az utolsó 50g gyakran problémás)
- Ügyfélszolgálatra fordított idő
- Csomagolás és szállítás
- Nyomtató karbantartás
:::

## Példa: Telefontartó árazása

| Paraméter | Érték |
|-----------|-------|
| Filament súly | 45g PLA |
| Nyomtatási idő | 2 óra |
| Spotár | 1,20 kr/kWh |

**Számítás:**
- Filament: 45g × 0,25 kr/g = 11,25 kr
- Hulladék (10%): 1,13 kr
- Áram: 2ó × 0,15kW × 1,20 = 0,36 kr
- Kopás: 2ó × 0,15 = 0,30 kr
- Munka: (2ó + 10perc) × 200 kr/ó = 433 kr (vagy 0 hobbihoz)
- **Gyártási költség (hobbi)**: ~13 kr
- **Eladási ár 2,5×**: ~33 kr

## Becslés mentése

Kattints a **Becslés mentése** gombra a számítás archiválásához. A mentett becslések a költségkalkulátor **Mentett** fülén találhatók.

## E-kereskedelem

Ha az [e-kereskedelmi modult](../integrations/ecommerce) használod, a költségbecsléseket közvetlenül összekapcsolhatod rendelésekkel az automatikus árkiszámításhoz.
