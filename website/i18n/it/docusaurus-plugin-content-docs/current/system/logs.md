---
sidebar_position: 8
title: Log del Server
description: Visualizza il log del server in tempo reale, filtra per livello e modulo, e risolvi i problemi con Bambu Dashboard
---

# Log del Server

Il log del server ti offre visibilità su ciò che accade all'interno di Bambu Dashboard — utile per la risoluzione dei problemi, il monitoraggio e la diagnostica.

Vai a: **https://localhost:3443/#logs**

## Visualizzazione in tempo reale

Il flusso di log si aggiorna in tempo reale tramite WebSocket:

1. Vai a **Sistema → Log del Server**
2. Le nuove righe di log appaiono automaticamente in fondo
3. Clicca **Blocca in basso** per scorrere sempre all'ultimo log
4. Clicca **Ferma** per interrompere lo scorrimento automatico e leggere le righe esistenti

La visualizzazione predefinita mostra le ultime 500 righe di log.

## Livelli di log

Ogni riga di log ha un livello:

| Livello | Colore | Descrizione |
|---|---|---|
| **ERROR** | Rosso | Errori che influenzano le funzionalità |
| **WARN** | Arancione | Avvisi — qualcosa potrebbe andare storto |
| **INFO** | Blu | Informazioni operative normali |
| **DEBUG** | Grigio | Informazioni dettagliate per sviluppatori |

:::info Configurazione livello di log
Modifica il livello di log in **Impostazioni → Sistema → Livello log**. Per il funzionamento normale usa **INFO**. Usa **DEBUG** solo durante la risoluzione dei problemi poiché genera molti più dati.
:::

## Filtraggio

Usa la barra degli strumenti filtri in cima alla visualizzazione log:

1. **Livello log** — mostra solo ERROR / WARN / INFO / DEBUG o una combinazione
2. **Modulo** — filtra per modulo di sistema:
   - `mqtt` — comunicazione MQTT con le stampanti
   - `api` — richieste API
   - `db` — operazioni database
   - `auth` — eventi di autenticazione
   - `queue` — eventi coda di stampa
   - `guard` — eventi Print Guard
   - `backup` — operazioni di backup
3. **Testo libero** — cerca nel testo del log (supporta regex)
4. **Ora** — filtra per intervallo di date

Combina i filtri per una risoluzione dei problemi precisa.

## Problemi comuni

### Problemi di connessione MQTT

Cerca righe di log dal modulo `mqtt`:

```
ERROR [mqtt] Connessione alla stampante XXXX fallita: Connection refused
```

**Soluzione:** Verifica che la stampante sia accesa, il codice di accesso sia corretto e la rete funzioni.

### Errori database

```
ERROR [db] Migrazione v95 fallita: SQLITE_CONSTRAINT
```

**Soluzione:** Esegui un backup e avvia la riparazione database tramite **Impostazioni → Sistema → Ripara database**.

### Errori di autenticazione

```
WARN [auth] Accesso fallito per l'utente admin dall'IP 192.168.1.x
```

Molti accessi falliti possono indicare un tentativo di brute-force. Controlla se abilitare una whitelist IP.

## Esportare i log

1. Clicca **Esporta log**
2. Seleziona il periodo di tempo (predefinito: ultime 24 ore)
3. Seleziona il formato: **TXT** (leggibile) o **JSON** (leggibile da macchina)
4. Il file viene scaricato

I log esportati sono utili per segnalare bug o contattare il supporto.

## Rotazione dei log

I log vengono ruotati automaticamente:

| Impostazione | Predefinito |
|---|---|
| Dimensione massima file log | 50 MB |
| Numero di file ruotati da conservare | 5 |
| Dimensione massima totale log | 250 MB |

Modifica in **Impostazioni → Sistema → Rotazione log**. I file di log più vecchi vengono compressi automaticamente con gzip.

## Posizione dei file di log

I file di log vengono salvati sul server:

```
./data/logs/
├── bambu-dashboard.log          (log attivo)
├── bambu-dashboard.log.1.gz     (ruotato)
├── bambu-dashboard.log.2.gz     (ruotato)
└── ...
```

:::tip Accesso SSH
Per leggere i log direttamente sul server tramite SSH:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
