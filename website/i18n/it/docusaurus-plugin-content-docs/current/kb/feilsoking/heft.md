---
sidebar_position: 1
title: Scarsa adesione
description: Cause e soluzioni per la scarsa adesione del primo strato — piano, temperatura, colla stick, velocità, Z-offset
---

# Scarsa adesione

La scarsa adesione è uno dei problemi più comuni nella stampa 3D. Il primo strato non aderisce, o le stampe si staccano a metà lavoro.

## Sintomi

- Il primo strato non aderisce — la stampa si muove o si solleva
- Angoli e bordi si sollevano (warping)
- La stampa si stacca a metà lavoro
- Primo strato irregolare con buchi o fili sciolti

## Lista di controllo — prova in quest'ordine

### 1. Pulisci il piano
La causa più comune di scarsa adesione è il grasso o lo sporco sul piano.

```
1. Pulisci il piano con IPA (alcool isopropilico)
2. Evita di toccare la superficie di stampa con le dita nude
3. In caso di problemi persistenti: lava con acqua e detergente delicato
```

### 2. Calibra il Z-offset

Il Z-offset è l'altezza tra l'ugello e il piano al primo strato. Troppo alto = il filo è sospeso. Troppo basso = l'ugello graffia il piano.

**Z-offset corretto:**
- Il primo strato deve sembrare leggermente trasparente
- Il filo deve essere premuto verso il piano con un leggero «schiacciamento»
- I fili devono fondersi leggermente l'uno nell'altro

Regola il Z-offset tramite **Controllo → Regola Z in diretta** durante la stampa.

:::tip Regola in diretta mentre stampi
Bambu Dashboard mostra i pulsanti di regolazione Z-offset durante una stampa attiva. Regola in passi di ±0,02 mm mentre osservi il primo strato.
:::

### 3. Controlla la temperatura del piano

| Materiale | Temperatura troppo bassa | Consigliata |
|-----------|-------------|---------|
| PLA | Sotto 30 °C | 35–45 °C |
| PETG | Sotto 60 °C | 70–85 °C |
| ABS | Sotto 80 °C | 90–110 °C |
| TPU | Sotto 25 °C | 30–45 °C |

Prova ad aumentare la temperatura del piano di 5 °C alla volta.

### 4. Usa la colla stick

La colla stick migliora l'adesione per la maggior parte dei materiali su quasi tutti i piani:
- Applica uno strato sottile e uniforme
- Lascia asciugare 30 secondi prima di iniziare
- Particolarmente importante per: ABS, PA, PC, PETG (su PEI liscio)

### 5. Riduci la velocità del primo strato

Una velocità più bassa al primo strato migliora il contatto tra filamento e piano:
- Standard: 50 mm/s per il primo strato
- Prova: 30–40 mm/s
- Bambu Studio: in **Qualità → Velocità primo strato**

### 6. Controlla le condizioni del piano

Un piano consumato dà scarsa adesione anche con le impostazioni perfette. Sostituisci il piano se:
- Il rivestimento PEI è visibilmente danneggiato
- La pulizia non aiuta

### 7. Usa il brim

Per i materiali con tendenza al warping (ABS, PA, oggetti grandi e piatti):
- Aggiungi un brim nel slicer: 5–10 mm di larghezza
- Aumenta la superficie di contatto e tiene fermi i bordi

## Casi speciali

### Oggetti grandi e piatti
Gli oggetti grandi e piatti sono i più soggetti a staccarsi. Rimedi:
- Brim 8–10 mm
- Aumenta la temperatura del piano
- Chiudi la camera (ABS/PA)
- Riduci il raffreddamento del pezzo

### Superfici vetrificate
Piani con troppa colla stick accumulata nel tempo possono diventare vetrificati. Lava accuratamente con acqua e ricomincia.

### Dopo cambio filamento
Materiali diversi richiedono impostazioni diverse. Verifica che temperatura del piano e piano siano configurati per il nuovo materiale.
