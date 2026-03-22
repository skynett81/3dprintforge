---
sidebar_position: 5
title: Řešení problémů s neúspěšným tiskem
description: Diagnostikujte a řešte běžné tiskové chyby pomocí protokolů chyb a nástrojů Bambu Dashboard
---

# Řešení problémů s neúspěšným tiskem

Něco se pokazilo? Nepanikujte — většina tiskových chyb má jednoduché řešení. Bambu Dashboard vám pomůže rychle najít příčinu.

## Krok 1 — Zkontrolujte chybové kódy HMS

HMS (Handling, Monitoring, Sensing) je systém chyb Bambu Labs. Všechny chyby se automaticky zaznamenávají v panelu.

1. Přejděte do **Monitorování → Chyby**
2. Najděte neúspěšný tisk
3. Klikněte na chybový kód pro podrobný popis a navrhované řešení

Běžné kódy HMS:

| Kód | Popis | Rychlé řešení |
|-----|-------|---------------|
| 0700 1xxx | Chyba AMS (zaseknutí, problém s motorem) | Zkontrolujte cestu filamentu v AMS |
| 0300 0xxx | Chyba extruze (pod/nadextruze) | Vyčistěte trysku, zkontrolujte filament |
| 0500 xxxx | Chyba kalibrace | Proveďte rekalibraci |
| 1200 xxxx | Odchylka teploty | Zkontrolujte kabelová připojení |
| 0C00 xxxx | Chyba kamery | Restartujte tiskárnu |

:::tip Kódy chyb v historii
V části **Historie → [Tisk] → Protokol HMS** vidíte všechny chybové kódy, které nastaly během tisku — i když tisk "dokončil".
:::

## Běžné chyby a řešení

### Špatná přilnavost (první vrstva nepřilne)

**Příznaky:** Výtisk se odlepuje od desky, kroutí se, první vrstva chybí

**Příčiny a řešení:**

| Příčina | Řešení |
|---------|--------|
| Špinavá deska | Otřete IPA alkoholem |
| Nesprávná teplota desky | Zvyšte o 5°C |
| Nesprávný Z-offset | Znovu spusťte Auto Bed Leveling |
| Chybí lepidlo (PETG/ABS) | Naneste tenkou vrstvu lepidla |
| Příliš rychlá první vrstva | Snižte na 20–30 mm/s pro první vrstvu |

**Rychlý kontrolní seznam:**
1. Je deska čistá? (IPA + papírový ubrousek bez chlupů)
2. Používáte správnou desku pro typ filamentu? (viz [Výběr správné desky](./velge-rett-plate))
3. Byla provedena Z kalibrace po poslední výměně desky?

---

### Warping (rohy se zdvihají)

**Příznaky:** Rohy se prohýbají od desky, zejména u velkých plochých modelů

**Příčiny a řešení:**

| Příčina | Řešení |
|---------|--------|
| Rozdíl teplot | Zavřete přední dvířka tiskárny |
| Chybí brim | Aktivujte brim v Bambu Studiu (3–5 mm) |
| Deska příliš studená | Zvyšte teplotu desky o 5–10°C |
| Filament s vysokým smrštěním (ABS) | Použijte Engineering Plate + komora >40°C |

**ABS a ASA jsou obzvláště náchylné.** Vždy zajistěte:
- Přední dvířka zavřená
- Co nejmenší větrání
- Engineering Plate + lepidlo
- Teplota komory 40°C+

---

### Stringing (vlákna mezi díly)

**Příznaky:** Tenká plastová vlákna mezi oddělenými částmi modelu

**Příčiny a řešení:**

| Příčina | Řešení |
|---------|--------|
| Vlhký filament | Sušte filament 6–8 hodin (60–70°C) |
| Teplota trysky příliš vysoká | Snižte o 5°C |
| Nedostatečná retrakce | Zvyšte délku retrakce v Bambu Studiu |
| Příliš nízká rychlost přesunu | Zvyšte rychlost přesunu na 200+ mm/s |

