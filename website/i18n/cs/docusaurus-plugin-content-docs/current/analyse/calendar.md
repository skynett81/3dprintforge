---
sidebar_position: 2
title: Kalendář aktivity
description: Heatmapa ve stylu GitHubu zobrazující denní aktivitu tiskárny během roku s výběrem roku a detailním zobrazením
---

# Kalendář aktivity

Kalendář aktivity zobrazuje vizuální přehled vaší tiskárenské aktivity během celého roku — inspirovaný přehledem příspěvků GitHubu.

Přejděte na: **https://localhost:3443/#calendar**

## Přehled heatmapy

Kalendář zobrazuje 365 dní (52 týdnů) jako mřížku barevných čtverců:

- **Šedá** — žádné tisky tento den
- **Světle zelená** — 1–2 tisky
- **Zelená** — 3–5 tisků
- **Tmavě zelená** — 6–10 tisků
- **Sytě zelená** — 11+ tisků

Čtverce jsou uspořádány s dny v týdnu svisle (Po–Ne) a týdny vodorovně zleva (leden) doprava (prosinec).

:::tip Barevné kódování
Metriku heatmapy můžete přepnout z **Počtu tisků** na **Hodiny** nebo **Gramy filamentu** pomocí přepínače nad kalendářem.
:::

## Výběr roku

Klikněte na **< Rok >** pro přepínání mezi lety:

- K dispozici jsou všechny roky se zaznamenanými tisky
- Aktuální rok se zobrazuje jako výchozí
- Budoucnost je šedá (žádná data)

## Detailní zobrazení dne

Kliknutím na čtverec zobrazíte detaily pro daný den:

- **Datum** a den v týdnu
- **Počet tisků** — úspěšné a neúspěšné
- **Celkový použitý filament** (gramy)
- **Celkové hodiny tisku**
- **Seznam tisků** — kliknutím otevřete v historii

## Přehled měsíců

Pod heatmapou se zobrazuje měsíční přehled s:
- Celkovým počtem tisků za měsíc jako sloupcový graf
- Zvýrazněním nejlepšího dne v měsíci
- Srovnáním se stejným měsícem loňského roku (%)

## Filtr tiskáren

Vyberte tiskárnu z rozevíracího seznamu v horní části pro zobrazení aktivity pouze jedné tiskárny nebo vyberte **Vše** pro agregované zobrazení.

Zobrazení více tiskáren ukazuje barvy naskládané po kliknutí na **Naskládané** ve výběru zobrazení.

## Série a rekordy

Pod kalendářem se zobrazuje:

| Statistika | Popis |
|---|---|
| **Nejdelší série** | Nejvíce po sobě jdoucích dní s alespoň jedním tiskem |
| **Aktuální série** | Probíhající řada aktivních dní |
| **Nejaktivnější den** | Den s celkově největším počtem tisků |
| **Nejaktivnější týden** | Týden s největším počtem tisků |
| **Nejaktivnější měsíc** | Měsíc s největším počtem tisků |

## Export

Kliknutím na **Exportovat** stáhnete data kalendáře:

- **PNG** — obrázek heatmapy (pro sdílení)
- **CSV** — surová data s jedním řádkem za den (datum, počet, gramy, hodiny)

Export PNG je optimalizován pro sdílení na sociálních sítích s názvem tiskárny a rokem jako titulkem.
