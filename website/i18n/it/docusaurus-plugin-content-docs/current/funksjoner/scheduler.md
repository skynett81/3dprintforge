---
sidebar_position: 4
title: Pianificatore
description: Pianifica le stampe, gestisci la coda di stampa e configura il dispatch automatico
---

# Pianificatore

Il Pianificatore ti permette di organizzare e automatizzare i lavori di stampa con visualizzazione calendario e una coda di stampa intelligente.

## Visualizzazione Calendario

La visualizzazione calendario fornisce una panoramica di tutte le stampe pianificate e completate:

- **Vista mensile, settimanale e giornaliera** — scegli il livello di dettaglio
- **Codifica colore** — colori diversi per stampante e stato
- **Clicca un evento** — vedi i dettagli della stampa

Le stampe completate vengono mostrate automaticamente in base alla cronologia stampe.

## Coda di Stampa

La coda di stampa ti permette di accodare lavori che vengono inviati alla stampante in sequenza:

### Aggiungere un Lavoro alla Coda

1. Clicca su **+ Aggiungi lavoro**
2. Seleziona file (dalla SD della stampante, upload locale, o FTP)
3. Imposta la priorità (alta, normale, bassa)
4. Seleziona la stampante target (o "automatica")
5. Clicca su **Aggiungi**

### Gestione Coda

| Azione | Descrizione |
|----------|-------------|
| Trascina e rilascia | Riorganizza l'ordine |
| Pausa coda | Ferma temporaneamente l'invio |
| Salta | Invia il prossimo lavoro senza attendere |
| Elimina | Rimuovi il lavoro dalla coda |

:::tip Dispatch multi-stampante
Con più stampanti, la coda può distribuire automaticamente i lavori alle stampanti libere. Attiva **Dispatch automatico** in **Pianificatore → Impostazioni**.
:::

## Stampe Pianificate

Configura stampe che devono iniziare a un orario specifico:

1. Clicca su **+ Pianifica stampa**
2. Seleziona file e stampante
3. Imposta l'orario di avvio
4. Configura la notifica (opzionale)
5. Salva

:::warning La stampante deve essere libera
Le stampe pianificate iniziano solo se la stampante è in standby all'orario specificato. Se la stampante è occupata, l'avvio viene posticipato al prossimo momento disponibile (configurabile).
:::

## Bilanciamento del Carico

Con il bilanciamento automatico del carico, i lavori vengono distribuiti in modo intelligente tra le stampanti:

- **Round-robin** — distribuzione equa tra tutte le stampanti
- **Meno occupata** — invia alla stampante con il tempo di completamento stimato più breve
- **Manuale** — scegli tu la stampante per ogni lavoro

Configura in **Pianificatore → Bilanciamento del carico**.

## Notifiche

Il pianificatore si integra con i canali di notifica:

- Notifica quando un lavoro inizia
- Notifica quando un lavoro è terminato
- Notifica in caso di errore o ritardo

Vedi [Panoramica Funzionalità](./oversikt#notifiche) per configurare i canali di notifica.
