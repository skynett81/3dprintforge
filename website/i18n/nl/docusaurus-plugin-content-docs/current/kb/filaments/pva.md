---
sidebar_position: 8
title: PVA en steunmaterialen
description: Gids voor PVA, HIPS, PVB en andere steunmaterialen voor Bambu Lab-printers
---

# PVA en steunmaterialen

Steunmaterialen worden gebruikt om complexe geometrieën te printen met overhangen, bruggen en interne holtes die niet zonder tijdelijke steun kunnen worden geprint. Na het printen wordt het steunmateriaal verwijderd — mechanisch of door oplossing in een oplosmiddel.

## Overzicht

| Materiaal | Oplosmiddel | Combineren met | Oplostijd | Moeilijkheidsgraad |
|-----------|------------|---------------|-----------|-------------------|
| PVA | Water | PLA, PETG | 12–24 uur | Veeleisend |
| HIPS | d-Limoneen | ABS, ASA | 12–24 uur | Matig |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 uur | Matig |
| BVOH | Water | PLA, PETG, PA | 4–8 uur | Veeleisend |

---

## PVA (Polyvinylalcohol)

PVA is een in water oplosbaar steunmateriaal dat de meest gebruikte keuze is voor PLA-gebaseerde prints met complexe steunstructuren.

### Instellingen

| Parameter | Waarde |
|-----------|--------|
| Nozzletemperatuur | 190–210 °C |
| Bedtemperatuur | 45–60 °C |
| Onderdeelkoeling | 100% |
| Snelheid | 60–80% |
| Retractie | Verhoogd (6–8 mm) |

### Aanbevolen bouwplaten

| Plaat | Geschiktheid | Lijmstift? |
|-------|-------------|-----------|
| Cool Plate (Smooth PEI) | Uitstekend | Nee |
| Textured PEI | Goed | Nee |
| Engineering Plate | Goed | Nee |
| High Temp Plate | Vermijden | — |

### Compatibiliteit

PVA werkt het beste met materialen die printen bij **vergelijkbare temperaturen**:

| Hoofdmateriaal | Compatibiliteit | Opmerking |
|---------------|----------------|----------|
| PLA | Uitstekend | Ideale combinatie |
| PETG | Goed | Bedtemp kan iets hoog zijn voor PVA |
| ABS/ASA | Slecht | Kamertemp te hoog — PVA degradeert |
| PA (Nylon) | Slecht | Temperaturen te hoog |

### Oplossing

- Leg de voltooide print in **lauwwarm water** (ca. 40 °C)
- PVA lost op in **12–24 uur** afhankelijk van dikte
- Roer regelmatig in het water om het proces te versnellen
- Ververs het water elke 6–8 uur voor snellere oplossing
- Een ultrasone reiniger geeft aanzienlijk snellere resultaten (2–6 uur)

:::danger PVA is extreem hygroscopisch
PVA absorbeert vocht uit de lucht **zeer snel** — zelfs uren blootstelling kan het printresultaat verpesten. PVA dat vocht heeft opgenomen veroorzaakt:

- Hevig borrelen en knetterende geluiden
- Slechte hechting aan het hoofdmateriaal
- Stringing en plakkerig oppervlak
- Verstopte nozzle

**Droog PVA altijd direct voor gebruik** en print vanuit een droge omgeving (droogdoos).
:::

### PVA drogen

| Parameter | Waarde |
|-----------|--------|
| Droogtemperatuur | 45–55 °C |
| Droogtijd | 6–10 uur |
| Hygroscopisch niveau | Extreem hoog |
| Opslagmethode | Afgesloten doos met droogmiddel, altijd |

---

## HIPS (High Impact Polystyrene)

HIPS is een steunmateriaal dat oplost in d-limoneen (oplosmiddel op citrusbasis). Het is het voorkeurssteunmateriaal voor ABS en ASA.

### Instellingen

| Parameter | Waarde |
|-----------|--------|
| Nozzletemperatuur | 220–240 °C |
| Bedtemperatuur | 90–100 °C |
| Kamertemperatuur | 40–50 °C (aanbevolen) |
| Onderdeelkoeling | 20–40% |
| Snelheid | 70–90% |

### Compatibiliteit

| Hoofdmateriaal | Compatibiliteit | Opmerking |
|---------------|----------------|----------|
| ABS | Uitstekend | Ideale combinatie — vergelijkbare temperaturen |
| ASA | Uitstekend | Zeer goede hechting |
| PLA | Slecht | Te groot temperatuurverschil |
| PETG | Slecht | Ander thermisch gedrag |

### Oplossing in d-Limoneen

- Leg de print in **d-limoneen** (oplosmiddel op citrusbasis)
- Oplostijd: **12–24 uur** bij kamertemperatuur
- Verwarming tot 35–40 °C versnelt het proces
- d-Limoneen kan 2–3 keer worden hergebruikt
- Spoel het onderdeel af met water en droog na oplossing

