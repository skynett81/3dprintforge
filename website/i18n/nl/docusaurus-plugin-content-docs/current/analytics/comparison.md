---
sidebar_position: 6
title: Printvergelijking
description: Vergelijk twee prints naast elkaar met gedetailleerde statistieken, grafieken en galerij-afbeeldingen voor A/B-analyse
---

# Printvergelijking

De printvergelijking laat u twee prints naast elkaar analyseren — handig voor het vergelijken van instellingen, materialen, printers of versies van hetzelfde model.

Ga naar: **https://localhost:3443/#comparison**

## Prints selecteren om te vergelijken

1. Ga naar **Printvergelijking**
2. Klik op **Selecteer print A** en zoek in de geschiedenis
3. Klik op **Selecteer print B** en zoek in de geschiedenis
4. Klik op **Vergelijk** om de vergelijkingsweergave te laden

:::tip Snellere toegang
Vanuit de **Geschiedenis** kunt u rechts klikken op een print en **Instellen als print A** of **Vergelijken met...** selecteren om direct naar de vergelijkingsmodus te gaan.
:::

## Statistiekvergelijking

De statistieken worden weergegeven in twee kolommen (A en B) met markering welke het beste is:

| Statistiek | Beschrijving |
|---|---|
| Succes | Voltooid / Afgebroken / Mislukt |
| Duur | Totale printtijd |
| Filamentverbruik | Gram totaal en per kleur |
| Filamentefficiëntie | Model-% van totaal verbruik |
| Max. spuittemperatuur | Hoogst geregistreerde spuittemperatuur |
| Max. bedtemperatuur | Hoogst geregistreerde bedtemperatuur |
| Snelheidsinstelling | Stil / Standaard / Sport / Turbo |
| AMS-wissels | Aantal kleurwisselingen |
| HMS-fouten | Eventuele fouten tijdens het printen |
| Printer | Welke printer werd gebruikt |

Cellen met de beste waarde worden weergegeven met een groene achtergrond.

## Temperatuurgrafieken

Twee temperatuurgrafieken worden naast elkaar weergegeven (of overlappend):

- **Afzonderlijke weergave** — grafiek A links, grafiek B rechts
- **Overlappende weergave** — beide in dezelfde grafiek met verschillende kleuren

Gebruik de overlappende weergave om temperatuurstabiliteit en opwarmsnelheid direct te vergelijken.

## Galerij-afbeeldingen

Als beide prints milestone-screenshots hebben, worden ze in een raster weergegeven:

| Print A | Print B |
|---|---|
| 25%-afbeelding A | 25%-afbeelding B |
| 50%-afbeelding A | 50%-afbeelding B |
| 75%-afbeelding A | 75%-afbeelding B |
| 100%-afbeelding A | 100%-afbeelding B |

Klik op een afbeelding om de volledige schermvoorvertoning met slide-animatie te openen.

## Timelapse-vergelijking

Als beide prints een timelapse hebben, worden de video's naast elkaar weergegeven:

- Gesynchroniseerde weergave — beide starten en pauzeren tegelijkertijd
- Onafhankelijke weergave — bedien elke video afzonderlijk

## Instellingsverschillen

Het systeem markeert automatisch verschillen in printinstellingen (opgehaald uit G-code metadata):

- Verschillende laagdiktes
- Verschillende vulpatronen of -percentages
- Verschillende ondersteuningsinstellingen
- Verschillende snelheidsprofielen

Verschillen worden weergegeven met een oranje markering in de instellingentabel.

## Vergelijking opslaan

1. Klik op **Vergelijking opslaan**
2. Geef de vergelijking een naam (bijv. «PLA vs PETG - Benchy»)
3. De vergelijking wordt opgeslagen en is beschikbaar via **Geschiedenis → Vergelijkingen**

## Exporteren

1. Klik op **Exporteren**
2. Selecteer **PDF** voor een rapport met alle statistieken en afbeeldingen
3. Het rapport kan worden gekoppeld aan een project voor documentatie van materiaalkeuzе
