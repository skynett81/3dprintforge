---
sidebar_position: 5
title: Problemen oplossen bij mislukte prints
description: Diagnosticeer en los veelvoorkomende printfouten op met behulp van de foutlogboeken en hulpmiddelen van Bambu Dashboard
---

# Problemen oplossen bij mislukte prints

Iets ging fout? Geen paniek — de meeste printfouten hebben eenvoudige oplossingen. Bambu Dashboard helpt je snel de oorzaak te vinden.

## Stap 1 — Controleer de HMS-foutcodes

HMS (Handling, Monitoring, Sensing) is het foutsysteem van Bambu Labs. Alle fouten worden automatisch gelogd in het dashboard.

1. Ga naar **Bewaking → Fouten**
2. Vind de mislukte print
3. Klik op de foutcode voor een gedetailleerde beschrijving en voorgestelde oplossing

Veelvoorkomende HMS-codes:

| Code | Beschrijving | Snelle oplossing |
|------|-------------|-----------------|
| 0700 1xxx | AMS-fout (vastgelopen, motorprobleem) | Controleer het filamentpad in AMS |
| 0300 0xxx | Extrudeerfout (onder/over-extrusie) | Reinig nozzle, controleer filament |
| 0500 xxxx | Kalibratiefout | Voer herkalibratie uit |
| 1200 xxxx | Temperatuurafwijking | Controleer kabelverbindingen |
| 0C00 xxxx | Camerafout | Herstart printer |

:::tip Foutcodes in de geschiedenis
Onder **Geschiedenis → [Print] → HMS-log** kun je alle foutcodes zien die tijdens de print zijn opgetreden — zelfs als de print "voltooid" is.
:::

## Veelvoorkomende fouten en oplossingen

### Slechte hechting (eerste laag hecht niet)

**Symptomen:** De print laat los van de plaat, krult omhoog, eerste laag ontbreekt

**Oorzaken en oplossingen:**

| Oorzaak | Oplossing |
|---------|-----------|
| Vuile plaat | Veeg af met IPA-alcohol |
| Verkeerde plaattemperatuur | Verhoog met 5°C |
| Z-offset verkeerd | Voer Auto Bed Leveling opnieuw uit |
| Ontbrekende lijmstift (PETG/ABS) | Breng dunne laag lijmstift aan |
| Eerste laag te snel | Verlaag naar 20–30 mm/s voor de eerste laag |

**Snelle controlelijst:**
1. Is de plaat schoon? (IPA + pluisvrij doekje)
2. Gebruik je de juiste plaat voor het filamenttype? (zie [De juiste plaat kiezen](./choosing-plate))
3. Is de Z-kalibratie gedaan na de laatste plaatwissel?

---

### Warping (hoeken komen omhoog)

**Symptomen:** Hoeken buigen omhoog van de plaat, met name bij grote platte modellen

**Oorzaken en oplossingen:**

| Oorzaak | Oplossing |
|---------|-----------|
| Temperatuurverschil | Sluit de voordeur van de printer |
| Ontbrekende brim | Activeer brim in Bambu Studio (3–5 mm) |
| Plaat te koud | Verhoog plaattemperatuur 5–10°C |
| Filament met hoge krimp (ABS) | Gebruik Engineering Plate + kamer >40°C |

**ABS en ASA zijn bijzonder gevoelig.** Zorg altijd voor:
- Voordeur gesloten
- Zo min mogelijk ventilatie
- Engineering Plate + lijmstift
- Kamertemperatuur 40°C+

---

### Stringing (draden tussen onderdelen)

**Symptomen:** Fijne plastic draden tussen afzonderlijke onderdelen van het model

**Oorzaken en oplossingen:**

| Oorzaak | Oplossing |
|---------|-----------|
| Vochtig filament | Droog filament 6–8 uur (60–70°C) |
| Nozzletemperatuur te hoog | Verlaag met 5°C |
| Te weinig retractie | Verhoog retractielengte in Bambu Studio |
| Reissnelheid te laag | Verhoog travel speed naar 200+ mm/s |

