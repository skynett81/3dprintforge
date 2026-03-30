---
sidebar_position: 5
title: Predizione Usura
description: Analisi predittiva di 8 componenti della stampante con calcolo durata, avvisi manutenzione e previsione costi
---

# Predizione Usura

La predizione usura calcola la vita utile attesa dei componenti critici in base all'utilizzo effettivo, al tipo di filamento e al comportamento della stampante — così puoi pianificare la manutenzione in modo proattivo anziché reattivo.

Vai a: **https://localhost:3443/#wear**

## Componenti monitorati

Bambu Dashboard traccia l'usura di 8 componenti per stampante:

| Componente | Fattore di usura primario | Durata tipica |
|---|---|---|
| **Ugello (ottone)** | Tipo filamento + ore | 300–800 ore |
| **Ugello (acciaio indurito)** | Ore + materiale abrasivo | 1500–3000 ore |
| **Tubo PTFE** | Ore + alta temperatura | 500–1500 ore |
| **Ingranaggio estrusore** | Ore + materiale abrasivo | 1000–2000 ore |
| **Guide asse X (CNC)** | Numero stampe + velocità | 2000–5000 ore |
| **Superficie piano di stampa** | Numero stampe + temperatura | 200–500 stampe |
| **Ingranaggi AMS** | Numero cambi filamento | 5000–15000 cambi |
| **Ventole camera** | Ore di funzionamento | 3000–8000 ore |

## Calcolo dell'usura

L'usura viene calcolata come percentuale complessiva (0–100% consumato):

```
Usura % = (utilizzo effettivo / vita attesa) × 100
        × moltiplicatore materiale
        × moltiplicatore velocità
```

**Moltiplicatori materiale:**
- PLA, PETG: 1,0× (usura normale)
- ABS, ASA: 1,1× (leggermente più aggressivo)
- PA, PC: 1,2× (duro su PTFE e ugello)
- Compositi CF/GF: 2,0–3,0× (estremamente abrasivo)

:::warning Fibra di carbonio
I filamenti rinforzati in fibra di carbonio (CF-PLA, CF-PA, ecc.) consumano gli ugelli in ottone estremamente rapidamente. Usa un ugello in acciaio indurito e aspettati un'usura 2–3 volte più rapida.
:::

## Calcolo durata residua

Per ogni componente viene mostrato:

- **Usura attuale** — percentuale consumata
- **Vita residua stimata** — ore o stampe
- **Data di scadenza stimata** — basata sull'utilizzo medio degli ultimi 30 giorni
- **Intervallo di confidenza** — margine di incertezza della previsione

Clicca su un componente per vedere un grafico dettagliato dell'accumulo di usura nel tempo.

## Avvisi

Configura avvisi automatici per componente:

1. Vai a **Usura → Impostazioni**
2. Per ogni componente, imposta la **Soglia avviso** (consigliato: 75% e 90%)
3. Seleziona il canale di notifica (vedi [Notifiche](../features/notifications))

**Esempio di messaggio di avviso:**
> ⚠️ Ugello (ottone) su La mia X1C è consumato all'78%. Vita residua stimata: ~45 ore. Consiglio: pianifica la sostituzione ugello.

## Costo manutenzione

Il modulo usura si integra con il registro costi:

- **Costo per componente** — prezzo del ricambio
- **Costo sostituzione totale** — somma per tutti i componenti vicini al limite
- **Previsione prossimi 6 mesi** — costo manutenzione stimato in avanti

Inserisci i prezzi dei componenti in **Usura → Prezzi**:

1. Clicca **Imposta prezzi**
2. Inserisci il prezzo unitario per ogni componente
3. Il prezzo viene utilizzato nelle previsioni di costo e può variare per modello di stampante

## Azzerare il contatore usura

Dopo la manutenzione, azzera il contatore per il componente interessato:

1. Vai a **Usura → [Nome componente]**
2. Clicca **Segna come sostituito**
3. Compila:
   - Data della sostituzione
   - Costo (opzionale)
   - Nota (opzionale)
4. Il contatore di usura viene azzerato e ricalcolato

Le sostituzioni vengono mostrate nella cronologia manutenzione.

:::tip Calibrazione
Confronta la predizione di usura con i dati di esperienza effettiva e regola i parametri di vita in **Usura → Configura durata** per adattare i calcoli al tuo utilizzo reale.
:::
