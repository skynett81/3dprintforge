---
sidebar_position: 10
title: Matice kompatibility
description: Kompletní přehled kompatibility materiálů s podložkami, tiskárnami a tryskami Bambu Lab
---

# Matice kompatibility

Tato stránka poskytuje kompletní přehled, které materiály fungují s jakými tiskovými podložkami, tiskárnami a typy trysek. Tabulky slouží jako reference při plánování tisku s novými materiály.

---

## Materiály a tiskové podložky

| Materiál | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Lepidlo |
|-----------|-----------|-------------------|-----------------|--------------|----------|
| PLA | Vynikající | Dobrá | Nedoporučuje se | Dobrá | Ne |
| PLA+ | Vynikající | Dobrá | Nedoporučuje se | Dobrá | Ne |
| PLA-CF | Vynikající | Dobrá | Nedoporučuje se | Dobrá | Ne |
| PLA Silk | Vynikající | Dobrá | Nedoporučuje se | Dobrá | Ne |
| PETG | Špatná | Vynikající | Dobrá | Dobrá | Ano (Cool) |
| PETG-CF | Špatná | Vynikající | Dobrá | Přijatelná | Ano (Cool) |
| ABS | Nedoporučuje se | Vynikající | Dobrá | Přijatelná | Ano (HT) |
| ASA | Nedoporučuje se | Vynikající | Dobrá | Přijatelná | Ano (HT) |
| TPU | Dobrá | Dobrá | Nedoporučuje se | Vynikající | Ne |
| PA (Nylon) | Nedoporučuje se | Vynikající | Dobrá | Špatná | Ano |
| PA-CF | Nedoporučuje se | Vynikající | Dobrá | Špatná | Ano |
| PA-GF | Nedoporučuje se | Vynikající | Dobrá | Špatná | Ano |
| PC | Nedoporučuje se | Přijatelná | Vynikající | Nedoporučuje se | Ano (Eng) |
| PC-CF | Nedoporučuje se | Přijatelná | Vynikající | Nedoporučuje se | Ano (Eng) |
| PVA | Vynikající | Dobrá | Nedoporučuje se | Dobrá | Ne |
| HIPS | Nedoporučuje se | Dobrá | Dobrá | Přijatelná | Ne |
| PVB | Dobrá | Dobrá | Nedoporučuje se | Dobrá | Ne |

**Vysvětlivky:**
- **Vynikající** — optimální funkce, doporučená kombinace
- **Dobrá** — dobře funguje, přijatelná alternativa
- **Přijatelná** — funguje, ale není ideální — vyžaduje dodatečná opatření
- **Špatná** — může fungovat s úpravami, ale nedoporučuje se
- **Nedoporučuje se** — špatné výsledky nebo riziko poškození podložky

:::tip PETG a Cool Plate
PETG se na Cool Plate (Smooth PEI) **příliš silně přichytí** a při odebírání dílu může strhnout PEI vrstvu. Vždy používejte lepidlo jako separační film nebo zvolte Engineering Plate.
:::

:::warning PC a volba podložky
PC vyžaduje High Temp Plate kvůli vysokým teplotám podložky (100–120 °C). Ostatní podložky mohou být při těchto teplotách trvale zdeformovány.
:::

---

## Materiály a tiskárny

| Materiál | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|-----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano |
| PLA+ | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano |
| PLA-CF | Ano* | Ano* | Ano* | Ano* | Ano* | Ano | Ano | Ano* | Ano* | Ano* |
| PETG | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano |
| PETG-CF | Ano* | Ano* | Ano* | Ano* | Ano* | Ano | Ano | Ano* | Ano* | Ano* |
| ABS | Ne | Ne | Možné** | Ano | Ano | Ano | Ano | Ano | Ano | Ano |
| ASA | Ne | Ne | Možné** | Ano | Ano | Ano | Ano | Ano | Ano | Ano |
| TPU | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano |
| PA (Nylon) | Ne | Ne | Ne | Možné** | Možné** | Ano | Ano | Ano | Ano | Ano |
| PA-CF | Ne | Ne | Ne | Ne | Ne | Ano | Ano | Možné** | Možné** | Možné** |
| PA-GF | Ne | Ne | Ne | Ne | Ne | Ano | Ano | Možné** | Možné** | Možné** |
| PC | Ne | Ne | Ne | Možné** | Ne | Ano | Ano | Možné** | Možné** | Možné** |
| PC-CF | Ne | Ne | Ne | Ne | Ne | Ano | Ano | Ne | Ne | Ne |
| PVA | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano | Ano |
| HIPS | Ne | Ne | Možné** | Ano | Ano | Ano | Ano | Ano | Ano | Ano |

**Vysvětlivky:**
- **Ano** — plně podporováno a doporučeno
- **Ano*** — vyžaduje kalenou ocelovou trysku (HS01 nebo ekvivalent)
- **Možné**** — může fungovat s omezeními, není oficiálně doporučeno
- **Ne** — nevhodné (bez uzavření, nízké teploty atd.)

