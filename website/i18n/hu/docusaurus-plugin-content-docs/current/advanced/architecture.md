---
sidebar_position: 2
title: Műszaki architektúra
description: A Bambu Dashboard architektúrájának áttekintése — stack, modulok, adatbázis és WebSocket
---

# Műszaki architektúra

## Rendszerdiagram

```
Böngésző <──WebSocket──> Node.js <──MQTTS:8883──> Nyomtató
Böngésző <──WS:9001+──> ffmpeg  <──RTSPS:322───> Kamera
```

A dashboard TLS-en keresztüli MQTT-n (8883-as port) kommunikál a nyomtatóval, és RTSPS-en (322-es port) keresztül a kamerával. A böngésző HTTPS-en és WebSocketen keresztül csatlakozik a dashboardhoz.

## Műszaki stack

| Réteg | Technológia |
|-------|-------------|
| Frontend | Vanilla HTML/CSS/JS — 76 komponensmodul, build-lépés nélkül, keretrendszer nélkül |
| Backend | Node.js 22, 3 npm-csomaggal: `mqtt`, `ws`, `basic-ftp` |
| Adatbázis | SQLite (beépített a Node.js 22-be a `--experimental-sqlite` révén) |
| Kamera | ffmpeg RTSPS-t MPEG1-re kódol, jsmpeg rendereli a böngészőben |
| Valós idő | WebSocket-hub nyomtatóállapotot sugároz az összes csatlakozott kliensnek |
| Protokoll | MQTT TLS-en keresztül (8883-as port) a nyomtató LAN hozzáférési kódjával |

## Portok

| Port | Protokoll | Irány | Leírás |
|------|-----------|-------|--------|
| 3000 | HTTP + WS | Be | Dashboard (átirányít HTTPS-re) |
| 3443 | HTTPS + WSS | Be | Biztonságos dashboard (alapértelmezett) |
| 9001+ | WS | Be | Kamerafolyamok (nyomtatónként egy) |
| 8883 | MQTTS | Ki | Nyomtatóhoz való csatlakozás |
| 322 | RTSPS | Ki | Kamera a nyomtatótól |

## Szervermodulok (44)

| Modul | Cél |
|-------|-----|
| `index.js` | HTTP/HTTPS szerverek, auto-SSL, CSP/HSTS fejlécek, statikus fájlok, demó mód |
| `config.js` | Konfiguráció betöltése, alapértelmezett értékek, env felülírások és migrációk |
| `database.js` | SQLite séma, 105 migráció, CRUD műveletek |
| `api-routes.js` | REST API (284+ végpont) |
| `auth.js` | Hitelesítés és munkamenet-kezelés |
| `backup.js` | Mentés és visszaállítás |
| `printer-manager.js` | Nyomtató életciklus, MQTT csatlakozáskezelés |
| `mqtt-client.js` | MQTT csatlakozás Bambu nyomtatókhoz |
| `mqtt-commands.js` | MQTT parancsépítés (szüneteltetés, folytatás, leállítás stb.) |
| `websocket-hub.js` | WebSocket közvetítés az összes böngészőkliensnek |
| `camera-stream.js` | ffmpeg folyamatkezelés kamerafolyamokhoz |
| `print-tracker.js` | Nyomtatási feladatkövetés, állapotátmenetek, előzmény-naplózás |
| `print-guard.js` | Nyomtatásvédelem xcam + érzékelőfigyeléssel |
| `queue-manager.js` | Nyomtatási sor több nyomtatós kiadással és terheléselosztással |
| `slicer-service.js` | Helyi szeletelő CLI-híd, fájlfeltöltés, FTPS feltöltés |
| `telemetry.js` | Telemetria adatfeldolgozás |
| `telemetry-sampler.js` | Idősorozat adatmintavételezés |
| `thumbnail-service.js` | Bélyegképek lekérése FTPS-en keresztül a nyomtató SD-kártyájáról |
| `timelapse-service.js` | Időköz-felvétel rögzítés és kezelés |
| `notifications.js` | 7 csatornás értesítési rendszer (Telegram, Discord, E-mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | GitHub Releases automatikus frissítés mentéssel |
| `setup-wizard.js` | Webalapú beállítási varázsló első indításhoz |
| `ecom-license.js` | Licenckezelés |
| `failure-detection.js` | Hibadetekció és -elemzés |
| `bambu-cloud.js` | Bambu Cloud API integráció |
| `bambu-rfid-data.js` | RFID filamentadatok az AMS-ből |
| `circuit-breaker.js` | Áramköri megszakítóval minta a szolgáltatás stabilitásához |
| `energy-service.js` | Energia- és áramárszámítás |
| `error-pattern-analyzer.js` | HMS-hibák mintázatelemzése |
| `file-parser.js` | 3MF/GCode fájlok elemzése |
| `logger.js` | Strukturált naplózás |
| `material-recommender.js` | Anyagajánlások |
| `milestone-service.js` | Mérföldkő- és teljesítménykövetés |
| `plugin-manager.js` | Plugin rendszer bővítményekhez |
| `power-monitor.js` | Fogyasztásmérő integráció (Shelly/Tasmota) |
| `price-checker.js` | Áramár lekérése (Tibber/Nordpool) |
| `printer-discovery.js` | Automatikus nyomtatófelismerés LAN-on |
| `remote-nodes.js` | Többcsomópontos kezelés |
| `report-service.js` | Jelentésgenerálás |
| `seed-filament-db.js` | Filamentadatbázis seedelése |
| `spoolease-data.js` | SpoolEase integráció |
| `validate.js` | Bemeneti validálás |
| `wear-prediction.js` | Alkatrész kopásbecslés |

## Frontend-komponensek (76)

Minden komponens vanilla JavaScript modul build-lépés nélkül. Ezek közvetlenül a böngészőben töltődnek be `<script type="module">` révén.

| Komponens | Cél |
|-----------|-----|
| `print-preview.js` | 3D modellnéző + MakerWorld képfeltárás |
| `model-viewer.js` | WebGL 3D renderelés réteganimációval |
| `temperature-gauge.js` | Animált SVG gyűrűmérők |
| `sparkline-stats.js` | Grafana-stílusú statisztikai panelek |
| `ams-panel.js` | AMS filament vizualizáció |
| `camera-view.js` | jsmpeg videólejátszó teljes képernyővel |
| `controls-panel.js` | Nyomtatóvezérlő UI |
| `history-table.js` | Nyomtatási előzmények kereséssel, szűrőkkel, CSV exporttal |
| `filament-tracker.js` | Filamentraktár kedvencekkel, színszűréssel |
| `queue-panel.js` | Nyomtatási sor kezelése |
| `knowledge-panel.js` | Tudásbázis olvasó és szerkesztő |

## Adatbázis

Az SQLite adatbázis be van építve a Node.js 22-be, és nincs szükség külső telepítésre. A séma a `db/migrations.js` fájlban lévő 105 migráció által kezelt.

Fő adatbázistáblák:

- `printers` — nyomtatókonfiguráció
- `print_history` — összes nyomtatási feladat
- `filaments` — filamentraktár
- `ams_slots` — AMS-nyílás összeköttetés
- `queue` — nyomtatási sor
- `notifications_config` — értesítési beállítások
- `maintenance_log` — karbantartási napló

## Biztonság

- HTTPS automatikusan generált tanúsítvánnyal (vagy sajáttal)
- JWT-alapú hitelesítés
- CSP és HSTS fejlécek
- Sebességkorlátozás (200 kérés/perc)
- Nincs külső felhőfüggőség az alapfunkcióknál
