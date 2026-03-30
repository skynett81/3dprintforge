---
sidebar_position: 7
title: Zprávy
description: Automatické týdenní a měsíční e-mailové zprávy se statistikami, shrnutím aktivit a připomenutími údržby
---

# Zprávy

Bambu Dashboard může odesílat automatické e-mailové zprávy se statistikami a shrnutím aktivit — týdně, měsíčně nebo obojí.

Přejděte na: **https://localhost:3443/#settings** → **Systém → Zprávy**

## Předpoklady

Zprávy vyžadují nakonfigurovaná e-mailová upozornění. Nastavte SMTP v části **Nastavení → Upozornění → E-mail** před aktivací zpráv. Viz [Upozornění](../features/notifications).

## Aktivace automatických zpráv

1. Přejděte na **Nastavení → Zprávy**
2. Aktivujte **Týdenní zpráva** a/nebo **Měsíční zpráva**
3. Vyberte **Čas odeslání**:
   - Týdně: den v týdnu a čas
   - Měsíčně: den v měsíci (např. 1. pondělí / poslední pátek)
4. Vyplňte **E-mail příjemce** (oddělovač čárkou pro více příjemců)
5. Klikněte na **Uložit**

Odešlete testovací zprávu pro zobrazení formátování: klikněte na **Odeslat testovací zprávu nyní**.

## Obsah týdenní zprávy

Týdenní zpráva pokrývá posledních 7 dní:

### Shrnutí
- Celkový počet tisků
- Počet úspěšných / neúspěšných / přerušených
- Míra úspěšnosti a změna oproti předchozímu týdnu
- Nejaktivnější tiskárna

### Aktivita
- Tisky za den (minigraf)
- Celkové hodiny tisku
- Celková spotřeba filamentu (gramy a náklady)

### Filament
- Spotřeba podle materiálu a výrobce
- Odhadovaný zůstatek na cívce (cívky pod 20 % jsou zvýrazněny)

### Údržba
- Úlohy údržby provedené tento týden
- Propadlé úlohy údržby (červené varování)
- Úlohy s termínem příští týden

### HMS chyby
- Počet HMS chyb tento týden pro každou tiskárnu
- Nepotvrzené chyby (vyžadují pozornost)

## Obsah měsíční zprávy

Měsíční zpráva pokrývá posledních 30 dní a obsahuje vše z týdenní zprávy plus:

### Trendy
- Porovnání s předchozím měsícem (%)
- Mapa aktivit (miniatura heatmapy za měsíc)
- Vývoj míry úspěšnosti za měsíc

### Náklady
- Celkové náklady na filament
- Celkové náklady na energii (pokud je nakonfigurováno měření výkonu)
- Celkové náklady na opotřebení
- Celkové náklady na údržbu

### Opotřebení a zdraví
- Skóre zdraví pro každou tiskárnu (se změnou oproti předchozímu měsíci)
- Komponenty blížící se době výměny

### Statistické vrcholy
- Nejdelší úspěšný tisk
- Nejpoužívanější typ filamentu
- Tiskárna s nejvyšší aktivitou

## Přizpůsobení zprávy

1. Přejděte na **Nastavení → Zprávy → Přizpůsobení**
2. Zaškrtněte / odškrtněte sekce, které chcete zahrnout
3. Vyberte **Filtr tiskáren**: všechny tiskárny nebo výběr
4. Vyberte **Zobrazení loga**: zobrazit logo Bambu Dashboard v záhlaví nebo vypnout
5. Klikněte na **Uložit**

## Archiv zpráv

Všechny odeslané zprávy jsou uloženy a lze je znovu otevřít:

1. Přejděte na **Nastavení → Zprávy → Archiv**
2. Vyberte zprávu ze seznamu (seřazeno podle data)
3. Klikněte na **Otevřít** pro zobrazení HTML verze
4. Klikněte na **Stáhnout PDF** pro stažení zprávy

Zprávy se automaticky mažou po **90 dnech** (konfigurovatelné).