:::danger Požadavky na uzavřenou komoru
Materiály vyžadující uzavřenou komoru (ABS, ASA, PA, PC):
- **A1 a A1 Mini** mají otevřený rám — nevhodné
- **P1P** má otevřený rám — vyžaduje příslušenství pro uzavření
- **P1S** má uzavření, ale bez aktivního vytápění komory
- **X1C a X1E** mají plné uzavření s aktivním vytápěním — doporučeno pro náročné materiály
:::

---

## Materiály a typy trysek

| Materiál | Mosaz (standard) | Kalená ocel (HS01) | Hardened Steel |
|-----------|--------------------|--------------------|----------------|
| PLA | Vynikající | Vynikající | Vynikající |
| PLA+ | Vynikající | Vynikající | Vynikající |
| PLA-CF | Nepoužívat | Vynikající | Vynikající |
| PLA Silk | Vynikající | Vynikající | Vynikající |
| PETG | Vynikající | Vynikající | Vynikající |
| PETG-CF | Nepoužívat | Vynikající | Vynikající |
| ABS | Vynikající | Vynikající | Vynikající |
| ASA | Vynikající | Vynikající | Vynikající |
| TPU | Vynikající | Dobrá | Dobrá |
| PA (Nylon) | Dobrá | Vynikající | Vynikající |
| PA-CF | Nepoužívat | Vynikající | Vynikající |
| PA-GF | Nepoužívat | Vynikající | Vynikající |
| PC | Dobrá | Vynikající | Vynikající |
| PC-CF | Nepoužívat | Vynikající | Vynikající |
| PVA | Vynikající | Dobrá | Dobrá |
| HIPS | Vynikající | Vynikající | Vynikající |
| PVB | Vynikající | Dobrá | Dobrá |

:::danger Uhlíkové a skleněné vlákno vyžaduje kalenou trysku
Všechny materiály s **-CF** (uhlíkové vlákno) nebo **-GF** (skleněné vlákno) **vyžadují trysku z kalené oceli**. Mosaz se opotřebí za hodiny až dny. Doporučuje se Bambu Lab HS01.

Materiály vyžadující kalenou trysku:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Mosaz vs kalená ocel pro běžné materiály
Mosazná tryska poskytuje **lepší tepelnou vodivost** a tím rovnoměrnější extruzi pro běžné materiály (PLA, PETG, ABS). Kalená ocel funguje dobře, ale může vyžadovat o 5–10 °C vyšší teplotu. Pro každodenní použití mosaz, pro CF/GF materiály přepněte na kalenou ocel.
:::

---

## Tipy pro výměnu materiálu

Při výměně materiálů v AMS nebo ručně je důležité správné proplachování, aby se zabránilo kontaminaci.

### Doporučené množství purge

| Přechod | Množství purge | Poznámka |
|-----------|-------------|---------|
| PLA → PLA (jiná barva) | 100–150 mm³ | Standardní výměna barvy |
| PLA → PETG | 200–300 mm³ | Zvýšení teploty, odlišný tok |
| PETG → PLA | 200–300 mm³ | Snížení teploty |
| ABS → PLA | 300–400 mm³ | Velký teplotní rozdíl |
| PLA → ABS | 300–400 mm³ | Velký teplotní rozdíl |
| PA → PLA | 400–500 mm³ | Nylon zůstává v hotendu |
| PC → PLA | 400–500 mm³ | PC vyžaduje důkladný purge |
| Tmavá → Světlá barva | 200–300 mm³ | Tmavý pigment se těžko čistí |
| Světlá → Tmavá barva | 100–150 mm³ | Snadnější přechod |

### Změna teploty při výměně materiálu

| Přechod | Doporučení |
|----------|-----------|
| Studený → Horký (např. PLA → ABS) | Zahřejte na nový materiál, důkladně propláchněte |
| Horký → Studený (např. ABS → PLA) | Nejprve propláchněte při vysoké teplotě, pak snižte |
| Podobné teploty (např. PLA → PLA) | Standardní purge |
| Velký rozdíl (např. PLA → PC) | Mezikrok s PETG může pomoci |

:::warning Nylon a PC zanechávají rezidua
PA (Nylon) a PC jsou obzvláště obtížné na proplachování. Po použití těchto materiálů:
1. Propláchněte **PETG** nebo **ABS** při vysoké teplotě (260–280 °C)
2. Použijte alespoň **500 mm³** purge materiálu
3. Vizuálně zkontrolujte extruzi — musí být zcela čistá bez zabarvení
:::

---

## Rychlá reference — volba materiálu

Nevíte, jaký materiál potřebujete? Použijte tento průvodce:

| Potřeba | Doporučený materiál |
|-------|-------------------|
| Prototypování / každodenní použití | PLA |
| Mechanická pevnost | PETG, PLA Tough |
| Venkovní použití | ASA |
| Tepelná odolnost | ABS, ASA, PC |
| Flexibilní díly | TPU |
| Maximální pevnost | PA-CF, PC-CF |
| Průhledný | PETG (přírodní), PC (přírodní) |
| Estetika / dekorace | PLA Silk, PLA Sparkle |
| Zacvakávací spoje / živé panty | PETG, PA |
| Kontakt s potravinami | PLA (s výhradami) |
