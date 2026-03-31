---
sidebar_position: 4
title: Téma
description: Přizpůsobte vzhled 3DPrintForge světlým/tmavým/automatickým režimem, 6 barevnými paletami a vlastní akcentovou barvou
---

# Téma

3DPrintForge má flexibilní systém témat, který umožňuje přizpůsobit vzhled podle vašeho vkusu a situace použití.

Přejděte na: **https://localhost:3443/#settings** → **Téma**

## Barevný režim

Vyberte z tří režimů:

| Režim | Popis |
|---|---|
| **Světlý** | Světlé pozadí, tmavý text — vhodný v dobře osvětlených místnostech |
| **Tmavý** | Tmavé pozadí, světlý text — výchozí a doporučený pro monitorování |
| **Automatický** | Sleduje nastavení operačního systému (tmavý/světlý OS) |

Změňte režim v horní části nastavení tématu nebo pomocí klávesové zkratky v navigační liště (ikona měsíce/slunce).

## Barevné palety

K dispozici je šest přednastavených barevných palet:

| Paleta | Primární barva | Styl |
|---|---|---|
| **Bambu** | Zelená (#00C853) | Výchozí, inspirovaná Bambu Lab |
| **Modrá noc** | Modrá (#2196F3) | Klidná a profesionální |
| **Západ slunce** | Oranžová (#FF6D00) | Teplá a energická |
| **Fialová** | Fialová (#9C27B0) | Kreativní a výrazná |
| **Červená** | Červená (#F44336) | Vysoký kontrast, nápadná |
| **Monochromatická** | Šedá (#607D8B) | Neutrální a minimalistická |

Kliknutím na paletu ji okamžitě zobrazte a aktivujte.

## Vlastní akcentová barva

Použijte zcela vlastní barvu jako akcentovou:

1. Klikněte na **Vlastní barva** pod výběrem palet
2. Použijte výběr barvy nebo zadejte hex kód (např. `#FF5722`)
3. Náhled se aktualizuje v reálném čase
4. Klikněte na **Použít** pro aktivaci

:::tip Kontrast
Ujistěte se, že akcentová barva má dobrý kontrast s pozadím. Systém upozorní, pokud barva může způsobovat problémy se čitelností (standard WCAG AA).
:::

## Zaoblení

Upravte zaoblení tlačítek, karet a prvků:

| Nastavení | Popis |
|---|---|
| **Ostré** | Žádné zaoblení (obdélníkový styl) |
| **Malé** | Jemné zaoblení (4 px) |
| **Střední** | Standardní zaoblení (8 px) |
| **Velké** | Výrazné zaoblení (16 px) |
| **Pill** | Maximální zaoblení (50 px) |

Přetáhněte posuvník pro ruční nastavení v rozsahu 0–50 px.

## Kompaktnost

Přizpůsobte hustotu rozhraní:

| Nastavení | Popis |
|---|---|
| **Prostorné** | Více místa mezi prvky |
| **Standardní** | Vyvážené, výchozí nastavení |
| **Kompaktní** | Hustší uspořádání — více informací na obrazovce |

Kompaktní režim je doporučen pro obrazovky pod 1080p nebo kiosk zobrazení.

## Typografie

Vyberte písmo:

- **Systémové** — používá výchozí písmo operačního systému (rychlé načítání)
- **Inter** — čisté a moderní (výchozí volba)
- **JetBrains Mono** — monospace, vhodné pro datové hodnoty
- **Nunito** — měkčí a zaoblenější styl

## Animace

Vypněte nebo přizpůsobte animace:

- **Plné** — všechny přechody a animace aktivní (výchozí)
- **Redukované** — pouze nezbytné animace (respektuje preferenci OS)
- **Vypnuto** — žádné animace pro maximální výkon

:::tip Kiosk režim
Pro kiosk zobrazení aktivujte **Kompaktní** + **Tmavý** + **Redukované animace** pro optimální výkon a čitelnost z dálky. Viz [Kiosk režim](./kiosk).
:::

## Export a import nastavení tématu

Sdílejte své téma s ostatními:

1. Klikněte na **Exportovat téma** — stáhne soubor `.json`
2. Sdílejte soubor s ostatními uživateli 3DPrintForge
3. Ti importují přes **Importovat téma** → vyberte soubor