**Test vlhkosti:** Poslouchejte praskání nebo sledujte bublinky v extruzi — to naznačuje vlhký filament. Bambu AMS má vestavěné měření vlhkosti; zkontrolujte vlhkost v **Stav AMS**.

:::tip Sušička filamentu
Investujte do sušičky filamentu (např. Bambu Filament Dryer), pokud pracujete s nylonem nebo TPU — ty absorbují vlhkost za méně než 12 hodin.
:::

---

### Spaghetti (tisk se zhroutí do hromady)

**Příznaky:** Filament visí ve volných vláknech ve vzduchu, tisk je nerozpoznatelný

**Příčiny a řešení:**

| Příčina | Řešení |
|---------|--------|
| Raná špatná přilnavost → odtržení → zhroucení | Viz sekce o přilnavosti výše |
| Příliš vysoká rychlost | Snižte rychlost o 20–30% |
| Nesprávná konfigurace podpor | Aktivujte podpory v Bambu Studiu |
| Přesah příliš strmý | Rozdělte model nebo otočte o 45° |

**Použijte Print Guard pro automatické zastavení spaghetti** — viz následující sekce.

---

### Podextruze (tenké, slabé vrstvy)

**Příznaky:** Vrstvy nejsou pevné, díry ve stěnách, slabý model

**Příčiny a řešení:**

| Příčina | Řešení |
|---------|--------|
| Částečně ucpaná tryska | Proveďte Cold Pull (viz údržba) |
| Filament příliš vlhký | Sušte filament |
| Příliš nízká teplota | Zvyšte teplotu trysky o 5–10°C |
| Příliš vysoká rychlost | Snižte o 20–30% |
| Poškozená trubice PTFE | Zkontrolujte a vyměňte trubici PTFE |

## Použití Print Guard pro automatickou ochranu

Print Guard sleduje snímky kamery pomocí rozpoznávání obrazu a automaticky zastaví tisk při zjištění spaghetti.

**Aktivace Print Guard:**
1. Přejděte do **Monitorování → Print Guard**
2. Aktivujte **Automatické zjišťování**
3. Zvolte akci: **Pozastavit** (doporučeno) nebo **Zrušit**
4. Nastavte citlivost (začněte s **Střední**)

**Když Print Guard zasáhne:**
1. Obdržíte upozornění se snímkem kamery ukazujícím, co bylo zjištěno
2. Tisk se pozastaví
3. Můžete zvolit: **Pokračovat** (pokud falešně pozitivní) nebo **Zrušit tisk**

:::info Falešně pozitivní výsledky
Print Guard může někdy reagovat na modely s mnoha tenkými sloupky. Snižte citlivost nebo dočasně deaktivujte pro složité modely.
:::

## Diagnostické nástroje v panelu

### Protokol teplot
V části **Historie → [Tisk] → Teploty** vidíte teplotní křivku po celou dobu tisku. Hledejte:
- Náhlé poklesy teploty (problém trysky nebo desky)
- Nepravidelné teploty (potřeba kalibrace)

### Statistiky filamentů
Zkontrolujte, zda spotřebovaný filament odpovídá odhadu. Velká odchylka může naznačovat podextruzi nebo přerušení filamentu.

## Kdy kontaktovat podporu?

Kontaktujte podporu Bambu Labs, pokud:
- Kód HMS se opakuje po provedení všech navrhovaných řešení
- Vidíte mechanické poškození tiskárny (ohnuté tyče, zlomené ozubení)
- Hodnoty teplot jsou nemožné (např. tryska ukazuje -40°C)
- Aktualizace firmwaru problém nevyřeší

**Užitečné mít připravené pro podporu:**
- Chybové kódy HMS z protokolu chyb panelu
- Snímek kamery chyby
- Jaký filament a nastavení byly použity (lze exportovat z historie)
- Model tiskárny a verze firmwaru (zobrazena v **Nastavení → Tiskárna → Informace**)
