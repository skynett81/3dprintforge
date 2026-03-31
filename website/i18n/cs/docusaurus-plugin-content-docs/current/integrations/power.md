---
sidebar_position: 3
title: Měření výkonu
description: Měřte skutečnou spotřebu energie pro každý tisk pomocí chytré zásuvky Shelly nebo Tasmota a propojte s přehledem nákladů
---

# Měření výkonu

Připojte chytrou zásuvku s měřením energie k tiskárně pro zaznamenání skutečné spotřeby energie na tisk — nejen odhady.

Přejděte na: **https://localhost:3443/#settings** → **Integrace → Měření výkonu**

## Podporovaná zařízení

| Zařízení | Protokol | Doporučení |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Doporučeno — snadné nastavení |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Pro pevnou instalaci |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Novější modely s rozšířeným API |
| **Tasmota zařízení** | MQTT | Flexibilní pro vlastní sestavy |

:::tip Doporučené zařízení
Shelly Plug S Plus s firmwarem 1.0+ je testován a doporučen. Podporuje Wi-Fi, MQTT a HTTP REST bez závislosti na cloudu.
:::

## Nastavení se Shelly

### Předpoklady

- Shelly zásuvka je připojena ke stejné síti jako 3DPrintForge
- Shelly má nastavenu statickou IP nebo rezervaci DHCP

### Konfigurace

1. Přejděte na **Nastavení → Měření výkonu**
2. Klikněte na **Přidat měřič výkonu**
3. Vyberte **Typ**: Shelly
4. Vyplňte:
   - **IP adresa**: např. `192.168.1.150`
   - **Kanál**: 0 (pro jednozásuvkové pluginy)
   - **Autentizace**: uživatelské jméno a heslo, pokud je nakonfigurováno
5. Klikněte na **Test připojení**
6. Propojte zásuvku s **Tiskárnou**: vyberte z rozbalovacího seznamu
7. Klikněte na **Uložit**

### Interval dotazování

Výchozí interval dotazování je 10 sekund. Zkraťte na 5 pro přesnější měření, prodlužte na 30 pro nižší zatížení sítě.

## Nastavení s Tasmota

1. Nakonfigurujte zařízení Tasmota s MQTT (viz dokumentace Tasmota)
2. V 3DPrintForgeu: vyberte **Typ**: Tasmota
3. Zadejte MQTT topic zařízení: např. `tasmota/power-plug-1`
4. Propojte s tiskárnou a klikněte na **Uložit**

3DPrintForge se automaticky přihlásí k odběru `{topic}/SENSOR` pro měření výkonu.

## Co se měří

Při aktivovaném měření výkonu se pro každý tisk zaznamenávají:

| Metrika | Popis |
|---|---|
| **Okamžitý výkon** | Watty během tisku (živě) |
| **Celková spotřeba energie** | kWh za celý tisk |
| **Průměrný výkon** | kWh / doba tisku |
| **Náklady na energii** | kWh × cena elektřiny (z Tibber/Nordpool) |

Data se ukládají do historie tisku a jsou dostupná pro analýzu.

## Živé zobrazení

Okamžitá spotřeba výkonu se zobrazuje v:

- **Dashboardu** — jako dodatečný widget (aktivujte v nastavení widgetů)
- **Přehledu flotily** — jako malý indikátor na kartě tiskárny

## Porovnání s odhadem

Po tisku se zobrazí porovnání:

| | Odhadované | Skutečné |
|---|---|---|
| Spotřeba energie | 1,17 kWh | 1,09 kWh |
| Náklady na elektřinu | 2,16 Kč | 2,02 Kč |
| Odchylka | — | -6,8 % |

Konzistentní odchylka může být použita ke kalibraci odhadů v [Kalkulačce nákladů](../analytics/costestimator).

## Automatické vypnutí tiskárny

Shelly/Tasmota může automaticky vypnout tiskárnu po dokončení tisku:

1. Přejděte na **Měření výkonu → [Tiskárna] → Automatické vypnutí**
2. Aktivujte **Vypnout X minut po dokončení tisku**
3. Nastavte časové zpoždění (např. 10 minut)

:::danger Chlazení
Nechte tiskárnu chladit alespoň 5–10 minut po dokončení tisku před odpojením napájení. Tryska by se měla ochladit pod 50 °C, aby nedošlo ke creep v hotendu.
:::
