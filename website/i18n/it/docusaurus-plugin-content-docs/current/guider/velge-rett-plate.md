---
sidebar_position: 4
title: Scegliere il piano di stampa corretto
description: Panoramica dei piani di stampa Bambu Labs e quale si adatta meglio al tuo filamento
---

# Scegliere il piano di stampa corretto

Il piano di stampa giusto è fondamentale per una buona adesione e una facile rimozione della stampa. Una combinazione sbagliata comporta o una scarsa adesione o una stampa incollata che danneggia il piano.

## Tabella di riepilogo

| Filamento | Piano consigliato | Colla stick | Temperatura piano |
|-----------|-------------------|-------------|-------------------|
| PLA | Cool Plate / Textured PEI | No / Sì | 35–45°C |
| PETG | Textured PEI | **Sì (obbligatorio)** | 70°C |
| ABS | Engineering Plate / High Temp | Sì | 90–110°C |
| ASA | Engineering Plate / High Temp | Sì | 90–110°C |
| TPU | Textured PEI | No | 35–45°C |
| PA (Nylon) | Engineering Plate | Sì | 90°C |
| PC | High Temp Plate | Sì | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Sì | 45–90°C |
| PVA | Cool Plate | No | 35°C |

## Descrizione dei piani

### Cool Plate (PEI liscio)
**Migliore per:** PLA, PVA
**Superficie:** Lisa, dà una superficie inferiore liscia alla stampa
**Rimozione:** Piega leggermente il piano o aspetta che si raffreddi — la stampa si stacca da sola

Non usare il Cool Plate con PETG — si attacca **troppo bene** e può staccare il rivestimento dal piano.

### Textured PEI (Strutturato)
**Migliore per:** PETG, TPU, PLA (dà superficie ruvida)
**Superficie:** Strutturata, dà un aspetto ruvido ed estetico alla superficie inferiore
**Rimozione:** Aspetta a temperatura ambiente — si stacca da sola

:::warning Il PETG richiede la colla stick su Textured PEI
Senza colla stick il PETG aderisce estremamente bene al Textured PEI e può staccare il rivestimento durante la rimozione. Applica sempre un sottile strato di colla stick (colla Bambu o Elmer's Disappearing Purple Glue) su tutta la superficie.
:::

### Engineering Plate
**Migliore per:** ABS, ASA, PA, PLA-CF, PETG-CF
**Superficie:** Ha una superficie PEI opaca con aderenza inferiore rispetto al Textured PEI
**Rimozione:** Facile da rimuovere dopo il raffreddamento. Usa la colla stick per ABS/ASA

### High Temp Plate
**Migliore per:** PC, PA-CF, ABS ad alte temperature
**Superficie:** Sopporta temperature del piano fino a 120°C senza deformazione
**Rimozione:** Raffredda a temperatura ambiente

## Errori comuni

### PETG su Cool Plate liscio (senza colla stick)
**Problema:** Il PETG si lega così forte che la stampa non può essere rimossa senza danni
**Soluzione:** Usa sempre Textured PEI con colla stick, o Engineering Plate

### ABS su Cool Plate
**Problema:** Warping — gli angoli si sollevano durante la stampa
**Soluzione:** Engineering Plate + colla stick + aumentare la temperatura della camera (chiudi il coperchio frontale)

### PLA su High Temp Plate
**Problema:** Temperatura del piano troppo alta dà un'aderenza eccessiva, difficile rimozione
**Soluzione:** Cool Plate o Textured PEI per PLA

### Troppa colla stick
**Problema:** La colla stick spessa crea l'effetto elefante (primo strato che si allarga)
**Soluzione:** Un solo strato sottile — la colla stick dovrebbe essere appena visibile

## Cambiare il piano

1. **Lascia raffreddare il piano** a temperatura ambiente (o usa i guanti — il piano può essere caldo)
2. Solleva il piano dalla parte frontale e tira fuori
3. Inserisci il nuovo piano — il magnete lo tiene in posizione
4. **Esegui la calibrazione automatica** (Flow Rate e Bed Leveling) dopo la sostituzione del piano in Bambu Studio o tramite il dashboard sotto **Controllo → Calibrazione**

:::info Ricorda di calibrare dopo la sostituzione
I piani hanno spessori leggermente diversi. Senza calibrazione il primo strato potrebbe essere troppo lontano o schiantarsi contro il piano.
:::

## Manutenzione dei piani

### Pulizia (ogni 2–5 stampe)
- Pulisci con IPA (isopropanolo 70–99%) e un panno privo di pelucchi
- Evita di toccare la superficie con le mani nude — il grasso della pelle riduce l'aderenza
- Per il Textured PEI: lava con acqua tiepida e detergente delicato dopo molte stampe

### Rimozione residui di colla stick
- Scalda il piano a 60°C
- Pulisci con un panno umido
- Finisci con una pulizia con IPA

### Sostituzione
Sostituisci il piano quando vedi:
- Fossette o segni visibili dopo la rimozione delle stampe
- Scarsa adesione costante anche dopo la pulizia
- Bolle o macchie nel rivestimento

I piani Bambu durano tipicamente 200–500 stampe a seconda del tipo di filamento e della cura.

:::tip Conserva correttamente i piani
Conserva i piani inutilizzati nella confezione originale o in piedi in un supporto — non impilati con cose pesanti sopra. I piani deformati danno un primo strato irregolare.
:::
