---
sidebar_position: 2
title: Sklad filamentů
description: Správa cívek filamentů, synchronizace AMS, sušení a další
---

# Sklad filamentů

Sklad filamentů vám poskytuje úplný přehled o všech cívkách filamentů, integrovaných s AMS a historií tisků.

## Přehled

Sklad zobrazuje všechny registrované cívky s:

- **Barvou** — vizuální barevná karta
- **Materiálem** — PLA, PETG, ABS, TPU, PA atd.
- **Dodavatelem** — Bambu Lab, Polymaker, eSUN atd.
- **Hmotností** — zbývající gramy (odhadované nebo vážené)
- **Slotem AMS** — ve kterém slotu cívka sedí
- **Stavem** — aktivní, prázdná, suší se, uskladněná

## Přidání cívek

1. Klikněte na **+ Nová cívka**
2. Vyplňte materiál, barvu, dodavatele a hmotnost
3. Naskenujte NFC tag, pokud je dostupný, nebo zadejte ručně
4. Uložte

:::tip Cívky Bambu Lab
Oficiální cívky Bambu Lab lze importovat automaticky prostřednictvím integrace Bambu Cloud. Viz [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Synchronizace AMS

Když je dashboard připojen k tiskárně, stav AMS se automaticky synchronizuje:

- Sloty se zobrazují se správnou barvou a materiálem z AMS
- Spotřeba se aktualizuje po každém tisku
- Prázdné cívky se automaticky označí

Pro propojení místní cívky se slotem AMS:
1. Přejděte na **Filament → AMS**
2. Klikněte na slot, který chcete propojit
3. Vyberte cívku ze skladu

## Sušení

Zaregistrujte sušicí cykly pro sledování expozice vlhkosti:

| Pole | Popis |
|------|-------------|
| Datum sušení | Kdy byla cívka vysušena |
| Teplota | Teplota sušení (°C) |
| Trvání | Počet hodin |
| Metoda | Trouba, sušicí box, sušička filamentů |

:::info Doporučené teploty sušení
Viz [Znalostní bázi](../kb/intro) pro dobu sušení a teploty specifické pro daný materiál.
:::

## Barevné karty

Zobrazení barevných karet organizuje cívky vizuálně podle barvy. Užitečné pro rychlé nalezení správné barvy. Filtrujte podle materiálu, dodavatele nebo stavu.

## NFC tagy

Bambu Dashboard podporuje NFC tagy pro rychlou identifikaci cívek:

1. Zapište ID NFC tagu do cívky ve skladu
2. Naskenujte tag mobilem
3. Cívka se přímo otevře v dashboardu

## Import a export

### Export
Exportujte celý sklad jako CSV: **Filament → Export → CSV**

### Import
Importujte cívky z CSV: **Filament → Import → Vybrat soubor**

Formát CSV:
```
nazev,material,barva_hex,dodavatel,hmotnost_g,nfc_id
PLA Bílá,PLA,#FFFFFF,Bambu Lab,1000,
PETG Černá,PETG,#000000,Polymaker,850,ABC123
```

## Statistiky

V části **Filament → Statistiky** najdete:

- Celkovou spotřebu na materiál (za posledních 30/90/365 dní)
- Spotřebu na tiskárnu
- Odhadovanou zbývající životnost na cívku
- Nejpoužívanější barvy a dodavatele
