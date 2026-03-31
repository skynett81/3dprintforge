---
sidebar_position: 2
title: Nastavení skladu filamentů
description: Jak vytvářet, konfigurovat a sledovat cívky filamentů v 3DPrintForge
---

# Nastavení skladu filamentů

Sklad filamentů v 3DPrintForge vám poskytuje úplný přehled o všech vašich cívkách — co zbývá, co jste spotřebovali a které cívky jsou právě v AMS.

## Automatické vytváření z AMS

Při připojení tiskárny s AMS panel automaticky načítá informace z RFID čipů na cívkách Bambu:

- Typ filamentu (PLA, PETG, ABS, TPU atd.)
- Barva (s hex kódem)
- Značka (Bambu Lab)
- Hmotnost cívky a zbývající množství

**Tyto cívky jsou ve skladu vytvořeny automaticky** — nemusíte nic dělat. Zobrazte je v části **Filament → Sklad**.

:::info Pouze cívky Bambu mají RFID
Cívky třetích stran (např. eSUN, Polymaker, náhradní náplně Bambu bez čipu) nejsou rozpoznány automaticky. Ty je třeba přidat ručně.
:::

## Ruční přidávání cívek

Pro cívky bez RFID nebo cívky, které nejsou v AMS:

1. Přejděte do **Filament → Sklad**
2. Klikněte na **+ Nová cívka** vpravo nahoře
3. Vyplňte pole:

| Pole | Příklad | Povinné |
|------|---------|---------|
| Značka | eSUN, Polymaker, Bambu | Ano |
| Typ | PLA, PETG, ABS, TPU | Ano |
| Barva | #FF5500 nebo vyberte z barevného kola | Ano |
| Počáteční hmotnost | 1000 g | Doporučeno |
| Zbývající | 850 g | Doporučeno |
| Průměr | 1,75 mm | Ano |
| Poznámka | "Koupeno 2025-01, funguje dobře" | Volitelné |

4. Klikněte na **Uložit**

## Konfigurace barev a značek

Cívku můžete kdykoli upravit kliknutím na ni v přehledu skladu:

- **Barva** — Vyberte z barevného kola nebo zadejte hex hodnotu. Barva se používá jako vizuální značka v přehledu AMS
- **Značka** — Zobrazuje se ve statistikách a filtrování. Vytvořte vlastní značky v **Filament → Značky**
- **Teplotní profil** — Zadejte doporučenou teplotu trysky a desky od výrobce filamentu. Panel pak může varovat, pokud zvolíte nesprávnou teplotu

## Pochopení synchronizace AMS

Panel synchronizuje stav AMS v reálném čase:

```
Slot AMS 1 → Cívka: Bambu PLA Bílá   [███████░░░] 72% zbývá
Slot AMS 2 → Cívka: eSUN PETG Šedá   [████░░░░░░] 41% zbývá
Slot AMS 3 → (prázdný)
Slot AMS 4 → Cívka: Bambu PLA Červená [██████████] 98% zbývá
```

Synchronizace se aktualizuje:
- **Během tisku** — spotřeba se odečítá v reálném čase
- **Na konci tisku** — konečná spotřeba se zaznamenává do historie
- **Ručně** — kliknutím na ikonu synchronizace na cívce načtete aktualizovaná data z AMS

:::tip Oprava odhadu AMS
Odhad AMS z RFID není vždy 100% přesný po prvním použití. Zvažte cívku a ručně aktualizujte hmotnost pro nejlepší přesnost.
:::

## Kontrola spotřeby a zbytku

### Na cívku
Kliknutím na cívku ve skladu zobrazíte:
- Celkové spotřebované množství (gramy, všechny tisky)
- Odhadované zbývající množství
- Seznam všech tisků, při nichž byla tato cívka použita

### Souhrnné statistiky
V části **Analýza → Analýza filamentů** vidíte:
- Spotřebu podle typu filamentu v průběhu času
- Které značky používáte nejvíce
- Odhadované náklady na základě nákupní ceny za kg

### Upozornění na nízkou hladinu
Nastavte upozornění, když se cívka blíží konci:

1. Přejděte do **Filament → Nastavení**
2. Aktivujte **Upozornit na nízký stav skladu**
3. Nastavte práh (např. 100 g zbývá)
4. Zvolte kanál upozornění (Telegram, Discord, e-mail)

## Tip: Vážte cívky pro přesnost

Odhady z AMS a tiskové statistiky nejsou nikdy zcela přesné. Nejpřesnější metodou je zvážit samotnou cívku:

**Jak to udělat:**

1. Zjistěte tárovou hmotnost (prázdná cívka) — obvykle 200–250 g, zkontrolujte web výrobce nebo spodní část cívky
2. Zvažte cívku s filamentem na kuchyňské váze
3. Odečtěte tárovou hmotnost
4. Aktualizujte **Zbývající** v profilu cívky

**Příklad:**
```
Zvážená hmotnost:  743 g
Tára (prázdná):  - 230 g
Zbývající filament: 513 g
```

:::tip Generátor štítků cívek
V části **Nástroje → Štítky** můžete tisknout štítky s QR kódem pro své cívky. Naskenujte kód telefonem pro rychlé otevření profilu cívky.
:::
