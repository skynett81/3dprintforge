---
sidebar_position: 3
title: Stringing
description: Příčiny stringing a řešení — retract, teplota a sušení
---

# Stringing

Stringing (nebo „oozing") jsou tenká plastová vlákna tvořící se mezi oddělenými částmi objektu, zatímco se tryska pohybuje bez extruze. Dávají tisku vzhled „pavučiny".

## Příčiny stringing

1. **Příliš vysoká teplota trysky** — teplý plast je tekutý a kape
2. **Špatná nastavení retrakctu** — filament se nestahuje dostatečně rychle zpět
3. **Vlhký filament** — vlhkost způsobuje páru a extra tok
4. **Příliš nízká rychlost** — tryska je dlouho v tranzitních pozicích

## Diagnóza

**Vlhký filament?** Slyšíte praskání/praskavé zvuky během tisku? Pak je filament vlhký — nejprve ho vysušte, než budete upravovat jiná nastavení.

**Příliš vysoká teplota?** Vidíte kapky z trysky v „pausach"? Snižte teplotu o 5–10 °C.

## Řešení

### 1. Vysušte filament

Vlhký filament je nejčastější příčinou stringing, které nelze odstranit pouhým nastavováním:

| Materiál | Teplota sušení | Čas |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 hodin |
| PETG | 60–65 °C | 6–8 hodin |
| TPU | 55–60 °C | 6–8 hodin |
| PA | 75–85 °C | 8–12 hodin |

### 2. Snižte teplotu trysky

Začněte snižovat o 5 °C:
- PLA: zkuste 210–215 °C (z 220 °C)
- PETG: zkuste 235–240 °C (z 245 °C)

:::warning Příliš nízká teplota dává špatné slinování vrstev
Snižujte teplotu opatrně. Příliš nízká teplota dává špatné slinování vrstev, slabý tisk a problémy s extruzí.
:::

### 3. Upravte nastavení retrakctu

Retrakce stáhne filament zpět do trysky při „travel" pohybu, aby zabránila kapání:

```
Bambu Studio → Filament → Retract:
- Vzdálenost retrakce: 0,4–1,0 mm (direct drive)
- Rychlost retrakce: 30–45 mm/s
```

:::tip Bambu Lab tiskárny mají direct drive
Všechny tiskárny Bambu Lab (X1C, P1S, A1) používají direct drive extruder. Direct drive vyžaduje **kratší** vzdálenost retrakce než Bowden systémy (typicky 0,5–1,5 mm vs. 3–7 mm).
:::

### 4. Zvyšte rychlost cestování

Rychlý pohyb mezi body dává trysce kratší čas na kapání:
- Zvyšte „travel speed" na 200–300 mm/s
- Tiskárny Bambu Lab to zvládají dobře

### 5. Aktivujte „Avoid Crossing Perimeters"

Nastavení sliceru, které způsobuje, že tryska se vyhýbá přechodu přes otevřené oblasti, kde by stringing byl viditelný:
```
Bambu Studio → Kvalita → Avoid crossing perimeters
```

### 6. Snižte rychlost (pro TPU)

Pro TPU je řešení opačné než pro jiné materiály:
- Snižte rychlost tisku na 20–35 mm/s
- TPU je elastický a komprimuje se při příliš vysoké rychlosti — to způsobuje „přetékání"

## Po úpravách

Testujte se standardním modelem pro testování stringing (např. „torture tower" z MakerWorld). Upravujte jednu proměnnou najednou a sledujte změnu.

:::note Dokonalé je zřídka možné
Určité množství stringing je normální pro většinu materiálů. Zaměřte se na redukci na přijatelnou úroveň, ne na úplné odstranění. PETG bude vždy mít trochu více stringing než PLA.
:::
