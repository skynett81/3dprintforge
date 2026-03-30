---
sidebar_position: 3
title: Údržba AMS
description: Údržba AMS — PTFE trubice, dráha filamentu a prevence vlhkosti
---

# Údržba AMS

AMS (Automatic Material System) je přesný systém, který vyžaduje pravidelnou údržbu pro spolehlivé fungování. Nejčastější problémy jsou znečištěná dráha filamentu a vlhkost v krytu.

## PTFE trubice

PTFE trubice transportují filament z AMS do tiskárny. Jsou mezi prvními díly, které se opotřebovávají.

### Inspekce
Zkontrolujte PTFE trubice na:
- **Zlomy nebo ohyby** — brání toku filamentu
- **Opotřebení u spojů** — bílý prach kolem vstupů
- **Deformaci tvaru** — zejména při použití CF materiálů

### Výměna PTFE trubic
1. Uvolněte filament z AMS (spusťte cyklus odlehčení)
2. Zatlačte modrý uzamykací kroužek kolem trubice u spoje
3. Vytáhněte trubici ven (vyžaduje pevný grip)
4. Nařízněte novou trubici na správnou délku (ne kratší než originál)
5. Zatlačte dovnitř, dokud nezastaví, a zamkněte

:::tip AMS Lite vs. AMS
AMS Lite (A1/A1 Mini) má jednodušší konfiguraci PTFE než plné AMS (P1S/X1C). Trubice jsou kratší a snazší na výměnu.
:::

## Dráha filamentu

### Čištění dráhy filamentu
Filamenty zanechávají prach a zbytky v dráze filamentu, zejména CF materiály:

1. Spusťte odlehčení všech pozic
2. Použijte stlačený vzduch nebo měkký štětec k vyfoukání volného prachu
3. Protáhněte čistý kus nylonu nebo čisticího filamentu PTFE přes dráhu

### Senzory
AMS používá senzory pro detekci polohy filamentu a přerušení filamentu. Udržujte okna senzorů čistá:
- Opatrně otřete čočky senzorů čistým štětcem
- Vyhněte se přímé aplikaci IPA na senzory

## Vlhkost

AMS nechrání filament před vlhkostí. Pro hygroskopické materiály (PA, PETG, TPU) se doporučuje:

### Suché alternativy AMS
- **Uzavřená krabice:** Umístěte cívky do těsné krabice se silikagelem
- **Bambu Dry Box:** Oficiální příslušenství sušicí krabice
- **Externí podavač:** Použijte podavač filamentu mimo AMS pro citlivé materiály

### Indikátory vlhkosti
Vložte karty s indikátorem vlhkosti (hygrometr) do krytu AMS. Vyměňte sáčky silikagelu při relativní vlhkosti nad 30 %.

## Hnací kola a upínací mechanismus

### Inspekce
Zkontrolujte hnací kola (extruderová kola v AMS) na:
- Zbytky filamentu mezi zuby
- Opotřebení ozubení
- Nerovnoměrné tření při ručním tahu

### Čištění
1. Použijte zubní kartáček nebo štětec k odstranění zbytků mezi zuby hnacího kola
2. Vyfoukejte stlačeným vzduchem
3. Vyhněte se oleji a mazivům — úroveň tahu je kalibrována pro suchý provoz

## Intervaly údržby

| Aktivita | Interval |
|-----------|---------|
| Vizuální inspekce PTFE trubic | Měsíčně |
| Čištění dráhy filamentu | Každých 100 hodin |
| Kontrola senzorů | Měsíčně |
| Výměna silikagelu (suchá konfigurace) | Dle potřeby (při 30%+ RV) |
| Výměna PTFE trubic | Při viditelném opotřebení |
