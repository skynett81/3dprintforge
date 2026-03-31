---
sidebar_position: 3
title: Ustawienia
description: Kompletny przegląd wszystkich ustawień w 3DPrintForge — drukarka, powiadomienia, motyw, OBS, energia, webhooks i więcej
---

# Ustawienia

Wszystkie ustawienia w 3DPrintForge są zebrane na jednej stronie z przejrzystymi kategoriami. Oto przegląd zawartości każdej kategorii.

Przejdź do: **https://localhost:3443/#settings**

## Drukarki

Zarządzaj zarejestrowanymi drukarkami:

| Ustawienie | Opis |
|---|---|
| Dodaj drukarkę | Zarejestruj nową drukarkę z numerem seryjnym i kluczem dostępu |
| Nazwa drukarki | Niestandardowa nazwa wyświetlania |
| Model drukarki | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| Połączenie MQTT | Bambu Cloud MQTT lub lokalny MQTT |
| Klucz dostępu | LAN Access Code z aplikacji Bambu Lab |
| Adres IP | Dla trybu lokalnego (LAN) |
| Ustawienia kamery | Aktywuj/dezaktywuj, rozdzielczość |

Zobacz [Pierwsze kroki](../getting-started/setup) dla konfiguracji krok po kroku pierwszej drukarki.

## Powiadomienia

Pełna dokumentacja w [Powiadomieniach](../features/notifications).

Szybki przegląd:
- Aktywuj/dezaktywuj kanały powiadomień (Telegram, Discord, e-mail itp.)
- Filtr zdarzeń per kanał
- Godziny ciszy (przedział czasowy bez powiadomień)
- Przycisk testowy per kanał

## Motyw

Pełna dokumentacja w [Motywie](./themes).

- Tryb jasny / ciemny / auto
- 6 palet kolorów
- Niestandardowy kolor akcentu
- Zaokrąglenie i kompaktowość

## Nakładka OBS

Konfiguracja nakładki OBS:

| Ustawienie | Opis |
|---|---|
| Domyślny motyw | dark / light / minimal |
| Domyślna pozycja | Róg nakładki |
| Domyślna skala | Skalowanie (0,5–2,0) |
| Pokaż kod QR | Wyświetl kod QR do dashboardu w nakładce |

Zobacz [Nakładkę OBS](../features/obs-overlay) dla pełnej składni URL i konfiguracji.

## Energia i prąd

| Ustawienie | Opis |
|---|---|
| Token API Tibber | Dostęp do cen spotowych Tibber |
| Obszar cenowy Nordpool | Wybierz region cenowy |
| Opłata sieciowa (zł/kWh) | Twoja stawka opłaty sieciowej |
| Moc drukarki (W) | Skonfiguruj zużycie mocy na model drukarki |

## Home Assistant

| Ustawienie | Opis |
|---|---|
| Broker MQTT | IP, port, nazwa użytkownika, hasło |
| Prefiks discovery | Domyślnie: `homeassistant` |
| Aktywuj discovery | Publikuj urządzenia do HA |

## Webhooks

Globalne ustawienia webhook:

| Ustawienie | Opis |
|---|---|
| URL Webhook | Docelowy URL dla zdarzeń |
| Tajny klucz | Podpis HMAC-SHA256 |
| Filtr zdarzeń | Które zdarzenia są wysyłane |
| Liczba ponownych prób | Liczba prób przy błędzie (domyślnie: 3) |
| Timeout | Sekundy przed poddaniem się (domyślnie: 10) |

## Ustawienia kolejki

| Ustawienie | Opis |
|---|---|
| Automatyczna wysyłka | Aktywuj/dezaktywuj |
| Strategia wysyłki | Pierwsza dostępna / Najmniej używana / Runda |
| Wymagaj potwierdzenia | Ręczna akceptacja przed wysłaniem |
| Rozłożony start | Opóźnienie między drukarkami w kolejce |

## Bezpieczeństwo

| Ustawienie | Opis |
|---|---|
| Czas trwania sesji | Godziny/dni przed automatycznym wylogowaniem |
| Wymuś 2FA | Wymagaj 2FA dla wszystkich użytkowników |
| Biała lista IP | Ogranicz dostęp do określonych adresów IP |
| Certyfikat HTTPS | Prześlij niestandardowy certyfikat |

## System

| Ustawienie | Opis |
|---|---|
| Port serwera | Domyślnie: 3443 |
| Format dziennika | JSON / Tekst |
| Poziom dziennika | Error / Warn / Info / Debug |
| Czyszczenie bazy danych | Automatyczne usuwanie starej historii |
| Aktualizacje | Sprawdź dostępność nowych wersji |
