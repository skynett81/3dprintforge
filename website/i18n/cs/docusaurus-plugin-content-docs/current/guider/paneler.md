---
sidebar_position: 8
title: Navigace v panelu
description: Naučte se navigovat v Bambu Dashboard — postranní panel, panely, klávesové zkratky a přizpůsobení
---

# Navigace v panelu

Tento průvodce vám poskytne rychlý úvod do organizace panelu a efektivní navigace.

## Postranní panel

Postranní panel vlevo je vaším navigačním centrem. Je organizován do sekcí:

```
┌────────────────────┐
│ 🖨  Stavy tiskáren │  ← Jeden řádek pro každou tiskárnu
├────────────────────┤
│ Přehled            │
│ Park               │
│ Aktivní tisk       │
├────────────────────┤
│ Filament           │
│ Historie           │
│ Projekty           │
│ Fronta             │
│ Plánovač           │
├────────────────────┤
│ Monitorování       │
│  └ Print Guard     │
│  └ Chyby           │
│  └ Diagnostika     │
│  └ Údržba          │
├────────────────────┤
│ Analýza            │
│ Nástroje           │
│ Integrace          │
│ Systém             │
├────────────────────┤
│ ⚙ Nastavení       │
└────────────────────┘
```

**Postranní panel lze skrýt** kliknutím na ikonu hamburgeru (☰) vlevo nahoře. Užitečné na menších obrazovkách nebo v kioskovém režimu.

## Hlavní panel

Při kliknutí na prvek v postranním panelu se obsah zobrazí v hlavním panelu vpravo. Rozložení se liší:

| Panel | Rozložení |
|-------|----------|
| Přehled | Mřížka karet se všemi tiskárnami |
| Aktivní tisk | Velká karta s podrobnostmi + teplotní křivky |
| Historie | Filtrovatelná tabulka |
| Filament | Zobrazení karet s cívkami |
| Analýza | Grafy a diagramy |

## Kliknutí na stav tiskárny pro podrobnosti

Karta tiskárny na přehledovém panelu je klikatelná:

**Jedno kliknutí** → Otevře panel s podrobnostmi pro danou tiskárnu:
- Teploty v reálném čase
- Aktivní tisk (pokud probíhá)
- Stav AMS se všemi sloty
- Poslední chyby a události
- Rychlá tlačítka: Pozastavit, Zastavit, Světlo zap/vyp

**Kliknutí na ikonu kamery** → Otevře živý náhled kamery

**Kliknutí na ikonu ⚙** → Nastavení tiskárny

## Klávesová zkratka — paleta příkazů

Paleta příkazů poskytuje rychlý přístup ke všem funkcím bez navigace:

| Zkratka | Akce |
|---------|------|
| `Ctrl + K` (Linux/Windows) | Otevřít paletu příkazů |
| `Cmd + K` (macOS) | Otevřít paletu příkazů |
| `Esc` | Zavřít paletu |

V paletě příkazů můžete:
- Vyhledávat stránky a funkce
- Přímo spustit tisk
- Pozastavit / obnovit aktivní tisky
- Přepnout téma (světlé/tmavé)
- Přejít na libovolnou stránku

**Příklad:** Stiskněte `Ctrl+K`, napište "pozastavit" → vyberte "Pozastavit všechny aktivní tisky"

## Přizpůsobení widgetů

Přehledový panel lze přizpůsobit vybranými widgety:

**Jak upravit panel:**
1. Klikněte na **Upravit rozložení** (ikona tužky) vpravo nahoře na přehledovém panelu
2. Přetáhněte widgety na požadovanou pozici
3. Klikněte a táhněte za roh widgetu pro změnu velikosti
4. Klikněte na **+ Přidat widget** pro přidání nových:

Dostupné widgety:

| Widget | Zobrazuje |
|--------|----------|
| Stav tiskáren | Karty pro všechny tiskárny |
| Aktivní tisk (velký) | Podrobné zobrazení probíhajícího tisku |
| Přehled AMS | Všechny sloty a hladiny filamentů |
| Teplotní křivka | Graf v reálném čase |
| Cena elektřiny | Cenový graf na příštích 24 hodin |
| Metr filamentu | Celková spotřeba za posledních 30 dnů |
| Odkaz na historii | Posledních 5 tisků |
| Přenos kamery | Živý obraz kamery |

5. Klikněte na **Uložit rozložení**

:::tip Uložte více rozložení
Můžete mít různá rozložení pro různé účely — kompaktní pro každodenní použití, velké pro zobrazení na velké obrazovce. Přepínejte mezi nimi pomocí výběru rozložení.
:::

## Téma — přepínání mezi světlým a tmavým

**Rychlé přepnutí:**
- Klikněte na ikonu slunce/měsíce vpravo nahoře v navigaci
- Nebo: `Ctrl+K` → napište "téma"

**Trvalé nastavení:**
1. Přejděte do **Systém → Témata**
2. Vyberte mezi:
   - **Světlé** — bílé pozadí
   - **Tmavé** — tmavé pozadí (doporučeno v noci)
   - **Automatické** — sleduje systémové nastavení vašeho zařízení
3. Zvolte barvu zvýraznění (modrá, zelená, fialová atd.)
4. Klikněte na **Uložit**

## Navigace klávesnicí

Pro efektivní navigaci bez myši:

| Zkratka | Akce |
|---------|------|
| `Tab` | Další interaktivní prvek |
| `Shift+Tab` | Předchozí prvek |
| `Enter` / `Mezerník` | Aktivovat tlačítko/odkaz |
| `Esc` | Zavřít modální okno/rozbalovací nabídku |
| `Ctrl+K` | Paleta příkazů |
| `Alt+1` – `Alt+9` | Přejít přímo na prvních 9 stránek |

## PWA — instalace jako aplikace

Bambu Dashboard lze nainstalovat jako progresivní webovou aplikaci (PWA) a spouštět jako samostatnou aplikaci bez nabídek prohlížeče:

1. Přejděte na panel v Chrome, Edge nebo Safari
2. Klikněte na ikonu **Nainstalovat aplikaci** v adresním řádku
3. Potvrďte instalaci

Viz [Dokumentace PWA](../system/pwa) pro více podrobností.

## Kioskový režim

Kioskový režim skryje veškerou navigaci a zobrazí pouze panel — ideální pro vyhrazené obrazovky v dílně:

1. Přejděte do **Systém → Kiosk**
2. Aktivujte **Kioskový režim**
3. Zvolte, které widgety se mají zobrazovat
4. Nastavte interval obnovení

Viz [Dokumentace kiosku](../system/kiosk) pro úplné nastavení.
