---
sidebar_position: 8
title: Galleria
description: Visualizza gli screenshot milestone acquisiti automaticamente al 25, 50, 75 e 100% di avanzamento per tutte le stampe
---

# Galleria

La Galleria raccoglie gli screenshot automatici acquisiti durante ogni stampa. Le immagini vengono scattate a milestone fisse e ti forniscono un registro visivo dello sviluppo della stampa.

Vai a: **https://localhost:3443/#gallery**

## Screenshot Milestone

Bambu Dashboard acquisisce automaticamente uno screenshot dalla videocamera alle seguenti milestone:

| Milestone | Momento |
|---|---|
| **25%** | Un quarto della stampa |
| **50%** | A metà |
| **75%** | Tre quarti della stampa |
| **100%** | Stampa completata |

Gli screenshot vengono salvati e collegati all'elemento corrispondente nella cronologia stampe, e vengono mostrati nella galleria.

:::info Requisiti
Gli screenshot milestone richiedono che la videocamera sia collegata e attiva. Le videocamere disattivate non generano immagini.
:::

## Attivare la Funzione Screenshot

1. Vai a **Impostazioni → Galleria**
2. Attiva **Screenshot milestone automatici**
3. Seleziona quali milestone vuoi attivare (tutte e quattro sono attive per impostazione predefinita)
4. Seleziona **Qualità immagine**: Bassa (640×360) / Media (1280×720) / Alta (1920×1080)
5. Clicca su **Salva**

## Visualizzazione Immagini

La galleria è organizzata per stampa:

1. Usa il **filtro** in cima per selezionare stampante, data o nome file
2. Clicca su una riga di stampa per espandere e vedere tutte e quattro le immagini
3. Clicca su un'immagine per aprire l'anteprima

### Anteprima

L'anteprima mostra:
- Immagine a dimensione intera
- Milestone e timestamp
- Nome stampa e stampante
- **←** / **→** per scorrere tra le immagini della stessa stampa

## Visualizzazione a Schermo Intero

Clicca su **Schermo intero** (o premi `F`) nell'anteprima per riempire tutto lo schermo. Usa i tasti freccia per scorrere tra le immagini.

## Scarica Immagini

- **Singola immagine**: Clicca su **Scarica** nell'anteprima
- **Tutte le immagini per una stampa**: Clicca su **Scarica tutte** sulla riga di stampa — ottieni un file `.zip`
- **Seleziona più**: Spunta le caselle di controllo e clicca su **Scarica selezionate**

## Elimina Immagini

:::warning Spazio di archiviazione
Le immagini della galleria possono occupare spazio significativo nel tempo. Configura l'eliminazione automatica delle immagini vecchie.
:::

### Eliminazione Manuale

1. Seleziona una o più immagini (spunta)
2. Clicca su **Elimina selezionate**
3. Conferma nella finestra di dialogo

### Pulizia Automatica

1. Vai a **Impostazioni → Galleria → Pulizia automatica**
2. Attiva **Elimina immagini più vecchie di**
3. Imposta il numero di giorni (ad es. 90 giorni)
4. La pulizia viene eseguita automaticamente ogni notte alle 03:00

## Collegamento alla Cronologia Stampe

Ogni immagine è collegata a un elemento di stampa nella cronologia:

- Clicca su **Vedi nella cronologia** su una stampa nella galleria per saltare all'elemento nella cronologia
- Nella cronologia viene mostrata una miniatura dell'immagine al 100% se disponibile

## Condivisione

Condividi un'immagine della galleria tramite link a tempo:

1. Apri l'immagine nell'anteprima
2. Clicca su **Condividi**
3. Seleziona il tempo di scadenza e copia il link
