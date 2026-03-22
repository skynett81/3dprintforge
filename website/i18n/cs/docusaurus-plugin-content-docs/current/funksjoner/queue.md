---
sidebar_position: 5
title: Fronta tisků
description: Plánujte a automatizujte tisky s prioritní frontou, automatickým odesíláním a postupným spouštěním
---

# Fronta tisků

Fronta tisků vám umožňuje plánovat tisky předem a automaticky je odesílat na dostupné tiskárny, jakmile jsou volné.

Přejděte na: **https://localhost:3443/#queue**

## Vytvoření fronty

1. Přejděte na **Frontu tisků** v navigačním menu
2. Klikněte na **Nová úloha** (ikona +)
3. Vyplňte:
   - **Název souboru** — nahrajte `.3mf` nebo `.gcode`
   - **Cílová tiskárna** — vyberte konkrétní tiskárnu nebo **Automaticky**
   - **Priorita** — Nízká / Normální / Vysoká / Kritická
   - **Plánované spuštění** — nyní nebo konkrétní datum/čas
4. Klikněte na **Přidat do fronty**

:::tip Přetahování
Soubory lze přímo přetáhnout z průzkumníku souborů na stránku fronty pro rychlé přidání.
:::

## Přidávání souborů

### Nahrání souboru

1. Klikněte na **Nahrát** nebo přetáhněte soubor do pole pro nahrávání
2. Podporované formáty: `.3mf`, `.gcode`, `.bgcode`
3. Soubor se uloží do knihovny souborů a propojí se s úlohou fronty

### Z knihovny souborů

1. Přejděte na **Knihovnu souborů** a najděte soubor
2. Klikněte na **Přidat do fronty** na souboru
3. Úloha se vytvoří s výchozím nastavením — v případě potřeby upravte

### Z historie

1. Otevřete předchozí tisk v **Historii**
2. Klikněte na **Tisknout znovu**
3. Úloha se přidá se stejným nastavením jako naposledy

## Priorita

Fronta se zpracovává v pořadí priorit:

| Priorita | Barva | Popis |
|---|---|---|
| Kritická | Červená | Odesílá se na první volnou tiskárnu bez ohledu na ostatní úlohy |
| Vysoká | Oranžová | Před normálními a nízkými úlohami |
| Normální | Modrá | Standardní pořadí (FIFO) |
| Nízká | Šedá | Odesílá se pouze pokud nečekají žádné vyšší úlohy |

Přetažením úloh ve frontě lze ručně změnit pořadí ve stejné úrovni priority.

## Automatické odesílání

Když je aktivováno **Automatické odesílání**, Bambu Dashboard monitoruje všechny tiskárny a automaticky odesílá další úlohu:

1. Přejděte na **Nastavení → Fronta**
2. Zapněte **Automatické odesílání**
3. Vyberte **Strategii odesílání**:
   - **První volná** — odesílá na první tiskárnu, která se uvolní
   - **Nejméně používaná** — upřednostňuje tiskárnu s nejmenším počtem tisků dnes
   - **Round-robin** — rovnoměrně rotuje mezi všemi tiskárnami

:::warning Potvrzení
Aktivujte **Vyžadovat potvrzení** v nastavení, pokud chcete ručně schvalovat každé odeslání před odesláním souboru.
:::

## Postupné spouštění

Postupné spouštění je užitečné pro zabránění spuštění a dokončení všech tiskáren současně:

1. V dialogu **Nová úloha** rozbalte **Pokročilá nastavení**
2. Aktivujte **Postupné spouštění**
3. Nastavte **Zpoždění mezi tiskárnami** (např. 30 minut)
4. Systém automaticky rozdělí časy spouštění

**Příklad:** 4 identické úlohy s 30minutovým zpožděním se spustí v 08:00, 08:30, 09:00 a 09:30.

## Stav fronty a sledování

Přehled fronty zobrazuje všechny úlohy se stavem:

| Stav | Popis |
|---|---|
| Čeká | Úloha je ve frontě a čeká na tiskárnu |
| Naplánovaná | Má naplánovaný čas spuštění v budoucnosti |
| Odesílá se | Přenáší se na tiskárnu |
| Tiskne | Probíhá na vybrané tiskárně |
| Dokončena | Hotovo — propojeno s historií |
| Selhala | Chyba při odesílání nebo během tisku |
| Zrušena | Ručně zrušena |

:::info Oznámení
Aktivujte oznámení pro události fronty v části **Nastavení → Oznámení → Fronta** pro upozornění při spuštění, dokončení nebo selhání úlohy. Viz [Oznámení](./notifications).
:::
