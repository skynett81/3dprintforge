---
sidebar_position: 5
title: Printwachtrij
description: Plan en automatiseer afdrukken met een geprioriteerde wachtrij, automatische verzending en gespreide start
---

# Printwachtrij

Met de printwachtrij kunt u afdrukken vooraf plannen en ze automatisch naar beschikbare printers sturen zodra deze inactief zijn.

Ga naar: **https://localhost:3443/#queue**

## Een wachtrij aanmaken

1. Ga naar **Printwachtrij** in het navigatiemenu
2. Klik op **Nieuwe taak** (+ pictogram)
3. Vul in:
   - **Bestandsnaam** — upload een `.3mf` of `.gcode`
   - **Doelprinter** — kies een specifieke printer of **Automatisch**
   - **Prioriteit** — Laag / Normaal / Hoog / Kritiek
   - **Geplande start** — nu of een bepaalde datum/tijd
4. Klik op **Aan wachtrij toevoegen**

:::tip Slepen en neerzetten
U kunt bestanden rechtstreeks vanuit de bestandsverkenner naar de wachtrijpagina slepen om ze snel toe te voegen.
:::

## Bestanden toevoegen

### Bestand uploaden

1. Klik op **Uploaden** of sleep een bestand naar het uploadveld
2. Ondersteunde formaten: `.3mf`, `.gcode`, `.bgcode`
3. Het bestand wordt opgeslagen in de bestandsbibliotheek en gekoppeld aan de wachtrijtaak

### Uit de bestandsbibliotheek

1. Ga naar **Bestandsbibliotheek** en zoek het bestand
2. Klik op **Aan wachtrij toevoegen** op het bestand
3. De taak wordt aangemaakt met standaardinstellingen — bewerk indien nodig

### Uit de geschiedenis

1. Open een eerdere print in **Geschiedenis**
2. Klik op **Opnieuw printen**
3. De taak wordt toegevoegd met dezelfde instellingen als de vorige keer

## Prioriteit

De wachtrij wordt verwerkt in volgorde van prioriteit:

| Prioriteit | Kleur | Beschrijving |
|---|---|---|
| Kritiek | Rood | Wordt naar de eerste beschikbare printer gestuurd, ongeacht andere taken |
| Hoog | Oranje | Voor normale en lage taken |
| Normaal | Blauw | Standaardvolgorde (FIFO) |
| Laag | Grijs | Wordt alleen verzonden als er geen hogere taken wachten |

Sleep taken in de wachtrij om de volgorde handmatig te wijzigen binnen hetzelfde prioriteitsniveau.

## Automatische verzending

Wanneer **Automatische verzending** is ingeschakeld, bewaakt Bambu Dashboard alle printers en stuurt de volgende taak automatisch:

1. Ga naar **Instellingen → Wachtrij**
2. Schakel **Automatische verzending** in
3. Kies de **Verzendstrategie**:
   - **Eerste beschikbare** — stuurt naar de eerste printer die beschikbaar wordt
   - **Minst gebruikt** — geeft prioriteit aan de printer met de minste prints vandaag
   - **Round-robin** — rouleert gelijkmatig tussen alle printers

:::warning Bevestiging
Activeer **Bevestiging vereisen** in de instellingen als u elke verzending handmatig wilt goedkeuren voordat het bestand wordt gestuurd.
:::

## Gespreide start

Gespreide start is handig om te voorkomen dat alle printers tegelijk starten en stoppen:

1. Vouw in het dialoogvenster **Nieuwe taak** **Geavanceerde instellingen** uit
2. Activeer **Gespreide start**
3. Stel de **Vertraging tussen printers** in (bijv. 30 minuten)
4. Het systeem verdeelt de starttijden automatisch

**Voorbeeld:** 4 identieke taken met 30 minuten vertraging starten om 08:00, 08:30, 09:00 en 09:30.

## Wachtrijstatus en opvolging

Het wachtrijoverzicht toont alle taken met hun status:

| Status | Beschrijving |
|---|---|
| Wachten | De taak staat in de wachtrij en wacht op een printer |
| Gepland | Heeft een gepland starttijdstip in de toekomst |
| Verzenden | Wordt overgebracht naar printer |
| Bezig met printen | Actief op de geselecteerde printer |
| Voltooid | Klaar — gekoppeld aan de geschiedenis |
| Mislukt | Fout bij verzenden of tijdens het printen |
| Afgebroken | Handmatig afgebroken |

:::info Meldingen
Activeer meldingen voor wachtrijgebeurtenissen via **Instellingen → Meldingen → Wachtrij** om een melding te ontvangen wanneer een taak start, voltooid is of mislukt. Zie [Meldingen](./notifications).
:::
