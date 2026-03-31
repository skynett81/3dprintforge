---
sidebar_position: 2
title: Architettura Tecnica
description: Panoramica dell'architettura di 3DPrintForge — stack, moduli, database e WebSocket
---

# Architettura Tecnica

## Diagramma di Sistema

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Stampante
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

Il dashboard comunica con la stampante tramite MQTT su TLS (porta 8883) e con la videocamera tramite RTSPS (porta 322). Il browser si connette al dashboard tramite HTTPS e WebSocket.

## Stack Tecnologico

| Livello | Tecnologia |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 moduli componente, nessun passaggio di build, nessun framework |
| Backend | Node.js 22 con 3 pacchetti npm: `mqtt`, `ws`, `basic-ftp` |
| Database | SQLite (integrato in Node.js 22 tramite `--experimental-sqlite`) |
| Videocamera | ffmpeg trascodifica RTSPS in MPEG1, jsmpeg renderizza nel browser |
| Tempo reale | Hub WebSocket invia lo stato della stampante a tutti i client connessi |
| Protocollo | MQTT su TLS (porta 8883) con il codice di accesso LAN della stampante |

## Porte

| Porta | Protocollo | Direzione | Descrizione |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | In entrata | Dashboard (reindirizza a HTTPS) |
| 3443 | HTTPS + WSS | In entrata | Dashboard sicuro (predefinito) |
| 9001+ | WS | In entrata | Flussi videocamera (uno per stampante) |
| 8883 | MQTTS | In uscita | Connessione alla stampante |
| 322 | RTSPS | In uscita | Videocamera dalla stampante |

## Moduli Server (44)

| Modulo | Scopo |
|-------|--------|
| `index.js` | Server HTTP/HTTPS, SSL automatico, header CSP/HSTS, file statici, modalità demo |
| `config.js` | Caricamento configurazione, valori predefiniti, override env e migrazioni |
| `database.js` | Schema SQLite, 105 migrazioni, operazioni CRUD |
| `api-routes.js` | REST API (284+ endpoint) |
| `auth.js` | Autenticazione e gestione sessioni |
| `backup.js` | Backup e ripristino |
| `printer-manager.js` | Ciclo di vita stampante, gestione connessioni MQTT |
| `mqtt-client.js` | Connessione MQTT alle stampanti Bambu |
| `mqtt-commands.js` | Costruzione comandi MQTT (pausa, riprendi, stop, ecc.) |
| `websocket-hub.js` | Trasmissione WebSocket a tutti i client browser |
| `camera-stream.js` | Gestione processi ffmpeg per flussi videocamera |
| `print-tracker.js` | Tracciamento lavori di stampa, transizioni di stato, registrazione cronologia |
| `print-guard.js` | Protezione stampa tramite xcam + monitoraggio sensori |
| `queue-manager.js` | Coda di stampa con dispatch multi-stampante e bilanciamento del carico |
| `slicer-service.js` | Bridge CLI slicer locale, upload file, upload FTPS |
| `telemetry.js` | Elaborazione dati telemetria |
| `telemetry-sampler.js` | Campionamento dati serie temporali |
| `thumbnail-service.js` | Recupero miniature tramite FTPS dalla SD della stampante |
| `timelapse-service.js` | Registrazione e gestione timelapse |
| `notifications.js` | Sistema notifiche a 7 canali (Telegram, Discord, E-mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | Aggiornamento automatico da GitHub Releases con backup |
| `setup-wizard.js` | Procedura guidata di configurazione web per il primo avvio |
| `ecom-license.js` | Gestione licenze |
| `failure-detection.js` | Rilevamento e analisi guasti |
| `bambu-cloud.js` | Integrazione API Bambu Cloud |
| `bambu-rfid-data.js` | Dati filamento RFID da AMS |
| `circuit-breaker.js` | Pattern circuit breaker per la stabilità del servizio |
| `energy-service.js` | Calcolo energia e prezzi elettricità |
| `error-pattern-analyzer.js` | Analisi pattern errori HMS |
| `file-parser.js` | Parsing file 3MF/GCode |
| `logger.js` | Logging strutturato |
| `material-recommender.js` | Raccomandazioni materiale |
| `milestone-service.js` | Tracciamento milestone e traguardi |
| `plugin-manager.js` | Sistema plugin per estensioni |
| `power-monitor.js` | Integrazione misuratore di potenza (Shelly/Tasmota) |
| `price-checker.js` | Recupero prezzi elettricità (Tibber/Nordpool) |
| `printer-discovery.js` | Rilevamento automatico stampanti in LAN |
| `remote-nodes.js` | Gestione multi-nodo |
| `report-service.js` | Generazione report |
| `seed-filament-db.js` | Popolamento database filamento |
| `spoolease-data.js` | Integrazione SpoolEase |
| `validate.js` | Validazione input |
| `wear-prediction.js` | Previsione usura componenti |

## Componenti Frontend (76)

Tutti i componenti sono moduli JavaScript vanilla senza passaggio di build. Vengono caricati direttamente nel browser tramite `<script type="module">`.

| Componente | Scopo |
|-----------|--------|
| `print-preview.js` | Visualizzatore modelli 3D + rilevamento immagini MakerWorld |
| `model-viewer.js` | Rendering 3D WebGL con animazione strati |
| `temperature-gauge.js` | Misuratori ad anello SVG animati |
| `sparkline-stats.js` | Pannelli statistiche in stile Grafana |
| `ams-panel.js` | Visualizzazione filamento AMS |
| `camera-view.js` | Lettore video jsmpeg con schermo intero |
| `controls-panel.js` | UI controllo stampante |
| `history-table.js` | Cronologia stampe con ricerca, filtri, esportazione CSV |
| `filament-tracker.js` | Magazzino filamento con preferiti, filtro colore |
| `queue-panel.js` | Gestione coda di stampa |
| `knowledge-panel.js` | Lettore e editor base di conoscenza |

## Database

Il database SQLite è integrato in Node.js 22 e non richiede installazione esterna. Lo schema è gestito da 105 migrazioni in `db/migrations.js`.

Tabelle principali:

- `printers` — configurazione stampanti
- `print_history` — tutti i lavori di stampa
- `filaments` — magazzino filamento
- `ams_slots` — collegamento slot AMS
- `queue` — coda di stampa
- `notifications_config` — impostazioni notifiche
- `maintenance_log` — registro manutenzione

## Sicurezza

- HTTPS con certificato auto-generato (o il tuo)
- Autenticazione basata su JWT
- Header CSP e HSTS
- Rate limiting (200 req/min)
- Nessuna dipendenza da cloud esterno per le funzioni principali
