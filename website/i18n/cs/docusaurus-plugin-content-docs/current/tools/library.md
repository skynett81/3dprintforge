---
sidebar_position: 2
title: Knihovna souborů
description: Nahrajte a spravujte 3D modely a G-kód soubory, analyzujte G-kód a propojte s MakerWorld a Printables
---

# Knihovna souborů

Knihovna souborů je centrálním místem pro ukládání a správu všech vašich 3D modelů a G-kód souborů — s automatickou analýzou G-kódu a integrací s MakerWorld a Printables.

Přejděte na: **https://localhost:3443/#library**

## Nahrávání modelů

### Jednoduché nahrání

1. Přejděte na **Knihovna souborů**
2. Klikněte na **Nahrát** nebo přetáhněte soubory do oblasti nahrávání
3. Podporované formáty: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Soubor je po nahrání automaticky analyzován

:::info Složka úložiště
Soubory jsou uloženy ve složce nakonfigurované v části **Nastavení → Knihovna souborů → Složka úložiště**. Výchozí: `./data/library/`
:::

### Hromadné nahrání

Přetáhněte celou složku pro nahrání všech podporovaných souborů najednou. Soubory jsou zpracovávány na pozadí a budete upozorněni, když bude vše hotovo.

## Analýza G-kódu

Po nahrání jsou soubory `.gcode` a `.bgcode` automaticky analyzovány:

| Metrika | Popis |
|---|---|
| Odhadovaná doba tisku | Čas vypočítaný z příkazů G-kódu |
| Spotřeba filamentu | Gramy a metry na materiál/barvu |
| Počet vrstev | Celkový počet vrstev |
| Tloušťka vrstvy | Zaznamenaná tloušťka vrstvy |
| Materiály | Detekované materiály (PLA, PETG atd.) |
| Procento výplně | Pokud je dostupné v metadatech |
| Podpůrný materiál | Odhadovaná hmotnost podpor |
| Model tiskárny | Cílová tiskárna z metadat |

Data analýzy se zobrazují na kartě souboru a jsou používána [Kalkulačkou nákladů](../analytics/costestimator).

## Karty souborů a metadata

Každá karta souboru zobrazuje:
- **Název souboru** a formát
- **Datum nahrání**
- **Miniatura** (z `.3mf` nebo vygenerovaná)
- **Analyzovaná doba tisku** a spotřeba filamentu
- **Tagy** a kategorie
- **Propojené tisky** — kolikrát byl vytisknut

Kliknutím na kartu otevřete podrobné zobrazení s úplnými metadaty a historií.

## Organizace

### Tagy

Přidejte tagy pro snadné vyhledávání:
1. Klikněte na soubor → **Upravit metadata**
2. Zadejte tagy (odděleno čárkou): `benchy, test, PLA, kalibrace`
3. Vyhledávejte v knihovně pomocí filtru tagů

### Kategorie

Organizujte soubory do kategorií:
- Klikněte na **Nová kategorie** v bočním panelu
- Přetáhněte soubory do kategorie
- Kategorie lze vnořovat (podporovány podkategorie)

## Propojení s MakerWorld

1. Přejděte na **Nastavení → Integrace → MakerWorld**
2. Přihlaste se pomocí svého účtu Bambu Lab
3. Zpět v knihovně: klikněte na soubor → **Propojit s MakerWorld**
4. Vyhledejte model na MakerWorld a vyberte správný výsledek
5. Metadata (designer, licence, hodnocení) se importují z MakerWorld

Propojení zobrazuje jméno designéra a původní URL na kartě souboru.

## Propojení s Printables

1. Přejděte na **Nastavení → Integrace → Printables**
2. Vložte svůj API klíč Printables
3. Propojte soubory s modely Printables stejným způsobem jako MakerWorld

## Odeslání na tiskárnu

Z knihovny souborů lze odeslat přímo na tiskárnu:

1. Klikněte na soubor → **Odeslat na tiskárnu**
2. Vyberte cílovou tiskárnu
3. Vyberte pozici AMS (pro vícebarevné tisky)
4. Klikněte na **Spustit tisk** nebo **Přidat do fronty**

:::warning Přímé odesílání
Přímé odesílání spustí tisk okamžitě bez potvrzení v Bambu Studio. Ujistěte se, že je tiskárna připravena.
:::
