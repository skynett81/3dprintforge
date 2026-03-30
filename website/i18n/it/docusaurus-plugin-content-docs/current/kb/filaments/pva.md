---
sidebar_position: 8
title: PVA e materiali di supporto
description: Guida a PVA, HIPS, PVB e altri materiali di supporto per stampanti Bambu Lab
---

# PVA e materiali di supporto

I materiali di supporto vengono utilizzati per stampare geometrie complesse con sporgenze, ponti e cavità interne che non possono essere stampate senza supporto temporaneo. Dopo la stampa, il materiale di supporto viene rimosso — meccanicamente o per dissoluzione in un solvente.

## Panoramica

| Materiale | Solvente | Combinare con | Tempo di dissoluzione | Difficoltà |
|-----------|---------|--------------|----------------------|------------|
| PVA | Acqua | PLA, PETG | 12–24 ore | Impegnativo |
| HIPS | d-Limonene | ABS, ASA | 12–24 ore | Moderato |
| PVB | Isopropanolo (IPA) | PLA, PETG | 6–12 ore | Moderato |
| BVOH | Acqua | PLA, PETG, PA | 4–8 ore | Impegnativo |

---

## PVA (Alcol polivinilico)

Il PVA è un materiale di supporto solubile in acqua, la scelta più comune per stampe a base PLA con strutture di supporto complesse.

### Impostazioni

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 190–210 °C |
| Temperatura piatto | 45–60 °C |
| Raffreddamento pezzo | 100% |
| Velocità | 60–80% |
| Retrazione | Aumentata (6–8 mm) |

### Piani di stampa consigliati

| Piano | Idoneità | Colla stick? |
|-------|----------|-------------|
| Cool Plate (Smooth PEI) | Eccellente | No |
| Textured PEI | Buono | No |
| Engineering Plate | Buono | No |
| High Temp Plate | Evitare | — |

### Compatibilità

Il PVA funziona meglio con materiali che stampano a **temperature simili**:

| Materiale principale | Compatibilità | Note |
|---------------------|--------------|------|
| PLA | Eccellente | Combinazione ideale |
| PETG | Buona | La temperatura del piatto può essere un po' alta per il PVA |
| ABS/ASA | Scarsa | Temperatura camera troppo alta — il PVA si degrada |
| PA (Nylon) | Scarsa | Temperature troppo alte |

### Dissoluzione

- Immergere la stampa finita in **acqua tiepida** (ca. 40 °C)
- Il PVA si dissolve in **12–24 ore** a seconda dello spessore
- Mescolare l'acqua periodicamente per accelerare il processo
- Cambiare l'acqua ogni 6–8 ore per una dissoluzione più rapida
- Un pulitore a ultrasuoni dà risultati significativamente più rapidi (2–6 ore)

:::danger Il PVA è estremamente igroscopico
Il PVA assorbe umidità dall'aria **molto rapidamente** — anche ore di esposizione possono rovinare i risultati di stampa. Il PVA che ha assorbito umidità causa:

- Forte gorgogliamento e scoppiettii
- Scarsa adesione al materiale principale
- Stringing e superficie appiccicosa
- Ugello intasato

**Essiccare sempre il PVA immediatamente prima dell'uso** e stampare da un ambiente asciutto (scatola essiccatrice).
:::

### Essiccazione del PVA

| Parametro | Valore |
|-----------|--------|
| Temperatura di essiccazione | 45–55 °C |
| Tempo di essiccazione | 6–10 ore |
| Livello igroscopico | Estremamente alto |
| Metodo di conservazione | Scatola sigillata con essiccante, sempre |

---

## HIPS (Polistirene antiurto)

L'HIPS è un materiale di supporto che si dissolve nel d-limonene (solvente a base di agrumi). È il materiale di supporto preferito per ABS e ASA.

### Impostazioni

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220–240 °C |
| Temperatura piatto | 90–100 °C |
| Temperatura camera | 40–50 °C (consigliato) |
| Raffreddamento pezzo | 20–40% |
| Velocità | 70–90% |

### Compatibilità

| Materiale principale | Compatibilità | Note |
|---------------------|--------------|------|
| ABS | Eccellente | Combinazione ideale — temperature simili |
| ASA | Eccellente | Ottima adesione |
| PLA | Scarsa | Differenza di temperatura troppo grande |
| PETG | Scarsa | Comportamento termico diverso |

### Dissoluzione nel d-Limonene

