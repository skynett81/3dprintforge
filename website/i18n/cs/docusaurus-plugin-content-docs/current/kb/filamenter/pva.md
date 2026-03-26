---
sidebar_position: 8
title: PVA a podpůrné materiály
description: Průvodce PVA, HIPS, PVB a dalšími podpůrnými materiály pro tiskárny Bambu Lab
---

# PVA a podpůrné materiály

Podpůrné materiály se používají k tisku složitých geometrií s převisy, mosty a vnitřními dutinami, které nelze tisknout bez dočasné podpory. Po tisku se podpůrný materiál odstraní — mechanicky nebo rozpuštěním v rozpouštědle.

## Přehled

| Materiál | Rozpouštědlo | Kombinovat s | Doba rozpouštění | Obtížnost |
|-----------|-----------|-------------|----------------|-------------------|
| PVA | Voda | PLA, PETG | 12–24 hodin | Náročné |
| HIPS | d-Limonen | ABS, ASA | 12–24 hodin | Střední |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 hodin | Střední |
| BVOH | Voda | PLA, PETG, PA | 4–8 hodin | Náročné |

---

## PVA (Polyvinylalkohol)

PVA je ve vodě rozpustný podpůrný materiál, nejpoužívanější volba pro PLA tisk se složitými podpůrnými strukturami.

### Nastavení

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 190–210 °C |
| Teplota podložky | 45–60 °C |
| Chlazení dílu | 100% |
| Rychlost | 60–80% |
| Retrakce | Zvýšená (6–8 mm) |

### Doporučené tiskové podložky

| Podložka | Vhodnost | Lepidlo? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Vynikající | Ne |
| Textured PEI | Dobrá | Ne |
| Engineering Plate | Dobrá | Ne |
| High Temp Plate | Vyhněte se | — |

### Kompatibilita

PVA nejlépe funguje s materiály tisknutými při **podobných teplotách**:

| Hlavní materiál | Kompatibilita | Poznámka |
|---------------|---------------|---------|
| PLA | Vynikající | Ideální kombinace |
| PETG | Dobrá | Teplota podložky může být pro PVA trochu vysoká |
| ABS/ASA | Špatná | Příliš vysoká teplota komory — PVA degraduje |
| PA (Nylon) | Špatná | Příliš vysoké teploty |

### Rozpouštění

- Vložte hotový tisk do **vlažné vody** (cca 40 °C)
- PVA se rozpustí za **12–24 hodin** v závislosti na tloušťce
- Pravidelně míchejte vodou pro urychlení procesu
- Vyměňte vodu každých 6–8 hodin pro rychlejší rozpuštění
- Ultrazvuková čistička dává výrazně rychlejší výsledek (2–6 hodin)

:::danger PVA je extrémně hygroskopické
PVA absorbuje vlhkost ze vzduchu **velmi rychle** — i hodiny expozice mohou zničit výsledek tisku. PVA, které absorbovalo vlhkost, způsobuje:

- Intenzivní bublání a praskání
- Špatnou adhezi k hlavnímu materiálu
- Stringing a lepkavý povrch
- Ucpanou trysku

**Vždy sušte PVA bezprostředně před použitím** a tiskněte ze suchého prostředí (sušicí box).
:::

### Sušení PVA

| Parametr | Hodnota |
|-----------|-------|
| Teplota sušení | 45–55 °C |
| Doba sušení | 6–10 hodin |
| Hygroskopická úroveň | Extrémně vysoká |
| Způsob skladování | Uzavřená krabice s vysoušedlem, vždy |

---

## HIPS (Houževnatý polystyren)

HIPS je podpůrný materiál rozpustný v d-limonenu (citrusové rozpouštědlo). Je to preferovaný podpůrný materiál pro ABS a ASA.

### Nastavení

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 220–240 °C |
| Teplota podložky | 90–100 °C |
| Teplota komory | 40–50 °C (doporučeno) |
| Chlazení dílu | 20–40% |
| Rychlost | 70–90% |

### Kompatibilita

| Hlavní materiál | Kompatibilita | Poznámka |
|---------------|---------------|---------|
| ABS | Vynikající | Ideální kombinace — podobné teploty |
| ASA | Vynikající | Velmi dobrá adheze |
| PLA | Špatná | Příliš velký teplotní rozdíl |
| PETG | Špatná | Odlišné termální chování |

### Rozpouštění v d-Limonenu

- Vložte tisk do **d-limonenu** (citrusové rozpouštědlo)
- Doba rozpuštění: **12–24 hodin** při pokojové teplotě
- Zahřátí na 35–40 °C urychluje proces
- d-Limonen lze znovu použít 2–3×
- Po rozpuštění opláchněte díl vodou a osušte

