---
sidebar_position: 3
title: Panoramica Parco Macchine
description: Gestisci e monitora tutte le stampanti Bambu Lab in una griglia con ordinamento, filtro e stato in tempo reale
---

# Panoramica Parco Macchine

La Panoramica Parco Macchine ti offre una vista compatta di tutte le stampanti collegate in una pagina. Perfetta per officine, aule o chiunque abbia più di una stampante.

Vai a: **https://localhost:3443/#fleet**

## Griglia Multi-Stampante

Tutte le stampanti registrate vengono mostrate in una griglia responsiva:

- **Dimensione scheda** — Piccola (compatta), Media (standard), Grande (dettagliata)
- **Numero colonne** — Si adatta automaticamente alla larghezza dello schermo, o impostato manualmente
- **Aggiornamento** — Ogni scheda si aggiorna indipendentemente tramite MQTT

Ogni scheda stampante mostra:
| Campo | Descrizione |
|---|---|
| Nome stampante | Nome configurato con icona modello |
| Stato | In standby / In stampa / Pausa / Errore / Disconnessa |
| Avanzamento | Barra percentuale con tempo rimanente |
| Temperatura | Ugello e piano (compatto) |
| Filamento attivo | Colore e materiale dall'AMS |
| Miniatura videocamera | Immagine fissa aggiornata ogni 30 secondi |

## Indicatore di Stato per Stampante

I colori di stato rendono facile vedere la condizione a distanza:

- **Pulsante verde** — In stampa attiva
- **Blu** — In standby e pronta
- **Giallo** — In pausa (manuale o da Print Guard)
- **Rosso** — Errore rilevato
- **Grigio** — Disconnessa o non raggiungibile

:::tip Modalità Kiosk
Usa la panoramica parco macchine in modalità kiosk su uno schermo a parete. Vedi [Modalità Kiosk](../system/kiosk) per la configurazione.
:::

## Ordinamento

Clicca su **Ordina** per scegliere l'ordine:

1. **Nome** — Alfabetico A–Z
2. **Stato** — Stampanti attive in cima
3. **Avanzamento** — Più avanzate in cima
4. **Ultima attività** — Usate più di recente in cima
5. **Modello** — Raggruppate per modello di stampante

L'ordinamento viene ricordato alla prossima visita.

## Filtro

Usa il campo filtro in cima per limitare la visualizzazione:

- Digita il nome della stampante o parte di esso
- Seleziona **Stato** dall'elenco a discesa (Tutte / In stampa / In standby / Errore)
- Seleziona **Modello** per mostrare solo un tipo di stampante (X1C, P1S, A1, ecc.)
- Clicca su **Azzera filtro** per mostrare tutte

:::info Ricerca
La ricerca filtra in tempo reale senza ricaricare la pagina.
:::

## Azioni dalla Panoramica Parco Macchine

Fai clic destro su una scheda (o clicca sui tre puntini) per azioni rapide:

- **Apri dashboard** — Vai direttamente al pannello principale della stampante
- **Metti in pausa** — Mette in pausa la stampante
- **Ferma stampa** — Interrompe la stampa in corso (richiede conferma)
- **Visualizza videocamera** — Apre la visualizzazione videocamera in popup
- **Vai alle impostazioni** — Apre le impostazioni della stampante

:::danger Ferma stampa
Fermare una stampa non è reversibile. Conferma sempre nella finestra di dialogo che appare.
:::

## Statistiche Aggregate

In cima alla panoramica parco macchine viene mostrata una riga di riepilogo:

- Numero totale di stampanti
- Numero di stampe attive
- Consumo totale filamento oggi
- Tempo stimato di completamento per la stampa in corso più lunga
