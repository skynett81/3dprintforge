---
sidebar_position: 3
title: Stringing
description: Cause dello stringing e soluzioni — retract, temperatura e essiccazione
---

# Stringing

Lo stringing (o «oozing») sono sottili fili di plastica che si formano tra parti separate dell'oggetto mentre l'ugello si sposta senza estrudere. Conferisce alla stampa un aspetto simile a una «ragnatela».

## Cause dello stringing

1. **Temperatura ugello troppo alta** — la plastica calda è liquida e cola
2. **Impostazioni retract scadenti** — il filamento non viene ritirato abbastanza velocemente
3. **Filamento umido** — l'umidità causa vapore e flusso eccessivo
4. **Velocità troppo bassa** — l'ugello rimane a lungo nelle posizioni di transito

## Diagnosi

**Filamento umido?** Senti un crepitio/scoppiettio durante la stampa? Allora il filamento è umido — essicca prima di regolare qualsiasi altra impostazione.

**Temperatura troppo alta?** Vedi gocce dall'ugello nei momenti di «pausa»? Abbassa la temperatura di 5–10 °C.

## Soluzioni

### 1. Essicca il filamento

Il filamento umido è la causa più comune di stringing che non si riesce a regolare via:

| Materiale | Temperatura essiccazione | Tempo |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 ore |
| PETG | 60–65 °C | 6–8 ore |
| TPU | 55–60 °C | 6–8 ore |
| PA | 75–85 °C | 8–12 ore |

### 2. Abbassa la temperatura ugello

Inizia abbassando di 5 °C alla volta:
- PLA: prova 210–215 °C (da 220 °C)
- PETG: prova 235–240 °C (da 245 °C)

:::warning Temperatura troppo bassa causa cattiva fusione degli strati
Abbassa la temperatura con cautela. Una temperatura troppo bassa causa cattiva fusione degli strati, stampa fragile e problemi di estrusione.
:::

### 3. Regola le impostazioni retract

Il retract ritira il filamento nell'ugello durante il movimento di «travel» per prevenire le gocce:

```
Bambu Studio → Filamento → Retract:
- Distanza retract: 0,4–1,0 mm (direct drive)
- Velocità retract: 30–45 mm/s
```

:::tip Le stampanti Bambu Lab hanno direct drive
Tutte le stampanti Bambu Lab (X1C, P1S, A1) usano un estrusore direct drive. Il direct drive richiede una distanza di retract **più corta** rispetto ai sistemi Bowden (tipicamente 0,5–1,5 mm vs. 3–7 mm).
:::

### 4. Aumenta la velocità di travel

Un movimento rapido tra i punti dà all'ugello meno tempo per gocciolare:
- Aumenta «travel speed» a 200–300 mm/s
- Le stampanti Bambu Lab gestiscono bene questa velocità

### 5. Attiva «Avoid Crossing Perimeters»

Impostazione slicer che fa evitare all'ugello di attraversare aree aperte dove lo stringing sarebbe visibile:
```
Bambu Studio → Qualità → Avoid crossing perimeters
```

### 6. Riduci la velocità (per TPU)

Per il TPU la soluzione è opposta rispetto agli altri materiali:
- Riduci la velocità di stampa a 20–35 mm/s
- Il TPU è elastico e viene compresso ad alta velocità — questo causa «post-flow»

## Dopo le regolazioni

Testa con un modello di test standard per stringing (es. «torture tower» da MakerWorld). Regola una variabile alla volta e osserva il cambiamento.

:::note La perfezione è raramente possibile
Un po' di stringing è normale per la maggior parte dei materiali. Concentrati nel ridurlo a un livello accettabile, non nell'eliminarlo completamente. Il PETG avrà sempre un po' più di stringing rispetto al PLA.
:::
