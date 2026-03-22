---
sidebar_position: 2
title: Foutlogboek
description: Volledig overzicht van HMS-foutcodes van de printers met ernstniveau, zoekfunctie en koppelingen naar de Bambu Wiki
---

# Foutlogboek

Het foutlogboek verzamelt alle fouten en HMS-meldingen (Health, Maintenance, Safety) van uw printers. Bambu Dashboard heeft een ingebouwde database met 269+ HMS-codes voor Bambu Lab-printers.

Ga naar: **https://localhost:3443/#errors**

## HMS-codes

Bambu Lab-printers sturen HMS-codes via MQTT wanneer er iets mis is. Bambu Dashboard vertaalt deze automatisch naar leesbare foutmeldingen:

| Code | Voorbeeld | Categorie |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Spuit/extruder |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Printbed |
| `0700 0500 0001 0001` | MC disconnect | Elektronica |

De volledige lijst dekt alle 269+ bekende codes voor X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D en H2C.

## Ernstniveaus

Fouten worden ingedeeld in vier niveaus:

| Niveau | Kleur | Beschrijving |
|---|---|---|
| **Kritiek** | Rood | Onmiddellijke actie vereist — print gestopt |
| **Hoog** | Oranje | Snel afhandelen — print kan doorgaan |
| **Gemiddeld** | Geel | Onderzoeken — geen direct gevaar |
| **Info** | Blauw | Informatiemelding, geen actie nodig |

## Zoeken en filteren

Gebruik de werkbalk bovenaan het foutlogboek:

1. **Vrije tekst zoeken** — zoek in foutmelding, HMS-code of printerbeschrijving
2. **Printer** — toon alleen fouten van één printer
3. **Categorie** — AMS / Spuit / Bed / Elektronica / Kalibratie / Overig
4. **Ernstniveau** — Alle / Kritiek / Hoog / Gemiddeld / Info
5. **Datum** — filter op datumperiode
6. **Onbevestigd** — toon alleen fouten die nog niet zijn bevestigd

Klik **Filter wissen** om alle fouten te zien.

## Wiki-koppelingen

Voor elke HMS-code wordt een koppeling naar de Bambu Lab Wiki getoond met:

- Volledige foutbeschrijving
- Mogelijke oorzaken
- Stap-voor-stap probleemoplossingsgids
- Officiële aanbevelingen van Bambu Lab

Klik **Wiki openen** bij een foutvermelding om de betreffende wiki-pagina in een nieuw tabblad te openen.

:::tip Lokale kopie
Bambu Dashboard slaat de wiki-inhoud lokaal op voor offline gebruik. De inhoud wordt wekelijks automatisch bijgewerkt.
:::

## Fouten bevestigen

Bevestiging markeert een fout als afgehandeld zonder deze te verwijderen:

1. Klik op een fout in de lijst
2. Klik **Bevestigen** (vinkje-icoon)
3. Voer een optionele opmerking in over wat er is gedaan
4. De fout wordt gemarkeerd met een vinkje en verplaatst naar de lijst «Bevestigd»

### Bulkbevestiging

1. Selecteer meerdere fouten met selectievakjes
2. Klik **Geselecteerde bevestigen**
3. Alle geselecteerde fouten worden tegelijk bevestigd

## Statistieken

Bovenaan het foutlogboek wordt weergegeven:

- Totaal aantal fouten in de afgelopen 30 dagen
- Aantal onbevestigde fouten
- Meest voorkomende HMS-code
- Printer met de meeste fouten

## Exporteren

1. Klik **Exporteren** (download-icoon)
2. Kies formaat: **CSV** of **JSON**
3. Het filter wordt toegepast op de export — stel het gewenste filter eerst in
4. Het bestand wordt automatisch gedownload

## Meldingen voor nieuwe fouten

Activeer meldingen voor nieuwe HMS-fouten:

1. Ga naar **Instellingen → Meldingen**
2. Vink **Nieuwe HMS-fouten** aan
3. Kies het minimale ernstniveau voor meldingen (aanbevolen: **Hoog** en hoger)
4. Kies het meldingskanaal

Zie [Meldingen](../funksjoner/notifications) voor kanalinstellingen.
