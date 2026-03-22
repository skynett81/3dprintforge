---
sidebar_position: 5
title: Ovládání tiskárny
description: Ovládejte teplotu, rychlost, ventilátory a odesílejte G-kód přímo do tiskárny
---

# Ovládání tiskárny

Ovládací panel vám poskytuje plnou ruční kontrolu nad tiskárnou přímo z dashboardu.

## Řízení teploty

### Tryska
- Nastavte cílovou teplotu mezi 0–350 °C
- Kliknutím na **Nastavit** odešlete příkaz
- Aktuální odečet se zobrazuje s animovaným kruhovým ukazatelem

### Vyhřívaná podložka
- Nastavte cílovou teplotu mezi 0–120 °C
- Automatické vypnutí po tisku (konfigurovatelné)

### Komora
- Zobrazení teploty komory (aktuální odečet)
- **X1E, H2S, H2D, H2C**: Aktivní řízení vytápění komory přes M141 (ovladatelná cílová teplota)
- **X1C**: Pasivní uzavření — teplota komory se zobrazuje, ale nelze ji přímo řídit
- **P1S**: Pasivní uzavření — zobrazuje teplotu, žádné aktivní řízení vytápění komory
- **P1P, A1, A1 mini a H série bez chamberHeat**: Žádný senzor komory

:::warning Maximální teploty
Nepřekračujte doporučené teploty pro trysku a podložku. Pro trysku z tvrzené oceli (typ HF): max. 300 °C. Pro mosaz: max. 260 °C. Viz příručku tiskárny.
:::

## Rychlostní profily

Ovládání rychlosti nabízí čtyři přednastavené profily:

| Profil | Rychlost | Použití |
|--------|----------|-------------|
| Tichý | 50% | Snížení hluku, noční tisk |
| Standardní | 100% | Normální použití |
| Sport | 124% | Rychlejší tisky |
| Turbo | 166% | Maximální rychlost (snížení kvality) |

Posuvník umožňuje nastavit vlastní procento mezi 50–200%.

## Ovládání ventilátorů

Ruční ovládání rychlostí ventilátorů:

| Ventilátor | Popis | Rozsah |
|-------|-------------|--------|
| Part cooling fan | Chlazení tištěného objektu | 0–100% |
| Auxiliary fan | Cirkulace v komoře | 0–100% |
| Chamber fan | Aktivní chlazení komory | 0–100% |

:::tip Doporučená nastavení
- **PLA/PETG:** Chlazení dílů 100%, aux 30%
- **ABS/ASA:** Chlazení dílů 0–20%, komorový ventilátor vypnut
- **TPU:** Chlazení dílů 50%, nízká rychlost
:::

## Konzola G-kódu

Odesílejte G-kódové příkazy přímo do tiskárny:

```gcode
; Příklad: Přesun tiskové hlavy
G28 ; Home všech os
G1 X150 Y150 Z10 F3000 ; Přesun na střed
M104 S220 ; Nastavení teploty trysky
M140 S60  ; Nastavení teploty podložky
```

:::danger Buďte opatrní s G-kódem
Nesprávný G-kód může poškodit tiskárnu. Odesílejte pouze příkazy, kterým rozumíte. Vyhněte se `M600` (výměna filamentu) uprostřed tisku.
:::

## Operace s filamentem

Z ovládacího panelu můžete:

- **Zasunutí filamentu** — zahřeje trysku a vsune filament
- **Vysunutí filamentu** — zahřeje a vysune filament
- **Čištění trysky** — spustí čisticí cyklus

## Makra

Ukládejte a spouštějte sekvence G-kódových příkazů jako makra:

1. Klikněte na **Nové makro**
2. Pojmenujte makro
3. Napište G-kódovou sekvenci
4. Uložte a spusťte jedním kliknutím

Ukázkové makro pro kalibraci podložky:
```gcode
G28
M84
M500
```

## Ovládání tisku

Během aktivního tisku můžete:

- **Pauza** — pozastaví tisk po aktuální vrstvě
- **Pokračovat** — obnoví pozastavený tisk
- **Stop** — přeruší tisk (nevratné)
- **Nouzové zastavení** — okamžité zastavení všech motorů
