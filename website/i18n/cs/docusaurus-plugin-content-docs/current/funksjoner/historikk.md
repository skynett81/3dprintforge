---
sidebar_position: 3
title: Historie tisků
description: Kompletní protokol všech tisků se statistikami, sledováním filamentů a exportem
---

# Historie tisků

Historie tisků poskytuje kompletní protokol všech tisků provedených s dashboardem, včetně statistik, spotřeby filamentů a odkazů na zdroje modelů.

## Tabulka historie

Tabulka zobrazuje všechny tisky s:

| Sloupec | Popis |
|---------|-------------|
| Datum/čas | Čas spuštění |
| Název modelu | Název souboru nebo název MakerWorld |
| Tiskárna | Která tiskárna byla použita |
| Trvání | Celková doba tisku |
| Filament | Materiál a použité gramy |
| Vrstvy | Počet vrstev a hmotnost (g) |
| Stav | Dokončeno, přerušeno, selhalo |
| Snímek | Miniatura (při cloudové integraci) |

## Vyhledávání a filtrování

Použijte vyhledávací pole a filtry pro nalezení tisků:

- Fulltextové vyhledávání v názvech modelů
- Filtrování podle tiskárny, materiálu, stavu, data
- Řazení podle všech sloupců

## Odkazy na zdroje modelů

Pokud byl tisk spuštěn z MakerWorld, zobrazí se přímý odkaz na stránku modelu. Kliknutím na název modelu otevřete MakerWorld v nové záložce.

:::info Bambu Cloud
Odkazy na modely a miniatury vyžadují integraci Bambu Cloud. Viz [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Sledování filamentů

Pro každý tisk se zaznamenává:

- **Materiál** — PLA, PETG, ABS atd.
- **Použité gramy** — odhadovaná spotřeba
- **Cívka** — která cívka byla použita (pokud je registrována ve skladu)
- **Barva** — hex kód barvy

To poskytuje přesný přehled spotřeby filamentů v průběhu času a pomáhá plánovat nákupy.

## Statistiky

V části **Historie → Statistiky** najdete agregovaná data:

- **Celkový počet tisků** — a míra úspěšnosti
- **Celková doba tisku** — hodiny a dny
- **Spotřeba filamentů** — gramy a km na materiál
- **Tisky za den** — průběžný graf
- **Nejpoužívanější materiály** — koláčový diagram
- **Distribuce délky tisku** — histogram

Statistiky lze filtrovat podle časového období (7d, 30d, 90d, 1rok, vše).

## Export

### Export CSV
Exportujte celou historii nebo filtrované výsledky:
**Historie → Export → Stáhnout CSV**

Soubory CSV obsahují všechny sloupce a lze je otevřít v Excelu, LibreOffice Calc nebo importovat do jiných nástrojů.

### Automatická záloha
Historie je součástí databáze SQLite, která se automaticky zálohuje při aktualizacích. Ruční záloha v části **Nastavení → Záloha**.

## Úpravy

Záznamy tiskového protokolu můžete dodatečně upravit:

- Opravit názvy modelů
- Přidat poznámky
- Opravit spotřebu filamentů
- Smazat nesprávně zaznamenané tisky

Kliknutím pravým tlačítkem na řádek a výběrem **Upravit** nebo kliknutím na ikonu tužky.
