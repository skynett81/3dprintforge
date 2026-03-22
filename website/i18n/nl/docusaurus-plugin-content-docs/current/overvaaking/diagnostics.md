---
sidebar_position: 3
title: Diagnostiek
description: Gezondheidsscore, telemetriegrafieken, bed mesh-visualisatie en componentbewaking voor Bambu Lab-printers
---

# Diagnostiek

De diagnostiekpagina biedt een diepgaand overzicht van de gezondheid, prestaties en toestand van uw printer in de tijd.

Ga naar: **https://localhost:3443/#diagnostics**

## Gezondheidsscore

Elke printer berekent een **gezondheidsscore** van 0–100 op basis van:

| Factor | Weging | Beschrijving |
|---|---|---|
| Succespercentage (30d) | 30 % | Aandeel geslaagde prints in de afgelopen 30 dagen |
| Componentenslijtage | 25 % | Gemiddelde slijtage van kritieke onderdelen |
| HMS-fouten (30d) | 20 % | Aantal en ernst van fouten |
| Kalibratiestatus | 15 % | Tijd sinds laatste kalibratie |
| Temperatuurstabiliteit | 10 % | Afwijking van doeltemperatuur tijdens het printen |

**Score-interpretatie:**
- 🟢 80–100 — Uitstekende conditie
- 🟡 60–79 — Goed, maar iets verdient aandacht
- 🟠 40–59 — Verminderde prestaties, onderhoud aanbevolen
- 🔴 0–39 — Kritiek, onderhoud vereist

:::tip Geschiedenis
Klik op de gezondheidsgrafiek om de scoreontwikkeling in de tijd te bekijken. Grote dalingen kunnen wijzen op een specifieke gebeurtenis.
:::

## Telemetriegrafieken

De telemetriepagina toont interactieve grafieken voor alle sensorwaarden:

### Beschikbare datasets

- **Spuittemperatuur** — werkelijk vs. doelwaarde
- **Bedtemperatuur** — werkelijk vs. doelwaarde
- **Kammertemperatuur** — omgevingstemperatuur in de machine
- **Extrudermotor** — stroomverbruik en temperatuur
- **Ventilatorsnelheden** — toolhead, kammer, AMS
- **Druk** (X1C) — kammerdruk voor AMS
- **Versnelling** — trillingsdata (ADXL345)

### Navigeren in de grafieken

1. Kies **Tijdsperiode**: Laatste uur / 24 uur / 7 dagen / 30 dagen / Aangepast
2. Kies **Printer** uit de keuzelijst
3. Kies **Dataset** om weer te geven (meerdere selecties ondersteund)
4. Scroll om in te zoomen op de tijdlijn
5. Klik en sleep om te pannen
6. Dubbelklik om zoom terug te zetten

### Telemetriedata exporteren

1. Klik **Exporteren** op de grafiek
2. Kies formaat: **CSV**, **JSON** of **PNG** (afbeelding)
3. De geselecteerde tijdsperiode en dataset worden geëxporteerd

## Bed Mesh

De bed mesh-visualisatie toont de vlakheidskalibratie van het printbed:

1. Ga naar **Diagnostiek → Bed Mesh**
2. Kies een printer
3. De meest recente mesh wordt weergegeven als een 3D-oppervlak en heatmap:
   - **Blauw** — lager dan centrum (concaaf)
   - **Groen** — vrijwel vlak
   - **Rood** — hoger dan centrum (convex)
4. Beweeg de muis over een punt om de exacte afwijking in mm te zien

### Bed mesh scannen vanuit de UI

1. Klik **Nu scannen** (vereist dat de printer inactief is)
2. Bevestig in het dialoogvenster — de printer start automatisch kalibratie
3. Wacht tot de scan klaar is (ca. 3–5 minuten)
4. De nieuwe mesh wordt automatisch weergegeven

:::warning Eerst opwarmen
De bed mesh moet worden gescand met een opgewarmd bed (50–60°C voor PLA) voor nauwkeurige kalibratie.
:::

## Componentenslijtage

Zie [Slijtagevoorspelling](./wearprediction) voor gedetailleerde documentatie.

De diagnostiekpagina toont een compacte samenvatting:
- Procentuele score per component
- Volgend aanbevolen onderhoud
- Klik op **Details** voor volledige slijtageanalyse
