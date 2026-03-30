---
sidebar_position: 9
title: Progetti
description: Organizza le stampe in progetti, monitora i costi, genera fatture e condividi i progetti con i clienti
---

# Progetti

I Progetti ti permettono di raggruppare stampe correlate, monitorare i costi dei materiali, fatturare ai clienti e condividere una panoramica del tuo lavoro.

Vai a: **https://localhost:3443/#projects**

## Creare un Progetto

1. Clicca su **Nuovo progetto** (icona +)
2. Compila:
   - **Nome progetto** — nome descrittivo (max 100 caratteri)
   - **Cliente** — account cliente opzionale (vedi [E-commerce](../integrations/ecommerce))
   - **Descrizione** — breve descrizione testuale
   - **Colore** — scegli un colore per l'identificazione visiva
   - **Tag** — parole chiave separate da virgola
3. Clicca su **Crea progetto**

## Collegare Stampe al Progetto

### Durante una Stampa

1. Apri il dashboard mentre una stampa è in corso
2. Clicca su **Collega al progetto** nel pannello laterale
3. Seleziona un progetto esistente o creane uno nuovo
4. La stampa viene automaticamente collegata al progetto al completamento

### Dalla Cronologia

1. Vai a **Cronologia**
2. Trova la stampa in questione
3. Clicca sulla stampa → **Collega al progetto**
4. Seleziona il progetto dall'elenco a discesa

### Collegamento di Massa

1. Seleziona più stampe nella cronologia con le caselle di controllo
2. Clicca su **Azioni → Collega al progetto**
3. Seleziona il progetto — tutte le stampe selezionate vengono collegate

## Panoramica Costi

Ogni progetto calcola i costi totali basandosi su:

| Tipo di costo | Sorgente |
|---|---|
| Consumo filamento | Grammi × prezzo per grammo per materiale |
| Elettricità | kWh × prezzo energia (da Tibber/Nordpool se configurato) |
| Usura macchina | Calcolata dalla [Previsione Usura](../monitoring/wearprediction) |
| Costo manuale | Voci in testo libero aggiunte manualmente |

La panoramica costi viene mostrata come tabella e grafico a torta per stampa e in totale.

:::tip Prezzi orari
Attiva l'integrazione Tibber o Nordpool per costi energetici accurati per stampa. Vedi [Prezzo Energia](../integrations/energy).
:::

## Fatturazione

1. Apri un progetto e clicca su **Genera fattura**
2. Compila:
   - **Data fattura** e **data scadenza**
   - **Aliquota IVA** (0%, 15%, 25%)
   - **Ricarico** (%)
   - **Nota al cliente**
3. Visualizza in anteprima la fattura in formato PDF
4. Clicca su **Scarica PDF** o **Invia al cliente** (tramite email)

Le fatture vengono salvate nel progetto e possono essere riaperte e modificate fino all'invio.

:::info Dati cliente
I dati del cliente (nome, indirizzo, P.IVA) vengono recuperati dall'account cliente collegato al progetto. Vedi [E-commerce](../integrations/ecommerce) per gestire i clienti.
:::

## Stato Progetto

| Stato | Descrizione |
|---|---|
| Attivo | Il progetto è in lavorazione |
| Completato | Tutte le stampe sono pronte, fattura inviata |
| Archiviato | Nascosto dalla visualizzazione standard, ma ricercabile |
| In attesa | Temporaneamente sospeso |

Cambia lo stato cliccando sull'indicatore di stato in cima al progetto.

## Condivisione di un Progetto

Genera un link condivisibile per mostrare la panoramica del progetto ai clienti:

1. Clicca su **Condividi progetto** nel menu del progetto
2. Seleziona cosa mostrare:
   - ✅ Stampe e immagini
   - ✅ Consumo filamento totale
   - ❌ Costi e prezzi (nascosti per impostazione predefinita)
3. Imposta il tempo di scadenza del link
4. Copia e condividi il link

Il cliente vede una pagina in sola lettura senza dover accedere.
