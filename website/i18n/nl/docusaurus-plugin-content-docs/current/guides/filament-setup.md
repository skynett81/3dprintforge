---
sidebar_position: 2
title: Filamentbeheer instellen
description: Hoe je filamentspolen aanmaakt, configureert en bijhoudt in Bambu Dashboard
---

# Filamentbeheer instellen

Het filamentbeheer in Bambu Dashboard geeft je volledig overzicht over al je spoelen — wat er nog is, wat je hebt verbruikt, en welke spoelen momenteel in de AMS zitten.

## Automatisch aanmaken vanuit AMS

Als je een printer met AMS verbindt, leest het dashboard automatisch informatie uit de RFID-chips op Bambu-spoelen:

- Filamenttype (PLA, PETG, ABS, TPU, enz.)
- Kleur (met kleurhex)
- Merk (Bambu Lab)
- Spoelgewicht en resterende hoeveelheid

**Deze spoelen worden automatisch aangemaakt in de voorraad** — je hoeft niets te doen. Bekijk ze onder **Filament → Voorraad**.

:::info Alleen Bambu-spoelen hebben RFID
Spoelen van derden (bijv. eSUN, Polymaker, Bambu-refill zonder chip) worden niet automatisch herkend. Deze moeten handmatig worden toegevoegd.
:::

## Handmatig spoelen toevoegen

Voor spoelen zonder RFID, of voor spoelen die niet in de AMS zitten:

1. Ga naar **Filament → Voorraad**
2. Klik **+ Nieuwe spoel** rechtsboven
3. Vul de velden in:

| Veld | Voorbeeld | Verplicht |
|------|-----------|-----------|
| Merk | eSUN, Polymaker, Bambu | Ja |
| Type | PLA, PETG, ABS, TPU | Ja |
| Kleur | #FF5500 of kies uit kleurwiel | Ja |
| Startgewicht | 1000 g | Aanbevolen |
| Resterend | 850 g | Aanbevolen |
| Diameter | 1,75 mm | Ja |
| Notitie | "Gekocht 2025-01, werkt goed" | Optioneel |

4. Klik **Opslaan**

## Kleuren en merken configureren

Je kunt een spoel op elk moment bewerken door erop te klikken in het voorraadoverzicht:

- **Kleur** — Kies uit het kleurwiel of voer een hexwaarde in. De kleur wordt gebruikt als visuele markering in het AMS-overzicht
- **Merk** — Wordt weergegeven in statistieken en filtering. Maak eigen merken aan onder **Filament → Merken**
- **Temperatuurprofiel** — Voer de aanbevolen nozzle- en plaattemperatuur van de filamentproducent in. Het dashboard kan dan waarschuwen als je de verkeerde temperatuur kiest

## AMS-synchronisatie begrijpen

Het dashboard synchroniseert de AMS-status in realtime:

```
AMS Slot 1 → Spoel: Bambu PLA Wit   [███████░░░] 72% resterend
AMS Slot 2 → Spoel: eSUN PETG Grijs [████░░░░░░] 41% resterend
AMS Slot 3 → (leeg)
AMS Slot 4 → Spoel: Bambu PLA Rood  [██████████] 98% resterend
```

De synchronisatie wordt bijgewerkt:
- **Tijdens het printen** — verbruik wordt in realtime afgetrokken
- **Bij het einde van de print** — definitief verbruik wordt gelogd in de geschiedenis
- **Handmatig** — klik op het synchronisatiepictogram op een spoel om bijgewerkte gegevens uit de AMS op te halen

:::tip AMS-schatting corrigeren
De AMS-schatting van RFID is niet altijd 100% nauwkeurig na het eerste gebruik. Weeg de spoel en werk het gewicht handmatig bij voor de beste precisie.
:::

## Verbruik en resterende hoeveelheid controleren

### Per spoel
Klik op een spoel in de voorraad om te zien:
- Totaal verbruikt (gram, alle prints)
- Geschatte resterende hoeveelheid
- Lijst van alle prints waarbij deze spoel is gebruikt

### Gecombineerde statistieken
Onder **Analyse → Filamentanalyse** zie je:
- Verbruik per filamenttype over tijd
- Welke merken je het meest gebruikt
- Geschatte kosten op basis van aankoopprijs per kg

### Meldingen bij laag niveau
Stel meldingen in wanneer een spoel bijna leeg is:

1. Ga naar **Filament → Instellingen**
2. Activeer **Melding bij laag voorraadniveau**
3. Stel de drempelwaarde in (bijv. 100 g resterend)
4. Kies het meldingskanaal (Telegram, Discord, e-mail)

## Tip: Weeg spoelen voor nauwkeurigheid

De schattingen van AMS en printstatistieken zijn nooit helemaal exact. De meest nauwkeurige methode is om de spoel zelf te wegen:

**Zo doe je het:**

1. Vind het taragewicht (lege spoel) — gewoonlijk 200–250 g, controleer de website van de fabrikant of de onderkant van de spoel
2. Weeg de spoel met filament op een keukenweegschaal
3. Trek het taragewicht af
4. Werk **Resterend** bij in het spoelprofiel

**Voorbeeld:**
```
Gewogen gewicht:  743 g
Tara (leeg):    - 230 g
Filament over:    513 g
```

:::tip Spoeletiketgenerator
Onder **Hulpmiddelen → Etiketten** kun je etiketten met QR-code voor je spoelen afdrukken. Scan de code met je telefoon om snel het spoelprofiel te openen.
:::
