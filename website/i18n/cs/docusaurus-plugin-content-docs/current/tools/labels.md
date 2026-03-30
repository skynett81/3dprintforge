---
sidebar_position: 1
title: Štítky
description: Generujte QR kódy, štítky cívek pro termální tiskárny (ZPL), barevné karty a sdílené barevné palety pro sklad filamentů
---

# Štítky

Nástroj pro štítky generuje profesionální štítky pro vaše cívky filamentů — QR kódy, štítky cívek pro termální tiskárny a barevné karty pro vizuální identifikaci.

Přejděte na: **https://localhost:3443/#labels**

## QR kódy

Generujte QR kódy odkazující na informace o filamentu v dashboardu:

1. Přejděte na **Štítky → QR kódy**
2. Vyberte cívku, pro kterou chcete vygenerovat QR kód
3. QR kód se automaticky vygeneruje a zobrazí v náhledu
4. Klikněte na **Stáhnout PNG** nebo **Vytisknout**

QR kód obsahuje URL na profil filamentu v dashboardu. Naskenujte mobilem pro rychlé zobrazení informací o cívce.

### Hromadné generování

1. Klikněte na **Vybrat vše** nebo zaškrtněte jednotlivé cívky
2. Klikněte na **Vygenerovat všechny QR kódy**
3. Stáhněte jako ZIP s jedním PNG na cívku nebo vytiskněte vše najednou

## Štítky cívek

Profesionální štítky pro termální tiskárny s úplnými informacemi o cívce:

### Obsah štítku (standardní)

- Barva cívky (vyplněný blok barvy)
- Název materiálu (velké písmo)
- Výrobce
- Hex kód barvy
- Doporučené teploty (tryska a podložka)
- QR kód
- Čárový kód (volitelně)

### ZPL pro termální tiskárny

Generujte ZPL kód (Zebra Programming Language) pro tiskárny Zebra, Brother a Dymo:

1. Přejděte na **Štítky → Termální tisk**
2. Vyberte velikost štítku: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Vyberte cívku (cívky)
4. Klikněte na **Vygenerovat ZPL**
5. Odešlete ZPL kód na tiskárnu přes:
   - **Tisknout přímo** (USB připojení)
   - **Kopírovat ZPL** a odeslat terminálovým příkazem
   - **Stáhnout soubor .zpl**

:::tip Nastavení tiskárny
Pro automatický tisk nakonfigurujte tiskárnu v části **Nastavení → Štítková tiskárna** s IP adresou a portem (výchozí: 9100 pro RAW TCP).
:::

### PDF štítky

Pro běžné tiskárny generujte PDF se správnými rozměry:

1. Vyberte velikost štítku ze šablony
2. Klikněte na **Vygenerovat PDF**
3. Vytiskněte na samolepicí papír (Avery nebo podobný)

## Barevné karty

Barevné karty jsou kompaktní mřížka zobrazující všechny cívky vizuálně:

1. Přejděte na **Štítky → Barevné karty**
2. Vyberte, které cívky zahrnout (všechny aktivní nebo ručně vyberte)
3. Vyberte formát karty: **A4** (4×8), **A3** (6×10), **Letter**
4. Klikněte na **Vygenerovat PDF**

Každé pole zobrazuje:
- Blok barvy se skutečnou barvou
- Název materiálu a hex barvy
- Číslo materiálu (pro rychlou referenci)

Ideální zalaminovat a pověsit u tiskárny.

## Sdílené barevné palety

Exportujte výběr barev jako sdílenou paletu:

1. Přejděte na **Štítky → Barevné palety**
2. Vyberte cívky k zahrnutí do palety
3. Klikněte na **Sdílet paletu**
4. Zkopírujte odkaz — ostatní mohou paletu importovat do svého dashboardu
5. Paleta se zobrazuje s hex kódy a lze ji exportovat do **Adobe Swatch** (`.ase`) nebo **Procreate** (`.swatches`)
