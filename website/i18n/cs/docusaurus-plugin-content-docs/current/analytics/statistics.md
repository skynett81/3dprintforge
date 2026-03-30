---
sidebar_position: 1
title: Statistiky
description: Míra úspěšnosti, spotřeba filamentu, trendy a klíčové ukazatele pro všechny tiskárny Bambu Lab v průběhu času
---

# Statistiky

Stránka statistik vám poskytuje kompletní přehled vaší tiskárenské aktivity s klíčovými ukazateli, trendy a spotřebou filamentu za libovolné časové období.

Přejděte na: **https://localhost:3443/#statistics**

## Klíčové ukazatele

V horní části stránky se zobrazují čtyři karty KPI:

| Ukazatel | Popis |
|---|---|
| **Míra úspěšnosti** | Podíl úspěšných tisků z celkového počtu tisků |
| **Celkový filament** | Gramy použité ve vybraném období |
| **Celkové hodiny tisku** | Kumulovaná doba tisku |
| **Průměrná doba tisku** | Medián délky tisku |

Každý ukazatel zobrazuje změnu oproti předchozímu období (↑ nahoru / ↓ dolů) jako procentuální odchylku.

## Míra úspěšnosti

Míra úspěšnosti se vypočítává pro každou tiskárnu i celkově:

- **Úspěšný** — tisk dokončen bez přerušení
- **Přerušen** — ručně zastaven uživatelem
- **Selhal** — zastaven Print Guardem, chybou HMS nebo poruchou hardwaru

Kliknutím na diagram míry úspěšnosti zobrazíte, které tisky selhaly a z jakého důvodu.

:::tip Zlepšení míry úspěšnosti
Použijte [Analýzu vzorů chyb](../monitoring/erroranalysis) k identifikaci a nápravě příčin neúspěšných tisků.
:::

## Trendy

Zobrazení trendů ukazuje vývoj v čase jako čárový graf:

1. Vyberte **Časové období**: Posledních 7 / 30 / 90 / 365 dní
2. Vyberte **Seskupení**: Den / Týden / Měsíc
3. Vyberte **Metriku**: Počet tisků / Hodiny / Gramy / Míra úspěšnosti
4. Kliknutím na **Porovnat** překryjete dvě metriky

Graf podporuje přiblížení (rolování) a posouvání (kliknutím a tažením).

## Spotřeba filamentu

Spotřeba filamentu se zobrazuje jako:

- **Sloupcový graf** — spotřeba za den/týden/měsíc
- **Koláčový diagram** — rozdělení mezi materiály (PLA, PETG, ABS atd.)
- **Tabulka** — podrobný seznam s celkovými gramy, metry a náklady na materiál

### Spotřeba podle tiskárny

Použijte filtr s vícenásobným výběrem nahoře pro:
- Zobrazení pouze jedné tiskárny
- Porovnání dvou tiskáren vedle sebe
- Zobrazení agregovaného součtu pro všechny tiskárny

## Kalendář aktivity

Zobrazujte kompaktní heatmapu ve stylu GitHubu přímo na stránce statistik (zjednodušené zobrazení), nebo přejděte na úplný [Kalendář aktivity](./calendar) pro podrobnější zobrazení.

## Export

1. Klikněte na **Exportovat statistiky**
2. Vyberte rozsah dat a metriky, které chcete zahrnout
3. Vyberte formát: **CSV** (surová data), **PDF** (zpráva) nebo **JSON**
4. Soubor se stáhne

Export CSV je kompatibilní s Excelem a Google Tabulkami pro další analýzu.

## Srovnání s předchozím obdobím

Aktivujte **Zobrazit předchozí období** pro překrytí grafů s odpovídajícím předchozím obdobím:

- Posledních 30 dní vs. 30 dnů předtím
- Aktuální měsíc vs. předchozí měsíc
- Aktuální rok vs. loňský rok

To usnadňuje zjistit, zda tisknete více nebo méně než dříve, a zda se míra úspěšnosti zlepšuje.
