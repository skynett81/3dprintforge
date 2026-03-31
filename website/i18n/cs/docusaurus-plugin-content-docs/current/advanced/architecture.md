---
sidebar_position: 2
title: Technická architektura
description: Přehled architektury 3DPrintForge — stack, moduly, databáze a WebSocket
---

# Technická architektura

## Systémový diagram

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

Dashboard komunikuje s tiskárnou přes MQTT přes TLS (port 8883) a s kamerou přes RTSPS (port 322). Prohlížeč se připojuje k dashboardu přes HTTPS a WebSocket.

## Technický stack

| Vrstva | Technologie |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 komponentových modulů, bez build kroku, bez frameworku |
| Backend | Node.js 22 se 3 npm balíčky: `mqtt`, `ws`, `basic-ftp` |
| Databáze | SQLite (vestavěný v Node.js 22 přes `--experimental-sqlite`) |
| Kamera | ffmpeg překóduje RTSPS na MPEG1, jsmpeg renderuje v prohlížeči |
| Reálný čas | WebSocket hub odesílá stav tiskárny všem připojeným klientům |
| Protokol | MQTT přes TLS (port 8883) s LAN Access Code tiskárny |

## Porty

| Port | Protokol | Směr | Popis |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | Vstupní | Dashboard (přesměruje na HTTPS) |
| 3443 | HTTPS + WSS | Vstupní | Zabezpečený dashboard (výchozí) |
| 9001+ | WS | Vstupní | Streamy kamer (jeden na tiskárnu) |
| 8883 | MQTTS | Výstupní | Připojení k tiskárně |
| 322 | RTSPS | Výstupní | Kamera z tiskárny |

## Serverové moduly (44)

| Modul | Účel |
|-------|--------|
| `index.js` | HTTP/HTTPS servery, auto-SSL, CSP/HSTS záhlaví, statické soubory, demo režim |
| `config.js` | Načítání konfigurace, výchozí hodnoty, přepisy env a migrace |
| `database.js` | Schéma SQLite, 105 migrací, CRUD operace |
| `api-routes.js` | REST API (284+ koncových bodů) |
| `auth.js` | Autentizace a správa relací |
| `backup.js` | Záloha a obnova |
| `printer-manager.js` | Životní cyklus tiskárny, správa MQTT připojení |
| `mqtt-client.js` | MQTT připojení k tiskárnám Bambu |
| `mqtt-commands.js` | Sestavování MQTT příkazů (pauza, pokračování, stop atd.) |
| `websocket-hub.js` | WebSocket vysílání všem klientům prohlížeče |
| `camera-stream.js` | Správa procesů ffmpeg pro streamy kamer |
| `print-tracker.js` | Sledování tiskových úloh, přechody stavů, protokolování historie |
| `print-guard.js` | Ochrana tisku přes xcam + sledování senzorů |
| `queue-manager.js` | Fronta tisků s dispatch pro více tiskáren a vyrovnáváním zátěže |
| `slicer-service.js` | Místní slicer CLI bridge, nahrávání souborů, FTPS nahrávání |
| `telemetry.js` | Zpracování telemetrických dat |
| `telemetry-sampler.js` | Vzorkování dat časových řad |
| `thumbnail-service.js` | Získávání miniatur přes FTPS z SD karty tiskárny |
| `timelapse-service.js` | Záznam a správa časosběrných videí |
| `notifications.js` | 7kanálový systém oznámení (Telegram, Discord, E-mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | Auto-aktualizace GitHub Releases se zálohou |
| `setup-wizard.js` | Webový průvodce nastavením pro první použití |
| `ecom-license.js` | Správa licencí |
| `failure-detection.js` | Detekce a analýza selhání |
| `bambu-cloud.js` | Integrace Bambu Cloud API |
| `bambu-rfid-data.js` | RFID data filamentu z AMS |
| `circuit-breaker.js` | Vzor jistič pro stabilitu služby |
| `energy-service.js` | Výpočty energie a cen elektřiny |
| `error-pattern-analyzer.js` | Analýza vzorů chyb HMS |
| `file-parser.js` | Parsování souborů 3MF/GCode |
| `logger.js` | Strukturované protokolování |
| `material-recommender.js` | Doporučení materiálů |
| `milestone-service.js` | Sledování milníků a úspěchů |
| `plugin-manager.js` | Systém pluginů pro rozšíření |
| `power-monitor.js` | Integrace měřiče výkonu (Shelly/Tasmota) |
| `price-checker.js` | Získávání cen elektřiny (Tibber/Nordpool) |
| `printer-discovery.js` | Automatické zjišťování tiskáren v LAN |
| `remote-nodes.js` | Správa více uzlů |
| `report-service.js` | Generování zpráv |
| `seed-filament-db.js` | Seedování databáze filamentů |
| `spoolease-data.js` | Integrace SpoolEase |
| `validate.js` | Validace vstupních dat |
| `wear-prediction.js` | Predikce opotřebení komponentů |

## Frontend komponenty (76)

Všechny komponenty jsou vanilla JavaScript moduly bez build kroku. Načítají se přímo v prohlížeči přes `<script type="module">`.

| Komponenta | Účel |
|-----------|--------|
| `print-preview.js` | 3D prohlížeč modelů + odhalení obrázků MakerWorld |
| `model-viewer.js` | WebGL 3D renderování s animací vrstev |
| `temperature-gauge.js` | Animované SVG kruhové ukazatele |
| `sparkline-stats.js` | Statistické panely ve stylu Grafana |
| `ams-panel.js` | Vizualizace filamentu AMS |
| `camera-view.js` | jsmpeg přehrávač videa s celou obrazovkou |
| `controls-panel.js` | UI ovládání tiskárny |
| `history-table.js` | Historie tisků s vyhledáváním, filtry, exportem CSV |
| `filament-tracker.js` | Sklad filamentů s oblíbenými, filtrováním barev |
| `queue-panel.js` | Správa fronty tisků |
| `knowledge-panel.js` | Čtečka a editor znalostní báze |

## Databáze

Databáze SQLite je vestavěná v Node.js 22 a nevyžaduje žádnou externí instalaci. Schéma je spravováno 105 migracemi v `db/migrations.js`.

Hlavní tabulky databáze:

- `printers` — konfigurace tiskáren
- `print_history` — všechny tiskové úlohy
- `filaments` — sklad filamentů
- `ams_slots` — mapování slotů AMS
- `queue` — fronta tisků
- `notifications_config` — nastavení oznámení
- `maintenance_log` — protokol údržby

## Bezpečnost

- HTTPS s automaticky generovaným certifikátem (nebo vlastním)
- Autentizace na základě JWT
- CSP a HSTS záhlaví
- Omezení počtu požadavků (200 req/min)
- Žádná závislost na externím cloudu pro základní funkce
