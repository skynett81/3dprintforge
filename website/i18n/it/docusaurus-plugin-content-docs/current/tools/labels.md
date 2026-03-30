---
sidebar_position: 1
title: Etichette
description: Genera QR code, etichette bobina per stampanti termiche (ZPL), schede colore e palette condivise per il magazzino filamento
---

# Etichette

Lo strumento etichette genera etichette professionali per le tue bobine di filamento — QR code, etichette per stampanti termiche e schede colore per l'identificazione visiva.

Vai a: **https://localhost:3443/#labels**

## QR code

Genera QR code che collegano alle informazioni del filamento nel dashboard:

1. Vai a **Etichette → QR code**
2. Seleziona la bobina per cui generare il QR code
3. Il QR code viene generato automaticamente e mostrato nell'anteprima
4. Clicca **Scarica PNG** o **Stampa**

Il QR code contiene un URL al profilo filamento nel dashboard. Scansiona con il telefono per accedere rapidamente alle informazioni sulla bobina.

### Generazione in blocco

1. Clicca **Seleziona tutto** o spunta le singole bobine
2. Clicca **Genera tutti i QR code**
3. Scarica come ZIP con un PNG per bobina, o stampa tutto in una volta

## Etichette bobina

Etichette professionali per stampanti termiche con tutte le informazioni sulla bobina:

### Contenuto etichetta (standard)

- Colore bobina (blocco colore pieno)
- Nome materiale (testo grande)
- Fornitore
- Codice hex colore
- Temperature consigliate (ugello e piano)
- QR code
- Codice a barre (opzionale)

### ZPL per stampanti termiche

Genera codice ZPL (Zebra Programming Language) per stampanti Zebra, Brother e Dymo:

1. Vai a **Etichette → Stampa termica**
2. Seleziona la dimensione etichetta: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Seleziona la/le bobina/e
4. Clicca **Genera ZPL**
5. Invia il codice ZPL alla stampante tramite:
   - **Stampa diretta** (connessione USB)
   - **Copia ZPL** e invia tramite comando terminale
   - **Scarica file .zpl**

:::tip Configurazione stampante
Per la stampa automatica, configura la stazione di stampa in **Impostazioni → Stampante etichette** con indirizzo IP e porta (predefinito: 9100 per RAW TCP).
:::

### Etichette PDF

Per stampanti normali, genera PDF con le dimensioni corrette:

1. Seleziona la dimensione etichetta dal modello
2. Clicca **Genera PDF**
3. Stampa su carta adesiva (Avery o equivalente)

## Schede colore

Le schede colore sono una griglia compatta che mostra visivamente tutte le bobine:

1. Vai a **Etichette → Schede colore**
2. Seleziona quali bobine includere (tutte le attive, o seleziona manualmente)
3. Seleziona il formato della carta: **A4** (4×8), **A3** (6×10), **Letter**
4. Clicca **Genera PDF**

Ogni riquadro mostra:
- Blocco colore con il colore reale
- Nome materiale e hex colore
- Numero materiale (per riferimento rapido)

Ideale da plastificare e appendere vicino alla postazione stampante.

## Palette colori condivise

Esporta una selezione di colori come palette condivisa:

1. Vai a **Etichette → Palette colori**
2. Seleziona le bobine da includere nella palette
3. Clicca **Condividi palette**
4. Copia il link — altri possono importare la palette nel loro dashboard
5. La palette viene mostrata con codici hex e può essere esportata in **Adobe Swatch** (`.ase`) o **Procreate** (`.swatches`)
