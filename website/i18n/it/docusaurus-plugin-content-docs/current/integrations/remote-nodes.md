---
sidebar_position: 4
title: Server Remoti
description: Collega più istanze di 3DPrintForge per vedere tutte le stampanti da un'unica interfaccia centrale
---

# Server Remoti (Remote Nodes)

La funzione Server Remoti ti consente di collegare più istanze di 3DPrintForge per vedere e controllare tutte le stampanti da un'unica interfaccia — indipendentemente che si trovino nella stessa rete o in sedi diverse.

Vai a: **https://localhost:3443/#settings** → **Integrazioni → Server Remoti**

## Casi d'uso

- **Casa + ufficio** — Vedi le stampanti in entrambe le sedi dallo stesso dashboard
- **Makerspace** — Dashboard centralizzata per tutte le istanze dello spazio
- **Istanze ospite** — Dai visibilità limitata ai clienti senza accesso completo

## Architettura

```
Istanza primaria (il tuo PC)
  ├── Stampante A (MQTT locale)
  ├── Stampante B (MQTT locale)
  └── Server remoto: Istanza secondaria
        ├── Stampante C (MQTT nella sede remota)
        └── Stampante D (MQTT nella sede remota)
```

L'istanza primaria esegue il polling dei server remoti tramite REST API e aggrega i dati localmente.

## Aggiungere un server remoto

### Passo 1: Genera la chiave API sull'istanza remota

1. Accedi all'istanza remota (es. `https://192.168.2.50:3443`)
2. Vai a **Impostazioni → Chiavi API**
3. Clicca **Nuova chiave** → assegnale il nome «Nodo primario»
4. Imposta i permessi: **Lettura** (minimo) oppure **Lettura + Scrittura** (per il controllo remoto)
5. Copia la chiave

### Passo 2: Connetti dall'istanza primaria

1. Vai a **Impostazioni → Server Remoti**
2. Clicca **Aggiungi server remoto**
3. Compila:
   - **Nome**: es. «Ufficio» o «Garage»
   - **URL**: `https://192.168.2.50:3443` oppure URL esterna
   - **Chiave API**: la chiave dal passo 1
4. Clicca **Test connessione**
5. Clicca **Salva**

:::warning Certificato auto-firmato
Se l'istanza remota utilizza un certificato auto-firmato, abilita **Ignora errori TLS** — ma fallo solo per connessioni su rete interna.
:::

## Visualizzazione aggregata

Dopo la connessione, le stampanti remote appaiono in:

- **Panoramica Parco Macchine** — contrassegnate con il nome del server remoto e un'icona cloud
- **Statistiche** — aggregate su tutte le istanze
- **Magazzino Filamento** — panoramica unificata

## Controllo remoto

Con il permesso **Lettura + Scrittura** puoi controllare le stampanti remote direttamente:

- Pausa / Riprendi / Arresta
- Aggiunta alla coda di stampa (il lavoro viene inviato all'istanza remota)
- Visualizzazione del feed della camera (proxied attraverso l'istanza remota)

:::info Latenza
Il feed della camera tramite server remoto può presentare un ritardo apprezzabile a seconda della velocità della rete e della distanza.
:::

## Controllo degli accessi

Limita quali dati il server remoto condivide:

1. Sull'istanza remota: vai a **Impostazioni → Chiavi API → [Nome chiave]**
2. Limita l'accesso:
   - Solo stampanti specifiche
   - Nessun feed camera
   - Sola lettura

## Salute e monitoraggio

Lo stato di ogni server remoto è visibile in **Impostazioni → Server Remoti**:

- **Connesso** — ultimo polling riuscito
- **Disconnesso** — impossibile raggiungere il server remoto
- **Errore di autenticazione** — chiave API non valida o scaduta
- **Ultima sincronizzazione** — timestamp dell'ultima sincronizzazione dati riuscita
