---
sidebar_position: 6
title: Foutpatroonanalyse
description: AI-gebaseerde analyse van foutpatronen, correlaties tussen fouten en omgevingsfactoren, en concrete verbeteringsvoorstellen
---

# Foutpatroonanalyse

De foutpatroonanalyse gebruikt historische gegevens van prints en fouten om patronen, oorzaken en correlaties te identificeren — en geeft u concrete verbeteringsvoorstellen.

Ga naar: **https://localhost:3443/#error-analysis**

## Wat wordt geanalyseerd

Het systeem analyseert de volgende datapunten:

- HMS-foutcodes en tijdstippen
- Filamenttype en leverancier bij fouten
- Temperatuur bij fouten (spuit, bed, kammer)
- Printsnelheid en -profiel
- Tijdstip van de dag en dag van de week
- Tijd since laatste onderhoud
- Printermodel en firmwareversie

## Correlatieanalyse

Het systeem zoekt naar statistische correlaties tussen fouten en factoren:

**Voorbeelden van gevonden correlaties:**
- «78 % van AMS-blokkeerfouten treedt op met filament van leverancier X»
- «Spuitverstoppingen komen 3× vaker voor na 6+ uur ononderbroken printen»
- «Hechtingsfouten nemen toe bij een kammertemperatuur onder 18°C»
- «Stringfouten correleren met een luchtvochtigheid boven 60 % (als hygrometer is aangesloten)»

Correlaties met statistische significantie (p < 0.05) worden bovenaan weergegeven.

:::info Datavereisten
De analyse is het nauwkeurigst met minimaal 50 prints in de geschiedenis. Met minder prints worden schattingen weergegeven met lage betrouwbaarheid.
:::

## Verbeteringsvoorstellen

Op basis van de analyses worden concrete voorstellen gegenereerd:

| Voorsteltype | Voorbeeld |
|---|---|
| Filament | «Wissel van leverancier voor PA-CF — 3 van 4 fouten gebruikten LeverancierX» |
| Temperatuur | «Verhoog bedtemperatuur met 5°C voor PETG — hechtingsfouten geschat 60 % minder» |
| Snelheid | «Verlaag snelheid naar 80 % na 4 uur — spuitblokkades geschat 45 % minder» |
| Onderhoud | «Reinig het extrudertandwiel — slijtage correleert met 40 % van extrusiefouten» |
| Kalibratie | «Voer bed leveling uit — 12 van 15 hechtingsfouten afgelopen week correleren met onjuiste kalibratie» |

Elk voorstel toont:
- Geschat effect (%-vermindering van fouten)
- Betrouwbaarheid (laag / gemiddeld / hoog)
- Stap-voor-stap implementatie
- Koppeling naar relevante documentatie

## Invloed op gezondheidsscore

De analyse is gekoppeld aan de gezondheidsscore (zie [Diagnostiek](./diagnostics)):

- Toont welke factoren de score het meest verlagen
- Schat de scoreverbetering bij het uitvoeren van elk voorstel
- Prioriteert voorstellen op potentiële scoreverbetering

## Tijdlijnweergave

Ga naar **Foutanalyse → Tijdlijn** voor een chronologisch overzicht:

1. Kies printer en tijdsperiode
2. Fouten worden als punten op de tijdlijn weergegeven, kleurgecodeerd per type
3. Horizontale lijnen markeren onderhoudstaken
4. Clusters van fouten (veel fouten in korte tijd) zijn gemarkeerd in rood

Klik op een cluster om de analyse van die specifieke periode te openen.

## Rapporten

Genereer een PDF-rapport van de foutanalyse:

1. Klik **Rapport genereren**
2. Kies tijdsperiode (bijv. afgelopen 90 dagen)
3. Kies inhoud: correlaties, voorstellen, tijdlijn, gezondheidsscore
4. Download PDF of stuur naar e-mailadres

Rapporten worden opgeslagen onder projecten als de printer aan een project is gekoppeld.

:::tip Wekelijkse beoordeling
Stel een automatisch wekelijks e-mailrapport in via **Instellingen → Rapporten** om op de hoogte te blijven zonder het dashboard handmatig te bezoeken. Zie [Rapporten](../system/reports).
:::
