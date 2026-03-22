---
sidebar_position: 3
title: Analýza filamentu
description: Podrobná analýza spotřeby filamentu, nákladů, prognóz, spotřebních sazeb a odpadu podle materiálu a dodavatele
---

# Analýza filamentu

Analýza filamentu vám poskytuje úplný přehled o spotřebě filamentu — co používáte, co vás to stojí a kde můžete ušetřit.

Přejděte na: **https://localhost:3443/#filament-analytics**

## Přehled spotřeby

V horní části se zobrazuje souhrn za vybrané období:

- **Celková spotřeba** — gramy a metry pro všechny materiály
- **Odhadované náklady** — na základě zaznamenané ceny za cívku
- **Nejpoužívanější materiál** — typ a dodavatel
- **Míra recyklace** — podíl filamentu ve skutečném modelu vs. podpora/čištění

### Spotřeba podle materiálu

Koláčový diagram a tabulka zobrazují rozdělení mezi materiály:

| Sloupec | Popis |
|---|---|
| Materiál | PLA, PETG, ABS, PA atd. |
| Dodavatel | Bambu Lab, PolyMaker, Prusament atd. |
| Gramy použito | Celková hmotnost |
| Metry | Odhadovaná délka |
| Náklady | Gramy × cena za gram |
| Tisky | Počet tisků s tímto materiálem |

Kliknutím na řádek přejdete na úroveň jednotlivých cívek.

## Spotřební sazby

Spotřební sazba zobrazuje průměrnou spotřebu filamentu za časovou jednotku:

- **Gramy za hodinu** — při aktivním tisku
- **Gramy za týden** — včetně prostojů tiskárny
- **Gramy za tisk** — průměr na výtisk

Tyto hodnoty se používají k výpočtu prognóz budoucích potřeb.

:::tip Plánování nákupů
Pomocí spotřební sazby plánujte zásoby cívek. Systém automaticky upozorní, když odhadovaný stav klesne na nulu do 14 dní (konfigurovatelné).
:::

## Prognóza nákladů

Na základě historické spotřební sazby se vypočítá:

- **Odhadovaná spotřeba na příštích 30 dní** (gramy na materiál)
- **Odhadované náklady na příštích 30 dní**
- **Doporučená skladová zásoba** (dostatečná na 30 / 60 / 90 dní provozu)

Prognóza zohledňuje sezónní výkyvy, pokud máte data alespoň za jeden rok.

## Odpad a účinnost

Viz [Sledování odpadu](./waste) pro úplnou dokumentaci. Analýza filamentu zobrazuje souhrn:

- **AMS čištění** — gramy a podíl z celkové spotřeby
- **Podpůrný materiál** — gramy a podíl
- **Skutečný materiál modelu** — zbývající podíl (účinnost %)
- **Odhadované náklady na odpad** — co vás odpad stojí

## Protokol cívek

Všechny cívky (aktivní i prázdné) jsou zaznamenány:

| Pole | Popis |
|---|---|
| Název cívky | Název materiálu a barva |
| Původní hmotnost | Zaznamenaná hmotnost při spuštění |
| Zbývající hmotnost | Vypočtená zbývající hmotnost |
| Použito | Celkové použité gramy |
| Naposledy použito | Datum posledního tisku |
| Stav | Aktivní / Prázdná / Uskladněná |

## Registrace cen

Pro přesnou analýzu nákladů zaregistrujte ceny za cívku:

1. Přejděte na **Sklad filamentů**
2. Klikněte na cívku → **Upravit**
3. Vyplňte **Nákupní cenu** a **Hmotnost při nákupu**
4. Systém automaticky vypočítá cenu za gram

Cívky bez registrované ceny používají **standardní cenu za gram** (nastavena v **Nastavení → Filament → Standardní cena**).

## Export

1. Klikněte na **Exportovat data filamentu**
2. Vyberte období a formát (CSV / PDF)
3. CSV obsahuje jeden řádek na tisk s gramy, náklady a materiálem