### Výhody oproti PVA

- **Mnohem méně citlivý na vlhkost** — snadnější skladování a manipulace
- **Silnější jako podpůrný materiál** — unese více bez rozpadu
- **Lepší termální kompatibilita** s ABS/ASA
- **Snadnější tisk** — méně ucpávek a problémů

:::warning d-Limonen je rozpouštědlo
Používejte rukavice a pracujte ve větrané místnosti. d-Limonen může dráždit kůži a sliznice. Uchovávejte mimo dosah dětí.
:::

---

## PVB (Polyvinylbutyral)

PVB je unikátní podpůrný materiál rozpustný v isopropanolu (IPA), který lze také použít k vyhlazení povrchů parami IPA.

### Nastavení

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 200–220 °C |
| Teplota podložky | 55–75 °C |
| Chlazení dílu | 80–100% |
| Rychlost | 70–80% |

### Kompatibilita

| Hlavní materiál | Kompatibilita | Poznámka |
|---------------|---------------|---------|
| PLA | Dobrá | Přijatelná adheze |
| PETG | Střední | Teplota podložky se může lišit |
| ABS/ASA | Špatná | Příliš vysoké teploty |

### Vyhlazení povrchu parami IPA

Unikátní vlastností PVB je, že povrch lze vyhladit parami IPA:

1. Umístěte díl do uzavřené nádoby
2. Položte hadřík navlhčený IPA na dno (bez přímého kontaktu s dílem)
3. Nechte páry působit **30–60 minut**
4. Vyjměte a nechte schnout 24 hodin
5. Výsledkem je hladký, polomatný povrch

:::tip PVB jako povrchová úprava
Ačkoli je PVB primárně podpůrný materiál, lze ho tisknout jako vnější vrstvu na PLA dílech pro vytvoření povrchu, který lze vyhladit parami IPA. Výsledek připomíná ABS vyhlazený acetonem.
:::

---

## Srovnání podpůrných materiálů

| Vlastnost | PVA | HIPS | PVB | BVOH |
|----------|-----|------|-----|------|
| Rozpouštědlo | Voda | d-Limonen | IPA | Voda |
| Doba rozpuštění | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Citlivost na vlhkost | Extrémně vysoká | Nízká | Střední | Extrémně vysoká |
| Obtížnost | Náročné | Střední | Střední | Náročné |
| Cena | Vysoká | Střední | Vysoká | Velmi vysoká |
| Nejlepší s | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Dostupnost | Dobrá | Dobrá | Omezená | Omezená |
| AMS kompatibilní | Ano (s vysoušedlem) | Ano | Ano | Problematické |

---

## Tipy pro duální extruzi a vícebarevný tisk

### Obecné pokyny

- **Množství purge** — podpůrné materiály vyžadují dobré proplachování při výměně materiálu (minimálně 150–200 mm³)
- **Rozhraní vrstev** — použijte 2–3 vrstvy rozhraní mezi podporou a hlavním dílem pro čistý povrch
- **Vzdálenost** — nastavte vzdálenost podpory na 0.1–0.15 mm pro snadné odstranění po rozpuštění
- **Vzor podpory** — použijte trojúhelníkový vzor pro PVA/BVOH, mřížku pro HIPS

### Nastavení AMS

- Umístěte podpůrný materiál do **slotu AMS s vysoušedlem**
- Pro PVA: zvažte externí sušicí box s Bowden připojením
- Nakonfigurujte správný profil materiálu v Bambu Studio
- Otestujte s jednoduchým modelem s převisem před tiskem složitých dílů

### Běžné problémy a řešení

| Problém | Příčina | Řešení |
|---------|-------|---------|
| Podpora se nedrží | Příliš velká vzdálenost | Snižte vzdálenost rozhraní na 0.05 mm |
| Podpora drží příliš pevně | Příliš malá vzdálenost | Zvyšte vzdálenost rozhraní na 0.2 mm |
| Bubliny v podpůrném materiálu | Vlhkost | Důkladně vysušte filament |
| Stringing mezi materiály | Nedostatečná retrakce | Zvyšte retrakci o 1–2 mm |
| Špatný povrch u podpory | Málo vrstev rozhraní | Zvyšte na 3–4 vrstvy rozhraní |

:::tip Začněte jednoduše
Pro váš první tisk s podpůrným materiálem: použijte PLA + PVA, jednoduchý model s jasným převisem (45°+) a standardní nastavení v Bambu Studio. Optimalizujte postupně se zkušenostmi.
:::
