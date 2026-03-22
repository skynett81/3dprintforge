---
sidebar_position: 6
title: Meerdere printers
description: Stel meerdere Bambu-printers in en beheer ze in Bambu Dashboard — vlootoverzicht, wachtrij en gespreide start
---

# Meerdere printers

Heb je meer dan één printer? Bambu Dashboard is gebouwd voor vlootbeheer — je kunt alle printers vanaf één plek bewaken, besturen en coördineren.

## Een nieuwe printer toevoegen

1. Ga naar **Instellingen → Printers**
2. Klik **+ Printer toevoegen**
3. Vul in:

| Veld | Voorbeeld | Uitleg |
|------|-----------|--------|
| Serienummer (SN) | 01P... | Te vinden in Bambu Handy of op het scherm van de printer |
| IP-adres | 192.168.1.101 | Voor LAN-modus (aanbevolen) |
| Toegangscode | 12345678 | 8-cijferige code op het scherm van de printer |
| Naam | "Bambu #2 - P1S" | Wordt weergegeven in het dashboard |
| Model | P1P, P1S, X1C, A1 | Kies het juiste model voor de juiste pictogrammen en functies |

4. Klik **Verbinding testen** — je zou een groene status moeten zien
5. Klik **Opslaan**

:::tip Geef printers beschrijvende namen
"Bambu 1" en "Bambu 2" zijn verwarrend. Gebruik namen zoals "X1C - Productie" en "P1S - Prototypes" om het overzicht te bewaren.
:::

## Het vlootoverzicht

Nadat alle printers zijn toegevoegd, worden ze samen weergegeven in het **Vloot**-paneel. Hier zie je:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Productie │  │ P1S - Prototypes│  │ A1 - Hobbyruimte│
│ ████████░░ 82%  │  │ Beschikbaar     │  │ ████░░░░░░ 38%  │
│ 1u 24m resterend│  │ Klaar om te     │  │ 3u 12m resterend│
│ Temp: 220/60°C  │  │ printen         │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Je kunt:
- Klikken op een printer voor gedetailleerde weergave
- Alle temperaturen, AMS-status en actieve fouten in één oogopslag zien
- Filteren op status (actieve prints, beschikbaar, fouten)

## Printwachtrij — werk verdelen

De printwachtrij laat je prints voor alle printers vanuit één plek plannen.

**Zo werkt het:**
1. Ga naar **Wachtrij**
2. Klik **+ Taak toevoegen**
3. Kies bestand en instellingen
4. Kies printer, of kies **Automatische toewijzing**

### Automatische toewijzing
Met automatische toewijzing kiest het dashboard een printer op basis van:
- Beschikbare capaciteit
- Filament beschikbaar in AMS
- Geplande onderhoudsvensters

Activeer onder **Instellingen → Wachtrij → Automatische toewijzing**.

### Prioritering
Sleep taken in de wachtrij om de volgorde te wijzigen. Een taak met **Hoge prioriteit** gaat voor gewone taken.

## Gespreide start — stroompieken vermijden

Als je veel printers tegelijk start, kan de opwarmfase een sterke stroompiek veroorzaken. Gespreide start spreidt het opstarten:

**Zo activeer je het:**
1. Ga naar **Instellingen → Vloot → Gespreide start**
2. Activeer **Verdeelde opstart**
3. Stel de vertraging tussen printers in (aanbevolen: 2–5 minuten)

**Voorbeeld met 3 printers en 3 minuten vertraging:**
```
08:00 — Printer 1 begint opwarmen
08:03 — Printer 2 begint opwarmen
08:06 — Printer 3 begint opwarmen
```

:::tip Relevant voor zekeringen
Een X1C verbruikt ca. 1000W tijdens het opwarmen. Drie printers tegelijk = 3000W, wat de 16A-zekering kan doen springen. Gespreide start elimineert dit probleem.
:::

## Printergroepen

Printergroepen laten je printers logisch organiseren en commando's naar de hele groep sturen:

**Een groep aanmaken:**
1. Ga naar **Instellingen → Printergroepen**
2. Klik **+ Nieuwe groep**
3. Geef de groep een naam (bijv. "Productievloer", "Hobbyruimte")
4. Voeg printers toe aan de groep

**Groepsfuncties:**
- Gecombineerde statistieken voor de groep bekijken
- Pauzecommando naar de hele groep tegelijk sturen
- Onderhoudsvenster voor de groep instellen

## Alle printers bewaken

### Meervoudige cameraweergave
Ga naar **Vloot → Cameraweergave** om alle camera-feeds naast elkaar te bekijken:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [Live]      │  │  [Beschikb.] │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Toevoegen │
│  [Live]      │  │              │
└──────────────┘  └──────────────┘
```

### Meldingen per printer
Je kunt verschillende meldingsregels configureren voor verschillende printers:
- Productieprinter: altijd melden, inclusief 's nachts
- Hobbyprinter: alleen overdag melden

Zie [Meldingen](./varsler-oppsett) voor de instelling.

## Tips voor vlootbeheer

- **Standaardiseer filamentslots**: Houd PLA wit in slot 1, PLA zwart in slot 2 op alle printers — dan is taakverdeling eenvoudiger
- **Controleer AMS-niveaus dagelijks**: Zie [Dagelijks gebruik](./daglig-bruk) voor de ochtendroutine
- **Onderhoud bij toerbeurt**: Onderhoud niet alle printers tegelijk — houd altijd minimaal één actief
- **Geef bestanden duidelijke namen**: Bestandsnamen als `logo_x1c_pla_0.2mm.3mf` maken het gemakkelijk de juiste printer te kiezen
