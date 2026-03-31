---
sidebar_position: 2
title: Elektriciteitsprijs
description: Verbinding maken met Tibber of Nordpool voor live uurtarieven, prijsgeschiedenis en prijswaarschuwingen
---

# Elektriciteitsprijs

De elektriciteitsprijsintegratie haalt live stroomprijzen op van Tibber of Nordpool om nauwkeurige stroomkostenberekeningen per print te geven en u te waarschuwen over goede of slechte momenten om te printen.

Ga naar: **https://localhost:3443/#settings** → **Integraties → Elektriciteitsprijs**

## Tibber-integratie

Tibber is een Noorse energieleverancier met een open API voor spotprijzen.

### Installatie

1. Log in op [developer.tibber.com](https://developer.tibber.com)
2. Genereer een **Personal Access Token**
3. In 3DPrintForge: plak het token onder **Tibber API Token**
4. Selecteer **Woning** (waarvan de prijzen moeten worden opgehaald, als u meerdere woningen heeft)
5. Klik op **Verbinding testen**
6. Klik op **Opslaan**

### Beschikbare data van Tibber

- **Spotprijs nu** — directe prijs inclusief belastingen (€/kWh)
- **Prijzen komende 24 uur** — Tibber levert de prijzen van morgen vanaf ca. 13:00
- **Prijsgeschiedenis** — tot 30 dagen terug
- **Kosten per print** — berekend op basis van de werkelijke printtijd × uurtarieven

## Nordpool-integratie

Nordpool is de energiebeurs die ruwe spotprijzen levert voor Noord-Europa.

### Installatie

1. Ga naar **Integraties → Nordpool**
2. Selecteer het **Prijsgebied**: NL (Nederland) / BE (België) / DE (Duitsland) / andere Europese gebieden
3. Selecteer de **Valuta**: EUR
4. Selecteer **Belastingen en heffingen**:
   - Vink **Inclusief BTW** aan (21%)
   - Vul de **Netbeheerderstarief** (€/kWh) in — zie uw energiefactuur
   - Vul de **Energiebelasting** (€/kWh) in
5. Klik op **Opslaan**

:::info Netbeheerderstarief
Het netbeheerdertarief varieert per leverancier en prijsmodel. Controleer uw laatste energiefactuur voor het juiste tarief.
:::

## Uurtarieven

Uurtarieven worden weergegeven als een staafdiagram voor de komende 24–48 uur:

- **Groen** — goedkope uren (onder het gemiddelde)
- **Geel** — gemiddelde prijs
- **Rood** — dure uren (boven het gemiddelde)
- **Grijs** — uren zonder beschikbare prijsvoorspelling

Beweeg de muis over een uur om de exacte prijs (€/kWh) te zien.

## Prijsgeschiedenis

Ga naar **Elektriciteitsprijs → Geschiedenis** om te bekijken:

- Dagelijkse gemiddelde prijs afgelopen 30 dagen
- Duurste en goedkoopste uur per dag
- Totale stroomkosten voor prints per dag

## Prijswaarschuwingen

Stel automatische waarschuwingen in op basis van de elektriciteitsprijs:

1. Ga naar **Elektriciteitsprijs → Prijswaarschuwingen**
2. Klik op **Nieuwe waarschuwing**
3. Kies het type waarschuwing:
   - **Prijs onder drempel** — waarschuwen wanneer de stroomprijs daalt onder X €/kWh
   - **Prijs boven drempel** — waarschuwen wanneer de prijs stijgt boven X €/kWh
   - **Goedkoopste uur vandaag** — waarschuwen wanneer het goedkoopste uur van de dag begint
4. Selecteer het meldingskanaal
5. Klik op **Opslaan**

:::tip Slim plannen
Combineer prijswaarschuwingen met de printwachtrij: stel een automatisering in die wachtrij-taken automatisch verzendt wanneer de stroomprijs laag is (vereist webhook-integratie of Home Assistant).
:::

## Elektriciteitsprijs in de kostencalculator

Een geactiveerde elektriciteitsprijsintegratie geeft nauwkeurige stroomkosten in de [Kostencalculator](../analytics/costestimator). Selecteer **Live prijs** in plaats van een vaste prijs om de actuele Tibber/Nordpool-prijs te gebruiken.
