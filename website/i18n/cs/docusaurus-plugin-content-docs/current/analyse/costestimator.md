---
sidebar_position: 4
title: Kalkulačka nákladů
description: Nahrajte soubor 3MF nebo GCode a před tiskem vypočítejte celkové náklady na filament, elektřinu a opotřebení stroje
---

# Kalkulačka nákladů

Kalkulačka nákladů vám umožňuje odhadnout celkové náklady tisku před odesláním na tiskárnu — na základě spotřeby filamentu, ceny elektřiny a opotřebení stroje.

Přejděte na: **https://localhost:3443/#cost-estimator**

## Nahrání souboru

1. Přejděte na **Kalkulačku nákladů**
2. Přetáhněte soubor do pole pro nahrávání nebo klikněte na **Vybrat soubor**
3. Podporované formáty: `.3mf`, `.gcode`, `.bgcode`
4. Klikněte na **Analyzovat**

:::info Analýza
Systém analyzuje G-kód pro extrakci spotřeby filamentu, odhadovaného času tisku a profilu materiálu. Obvykle to trvá 2–10 sekund.
:::

## Výpočet filamentu

Po analýze se zobrazí:

| Pole | Hodnota (příklad) |
|---|---|
| Odhadovaný filament | 47,3 g |
| Materiál (ze souboru) | PLA |
| Cena za gram | 0,025 Kč (ze skladu filamentů) |
| **Náklady na filament** | **1,18 Kč** |

Přepnutím materiálu v rozevíracím seznamu porovnáte náklady s různými typy filamentů nebo dodavateli.

:::tip Přepis materiálu
Pokud G-kód neobsahuje informace o materiálu, vyberte materiál ručně ze seznamu. Cena se automaticky načte ze skladu filamentů.
:::

## Výpočet elektřiny

Náklady na elektřinu se vypočítají na základě:

- **Odhadovaného času tisku** — z analýzy G-kódu
- **Příkonu tiskárny** — nakonfigurovaného pro každý model tiskárny (W)
- **Ceny elektřiny** — pevná cena (Kč/kWh) nebo živá z Tibber/Nordpool

| Pole | Hodnota (příklad) |
|---|---|
| Odhadovaný čas tisku | 3 hodiny 22 min |
| Příkon tiskárny | 350 W (X1C) |
| Odhadovaná spotřeba | 1,17 kWh |
| Cena elektřiny | 1,85 Kč/kWh |
| **Náklady na elektřinu** | **2,16 Kč** |

Aktivujte integraci Tibber nebo Nordpool pro použití plánovaných hodinových cen na základě požadovaného času spuštění.

## Opotřebení stroje

Náklady na opotřebení se odhadují na základě:

- Čas tisku × hodinové náklady na model tiskárny
- Dodatečné opotřebení pro abrazivní materiál (CF, GF atd.)

| Pole | Hodnota (příklad) |
|---|---|
| Čas tisku | 3 hodiny 22 min |
| Hodinové náklady (opotřebení) | 0,80 Kč/hod |
| **Náklady na opotřebení** | **2,69 Kč** |

Hodinové náklady se vypočítají z cen komponentů a očekávané životnosti (viz [Predikce opotřebení](../overvaaking/wearprediction)).

## Celková suma

| Nákladová položka | Částka |
|---|---|
| Filament | 1,18 Kč |
| Elektřina | 2,16 Kč |
| Opotřebení stroje | 2,69 Kč |
| **Celkem** | **6,03 Kč** |
| + Přirážka (30 %) | 1,81 Kč |
| **Prodejní cena** | **7,84 Kč** |

Upravte přirážku v procentuálním poli pro výpočet doporučené prodejní ceny zákazníkovi.

## Uložení odhadu

Kliknutím na **Uložit odhad** propojíte analýzu s projektem:

1. Vyberte existující projekt nebo vytvořte nový
2. Odhad se uloží a může sloužit jako základ pro fakturu
3. Skutečné náklady (po tisku) se automaticky porovnají s odhadem

## Dávkový výpočet

Nahrajte více souborů najednou pro výpočet celkových nákladů kompletní sady:

1. Klikněte na **Dávkový režim**
2. Nahrajte všechny soubory `.3mf`/`.gcode`
3. Systém vypočítá individuální i souhrnné náklady
4. Exportujte souhrn jako PDF nebo CSV
