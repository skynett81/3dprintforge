---
sidebar_position: 6
title: ASA
description: Gids voor ASA-printen met Bambu Lab — UV-bestendig, buitengebruik, temperaturen en tips
---

# ASA

ASA (Acrylonitril Styreen Acrylaat) is een UV-bestendige variant van ABS die speciaal is ontwikkeld voor buitengebruik. Het materiaal combineert de sterkte en stijfheid van ABS met aanzienlijk betere bestendigheid tegen UV-straling, veroudering en weersinvloeden.

## Instellingen

| Parameter | Waarde |
|-----------|--------|
| Nozzletemperatuur | 240–260 °C |
| Bedtemperatuur | 90–110 °C |
| Kamertemperatuur | 40–50 °C (aanbevolen) |
| Onderdeelkoeling | 30–50% |
| Snelheid | 80–100% |
| Drogen vereist | Ja |

## Aanbevolen bouwplaten

| Plaat | Geschiktheid | Lijmstift? |
|-------|-------------|-----------|
| Engineering Plate | Uitstekend | Nee |
| High Temp Plate | Goed | Ja |
| Textured PEI | Acceptabel | Ja |
| Cool Plate (Smooth PEI) | Niet aanbevolen | — |

:::tip Engineering Plate is het beste voor ASA
De Engineering Plate biedt de meest betrouwbare hechting voor ASA zonder lijmstift. De plaat is bestand tegen de hoge bedtemperaturen en biedt goede hechting zonder dat het onderdeel permanent vastplakt.
:::

## Printervereisten

ASA vereist een **gesloten kamer (behuizing)** voor de beste resultaten. Zonder behuizing zul je ervaren:

- **Warping** — hoeken lichten op van de bouwplaat
- **Laagscheiding** — slechte hechting tussen lagen
- **Oppervlaktescheuren** — zichtbare scheuren langs de print

| Printer | Geschikt voor ASA? | Opmerking |
|---------|-------------------|----------|
| X1C | Uitstekend | Volledig gesloten, actieve verwarming |
| X1E | Uitstekend | Volledig gesloten, actieve verwarming |
| P1S | Goed | Gesloten, passieve verwarming |
| P1P | Mogelijk met accessoire | Vereist behuizingsaccessoire |
| A1 | Niet aanbevolen | Open frame |
| A1 Mini | Niet aanbevolen | Open frame |

## ASA vs ABS — vergelijking

| Eigenschap | ASA | ABS |
|------------|-----|-----|
| UV-bestendigheid | Uitstekend | Slecht |
| Buitengebruik | Ja | Nee (vergelt en wordt bros) |
| Warping | Matig | Hoog |
| Oppervlak | Mat, gelijkmatig | Mat, gelijkmatig |
| Chemische bestendigheid | Goed | Goed |
| Prijs | Iets hoger | Lager |
| Geur bij het printen | Matig | Sterk |
| Slagvastheid | Goed | Goed |
| Temperatuurbestendigheid | ~95–105 °C | ~95–105 °C |

:::warning Ventilatie
ASA geeft gassen af tijdens het printen die irriterend kunnen zijn. Print in een goed geventileerde ruimte of met een luchtfiltratiesysteem. Print ASA niet in een ruimte waar je langere tijd verblijft zonder ventilatie.
:::

## Drogen

ASA is **matig hygroscopisch** en absorbeert vocht uit de lucht na verloop van tijd.

| Parameter | Waarde |
|-----------|--------|
| Droogtemperatuur | 65 °C |
| Droogtijd | 4–6 uur |
| Hygroscopisch niveau | Gemiddeld |
| Tekenen van vocht | Knetterende geluiden, bubbels, slecht oppervlak |

- Bewaar in afgesloten zak met silicagel na opening
- AMS met droogmiddel is voldoende voor korte opslag
- Voor langere opslag: gebruik vacuümzakken of filamentdroogdoos

## Toepassingen

ASA is het voorkeursmateriaal voor alles wat **buiten** wordt gebruikt:

- **Autocomponenten** — spiegelhuizen, dashboarddetails, ventilatiekappen
- **Tuingereedschap** — beugels, klemmen, onderdelen voor tuinmeubilair
- **Buitenborden** — borden, letters, logo's
- **Droneonderdelen** — landingsgestel, camerabevestigingen
- **Zonnepaneelmontages** — beugels en hoeken
- **Brievenbusdelen** — mechanismen en decoraties

## Tips voor succesvol ASA-printen

### Brim en hechting

- **Gebruik brim** voor grote onderdelen en onderdelen met klein contactoppervlak
- Brim van 5–8 mm voorkomt warping effectief
- Voor kleinere onderdelen kun je zonder brim proberen, maar houd het klaar als backup

### Voorkom tocht

- **Sluit alle deuren en ramen** in de ruimte tijdens het printen
- Tocht en koude lucht zijn de ergste vijand van ASA
- Open de kamerdeur niet tijdens het printen

### Temperatuurstabiliteit

- Laat de kamer **10–15 minuten** opwarmen voordat het printen begint
- Stabiele kamertemperatuur geeft gelijkmatigere resultaten
- Vermijd het plaatsen van de printer bij ramen of ventilatieopeningen

### Koeling

- ASA heeft **beperkte onderdeelkoeling** nodig — 30–50% is typisch
- Voor overhangen en bruggen kun je verhogen tot 60–70%, maar verwacht wat laagscheiding
- Voor mechanische onderdelen: geef prioriteit aan laagbinding boven details door koeling te verminderen

:::tip Eerste keer met ASA?
Begin met een klein testonderdeel (bijv. een 30 mm kubus) om je instellingen te kalibreren. ASA gedraagt zich erg vergelijkbaar met ABS, maar met iets lagere neiging tot warping. Heb je ervaring met ABS, dan voelt ASA als een upgrade.
:::

---

## Krimp

ASA krimpt meer dan PLA en PETG, maar over het algemeen iets minder dan ABS:

| Materiaal | Krimp |
|-----------|-------|
| PLA | ~0,3–0,5% |
| PETG | ~0,3–0,6% |
| ASA | ~0,5–0,7% |
| ABS | ~0,7–0,8% |

Voor onderdelen met strakke toleranties: compenseer met 0,5–0,7% in de slicer, of test eerst met proefstukken.

---

## Nabewerking

- **Acetonafwerking** — ASA kan worden gladgemaakt met acetondamp, net als ABS
- **Schuren** — schuurt goed met 200–400 korrel schuurpapier
- **Lijmen** — CA-lijm of acetonlassen werkt uitstekend
- **Verven** — neemt verf goed op na licht schuren

:::danger Acetonhantering
Aceton is brandbaar en geeft giftige dampen af. Gebruik altijd in een goed geventileerde ruimte, vermijd open vuur en gebruik beschermingsmiddelen (handschoenen en bril).
:::
