---
sidebar_position: 7
title: PC
description: Gids voor polycarbonaat-printen met Bambu Lab — hoge sterkte, warmtebestendigheid en vereisten
---

# PC (Polycarbonaat)

Polycarbonaat is een van de sterkste thermoplastische materialen die beschikbaar zijn voor FDM-printen. Het combineert extreem hoge slagvastheid, warmtebestendigheid tot 110–130 °C en natuurlijke transparantie. PC is een veeleisend materiaal om te printen, maar levert resultaten die de kwaliteit van spuitgieten benaderen.

## Instellingen

| Parameter | Puur PC | PC-ABS blend | PC-CF |
|-----------|---------|-------------|-------|
| Nozzletemperatuur | 260–280 °C | 250–270 °C | 270–290 °C |
| Bedtemperatuur | 100–120 °C | 90–110 °C | 100–120 °C |
| Kamertemperatuur | 50–60 °C (vereist) | 45–55 °C | 50–60 °C |
| Onderdeelkoeling | 0–20% | 20–30% | 0–20% |
| Snelheid | 60–80% | 70–90% | 50–70% |
| Drogen vereist | Ja (kritiek) | Ja | Ja (kritiek) |

## Aanbevolen bouwplaten

| Plaat | Geschiktheid | Lijmstift? |
|-------|-------------|-----------|
| High Temp Plate | Uitstekend (vereist) | Nee |
| Engineering Plate | Acceptabel | Ja |
| Textured PEI | Niet aanbevolen | — |
| Cool Plate (Smooth PEI) | Niet gebruiken | — |

:::danger High Temp Plate is vereist
PC vereist bedtemperaturen van 100–120 °C. Cool Plate en Textured PEI zijn niet bestand tegen deze temperaturen en worden beschadigd. Gebruik **altijd** High Temp Plate voor puur PC.
:::

## Printer- en uitrustingsvereisten

### Behuizing (vereist)

PC vereist een **volledig gesloten kamer** met stabiele temperatuur van 50–60 °C. Zonder dit ervaar je ernstige warping, laagscheiding en delaminatie.

### Geharde nozzle (sterk aanbevolen)

Puur PC is niet slijpend, maar PC-CF en PC-GF **vereisen een geharde stalen nozzle** (bijv. Bambu Lab HS01). Voor puur PC wordt een geharde nozzle toch aanbevolen vanwege de hoge temperaturen.

### Printercompatibiliteit

| Printer | Geschikt voor PC? | Opmerking |
|---------|------------------|----------|
| X1C | Uitstekend | Volledig gesloten, HS01 beschikbaar |
| X1E | Uitstekend | Ontworpen voor engineering-materialen |
| P1S | Beperkt | Gesloten, maar zonder actieve kamerverwarming |
| P1P | Niet aanbevolen | Zonder behuizing |
| A1 / A1 Mini | Niet gebruiken | Open frame, te lage temperaturen |

:::warning Alleen X1C en X1E aanbevolen
PC vereist actieve kamerverwarming voor consistente resultaten. P1S kan acceptabele resultaten geven met kleine onderdelen, maar verwacht warping en laagscheiding bij grotere onderdelen.
:::

## Drogen

PC is **zeer hygroscopisch** en absorbeert snel vocht. Vochtig PC geeft catastrofale printresultaten.

| Parameter | Waarde |
|-----------|--------|
| Droogtemperatuur | 70–80 °C |
| Droogtijd | 6–8 uur |
| Hygroscopisch niveau | Hoog |
| Max aanbevolen vocht | < 0,02% |

- **Altijd** PC drogen voor het printen — zelfs nieuw geopende spoelen kunnen vocht hebben opgenomen
- Print rechtstreeks uit een droogdoos indien mogelijk
- AMS is **niet voldoende** voor PC-opslag — de luchtvochtigheid is te hoog
- Gebruik een speciale filamentdroger met actieve verwarming

:::danger Vocht vernietigt PC-prints
Tekenen van vochtig PC: luid knetterend geluid, bubbels op het oppervlak, zeer slechte laagbinding, stringing. Vochtig PC kan niet worden gecompenseerd met instellingen — het **moet** eerst worden gedroogd.
:::

## Eigenschappen

