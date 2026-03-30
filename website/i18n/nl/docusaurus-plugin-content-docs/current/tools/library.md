---
sidebar_position: 2
title: Bestandsbibliotheek
description: 3D-modellen en G-code-bestanden uploaden en beheren, G-code analyseren en koppelen aan MakerWorld en Printables
---

# Bestandsbibliotheek

De bestandsbibliotheek is een centrale plek om al uw 3D-modellen en G-code-bestanden op te slaan en te beheren — met automatische G-code-analyse en integratie met MakerWorld en Printables.

Ga naar: **https://localhost:3443/#library**

## Modellen uploaden

### Enkel uploaden

1. Ga naar **Bestandsbibliotheek**
2. Klik **Uploaden** of sleep bestanden naar het uploadgebied
3. Ondersteunde formaten: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Het bestand wordt automatisch geanalyseerd na het uploaden

:::info Opslagmap
Bestanden worden opgeslagen in de map die is geconfigureerd via **Instellingen → Bestandsbibliotheek → Opslagmap**. Standaard: `./data/library/`
:::

### Batch uploaden

Sleep een volledige map om alle ondersteunde bestanden in één keer te uploaden. De bestanden worden op de achtergrond verwerkt en u ontvangt een melding wanneer alles klaar is.

## G-code-analyse

Na het uploaden worden `.gcode`- en `.bgcode`-bestanden automatisch geanalyseerd:

| Metriek | Beschrijving |
|---|---|
| Geschatte printtijd | Tijd berekend uit G-code-opdrachten |
| Filamentverbruik | Gram en meter per materiaal/kleur |
| Laagenteller | Totaal aantal lagen |
| Laagdikte | Geregistreerde laagdikte |
| Materialen | Gedetecteerde materialen (PLA, PETG, enz.) |
| Vulpercentage | Indien beschikbaar in metadata |
| Ondersteuningsmateriaal | Geschat gewicht van ondersteuning |
| Printermodel | Doelprinter uit metadata |

De analysedata wordt weergegeven op de bestandskaart en gebruikt door de [Kostencalculator](../analytics/costestimator).

## Bestandskaarten en metadata

Elke bestandskaart toont:
- **Bestandsnaam** en formaat
- **Uploaddatum**
- **Thumbnail** (uit `.3mf` of gegenereerd)
- **Geanalyseerde printtijd** en filamentverbruik
- **Tags** en categorie
- **Gekoppelde prints** — aantal keren geprint

Klik op een kaart om de detailweergave met volledige metadata en geschiedenis te openen.

## Organiseren

### Tags

Voeg tags toe voor eenvoudig zoeken:
1. Klik op het bestand → **Metadata bewerken**
2. Voer tags in (kommagescheiden): `benchy, test, PLA, kalibratie`
3. Zoek in de bibliotheek met tagfilter

### Categorieën

Organiseer bestanden in categorieën:
- Klik **Nieuwe categorie** in de zijbalk
- Sleep bestanden naar de categorie
- Categorieën kunnen worden genest (subcategorieën ondersteund)

## Koppelen aan MakerWorld

1. Ga naar **Instellingen → Integraties → MakerWorld**
2. Log in met uw Bambu Lab-account
3. Terug in de bibliotheek: klik op een bestand → **Koppelen aan MakerWorld**
4. Zoek naar het model op MakerWorld en kies de juiste overeenkomst
5. Metadata (ontwerper, licentie, beoordeling) wordt geïmporteerd vanuit MakerWorld

De koppeling toont de naam van de ontwerper en de originele URL op de bestandskaart.

## Koppelen aan Printables

1. Ga naar **Instellingen → Integraties → Printables**
2. Plak uw Printables API-sleutel
3. Koppel bestanden aan Printables-modellen op dezelfde manier als MakerWorld

## Naar printer sturen

Vanuit de bestandsbibliotheek kunt u direct naar een printer sturen:

1. Klik op het bestand → **Naar printer sturen**
2. Kies de doelprinter
3. Kies AMS-sleuf (voor multicolor-prints)
4. Klik **Print starten** of **Toevoegen aan wachtrij**

:::warning Direct sturen
Direct sturen start de print onmiddellijk zonder bevestiging in Bambu Studio. Zorg dat de printer klaar is.
:::