### Voordelen ten opzichte van PVA

- **Veel minder vochtgevoelig** — makkelijker op te slaan en te hanteren
- **Sterker als steunmateriaal** — houdt meer uit zonder af te breken
- **Betere thermische compatibiliteit** met ABS/ASA
- **Makkelijker te printen** — minder verstoppingen en problemen

:::warning d-Limoneen is een oplosmiddel
Gebruik handschoenen en werk in een geventileerde ruimte. d-Limoneen kan huid en slijmvliezen irriteren. Buiten bereik van kinderen houden.
:::

---

## PVB (Polyvinylbutyral)

PVB is een uniek steunmateriaal dat oplost in isopropanol (IPA) en kan worden gebruikt om oppervlakken glad te maken met IPA-damp.

### Instellingen

| Parameter | Waarde |
|-----------|--------|
| Nozzletemperatuur | 200–220 °C |
| Bedtemperatuur | 55–75 °C |
| Onderdeelkoeling | 80–100% |
| Snelheid | 70–80% |

### Compatibiliteit

| Hoofdmateriaal | Compatibiliteit | Opmerking |
|---------------|----------------|----------|
| PLA | Goed | Acceptabele hechting |
| PETG | Matig | Bedtemp kan variëren |
| ABS/ASA | Slecht | Temperaturen te hoog |

### Oppervlakteafwerking met IPA-damp

De unieke eigenschap van PVB is dat het oppervlak kan worden gladgemaakt met IPA-damp:

1. Plaats het onderdeel in een afgesloten container
2. Leg een met IPA bevochtigd doek op de bodem (geen direct contact met het onderdeel)
3. Laat de damp **30–60 minuten** inwerken
4. Verwijder en laat 24 uur drogen
5. Het resultaat is een glad, halfglanzend oppervlak

:::tip PVB als oppervlakteafwerking
Hoewel PVB primair een steunmateriaal is, kan het worden geprint als buitenste laag op PLA-onderdelen voor een oppervlak dat met IPA kan worden gladgemaakt. Dit geeft een afwerking die lijkt op met aceton gladgemaakt ABS.
:::

---

## Vergelijking steunmaterialen

| Eigenschap | PVA | HIPS | PVB | BVOH |
|------------|-----|------|-----|------|
| Oplosmiddel | Water | d-Limoneen | IPA | Water |
| Oplostijd | 12–24 u | 12–24 u | 6–12 u | 4–8 u |
| Vochtgevoeligheid | Extreem hoog | Laag | Matig | Extreem hoog |
| Moeilijkheidsgraad | Veeleisend | Matig | Matig | Veeleisend |
| Prijs | Hoog | Matig | Hoog | Zeer hoog |
| Best met | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Beschikbaarheid | Goed | Goed | Beperkt | Beperkt |
| AMS-compatibel | Ja (met droogmiddel) | Ja | Ja | Problematisch |

---

## Tips voor dual extrusie en multicolor

### Algemene richtlijnen

- **Purgehoeveelheid** — steunmaterialen vereisen goede purging bij materiaalwissel (minimaal 150–200 mm³)
- **Interfacelagen** — gebruik 2–3 interfacelagen tussen steun en hoofdonderdeel voor een schoon oppervlak
- **Afstand** — stel steunafstand in op 0,1–0,15 mm voor eenvoudige verwijdering na oplossing
- **Steunpatroon** — gebruik driehoekpatroon voor PVA/BVOH, raster voor HIPS

### AMS-configuratie

- Plaats het steunmateriaal in een **AMS-slot met droogmiddel**
- Voor PVA: overweeg een externe droogdoos met Bowden-aansluiting
- Configureer het juiste materiaalprofiel in Bambu Studio
- Test met een eenvoudig overhangmodel voordat je complexe onderdelen print

### Veelvoorkomende problemen en oplossingen

| Probleem | Oorzaak | Oplossing |
|----------|---------|----------|
| Steun hecht niet | Te grote afstand | Verminder interfaceafstand naar 0,05 mm |
| Steun hecht te goed | Te kleine afstand | Verhoog interfaceafstand naar 0,2 mm |
| Bubbels in steunmateriaal | Vocht | Droog het filament grondig |
| Stringing tussen materialen | Onvoldoende retractie | Verhoog retractie met 1–2 mm |
| Slecht oppervlak tegen steun | Te weinig interfacelagen | Verhoog naar 3–4 interfacelagen |

:::tip Begin eenvoudig
Voor je eerste print met steunmateriaal: gebruik PLA + PVA, een eenvoudig model met duidelijke overhang (45°+) en standaardinstellingen in Bambu Studio. Optimaliseer naarmate je ervaring opdoet.
:::
