---
sidebar_position: 7
title: Rapporten
description: Automatische wekelijkse en maandelijkse e-mailrapporten met statistieken, activiteitssamenvatting en onderhoudsherinneringen
---

# Rapporten

3DPrintForge kan automatische e-mailrapporten sturen met statistieken en activiteitssamenvatting — wekelijks, maandelijks of beide.

Ga naar: **https://localhost:3443/#settings** → **Systeem → Rapporten**

## Vereisten

Rapporten vereisen dat e-mailmeldingen zijn geconfigureerd. Stel SMTP in via **Instellingen → Meldingen → E-mail** vóór u rapporten activeert. Zie [Meldingen](../features/notifications).

## Automatische rapporten activeren

1. Ga naar **Instellingen → Rapporten**
2. Activeer **Wekelijks rapport** en/of **Maandelijks rapport**
3. Kies **Verzendtijdstip**:
   - Wekelijks: dag van de week en tijdstip
   - Maandelijks: dag van de maand (bijv. 1e maandag / laatste vrijdag)
4. Vul het **Ontvangers-e-mailadres** in (kommagescheiden voor meerdere)
5. Klik **Opslaan**

Stuur een testrapport om de opmaak te bekijken: klik **Nu testrapport verzenden**.

## Inhoud van het wekelijks rapport

Het wekelijkse rapport dekt de afgelopen 7 dagen:

### Samenvatting
- Totaal aantal prints
- Aantal geslaagd / mislukt / afgebroken
- Succespercentage en wijziging ten opzichte van vorige week
- Meest actieve printer

### Activiteit
- Prints per dag (minigrafiek)
- Totale printuren
- Totaal filamentverbruik (gram en kostprijs)

### Filament
- Verbruik per materiaal en leverancier
- Geschatte resterende hoeveelheid per spoel (spoelen onder 20 % gemarkeerd)

### Onderhoud
- Onderhoudstaken uitgevoerd deze week
- Vervallen onderhoudstaken (rode waarschuwing)
- Taken die volgende week vervallen

### HMS-fouten
- Aantal HMS-fouten deze week per printer
- Onbevestigde fouten (vereisen aandacht)

## Inhoud van het maandelijks rapport

Het maandelijkse rapport dekt de afgelopen 30 dagen en bevat alles uit het wekelijkse rapport, plus:

### Trend
- Vergelijking met vorige maand (%)
- Activiteitskaart (heatmap-miniatuur voor de maand)
- Maandelijkse ontwikkeling van het succespercentage

### Kosten
- Totale filamentkosten
- Totale stroomkosten (als stroommeeting is geconfigureerd)
- Totale slijtagekosten
- Gecombineerde onderhoudskosten

### Slijtage en gezondheid
- Gezondheidsscore per printer (met wijziging ten opzichte van vorige maand)
- Componenten die de vervangingsdatum naderen

### Statistieken hoogtepunten
- Langste geslaagde print
- Meest gebruikte filamenttype
- Printer met hoogste activiteit

## Rapport aanpassen

1. Ga naar **Instellingen → Rapporten → Aanpassen**
2. Vink secties aan/uit die u wilt opnemen
3. Kies **Printerfilter**: alle printers of een selectie
4. Kies **Logo weergeven**: 3DPrintForge-logo in de koptekst weergeven of uitschakelen
5. Klik **Opslaan**

## Rapportarchief

Alle verzonden rapporten worden opgeslagen en kunnen opnieuw worden geopend:

1. Ga naar **Instellingen → Rapporten → Archief**
2. Kies een rapport uit de lijst (gesorteerd op datum)
3. Klik **Openen** om de HTML-versie te bekijken
4. Klik **PDF downloaden** om het rapport te downloaden

Rapporten worden automatisch verwijderd na **90 dagen** (configureerbaar).
