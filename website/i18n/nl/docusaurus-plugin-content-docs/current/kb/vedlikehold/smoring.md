---
sidebar_position: 4
title: Smering
description: Smering van lineaire staven, geleiders en intervallen voor Bambu Lab-printers
---

# Smering

Correcte smering van bewegende onderdelen vermindert slijtage, verlaagt het geluidsniveau en zorgt voor nauwkeurige beweging. Bambu Lab-printers gebruiken lineaire bewegingssystemen die periodieke smering vereisen.

## Smeringstypes

| Component | Smeringstype | Product |
|-----------|-------------|---------|
| Lineaire staven (XY) | Lichte machineol of PTFE-spray | 3-in-1, Super Lube |
| Z-as-spindel | Dik smeermiddel | Super Lube vet |
| Lineaire geleiders | Licht lithiumvet | Bambu Lab vet |
| Kabelgeleiding-schakels | Geen (droog) | — |

## Lineaire staven

### X- en Y-as
De staven zijn gepolijste stalen staven die door lineaire geleiders glijden:

```
Interval: Elke 200–300 uur, of bij krakende geluiden
Hoeveelheid: Zeer weinig — één druppel per stafpunt is genoeg
Methode:
1. Zet de printer uit
2. Beweeg de wagen handmatig naar het einde
3. Breng 1 druppel lichte olie aan in het midden van de staf
4. Beweeg de wagen langzaam 10 keer heen en weer
5. Veeg overtollige olie af met pluisvrij papier
```

:::warning Niet te veel smeren
Te veel olie trekt stof aan en vormt een schurend pasta. Gebruik minimale hoeveelheden en veeg altijd overtolligheid af.
:::

### Z-as (verticaal)
De Z-as gebruikt een spindelstaf (leadscrew) die vet vereist (niet olie):

```
Interval: Elke 200 uur
Methode:
1. Zet de printer uit
2. Breng een dunne laag vet aan langs de spindelstaf
3. Beweeg de Z-as handmatig omhoog en omlaag (of via onderhoudsmenu)
4. Het vet wordt automatisch verdeeld
```

## Lineaire geleiders

Bambu Lab P1S en X1C gebruiken lineaire geleiders (MGN12) op de Y-as:

```
Interval: Elke 300–500 uur
Methode:
1. Verwijder wat vet met een naald of tandenstoker uit de invoeropen
2. Spuit nieuw vet in met een spuit en dunne kanule
3. Beweeg de as heen en weer om het vet te verdelen
```

Bambu Lab verkoopt officieel smeermiddel (Bambu Lubricant) dat is gekalibreerd voor het systeem.

## Onderhoud van smering voor verschillende modellen

### X1C / P1S
- Y-as: Lineaire geleiders — vet van Bambu
- X-as: Koolstofstaven — lichte olie
- Z-as: Dubbele spindelstaf — Bambu vet

### A1 / A1 Mini
- Alle assen: Stalen staven — lichte olie
- Z-as: Enkelvoudige spindelstaf — Bambu vet

## Tekenen dat smering nodig is

- **Krakende of schrapende geluiden** bij beweging
- **Trillingspatronen** zichtbaar op verticale wanden (VFA)
- **Onnauwkeurige afmetingen** zonder andere oorzaken
- **Verhoogd geluidsniveau** van het bewegingssysteem

## Smeringsintervallen

| Activiteit | Interval |
|-----------|---------|
| Olie XY-staven | Elke 200–300 uur |
| Vet Z-spindel | Elke 200 uur |
| Vet lineaire geleiders (X1C/P1S) | Elke 300–500 uur |
| Volledige onderhoudscyclus | Halfjaarlijks (of 500 uur) |

Gebruik de onderhoudsmodule in het dashboard om intervallen automatisch bij te houden.
