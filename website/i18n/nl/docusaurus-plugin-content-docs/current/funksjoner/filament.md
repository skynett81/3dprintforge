---
sidebar_position: 2
title: Filamentopslag
description: Beheer filamentspolen, AMS-synchronisatie, drogen en meer
---

# Filamentopslag

De filamentopslag geeft u een volledig overzicht van alle filamentspolen, geïntegreerd met AMS en printgeschiedenis.

## Overzicht

De opslag toont alle geregistreerde spoelen met:

- **Kleur** — visuele kleurkaart
- **Materiaal** — PLA, PETG, ABS, TPU, PA, enz.
- **Leverancier** — Bambu Lab, Polymaker, eSUN, enz.
- **Gewicht** — resterende gram (geschat of gewogen)
- **AMS-spoor** — in welk spoor de spoel zich bevindt
- **Status** — actief, leeg, aan het drogen, opgeslagen

## Spoelen toevoegen

1. Klik op **+ Nieuwe spoel**
2. Vul materiaal, kleur, leverancier en gewicht in
3. Scan de NFC-tag indien beschikbaar, of voer handmatig in
4. Opslaan

:::tip Bambu Lab-spoelen
Officiële Bambu Lab-spoelen kunnen automatisch worden geïmporteerd via de Bambu Cloud-integratie. Zie [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## AMS-synchronisatie

Wanneer het dashboard verbonden is met de printer, wordt de AMS-status automatisch gesynchroniseerd:

- Sporen worden weergegeven met de juiste kleur en het juiste materiaal van AMS
- Verbruik wordt bijgewerkt na elke print
- Lege spoelen worden automatisch gemarkeerd

Om een lokale spoel aan een AMS-spoor te koppelen:
1. Ga naar **Filament → AMS**
2. Klik op het spoor dat u wilt koppelen
3. Selecteer de spoel uit de opslag

## Drogen

Registreer droogcycli om blootstelling aan vocht bij te houden:

| Veld | Beschrijving |
|------|-------------|
| Droogdatum | Wanneer de spoel werd gedroogd |
| Temperatuur | Droogtemperatuur (°C) |
| Duur | Aantal uren |
| Methode | Oven, droogkast, filamentdroger |

:::info Aanbevolen droogtemperaturen
Zie de [Kennisbank](../kb/intro) voor materiaalspecifieke droogtijden en -temperaturen.
:::

## Kleurkaart

De kleurkaartweergave organiseert spoelen visueel op kleur. Handig om snel de juiste kleur te vinden. Filter op materiaal, leverancier of status.

## NFC-tags

Bambu Dashboard ondersteunt NFC-tags voor snelle identificatie van spoelen:

1. Schrijf de NFC-tag-ID naar de spoel in de opslag
2. Scan de tag met de telefoon
3. De spoel wordt direct geopend in het dashboard

## Importeren en exporteren

### Exporteren
Exporteer de volledige opslag als CSV: **Filament → Exporteren → CSV**

### Importeren
Importeer spoelen uit CSV: **Filament → Importeren → Bestand kiezen**

Het CSV-formaat:
```
naam,materiaal,kleur_hex,leverancier,gewicht_gram,nfc_id
PLA Wit,PLA,#FFFFFF,Bambu Lab,1000,
PETG Zwart,PETG,#000000,Polymaker,850,ABC123
```

## Statistieken

Onder **Filament → Statistieken** vindt u:

- Totaal verbruik per materiaal (afgelopen 30/90/365 dagen)
- Verbruik per printer
- Geschatte resterende levensduur per spoel
- Meest gebruikte kleuren en leveranciers
