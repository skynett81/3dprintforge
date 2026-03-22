---
sidebar_position: 3
title: Diagnosztika
description: Egészségpontszám, telemetria-grafikonok, ágy háló vizualizáció és komponensfigyelés Bambu Lab nyomtatókhoz
---

# Diagnosztika

A diagnosztika oldal részletes áttekintést nyújt a nyomtató egészségéről, teljesítményéről és időbeli állapotáról.

Navigálj ide: **https://localhost:3443/#diagnostics**

## Egészségpontszám

Minden nyomtató számára egy 0–100-as **egészségpontszám** kerül kiszámításra:

| Tényező | Súlyozás | Leírás |
|---|---|---|
| Sikerességi arány (30 nap) | 30% | Sikeres nyomtatások aránya az utolsó 30 napban |
| Komponens kopása | 25% | Kritikus alkatrészek átlagos kopása |
| HMS hibák (30 nap) | 20% | Hibák száma és súlyossága |
| Kalibrálási állapot | 15% | Az utolsó kalibrálás óta eltelt idő |
| Hőmérséklet-stabilitás | 10% | Célhőmérséklettől való eltérés nyomtatás közben |

**Pontszám értelmezése:**
- 🟢 80–100 — Kiváló állapot
- 🟡 60–79 — Jó, de valamit érdemes megvizsgálni
- 🟠 40–59 — Csökkent teljesítmény, karbantartás ajánlott
- 🔴 0–39 — Kritikus, karbantartás szükséges

:::tip Előzmények
Kattints az egészséggrafikonra a pontszám időbeli változásának megtekintéséhez. A nagy esések egy konkrét eseményt jelezhetnek.
:::

## Telemetria-grafikonok

A telemetria oldal interaktív grafikonokat jelenít meg az összes érzékelőértékhez:

### Elérhető adathalmazok

- **Fúvóka-hőmérséklet** — tényleges vs. cél
- **Ágyhőmérséklet** — tényleges vs. cél
- **Kamrahőmérséklet** — a gép belsejének hőmérséklete
- **Extruder motor** — áramfogyasztás és hőmérséklet
- **Ventilátor sebességek** — szerszámfej, kamra, AMS
- **Nyomás** (X1C) — kamranyomás az AMS-hez
- **Gyorsulás** — vibrációs adatok (ADXL345)

### Navigálás a grafikonokban

1. Válassz **Időszakot**: Utolsó óra / 24 óra / 7 nap / 30 nap / Egyéni
2. Válassz **Nyomtatót** a legördülő listából
3. Válassz **Adatkészletet** a megjelenítéshez (többszörös kiválasztás támogatott)
4. Görgets az idővonal nagyításához
5. Kattints és húzd a panorámázáshoz
6. Dupla kattintás a nagyítás visszaállításához

### Telemetriai adatok exportálása

1. Kattints az **Exportálás** gombra a grafikonon
2. Válassz formátumot: **CSV**, **JSON** vagy **PNG** (kép)
3. A kiválasztott időszak és adatkészlet kerül exportálásra

## Ágy háló

Az ágy háló vizualizáció a nyomtatóágy síkosság-kalibrálását mutatja:

1. Navigálj a **Diagnosztika → Ágy háló** menüpontra
2. Válassz nyomtatót
3. A legutóbbi háló 3D felületként és hőtérképként jelenik meg:
   - **Kék** — alacsonyabb a középpontnál (homorú)
   - **Zöld** — közel sík
   - **Piros** — magasabb a középpontnál (domború)
4. Vidd az egeret egy pont fölé a pontos mm-es eltérés megtekintéséhez

### Ágy háló szkennelése a felületen

1. Kattints a **Szkennelés most** gombra (a nyomtatónak szabadnak kell lennie)
2. Erősítsd meg a párbeszédablakban — a nyomtató automatikusan elindítja a kalibrálást
3. Várd meg a szkennelés befejezését (kb. 3–5 perc)
4. Az új háló automatikusan megjelenik

:::warning Melegítsd fel előbb
Az ágy hálót felmelegített ággyal kell szkennelni (PLA esetén 50–60°C) a pontos kalibráláshoz.
:::

## Komponens kopása

A részletes dokumentációért lásd a [Kopásbecslés](./wearprediction) oldalt.

A diagnosztika oldal tömör áttekintést mutat:
- Százalékos pontszám komponensenként
- Következő ajánlott karbantartás
- Kattints a **Részletek** gombra a teljes kopáselemzéshez
