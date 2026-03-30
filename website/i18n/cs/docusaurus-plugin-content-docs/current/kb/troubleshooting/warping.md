---
sidebar_position: 2
title: Warping
description: Příčiny warpingu a řešení — uzavřená komora, brim, teplota a draft shield
---

# Warping

Warping nastává, když se rohy nebo hrany tisku zvedají od podložky během nebo po tisku. Je způsoben tepelným smrštěním materiálu.

## Co je warping?

Když se plast ochlazuje, smršťuje se. Horní vrstvy jsou teplejší než spodní — to vytváří napětí, které táhne hrany nahoru a ohýbá tisk. Čím větší teplotní rozdíl, tím více warpingu.

## Materiály nejvíce náchylné

| Materiál | Riziko warpingu | Vyžaduje komoru |
|-----------|-------------|-----------------|
| PLA | Nízké | Ne |
| PETG | Nízké–Střední | Ne |
| ABS | Vysoké | Ano |
| ASA | Vysoké | Ano |
| PA/Nylon | Velmi vysoké | Ano |
| PC | Velmi vysoké | Ano |
| TPU | Nízké | Ne |

## Řešení

### 1. Použijte uzavřenou komoru

Nejdůležitější opatření pro ABS, ASA, PA a PC:
- Udržujte teplotu komory 40–55 °C pro nejlepší výsledky
- X1C a P1S: aktivujte ventilátory komory v „uzavřeném" režimu
- A1/P1P: použijte kryt pro udržení tepla

### 2. Použijte brim

Brim je jedna vrstva extra širokých hran, které drží tisk přichycený k podložce:

```
Bambu Studio:
1. Vyberte tisk v sliceru
2. Přejděte na Support → Brim
3. Nastavte šířku na 5–10 mm (čím více warpingu, tím širší)
4. Typ: Outer Brim Only (doporučeno)
```

:::tip Průvodce šířkou brim
- PLA (zřídka nutné): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Zvyšte teplotu podložky

Vyšší teplota podložky snižuje teplotní rozdíl mezi vrstvami:
- ABS: zkuste 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Snižte chlazení dílu

Pro materiály s tendencí k warpingu — snižte nebo deaktivujte chlazení dílu:
- ABS/ASA: 0–20% chlazení dílu
- PA: 0–30% chlazení dílu

### 5. Vyhněte se průvanu a studenému vzduchu

Udržujte tiskárnu dál od:
- Oken a venkovních dveří
- Klimatizace a ventilátorů
- Průvanu v místnosti

Pro P1P a A1: zakryjte otvory kartonem při kritických tiscích.

### 6. Draft Shield

Draft shield je tenká stěna kolem objektu, která drží teplo uvnitř:

```
Bambu Studio:
1. Přejděte na Support → Draft Shield
2. Aktivujte a nastavte vzdálenost (3–5 mm)
```

Zvláště užitečné pro vysoké, štíhlé objekty.

### 7. Opatření při návrhu modelu

Při navrhování vlastních modelů:
- Vyhněte se velkým plochým spodkům (přidejte zkosení/zaoblení v rozích)
- Rozdělte velké ploché části na menší sekce
- Použijte „mouse ears" — malé kruhy v rozích — ve sliceru nebo CAD

## Warping po ochlazení

Někdy tisk vypadá dobře, ale warping nastane po odebrání z podložky:
- Vždy počkejte, až jsou podložka i tisk **zcela vychladlé** (pod 40 °C) před odebráním
- Pro ABS: nechte chladit uvnitř uzavřené komory pro pomalejší chlazení
- Vyhněte se položení teplého tisku na studenou plochu
