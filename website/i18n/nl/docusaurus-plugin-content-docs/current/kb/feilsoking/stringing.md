---
sidebar_position: 3
title: Stringing
description: Oorzaken van stringing en oplossingen — retract, temperatuur en drogen
---

# Stringing

Stringing (of «oozing») zijn dunne plastic draden die worden gevormd tussen afzonderlijke delen van het object terwijl de spuit beweegt zonder te extruderen. Dit geeft een «spinnenweb»-achtig uiterlijk aan de print.

## Oorzaken van stringing

1. **Te hoge spuittemperatuur** — warm plastic is vloeibaar en druipt
2. **Slechte retract-instellingen** — het filament wordt niet snel genoeg teruggetrokken
3. **Vochtig filament** — vocht veroorzaakt stoom en extra vloeibaarheid
4. **Te lage snelheid** — de spuit beweegt lang in transitieposities

## Diagnose

**Vochtig filament?** Hoort u een knisperend/poppend geluid tijdens het printen? Dan is het filament vochtig — droog het eerst voordat u andere instellingen aanpast.

**Te hoge temperatuur?** Ziet u druipen van de spuit in «pauze»-momenten? Verlaag de temperatuur met 5–10 °C.

## Oplossingen

### 1. Droog het filament

Vochtig filament is de meest voorkomende oorzaak van stringing die niet kan worden weggeregeld:

| Materiaal | Droogtemperatuur | Tijd |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 uur |
| PETG | 60–65 °C | 6–8 uur |
| TPU | 55–60 °C | 6–8 uur |
| PA | 75–85 °C | 8–12 uur |

### 2. Verlaag de spuittemperatuur

Begin met 5 °C per keer verlagen:
- PLA: probeer 210–215 °C (van 220 °C)
- PETG: probeer 235–240 °C (van 245 °C)

:::warning Te lage temp geeft slechte laagverbinding
Verlaag de temperatuur voorzichtig. Een te lage temperatuur geeft slechte laagverbinding, een zwakke print en extrussieproblemen.
:::

### 3. Pas de retract-instellingen aan

Retract trekt het filament terug in de spuit tijdens «travel»-beweging om druipen te voorkomen:

```
Bambu Studio → Filament → Retract:
- Retract-afstand: 0.4–1.0 mm (direct drive)
- Retract-snelheid: 30–45 mm/s
```

:::tip Bambu Lab printers hebben direct drive
Alle Bambu Lab-printers (X1C, P1S, A1) gebruiken een direct drive extruder. Direct drive vereist een **kortere** retract-afstand dan Bowden-systemen (doorgaans 0.5–1.5 mm vs. 3–7 mm).
:::

### 4. Verhoog de reissnelheid

Snelle beweging tussen punten geeft de spuit minder tijd om te druipen:
- Verhoog «travel speed» naar 200–300 mm/s
- Bambu Lab-printers verwerken dit goed

### 5. Activeer «Avoid Crossing Perimeters»

Slicer-instelling waardoor de spuit open gebieden vermijdt waar stringing zichtbaar zou worden:
```
Bambu Studio → Kwaliteit → Avoid crossing perimeters
```

### 6. Verlaag de snelheid (voor TPU)

Voor TPU is de oplossing tegenovergesteld aan andere materialen:
- Verlaag de printsnelheid naar 20–35 mm/s
- TPU is elastisch en comprimerert bij een te hoge snelheid — dit geeft «naloop»

## Na aanpassingen

Test met een standaard stringing-testmodel (bijv. «torture tower» van MakerWorld). Pas één variabele tegelijk aan en bekijk de verandering.

:::note Perfect is zelden haalbaar
Enige stringing is normaal voor de meeste materialen. Focus op het terugbrengen tot een acceptabel niveau, niet op volledig elimineren. PETG zal altijd iets meer stringing hebben dan PLA.
:::
