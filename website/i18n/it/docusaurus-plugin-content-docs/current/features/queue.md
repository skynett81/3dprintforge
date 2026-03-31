---
sidebar_position: 5
title: Coda di Stampa
description: Pianifica e automatizza le stampe con coda prioritizzata, dispatch automatico e avvio scaglionato
---

# Coda di Stampa

La Coda di Stampa ti permette di pianificare le stampe in anticipo e inviarle automaticamente alle stampanti disponibili quando sono libere.

Vai a: **https://localhost:3443/#queue**

## Creare una Coda

1. Vai a **Coda di Stampa** nel menu di navigazione
2. Clicca su **Nuovo lavoro** (icona +)
3. Compila:
   - **Nome file** — carica `.3mf` o `.gcode`
   - **Stampante target** — seleziona una stampante specifica o **Automatica**
   - **Priorità** — Bassa / Normale / Alta / Critica
   - **Avvio pianificato** — ora o una data/orario specifico
4. Clicca su **Aggiungi alla coda**

:::tip Trascina e rilascia
Puoi trascinare i file direttamente dall'esplora file alla pagina della coda per aggiungerli rapidamente.
:::

## Aggiungere File

### Carica file

1. Clicca su **Carica** o trascina un file nel campo di caricamento
2. Formati supportati: `.3mf`, `.gcode`, `.bgcode`
3. Il file viene salvato nella libreria file e collegato al lavoro in coda

### Dalla Libreria File

1. Vai a **Libreria File** e trova il file
2. Clicca su **Aggiungi alla coda** sul file
3. Il lavoro viene creato con le impostazioni predefinite — modifica se necessario

### Dalla Cronologia

1. Apri una stampa precedente in **Cronologia**
2. Clicca su **Ristampa**
3. Il lavoro viene aggiunto con le stesse impostazioni dell'ultima volta

## Priorità

La coda viene elaborata in ordine di priorità:

| Priorità | Colore | Descrizione |
|---|---|---|
| Critica | Rosso | Inviata alla prima stampante disponibile indipendentemente dagli altri lavori |
| Alta | Arancione | Davanti ai lavori normali e bassi |
| Normale | Blu | Ordine standard (FIFO) |
| Bassa | Grigio | Inviata solo quando nessun lavoro di priorità più alta è in attesa |

Trascina e rilascia i lavori nella coda per cambiare manualmente l'ordine all'interno dello stesso livello di priorità.

## Dispatch Automatico

Quando il **Dispatch automatico** è attivato, 3DPrintForge monitora tutte le stampanti e invia automaticamente il lavoro successivo:

1. Vai a **Impostazioni → Coda**
2. Attiva **Dispatch automatico**
3. Seleziona la **Strategia di dispatch**:
   - **Prima disponibile** — invia alla prima stampante che si libera
   - **Meno usata** — dà priorità alla stampante con meno stampe oggi
   - **Round-robin** — ruota equamente tra tutte le stampanti

:::warning Conferma
Attiva **Richiedi conferma** nelle impostazioni se vuoi approvare manualmente ogni dispatch prima che il file venga inviato.
:::

## Avvio Scaglionato

L'avvio scaglionato è utile per evitare che tutte le stampanti inizino e finiscano allo stesso tempo:

1. Nella finestra di dialogo **Nuovo lavoro**, espandi **Impostazioni avanzate**
2. Attiva **Avvio scaglionato**
3. Imposta il **Ritardo tra stampanti** (ad es. 30 minuti)
4. Il sistema distribuisce automaticamente gli orari di avvio

**Esempio:** 4 lavori identici con 30 minuti di ritardo iniziano alle 08:00, 08:30, 09:00 e 09:30.

## Stato Coda e Monitoraggio

La panoramica coda mostra tutti i lavori con stato:

| Stato | Descrizione |
|---|---|
| In attesa | Il lavoro è in coda e attende la stampante |
| Pianificato | Ha un orario di avvio pianificato nel futuro |
| In invio | Viene trasferito alla stampante |
| In stampa | In corso sulla stampante selezionata |
| Completato | Finito — collegato alla cronologia |
| Fallito | Errore durante l'invio o la stampa |
| Annullato | Annullato manualmente |

:::info Notifiche
Attiva le notifiche per gli eventi della coda in **Impostazioni → Notifiche → Coda** per ricevere un messaggio quando un lavoro inizia, completa o fallisce. Vedi [Notifiche](./notifications).
:::
