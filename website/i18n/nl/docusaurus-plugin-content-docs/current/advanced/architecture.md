---
sidebar_position: 2
title: Technische architectuur
description: Architectuuroverzicht van Bambu Dashboard — stack, modules, database en WebSocket
---

# Technische architectuur

## Systeemdiagram

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

Het dashboard communiceert met de printer via MQTT over TLS (poort 8883) en de camera via RTSPS (poort 322). De browser verbindt met het dashboard via HTTPS en WebSocket.

## Technische stack

| Laag | Technologie |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 componentmodules, geen buildstap, geen framework |
| Backend | Node.js 22 met 3 npm-pakketten: `mqtt`, `ws`, `basic-ftp` |
| Database | SQLite (ingebouwd in Node.js 22 via `--experimental-sqlite`) |
| Camera | ffmpeg transcodeert RTSPS naar MPEG1, jsmpeg rendert in de browser |
| Realtime | WebSocket-hub stuurt printerstatus naar alle verbonden clients |
| Protocol | MQTT over TLS (poort 8883) met de LAN Access Code van de printer |

## Poorten

| Poort | Protocol | Richting | Beschrijving |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | In | Dashboard (stuurt door naar HTTPS) |
| 3443 | HTTPS + WSS | In | Beveiligd dashboard (standaard) |
| 9001+ | WS | In | Camerastreams (één per printer) |
| 8883 | MQTTS | Uit | Verbinding met printer |
| 322 | RTSPS | Uit | Camera van printer |

## Servermodules (44)

| Module | Doel |
|-------|--------|
| `index.js` | HTTP/HTTPS-servers, auto-SSL, CSP/HSTS-headers, statische bestanden, demomodus |
| `config.js` | Configuratieladen, standaardwaarden, env-overschrijvingen en migraties |
| `database.js` | SQLite-schema, 105 migraties, CRUD-bewerkingen |
| `api-routes.js` | REST API (284+ eindpunten) |
| `auth.js` | Authenticatie en sessiebeheer |
| `backup.js` | Back-up en herstel |
| `printer-manager.js` | Printer-levenscyclus, MQTT-verbindingsbeheer |
| `mqtt-client.js` | MQTT-verbinding met Bambu-printers |
| `mqtt-commands.js` | MQTT-opdrachtopbouw (pauzeren, hervatten, stoppen, enz.) |
| `websocket-hub.js` | WebSocket-uitzending naar alle browsercliënts |
| `camera-stream.js` | ffmpeg-procesbeheer voor camerastreams |
| `print-tracker.js` | Printtaaktracking, toestandsovergangen, geschiedenislogging |
| `print-guard.js` | Printbeveiliging via xcam + sensormonitoring |
| `queue-manager.js` | Printwachtrij met multi-printer dispatch en lastbalancering |
| `slicer-service.js` | Lokale slicer CLI-brug, bestand uploaden, FTPS-upload |
| `telemetry.js` | Telemetrie-dataverwerking |
| `telemetry-sampler.js` | Tijdreeks-datasampling |
| `thumbnail-service.js` | Miniatuurophaling via FTPS van printer SD |
| `timelapse-service.js` | Timelapse-opname en -beheer |
| `notifications.js` | 7-kanaals meldingssysteem (Telegram, Discord, E-mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | GitHub Releases auto-update met back-up |
| `setup-wizard.js` | Webgebaseerde installatiewizard voor eerste gebruik |
| `ecom-license.js` | Licentiebeheer |
| `failure-detection.js` | Foutdetectie en -analyse |
| `bambu-cloud.js` | Bambu Cloud API-integratie |
| `bambu-rfid-data.js` | RFID-filamentdata van AMS |
| `circuit-breaker.js` | Stroomonderbreker-patroon voor servicestabiliteit |
| `energy-service.js` | Energie- en elektriciteitsprijsberekening |
| `error-pattern-analyzer.js` | Patroonanalyse van HMS-fouten |
| `file-parser.js` | Parsing van 3MF/GCode-bestanden |
| `logger.js` | Gestructureerde logging |
| `material-recommender.js` | Materiaaladviezen |
| `milestone-service.js` | Mijlpaal- en prestatietracking |
| `plugin-manager.js` | Plug-insysteem voor uitbreidingen |
| `power-monitor.js` | Stroommeter-integratie (Shelly/Tasmota) |
| `price-checker.js` | Elektriciteitsprijsophaling (Tibber/Nordpool) |
| `printer-discovery.js` | Automatische printerdetectie op LAN |
| `remote-nodes.js` | Multi-node-beheer |
| `report-service.js` | Rapportgeneratie |
| `seed-filament-db.js` | Seeden van filamentdatabase |
| `spoolease-data.js` | SpoolEase-integratie |
| `validate.js` | Invoervalidatie |
| `wear-prediction.js` | Slijtagepredictie voor componenten |

## Frontend-componenten (76)

Alle componenten zijn vanilla JavaScript-modules zonder buildstap. Ze worden direct in de browser geladen via `<script type="module">`.

| Component | Doel |
|-----------|--------|
| `print-preview.js` | 3D-modelweergave + MakerWorld-beeldophaling |
| `model-viewer.js` | WebGL 3D-rendering met laaganimatie |
| `temperature-gauge.js` | Geanimeerde SVG-ringmeters |
| `sparkline-stats.js` | Grafana-stijl statistiekpanelen |
| `ams-panel.js` | AMS-filamentvisualisatie |
| `camera-view.js` | jsmpeg-videospeler met volledig scherm |
| `controls-panel.js` | Printerbesturings-UI |
| `history-table.js` | Printgeschiedenis met zoeken, filters, CSV-export |
| `filament-tracker.js` | Filamentopslag met favorieten, kleurfiltering |
| `queue-panel.js` | Printwachtrijbeheer |
| `knowledge-panel.js` | Kennisbank-lezer en -editor |

## Database

De SQLite-database is ingebouwd in Node.js 22 en vereist geen externe installatie. Het schema wordt beheerd door 105 migraties in `db/migrations.js`.

Hoofddatabasetabellen:

- `printers` — printerconfiguratie
- `print_history` — alle printtaken
- `filaments` — filamentopslag
- `ams_slots` — AMS-spotkoppeling
- `queue` — printwachtrij
- `notifications_config` — meldinginstellingen
- `maintenance_log` — onderhoudslog

## Beveiliging

- HTTPS met automatisch gegenereerd certificaat (of uw eigen)
- JWT-gebaseerde authenticatie
- CSP en HSTS-headers
- Rate limiting (200 req/min)
- Geen externe cloudafhankelijkheid voor kernfunctionaliteit
