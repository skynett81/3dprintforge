---
sidebar_position: 4
title: TPU
description: Průvodce tiskem TPU — teplota, rychlost a nastavení retrakce
---

# TPU

TPU (Termoplastický polyuretan) je flexibilní materiál používaný pro kryty, těsnění, kola a další díly vyžadující elasticitu.

## Nastavení

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 220–240 °C |
| Teplota podložky | 30–45 °C |
| Chlazení dílu | 50–80% |
| Rychlost | 30–50% (DŮLEŽITÉ) |
| Retrakce | Minimální nebo deaktivovaná |
| Sušení | Doporučeno (6–8 h při 60 °C) |

:::danger Nízká rychlost je kritická
TPU musí být tisknut pomalu. Příliš vysoká rychlost způsobuje, že se materiál komprimuje v extruderu a vytváří zácpu. Začněte s 30% rychlostí a opatrně zvyšujte.
:::

## Doporučené podložky

| Podložka | Vhodnost | Lepidlo? |
|-------|---------|----------|
| Textured PEI | Vynikající | Ne |
| Cool Plate (Smooth PEI) | Dobré | Ne |
| Engineering Plate | Dobré | Ne |

## Nastavení retrakce

TPU je elastický a špatně reaguje na agresivní retrakci:

- **Direct drive (X1C/P1S/A1):** Retrakce 0,5–1,0 mm, 25 mm/s
- **Bowden (vyhněte se s TPU):** Velmi náročné, nedoporučuje se

Pro velmi měkký TPU (Shore A 85 nebo nižší): deaktivujte retrakci zcela a spoléhejte na kontrolu teploty a rychlosti.

## Tipy

- **Sušte filament** — vlhký TPU je extrémně obtížné tisknout
- **Používejte přímý extruder** — Bambu Lab P1S/X1C/A1 mají všechny direct drive
- **Vyhněte se vysoké teplotě** — nad 250 °C se TPU degraduje a dává zbarvený tisk
- **Stringing** — TPU má tendenci tvořit vlákna; snižte teplotu o 5 °C nebo zvyšte chlazení

:::tip Shore tvrdost
TPU se vyrábí v různých Shore tvrdostech (A85, A95, A98). Čím nižší Shore A, tím měkčí a náročnější na tisk. TPU od Bambu Lab je Shore A 95 — dobrý výchozí bod.
:::

## Skladování

TPU je velmi hygroskopický (nasává vlhkost). Vlhký TPU způsobuje:
- Bubliny a syčení
- Slabý a křehký tisk (paradoxně pro flexibilní materiál)
- Stringing

**Vždy sušte TPU** při 60 °C po dobu 6–8 hodin před tiskem. Uchovávejte v uzavřené krabici se silikagelem.
