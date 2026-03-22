---
sidebar_position: 1
title: Statistiche
description: Tasso di successo, consumo filamento, tendenze e indicatori chiave per tutte le stampanti Bambu Lab nel tempo
---

# Statistiche

La pagina Statistiche ti fornisce una panoramica completa dell'attività della tua stampante con indicatori chiave, tendenze e consumo di filamento per il periodo di tempo selezionato.

Vai a: **https://localhost:3443/#statistics**

## Indicatori Chiave

In cima alla pagina vengono mostrate quattro schede KPI:

| Indicatore | Descrizione |
|---|---|
| **Tasso di successo** | Percentuale di stampe riuscite sul totale |
| **Filamento totale** | Grammi usati nel periodo selezionato |
| **Ore totali di stampa** | Tempo di stampa accumulato |
| **Durata media stampa** | Durata mediana per stampa |

Ogni indicatore mostra la variazione rispetto al periodo precedente (↑ su / ↓ giù) come deviazione percentuale.

## Tasso di Successo

Il tasso di successo viene calcolato per stampante e in totale:

- **Riuscita** — stampa completata senza interruzioni
- **Interrotta** — fermata manualmente dall'utente
- **Fallita** — fermata da Print Guard, errori HMS o guasto hardware

Clicca sul grafico del tasso di successo per vedere quali stampe sono fallite e il motivo.

:::tip Migliorare il tasso di successo
Usa [Analisi Pattern Errori](../overvaaking/erroranalysis) per identificare e correggere le cause delle stampe fallite.
:::

## Tendenze

La visualizzazione delle tendenze mostra lo sviluppo nel tempo come grafico a linee:

1. Seleziona **Periodo di tempo**: Ultimi 7 / 30 / 90 / 365 giorni
2. Seleziona **Raggruppamento**: Giorno / Settimana / Mese
3. Seleziona **Metrica**: Numero stampe / Ore / Grammi / Tasso di successo
4. Clicca su **Confronta** per sovrapporre due metriche

Il grafico supporta lo zoom (rotella del mouse) e la panoramica (clicca e trascina).

## Consumo Filamento

Il consumo di filamento viene mostrato come:

- **Grafico a barre** — consumo per giorno/settimana/mese
- **Grafico a torta** — distribuzione tra materiali (PLA, PETG, ABS, ecc.)
- **Tabella** — elenco dettagliato con grammi totali, metri e costo per materiale

### Consumo per Stampante

Usa il filtro multi-selezione in cima per:
- Mostrare solo una stampante
- Confrontare due stampanti affiancate
- Vedere il totale aggregato per tutte le stampanti

## Calendario Attività

Visualizza una heatmap compatta in stile GitHub direttamente nella pagina delle statistiche (visualizzazione semplificata), oppure vai al [Calendario Attività](./calendar) completo per una visualizzazione più dettagliata.

## Esportazione

1. Clicca su **Esporta statistiche**
2. Seleziona l'intervallo di date e le metriche da includere
3. Scegli il formato: **CSV** (dati grezzi), **PDF** (report) o **JSON**
4. Il file viene scaricato

L'esportazione CSV è compatibile con Excel e Google Sheets per ulteriori analisi.

## Confronto con il Periodo Precedente

Attiva **Mostra periodo precedente** per sovrapporre i grafici con il periodo precedente corrispondente:

- Ultimi 30 giorni vs. i 30 giorni precedenti
- Mese corrente vs. mese precedente
- Anno corrente vs. anno precedente

Questo rende semplice vedere se stai stampando più o meno rispetto a prima, e se il tasso di successo sta migliorando.
