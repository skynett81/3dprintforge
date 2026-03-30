---
sidebar_position: 4
title: Calcolatore Costi
description: Carica un file 3MF o GCode e calcola il costo totale di filamento, elettricità e usura della macchina prima di stampare
---

# Calcolatore Costi

Il Calcolatore Costi ti permette di stimare il costo totale di una stampa prima di inviarla alla stampante — basato sul consumo di filamento, il prezzo dell'energia elettrica e l'usura della macchina.

Vai a: **https://localhost:3443/#cost-estimator**

## Carica File

1. Vai al **Calcolatore Costi**
2. Trascina e rilascia un file nel campo di caricamento, oppure clicca su **Seleziona file**
3. Formati supportati: `.3mf`, `.gcode`, `.bgcode`
4. Clicca su **Analizza**

:::info Analisi
Il sistema analizza il G-code per estrarre il consumo di filamento, il tempo di stampa stimato e il profilo materiale. Di solito richiede 2–10 secondi.
:::

## Calcolo Filamento

Dopo l'analisi viene mostrato:

| Campo | Valore (esempio) |
|---|---|
| Filamento stimato | 47,3 g |
| Materiale (dal file) | PLA |
| Prezzo per grammo | 0,025 € (dal magazzino filamento) |
| **Costo filamento** | **1,18 €** |

Cambia il materiale nell'elenco a discesa per confrontare i costi con diversi tipi di filamento o fornitori.

:::tip Override materiale
Se il G-code non contiene informazioni sul materiale, seleziona manualmente il materiale dall'elenco. Il prezzo viene recuperato automaticamente dal magazzino filamento.
:::

## Calcolo Elettricità

Il costo dell'elettricità viene calcolato in base a:

- **Tempo di stampa stimato** — dall'analisi del G-code
- **Potenza della stampante** — configurata per modello di stampante (W)
- **Prezzo energia** — prezzo fisso (€/kWh) oppure live da Tibber/Nordpool

| Campo | Valore (esempio) |
|---|---|
| Tempo di stampa stimato | 3 ore 22 min |
| Potenza stampante | 350 W (X1C) |
| Consumo stimato | 1,17 kWh |
| Prezzo energia | 0,25 €/kWh |
| **Costo elettricità** | **0,29 €** |

Attiva l'integrazione Tibber o Nordpool per utilizzare i prezzi orari pianificati in base all'orario di avvio desiderato.

## Usura Macchina

Il costo di usura viene stimato in base a:

- Tempo di stampa × costo orario per modello di stampante
- Usura aggiuntiva per materiali abrasivi (CF, GF, ecc.)

| Campo | Valore (esempio) |
|---|---|
| Tempo di stampa | 3 ore 22 min |
| Costo orario (usura) | 0,10 €/ora |
| **Costo usura** | **0,34 €** |

Il costo orario viene calcolato dai prezzi dei componenti e dalla durata di vita prevista (vedi [Previsione Usura](../monitoring/wearprediction)).

## Totale

| Voce di costo | Importo |
|---|---|
| Filamento | 1,18 € |
| Elettricità | 0,29 € |
| Usura macchina | 0,34 € |
| **Totale** | **1,81 €** |
| + Ricarico (30%) | 0,54 € |
| **Prezzo di vendita** | **2,35 €** |

Regola il ricarico nel campo percentuale per calcolare il prezzo di vendita consigliato al cliente.

## Salva Stima

Clicca su **Salva stima** per collegare l'analisi a un progetto:

1. Seleziona un progetto esistente o creane uno nuovo
2. La stima viene salvata e può essere utilizzata come base per la fattura
3. Il costo effettivo (dopo la stampa) viene automaticamente confrontato con la stima

## Calcolo Batch

Carica più file contemporaneamente per calcolare il costo totale di un set completo:

1. Clicca su **Modalità batch**
2. Carica tutti i file `.3mf`/`.gcode`
3. Il sistema calcola i costi individuali e sommati
4. Esporta il riepilogo come PDF o CSV
