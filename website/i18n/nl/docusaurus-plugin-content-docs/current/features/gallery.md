---
sidebar_position: 8
title: Galerij
description: Bekijk milestone-screenshots die automatisch worden gemaakt bij 25, 50, 75 en 100% voortgang voor alle prints
---

# Galerij

De galerij verzamelt automatisch gemaakte screenshots gedurende elke print. De afbeeldingen worden gemaakt bij vaste mijlpalen en geven u een visueel logboek van de voortgang van de print.

Ga naar: **https://localhost:3443/#gallery**

## Milestone-screenshots

3DPrintForge maakt automatisch een screenshot van de camera bij de volgende mijlpalen:

| Mijlpaal | Tijdstip |
|---|---|
| **25 %** | Een kwart door de print |
| **50 %** | Halverwege |
| **75 %** | Driekwart door |
| **100 %** | Print voltooid |

Screenshots worden opgeslagen en gekoppeld aan de betreffende printgeschiedenisvermelding en weergegeven in de galerij.

:::info Vereisten
Milestone-screenshots vereisen dat de camera verbonden en actief is. Uitgeschakelde camera's genereren geen afbeeldingen.
:::

## Screenshotfunctie activeren

1. Ga naar **Instellingen → Galerij**
2. Schakel **Automatische milestone-screenshots** in
3. Kies welke mijlpalen u wilt activeren (alle vier zijn standaard ingeschakeld)
4. Kies **Beeldkwaliteit**: Laag (640×360) / Medium (1280×720) / Hoog (1920×1080)
5. Klik op **Opslaan**

## Afbeeldingen bekijken

De galerij is per print georganiseerd:

1. Gebruik het **filter** bovenaan om een printer, datum of bestandsnaam te selecteren
2. Klik op een printrij om uit te klappen en alle vier afbeeldingen te zien
3. Klik op een afbeelding om de voorvertoning te openen

### Voorvertoning

De voorvertoning toont:
- Afbeelding op volledige grootte
- Mijlpaal en tijdstempel
- Printnaam en printer
- **←** / **→** om door afbeeldingen van dezelfde print te bladeren

## Volledig scherm

Klik op **Volledig scherm** (of druk op `F`) in de voorvertoning om het hele scherm te vullen. Gebruik de pijltoetsen om door afbeeldingen te bladeren.

## Afbeeldingen downloaden

- **Enkele afbeelding**: Klik op **Downloaden** in de voorvertoning
- **Alle afbeeldingen van een print**: Klik op **Alles downloaden** op de printrij — u krijgt een `.zip`-bestand
- **Meerdere selecteren**: Vink de selectievakjes aan en klik op **Geselecteerde downloaden**

## Afbeeldingen verwijderen

:::warning Opslagruimte
Galerijafbeeldingen kunnen na verloop van tijd aanzienlijk veel ruimte innemen. Stel automatisch verwijderen in voor oude afbeeldingen.
:::

### Handmatig verwijderen

1. Selecteer één of meer afbeeldingen (vink aan)
2. Klik op **Geselecteerde verwijderen**
3. Bevestig in het dialoogvenster

### Automatisch opruimen

1. Ga naar **Instellingen → Galerij → Automatisch opruimen**
2. Activeer **Afbeeldingen ouder dan verwijderen**
3. Stel het aantal dagen in (bijv. 90 dagen)
4. Opruimen wordt elke nacht automatisch uitgevoerd om 03:00

## Koppeling met printgeschiedenis

Elke afbeelding is gekoppeld aan een printvermelding in de geschiedenis:

- Klik op **Bekijken in geschiedenis** op een print in de galerij om naar de geschiedenisvermelding te springen
- In de geschiedenis wordt een miniatuur van de 100%-afbeelding weergegeven als die beschikbaar is

## Delen

Deel een galerijafbeelding via een tijdbeperkte link:

1. Open de afbeelding in de voorvertoning
2. Klik op **Delen**
3. Kies de vervaltijd en kopieer de link
