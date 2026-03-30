---
sidebar_position: 2
title: Hlavní panel
description: Přehled aktivní tiskárny v reálném čase se zobrazením 3D modelu, stavem AMS, kamerou a přizpůsobitelnými widgety
---

# Hlavní panel

Hlavní panel je centrálním řídicím centrem Bambu Dashboard. Zobrazuje stav vybrané tiskárny v reálném čase a umožňuje monitorování, řízení a přizpůsobení zobrazení podle potřeby.

Přejděte na: **https://localhost:3443/**

## Přehled v reálném čase

Když je tiskárna aktivní, všechny hodnoty se průběžně aktualizují přes MQTT:

- **Teplota trysky** — animovaný SVG kruhový ukazatel s cílovou teplotou
- **Teplota podložky** — odpovídající kruhový ukazatel pro tiskovou podložku
- **Průběh v procentech** — velký procentuální ukazatel se zbývajícím časem
- **Čítač vrstev** — aktuální vrstva / celkový počet vrstev
- **Rychlost** — Tichý / Standardní / Sport / Turbo s posuvníkem

:::tip Aktualizace v reálném čase
Všechny hodnoty se aktualizují přímo z tiskárny přes MQTT bez obnovení stránky. Zpoždění je obvykle pod 1 sekundu.
:::

## Zobrazení 3D modelu

Pokud tiskárna odesílá soubor `.3mf` s modelem, zobrazí se interaktivní 3D náhled:

1. Model se automaticky načte při spuštění tisku
2. Otočte model přetažením myší
3. Přiblíženírolováním
4. Kliknutím na **Resetovat** se vrátíte na výchozí zobrazení

:::info Podpora
3D zobrazení vyžaduje, aby tiskárna odesílala data modelu. Ne všechny tiskové úlohy to zahrnují.
:::

## Stav AMS

Panel AMS zobrazuje všechny namontované jednotky AMS s sloty a filamentem:

- **Barva slotu** — vizuální barevná reprezentace z metadat Bambu
- **Název filamentu** — materiál a značka
- **Aktivní slot** — zvýrazněn pulsující animací při tisku
- **Chyby** — červený indikátor při chybách AMS (ucpání, prázdný, vlhký)

Kliknutím na slot zobrazíte úplné informace o filamentu a propojíte ho se skladem filamentů.

## Kamerový feed

Live zobrazení kamery se konvertuje přes ffmpeg (RTSPS → MPEG1):

1. Kamera se automaticky spustí při otevření dashboardu
2. Kliknutím na obraz kamery otevřete celou obrazovku
3. Použijte tlačítko **Snímek** pro pořízení statického snímku
4. Kliknutím na **Skrýt kameru** uvolníte prostor

:::warning Výkon
Stream kamery spotřebovává přibližně 2–5 Mbit/s. Deaktivujte kameru při pomalých síťových připojeních.
:::

## Sparklines teplot

Pod panelem AMS se zobrazují mini grafy (sparklines) za posledních 30 minut:

- Teplota trysky v průběhu času
- Teplota podložky v průběhu času
- Teplota komory (kde je dostupná)

Kliknutím na sparkline otevřete plné zobrazení telemetrického grafu.

## Přizpůsobení widgetů

Dashboard používá přetahovatelnou mřížku (grid layout):

1. Klikněte na **Přizpůsobit rozvržení** (ikona tužky vpravo nahoře)
2. Přetáhněte widgety na požadovanou pozici
3. Změňte velikost přetažením rohu
4. Kliknutím na **Uzamknout rozvržení** zmrazíte umístění
5. Kliknutím na **Uložit** zachováte rozvržení

Dostupné widgety:
| Widget | Popis |
|---|---|
| Kamera | Live zobrazení kamery |
| AMS | Stav cívky a filamentu |
| Teplota | Kruhové ukazatele pro trysku a podložku |
| Průběh | Procentuální ukazatel a odhad času |
| Telemetrie | Ventilátory, tlak, rychlost |
| 3D model | Interaktivní zobrazení modelu |
| Sparklines | Mini teplotní grafy |

:::tip Ukládání
Rozvržení se ukládá pro každého uživatele v prohlížeči (localStorage). Různí uživatelé mohou mít různá rozvržení.
:::
