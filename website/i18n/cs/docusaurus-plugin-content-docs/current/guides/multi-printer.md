---
sidebar_position: 6
title: Více tiskáren
description: Nastavení a správa více tiskáren Bambu v Bambu Dashboard — přehled parku, fronta a postupné spouštění
---

# Více tiskáren

Máte více než jednu tiskárnu? Bambu Dashboard je navržen pro správu parku tiskáren — můžete monitorovat, řídit a koordinovat všechny tiskárny z jednoho místa.

## Přidání nové tiskárny

1. Přejděte do **Nastavení → Tiskárny**
2. Klikněte na **+ Přidat tiskárnu**
3. Vyplňte:

| Pole | Příklad | Vysvětlení |
|------|---------|-----------|
| Sériové číslo (SN) | 01P... | Najdete v Bambu Handy nebo na obrazovce tiskárny |
| IP adresa | 192.168.1.101 | Pro LAN režim (doporučeno) |
| Přístupový kód | 12345678 | 8místný kód na obrazovce tiskárny |
| Název | "Bambu #2 - P1S" | Zobrazuje se v panelu |
| Model | P1P, P1S, X1C, A1 | Zvolte správný model pro správné ikony a funkce |

4. Klikněte na **Otestovat připojení** — měli byste vidět zelený stav
5. Klikněte na **Uložit**

:::tip Pojmenujte tiskárny popisně
"Bambu 1" a "Bambu 2" jsou matoucí. Používejte názvy jako "X1C - Výroba" a "P1S - Prototypy" pro zachování přehledu.
:::

## Přehled parku

Po přidání všech tiskáren se zobrazují společně v panelu **Park**. Vidíte zde:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Výroba    │  │ P1S - Prototypy │  │ A1 - Hobby room │
│ ████████░░ 82%  │  │ Nečinná         │  │ ████░░░░░░ 38%  │
│ 1h 24m zbývá    │  │ Připravena k    │  │ 3h 12m zbývá    │
│ Temp: 220/60°C  │  │ tisku           │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Můžete:
- Kliknout na tiskárnu pro úplné podrobné zobrazení
- Vidět všechny teploty, stav AMS a aktivní chyby najednou
- Filtrovat podle stavu (aktivní tisky, nečinné, chyby)

## Tisková fronta — rozdělení práce

Tisková fronta umožňuje plánovat tisky pro všechny tiskárny z jednoho místa.

**Jak to funguje:**
1. Přejděte do **Fronta**
2. Klikněte na **+ Přidat úlohu**
3. Zvolte soubor a nastavení
4. Zvolte tiskárnu nebo vyberte **Automatické přiřazení**

### Automatické přiřazení
Při automatickém přiřazení panel vybere tiskárnu na základě:
- Dostupné kapacity
- Filamentu dostupného v AMS
- Naplánovaných oken údržby

Aktivujte v **Nastavení → Fronta → Automatické přiřazení**.

### Prioritizace
Přetažením úloh ve frontě změníte pořadí. Úloha s **Vysokou prioritou** předbíhá běžné úlohy.

## Postupné spouštění — předcházení výkonnostním špičkám

Pokud spustíte mnoho tiskáren najednou, fáze zahřívání může způsobit velkou výkonnostní špičku. Postupné spouštění rozloží spuštění:

**Jak aktivovat:**
1. Přejděte do **Nastavení → Park → Postupné spouštění**
2. Aktivujte **Rozložené spouštění**
3. Nastavte zpoždění mezi tiskárnami (doporučeno: 2–5 minut)

**Příklad se 3 tiskárnami a 3minutovým zpožděním:**
```
08:00 — Tiskárna 1 zahajuje zahřívání
08:03 — Tiskárna 2 zahajuje zahřívání
08:06 — Tiskárna 3 zahajuje zahřívání
```

:::tip Důležité pro velikost jističe
X1C spotřebovává při zahřívání přibližně 1000 W. Tři tiskárny najednou = 3000 W, což může vyhodit 16A jistič. Postupné spouštění eliminuje problém.
:::

## Skupiny tiskáren

Skupiny tiskáren umožňují logicky organizovat tiskárny a odesílat příkazy celé skupině:

**Vytvoření skupiny:**
1. Přejděte do **Nastavení → Skupiny tiskáren**
2. Klikněte na **+ Nová skupina**
3. Pojmenujte skupinu (např. "Výrobní hala", "Hobby room")
4. Přidejte tiskárny do skupiny

**Funkce skupiny:**
- Zobrazení souhrnných statistik skupiny
- Odeslání příkazu pozastavení celé skupině najednou
- Nastavení okna údržby pro skupinu

## Monitorování všech tiskáren

### Zobrazení více kamer
Přejděte do **Park → Zobrazení kamer** pro zobrazení všech přenosů kamer vedle sebe:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [Live]      │  │  [Nečinná]   │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Přidat    │
│  [Live]      │  │              │
└──────────────┘  └──────────────┘
```

### Upozornění pro každou tiskárnu
Pro různé tiskárny můžete nakonfigurovat různá pravidla upozornění:
- Výrobní tiskárna: vždy upozorňovat, včetně noci
- Hobby tiskárna: upozorňovat pouze přes den

Viz [Upozornění](./notification-setup) pro nastavení.

## Tipy pro správu parku

- **Standardizujte sloty filamentů**: Udržujte PLA bílý ve slotu 1, PLA černý ve slotu 2 na všech tiskárnách — pak je rozdělení práce snazší
- **Denně kontrolujte hladiny AMS**: Viz [Každodenní použití](./daily-use) pro ranní rutinu
- **Střídavá údržba**: Neprovádějte údržbu všech tiskáren najednou — vždy mějte alespoň jednu aktivní
- **Jasně pojmenujte soubory**: Názvy souborů jako `logo_x1c_pla_0.2mm.3mf` usnadňují výběr správné tiskárny