**De vochtigheidstest:** Let op knapgeluiden of bellen in de extrusie — dit duidt op vochtig filament. Bambu AMS heeft ingebouwde vochtigheidsmeting; controleer de vochtigheid onder **AMS-status**.

:::tip Filamentdroger
Investeer in een filamentdroger (bijv. Bambu Filament Dryer) als je werkt met nylon of TPU — deze absorberen vocht in minder dan 12 uur.
:::

---

### Spaghetti (print stort in tot een klomp)

**Symptomen:** Filament hangt in losse draden in de lucht, de print is niet herkenbaar

**Oorzaken en oplossingen:**

| Oorzaak | Oplossing |
|---------|-----------|
| Slechte hechting vroeg → losgelaten → ingestort | Zie de hechtingssectie hierboven |
| Snelheid te hoog | Verlaag snelheid met 20–30% |
| Verkeerde supportconfiguratie | Activeer supports in Bambu Studio |
| Overhang te steil | Splits het model of roteer 45° |

**Gebruik Print Guard om spaghetti automatisch te stoppen** — zie de volgende sectie.

---

### Onder-extrusie (dunne, zwakke lagen)

**Symptomen:** Lagen zijn niet solide, gaten in wanden, zwak model

**Oorzaken en oplossingen:**

| Oorzaak | Oplossing |
|---------|-----------|
| Nozzle gedeeltelijk verstopt | Voer Cold Pull uit (zie onderhoud) |
| Filament te vochtig | Droog filament |
| Temperatuur te laag | Verhoog nozzletemperatuur 5–10°C |
| Snelheid te hoog | Verlaag 20–30% |
| PTFE-buis beschadigd | Inspecteer en vervang PTFE-buis |

## Print Guard gebruiken voor automatische bescherming

Print Guard bewaakt de camerabeelden met beeldherkenning en stopt de print automatisch als spaghetti wordt gedetecteerd.

**Print Guard activeren:**
1. Ga naar **Bewaking → Print Guard**
2. Activeer **Automatische detectie**
3. Kies actie: **Pauzeren** (aanbevolen) of **Annuleren**
4. Stel gevoeligheid in (begin met **Medium**)

**Wanneer Print Guard ingrijpt:**
1. Je ontvangt een melding met een cameraopname van wat werd gedetecteerd
2. De print wordt gepauzeerd
3. Je kunt kiezen: **Doorgaan** (als vals positief) of **Print annuleren**

:::info Valse positieven
Print Guard kan soms reageren op modellen met veel dunne kolommen. Verlaag de gevoeligheid of schakel tijdelijk uit voor complexe modellen.
:::

## Diagnostische hulpmiddelen in het dashboard

### Temperatuurlog
Onder **Geschiedenis → [Print] → Temperaturen** kun je de temperatuurcurve gedurende de gehele print bekijken. Let op:
- Plotselinge temperatuurdalingen (nozzle- of plaatprobleem)
- Ongelijkmatige temperaturen (kalibratiebehoefte)

### Filamentstatistieken
Controleer of het verbruikte filament overeenkomt met de schatting. Een grote afwijking kan duiden op onder-extrusie of filamentbreuk.

## Wanneer contact opnemen met support?

Neem contact op met Bambu Labs support als:
- De HMS-code zich herhaalt nadat je alle oplossingen hebt gevolgd
- Je mechanische schade aan de printer ziet (verbogen stangen, kapotte tandwielen)
- De temperatuurwaarden onmogelijk zijn (bijv. nozzle leest -40°C)
- Een firmware-update het probleem niet oplost

**Handig om klaar te hebben voor support:**
- HMS-foutcodes uit het foutlogboek van het dashboard
- Cameraopname van de fout
- Welk filament en welke instellingen zijn gebruikt (kan worden geëxporteerd vanuit de geschiedenis)
- Printermodel en firmwareversie (weergegeven onder **Instellingen → Printer → Info**)
