---
sidebar_position: 5
title: Sledování odpadu
description: Sledujte odpad filamentu z čištění AMS a podpůrného materiálu, vypočítejte náklady a optimalizujte účinnost
---

# Sledování odpadu

Sledování odpadu vám poskytuje úplný přehled o tom, kolik filamentu se při tisku zbytečně spotřebuje — čištění AMS, proplachování při výměnách materiálu a podpůrný materiál — a co vás to stojí.

Přejděte na: **https://localhost:3443/#waste**

## Kategorie odpadu

Bambu Dashboard rozlišuje tři typy odpadu:

| Kategorie | Zdroj | Typické množství |
|---|---|---|
| **Čištění AMS** | Výměna barev v AMS při vícebarevném tisku | 5–30 g za výměnu |
| **Proplachování při výměně materiálu** | Čištění při přechodu mezi různými materiály | 10–50 g za výměnu |
| **Podpůrný materiál** | Podpůrné struktury odstraněné po tisku | Variabilní |

## Sledování čištění AMS

Data čištění AMS se načítají přímo z telemetrie MQTT a analýzy G-kódu:

- **Gramy za výměnu barvy** — vypočítáno z bloku čištění G-kódu
- **Počet výměn barev** — spočteno z protokolu tisku
- **Celková spotřeba čištění** — součet za vybrané období

:::tip Snížení čištění
Bambu Studio má nastavení pro objem čištění na kombinaci barev. Snižte objem čištění pro barevné páry s malým rozdílem (např. bílá → světle šedá) pro úsporu filamentu.
:::

## Výpočet účinnosti

Účinnost se vypočítá jako:

```
Účinnost % = (materiál modelu / celková spotřeba) × 100

Celková spotřeba = materiál modelu + čištění + podpůrný materiál
```

**Příklad:**
- Model: 45 g
- Čištění: 12 g
- Podpora: 8 g
- Celkem: 65 g
- **Účinnost: 69 %**

Účinnost se zobrazuje jako trendový diagram v průběhu času, abyste viděli, zda se zlepšujete.

## Náklady na odpad

Na základě zaregistrovaných cen filamentů se vypočítá:

| Položka | Výpočet |
|---|---|
| Náklady na čištění | Gramy čištění × cena/gram za barvu |
| Náklady na podporu | Gramy podpory × cena/gram |
| **Celkové náklady na odpad** | Součet výše uvedeného |
| **Náklady na úspěšný tisk** | Náklady na odpad / počet tisků |

## Odpad podle tiskárny a materiálu

Filtrujte zobrazení podle:

- **Tiskárny** — zjistěte, která tiskárna generuje nejvíce odpadu
- **Materiálu** — zobrazení odpadu podle typu filamentu
- **Období** — den, týden, měsíc, rok

Tabulkové zobrazení ukazuje seřazený seznam s nejvyšším odpadem nahoře, včetně odhadovaných nákladů.

## Tipy pro optimalizaci

Systém automaticky generuje návrhy pro snížení odpadu:

- **Přehozené pořadí barev** — pokud čištění A→B generuje více odpadu než B→A, systém navrhne přehození pořadí
- **Sloučení vrstev výměny barev** — seskupuje vrstvy se stejnou barvou pro minimalizaci výměn
- **Optimalizace podpůrných struktur** — odhaduje snížení podpor změnou orientace

:::info Přesnost
Výpočty čištění jsou odhadovány z G-kódu. Skutečný odpad se může lišit o 10–20 % kvůli chování tiskárny.
:::

## Export a reportování

1. Klikněte na **Exportovat data odpadu**
2. Vyberte období a formát (CSV / PDF)
3. Data odpadu mohou být zahrnuta do projektových zpráv a faktur jako nákladová položka

Viz také [Analýza filamentu](./filamentanalytics) pro celkový přehled spotřeby.
