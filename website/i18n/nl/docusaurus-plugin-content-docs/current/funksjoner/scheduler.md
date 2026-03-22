---
sidebar_position: 4
title: Planner
description: Plan prints, beheer de printwachtrij en stel automatische verzending in
---

# Planner

De planner laat u printtaken organiseren en automatiseren met een kalenderweergave en een intelligente printwachtrij.

## Kalenderweergave

De kalenderweergave geeft een overzicht van alle geplande en voltooide prints:

- **Maand-, week- en dagweergave** — kies het detailniveau
- **Kleurcodering** — verschillende kleuren per printer en status
- **Klik op een gebeurtenis** — zie details over de print

Voltooide prints worden automatisch weergegeven op basis van de printgeschiedenis.

## Printwachtrij

Met de printwachtrij kunt u taken in een rij zetten die in volgorde naar de printer worden gestuurd:

### Een taak aan de wachtrij toevoegen

1. Klik op **+ Taak toevoegen**
2. Selecteer een bestand (van printer SD, lokale upload of FTP)
3. Stel de prioriteit in (hoog, normaal, laag)
4. Kies de doelprinter (of "automatisch")
5. Klik op **Toevoegen**

### Wachtrijbeheer

| Actie | Beschrijving |
|----------|-------------|
| Slepen en neerzetten | Volgorde wijzigen |
| Wachtrij pauzeren | Verzending tijdelijk stoppen |
| Overslaan | Volgende taak verzenden zonder te wachten |
| Verwijderen | Taak uit de wachtrij verwijderen |

:::tip Multi-printer dispatch
Met meerdere printers kan de wachtrij taken automatisch verdelen over beschikbare printers. Activeer **Automatische verzending** via **Planner → Instellingen**.
:::

## Geplande prints

Stel prints in die op een bepaald tijdstip moeten starten:

1. Klik op **+ Print plannen**
2. Selecteer bestand en printer
3. Stel het starttijdstip in
4. Configureer meldingen (optioneel)
5. Opslaan

:::warning Printer moet beschikbaar zijn
Geplande prints starten alleen als de printer op het ingestelde tijdstip in de stand-by modus is. Als de printer bezet is, wordt de start verschoven naar het eerstvolgende beschikbare moment (configureerbaar).
:::

## Lastbalancering

Met automatische lastbalancering worden taken intelligent verdeeld over printers:

- **Round-robin** — gelijkmatige verdeling over alle printers
- **Minst bezet** — stuur naar de printer met de kortste geschatte eindtijd
- **Handmatig** — u kiest zelf voor elke taak de printer

Configureer via **Planner → Lastbalancering**.

## Meldingen

De planner integreert met meldingskanalen:

- Melding wanneer een taak start
- Melding wanneer een taak klaar is
- Melding bij fout of vertraging

Zie [Functieoverzicht](./oversikt#meldingen) voor het configureren van meldingskanalen.
