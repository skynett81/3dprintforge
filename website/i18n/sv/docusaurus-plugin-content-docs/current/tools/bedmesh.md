---
sidebar_position: 6
title: Bed Mesh
description: 3D-visualisering av byggplattans planhetskalibrering med heatmap, skanning från UI och kalibreringsguide
---

# Bed Mesh

Bed mesh-verktyget ger dig en visuell representation av byggplattans planhet — avgörande för god häftning och jämnt första lager.

Gå till: **https://localhost:3443/#bedmesh**

## Vad är bed mesh?

Bambu Lab-skrivare skannar byggplattans yta med en probe och skapar en karta (mesh) över höjdavvikelser. Skrivarens firmware kompenserar automatiskt för avvikelser under utskrift. 3DPrintForge visualiserar denna karta för dig.

## Visualisering

### 3D-yta

Bed mesh-kartan visas som en interaktiv 3D-yta:

- Använd musen för att rotera visningen
- Scrolla för att zooma in/ut
- Klicka **Toppvy** för fågelperspektiv
- Klicka **Sidovy** för att se profilen

Färgskalan visar avvikelse från genomsnittlig höjd:
- **Blå** — lägre än center (konkav)
- **Grön** — ungefär plant (< 0.1 mm avvikelse)
- **Gul** — måttlig avvikelse (0.1–0.2 mm)
- **Röd** — stor avvikelse (> 0.2 mm)

### Heatmap

Klicka **Heatmap** för en platt 2D-visning av mesh-kartan — enklare att läsa för de flesta.

Heatmapen visar:
- Exakta avvikelsevärden (mm) för varje mätpunkt
- Markerade problempunkter (avvikelse > 0.3 mm)
- Dimensioner på mätningarna (antal rader × kolumner)

## Skanna bed mesh från UI

:::warning Krav
Skanningen kräver att skrivaren är ledig och bäddtemperaturen är stabiliserad. Värm upp bädden till önskad temperatur INNAN skanning.
:::

1. Gå till **Bed Mesh**
2. Välj skrivare från rullgardinsmenyn
3. Klicka **Skanna nu**
4. Välj bäddtemperatur för skanningen:
   - **Kall** (rumstemperatur) — snabb, men mindre korrekt
   - **Varm** (50–60°C PLA, 70–90°C PETG) — rekommenderat
5. Bekräfta i dialogen — skrivaren startar automatiskt probe-sekvensen
6. Vänta tills skanningen är klar (3–8 minuter beroende på mesh-storlek)
7. Den nya mesh-kartan visas automatiskt

## Kalibreringsguide

Efter skanning ger systemet konkreta rekommendationer:

| Resultat | Rekommendation |
|---|---|
| Avvikelse < 0.1 mm överallt | Utmärkt — ingen åtgärd behövs |
| Avvikelse 0.1–0.2 mm | Bra — kompensation hanteras av firmware |
| Avvikelse > 0.2 mm i hörn | Justera bäddfjädrar manuellt (om möjligt) |
| Avvikelse > 0.3 mm | Bädden kan vara skadad eller felmonterad |
| Center högre än hörn | Termisk utvidgning — normalt för varma bäddar |

:::tip Historisk jämförelse
Klicka **Jämför med föregående** för att se om mesh-kartan har förändrats över tid — användbart för att upptäcka att plattan böjer sig gradvis.
:::

## Mesh-historik

Alla mesh-skanningar sparas med tidsstämpel:

1. Klicka **Historik** i bed mesh-sidopanelen
2. Välj två skanningar för att jämföra dem (differenskarta visas)
3. Ta bort gamla skanningar du inte längre behöver

## Export

Exportera mesh-data som:
- **PNG** — bild av heatmap (för dokumentation)
- **CSV** — rådata med X, Y och höjdavvikelse per punkt
