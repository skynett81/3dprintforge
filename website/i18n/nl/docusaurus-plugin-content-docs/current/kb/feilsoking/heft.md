---
sidebar_position: 1
title: Slechte hechting
description: Oorzaken en oplossingen voor slechte eerste-laag-hechting — bed, temperatuur, lijmstift, snelheid, Z-offset
---

# Slechte hechting

Slechte hechting is een van de meest voorkomende problemen bij 3D-printen. De eerste laag hecht niet, of prints lossen halverwege los.

## Symptomen

- Eerste laag hecht niet — de print beweegt of licht op
- Randen en hoeken lichten op (warping)
- Print laat los tijdens de taak
- Ongelijkmatige eerste laag met gaten of losse draden

## Checklist — probeer in deze volgorde

### 1. Reinig het bed
De meest voorkomende oorzaak van slechte hechting is vet of vuil op het bed.

```
1. Veeg het bed af met IPA (isopropylalcohol)
2. Raak het printoppervlak niet aan met blote vingers
3. Bij aanhoudende problemen: was met water en mild afwasmiddel
```

### 2. Kalibreer de Z-offset

De Z-offset is de hoogte tussen de spuit en het bed bij de eerste laag. Te hoog = draad hangt los. Te laag = spuit schraapt het bed.

**Juiste Z-offset:**
- De eerste laag moet licht transparant lijken
- De draad moet naar het bed worden gedrukt met een lichte «squish»
- Draden moeten licht in elkaar smelten

Pas de Z-offset aan via **Besturing → Live Z aanpassen** tijdens het printen.

:::tip Live aanpassen tijdens het printen
Bambu Dashboard toont Z-offset aanpassingsknoppen bij een actieve print. Pas aan in stappen van ±0.02 mm terwijl u de eerste laag bekijkt.
:::

### 3. Controleer de bedtemperatuur

| Materiaal | Te lage temp | Aanbevolen |
|-----------|-------------|---------|
| PLA | Onder 30 °C | 35–45 °C |
| PETG | Onder 60 °C | 70–85 °C |
| ABS | Onder 80 °C | 90–110 °C |
| TPU | Onder 25 °C | 30–45 °C |

Probeer de bedtemperatuur met 5 °C tegelijk te verhogen.

### 4. Gebruik lijmstift

Lijmstift verbetert de hechting voor de meeste materialen op de meeste bedden:
- Breng een dunne, gelijkmatige laag aan
- Laat 30 seconden drogen voor de start
- Bijzonder belangrijk voor: ABS, PA, PC, PETG (op smooth PEI)

### 5. Verlaag de eerste-laag-snelheid

Een lagere snelheid bij de eerste laag geeft beter contact tussen filament en bed:
- Standaard: 50 mm/s voor de eerste laag
- Probeer: 30–40 mm/s
- Bambu Studio: onder **Kwaliteit → Eerste laag snelheid**

### 6. Controleer de toestand van het bed

Een versleten bed geeft slechte hechting zelfs met perfecte instellingen. Vervang het bed als:
- De PEI-coating zichtbaar beschadigd is
- Reiniging niet helpt

### 7. Gebruik een brim

Voor materialen met neiging tot warping (ABS, PA, grote vlakke objecten):
- Voeg een brim toe in de slicer: 5–10 mm breed
- Vergroot het contactoppervlak en houdt de randen omlaag

## Speciale gevallen

### Grote vlakke objecten
Grote vlakke objecten zijn het meest gevoelig voor loslaten. Maatregelen:
- Brim 8–10 mm
- Verhoog bedtemperatuur
- Sluit de behuizing (ABS/PA)
- Verlaag deelkoeling

### Geglazuurde oppervlakken
Bedden met te veel lijmstift over tijd kunnen geglazuurd raken. Was grondig met water en begin opnieuw.

### Na filamentwisseling
Verschillende materialen vereisen verschillende instellingen. Controleer of de bedtemperatuur en het bed zijn geconfigureerd voor het nieuwe materiaal.
