---
sidebar_position: 5
title: Monitoraggio Sprechi
description: Monitora gli sprechi di filamento da purge AMS e materiale di supporto, calcola i costi e ottimizza l'efficienza
---

# Monitoraggio Sprechi

Il Monitoraggio Sprechi ti fornisce una visione completa di quanto filamento viene sprecato durante la stampa — purge AMS, spurgo durante i cambi materiale e materiale di supporto — e quanto ti costa.

Vai a: **https://localhost:3443/#waste**

## Categorie di Spreco

Bambu Dashboard distingue tre tipi di spreco:

| Categoria | Fonte | Quantità tipica |
|---|---|---|
| **Purge AMS** | Cambio colore in AMS durante la stampa multicolore | 5–30 g per cambio |
| **Spurgo cambio materiale** | Pulizia durante il cambio tra materiali diversi | 10–50 g per cambio |
| **Materiale di supporto** | Strutture di supporto rimosse dopo la stampa | Variabile |

## Monitoraggio Purge AMS

I dati di purge AMS vengono recuperati direttamente dalla telemetria MQTT e dall'analisi G-code:

- **Grammi per cambio colore** — calcolati dal blocco di purge G-code
- **Numero di cambi colore** — contati dal registro stampe
- **Consumo totale purge** — somma nel periodo selezionato

:::tip Ridurre il purge
Bambu Studio ha impostazioni per il volume di purge per combinazione di colori. Riduci il volume di purge per coppie di colori con bassa differenza cromatica (ad es. bianco → grigio chiaro) per risparmiare filamento.
:::

## Calcolo Efficienza

L'efficienza viene calcolata come:

```
Efficienza % = (materiale modello / consumo totale) × 100

Consumo totale = materiale modello + purge + materiale supporto
```

**Esempio:**
- Modello: 45 g
- Purge: 12 g
- Supporto: 8 g
- Totale: 65 g
- **Efficienza: 69%**

L'efficienza viene mostrata come grafico di tendenza nel tempo per vedere se stai migliorando.

## Costo dello Spreco

In base ai prezzi del filamento registrati viene calcolato:

| Voce | Calcolo |
|---|---|
| Costo purge | Grammi purge × prezzo/grammo per colore |
| Costo supporto | Grammi supporto × prezzo/grammo |
| **Costo totale spreco** | Somma di quanto sopra |
| **Costo per stampa riuscita** | Costo spreco / numero stampe |

## Spreco per Stampante e Materiale

Filtra la visualizzazione per:

- **Stampante** — vedi quale stampante genera più spreco
- **Materiale** — vedi lo spreco per tipo di filamento
- **Periodo** — giorno, settimana, mese, anno

La visualizzazione tabellare mostra un elenco ordinato con lo spreco maggiore in cima, incluso il costo stimato.

## Suggerimenti per l'Ottimizzazione

Il sistema genera automaticamente suggerimenti per ridurre gli sprechi:

- **Ordine colori invertito** — Se il purge da colore A→B è maggiore di B→A, il sistema suggerisce di invertire l'ordine
- **Unire strati cambio colore** — Raggruppa strati con lo stesso colore per minimizzare i cambi
- **Ottimizzazione strutture di supporto** — Stima la riduzione del supporto cambiando l'orientamento

:::info Precisione
I calcoli del purge sono stimati dal G-code. Lo spreco effettivo può variare del 10–20% a causa del comportamento della stampante.
:::

## Esportazione e Reportistica

1. Clicca su **Esporta dati spreco**
2. Seleziona periodo e formato (CSV / PDF)
3. I dati di spreco possono essere inclusi nei report di progetto e nelle fatture come voce di costo

Vedi anche [Analisi Filamento](./filamentanalytics) per una panoramica completa del consumo.
