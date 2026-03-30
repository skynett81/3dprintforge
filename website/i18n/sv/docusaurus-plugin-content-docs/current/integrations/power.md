---
sidebar_position: 3
title: Strömätning
description: Mät faktisk strömförbrukning per utskrift med Shelly eller Tasmota smart-plug och koppla till kostnadsöversikten
---

# Strömätning

Koppla en smart-plug med energimätning till skrivaren för att logga faktisk strömförbrukning per utskrift — inte bara uppskattningar.

Gå till: **https://localhost:3443/#settings** → **Integrationer → Strömätning**

## Enheter som stöds

| Enhet | Protokoll | Rekommendation |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Rekommenderat — enkel installation |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | För fast monterad installation |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Nyare modeller med utökat API |
| **Tasmota-enheter** | MQTT | Flexibelt för egna installationer |

:::tip Rekommenderad enhet
Shelly Plug S Plus med firmware 1.0+ är testad och rekommenderad. Stöder Wi-Fi, MQTT och HTTP REST utan molnberoende.
:::

## Installation med Shelly

### Förutsättningar

- Shelly-pluggen är ansluten till samma nätverk som Bambu Dashboard
- Shelly är konfigurerad med statisk IP eller DHCP-reservation

### Konfiguration

1. Gå till **Inställningar → Strömätning**
2. Klicka **Lägg till strömätare**
3. Välj **Typ**: Shelly
4. Fyll i:
   - **IP-adress**: t.ex. `192.168.1.150`
   - **Kanal**: 0 (för enkel-uttag-pluggar)
   - **Autentisering**: användarnamn och lösenord om konfigurerat
5. Klicka **Testa anslutning**
6. Koppla pluggen till en **Skrivare**: välj från rullgardinsmenyn
7. Klicka **Spara**

### Polling-intervall

Standard polling-intervall är 10 sekunder. Minska till 5 för noggrannare mätningar, öka till 30 för lägre nätverksbelastning.

## Installation med Tasmota

1. Konfigurera Tasmota-enheten med MQTT (se Tasmota-dokumentationen)
2. I Bambu Dashboard: välj **Typ**: Tasmota
3. Fyll i MQTT-ämne för enheten: t.ex. `tasmota/power-plug-1`
4. Koppla till skrivare och klicka **Spara**

Bambu Dashboard prenumererar automatiskt på `{topic}/SENSOR` för effektmätningar.

## Vad mäts

När strömätning är aktiverat loggas följande per utskrift:

| Mätvärde | Beskrivning |
|---|---|
| **Omedelbar effekt** | Watt under utskrift (live) |
| **Total energiförbrukning** | kWh för hela utskriften |
| **Genomsnittlig effekt** | kWh / utskriftstid |
| **Energikostnad** | kWh × elpris (från Tibber/Nordpool) |

Data lagras i utskriftshistoriken och är tillgängliga för analys.

## Livevisning

Omedelbar effektförbrukning visas i:

- **Dashboardet** — som en extra widget (aktivera i widgetinställningar)
- **Flottan** — som en liten indikator på skrivarkortet

## Jämförelse med uppskattning

Efter utskrift visas en jämförelse:

| | Uppskattat | Faktiskt |
|---|---|---|
| Energiförbrukning | 1.17 kWh | 1.09 kWh |
| Elkostnad | 2.16 kr | 2.02 kr |
| Avvikelse | — | -6.8 % |

Konsekvent avvikelse kan användas för att kalibrera uppskattningarna i [Kostnadskalkylatorn](../analytics/costestimator).

## Stäng av skrivare automatiskt

Shelly/Tasmota kan stänga av skrivaren automatiskt efter avslutad utskrift:

1. Gå till **Strömätning → [Skrivare] → Automatisk avstängning**
2. Aktivera **Stäng av X minuter efter avslutad utskrift**
3. Ange tidsfördröjning (t.ex. 10 minuter)

:::danger Avkylning
Låt skrivaren kylas ner i minst 5–10 minuter efter avslutad utskrift innan strömmen stängs av. Munstycket bör kylas under 50°C för att undvika värmekrypning i hotenden.
:::
