---
sidebar_position: 11
title: Oceňování produktů — výpočet prodejní ceny
description: Kompletní průvodce oceňováním 3D tisků pro prodej se všemi nákladovými faktory
---

# Oceňování produktů — výpočet prodejní ceny

Tento průvodce vysvětluje, jak používat kalkulačku nákladů k nalezení správné prodejní ceny 3D tisků, které prodáváte.

## Přehled nákladů

Náklady na 3D tisk se skládají z těchto komponent:

| Komponenta | Popis | Příklad |
|-----------|-------------|---------|
| **Filament** | Náklady na materiál na základě hmotnosti a ceny cívky | 100g × 0,25 kr/g = 25 kr |
| **Odpad** | Plýtvání materiálem (čištění, nepovedené tisky, podpěry) | 10% navíc = 2,50 kr |
| **Elektřina** | Spotřeba energie během tisku | 3,5h × 150W × 1,50 kr/kWh = 0,79 kr |
| **Opotřebení** | Tryska + hodnota stroje za dobu životnosti | 3,5h × 0,15 kr/h = 0,53 kr |
| **Práce** | Váš čas na nastavení, následné zpracování, balení | 10 min × 200 kr/h = 33,33 kr |
| **Přirážka** | Zisková marže | 20% = 12,43 kr |

**Celkové výrobní náklady** = součet všech komponent

## Konfigurace nastavení

### Základní nastavení

Přejděte na **Filament → ⚙ Nastavení** a vyplňte:

1. **Cena elektřiny (kr/kWh)** — vaše cena elektřiny. Zkontrolujte účet za elektřinu nebo použijte integraci Nordpool
2. **Výkon tiskárny (W)** — typicky 150W pro tiskárny Bambu Lab
3. **Náklady na stroj (kr)** — kolik jste za tiskárnu zaplatili
4. **Životnost stroje (hodiny)** — očekávaná životnost (3000-8000 hodin)
5. **Náklady na práci (kr/hodina)** — vaše hodinová sazba
6. **Doba přípravy (min)** — průměrný čas na výměnu filamentu, kontrolu podložky, balení
7. **Přirážka (%)** — požadovaná zisková marže
8. **Náklady na trysku (kr/hodina)** — opotřebení trysky (HS01 ≈ 0,05 kr/h)
9. **Faktor odpadu** — plýtvání materiálem (1,1 = 10% navíc, 1,15 = 15%)

:::tip Typické hodnoty pro Bambu Lab
| Nastavení | Hobbyista | Semi-pro | Profesionál |
|---|---|---|---|
| Cena elektřiny | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Výkon tiskárny | 150W | 150W | 150W |
| Náklady na stroj | 5 000 kr | 12 000 kr | 25 000 kr |
| Životnost stroje | 3 000h | 5 000h | 8 000h |
| Náklady na práci | 0 kr/h | 150 kr/h | 250 kr/h |
| Doba přípravy | 5 min | 10 min | 15 min |
| Přirážka | 0% | 30% | 50% |
| Faktor odpadu | 1,05 | 1,10 | 1,15 |
:::

## Výpočet nákladů

1. Přejděte na **Kalkulačku nákladů** (`https://localhost:3443/#costestimator`)
2. **Přetáhněte** soubor `.3mf` nebo `.gcode`
3. Systém automaticky přečte: hmotnost filamentu, odhadovaný čas, barvy
4. **Propojte cívky** — vyberte, které cívky ze skladu se používají
5. Klikněte na **Vypočítat náklady**

### Výsledek zobrazuje:

- **Filament** — náklady na materiál za barvu
- **Odpad/ztráty** — na základě faktoru odpadu
- **Elektřina** — používá živou spotovou cenu z Nordpool, pokud je k dispozici
- **Opotřebení** — tryska + hodnota stroje
- **Práce** — hodinová sazba + doba přípravy
- **Výrobní náklady** — součet všeho výše
- **Přirážka** — vaše zisková marže
- **Celkové náklady** — minimum, které byste měli účtovat
- **Navrhované prodejní ceny** — marže 2×, 2,5×, 3×

## Cenové strategie

### Marže 2× (doporučené minimum)
Pokrývá výrobní náklady + nepředvídané výdaje. Používejte pro přátele/rodinu a jednoduchou geometrii.

### Marže 2,5× (standard)
Dobrá rovnováha mezi cenou a hodnotou. Funguje pro většinu produktů.

### Marže 3× (premium)
Pro složité modely, vícebarevné, vysokou kvalitu nebo specializované trhy.

:::warning Nezapomeňte na skryté náklady
- Nepovedené tisky (5-15% všech tisků selže)
- Filament, který se nespotřebuje (posledních 50g je často problematických)
- Čas strávený zákaznickým servisem
- Balení a doprava
- Údržba tiskárny
:::

## Příklad: Ocenění držáku na telefon

| Parametr | Hodnota |
|-----------|-------|
| Hmotnost filamentu | 45g PLA |
| Doba tisku | 2 hodiny |
| Spotová cena | 1,20 kr/kWh |

**Výpočet:**
- Filament: 45g × 0,25 kr/g = 11,25 kr
- Odpad (10%): 1,13 kr
- Elektřina: 2h × 0,15kW × 1,20 = 0,36 kr
- Opotřebení: 2h × 0,15 = 0,30 kr
- Práce: (2h + 10min) × 200 kr/h = 433 kr (nebo 0 pro hobby)
- **Výrobní náklady (hobby)**: ~13 kr
- **Prodejní cena 2,5×**: ~33 kr

## Uložit odhad

Klikněte na **Uložit odhad** pro archivaci výpočtu. Uložené odhady najdete na kartě **Uložené** v kalkulačce nákladů.

## E-commerce

Pokud používáte [modul e-commerce](../integrations/ecommerce), můžete propojit odhady nákladů přímo s objednávkami pro automatický výpočet cen.
