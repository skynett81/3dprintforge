---
sidebar_position: 1
title: Przegląd funkcji
description: Kompletny przegląd wszystkich funkcji 3DPrintForge
---

# Przegląd funkcji

3DPrintForge zbiera wszystko, czego potrzebujesz do monitorowania i sterowania drukarkami Bambu Lab, w jednym miejscu.

## Dashboard

Główny dashboard wyświetla aktualny status aktywnej drukarki:

- **Temperatura** — animowane pierścieniowe mierniki SVG dla dyszy i stołu
- **Postęp** — procentowy postęp z szacowanym czasem zakończenia
- **Kamera** — transmisja na żywo (RTSPS → MPEG1 przez ffmpeg)
- **Panel AMS** — wizualna reprezentacja wszystkich slotów AMS z kolorami filamentów
- **Kontrola prędkości** — suwak do regulacji prędkości (Cicha, Standardowa, Sport, Turbo)
- **Panele statystyk** — panele w stylu Grafana ze sparklines
- **Telemetria** — wartości na żywo dla wentylatorów, temperatur, ciśnienia

Panele można przeciągać i upuszczać, aby dostosować układ. Użyj przycisku blokady, aby zablokować układ.

## Magazyn filamentów

Zobacz [Filament](./filament), aby uzyskać pełną dokumentację.

- Śledź wszystkie szpule z nazwą, kolorem, wagą i dostawcą
- Synchronizacja AMS — sprawdź, które szpule są w AMS
- Dziennik i plan suszenia
- Karty kolorów i obsługa tagów NFC
- Import/eksport (CSV)

## Historia wydruków

Zobacz [Historia](./history), aby uzyskać pełną dokumentację.

- Kompletny dziennik wszystkich wydruków
- Śledzenie filamentów na wydruk
- Linki do modeli z MakerWorld
- Statystyki i eksport do CSV

## Harmonogram

Zobacz [Harmonogram](./scheduler), aby uzyskać pełną dokumentację.

- Widok kalendarza wydruków
- Kolejka wydruków z priorytetyzacją
- Dystrybucja między wieloma drukarkami

## Kontrola drukarki

Zobacz [Sterowanie](./controls), aby uzyskać pełną dokumentację.

- Kontrola temperatury (dysza, stół, komora)
- Kontrola profili prędkości
- Kontrola wentylatorów
- Konsola G-code
- Ładowanie/rozładowywanie filamentu

## Powiadomienia

3DPrintForge obsługuje 7 kanałów powiadomień:

| Kanał | Zdarzenia |
|-------|----------|
| Telegram | Wydruk gotowy, błąd, pauza |
| Discord | Wydruk gotowy, błąd, pauza |
| E-mail | Wydruk gotowy, błąd |
| ntfy | Wszystkie zdarzenia |
| Pushover | Wszystkie zdarzenia |
| SMS (Twilio) | Błędy krytyczne |
| Webhook | Własny payload |

Skonfiguruj w **Ustawienia → Powiadomienia**.

## Print Guard

Print Guard monitoruje aktywny wydruk przez kamerę (xcam) i czujniki:

- Automatyczna pauza przy błędzie spaghetti
- Konfigurowalne poziomy czułości
- Dziennik wykrytych zdarzeń

## Konserwacja

Sekcja konserwacji śledzi:

- Następny zalecany serwis dla każdego komponentu (dysza, płyty, AMS)
- Śledzenie zużycia na podstawie historii wydruków
- Ręczne rejestrowanie zadań konserwacyjnych

## Wiele drukarek

Dzięki obsłudze wielu drukarek możesz:

- Zarządzać wieloma drukarkami z jednego dashboardu
- Przełączać się między drukarkami za pomocą selektora
- Widzieć przegląd statusu wszystkich drukarek jednocześnie
- Rozdzielać zadania wydruku za pomocą kolejki

## Nakładka OBS

Dedykowana strona `obs.html` zapewnia czystą nakładkę dla integracji z OBS Studio podczas transmisji na żywo wydruków.

## Aktualizacje

Wbudowana automatyczna aktualizacja przez GitHub Releases. Powiadomienia i aktualizacja bezpośrednio z dashboardu w **Ustawienia → Aktualizacja**.
