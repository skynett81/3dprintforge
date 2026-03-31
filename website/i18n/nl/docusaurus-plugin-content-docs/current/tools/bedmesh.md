---
sidebar_position: 6
title: Bed Mesh
description: 3D-visualisatie van de vlakheidskalibratie van het printbed met heatmap, scannen vanuit de UI en kalibratiebegeleiding
---

# Bed Mesh

Het bed mesh-gereedschap geeft u een visuele weergave van de vlakheid van het printbed — cruciaal voor goede hechting en een gelijkmatige eerste laag.

Ga naar: **https://localhost:3443/#bedmesh**

## Wat is bed mesh?

Bambu Lab-printers scannen het oppervlak van het printbed met een probe en maken een kaart (mesh) van hoogteverschillen. De firmware van de printer compenseert deze afwijkingen automatisch tijdens het printen. 3DPrintForge visualiseert deze kaart voor u.

## Visualisatie

### 3D-oppervlak

De bed mesh-kaart wordt weergegeven als een interactief 3D-oppervlak:

- Gebruik de muis om de weergave te draaien
- Scroll om in/uit te zoomen
- Klik **Bovenaanzicht** voor een vogelperspectief
- Klik **Zijaanzicht** om het profiel te zien

De kleurschaal toont afwijkingen van de gemiddelde hoogte:
- **Blauw** — lager dan centrum (concaaf)
- **Groen** — vrijwel vlak (< 0.1 mm afwijking)
- **Geel** — matige afwijking (0.1–0.2 mm)
- **Rood** — grote afwijking (> 0.2 mm)

### Heatmap

Klik **Heatmap** voor een platte 2D-weergave van de mesh-kaart — voor de meeste gebruikers eenvoudiger te lezen.

De heatmap toont:
- Exacte afwijkingswaarden (mm) voor elk meetpunt
- Gemarkeerde probleempunten (afwijking > 0.3 mm)
- Afmetingen van de metingen (aantal rijen × kolommen)

## Bed mesh scannen vanuit de UI

:::warning Vereisten
Het scannen vereist dat de printer inactief is en de bedtemperatuur gestabiliseerd is. Warm het bed op tot de gewenste temperatuur VÓÓR het scannen.
:::

1. Ga naar **Bed Mesh**
2. Kies een printer uit de keuzelijst
3. Klik **Nu scannen**
4. Kies bedtemperatuur voor het scannen:
   - **Koud** (kamertemperatuur) — snel, maar minder nauwkeurig
   - **Warm** (50–60°C PLA, 70–90°C PETG) — aanbevolen
5. Bevestig in het dialoogvenster — de printer start automatisch de probesequentie
6. Wacht tot de scan klaar is (3–8 minuten afhankelijk van mesh-grootte)
7. De nieuwe mesh-kaart wordt automatisch weergegeven

## Kalibratiebegeleiding

Na het scannen geeft het systeem concrete aanbevelingen:

| Bevinding | Aanbeveling |
|---|---|
| Afwijking < 0.1 mm overal | Uitstekend — geen actie nodig |
| Afwijking 0.1–0.2 mm | Goed — compensatie wordt door firmware afgehandeld |
| Afwijking > 0.2 mm in hoeken | Pas de bedveren handmatig aan (indien mogelijk) |
| Afwijking > 0.3 mm | Het bed kan beschadigd of onjuist gemonteerd zijn |
| Centrum hoger dan hoeken | Thermische uitzetting — normaal voor warme bedden |

:::tip Historische vergelijking
Klik **Vergelijken met vorige** om te zien of de mesh-kaart in de loop der tijd is veranderd — handig om geleidelijke vervormingen van de plaat te detecteren.
:::

## Mesh-geschiedenis

Alle mesh-scans worden opgeslagen met tijdstempel:

1. Klik **Geschiedenis** in het bed mesh-zijpaneel
2. Selecteer twee scans om ze te vergelijken (een verschilkaart wordt weergegeven)
3. Verwijder oude scans die u niet meer nodig hebt

## Exporteren

Exporteer mesh-data als:
- **PNG** — afbeelding van de heatmap (voor documentatie)
- **CSV** — ruwe data met X, Y en hoogteverschil per punt