| Eigenschap | Waarde |
|------------|--------|
| Treksterkte | 55–75 MPa |
| Slagvastheid | Extreem hoog |
| Warmtebestendigheid (HDT) | 110–130 °C |
| Transparantie | Ja (natuurlijke/heldere variant) |
| Chemische bestendigheid | Matig |
| UV-bestendigheid | Matig (vergelt na verloop van tijd) |
| Krimp | ~0,5–0,7% |

## PC-blends

### PC-ABS

Een mengsel van polycarbonaat en ABS dat de sterktes van beide materialen combineert:

- **Makkelijker te printen** dan puur PC — lagere temperaturen en minder warping
- **Slagvastheid** tussen ABS en PC
- **Populair in de industrie** — gebruikt in auto-interieurs en elektronicabehuizingen
- Print bij 250–270 °C nozzle, 90–110 °C bed

### PC-CF (koolstofvezel)

Koolstofvezelversterkt PC voor maximale stijfheid en sterkte:

- **Extreem stijf** — ideaal voor structurele onderdelen
- **Lichtgewicht** — koolstofvezel vermindert het gewicht
- **Vereist geharde nozzle** — messing slijt in uren
- Print bij 270–290 °C nozzle, 100–120 °C bed
- Duurder dan puur PC, maar biedt mechanische eigenschappen dicht bij aluminium

### PC-GF (glasvezel)

Glasvezelversterkt PC:

- **Goedkoper dan PC-CF** met goede stijfheid
- **Witter oppervlak** dan PC-CF
- **Vereist geharde nozzle** — glasvezels zijn zeer slijpend
- Iets minder stijf dan PC-CF, maar betere slagvastheid

## Toepassingen

PC wordt gebruikt waar je **maximale sterkte en/of warmtebestendigheid** nodig hebt:

- **Mechanische onderdelen** — tandwielen, beugels, koppelingen onder belasting
- **Optische onderdelen** — lenzen, lichtgeleiders, transparante kappen (helder PC)
- **Warmtebestendige onderdelen** — motorruimte, nabij verwarmingselementen
- **Elektronicabehuizingen** — beschermende behuizingen met goede slagvastheid
- **Gereedschap en mallen** — precisie-montagegereedschap

## Tips voor succesvol PC-printen

### Eerste laag

- Verlaag de snelheid naar **30–40%** voor de eerste laag
- Verhoog de bedtemperatuur met 5 °C boven standaard voor de eerste 3–5 lagen
- **Brim is verplicht** voor de meeste PC-onderdelen — gebruik 8–10 mm

### Kamertemperatuur

- Laat de kamer **50 °C+** bereiken voordat het printen begint
- **Open de kamerdeur niet** tijdens het printen — de temperatuurdaling veroorzaakt directe warping
- Na het printen: laat het onderdeel **langzaam** afkoelen in de kamer (1–2 uur)

### Koeling

- Gebruik **minimale onderdeelkoeling** (0–20%) voor de beste laagbinding
- Voor bruggen en overhangen: tijdelijk verhogen tot 30–40%
- Geef prioriteit aan laagsterkte boven esthetiek bij PC

### Ontwerpoverwegingen

- **Vermijd scherpe hoeken** — rond af met minimaal 1 mm radius
- **Uniforme wanddikte** — ongelijke dikte creëert interne spanningen
- **Grote, vlakke oppervlakken** zijn moeilijk — deel op of voeg ribben toe

:::tip Nieuw met PC? Begin met PC-ABS
Als je nog nooit PC hebt geprint, begin dan met een PC-ABS blend. Het is veel vergeeflijker dan puur PC en geeft je ervaring met het materiaal zonder de extreme vereisten. Als je PC-ABS beheerst, ga dan over op puur PC.
:::

---

## Nabewerking

- **Schuren** — PC schuurt goed, maar gebruik nat schuren voor helder PC
- **Polijsten** — helder PC kan worden gepolijst tot bijna optische kwaliteit
- **Lijmen** — dichloormethaan-lijmen geeft onzichtbare naden (gebruik beschermingsmiddelen!)
- **Verven** — vereist primer voor goede hechting
- **Uitgloeien** — 120 °C gedurende 1–2 uur vermindert interne spanningen

:::warning Dichloormethaan-lijmen
Dichloormethaan is giftig en vereist afzuiging, chemisch bestendige handschoenen en veiligheidsbril. Werk altijd in een goed geventileerde ruimte of afzuigkap.
:::
