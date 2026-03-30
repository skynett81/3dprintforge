---
sidebar_position: 3
title: Filamentanalyse
description: Gedetailleerde analyse van filamentverbruik, kosten, prognoses, verbruiksraten en verspilling per materiaal en leverancier
---

# Filamentanalyse

De filamentanalyse geeft u volledig inzicht in uw filamentverbruik — wat u gebruikt, wat het kost en wat u kunt besparen.

Ga naar: **https://localhost:3443/#filament-analytics**

## Verbruiksoverzicht

Bovenaan wordt een samenvatting getoond voor de geselecteerde periode:

- **Totaal verbruik** — gram en meter voor alle materialen
- **Geschatte kosten** — op basis van de geregistreerde prijs per spoel
- **Meest gebruikt materiaal** — type en leverancier
- **Hergebruikspercentage** — aandeel filament in het feitelijke model vs. ondersteuning/purge

### Verbruik per materiaal

Cirkeldiagram en tabel tonen de verdeling tussen materialen:

| Kolom | Beschrijving |
|---|---|
| Materiaal | PLA, PETG, ABS, PA, enz. |
| Leverancier | Bambu Lab, PolyMaker, Prusament, enz. |
| Gram gebruikt | Totaal gewicht |
| Meter | Geschatte lengte |
| Kosten | Gram × prijs per gram |
| Prints | Aantal prints met dit materiaal |

Klik op een rij om in te zoomen op het niveau van individuele spoelen.

## Verbruiksraten

De verbruiksrate toont het gemiddelde filamentverbruik per tijdseenheid:

- **Gram per uur** — tijdens actief printen
- **Gram per week** — inclusief printer-stilstand
- **Gram per print** — gemiddelde per afdruk

Deze worden gebruikt om prognoses te berekenen voor toekomstige behoeften.

:::tip Inkoopplanning
Gebruik de verbruiksrate voor het plannen van spoelvoorraden. Het systeem waarschuwt automatisch wanneer de geschatte voorraad binnen 14 dagen leeg zal raken (configureerbaar).
:::

## Kostenprognose

Op basis van de historische verbruiksrate wordt het volgende berekend:

- **Geschat verbruik komende 30 dagen** (gram per materiaal)
- **Geschatte kosten komende 30 dagen**
- **Aanbevolen voorraadniveau** (voldoende voor 30 / 60 / 90 dagen gebruik)

De prognose houdt rekening met seizoensvariaties als u data heeft van minstens één jaar.

## Verspilling en efficiëntie

Zie [Verspillingstracking](./waste) voor volledige documentatie. De filamentanalyse toont een samenvatting:

- **AMS-purge** — gram en aandeel van het totale verbruik
- **Ondersteuningsmateriaal** — gram en aandeel
- **Feitelijk modelmateriaal** — resterend aandeel (efficiëntie %)
- **Geschatte kosten voor verspilling** — wat de verspilling u kost

## Spoellog

Alle spoelen (actief en leeg) worden geregistreerd:

| Veld | Beschrijving |
|---|---|
| Spoelnaam | Materiaalnaam en kleur |
| Oorspronkelijk gewicht | Geregistreerd gewicht bij aanvang |
| Resterend gewicht | Berekend resterend gewicht |
| Gebruikt | Gram totaal gebruikt |
| Laatst gebruikt | Datum van de laatste print |
| Status | Actief / Leeg / Opgeslagen |

## Prijsregistratie

Voor nauwkeurige kostenanalyse registreert u prijzen per spoel:

1. Ga naar **Filamentopslag**
2. Klik op een spoel → **Bewerken**
3. Vul **Aankoopprijs** en **Gewicht bij aankoop** in
4. Het systeem berekent de prijs per gram automatisch

Spoelen zonder geregistreerde prijs gebruiken de **standaardprijs per gram** (instellen via **Instellingen → Filament → Standaardprijs**).

## Exporteren

1. Klik op **Filamentdata exporteren**
2. Selecteer periode en formaat (CSV / PDF)
3. CSV bevat één rij per print met gram, kosten en materiaal