- Immergere la stampa nel **d-limonene** (solvente a base di agrumi)
- Tempo di dissoluzione: **12–24 ore** a temperatura ambiente
- Il riscaldamento a 35–40 °C accelera il processo
- Il d-limonene può essere riutilizzato 2–3 volte
- Risciacquare il pezzo con acqua e asciugare dopo la dissoluzione

### Vantaggi rispetto al PVA

- **Molto meno sensibile all'umidità** — più facile da conservare e maneggiare
- **Più resistente come supporto** — sopporta di più senza degradarsi
- **Migliore compatibilità termica** con ABS/ASA
- **Più facile da stampare** — meno intasamenti e problemi

:::warning Il d-Limonene è un solvente
Usa guanti e lavora in un ambiente ventilato. Il d-limonene può irritare pelle e mucose. Conservare fuori dalla portata dei bambini.
:::

---

## PVB (Polivinil butirrale)

Il PVB è un materiale di supporto unico che si dissolve nell'isopropanolo (IPA) e può essere usato per levigare le superfici con vapore di IPA.

### Impostazioni

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 200–220 °C |
| Temperatura piatto | 55–75 °C |
| Raffreddamento pezzo | 80–100% |
| Velocità | 70–80% |

### Compatibilità

| Materiale principale | Compatibilità | Note |
|---------------------|--------------|------|
| PLA | Buona | Adesione accettabile |
| PETG | Moderata | La temperatura del piatto può variare |
| ABS/ASA | Scarsa | Temperature troppo alte |

### Levigatura superficiale con vapore di IPA

La proprietà unica del PVB è che la superficie può essere levigata con vapore di IPA:

1. Posizionare il pezzo in un contenitore chiuso
2. Mettere un panno inumidito di IPA sul fondo (senza contatto diretto con il pezzo)
3. Lasciare agire il vapore per **30–60 minuti**
4. Rimuovere e lasciare asciugare 24 ore
5. Il risultato è una superficie liscia e semi-lucida

:::tip PVB come finitura superficiale
Sebbene il PVB sia principalmente un materiale di supporto, può essere stampato come strato esterno su pezzi PLA per ottenere una superficie levigabile con IPA. Questo dà una finitura che ricorda l'ABS levigato con acetone.
:::

---

## Confronto materiali di supporto

| Proprietà | PVA | HIPS | PVB | BVOH |
|-----------|-----|------|-----|------|
| Solvente | Acqua | d-Limonene | IPA | Acqua |
| Tempo dissoluzione | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Sensibilità all'umidità | Estremamente alta | Bassa | Moderata | Estremamente alta |
| Difficoltà | Impegnativo | Moderato | Moderato | Impegnativo |
| Prezzo | Alto | Moderato | Alto | Molto alto |
| Migliore con | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Disponibilità | Buona | Buona | Limitata | Limitata |
| Compatibile AMS | Sì (con essiccante) | Sì | Sì | Problematico |

---

## Consigli per doppia estrusione e multicolore

### Linee guida generali

- **Quantità di spurgo** — i materiali di supporto richiedono un buon spurgo durante il cambio materiale (minimo 150–200 mm³)
- **Strati di interfaccia** — usa 2–3 strati di interfaccia tra supporto e pezzo principale per una superficie pulita
- **Distanza** — imposta la distanza di supporto a 0,1–0,15 mm per facile rimozione dopo la dissoluzione
- **Schema di supporto** — usa schema triangolare per PVA/BVOH, griglia per HIPS

### Configurazione AMS

- Posizionare il materiale di supporto in uno **slot AMS con essiccante**
- Per PVA: considerare una scatola essiccatrice esterna con collegamento Bowden
- Configurare il profilo materiale corretto in Bambu Studio
- Testare con un modello semplice con sporgenza prima di stampare pezzi complessi

### Problemi comuni e soluzioni

| Problema | Causa | Soluzione |
|----------|-------|----------|
| Il supporto non aderisce | Distanza troppo grande | Ridurre la distanza di interfaccia a 0,05 mm |
| Il supporto aderisce troppo | Distanza troppo piccola | Aumentare la distanza di interfaccia a 0,2 mm |
| Bolle nel materiale di supporto | Umidità | Essiccare bene il filamento |
| Stringing tra materiali | Retrazione insufficiente | Aumentare la retrazione di 1–2 mm |
| Superficie scadente verso il supporto | Pochi strati di interfaccia | Aumentare a 3–4 strati di interfaccia |

:::tip Inizia in modo semplice
Per la tua prima stampa con materiale di supporto: usa PLA + PVA, un modello semplice con sporgenza chiara (45°+) e impostazioni predefinite in Bambu Studio. Ottimizza man mano che acquisisci esperienza.
:::
