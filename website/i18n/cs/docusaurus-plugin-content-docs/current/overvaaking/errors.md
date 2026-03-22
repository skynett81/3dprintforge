---
sidebar_position: 2
title: Protokol chyb
description: Kompletní přehled HMS kódů chyb z tiskáren se závažností, vyhledáváním a odkazy na Bambu Wiki
---

# Protokol chyb

Protokol chyb shromažďuje všechny chyby a HMS výstrahy (Health, Maintenance, Safety) z vašich tiskáren. Bambu Dashboard má vestavěnou databázi s 269+ HMS kódy pro tiskárny Bambu Lab.

Přejděte na: **https://localhost:3443/#errors**

## HMS kódy

Tiskárny Bambu Lab odesílají HMS kódy přes MQTT při výskytu problémů. Bambu Dashboard je automaticky překládá na čitelné chybové zprávy:

| Kód | Příklad | Kategorie |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Tryska/extruder |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Podložka |
| `0700 0500 0001 0001` | MC disconnect | Elektronika |

Kompletní seznam pokrývá všech 269+ známých kódů pro X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D a H2C.

## Závažnost

Chyby jsou klasifikovány do čtyř úrovní:

| Úroveň | Barva | Popis |
|---|---|---|
| **Kritická** | Červená | Vyžaduje okamžitý zásah — tisk zastaven |
| **Vysoká** | Oranžová | Mělo by být řešeno rychle — tisk může pokračovat |
| **Střední** | Žlutá | Mělo by být prověřeno — žádné okamžité nebezpečí |
| **Info** | Modrá | Informační zpráva, není nutná žádná akce |

## Vyhledávání a filtrování

Použijte panel nástrojů v horní části protokolu chyb:

1. **Fulltextové vyhledávání** — hledejte v chybové zprávě, HMS kódu nebo popisu tiskárny
2. **Tiskárna** — zobrazit chyby pouze z jedné tiskárny
3. **Kategorie** — AMS / Tryska / Podložka / Elektronika / Kalibrace / Ostatní
4. **Závažnost** — Vše / Kritická / Vysoká / Střední / Info
5. **Datum** — filtrovat podle časového rozsahu
6. **Nepotvrzené** — zobrazit pouze nepotvrzené chyby

Klikněte na **Resetovat filtr** pro zobrazení všech chyb.

## Odkazy na Wiki

Pro každý HMS kód se zobrazuje odkaz na Bambu Lab Wiki s:

- Úplným popisem chyby
- Možnými příčinami
- Průvodcem odstraňováním problémů krok za krokem
- Oficiálními doporučeními Bambu Lab

Klikněte na **Otevřít wiki** u záznamu chyby pro otevření příslušné stránky wiki v nové záložce.

:::tip Lokální kopie
Bambu Dashboard ukládá obsah wiki lokálně pro offline použití. Obsah se automaticky aktualizuje týdně.
:::

## Potvrzení chyb

Potvrzení označí chybu jako zpracovanou bez jejího smazání:

1. Klikněte na chybu v seznamu
2. Klikněte na **Potvrdit** (ikona zaškrtnutí)
3. Zadejte volitelnou poznámku o provedené akci
4. Chyba je označena zaškrtnutím a přesunuta do seznamu „Potvrzené"

### Hromadné potvrzení

1. Vyberte více chyb pomocí zaškrtávacích políček
2. Klikněte na **Potvrdit vybrané**
3. Všechny vybrané chyby jsou potvrzeny najednou

## Statistiky

V horní části protokolu chyb se zobrazuje:

- Celkový počet chyb za posledních 30 dní
- Počet nepotvrzených chyb
- Nejčastěji se vyskytující HMS kód
- Tiskárna s největším počtem chyb

## Export

1. Klikněte na **Exportovat** (ikona stažení)
2. Vyberte formát: **CSV** nebo **JSON**
3. Na export se aplikuje filtr — nejprve nastavte požadovaný filtr
4. Soubor se automaticky stáhne

## Upozornění na nové chyby

Aktivujte upozornění pro nové HMS chyby:

1. Přejděte na **Nastavení → Upozornění**
2. Zaškrtněte **Nové HMS chyby**
3. Vyberte minimální závažnost pro upozornění (doporučeno: **Vysoká** a výše)
4. Vyberte kanál upozornění

Viz [Upozornění](../funksjoner/notifications) pro nastavení kanálů.
