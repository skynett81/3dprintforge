---
sidebar_position: 6
title: ASA
description: Průvodce tiskem ASA s Bambu Lab — UV odolnost, venkovní použití, teploty a tipy
---

# ASA

ASA (Acrylonitrile Styrene Acrylate) je UV odolná varianta ABS speciálně vyvinutá pro venkovní použití. Materiál kombinuje pevnost a tuhost ABS s výrazně lepší odolností vůči UV záření, stárnutí a povětrnostním vlivům.

## Nastavení

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 240–260 °C |
| Teplota podložky | 90–110 °C |
| Teplota komory | 40–50 °C (doporučeno) |
| Chlazení dílu | 30–50% |
| Rychlost | 80–100% |
| Sušení nutné | Ano |

## Doporučené tiskové podložky

| Podložka | Vhodnost | Lepidlo? |
|-------|---------|----------|
| Engineering Plate | Vynikající | Ne |
| High Temp Plate | Dobrá | Ano |
| Textured PEI | Přijatelná | Ano |
| Cool Plate (Smooth PEI) | Nedoporučuje se | — |

:::tip Engineering Plate je nejlepší pro ASA
Engineering Plate poskytuje nejspolehlivější přilnavost pro ASA bez lepidla. Podložka zvládá vysoké teploty a zajišťuje dobrou adhezi bez trvalého přichycení dílu.
:::

## Požadavky na tiskárnu

ASA vyžaduje **uzavřenou komoru (enclosure)** pro nejlepší výsledky. Bez uzavření se setkáte s:

- **Kroucení (warping)** — rohy se zvedají od tiskové podložky
- **Delaminace** — špatné spojení mezi vrstvami
- **Povrchové praskliny** — viditelné praskliny podél tisku

| Tiskárna | Vhodná pro ASA? | Poznámka |
|---------|---------------|---------|
| X1C | Vynikající | Plně uzavřená, aktivní vytápění |
| X1E | Vynikající | Plně uzavřená, aktivní vytápění |
| P1S | Dobrá | Uzavřená, pasivní vytápění |
| P1P | Možné s příslušenstvím | Vyžaduje příslušenství pro uzavření |
| A1 | Nedoporučuje se | Otevřený rám |
| A1 Mini | Nedoporučuje se | Otevřený rám |

## ASA vs ABS — srovnání

| Vlastnost | ASA | ABS |
|----------|-----|-----|
| UV odolnost | Vynikající | Špatná |
| Venkovní použití | Ano | Ne (žloutne a křehne) |
| Kroucení | Střední | Vysoké |
| Povrch | Matný, rovný | Matný, rovný |
| Chemická odolnost | Dobrá | Dobrá |
| Cena | O něco vyšší | Nižší |
| Zápach při tisku | Střední | Silný |
| Rázová houževnatost | Dobrá | Dobrá |
| Teplotní odolnost | ~95–105 °C | ~95–105 °C |

:::warning Ventilace
ASA uvolňuje při tisku plyny, které mohou být dráždivé. Tiskněte v dobře větrané místnosti nebo se systémem filtrace vzduchu. Netiskněte ASA v místnosti, kde se zdržujete delší dobu bez ventilace.
:::

## Sušení

ASA je **středně hygroskopické** a postupně absorbuje vlhkost ze vzduchu.

| Parametr | Hodnota |
|-----------|-------|
| Teplota sušení | 65 °C |
| Doba sušení | 4–6 hodin |
| Hygroskopická úroveň | Střední |
| Příznaky vlhkosti | Praskání, bubliny, špatný povrch |

- Po otevření uchovávejte v uzavřeném sáčku se silikagelem
- AMS s vysoušedlem je dostatečná pro krátkodobé skladování
- Pro dlouhodobé skladování: použijte vakuový sáček nebo sušicí box na filament

## Oblasti použití

ASA je preferovaný materiál pro vše, co bude používáno **venku**:

- **Automobilové díly** — kryty zrcátek, detaily palubní desky, krytky ventilů
- **Zahradní nářadí** — sponky, svorky, díly zahradního nábytku
- **Venkovní cedule** — tabule, písmena, loga
- **Díly dronů** — podvozek, úchyty kamery
- **Montáže solárních panelů** — držáky a úhelníky
- **Díly poštovní schránky** — mechanismy a dekorace

## Tipy pro úspěšný tisk ASA

### Brim a adheze

- **Použijte brim** pro velké díly a díly s malou kontaktní plochou
- Brim 5–8 mm účinně zabraňuje kroucení
- Pro menší díly můžete zkusit bez brimu, ale mějte jej připravený jako zálohu

### Vyhněte se průvanu

- **Zavřete všechny dveře a okna** v místnosti během tisku
- Průvan a studený vzduch jsou největší nepřátelé ASA
- Neotevírejte dvířka komory během tisku

### Teplotní stabilita

- Nechte komoru zahřát **10–15 minut** před zahájením tisku
- Stabilní teplota komory dává rovnoměrnější výsledky
- Neumisťujte tiskárnu blízko oken nebo ventilačních otvorů

### Chlazení

- ASA vyžaduje **omezené chlazení dílu** — 30–50% je typické
- Pro převisy a mosty lze zvýšit na 60–70%, ale očekávejte určitou delaminaci
- Pro mechanické díly: upřednostněte spojení vrstev před detaily snížením chlazení

:::tip Poprvé s ASA?
Začněte s malým testovacím dílem (např. kostka 30 mm) pro kalibraci nastavení. ASA se chová velmi podobně jako ABS, ale s mírně nižší tendencí ke kroucení. Máte-li zkušenosti s ABS, ASA vám připadne jako vylepšení.
:::

---

## Smrštění

ASA se smršťuje více než PLA a PETG, ale obecně o něco méně než ABS:

| Materiál | Smrštění |
|-----------|----------|
| PLA | ~0.3–0.5% |
| PETG | ~0.3–0.6% |
| ASA | ~0.5–0.7% |
| ABS | ~0.7–0.8% |

Pro díly s přísnými tolerancemi: kompenzujte 0.5–0.7% ve sliceru nebo nejprve otestujte se zkušebními díly.

---

## Následné zpracování

- **Vyhlazení acetonem** — ASA lze vyhladit acetonovými parami, stejně jako ABS
- **Broušení** — dobře se brousí brusným papírem 200–400
- **Lepení** — CA lepidlo nebo acetonové lepení funguje výborně
- **Lakování** — dobře přijímá barvu po lehkém přebroušení

:::danger Práce s acetonem
Aceton je hořlavý a uvolňuje toxické plyny. Vždy používejte v dobře větrané místnosti, vyhněte se otevřenému ohni a používejte ochranné pomůcky (rukavice a brýle).
:::
