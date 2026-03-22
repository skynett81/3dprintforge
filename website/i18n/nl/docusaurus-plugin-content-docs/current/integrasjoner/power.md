---
sidebar_position: 3
title: Stroommonitoring
description: Meet het werkelijke stroomverbruik per print met een Shelly of Tasmota slimme stekker en koppel dit aan het kostenoverzicht
---

# Stroommonitoring

Sluit een slimme stekker met energiemeting aan op de printer om het werkelijke stroomverbruik per print te loggen — niet alleen schattingen.

Ga naar: **https://localhost:3443/#settings** → **Integraties → Stroommonitoring**

## Ondersteunde apparaten

| Apparaat | Protocol | Aanbeveling |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Aanbevolen — eenvoudige installatie |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Voor vaste installatie |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Nieuwere modellen met uitgebreid API |
| **Tasmota-apparaten** | MQTT | Flexibel voor zelfgebouwde installaties |

:::tip Aanbevolen apparaat
Shelly Plug S Plus met firmware 1.0+ is getest en aanbevolen. Ondersteunt Wi-Fi, MQTT en HTTP REST zonder cloudafhankelijkheid.
:::

## Instelling met Shelly

### Vereisten

- De Shelly-stekker is verbonden met hetzelfde netwerk als Bambu Dashboard
- De Shelly is geconfigureerd met een vast IP of DHCP-reservering

### Configuratie

1. Ga naar **Instellingen → Stroommonitoring**
2. Klik op **Stroommeter toevoegen**
3. Selecteer **Type**: Shelly
4. Vul in:
   - **IP-adres**: bijv. `192.168.1.150`
   - **Kanaal**: 0 (voor enkelvoudige stekkers)
   - **Authenticatie**: gebruikersnaam en wachtwoord indien geconfigureerd
5. Klik op **Verbinding testen**
6. Koppel de stekker aan een **Printer**: selecteer uit de vervolgkeuzelijst
7. Klik op **Opslaan**

### Polling-interval

Het standaard polling-interval is 10 seconden. Verklein naar 5 voor nauwkeurigere metingen, vergroot naar 30 voor minder netwerkbelasting.

## Instelling met Tasmota

1. Configureer het Tasmota-apparaat met MQTT (zie de Tasmota-documentatie)
2. In Bambu Dashboard: selecteer **Type**: Tasmota
3. Vul het MQTT-topic voor het apparaat in: bijv. `tasmota/power-plug-1`
4. Koppel aan printer en klik op **Opslaan**

Bambu Dashboard abonneert automatisch op `{topic}/SENSOR` voor vermogensmetingen.

## Wat wordt gemeten

Wanneer stroommonitoring is geactiveerd, wordt het volgende per print gelogd:

| Metriek | Beschrijving |
|---|---|
| **Huidig vermogen** | Watt tijdens het printen (live) |
| **Totaal energieverbruik** | kWh voor de volledige print |
| **Gemiddeld vermogen** | kWh / printtijd |
| **Energiekosten** | kWh × elektriciteitsprijs (van Tibber/Nordpool) |

De data wordt opgeslagen in de printgeschiedenis en is beschikbaar voor analyse.

## Live weergave

Huidig vermogenverbruik wordt weergegeven in:

- **Het dashboard** — als een extra widget (activeer via widget-instellingen)
- **Het vlootoverzicht** — als een kleine indicator op de printerkaart

## Vergelijking met schatting

Na het printen wordt een vergelijking weergegeven:

| | Geschat | Werkelijk |
|---|---|---|
| Energieverbruik | 1,17 kWh | 1,09 kWh |
| Stroomkosten | €0,41 | €0,38 |
| Afwijking | — | -6,8 % |

Een consistente afwijking kan worden gebruikt om de schattingen in de [Kostencalculator](../analyse/costestimator) te kalibreren.

## Printer automatisch uitschakelen

Shelly/Tasmota kan de printer automatisch uitschakelen na een voltooide print:

1. Ga naar **Stroommonitoring → [Printer] → Automatisch uit**
2. Activeer **X minuten na voltooide print uitschakelen**
3. Stel de tijdvertraging in (bijv. 10 minuten)

:::danger Afkoelen
Laat de printer minstens 5–10 minuten afkoelen na een voltooide print voordat de stroom wordt onderbroken. De spuitmond moet afkoelen tot onder 50°C om thermische kruip in de hotend te voorkomen.
:::
