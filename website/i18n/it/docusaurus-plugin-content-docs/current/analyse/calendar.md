---
sidebar_position: 2
title: Calendario Attività
description: Calendario heatmap in stile GitHub che mostra l'attività della stampante giorno per giorno durante l'anno, con selettore anno e visualizzazione dettagliata
---

# Calendario Attività

Il Calendario Attività mostra una panoramica visiva dell'attività della tua stampante durante tutto l'anno — ispirato alla visualizzazione dei contributi di GitHub.

Vai a: **https://localhost:3443/#calendar**

## Panoramica Heatmap

Il calendario mostra 365 giorni (52 settimane) come una griglia di riquadri colorati:

- **Grigio** — nessuna stampa in quel giorno
- **Verde chiaro** — 1–2 stampe
- **Verde** — 3–5 stampe
- **Verde scuro** — 6–10 stampe
- **Verde intenso** — 11+ stampe

I riquadri sono organizzati con i giorni della settimana in verticale (Lun–Dom) e le settimane in orizzontale da sinistra (gennaio) a destra (dicembre).

:::tip Codifica colore
Puoi cambiare la metrica della heatmap da **Numero di stampe** a **Ore** o **Grammi di filamento** tramite il selettore sopra il calendario.
:::

## Selettore Anno

Clicca su **< Anno >** per navigare tra gli anni:

- Tutti gli anni con attività di stampa registrata sono disponibili
- L'anno corrente viene mostrato per impostazione predefinita
- Il futuro è grigio (nessun dato)

## Visualizzazione Dettagliata per Giorno

Clicca su un riquadro per vedere i dettagli del giorno selezionato:

- **Data** e giorno della settimana
- **Numero di stampe** — riuscite e fallite
- **Filamento totale utilizzato** (grammi)
- **Ore totali di stampa**
- **Elenco delle stampe** — clicca per aprire nella cronologia

## Panoramica Mensile

Sotto la heatmap viene mostrata una panoramica mensile con:
- Stampe totali per mese come grafico a barre
- Giorno migliore del mese evidenziato
- Confronto con lo stesso mese dell'anno precedente (%)

## Filtro Stampante

Seleziona la stampante dall'elenco a discesa in alto per mostrare l'attività solo per una stampante, oppure seleziona **Tutte** per la visualizzazione aggregata.

La visualizzazione multi-stampante mostra i colori in pila cliccando su **In pila** nel selettore di visualizzazione.

## Streak e Record

Sotto il calendario vengono mostrati:

| Statistica | Descrizione |
|---|---|
| **Streak più lunga** | Maggior numero di giorni consecutivi con almeno una stampa |
| **Streak attuale** | Serie in corso di giorni attivi |
| **Giorno più attivo** | Il giorno con il maggior numero di stampe in totale |
| **Settimana più attiva** | La settimana con il maggior numero di stampe |
| **Mese più attivo** | Il mese con il maggior numero di stampe |

## Esportazione

Clicca su **Esporta** per scaricare i dati del calendario:

- **PNG** — immagine della heatmap (per la condivisione)
- **CSV** — dati grezzi con una riga per giorno (data, numero, grammi, ore)

L'esportazione PNG è ottimizzata per la condivisione sui social media con il nome della stampante e l'anno come sottotitolo.
