---
sidebar_position: 6
title: Analisi dei Pattern di Errore
description: Analisi AI dei pattern di errore, correlazioni tra errori e fattori ambientali, e suggerimenti concreti di miglioramento
---

# Analisi dei Pattern di Errore

L'analisi dei pattern di errore utilizza i dati storici delle stampe e degli errori per identificare schemi, cause e correlazioni — fornendoti suggerimenti concreti di miglioramento.

Vai a: **https://localhost:3443/#error-analysis**

## Cosa viene analizzato

Il sistema analizza i seguenti punti dati:

- Codici errore HMS e relativi timestamp
- Tipo di filamento e fornitore al momento dell'errore
- Temperatura al momento dell'errore (ugello, piano, camera)
- Velocità e profilo di stampa
- Ora del giorno e giorno della settimana
- Tempo dall'ultima manutenzione
- Modello stampante e versione firmware

## Analisi delle correlazioni

Il sistema ricerca correlazioni statistiche tra errori e fattori:

**Esempi di correlazioni rilevate:**
- «Il 78% degli errori di blocco AMS si verifica con filamenti del fornitore X»
- «L'intasamento ugello si verifica 3 volte più spesso dopo 6+ ore di stampa continua»
- «Gli errori di adesione aumentano con temperatura camera sotto i 18°C»
- «Gli errori di stringing correlano con umidità superiore al 60% (se igrometro collegato)»

Le correlazioni con significatività statistica (p < 0,05) vengono mostrate in cima.

:::info Requisiti dati
L'analisi è più accurata con almeno 50 stampe nella cronologia. Con meno stampe vengono mostrate stime con bassa confidenza.
:::

## Suggerimenti di miglioramento

In base alle analisi vengono generati suggerimenti concreti:

| Tipo di suggerimento | Esempio |
|---|---|
| Filamento | «Cambia fornitore per PA-CF — 3 errori su 4 usavano FornitoreX» |
| Temperatura | «Aumenta la temperatura del piano di 5°C per PETG — gli errori di adesione si ridurrebbero del 60% stimato» |
| Velocità | «Riduci la velocità all'80% dopo 4 ore — i blocchi ugello si ridurrebbero del 45% stimato» |
| Manutenzione | «Pulisci l'ingranaggio dell'estrusore — l'usura correla con il 40% degli errori di estrusione» |
| Calibrazione | «Esegui il livellamento del piano — 12 dei 15 errori di adesione dell'ultima settimana correlano con calibrazione errata» |

Ogni suggerimento mostra:
- Effetto stimato (riduzione % degli errori)
- Confidenza (bassa / media / alta)
- Implementazione passo per passo
- Link alla documentazione pertinente

## Impatto sul punteggio di salute

L'analisi è collegata al punteggio di salute (vedi [Diagnostica](./diagnostics)):

- Mostra quali fattori abbassano maggiormente il punteggio
- Stima il miglioramento del punteggio implementando ciascun suggerimento
- Ordina i suggerimenti per potenziale miglioramento del punteggio

## Visualizzazione timeline

Vai a **Analisi Errori → Timeline** per vedere una panoramica cronologica:

1. Seleziona la stampante e il periodo di tempo
2. Gli errori vengono mostrati come punti sulla timeline, con colori per tipo
3. Linee orizzontali segnano le attività di manutenzione
4. I cluster di errori (molti errori in poco tempo) sono evidenziati in rosso

Clicca su un cluster per aprire l'analisi dello specifico periodo.

## Report

Genera un report PDF dell'analisi degli errori:

1. Clicca **Genera report**
2. Seleziona il periodo di tempo (es. ultimi 90 giorni)
3. Scegli il contenuto: correlazioni, suggerimenti, timeline, punteggio di salute
4. Scarica il PDF o invialo per email

I report vengono salvati nei progetti se la stampante è collegata a un progetto.

:::tip Revisione settimanale
Configura un report email settimanale automatico in **Impostazioni → Report** per tenerti aggiornato senza visitare manualmente il dashboard. Vedi [Report](../system/reports).
:::
