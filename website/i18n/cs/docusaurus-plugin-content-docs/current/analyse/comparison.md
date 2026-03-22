---
sidebar_position: 6
title: Porovnání tisků
description: Porovnejte dva tisky vedle sebe s podrobnými metrikami, grafy a galérií obrázků pro A/B analýzu
---

# Porovnání tisků

Porovnání tisků vám umožňuje analyzovat dva tisky vedle sebe — užitečné pro porovnání nastavení, materiálů, tiskáren nebo verzí stejného modelu.

Přejděte na: **https://localhost:3443/#comparison**

## Výběr tisků k porovnání

1. Přejděte na **Porovnání tisků**
2. Klikněte na **Vybrat tisk A** a prohledejte historii
3. Klikněte na **Vybrat tisk B** a prohledejte historii
4. Klikněte na **Porovnat** pro načtení zobrazení porovnání

:::tip Rychlejší přístup
Z **Historie** můžete pravým tlačítkem kliknout na tisk a vybrat **Nastavit jako tisk A** nebo **Porovnat s...** pro přechod přímo do režimu porovnání.
:::

## Porovnání metrik

Metriky se zobrazují ve dvou sloupcích (A a B) se zvýrazněním toho lepšího:

| Metrika | Popis |
|---|---|
| Úspěch | Dokončen / Přerušen / Selhal |
| Trvání | Celková doba tisku |
| Spotřeba filamentu | Gramy celkem a podle barvy |
| Účinnost filamentu | % modelu z celkové spotřeby |
| Max. teplota trysky | Nejvyšší zaznamenaná teplota trysky |
| Max. teplota podložky | Nejvyšší zaznamenaná teplota podložky |
| Nastavení rychlosti | Tichý / Standardní / Sport / Turbo |
| Výměny AMS | Počet barevných výměn |
| Chyby HMS | Případné chyby během tisku |
| Tiskárna | Která tiskárna byla použita |

Buňky s nejlepší hodnotou jsou zobrazeny se zeleným pozadím.

## Grafy teplot

Dva grafy teplot se zobrazují vedle sebe (nebo překryté):

- **Oddělené zobrazení** — graf A vlevo, graf B vpravo
- **Překryté zobrazení** — oba v jednom grafu s různými barvami

Použijte překryté zobrazení pro přímé srovnání stability teplot a rychlosti zahřívání.

## Obrázky z galerie

Pokud mají oba tisky snímky milníků, zobrazí se v mřížce:

| Tisk A | Tisk B |
|---|---|
| Snímek 25 % A | Snímek 25 % B |
| Snímek 50 % A | Snímek 50 % B |
| Snímek 75 % A | Snímek 75 % B |
| Snímek 100 % A | Snímek 100 % B |

Kliknutím na obrázek otevřete celostránkový náhled se slideshow animací.

## Porovnání časosběrných videí

Pokud mají oba tisky časosběrné záznamy, zobrazí se videa vedle sebe:

- Synchronizované přehrávání — obě se spustí a pozastaví současně
- Nezávislé přehrávání — ovládejte každé video samostatně

## Rozdíly v nastavení

Systém automaticky zvýrazňuje rozdíly v nastavení tisku (získané z metadat G-kódu):

- Různé tloušťky vrstvy
- Různé vzory nebo procenta výplně
- Různá nastavení podpor
- Různé rychlostní profily

Rozdíly jsou zobrazeny s oranžovým zvýrazněním v tabulce nastavení.

## Uložení porovnání

1. Klikněte na **Uložit porovnání**
2. Pojmenujte porovnání (např. «PLA vs PETG - Benchy»)
3. Porovnání se uloží a je dostupné přes **Historii → Porovnání**

## Export

1. Klikněte na **Exportovat**
2. Vyberte **PDF** pro zprávu se všemi metrikami a obrázky
3. Zprávu lze propojit s projektem pro dokumentaci výběru materiálu
