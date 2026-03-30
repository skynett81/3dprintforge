---
sidebar_position: 2
title: PETG
description: Průvodce tiskem PETG — teplota, DŮLEŽITÉ o lepidlu, podložka a tipy
---

# PETG

PETG (Polyethylentereftalát glykol) je populární materiál pro funkční díly. Je pevnější a více tepelně stabilní než PLA a snáší lehkou chemickou expozici.

## Nastavení

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 230–250 °C |
| Teplota podložky | 70–85 °C |
| Chlazení dílu | 30–60% |
| Rychlost | Standardní |
| Sušení | Doporučeno (6–8 h při 65 °C) |

## Doporučené podložky

| Podložka | Vhodnost | Lepidlo? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Vynikající | Ne/Ano* |
| Textured PEI | Dobré | Ano** |
| Cool Plate (Smooth PEI) | Viz varování | Viz varování |
| High Temp Plate | Dobré | Ano |

:::danger DŮLEŽITÉ: Lepidlo na Smooth PEI s PETG
PETG se lepí **extrémně silně** na Smooth PEI (Cool Plate). Bez lepidla riskujete **stržení povrchu z podložky** při odstraňování tisku. Vždy používejte tenkou vrstvu lepidla na Smooth PEI při tisku PETG — funguje jako bariéra.

**Alternativně:** Použijte Engineering Plate nebo Textured PEI — tyto dávají dobrou přilnavost bez poškození podložky.
:::

## Tipy pro úspěšný tisk

- **Snižte chlazení dílu** — příliš mnoho chlazení způsobuje delaminaci a křehký tisk
- **Zvyšte teplotu trysky** — při stringing zkuste snížit o 5–10 °C; při špatném slinování vrstev zvyšte
- **Teplota podložky první vrstvy** — 80–85 °C pro dobrou přilnavost, snižte na 70 °C po první vrstvě
- **Snižte rychlost** — PETG je náročnější než PLA, začněte s 80% rychlostí

:::warning Stringing
PETG je náchylný ke stringing. Zvyšte vzdálenost retrakce (zkuste 0,8–1,5 mm pro direct drive), zvyšte rychlost retrakce a snižte teplotu trysky o 5 °C.
:::

## Sušení

PETG absorbuje vlhkost rychleji než PLA. Vlhký PETG způsobuje:
- Bubliny a syčení při tisku
- Slabé vrstvy s porézním povrchem
- Zvýšené stringing

**Sušte při 65 °C po dobu 6–8 hodin** před tiskem, zejména pokud byla cívka dlouho otevřená.

## Skladování

Vždy uchovávejte v uzavřeném sáčku nebo sušicí krabici se silikagelem. PETG by neměl být otevřen déle než několik dní ve vlhkém prostředí.
