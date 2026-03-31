---
sidebar_position: 2
title: Architektura techniczna
description: Przegląd architektury 3DPrintForge — stos technologiczny, moduły, baza danych i WebSocket
---

# Architektura techniczna

## Diagram systemu

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

Dashboard komunikuje się z drukarką przez MQTT over TLS (port 8883) i kamerą przez RTSPS (port 322). Przeglądarka łączy się z dashboardem przez HTTPS i WebSocket.

## Stos technologiczny

| Warstwa | Technologia |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 modułów komponentów, brak kroku budowania, brak frameworków |
| Backend | Node.js 22 z 3 pakietami npm: `mqtt`, `ws`, `basic-ftp` |
| Baza danych | SQLite (wbudowana w Node.js 22 przez `--experimental-sqlite`) |
| Kamera | ffmpeg transkoduje RTSPS do MPEG1, jsmpeg renderuje w przeglądarce |
| Czas rzeczywisty | Hub WebSocket wysyła stan drukarki do wszystkich podłączonych klientów |
| Protokół | MQTT over TLS (port 8883) z LAN Access Code drukarki |

## Porty

| Port | Protokół | Kierunek | Opis |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | Wejście | Dashboard (przekierowuje do HTTPS) |
| 3443 | HTTPS + WSS | Wejście | Bezpieczny dashboard (domyślnie) |
| 9001+ | WS | Wejście | Strumienie kamery (jeden na drukarkę) |
| 8883 | MQTTS | Wyjście | Połączenie z drukarką |
| 322 | RTSPS | Wyjście | Kamera z drukarki |

## Moduły serwera (44)

| Moduł | Cel |
|-------|--------|
| `index.js` | Serwery HTTP/HTTPS, auto-SSL, nagłówki CSP/HSTS, pliki statyczne, tryb demo |
| `config.js` | Ładowanie konfiguracji, wartości domyślne, nadpisania środowiskowe i migracje |
| `database.js` | Schemat SQLite, 105 migracji, operacje CRUD |
| `api-routes.js` | REST API (284+ endpointów) |
| `auth.js` | Uwierzytelnianie i zarządzanie sesjami |
| `backup.js` | Tworzenie i przywracanie kopii zapasowych |
| `printer-manager.js` | Cykl życia drukarki, zarządzanie połączeniami MQTT |
| `mqtt-client.js` | Połączenie MQTT z drukarkami Bambu |
| `mqtt-commands.js` | Budowanie poleceń MQTT (wstrzymaj, wznów, zatrzymaj itp.) |
| `websocket-hub.js` | Transmisja WebSocket do wszystkich klientów przeglądarki |
| `camera-stream.js` | Zarządzanie procesami ffmpeg dla strumieni kamery |
| `print-tracker.js` | Śledzenie zadań drukowania, przejścia stanów, logowanie historii |
| `print-guard.js` | Ochrona wydruku przez xcam + monitorowanie czujników |
| `queue-manager.js` | Kolejka wydruków z wysyłką do wielu drukarek i balansowaniem obciążenia |
| `slicer-service.js` | Most CLI slicera lokalnego, przesyłanie plików, przesyłanie FTPS |
| `telemetry.js` | Przetwarzanie danych telemetrycznych |
| `telemetry-sampler.js` | Próbkowanie danych szeregów czasowych |
| `thumbnail-service.js` | Pobieranie miniatur przez FTPS z SD drukarki |
| `timelapse-service.js` | Nagrywanie i zarządzanie timelapse |
| `notifications.js` | 7-kanałowy system powiadomień (Telegram, Discord, E-mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | Automatyczna aktualizacja GitHub Releases z kopią zapasową |
| `setup-wizard.js` | Kreator konfiguracji webowej dla pierwszego użycia |
| `ecom-license.js` | Zarządzanie licencjami |
| `failure-detection.js` | Wykrywanie i analiza awarii |
| `bambu-cloud.js` | Integracja API Bambu Cloud |
| `bambu-rfid-data.js` | Dane filamentu RFID z AMS |
| `circuit-breaker.js` | Wzorzec wyłącznika dla stabilności usług |
| `energy-service.js` | Obliczenia energii i cen prądu |
| `error-pattern-analyzer.js` | Analiza wzorców błędów HMS |
| `file-parser.js` | Parsowanie plików 3MF/GCode |
| `logger.js` | Strukturalne logowanie |
| `material-recommender.js` | Rekomendacje materiałów |
| `milestone-service.js` | Śledzenie kamieni milowych i osiągnięć |
| `plugin-manager.js` | System wtyczek do rozszerzeń |
| `power-monitor.js` | Integracja miernika prądu (Shelly/Tasmota) |
| `price-checker.js` | Pobieranie cen prądu (Tibber/Nordpool) |
| `printer-discovery.js` | Automatyczne wykrywanie drukarek w LAN |
| `remote-nodes.js` | Zarządzanie wieloma węzłami |
| `report-service.js` | Generowanie raportów |
| `seed-filament-db.js` | Seeding bazy danych filamentów |
| `spoolease-data.js` | Integracja SpoolEase |
| `validate.js` | Walidacja danych wejściowych |
| `wear-prediction.js` | Przewidywanie zużycia komponentów |

## Komponenty frontendowe (76)

Wszystkie komponenty to moduły JavaScript vanilla bez kroku budowania. Są ładowane bezpośrednio w przeglądarce przez `<script type="module">`.

| Komponent | Cel |
|-----------|--------|
| `print-preview.js` | Przeglądarka modeli 3D + pobieranie zdjęć MakerWorld |
| `model-viewer.js` | Renderowanie 3D WebGL z animacją warstw |
| `temperature-gauge.js` | Animowane pierścieniowe wskaźniki SVG |
| `sparkline-stats.js` | Panele statystyk w stylu Grafana |
| `ams-panel.js` | Wizualizacja filamentów AMS |
| `camera-view.js` | Odtwarzacz wideo jsmpeg z pełnym ekranem |
| `controls-panel.js` | Interfejs sterowania drukarką |
| `history-table.js` | Historia wydruków z wyszukiwaniem, filtrami, eksportem CSV |
| `filament-tracker.js` | Magazyn filamentów z ulubionymi, filtrowaniem kolorów |
| `queue-panel.js` | Zarządzanie kolejką wydruków |
| `knowledge-panel.js` | Czytnik i edytor bazy wiedzy |

## Baza danych

Baza danych SQLite jest wbudowana w Node.js 22 i nie wymaga zewnętrznej instalacji. Schemat jest obsługiwany przez 105 migracji w `db/migrations.js`.

Główne tabele bazy danych:

- `printers` — konfiguracja drukarek
- `print_history` — wszystkie zadania drukowania
- `filaments` — magazyn filamentów
- `ams_slots` — powiązanie slotów AMS
- `queue` — kolejka wydruków
- `notifications_config` — ustawienia powiadomień
- `maintenance_log` — dziennik konserwacji

## Bezpieczeństwo

- HTTPS z automatycznie generowanym certyfikatem (lub własnym)
- Uwierzytelnianie oparte na JWT
- Nagłówki CSP i HSTS
- Ograniczanie szybkości (200 żądań/min)
- Brak zewnętrznej zależności od chmury dla podstawowych funkcji
