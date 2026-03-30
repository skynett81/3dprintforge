---
sidebar_position: 3
title: Cronologia Stampe
description: Registro completo di tutte le stampe con statistiche, monitoraggio filamento ed esportazione
---

# Cronologia Stampe

La Cronologia Stampe fornisce un registro completo di tutte le stampe eseguite con il dashboard, incluse statistiche, consumo filamento e link alle sorgenti del modello.

## Tabella Cronologia

La tabella mostra tutte le stampe con:

| Colonna | Descrizione |
|---------|-------------|
| Data/ora | Orario di avvio |
| Nome modello | Nome file o titolo MakerWorld |
| Stampante | Quale stampante è stata utilizzata |
| Durata | Tempo di stampa totale |
| Filamento | Materiale e grammi usati |
| Strati | Numero di strati e peso (g) |
| Stato | Completata, interrotta, fallita |
| Immagine | Miniatura (con integrazione cloud) |

## Ricerca e Filtro

Usa il campo di ricerca e i filtri per trovare le stampe:

- Ricerca testo libero per nome modello
- Filtra per stampante, materiale, stato, data
- Ordina per tutte le colonne

## Link Sorgente Modello

Se la stampa è stata avviata da MakerWorld, viene mostrato un link diretto alla pagina del modello. Clicca sul nome del modello per aprire MakerWorld in una nuova scheda.

:::info Bambu Cloud
I link al modello e le miniature richiedono l'integrazione Bambu Cloud. Vedi [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Monitoraggio Filamento

Per ogni stampa viene registrato:

- **Materiale** — PLA, PETG, ABS, ecc.
- **Grammi usati** — consumo stimato
- **Bobina** — quale bobina è stata usata (se registrata nel magazzino)
- **Colore** — codice hex del colore

Questo fornisce un quadro accurato del consumo di filamento nel tempo e ti aiuta a pianificare gli acquisti.

## Statistiche

Sotto **Cronologia → Statistiche** trovi i dati aggregati:

- **Numero totale stampe** — e tasso di successo
- **Tempo di stampa totale** — ore e giorni
- **Consumo filamento** — grammi e km per materiale
- **Stampe per giorno** — grafico scorrevole
- **Materiali più usati** — grafico a torta
- **Distribuzione durata stampe** — istogramma

Le statistiche possono essere filtrate per periodo di tempo (7g, 30g, 90g, 1anno, tutto).

## Esportazione

### Esportazione CSV
Esporta l'intera cronologia o i risultati filtrati:
**Cronologia → Esporta → Scarica CSV**

I file CSV contengono tutte le colonne e possono essere aperti in Excel, LibreOffice Calc o importati in altri strumenti.

### Backup Automatico
La cronologia fa parte del database SQLite che viene automaticamente sottoposto a backup durante gli aggiornamenti. Backup manuale sotto **Impostazioni → Backup**.

## Modifica

Puoi modificare le voci del registro stampe in seguito:

- Correggere il nome del modello
- Aggiungere note
- Correggere il consumo di filamento
- Eliminare stampe registrate per errore

Fai clic destro su una riga e seleziona **Modifica** oppure clicca sull'icona matita.
