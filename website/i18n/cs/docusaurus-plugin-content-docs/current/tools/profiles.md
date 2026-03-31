---
sidebar_position: 3
title: Tiskové profily
description: Vytvářejte, upravujte a spravujte tiskové profily s přednastavenými nastaveními pro rychlý a konzistentní tisk
---

# Tiskové profily

Tiskové profily jsou uložené sady nastavení tisku, které lze opakovaně používat napříč tisky a tiskárnami. Ušetřete čas a zajistěte konzistentní kvalitu definováním profilů pro různé účely.

Přejděte na: **https://localhost:3443/#profiles**

## Vytvoření profilu

1. Přejděte na **Nástroje → Tiskové profily**
2. Klikněte na **Nový profil** (ikona +)
3. Vyplňte:
   - **Název profilu** — popisný název, např. „PLA - Rychlá výroba"
   - **Materiál** — vyberte ze seznamu (PLA / PETG / ABS / PA / PC / TPU atd.)
   - **Model tiskárny** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Všechny
   - **Popis** — volitelný text

4. Vyplňte nastavení (viz sekce níže)
5. Klikněte na **Uložit profil**

## Nastavení v profilu

### Teplota
| Pole | Příklad |
|---|---|
| Teplota trysky | 220 °C |
| Teplota podložky | 60 °C |
| Teplota komory (X1C) | 35 °C |

### Rychlost
| Pole | Příklad |
|---|---|
| Nastavení rychlosti | Standardní |
| Maximální rychlost (mm/s) | 200 |
| Zrychlení | 5000 mm/s² |

### Kvalita
| Pole | Příklad |
|---|---|
| Tloušťka vrstvy | 0,2 mm |
| Procento výplně | 15 % |
| Vzor výplně | Grid |
| Podpůrný materiál | Auto |

### AMS a barvy
| Pole | Popis |
|---|---|
| Objem proplachování | Množství proplachování při změně barvy |
| Preferované pozice | Které pozice AMS jsou preferovány |

### Pokročilé
| Pole | Popis |
|---|---|
| Režim sušení | Aktivovat sušení AMS pro vlhké materiály |
| Čas chlazení | Pauza mezi vrstvami pro chlazení |
| Rychlost ventilátoru | Rychlost chladicího ventilátoru v procentech |

## Úprava profilu

1. Klikněte na profil v seznamu
2. Klikněte na **Upravit** (ikona tužky)
3. Proveďte změny
4. Klikněte na **Uložit** (přepsat) nebo **Uložit jako nový** (vytvoří kopii)

:::tip Verzování
Použijte „Uložit jako nový" pro zachování funkčního profilu při experimentování se změnami.
:::

## Použití profilu

### Z knihovny souborů

1. Vyberte soubor v knihovně
2. Klikněte na **Odeslat na tiskárnu**
3. Vyberte **Profil** z rozbalovacího seznamu
4. Použijí se nastavení z profilu

### Z tiskové fronty

1. Vytvořte novou úlohu fronty
2. Vyberte **Profil** v části nastavení
3. Profil se propojí s úlohou fronty

## Import a export profilů

### Export
1. Vyberte jeden nebo více profilů
2. Klikněte na **Exportovat**
3. Vyberte formát: **JSON** (pro import v jiných dashboardech) nebo **PDF** (pro tisk/dokumentaci)

### Import
1. Klikněte na **Importovat profily**
2. Vyberte soubor `.json` exportovaný z jiného 3DPrintForge
3. Existující profily se stejným názvem lze přepsat nebo ponechat oba

## Sdílení profilů

Sdílejte profily s ostatními přes komunitní modul filamentů (viz [Komunitní filamenty](../integrations/community)) nebo přes přímý JSON export.

## Výchozí profil

Nastavte výchozí profil pro každý materiál:

1. Vyberte profil
2. Klikněte na **Nastavit jako výchozí pro [materiál]**
3. Výchozí profil se automaticky vybere při odesílání souboru s daným materiálem
