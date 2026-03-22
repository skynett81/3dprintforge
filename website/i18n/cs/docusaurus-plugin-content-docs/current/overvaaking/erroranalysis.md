---
sidebar_position: 6
title: Analýza vzorů chyb
description: Analýza vzorů chyb na základě AI, korelace mezi chybami a faktory prostředí a konkrétní návrhy zlepšení
---

# Analýza vzorů chyb

Analýza vzorů chyb využívá historická data z tisků a chyb k identifikaci vzorů, příčin a korelací — a poskytuje konkrétní návrhy na zlepšení.

Přejděte na: **https://localhost:3443/#error-analysis**

## Co se analyzuje

Systém analyzuje následující datové body:

- HMS kódy chyb a jejich časování
- Typ filamentu a výrobce při chybě
- Teplota při chybě (tryska, podložka, komora)
- Rychlost tisku a profil
- Čas dne a den v týdnu
- Čas od poslední údržby
- Model tiskárny a verze firmwaru

## Korelační analýza

Systém hledá statistické korelace mezi chybami a faktory:

**Příklady detekovaných korelací:**
- „78 % chyb ucpání AMS nastane s filamentem od výrobce X"
- „Ucpání trysky nastane 3× častěji po 6+ hodinách nepřetržitého tisku"
- „Chyby přilnavosti se zvyšují při teplotě komory pod 18 °C"
- „Chyby stringing korelují s vlhkostí nad 60 % (pokud je připojen hygrometr)"

Korelace se statistickou významností (p < 0,05) se zobrazují nahoře.

:::info Datové požadavky
Analýza je nejpřesnější s minimálně 50 tisky v historii. S méně tisky se zobrazují odhady s nízkou spolehlivostí.
:::

## Návrhy na zlepšení

Na základě analýz jsou generovány konkrétní návrhy:

| Typ návrhu | Příklad |
|---|---|
| Filament | „Přejděte na jiného výrobce PA-CF — 3 ze 4 chyb používaly VýrobceX" |
| Teplota | „Zvyšte teplotu podložky o 5 °C pro PETG — odhadovaná redukce chyb přilnavosti 60 %" |
| Rychlost | „Snižte rychlost na 80 % po 4 hodinách — odhadovaná redukce ucpání trysky 45 %" |
| Údržba | „Vyčistěte ozubené kolo extruderu — opotřebení koreluje s 40 % chyb extruze" |
| Kalibrace | „Spusťte vyrovnání podložky — 12 z 15 chyb přilnavosti minulý týden koreluje se špatnou kalibrací" |

Každý návrh zobrazuje:
- Odhadovaný efekt (%-snížení chyb)
- Spolehlivost (nízká / střední / vysoká)
- Implementaci krok za krokem
- Odkaz na relevantní dokumentaci

## Vliv na skóre zdraví

Analýza je propojena se skóre zdraví (viz [Diagnostika](./diagnostics)):

- Zobrazuje, které faktory nejvíce snižují skóre
- Odhaduje zlepšení skóre při implementaci každého návrhu
- Prioritizuje návrhy podle potenciálního zlepšení skóre

## Zobrazení časové osy

Přejděte na **Analýza chyb → Časová osa** pro zobrazení chronologického přehledu:

1. Vyberte tiskárnu a časové období
2. Chyby se zobrazí jako body na časové ose, barevně kódované podle typu
3. Vodorovné čáry označují úlohy údržby
4. Shluky chyb (mnoho chyb v krátké době) jsou zvýrazněny červeně

Kliknutím na shluk otevřete analýzu konkrétního období.

## Zprávy

Vygenerujte PDF zprávu o analýze chyb:

1. Klikněte na **Vygenerovat zprávu**
2. Vyberte časové období (např. posledních 90 dní)
3. Vyberte obsah: korelace, návrhy, časová osa, skóre zdraví
4. Stáhněte PDF nebo odešlete e-mailem

Zprávy se ukládají v projektech, pokud je tiskárna propojena s projektem.

:::tip Týdenní přehled
Nastavte automatický týdenní e-mailový přehled v části **Nastavení → Zprávy** pro udržení přehledu bez manuální návštěvy dashboardu. Viz [Zprávy](../system/reports).
:::
