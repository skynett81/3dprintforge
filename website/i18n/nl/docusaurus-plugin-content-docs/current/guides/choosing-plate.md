---
sidebar_position: 4
title: De juiste bouwplaat kiezen
description: Overzicht van Bambu Labs bouwplaten en welke het beste bij jouw filament past
---

# De juiste bouwplaat kiezen

De juiste bouwplaat is essentieel voor goede hechting en eenvoudige verwijdering van de print. Een verkeerde combinatie leidt tot slechte hechting of een print die vastzit en de plaat beschadigt.

## Overzichtstabel

| Filament | Aanbevolen plaat | Lijmstift | Plaattemperatuur |
|----------|-----------------|-----------|-----------------|
| PLA | Cool Plate / Textured PEI | Nee / Ja | 35–45°C |
| PETG | Textured PEI | **Ja (verplicht)** | 70°C |
| ABS | Engineering Plate / High Temp | Ja | 90–110°C |
| ASA | Engineering Plate / High Temp | Ja | 90–110°C |
| TPU | Textured PEI | Nee | 35–45°C |
| PA (Nylon) | Engineering Plate | Ja | 90°C |
| PC | High Temp Plate | Ja | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Ja | 45–90°C |
| PVA | Cool Plate | Nee | 35°C |

## Plaatbeschrijvingen

### Cool Plate (Glad PEI)
**Het beste voor:** PLA, PVA
**Oppervlak:** Glad, geeft een gladde onderkant aan de print
**Verwijdering:** Buig de plaat licht of wacht tot deze afkoelt — de print laat vanzelf los

Gebruik geen Cool Plate met PETG — het hecht **te goed** en kan het oppervlak van de plaat beschadigen.

### Textured PEI (Gestructureerd)
**Het beste voor:** PETG, TPU, PLA (geeft ruw oppervlak)
**Oppervlak:** Gestructureerd, geeft een ruw en esthetisch uiterlijk aan de onderkant
**Verwijdering:** Wacht tot kamertemperatuur — de print springt vanzelf los

:::warning PETG vereist lijmstift op Textured PEI
Zonder lijmstift hecht PETG extreem goed aan Textured PEI en kan het oppervlak beschadigen bij verwijdering. Breng altijd een dunne laag lijmstift aan (Bambu lijmstift of Elmer's Disappearing Purple Glue) over het gehele oppervlak.
:::

### Engineering Plate
**Het beste voor:** ABS, ASA, PA, PLA-CF, PETG-CF
**Oppervlak:** Heeft een matte PEI-coating met lagere adhesie dan Textured PEI
**Verwijdering:** Gemakkelijk te verwijderen na afkoeling. Gebruik lijmstift voor ABS/ASA

### High Temp Plate
**Het beste voor:** PC, PA-CF, ABS bij hoge temperaturen
**Oppervlak:** Verdraagt plaattemperaturen tot 120°C zonder vervorming
**Verwijdering:** Laat afkoelen tot kamertemperatuur

## Veelgemaakte fouten

### PETG op gladde Cool Plate (zonder lijmstift)
**Probleem:** PETG hecht zo sterk dat de print niet zonder schade kan worden verwijderd
**Oplossing:** Gebruik altijd Textured PEI met lijmstift, of Engineering Plate

### ABS op Cool Plate
**Probleem:** Warping — hoeken komen omhoog tijdens het printen
**Oplossing:** Engineering Plate + lijmstift + kamertemperatuur verhogen (sluit de voordeur)

### PLA op High Temp Plate
**Probleem:** Te hoge plaattemperatuur geeft overmatige hechting, moeilijke verwijdering
**Oplossing:** Cool Plate of Textured PEI voor PLA

### Te veel lijmstift
**Probleem:** Dikke lijmstift geeft olifantenpoot (uitvloeiende eerste laag)
**Oplossing:** Één dunne laag — de lijmstift moet nauwelijks zichtbaar zijn

## Plaat wisselen

1. **Laat de plaat afkoelen** tot kamertemperatuur (of gebruik handschoenen — de plaat kan heet zijn)
2. Til de plaat aan de voorkant op en trek eruit
3. Leg de nieuwe plaat in — de magneet houdt hem op zijn plaats
4. **Voer automatische kalibratie uit** (Flow Rate en Bed Leveling) na het wisselen in Bambu Studio of via het dashboard onder **Bediening → Kalibratie**

:::info Vergeet niet te kalibreren na het wisselen
Platen hebben een iets verschillende dikte. Zonder kalibratie kan de eerste laag te ver weg zijn of in de plaat botsen.
:::

## Onderhoud van platen

### Reiniging (na elke 2–5 prints)
- Veeg af met IPA (isopropanol 70–99%) en een pluisvrij doekje
- Raak het oppervlak niet aan met blote handen — vet van de huid vermindert de hechting
- Voor Textured PEI: was met lauw water en mild afwasmiddel na veel prints

### Lijmstiftresten verwijderen
- Verwarm de plaat tot 60°C
- Veeg af met een vochtige doek
- Eindig met een IPA-afveging

### Vervanging
Vervang de plaat als je ziet:
- Zichtbare kuilen of sporen na het verwijderen van prints
- Aanhoudend slechte hechting zelfs na reiniging
- Bellen of vlekken in de coating

Bambu-platen gaan typisch 200–500 prints mee, afhankelijk van het filamenttype en behandeling.

:::tip Platen correct bewaren
Bewaar ongebruikte platen in de originele verpakking of rechtop in een houder — niet gestapeld met zware dingen erop. Vervormde platen geven een ongelijkmatige eerste laag.
:::
