---
sidebar_position: 3
title: Printgeschiedenis
description: Volledig logboek van alle prints met statistieken, filamenttracking en export
---

# Printgeschiedenis

De printgeschiedenis biedt een volledig logboek van alle prints die met het dashboard zijn uitgevoerd, inclusief statistieken, filamentverbruik en links naar de modelbronnen.

## De geschiedenistabel

De tabel toont alle prints met:

| Kolom | Beschrijving |
|---------|-------------|
| Datum/tijd | Starttijdstip |
| Modelnaam | Bestandsnaam of MakerWorld-titel |
| Printer | Welke printer werd gebruikt |
| Duur | Totale printtijd |
| Filament | Materiaal en gram gebruikt |
| Lagen | Aantal lagen en gewicht (g) |
| Status | Voltooid, afgebroken, mislukt |
| Afbeelding | Miniatuur (bij cloud-integratie) |

## Zoeken en filteren

Gebruik het zoekveld en de filters om prints te vinden:

- Vrije tekstzoekopdracht op modelnaam
- Filteren op printer, materiaal, status, datum
- Sorteren op alle kolommen

## Modelbronlinks

Als de print werd gestart vanuit MakerWorld, wordt er een directe link naar de modelpagina weergegeven. Klik op de modelnaam om MakerWorld in een nieuw tabblad te openen.

:::info Bambu Cloud
Modelnlinks en miniaturen vereisen Bambu Cloud-integratie. Zie [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Filamenttracking

Voor elke print wordt het volgende geregistreerd:

- **Materiaal** — PLA, PETG, ABS, enz.
- **Gram gebruikt** — geschat verbruik
- **Spoel** — welke spoel werd gebruikt (indien geregistreerd in de opslag)
- **Kleur** — de hexcode van de kleur

Dit geeft een nauwkeurig beeld van het filamentverbruik over tijd en helpt u bij het plannen van aankopen.

## Statistieken

Onder **Geschiedenis → Statistieken** vindt u geaggregeerde data:

- **Totaal aantal prints** — en slagingspercentage
- **Totale printtijd** — uren en dagen
- **Filamentverbruik** — gram en km per materiaal
- **Prints per dag** — scrollende grafiek
- **Meest gebruikte materialen** — cirkeldiagram
- **Printlengteverdeling** — histogram

De statistieken kunnen worden gefilterd op tijdsperiode (7d, 30d, 90d, 1 jaar, alles).

## Exporteren

### CSV-export
Exporteer de volledige geschiedenis of gefilterde resultaten:
**Geschiedenis → Exporteren → CSV downloaden**

CSV-bestanden bevatten alle kolommen en kunnen worden geopend in Excel, LibreOffice Calc of worden geïmporteerd in andere tools.

### Automatische back-up
De geschiedenis maakt deel uit van de SQLite-database die automatisch wordt geback-upt bij updates. Handmatige back-up via **Instellingen → Back-up**.

## Bewerken

U kunt printlogvermeldingen achteraf bewerken:

- Modelnaam corrigeren
- Notities toevoegen
- Filamentverbruik corrigeren
- Foutief geregistreerde prints verwijderen

Klik rechts op een rij en selecteer **Bewerken** of klik op het potloodpictogram.
