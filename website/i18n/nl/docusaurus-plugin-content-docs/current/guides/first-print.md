---
sidebar_position: 1
title: Je eerste print
description: Stap-voor-stap handleiding om je eerste 3D-print te starten en te bewaken in Bambu Dashboard
---

# Je eerste print

Deze handleiding neemt je mee door het hele proces — van een aangesloten printer naar een voltooide print — met Bambu Dashboard als controlecentrum.

## Stap 1 — Controleer of de printer is verbonden

Als je het dashboard opent, zie je de statuskaart van je printer bovenaan de zijbalk of op het overzichtspaneel.

**Groene status** betekent dat de printer online en klaar is.

| Status | Kleur | Betekenis |
|--------|-------|-----------|
| Online | Groen | Klaar om te printen |
| Inactief | Grijs | Verbonden, maar niet actief |
| Bezig | Blauw | Print loopt |
| Fout | Rood | Vereist aandacht |

Als de printer een rode status toont:
1. Controleer of de printer is ingeschakeld
2. Verifieer dat deze is verbonden met hetzelfde netwerk als het dashboard
3. Ga naar **Instellingen → Printers** en bevestig het IP-adres en de toegangscode

:::tip Gebruik LAN-modus voor snellere respons
LAN-modus biedt lagere vertraging dan cloud-modus. Activeer dit in de printerinstellingen als de printer en het dashboard op hetzelfde netwerk zijn.
:::

## Stap 2 — Upload je model

Bambu Dashboard start geen prints rechtstreeks — dat is de taak van Bambu Studio of MakerWorld. Het dashboard neemt het over zodra de print begint.

**Via Bambu Studio:**
1. Open Bambu Studio op je pc
2. Importeer of open je `.stl`- of `.3mf`-bestand
3. Slice het model (kies filament, supports, infill, enz.)
4. Klik **Printen** rechtsboven

**Via MakerWorld:**
1. Vind het model op [makerworld.com](https://makerworld.com)
2. Klik **Printen** direct op de website
3. Bambu Studio opent automatisch met het model klaar

## Stap 3 — Start de print

In Bambu Studio kies je de verzendmethode:

| Methode | Vereiste | Voordelen |
|---------|----------|-----------|
| **Cloud** | Bambu-account + internet | Werkt overal |
| **LAN** | Hetzelfde netwerk | Sneller, geen cloud |
| **SD-kaart** | Fysieke toegang | Geen netwerkvereisten |

Klik **Verzenden** — de printer ontvangt de taak en begint automatisch de opwarmfase.

:::info De print verschijnt in het dashboard
Binnen enkele seconden nadat Bambu Studio de taak verstuurt, verschijnt de actieve print in het dashboard onder **Actieve print**.
:::

## Stap 4 — Bewaken in het dashboard

Wanneer de print loopt, geeft het dashboard je een volledig overzicht:

### Voortgang
- Percentage voltooid en geschatte resterende tijd worden weergegeven op de printerkaart
- Klik op de kaart voor gedetailleerde weergave met laaginfo

### Temperaturen
Het detailpaneel toont realtime temperaturen:
- **Nozzle** — huidige en doeltemperatuur
- **Bouwplaat** — huidige en doeltemperatuur
- **Kamer** — ruimtetemperatuur binnen in de printer (belangrijk voor ABS/ASA)

### Camera
Klik op het camerapictogram op de printerkaart om de live feed direct in het dashboard te bekijken. Je kunt de camera openhouden in een apart venster terwijl je andere dingen doet.

:::warning Controleer de eerste lagen
De eerste 3–5 lagen zijn kritiek. Slechte hechting nu betekent een mislukte print later. Bekijk de camera en verifieer dat het filament netjes en gelijkmatig wordt neergelegd.
:::

### Print Guard
Bambu Dashboard heeft een AI-aangedreven **Print Guard** die automatisch spaghetti-fouten detecteert en de print kan pauzeren. Activeer dit onder **Bewaking → Print Guard**.

## Stap 5 — Na de print

Als de print klaar is, toont het dashboard een voltooiingsmelding (en stuurt een melding als je [meldingen](./notification-setup) hebt ingesteld).

### Controleer de geschiedenis
Ga naar **Geschiedenis** in de zijbalk om de voltooide print te bekijken:
- Totale printtijd
- Filamentverbruik (gram gebruikt, geschatte kosten)
- Fouten of HMS-gebeurtenissen tijdens de print
- Cameraopname bij afsluiting (indien ingeschakeld)

### Voeg een notitie toe
Klik op de print in de geschiedenis en voeg een notitie toe — bijv. "Iets meer brim nodig" of "Perfect resultaat". Dit is handig wanneer je later hetzelfde model print.

### Controleer het filamentverbruik
Onder **Filament** kun je zien dat het spoelgewicht is bijgewerkt op basis van wat er is verbruikt. Het dashboard trekt dit automatisch af.

## Tips voor beginners

:::tip Verlaat de eerste print niet
Houd de eerste 10–15 minuten in de gaten. Als je er zeker van bent dat de print goed hecht, kun je het dashboard de rest laten bewaken.
:::

- **Weeg lege spoelen** — voer het startgewicht van spoelen in voor nauwkeurige restberekening (zie [Filamentbeheer](./filament-setup))
- **Stel Telegram-meldingen in** — ontvang een bericht als de print klaar is zonder te hoeven wachten (zie [Meldingen](./notification-setup))
- **Controleer de bouwplaat** — schone plaat = betere hechting. Veeg af met IPA (isopropanol) tussen prints
- **Gebruik de juiste plaat** — zie [De juiste bouwplaat kiezen](./choosing-plate) voor wat past bij jouw filament
