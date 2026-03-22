---
sidebar_position: 4
title: Onderhoud
description: Bijhouden van spuitverwisseling, smering en andere onderhoudstaken met herinneringen, intervallen en kostenlogboek
---

# Onderhoud

De onderhoudsmodule helpt u alle onderhoud aan uw Bambu Lab-printers te plannen en bij te houden — van spuitverwisseling tot het smeren van geleiders.

Ga naar: **https://localhost:3443/#maintenance**

## Onderhoudsplan

Bambu Dashboard wordt geleverd met vooraf geconfigureerde onderhoudsintervallen voor alle Bambu Lab-printermodellen:

| Taak | Interval (standaard) | Model |
|---|---|---|
| Spuit reinigen | Elke 200 uur | Alle |
| Spuit verwisselen (messing) | Elke 500 uur | Alle |
| Spuit verwisselen (gehard) | Elke 2000 uur | Alle |
| X-as smeren | Elke 300 uur | X1C, P1S |
| Z-as smeren | Elke 300 uur | Alle |
| AMS-tandwielen reinigen | Elke 200 uur | AMS |
| Kammer reinigen | Elke 500 uur | X1C |
| PTFE-buis vervangen | Op aanvraag / 1000 uur | Alle |
| Kalibratie (volledig) | Maandelijks | Alle |

Alle intervallen zijn per printer aanpasbaar.

## Spuitverwisselingslogboek

1. Ga naar **Onderhoud → Spuiten**
2. Klik **Spuitverwisseling vastleggen**
3. Vul in:
   - **Datum** — automatisch ingesteld op vandaag
   - **Spuitmateriaal** — Messing / Gehard staal / Koper / Robijnstift
   - **Spuitdiameter** — 0.2 / 0.4 / 0.6 / 0.8 mm
   - **Merk/model** — optioneel
   - **Prijs** — voor het kostenlogboek
   - **Uren bij verwisseling** — automatisch opgehaald uit de printtijdteller
4. Klik **Opslaan**

Het logboek toont alle spuitgeschiedenis gesorteerd op datum.

:::tip Vroegtijdige herinnering
Stel **Waarschuw X uur van tevoren** in (bijv. 50 uur) om tijdig een melding te ontvangen voor de volgende aanbevolen verwisseling.
:::

## Onderhoudstaken aanmaken

1. Klik **Nieuwe taak** (+ icoon)
2. Vul in:
   - **Taaknaam** — bijv. «Y-as smeren»
   - **Printer** — kies de betreffende printer(s)
   - **Intervaltype** — Uren / Dagen / Aantal prints
   - **Interval** — bijv. 300 uur
   - **Laatste uitvoering** — geef aan wanneer het voor het laatst is gedaan (terugdatum instellen)
3. Klik **Aanmaken**

## Intervallen en herinneringen

Voor actieve taken wordt weergegeven:
- **Groen** — tijd tot volgend onderhoud > 50 % van interval over
- **Geel** — tijd tot volgend onderhoud < 50 % over
- **Oranje** — tijd tot volgend onderhoud < 20 % over
- **Rood** — onderhoud is vervallen

### Herinneringen configureren

1. Klik op een taak → **Bewerken**
2. Activeer **Herinneringen**
3. Stel **Waarschuwen bij** in, bijv. 10 % voor het vervallen
4. Kies meldingskanaal (zie [Meldingen](../funksjoner/notifications))

## Als uitgevoerd markeren

1. Zoek de taak in de lijst
2. Klik **Uitgevoerd** (vinkje-icoon)
3. Het interval wordt opnieuw ingesteld vanaf de huidige datum/uren
4. Er wordt automatisch een logboekvermelding aangemaakt

## Kostenlogboek

Alle onderhoudstaken kunnen een gekoppelde kostprijs hebben:

- **Onderdelen** — spuiten, PTFE-buizen, smeermiddelen
- **Tijd** — bestede uren × uurtarief
- **Externe service** — betaalde reparatie

De kosten worden per printer opgeteld en weergegeven in het statistiekenoverzicht.

## Onderhoudsgeschiedenis

Ga naar **Onderhoud → Geschiedenis** om te bekijken:
- Alle uitgevoerde onderhoudstaken
- Datum, uren en kostprijs
- Wie de taak heeft uitgevoerd (bij meerdere gebruikers)
- Opmerkingen en notities

Exporteer de geschiedenis naar CSV voor boekhoudkundige doeleinden.
