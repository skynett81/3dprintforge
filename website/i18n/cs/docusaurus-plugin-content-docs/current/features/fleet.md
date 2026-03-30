---
sidebar_position: 3
title: Přehled flotily
description: Správa a monitorování všech tiskáren Bambu Lab v jedné mřížce s tříděním, filtrováním a stavem v reálném čase
---

# Přehled flotily

Přehled flotily vám poskytuje kompaktní přehled všech připojených tiskáren na jedné stránce. Ideální pro dílny, učebny nebo kohokoliv, kdo má více než jednu tiskárnu.

Přejděte na: **https://localhost:3443/#fleet**

## Mřížka více tiskáren

Všechny registrované tiskárny jsou zobrazeny v responzivní mřížce:

- **Velikost karty** — Malá (kompaktní), Střední (standardní), Velká (podrobná)
- **Počet sloupců** — Automaticky se přizpůsobí šířce obrazovky nebo nastavte ručně
- **Aktualizace** — Každá karta se aktualizuje nezávisle přes MQTT

Každá karta tiskárny zobrazuje:
| Pole | Popis |
|---|---|
| Název tiskárny | Nakonfigurovaný název s ikonou modelu |
| Stav | Nečinná / Tiskne / Pauza / Chyba / Odpojena |
| Průběh | Procentuální pruh se zbývajícím časem |
| Teplota | Tryska a podložka (kompaktní) |
| Aktivní filament | Barva a materiál z AMS |
| Miniatura kamery | Statický snímek aktualizovaný každých 30 sekund |

## Stavový indikátor pro každou tiskárnu

Barvy stavu usnadňují rozpoznání stavu na dálku:

- **Zelený puls** — Aktivně tiskne
- **Modrá** — Nečinná a připravená
- **Žlutá** — Pozastavena (ručně nebo Print Guardem)
- **Červená** — Zjištěna chyba
- **Šedá** — Odpojena nebo nedostupná

:::tip Kiosková režim
Použijte přehled flotily v kioskovém režimu na stěnové obrazovce. Viz [Kioskový režim](../system/kiosk) pro nastavení.
:::

## Řazení

Kliknutím na **Řadit** vyberte pořadí:

1. **Název** — Abecedně A–Z
2. **Stav** — Aktivní tiskárny nahoře
3. **Průběh** — Nejdokončenější nahoře
4. **Naposledy aktivní** — Naposledy použité nahoře
5. **Model** — Seskupeno podle modelu tiskárny

Řazení se pamatuje do příštího návštěvy.

## Filtrování

Použijte filtrační pole nahoře pro omezení zobrazení:

- Zadejte název tiskárny nebo část názvu
- Vyberte **Stav** z rozevíracího seznamu (Vše / Tiskne / Nečinná / Chyba)
- Vyberte **Model** pro zobrazení pouze jednoho typu tiskárny (X1C, P1S, A1 atd.)
- Kliknutím na **Resetovat filtr** zobrazíte vše

:::info Vyhledávání
Vyhledávání filtruje v reálném čase bez obnovení stránky.
:::

## Akce z přehledu flotily

Kliknutím pravým tlačítkem na kartu (nebo kliknutím na tři tečky) zobrazíte rychlé akce:

- **Otevřít dashboard** — Přejít přímo na hlavní panel tiskárny
- **Pozastavit tisk** — Pozastaví tiskárnu
- **Zastavit tisk** — Přeruší probíhající tisk (vyžaduje potvrzení)
- **Zobrazit kameru** — Otevře zobrazení kamery ve vyskakovacím okně
- **Přejít na nastavení** — Otevře nastavení tiskárny

:::danger Zastavit tisk
Zastavení tisku je nevratné. Vždy potvrďte v dialogovém okně, které se zobrazí.
:::

## Agregované statistiky

V horní části přehledu flotily se zobrazuje souhrnný řádek:

- Celkový počet tiskáren
- Počet aktivních tisků
- Celková spotřeba filamentu dnes
- Odhadovaný čas dokončení nejdelšího probíhajícího tisku
