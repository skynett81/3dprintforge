---
sidebar_position: 2
title: Warping
description: Cause del warping e soluzioni — camera chiusa, brim, temperatura e draft shield
---

# Warping

Il warping si verifica quando gli angoli o i bordi della stampa si sollevano dal piano durante o dopo la stampa. È causato dalla contrazione termica del materiale.

## Cos'è il warping?

Quando la plastica si raffredda, si contrae. Gli strati superiori sono più caldi di quelli inferiori — questo crea tensione che tira i bordi verso l'alto e curva la stampa. Maggiore è la differenza di temperatura, maggiore è il warping.

## Materiali più soggetti

| Materiale | Rischio warping | Richiede camera chiusa |
|-----------|-------------|-----------------|
| PLA | Basso | No |
| PETG | Basso–Moderato | No |
| ABS | Alto | Sì |
| ASA | Alto | Sì |
| PA/Nylon | Molto alto | Sì |
| PC | Molto alto | Sì |
| TPU | Basso | No |

## Soluzioni

### 1. Usa la camera chiusa

Il rimedio più importante per ABS, ASA, PA e PC:
- Mantieni la temperatura della camera a 40–55 °C per i migliori risultati
- X1C e P1S: attiva le ventole della camera in modalità «chiusa»
- A1/P1P: usa un coperchio per trattenere il calore

### 2. Usa il brim

Il brim è un singolo strato con bordi extra larghi che mantiene la stampa attaccata al piano:

```
Bambu Studio:
1. Seleziona la stampa nel slicer
2. Vai a Support → Brim
3. Imposta la larghezza a 5–10 mm (più warping, brim più largo)
4. Tipo: Outer Brim Only (consigliato)
```

:::tip Guida alla larghezza del brim
- PLA (raramente necessario): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Aumenta la temperatura del piano

Una temperatura del piano più alta riduce la differenza di temperatura tra gli strati:
- ABS: prova 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Riduci il raffreddamento del pezzo

Per i materiali con tendenza al warping — abbassa o disattiva il raffreddamento del pezzo:
- ABS/ASA: 0–20% raffreddamento pezzo
- PA: 0–30% raffreddamento pezzo

### 5. Evita correnti d'aria e aria fredda

Tieni la stampante lontana da:
- Finestre e porte esterne
- Condizionatori d'aria e ventilatori
- Correnti d'aria nel locale

Per P1P e A1: copri le aperture con cartone durante le stampe critiche.

### 6. Draft Shield

Un draft shield è una parete sottile attorno all'oggetto che trattiene il calore all'interno:

```
Bambu Studio:
1. Vai a Support → Draft Shield
2. Attiva e imposta la distanza (3–5 mm)
```

Particolarmente utile per oggetti alti e snelli.

### 7. Accorgimenti nel design del modello

Quando si progettano modelli propri:
- Evita basi grandi e piatte (aggiungi smussi/arrotondamenti agli angoli)
- Dividi le parti grandi e piatte in sezioni più piccole
- Usa «mouse ears» — piccoli cerchi negli angoli — nel slicer o nel CAD

## Warping dopo il raffreddamento

A volte la stampa sembra perfetta, ma il warping si manifesta dopo essere stata rimossa dal piano:
- Aspetta sempre che il piano e la stampa siano **completamente freddi** (sotto 40 °C) prima di rimuovere
- Per ABS: lascia raffreddare nella camera chiusa per un raffreddamento più lento
- Evita di mettere una stampa calda su una superficie fredda
