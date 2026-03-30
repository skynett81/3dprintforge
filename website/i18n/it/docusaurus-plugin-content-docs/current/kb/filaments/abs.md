---
sidebar_position: 3
title: ABS
description: Guida alla stampa ABS — temperatura, camera chiusa, warping e colla stick
---

# ABS

L'ABS (Acrilonitrile Butadiene Stirene) è un termoplastico con buona stabilità termica e resistenza agli urti. Richiede camera chiusa ed è più impegnativo di PLA/PETG, ma produce parti funzionali durevoli.

## Impostazioni

| Parametro | Valore |
|-----------|-------|
| Temperatura ugello | 240–260 °C |
| Temperatura piano | 90–110 °C |
| Temperatura camera | 45–55 °C (X1C/P1S) |
| Raffreddamento pezzo | 0–20% |
| Aux fan | 0% |
| Velocità | 80–100% |
| Essiccazione | Consigliata (4–6 ore a 70 °C) |

## Piani consigliati

| Piano | Idoneità | Colla stick? |
|-------|---------|----------|
| Engineering Plate (PEI testurizzato) | Eccellente | Sì (consigliata) |
| High Temp Plate | Eccellente | Sì |
| Cool Plate (PEI liscio) | Evita | — |
| Textured PEI | Buono | Sì |

:::tip Colla stick per ABS
Usa sempre la colla stick sull'Engineering Plate con ABS. Migliora l'adesione e facilita il distacco della stampa senza danneggiare il piano.
:::

## Camera chiusa

L'ABS **richiede** una camera chiusa per prevenire il warping:

- **X1C e P1S:** Camera incorporata con controllo attivo della temperatura — ideale per ABS
- **P1P:** Parzialmente aperto — aggiungi coperture superiori per risultati migliori
- **A1 / A1 Mini:** CoreXY aperto — **non consigliato** per ABS senza involucro personalizzato

Tieni la camera chiusa per tutta la stampa. Non aprirla per controllare la stampa — aspettando il raffreddamento, eviti anche il warping al distacco.

## Warping

L'ABS è molto soggetto al warping (gli angoli si sollevano):

- **Aumenta la temperatura del piano** — prova 105–110 °C
- **Usa il brim** — brim 5–10 mm in Bambu Studio
- **Evita le correnti d'aria** — chiudi tutti i flussi d'aria attorno alla stampante
- **Abbassa il raffreddamento pezzo a 0%** — il raffreddamento provoca torsione

:::warning Vapori
L'ABS emette vapori di stirene durante la stampa. Assicura una buona ventilazione nel locale, o usa un filtro HEPA/carbone attivo. La Bambu P1S ha un filtro integrato.
:::

## Post-elaborazione

L'ABS può essere levigato, verniciato e incollato più facilmente di PETG e PLA. Può anche essere levigato con acetone per una superficie liscia — ma sii molto prudente con l'esposizione all'acetone.

## Conservazione

Essicca a **70 °C per 4–6 ore** prima della stampa. Conserva in scatola sigillata — l'ABS assorbe umidità, causando rumori di scoppiettio e strati fragili.
