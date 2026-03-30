---
sidebar_position: 2
title: Teknisk arkitektur
description: Arkitekturöversikt för Bambu Dashboard — stack, moduler, databas och WebSocket
---

# Teknisk arkitektur

## Systemdiagram

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

Dashboardet kommunicerar med skrivaren via MQTT över TLS (port 8883) och kameran via RTSPS (port 322). Webbläsaren ansluter till dashboardet över HTTPS och WebSocket.

## Teknisk stack

| Lager | Teknologi |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 komponentmoduler, inget byggsteg, inga ramverk |
| Backend | Node.js 22 med 3 npm-paket: `mqtt`, `ws`, `basic-ftp` |
| Databas | SQLite (inbyggt i Node.js 22 via `--experimental-sqlite`) |
| Kamera | ffmpeg transkoderar RTSPS till MPEG1, jsmpeg renderar i webbläsaren |
| Realtid | WebSocket-hubb skickar skrivarstatus till alla anslutna klienter |
| Protokoll | MQTT över TLS (port 8883) med skrivarens LAN Access Code |

## Portar

| Port | Protokoll | Riktning | Beskrivning |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | In | Dashboard (omdirigerar till HTTPS) |
| 3443 | HTTPS + WSS | In | Säkert dashboard (standard) |
| 9001+ | WS | In | Kameraströmmar (en per skrivare) |
| 8883 | MQTTS | Ut | Anslutning till skrivare |
| 322 | RTSPS | Ut | Kamera från skrivare |

## Servermoduler (44)

| Modul | Syfte |
|-------|--------|
| `index.js` | HTTP/HTTPS-servrar, auto-SSL, CSP/HSTS-headers, statiska filer, demoläge |
| `config.js` | Konfigurationsladdning, standardvärden, env-överstyrningar och migrationer |
| `database.js` | SQLite-schema, 105 migrationer, CRUD-operationer |
| `api-routes.js` | REST API (284+ endpunkter) |
| `auth.js` | Autentisering och sessionshantering |
| `backup.js` | Säkerhetskopiering och återställning |
| `printer-manager.js` | Skrivarlivscykel, MQTT-anslutningshantering |
| `mqtt-client.js` | MQTT-anslutning till Bambu-skrivare |
| `mqtt-commands.js` | MQTT-kommandobyggning (pausa, återuppta, stoppa, osv.) |
| `websocket-hub.js` | WebSocket-broadcast till alla webbläsarklienter |
| `camera-stream.js` | ffmpeg-processhantering för kameraströmmar |
| `print-tracker.js` | Utskriftsjobbsspårning, tillståndsövergångar, historikloggning |
| `print-guard.js` | Utskriftsskydd via xcam + sensorövervakning |
| `queue-manager.js` | Utskriftskö med multi-skrivare dispatch och lastbalansering |
| `slicer-service.js` | Lokal slicer CLI-brygga, filuppladdning, FTPS-uppladdning |
| `telemetry.js` | Telemetridatabehandling |
| `telemetry-sampler.js` | Tidsseriedatasampling |
| `thumbnail-service.js` | Miniatyrbildshämtning via FTPS från skrivarens SD |
| `timelapse-service.js` | Timelapse-inspelning och -hantering |
| `notifications.js` | 7-kanals aviseringssystem (Telegram, Discord, E-post, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | GitHub Releases auto-uppdatering med säkerhetskopiering |
| `setup-wizard.js` | Webbaserad installationsguide för förstagångsanvändning |
| `ecom-license.js` | Licenshantering |
| `failure-detection.js` | Feldetektering och -analys |
| `bambu-cloud.js` | Bambu Cloud API-integration |
| `bambu-rfid-data.js` | RFID-filamentdata från AMS |
| `circuit-breaker.js` | Kretsbrytarmönster för tjänstestabilitet |
| `energy-service.js` | Energi- och elprisberäkning |
| `error-pattern-analyzer.js` | Mönsteranalys av HMS-fel |
| `file-parser.js` | Parsning av 3MF/GCode-filer |
| `logger.js` | Strukturerad loggning |
| `material-recommender.js` | Materialrekommendationer |
| `milestone-service.js` | Milstolpe- och prestationsspårning |
| `plugin-manager.js` | Plugin-system för utvidgningar |
| `power-monitor.js` | Strömätningsintegration (Shelly/Tasmota) |
| `price-checker.js` | Elprishämtning (Tibber/Nordpool) |
| `printer-discovery.js` | Automatisk skrivarupptäckt på LAN |
| `remote-nodes.js` | Flernodhantering |
| `report-service.js` | Rapportgenerering |
| `seed-filament-db.js` | Seeding av filamentdatabas |
| `spoolease-data.js` | SpoolEase-integration |
| `validate.js` | Indatavalidering |
| `wear-prediction.js` | Slitageprediktion för komponenter |

## Frontendkomponenter (76)

Alla komponenter är vanilla JavaScript-moduler utan byggsteg. De laddas direkt i webbläsaren via `<script type="module">`.

| Komponent | Syfte |
|-----------|--------|
| `print-preview.js` | 3D-modellvisare + MakerWorld-bildavslöjning |
| `model-viewer.js` | WebGL 3D-rendering med lageranimation |
| `temperature-gauge.js` | Animerade SVG-ringgaugar |
| `sparkline-stats.js` | Grafana-stil statistikpaneler |
| `ams-panel.js` | AMS-filamentvisualisering |
| `camera-view.js` | jsmpeg-videospelare med helskärm |
| `controls-panel.js` | Skrivarstyrnings-UI |
| `history-table.js` | Utskriftshistorik med sökning, filter, CSV-export |
| `filament-tracker.js` | Filamentlager med favoriter, färgfiltrering |
| `queue-panel.js` | Utskriftsköhantering |
| `knowledge-panel.js` | Kunskapsbasläsare och -redigerare |

## Databas

SQLite-databasen är inbyggd i Node.js 22 och kräver ingen extern installation. Schemat hanteras av 105 migrationer i `db/migrations.js`.

Huvudtabeller:

- `printers` — skrivarkonfiguration
- `print_history` — alla utskriftsjobb
- `filaments` — filamentlager
- `ams_slots` — AMS-platskopling
- `queue` — utskriftskö
- `notifications_config` — aviseringsinställningar
- `maintenance_log` — underhållslogg

## Säkerhet

- HTTPS med auto-genererat certifikat (eller ditt eget)
- JWT-baserad autentisering
- CSP och HSTS-headers
- Rate limiting (200 req/min)
- Inget externt molnberoende för kärnfunktioner
