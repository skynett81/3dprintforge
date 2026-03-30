---
sidebar_position: 7
title: PC
description: Průvodce tiskem PC (polykarbonátu) s Bambu Lab — vysoká pevnost, tepelná odolnost a požadavky
---

# PC (Polykarbonát)

Polykarbonát je jedním z nejpevnějších termoplastických materiálů dostupných pro FDM tisk. Kombinuje extrémně vysokou rázovou houževnatost, tepelnou odolnost až 110–130 °C a přirozenou průhlednost. PC je náročný materiál na tisk, ale poskytuje výsledky blížící se kvalitě vstřikovaných dílů.

## Nastavení

| Parametr | Čistý PC | PC-ABS směs | PC-CF |
|-----------|--------|-------------|-------|
| Teplota trysky | 260–280 °C | 250–270 °C | 270–290 °C |
| Teplota podložky | 100–120 °C | 90–110 °C | 100–120 °C |
| Teplota komory | 50–60 °C (vyžadováno) | 45–55 °C | 50–60 °C |
| Chlazení dílu | 0–20% | 20–30% | 0–20% |
| Rychlost | 60–80% | 70–90% | 50–70% |
| Sušení nutné | Ano (kritické) | Ano | Ano (kritické) |

## Doporučené tiskové podložky

| Podložka | Vhodnost | Lepidlo? |
|-------|---------|----------|
| High Temp Plate | Vynikající (vyžadováno) | Ne |
| Engineering Plate | Přijatelná | Ano |
| Textured PEI | Nedoporučuje se | — |
| Cool Plate (Smooth PEI) | Nepoužívat | — |

:::danger High Temp Plate je vyžadována
PC vyžaduje teploty podložky 100–120 °C. Cool Plate a Textured PEI tyto teploty nesnesou a budou poškozeny. Pro čistý PC **vždy** používejte High Temp Plate.
:::

## Požadavky na tiskárnu a vybavení

### Uzavřená komora (vyžadováno)

PC vyžaduje **plně uzavřenou komoru** se stabilní teplotou 50–60 °C. Bez ní budete čelit závažnému kroucení, delaminaci a oddělování vrstev.

### Kalená tryska (důrazně doporučeno)

Čistý PC není abrazivní, ale PC-CF a PC-GF **vyžadují kalenou ocelovou trysku** (např. Bambu Lab HS01). Pro čistý PC je kalená tryska také doporučena kvůli vysokým teplotám.

### Kompatibilita tiskáren

| Tiskárna | Vhodná pro PC? | Poznámka |
|---------|--------------|---------|
| X1C | Vynikající | Plně uzavřená, HS01 k dispozici |
| X1E | Vynikající | Navržena pro technické materiály |
| P1S | Omezená | Uzavřená, ale bez aktivního vytápění komory |
| P1P | Nedoporučuje se | Bez uzavření |
| A1 / A1 Mini | Nepoužívat | Otevřený rám, nízké teploty |

:::warning Doporučuje se pouze X1C a X1E
PC vyžaduje aktivní vytápění komory pro konzistentní výsledky. P1S může dát přijatelné výsledky u malých dílů, ale u větších dílů očekávejte kroucení a delaminaci.
:::

## Sušení

PC je **velmi hygroskopický** a rychle absorbuje vlhkost. Vlhký PC má katastrofální výsledky tisku.

| Parametr | Hodnota |
|-----------|-------|
| Teplota sušení | 70–80 °C |
| Doba sušení | 6–8 hodin |
| Hygroskopická úroveň | Vysoká |
| Max. doporučená vlhkost | < 0.02% |

- PC **vždy** sušte před tiskem — i nově otevřené cívky mohly absorbovat vlhkost
- Pokud možno tiskněte přímo ze sušicí komory
- AMS **není dostatečná** pro skladování PC — vlhkost je příliš vysoká
- Používejte specializovanou sušičku filamentu s aktivním ohřevem

:::danger Vlhkost ničí tisky z PC
Příznaky vlhkého PC: silné praskání, bubliny na povrchu, velmi špatné spojení vrstev, stringing. Vlhký PC nelze kompenzovat nastavením — **musí** být nejprve vysušen.
:::

## Vlastnosti

