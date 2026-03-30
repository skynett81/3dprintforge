---
sidebar_position: 1
title: Dårlig heft
description: Årsaker og løsninger for dårlig første-lag-heft — plate, temp, limstift, hastighet, Z-offset
---

# Dårlig heft

Dårlig heft er en av de vanligste problemene i 3D-printing. Første laget løfter seg, eller prints slutter å hefte midtveis.

## Symptomer

- Første lag kleber ikke — printen beveger seg eller løfter seg
- Kanter og hjørner løfter seg (warping)
- Print løsner midt i jobben
- Ujevnt første lag med hull eller løse tråder

## Sjekkliste — prøv i denne rekkefølgen

### 1. Rengjør platen
Den vanligste årsaken til dårlig heft er fett eller skitt på platen.

```
1. Tørk platen med IPA (isopropylalkohol)
2. Unngå å ta på printoverflaten med bare fingre
3. Ved vedvarende problemer: vask med vann og mildt oppvaskmiddel
```

### 2. Kalibrer Z-offset

Z-offset er høyden mellom dysen og platen ved første lag. For høy = tråden henger løst. For lav = dysen scraper platen.

**Riktig Z-offset:**
- Første lag skal se lett gjennomsiktig ut
- Tråden skal klemmes ned til platen med en liten "squish"
- Trådene skal smelte lett inn i hverandre

Juster Z-offset via **Kontroll → Live Juster Z** under printing.

:::tip Live-justér mens du printer
Bambu Dashboard viser Z-offset justeringsknapper under aktiv print. Juster i steg på ±0.02 mm mens du ser på første lag.
:::

### 3. Sjekk sengtemperatur

| Materiale | For lav temp | Anbefalt |
|-----------|-------------|---------|
| PLA | Under 30 °C | 35–45 °C |
| PETG | Under 60 °C | 70–85 °C |
| ABS | Under 80 °C | 90–110 °C |
| TPU | Under 25 °C | 30–45 °C |

Prøv å øke sengtemperatur med 5 °C om gangen.

### 4. Bruk limstift

Limstift forbedrer heft for de fleste materialer på de fleste plater:
- Påfør tynt, jevnt lag
- La tørke 30 sekunder før start
- Særlig viktig for: ABS, PA, PC, PETG (på smooth PEI)

### 5. Senk første-lag-hastighet

Lavere hastighet ved første lag gir bedre kontakt mellom filament og plate:
- Standard: 50 mm/s for første lag
- Prøv: 30–40 mm/s
- Bambu Studio: under **Kvalitet → Første lag hastighet**

### 6. Sjekk platens tilstand

En slitt plate gir dårlig heft selv med perfekt innstillinger. Bytt platen om:
- PEI-belegget er synlig skadet
- Rengjøring ikke hjelper

### 7. Bruk brim

For materialer med warping-tendens (ABS, PA, store flate objekter):
- Legg til brim i slicer: 5–10 mm bredde
- Øker kontaktflaten og holder ned kantene

## Spesielle tilfeller

### Store flate objekter
Store flate objekter er mest utsatt for løsning. Tiltak:
- Brim 8–10 mm
- Øk sengtemperatur
- Lukk kammer (ABS/PA)
- Senk del-kjøling

### Glaserte overflater
Plater med for mye limstift over tid kan bli glaserte. Vask grundig med vann og start på nytt.

### Etter filamentbytte
Ulike materialer krever ulike innstillinger. Sjekk at sengtemp og plate er konfigurert for nytt materiale.
