---
sidebar_position: 3
title: Printprofielen
description: Printprofielen aanmaken, bewerken en beheren met vooringestelde instellingen voor snel en consistent printen
---

# Printprofielen

Printprofielen zijn opgeslagen sets van printinstellingen die u kunt hergebruiken voor verschillende prints en printers. Bespaar tijd en zorg voor consistente kwaliteit door profielen te definiëren voor verschillende doeleinden.

Ga naar: **https://localhost:3443/#profiles**

## Een profiel aanmaken

1. Ga naar **Gereedschappen → Printprofielen**
2. Klik **Nieuw profiel** (+ icoon)
3. Vul in:
   - **Profielnaam** — beschrijvende naam, bijv. «PLA - Snelle productie»
   - **Materiaal** — kies uit de lijst (PLA / PETG / ABS / PA / PC / TPU / enz.)
   - **Printermodel** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Alle
   - **Beschrijving** — optionele tekst

4. Vul de instellingen in (zie secties hieronder)
5. Klik **Profiel opslaan**

## Instellingen in een profiel

### Temperatuur
| Veld | Voorbeeld |
|---|---|
| Spuittemperatuur | 220°C |
| Bedtemperatuur | 60°C |
| Kammertemperatuur (X1C) | 35°C |

### Snelheid
| Veld | Voorbeeld |
|---|---|
| Snelheidsinstelling | Standaard |
| Maximale snelheid (mm/s) | 200 |
| Versnelling | 5000 mm/s² |

### Kwaliteit
| Veld | Voorbeeld |
|---|---|
| Laagdikte | 0.2 mm |
| Vulpercentage | 15 % |
| Vulpatroon | Grid |
| Ondersteuningsmateriaal | Auto |

### AMS en kleuren
| Veld | Beschrijving |
|---|---|
| Zuiveringsvolume | Hoeveelheid spoelen bij kleurwisseling |
| Voorkeurssleuf | Welke AMS-sleuven de voorkeur hebben |

### Geavanceerd
| Veld | Beschrijving |
|---|---|
| Droogmodus | AMS-drogen activeren voor vochtige materialen |
| Koeltijd | Pauze tussen lagen voor afkoeling |
| Ventilatorsnelheid | Koelventilatornelheid in procent |

## Een profiel bewerken

1. Klik op het profiel in de lijst
2. Klik **Bewerken** (potlood-icoon)
3. Breng wijzigingen aan
4. Klik **Opslaan** (overschrijven) of **Opslaan als nieuw** (maakt een kopie)

:::tip Versiebeheer
Gebruik «Opslaan als nieuw» om een werkend profiel te bewaren terwijl u experimenteert met wijzigingen.
:::

## Een profiel gebruiken

### Vanuit de bestandsbibliotheek

1. Kies een bestand in de bibliotheek
2. Klik **Naar printer sturen**
3. Kies **Profiel** uit de keuzelijst
4. De instellingen uit het profiel worden gebruikt

### Vanuit de printwachtrij

1. Maak een nieuwe wachtrij-taak aan
2. Kies **Profiel** onder instellingen
3. Het profiel wordt gekoppeld aan de wachtrij-taak

## Profielen importeren en exporteren

### Exporteren
1. Selecteer één of meer profielen
2. Klik **Exporteren**
3. Kies formaat: **JSON** (voor import in andere dashboards) of **PDF** (voor afdrukken/documentatie)

### Importeren
1. Klik **Profielen importeren**
2. Kies een `.json`-bestand geëxporteerd vanuit een ander Bambu Dashboard
3. Bestaande profielen met dezelfde naam kunnen worden overschreven of beide worden bewaard

## Profielen delen

Deel profielen met anderen via de community-filamentmodule (zie [Community-filamenten](../integrations/community)) of via directe JSON-export.

## Standaardprofiel

Stel een standaardprofiel in per materiaal:

1. Kies het profiel
2. Klik **Instellen als standaard voor [materiaal]**
3. Het standaardprofiel wordt automatisch geselecteerd wanneer u een bestand met dat materiaal verzendt
