---
sidebar_position: 4
title: Externe servers
description: Verbind meerdere Bambu Dashboard-instanties om alle printers vanuit één centraal dashboard te bekijken en te beheren
---

# Externe servers (Remote Nodes)

De functie voor externe servers stelt u in staat meerdere Bambu Dashboard-instanties te koppelen, zodat u alle printers vanuit één centrale interface kunt bekijken en besturen — ongeacht of ze zich in hetzelfde netwerk of op verschillende locaties bevinden.

Ga naar: **https://localhost:3443/#settings** → **Integraties → Externe servers**

## Gebruiksscenario's

- **Thuis + kantoor** — Bekijk printers op beide locaties vanuit hetzelfde dashboard
- **Makerspace** — Centraal dashboard voor alle instanties in de ruimte
- **Gastinstanties** — Geef klanten beperkt inzicht zonder volledige toegang

## Architectuur

```
Primaire instantie (uw pc)
  ├── Printer A (lokale MQTT)
  ├── Printer B (lokale MQTT)
  └── Externe server: Secundaire instantie
        ├── Printer C (MQTT op externe locatie)
        └── Printer D (MQTT op externe locatie)
```

De primaire instantie pollt de externe servers via REST API en aggregeert de data lokaal.

## Een externe server toevoegen

### Stap 1: Genereer een API-sleutel op de externe instantie

1. Log in op de externe instantie (bijv. `https://192.168.2.50:3443`)
2. Ga naar **Instellingen → API-sleutels**
3. Klik **Nieuwe sleutel** → geef deze de naam «Primaire node»
4. Stel rechten in: **Lezen** (minimaal) of **Lezen + Schrijven** (voor beheer op afstand)
5. Kopieer de sleutel

### Stap 2: Verbinding maken vanuit de primaire instantie

1. Ga naar **Instellingen → Externe servers**
2. Klik **Externe server toevoegen**
3. Vul in:
   - **Naam**: bijv. «Kantoor» of «Garage»
   - **URL**: `https://192.168.2.50:3443` of externe URL
   - **API-sleutel**: de sleutel uit stap 1
4. Klik **Verbinding testen**
5. Klik **Opslaan**

:::warning Zelfondertekend certificaat
Als de externe instantie een zelfondertekend certificaat gebruikt, activeer dan **TLS-fouten negeren** — doe dit echter alleen voor interne netwerkverbindingen.
:::

## Geaggregeerde weergave

Na verbinding verschijnen de externe printers in:

- **Het vlootoverzicht** — gemarkeerd met de naam van de externe server en een cloud-icoon
- **Statistieken** — geaggregeerd over alle instanties
- **Filamentopslag** — gecombineerd overzicht

## Beheer op afstand

Met **Lezen + Schrijven**-rechten kunt u externe printers rechtstreeks besturen:

- Pauzeren / Hervatten / Stoppen
- Toevoegen aan de printwachtrij (taak wordt naar de externe instantie gestuurd)
- Camerafeed bekijken (via de externe instantie geproxied)

:::info Latentie
Camerafeed via een externe server kan merkbare vertraging hebben, afhankelijk van de netwerksnelheid en de afstand.
:::

## Toegangsbeheer

Beperk welke data de externe server deelt:

1. Op de externe instantie: ga naar **Instellingen → API-sleutels → [Sleutelnaam]**
2. Beperk toegang:
   - Alleen specifieke printers
   - Geen camerafeed
   - Alleen-lezen

## Status en bewaking

De status van elke externe server wordt weergegeven in **Instellingen → Externe servers**:

- **Verbonden** — laatste poll geslaagd
- **Verbroken** — externe server niet bereikbaar
- **Verificatiefout** — API-sleutel ongeldig of verlopen
- **Laatste synchronisatie** — tijdstempel van de laatste geslaagde datasynchronisatie
