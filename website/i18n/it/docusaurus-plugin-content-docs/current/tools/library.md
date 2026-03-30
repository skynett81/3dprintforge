---
sidebar_position: 2
title: Libreria File
description: Carica e gestisci modelli 3D e file G-code, analizza il G-code e collegati a MakerWorld e Printables
---

# Libreria File

La libreria file è un luogo centralizzato per archiviare e gestire tutti i tuoi modelli 3D e file G-code — con analisi automatica del G-code e integrazione con MakerWorld e Printables.

Vai a: **https://localhost:3443/#library**

## Caricare modelli

### Caricamento singolo

1. Vai a **Libreria File**
2. Clicca **Carica** o trascina i file nell'area di caricamento
3. Formati supportati: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Il file viene analizzato automaticamente dopo il caricamento

:::info Cartella di archiviazione
I file vengono salvati nella cartella configurata in **Impostazioni → Libreria File → Cartella di archiviazione**. Predefinito: `./data/library/`
:::

### Caricamento in blocco

Trascina un'intera cartella per caricare tutti i file supportati in una volta. I file vengono elaborati in background e riceverai una notifica al termine.

## Analisi G-code

Dopo il caricamento, i file `.gcode` e `.bgcode` vengono analizzati automaticamente:

| Metrica | Descrizione |
|---|---|
| Tempo di stampa stimato | Tempo calcolato dai comandi G-code |
| Consumo filamento | Grammi e metri per materiale/colore |
| Contatore strati | Numero totale di strati |
| Spessore strato | Spessore strato rilevato |
| Materiali | Materiali rilevati (PLA, PETG, ecc.) |
| Percentuale infill | Se disponibile nei metadati |
| Materiale di supporto | Peso supporto stimato |
| Modello stampante | Stampante target dai metadati |

I dati dell'analisi vengono mostrati nella scheda file e utilizzati dal [Calcolatore Costi](../analytics/costestimator).

## Schede file e metadati

Ogni scheda file mostra:
- **Nome file** e formato
- **Data di caricamento**
- **Miniatura** (da `.3mf` o generata)
- **Tempo di stampa analizzato** e consumo filamento
- **Tag** e categoria
- **Stampe associate** — quante volte stampato

Clicca su una scheda per aprire la visualizzazione dettagliata con metadati completi e cronologia.

## Organizzazione

### Tag

Aggiungi tag per una ricerca semplice:
1. Clicca sul file → **Modifica metadati**
2. Inserisci i tag (separati da virgola): `benchy, test, PLA, calibrazione`
3. Cerca nella libreria con il filtro tag

### Categorie

Organizza i file in categorie:
- Clicca **Nuova categoria** nella barra laterale
- Trascina i file nella categoria
- Le categorie possono essere annidate (sottocategorie supportate)

## Collegamento a MakerWorld

1. Vai a **Impostazioni → Integrazioni → MakerWorld**
2. Accedi con il tuo account Bambu Lab
3. Torna nella libreria: clicca su un file → **Collega a MakerWorld**
4. Cerca il modello su MakerWorld e seleziona la corrispondenza corretta
5. I metadati (designer, licenza, valutazione) vengono importati da MakerWorld

Il collegamento mostra il nome del designer e l'URL originale sulla scheda file.

## Collegamento a Printables

1. Vai a **Impostazioni → Integrazioni → Printables**
2. Incolla la tua chiave API Printables
3. Collega i file ai modelli Printables allo stesso modo di MakerWorld

## Inviare alla stampante

Dalla libreria file puoi inviare direttamente alla stampante:

1. Clicca sul file → **Invia alla stampante**
2. Seleziona la stampante di destinazione
3. Seleziona lo slot AMS (per stampe multicolore)
4. Clicca **Avvia stampa** o **Aggiungi alla coda**

:::warning Invio diretto
L'invio diretto avvia la stampa immediatamente senza conferma in Bambu Studio. Assicurati che la stampante sia pronta.
:::
