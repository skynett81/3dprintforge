---
sidebar_position: 2
title: Pannello Principale
description: Panoramica in tempo reale della stampante attiva con visualizzazione modello 3D, stato AMS, videocamera e widget personalizzabili
---

# Pannello Principale

Il pannello principale è il centro di controllo centrale di Bambu Dashboard. Mostra lo stato in tempo reale della stampante selezionata e ti permette di monitorare, controllare e personalizzare la visualizzazione secondo le tue esigenze.

Vai a: **https://localhost:3443/**

## Panoramica in Tempo Reale

Quando una stampante è attiva, tutti i valori vengono aggiornati continuamente tramite MQTT:

- **Temperatura ugello** — misuratore SVG ad anello animato con temperatura target
- **Temperatura piano** — misuratore ad anello corrispondente per il piano di stampa
- **Percentuale avanzamento** — grande indicatore percentuale con tempo rimanente
- **Contatore strati** — strato corrente / numero totale di strati
- **Velocità** — Silenziosa / Standard / Sport / Turbo con cursore

:::tip Aggiornamento in tempo reale
Tutti i valori vengono aggiornati direttamente dalla stampante tramite MQTT senza ricaricare la pagina. Il ritardo è tipicamente inferiore a 1 secondo.
:::

## Visualizzazione Modello 3D

Se la stampante invia un file `.3mf` con il modello, viene mostrata un'anteprima 3D interattiva:

1. Il modello viene caricato automaticamente quando inizia una stampa
2. Ruota il modello trascinando con il mouse
3. Scorri per ingrandire/ridurre
4. Clicca su **Reimposta** per tornare alla visualizzazione predefinita

:::info Supporto
La visualizzazione 3D richiede che la stampante invii i dati del modello. Non tutti i lavori di stampa includono questo.
:::

## Stato AMS

Il pannello AMS mostra tutti i dispositivi AMS montati con slot e filamento:

- **Colore slot** — rappresentazione visiva del colore dai metadati Bambu
- **Nome filamento** — materiale e marca
- **Slot attivo** — contrassegnato con animazione pulsante durante la stampa
- **Errori** — indicatore rosso in caso di errori AMS (blocco, vuoto, umido)

Clicca su uno slot per vedere le informazioni complete sul filamento e collegarlo al magazzino filamento.

## Feed Videocamera

La visualizzazione in diretta della videocamera viene convertita tramite ffmpeg (RTSPS → MPEG1):

1. La videocamera si avvia automaticamente quando apri il dashboard
2. Clicca sull'immagine della videocamera per aprire a schermo intero
3. Usa il pulsante **Istantanea** per scattare una foto
4. Clicca su **Nascondi videocamera** per liberare spazio

:::warning Prestazioni
Lo streaming video utilizza circa 2–5 Mbit/s. Disattiva la videocamera su connessioni di rete lente.
:::

## Sparkline Temperature

Sotto il pannello AMS vengono mostrati mini-grafici (sparkline) per gli ultimi 30 minuti:

- Temperatura ugello nel tempo
- Temperatura piano nel tempo
- Temperatura camera (dove disponibile)

Clicca su una sparkline per aprire la visualizzazione completa del grafico telemetria.

## Personalizzazione Widget

Il dashboard usa una griglia drag-and-drop:

1. Clicca su **Personalizza layout** (icona matita in alto a destra)
2. Trascina i widget nella posizione desiderata
3. Ridimensiona trascinando dall'angolo
4. Clicca su **Blocca layout** per congelare la posizione
5. Clicca su **Salva** per conservare la configurazione

Widget disponibili:
| Widget | Descrizione |
|---|---|
| Videocamera | Visualizzazione live videocamera |
| AMS | Stato bobina e filamento |
| Temperatura | Misuratori ad anello per ugello e piano |
| Avanzamento | Indicatore percentuale e stima tempo |
| Telemetria | Ventole, pressione, velocità |
| Modello 3D | Visualizzazione modello interattiva |
| Sparkline | Mini-grafici temperatura |

:::tip Salvataggio
Il layout viene salvato per utente nel browser (localStorage). Utenti diversi possono avere configurazioni diverse.
:::
