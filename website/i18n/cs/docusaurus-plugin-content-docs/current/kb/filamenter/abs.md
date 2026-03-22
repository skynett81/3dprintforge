---
sidebar_position: 3
title: ABS
description: Průvodce tiskem ABS — teplota, uzavřená komora, warping a lepidlo
---

# ABS

ABS (Akrylonitril butadien styren) je termoplast s dobrou tepelnou stabilitou a rázovou pevností. Vyžaduje uzavřenou komoru a je náročnější než PLA/PETG, ale dává odolné funkční díly.

## Nastavení

| Parametr | Hodnota |
|-----------|-------|
| Teplota trysky | 240–260 °C |
| Teplota podložky | 90–110 °C |
| Teplota komory | 45–55 °C (X1C/P1S) |
| Chlazení dílu | 0–20% |
| Aux ventilátor | 0% |
| Rychlost | 80–100% |
| Sušení | Doporučeno (4–6 h při 70 °C) |

## Doporučené podložky

| Podložka | Vhodnost | Lepidlo? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Vynikající | Ano (doporučeno) |
| High Temp Plate | Vynikající | Ano |
| Cool Plate (Smooth PEI) | Vyhněte se | — |
| Textured PEI | Dobré | Ano |

:::tip Lepidlo pro ABS
Vždy používejte lepidlo na Engineering Plate při ABS. Zlepšuje přilnavost a usnadňuje uvolnění tisku bez poškození podložky.
:::

## Uzavřená komora

ABS **vyžaduje** uzavřenou komoru pro zabránění warpingu:

- **X1C a P1S:** Vestavěná komora s aktivní kontrolou teploty — ideální pro ABS
- **P1P:** Částečně otevřená — přidejte horní kryt pro lepší výsledky
- **A1 / A1 Mini:** Otevřená CoreXY — **nedoporučuje se** pro ABS bez vlastního uzavření

Udržujte komoru uzavřenou po celou dobu tisku. Neotevírejte ji pro kontrolu tisku — počkáte-li na ochlazení, vyhnete se také warpingu při uvolnění.

## Warping

ABS je velmi náchylný k warpingu (rohy se zvedají):

- **Zvyšte teplotu podložky** — zkuste 105–110 °C
- **Použijte brim** — 5–10 mm brim v Bambu Studio
- **Vyhněte se průvanu** — uzavřete všechny proudění vzduchu kolem tiskárny
- **Snižte chlazení dílu na 0 %** — chlazení způsobuje deformaci

:::warning Výpary
ABS uvolňuje výpary styrenu při tisku. Zajistěte dobré větrání v místnosti nebo použijte HEPA/aktivní uhlíkový filtr. Bambu P1S má vestavěný filtr.
:::

## Dokončovací úpravy

ABS lze snáze brousit, lakovat a lepit než PETG a PLA. Lze ho také vyhlazovat acetonem pro hladký povrch — ale buďte velmi opatrní s expozicí acetonu.

## Skladování

Sušte při **70 °C po dobu 4–6 hodin** před tiskem. Uchovávejte v uzavřené krabici — ABS absorbuje vlhkost, což způsobuje praskavé zvuky a slabé vrstvy.
