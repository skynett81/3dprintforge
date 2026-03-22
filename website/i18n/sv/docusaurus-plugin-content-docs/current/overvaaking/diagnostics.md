---
sidebar_position: 3
title: Diagnostik
description: Hälsopoäng, telemetrigrafer, bed mesh-visualisering och komponentövervakning för Bambu Lab-skrivare
---

# Diagnostik

Diagnostiksidan ger dig en djupgående översikt över skrivarens hälsa, prestanda och tillstånd över tid.

Gå till: **https://localhost:3443/#diagnostics**

## Hälsopoäng

Varje skrivare beräknar en **hälsopoäng** från 0–100 baserat på:

| Faktor | Viktning | Beskrivning |
|---|---|---|
| Framgångsrate (30d) | 30 % | Andel lyckade utskrifter senaste 30 dagarna |
| Komponentslitage | 25 % | Genomsnittligt slitage på kritiska delar |
| HMS-fel (30d) | 20 % | Antal och allvarlighetsgrad för fel |
| Kalibreringsstatus | 15 % | Tid sedan senaste kalibrering |
| Temperaturstabilitet | 10 % | Avvikelse från måltemperatur under utskrift |

**Poängtolkning:**
- 🟢 80–100 — Utmärkt skick
- 🟡 60–79 — Bra, men något bör undersökas
- 🟠 40–59 — Reducerad prestanda, underhåll rekommenderas
- 🔴 0–39 — Kritiskt, underhåll krävs

:::tip Historik
Klicka på hälsografen för att se poängens utveckling över tid. Stora fall kan indikera en specifik händelse.
:::

## Telemetrigrafer

Telemetrisidan visar interaktiva grafer för alla sensorvärden:

### Tillgängliga dataset

- **Munstyckstemperatur** — faktisk vs. mål
- **Bäddtemperatur** — faktisk vs. mål
- **Kammartemperatur** — omgivningstemperatur inne i maskinen
- **Extrudermotor** — strömförbrukning och temperatur
- **Fläkthastigheter** — verktygshuvud, kammare, AMS
- **Tryck** (X1C) — chamberpressure för AMS
- **Acceleration** — vibrationsdata (ADXL345)

### Navigera i graferna

1. Välj **Tidsperiod**: Senaste timmen / 24 timmar / 7 dagar / 30 dagar / Anpassad
2. Välj **Skrivare** från rullgardinsmenyn
3. Välj **Dataset** att visa (flerval stöds)
4. Scrolla för att zooma in på tidslinjen
5. Klicka och dra för att panorera
6. Dubbelklicka för att återställa zoom

### Exportera telemetridata

1. Klicka **Exportera** på grafen
2. Välj format: **CSV**, **JSON** eller **PNG** (bild)
3. Vald tidsperiod och dataset exporteras

## Bed Mesh

Bed mesh-visualiseringen visar planhetskalibereringen av byggplattan:

1. Gå till **Diagnostik → Bed Mesh**
2. Välj skrivare
3. Senaste mesh visas som en 3D-yta och heatmap:
   - **Blå** — lägre än center (konkav)
   - **Grön** — ungefär plant
   - **Röd** — högre än center (konvex)
4. Hovra över en punkt för att se exakt avvikelse i mm

### Skanna bed mesh från UI

1. Klicka **Skanna nu** (kräver att skrivaren är ledig)
2. Bekräfta i dialogen — skrivaren startar automatisk kalibrering
3. Vänta tills skanningen är klar (ca. 3–5 minuter)
4. Det nya meshet visas automatiskt

:::warning Värm upp först
Bed mesh bör skannas med uppvärmd bädd (50–60°C för PLA) för korrekt kalibrering.
:::

## Komponentslitage

Se [Slitageprediktion](./wearprediction) för detaljerad dokumentation.

Diagnostiksidan visar en komprimerad översikt:
- Procentpoäng per komponent
- Nästa rekommenderat underhåll
- Klicka **Detaljer** för fullständig slitageanalys