| Vlastnost | Hodnota |
|----------|-------|
| Pevnost v tahu | 55–75 MPa |
| Rázová houževnatost | Extrémně vysoká |
| Tepelná odolnost (HDT) | 110–130 °C |
| Průhlednost | Ano (přírodní/čirá varianta) |
| Chemická odolnost | Střední |
| UV odolnost | Střední (žloutne časem) |
| Smrštění | ~0.5–0.7% |

## Směsi PC

### PC-ABS

Směs polykarbonátu a ABS kombinující pevnost obou materiálů:

- **Snadnější tisk** než čistý PC — nižší teploty a menší kroucení
- **Rázová houževnatost** mezi ABS a PC
- **Populární v průmyslu** — používá se v automobilových interiérech a elektronických krytech
- Tisk při 250–270 °C tryska, 90–110 °C podložka

### PC-CF (uhlíkové vlákno)

Polykarbonát vyztužený uhlíkovým vláknem pro maximální tuhost a pevnost:

- **Extrémně tuhý** — ideální pro strukturální díly
- **Lehký** — uhlíkové vlákno snižuje hmotnost
- **Vyžaduje kalenou trysku** — mosaz se opotřebí za hodiny
- Tisk při 270–290 °C tryska, 100–120 °C podložka
- Dražší než čistý PC, ale mechanické vlastnosti blízké hliníku

### PC-GF (skleněné vlákno)

Polykarbonát vyztužený skleněným vláknem:

- **Levnější než PC-CF** s dobrou tuhostí
- **Bělejší povrch** než PC-CF
- **Vyžaduje kalenou trysku** — skleněná vlákna jsou velmi abrazivní
- O něco nižší tuhost než PC-CF, ale lepší rázová houževnatost

## Oblasti použití

PC se používá tam, kde potřebujete **maximální pevnost a/nebo tepelnou odolnost**:

- **Mechanické díly** — ozubená kola, upevňovače, spojky pod zátěží
- **Optické díly** — čočky, světlovody, průhledné kryty (čirý PC)
- **Tepelně odolné díly** — motorový prostor, blízko topných těles
- **Elektronické kryty** — ochranný kryt s dobrou rázovou houževnatostí
- **Nástroje a přípravky** — přesné montážní nástroje

## Tipy pro úspěšný tisk PC

### První vrstva

- Snižte rychlost na **30–40%** pro první vrstvu
- Zvyšte teplotu podložky o 5 °C nad standard pro první 3–5 vrstev
- **Brim je povinný** pro většinu dílů z PC — použijte 8–10 mm

### Teplota komory

- Nechte komoru dosáhnout **50 °C+** před zahájením tisku
- **Neotevírejte dvířka komory** během tisku — pokles teploty způsobí okamžité kroucení
- Po tisku: nechte díl **pomalu** vychladnout v komoře (1–2 hodiny)

### Chlazení

- Používejte **minimální chlazení dílu** (0–20%) pro nejlepší spojení vrstev
- Pro mosty a převisy: dočasně zvyšte na 30–40%
- U PC upřednostněte pevnost vrstev před estetikou

### Konstrukční úvahy

- **Vyhněte se ostrým rohům** — zaoblete s minimálním poloměrem 1 mm
- **Rovnoměrná tloušťka stěn** — nerovnoměrná tloušťka vytváří vnitřní pnutí
- **Velké ploché povrchy** jsou obtížné — rozdělte nebo přidejte žebra

:::tip Nový s PC? Začněte s PC-ABS
Pokud jste nikdy PC netiskli, začněte se směsí PC-ABS. Je mnohem tolerantnější než čistý PC a umožní vám získat zkušenosti s materiálem bez extrémních požadavků. Až zvládnete PC-ABS, přejděte na čistý PC.
:::

---

## Následné zpracování

- **Broušení** — PC se brousí dobře, ale pro čirý PC použijte mokré broušení
- **Leštění** — čirý PC lze vyleštit do téměř optické kvality
- **Lepení** — lepení dichlormethanu vytváří neviditelné spoje (používejte ochranné pomůcky!)
- **Lakování** — vyžaduje základ pro dobrou přilnavost
- **Žíhání** — 120 °C po dobu 1–2 hodin snižuje vnitřní pnutí

:::warning Lepení dichlormethanu
Dichlormethanol je toxický a vyžaduje odsávání, chemicky odolné rukavice a ochranné brýle. Vždy pracujte v dobře větrané místnosti nebo v digestoři.
:::
