---
sidebar_position: 2
title: Technische Architektur
description: Architekturübersicht für Bambu Dashboard — Stack, Module, Datenbank und WebSocket
---

# Technische Architektur

## Systemdiagramm

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Drucker
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Kamera
```

Das Dashboard kommuniziert mit dem Drucker über MQTT über TLS (Port 8883) und der Kamera über RTSPS (Port 322). Der Browser verbindet sich mit dem Dashboard über HTTPS und WebSocket.

## Technischer Stack

| Schicht | Technologie |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 Komponentmodule, kein Build-Schritt, kein Framework |
| Backend | Node.js 22 mit 3 npm-Paketen: `mqtt`, `ws`, `basic-ftp` |
| Datenbank | SQLite (in Node.js 22 integriert über `--experimental-sqlite`) |
| Kamera | ffmpeg transcodiert RTSPS zu MPEG1, jsmpeg rendert im Browser |
| Echtzeit | WebSocket-Hub sendet Druckerzustand an alle verbundenen Clients |
| Protokoll | MQTT über TLS (Port 8883) mit dem LAN Access Code des Druckers |

## Ports

| Port | Protokoll | Richtung | Beschreibung |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | Eingehend | Dashboard (leitet zu HTTPS um) |
| 3443 | HTTPS + WSS | Eingehend | Sicheres Dashboard (Standard) |
| 9001+ | WS | Eingehend | Kamerastreams (einer pro Drucker) |
| 8883 | MQTTS | Ausgehend | Verbindung zum Drucker |
| 322 | RTSPS | Ausgehend | Kamera vom Drucker |

## Servermodule (44)

| Modul | Zweck |
|-------|--------|
| `index.js` | HTTP/HTTPS-Server, Auto-SSL, CSP/HSTS-Header, statische Dateien, Demo-Modus |
| `config.js` | Konfigurationsladen, Standardwerte, Umgebungsüberschreibungen und Migrationen |
| `database.js` | SQLite-Schema, 105 Migrationen, CRUD-Operationen |
| `api-routes.js` | REST API (284+ Endpunkte) |
| `auth.js` | Authentifizierung und Sitzungsverwaltung |
| `backup.js` | Datensicherung und Wiederherstellung |
| `printer-manager.js` | Drucker-Lebenszyklus, MQTT-Verbindungsverwaltung |
| `mqtt-client.js` | MQTT-Verbindung zu Bambu-Druckern |
| `mqtt-commands.js` | MQTT-Befehlsaufbau (Pause, Fortsetzen, Stopp usw.) |
| `websocket-hub.js` | WebSocket-Broadcast an alle Browser-Clients |
| `camera-stream.js` | ffmpeg-Prozessverwaltung für Kamerastreams |
| `print-tracker.js` | Druckauftragsverfolgung, Zustandsübergänge, Verlaufsprotokollierung |
| `print-guard.js` | Druckschutz über XCam + Sensorüberwachung |
| `queue-manager.js` | Druckwarteschlange mit Multi-Drucker-Versand und Lastausgleich |
| `slicer-service.js` | Lokale Slicer-CLI-Brücke, Dateiupload, FTPS-Upload |
| `telemetry.js` | Telemetrie-Datenverarbeitung |
| `telemetry-sampler.js` | Zeitreihendaten-Sampling |
| `thumbnail-service.js` | Thumbnail-Abruf über FTPS von der Drucker-SD |
| `timelapse-service.js` | Timelapse-Aufzeichnung und -Verwaltung |
| `notifications.js` | 7-Kanal-Benachrichtigungssystem (Telegram, Discord, E-Mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | GitHub Releases Auto-Update mit Datensicherung |
| `setup-wizard.js` | Webbasierter Einrichtungsassistent für die Ersteinrichtung |
| `ecom-license.js` | Lizenzverwaltung |
| `failure-detection.js` | Fehlerkennung und -analyse |
| `bambu-cloud.js` | Bambu Cloud API-Integration |
| `bambu-rfid-data.js` | RFID-Filamentdaten vom AMS |
| `circuit-breaker.js` | Circuit-Breaker-Muster für Dienststabilität |
| `energy-service.js` | Energie- und Strompreisberechnung |
| `error-pattern-analyzer.js` | Musteranalyse von HMS-Fehlern |
| `file-parser.js` | Parsing von 3MF/GCode-Dateien |
| `logger.js` | Strukturiertes Logging |
| `material-recommender.js` | Materialempfehlungen |
| `milestone-service.js` | Meilenstein- und Errungenschaftsverfolgung |
| `plugin-manager.js` | Plugin-System für Erweiterungen |
| `power-monitor.js` | Strommesser-Integration (Shelly/Tasmota) |
| `price-checker.js` | Strompreis-Abruf (Tibber/Nordpool) |
| `printer-discovery.js` | Automatische Druckererkennung im LAN |
| `remote-nodes.js` | Multi-Knoten-Verwaltung |
| `report-service.js` | Berichtsgenerierung |
| `seed-filament-db.js` | Seeding der Filamentdatenbank |
| `spoolease-data.js` | SpoolEase-Integration |
| `validate.js` | Eingabevalidierung |
| `wear-prediction.js` | Verschleißprognose für Komponenten |

## Frontend-Komponenten (76)

Alle Komponenten sind Vanilla-JavaScript-Module ohne Build-Schritt. Sie werden direkt im Browser über `<script type="module">` geladen.

| Komponente | Zweck |
|-----------|--------|
| `print-preview.js` | 3D-Modellbetrachter + MakerWorld-Bildoffenlegung |
| `model-viewer.js` | WebGL 3D-Rendering mit Schichtanimation |
| `temperature-gauge.js` | Animierte SVG-Ring-Messgeräte |
| `sparkline-stats.js` | Grafana-artige Statistikpanele |
| `ams-panel.js` | AMS-Filamentvisualisierung |
| `camera-view.js` | jsmpeg-Videoplayer mit Vollbild |
| `controls-panel.js` | Druckersteuerungs-UI |
| `history-table.js` | Druckverlauf mit Suche, Filtern, CSV-Export |
| `filament-tracker.js` | Filamentlager mit Favoriten, Farbfilterung |
| `queue-panel.js` | Druckwarteschlangen-Verwaltung |
| `knowledge-panel.js` | Wissensdatenbank-Leser und -Editor |

## Datenbank

Die SQLite-Datenbank ist in Node.js 22 integriert und benötigt keine externe Installation. Das Schema wird von 105 Migrationen in `db/migrations.js` verwaltet.

Haupttabellen:

- `printers` — Druckerkonfiguration
- `print_history` — alle Druckaufträge
- `filaments` — Filamentlager
- `ams_slots` — AMS-Schachtzuordnung
- `queue` — Druckwarteschlange
- `notifications_config` — Benachrichtigungseinstellungen
- `maintenance_log` — Wartungsprotokoll

## Sicherheit

- HTTPS mit automatisch generiertem Zertifikat (oder eigenem)
- JWT-basierte Authentifizierung
- CSP- und HSTS-Header
- Rate Limiting (200 Anfragen/Min.)
- Keine externe Cloud-Abhängigkeit für Kernfunktionen
