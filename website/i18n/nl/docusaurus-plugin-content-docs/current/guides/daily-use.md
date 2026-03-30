---
sidebar_position: 3
title: Dagelijks gebruik
description: Een praktische handleiding voor dagelijks gebruik van Bambu Dashboard — ochtendroutine, bewaking, na het printen en onderhoud
---

# Dagelijks gebruik

Deze handleiding behandelt hoe je Bambu Dashboard efficiënt gebruikt in je dagelijkse routine — van het begin van de dag tot het einde.

## Ochtendroutine

Open het dashboard en loop snel deze punten door:

### 1. Controleer printerstatus
Het overzichtspaneel toont de status van al je printers. Let op:
- **Rode pictogrammen** — fouten die aandacht vereisen
- **Openstaande meldingen** — HMS-waarschuwingen van de nacht
- **Onvoltooide prints** — als je een nachtprint had, is die klaar?

### 2. Controleer AMS-niveaus
Ga naar **Filament** of bekijk de AMS-widget op het dashboard:
- Zijn er spoelen onder 100 g? Wissel uit of bestel nieuw
- Juist filament in het juiste slot voor de prints van vandaag?

### 3. Controleer meldingen en gebeurtenissen
Onder **Meldingslog** (klokpictogram) zie je:
- Gebeurtenissen die 's nachts hebben plaatsgevonden
- Fouten die automatisch zijn gelogd
- HMS-codes die alarm hebben geactiveerd

## Een print starten

### Vanuit een bestand (Bambu Studio)
1. Open Bambu Studio
2. Laad en slice het model
3. Stuur naar printer — het dashboard wordt automatisch bijgewerkt

### Vanuit de wachtrij
Als je prints van tevoren hebt gepland:
1. Ga naar **Wachtrij**
2. Klik **Volgende starten** of sleep een taak naar de bovenkant
3. Bevestig met **Sturen naar printer**

Zie [Wachtrij-documentatie](../features/queue) voor volledige informatie over wachtrijbeheer.

### Geplande print (scheduler)
Om een print op een bepaald tijdstip te starten:
1. Ga naar **Planner**
2. Klik **+ Nieuwe taak**
3. Kies bestand, printer en tijdstip
4. Activeer **Stroomprijs-optimalisering** om automatisch het goedkoopste uur te kiezen

Zie [Planner](../features/scheduler) voor details.

## Een actieve print bewaken

### Cameraweergave
Klik op het camerapictogram op de printerkaart. Je kunt:
- Live feed bekijken in het dashboard
- Openen in een apart tabblad voor bewaking op de achtergrond
- Een handmatige schermafbeelding maken

### Voortgangsinformatie
De actieve printkaart toont:
- Percentage voltooid
- Geschatte resterende tijd
- Huidige laag / totaal aantal lagen
- Actief filament en kleur

### Temperaturen
Realtime temperatuurcurven worden weergegeven in het detailpaneel:
- Nozzletemperatuur — moet stabiel blijven binnen ±2°C
- Plaattemperatuur — belangrijk voor goede hechting
- Kamertemperatuur — stijgt geleidelijk, met name relevant voor ABS/ASA

### Print Guard
Als **Print Guard** is geactiveerd, bewaakt het dashboard automatisch op spaghetti en volumetrische afwijkingen. Als er iets wordt gedetecteerd:
1. De print wordt gepauzeerd
2. Je ontvangt een melding
3. De camerabeelden worden opgeslagen voor latere controle

## Na de print — controlelijst

### Controleer de kwaliteit
1. Open de camera en bekijk het resultaat terwijl het nog op de plaat ligt
2. Ga naar **Geschiedenis → Laatste print** om statistieken te bekijken
3. Log een notitie: wat ging goed, wat kan beter

### Archiveren
Prints in de geschiedenis worden nooit automatisch gearchiveerd — ze blijven staan. Wil je opruimen:
- Klik op een print → **Archiveren** om naar het archief te verplaatsen
- Gebruik **Projecten** om gerelateerde prints te groeperen

### Filamentgewicht bijwerken
Als je de spoel weegt voor nauwkeurigheid (aanbevolen):
1. Weeg de spoel
2. Ga naar **Filament → [De spoel]**
3. Werk **Resterend gewicht** bij

## Onderhoudsherinneringen

Het dashboard houdt onderhoudsintervallen automatisch bij. Onder **Onderhoud** zie je:

| Taak | Interval | Status |
|------|----------|--------|
| Nozzle reinigen | Elke 50 uur | Automatisch gecontroleerd |
| Stangen smeren | Elke 200 uur | Bijgehouden in dashboard |
| Plaat kalibreren | Na plaatwissel | Handmatige herinnering |
| AMS reinigen | Maandelijks | Kalendermelding |

Activeer onderhoudsmeldingen onder **Bewaking → Onderhoud → Meldingen**.

:::tip Stel een wekelijkse onderhoudsdag in
Een vaste onderhoudsdag per week (bijv. zondagavond) bespaart je onnodige stilstand. Gebruik de herinneringsfunctie in het dashboard.
:::

## Stroomprijs — beste tijd om te printen

Als je de stroomprijs-integratie hebt gekoppeld (Nordpool / Home Assistant):

1. Ga naar **Analyse → Stroomprijs**
2. Bekijk de prijsgrafiek voor de komende 24 uur
3. Goedkoopste uren zijn groen gemarkeerd

Gebruik **Planner** met **Stroomprijs-optimalisering** ingeschakeld — dan start het dashboard de taak automatisch in het goedkoopste beschikbare venster.

:::info Typisch goedkoopste tijden
Nacht (01:00–06:00) is over het algemeen het goedkoopst. Een print van 8 uur die 's avonds in de wachtrij is gezet, kan je 30–50% op stroomkosten besparen.
:::
