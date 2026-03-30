---
sidebar_position: 4
title: Údržba
description: Sledujte výměny trysek, mazání a další úlohy údržby s připomenutími, intervaly a protokolem nákladů
---

# Údržba

Modul údržby vám pomáhá plánovat a sledovat veškerou údržbu vašich tiskáren Bambu Lab — od výměny trysky po mazání kolejnic.

Přejděte na: **https://localhost:3443/#maintenance**

## Plán údržby

Bambu Dashboard přichází s předkonfigurovanými intervaly údržby pro všechny modely tiskáren Bambu Lab:

| Úloha | Interval (výchozí) | Model |
|---|---|---|
| Vyčistit trysku | Každých 200 hodin | Všechny |
| Vyměnit trysku (mosaz) | Každých 500 hodin | Všechny |
| Vyměnit trysku (kalená ocel) | Každých 2000 hodin | Všechny |
| Namazat osu X | Každých 300 hodin | X1C, P1S |
| Namazat osu Z | Každých 300 hodin | Všechny |
| Vyčistit ozubené kolo AMS | Každých 200 hodin | AMS |
| Vyčistit komoru | Každých 500 hodin | X1C |
| Vyměnit PTFE trubici | Dle potřeby / 1000 hodin | Všechny |
| Kalibrace (úplná) | Měsíčně | Všechny |

Všechny intervaly lze přizpůsobit pro každou tiskárnu.

## Protokol výměny trysky

1. Přejděte na **Údržba → Trysky**
2. Klikněte na **Zaznamenat výměnu trysky**
3. Vyplňte:
   - **Datum** — automaticky nastaveno na dnešek
   - **Materiál trysky** — Mosaz / Kalená ocel / Měď / Rubínový hrot
   - **Průměr trysky** — 0,2 / 0,4 / 0,6 / 0,8 mm
   - **Značka/model** — volitelné
   - **Cena** — pro protokol nákladů
   - **Hodiny při výměně** — automaticky načteno z čítače doby tisku
4. Klikněte na **Uložit**

Protokol zobrazuje celou historii trysek seřazenou podle data.

:::tip Předběžné připomenutí
Nastavte **Upozornit X hodin předem** (např. 50 hodin) pro včasné upozornění před příští doporučenou výměnou.
:::

## Vytváření úloh údržby

1. Klikněte na **Nová úloha** (ikona +)
2. Vyplňte:
   - **Název úlohy** — např. „Namazat osu Y"
   - **Tiskárna** — vyberte příslušnou tiskárnu (tiskárny)
   - **Typ intervalu** — Hodiny / Dny / Počet tisků
   - **Interval** — např. 300 hodin
   - **Naposledy provedeno** — zadejte, kdy bylo naposledy provedeno (nastavte zpětné datum)
3. Klikněte na **Vytvořit**

## Intervaly a připomenutí

Pro aktivní úlohy se zobrazuje:
- **Zelená** — do příští údržby zbývá > 50 % intervalu
- **Žlutá** — do příští údržby zbývá < 50 %
- **Oranžová** — do příští údržby zbývá < 20 %
- **Červená** — údržba je po termínu

### Konfigurace připomenutí

1. Klikněte na úlohu → **Upravit**
2. Aktivujte **Připomenutí**
3. Nastavte **Upozornit při** např. 10 % zbývajícího do termínu
4. Vyberte kanál upozornění (viz [Upozornění](../features/notifications))

## Označení jako dokončené

1. Najděte úlohu v seznamu
2. Klikněte na **Dokončeno** (ikona zaškrtnutí)
3. Interval se resetuje od dnešního data/hodin
4. Záznam protokolu se automaticky vytvoří

## Protokol nákladů

Ke všem úlohám údržby lze přiřadit náklady:

- **Díly** — trysky, PTFE trubice, maziva
- **Čas** — strávené hodiny × hodinová sazba
- **Externí servis** — zaplacená oprava

Náklady se sčítají pro každou tiskárnu a zobrazují v přehledu statistik.

## Historie údržby

Přejděte na **Údržba → Historie** pro zobrazení:
- Všech provedených úloh údržby
- Data, hodin a nákladů
- Kdo provedl (v systému s více uživateli)
- Komentářů a poznámek

Exportujte historii do CSV pro účetní účely.
