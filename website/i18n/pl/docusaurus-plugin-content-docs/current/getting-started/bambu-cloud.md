---
sidebar_position: 3
title: Integracja z Bambu Cloud
description: Połącz dashboard z Bambu Lab Cloud, aby synchronizować modele i historię wydruków
---

# Integracja z Bambu Cloud

3DPrintForge może łączyć się z **Bambu Lab Cloud** w celu pobierania zdjęć modeli, historii wydruków i danych o filamentach. Dashboard działa doskonale bez połączenia z chmurą, ale integracja z nią oferuje dodatkowe korzyści.

## Zalety integracji z chmurą

| Funkcja | Bez chmury | Z chmurą |
|---------|-----------|---------|
| Aktualny status drukarki | Tak | Tak |
| Historia wydruków (lokalna) | Tak | Tak |
| Zdjęcia modeli z MakerWorld | Nie | Tak |
| Profile filamentów Bambu | Nie | Tak |
| Synchronizacja historii | Nie | Tak |
| Filamenty AMS z chmury | Nie | Tak |

## Łączenie z Bambu Cloud

1. Przejdź do **Ustawienia → Bambu Cloud**
2. Wpisz swój adres e-mail i hasło do Bambu Lab
3. Kliknij **Zaloguj się**
4. Wybierz, które dane mają być synchronizowane

:::warning Prywatność
Nazwa użytkownika i hasło nie są przechowywane w postaci jawnej. Dashboard używa API Bambu Labs do pobrania tokenu OAuth, który jest przechowywany lokalnie. Twoje dane nigdy nie opuszczają Twojego serwera.
:::

## Synchronizacja

### Zdjęcia modeli

Po podłączeniu chmury, zdjęcia modeli są pobierane automatycznie z **MakerWorld** i wyświetlane w:
- Historii wydruków
- Dashboardzie (podczas aktywnego wydruku)
- Przeglądarce modeli 3D

### Historia wydruków

Synchronizacja z chmurą importuje historię wydruków z aplikacji Bambu Lab. Duplikaty są automatycznie filtrowane na podstawie znaczników czasu i numerów seryjnych.

### Profile filamentów

Oficjalne profile filamentów Bambu Labs są synchronizowane i wyświetlane w magazynie filamentów. Możesz używać ich jako punktu wyjścia do własnych profili.

## Co działa bez chmury?

Wszystkie podstawowe funkcje działają bez połączenia z chmurą:

- Bezpośrednie połączenie MQTT z drukarką przez LAN
- Aktualny status, temperatura, kamera
- Lokalna historia i statystyki wydruków
- Magazyn filamentów (zarządzany ręcznie)
- Powiadomienia i harmonogram

:::tip Tryb tylko LAN
Chcesz używać dashboardu całkowicie bez połączenia z internetem? Działa świetnie w izolowanej sieci — po prostu podłącz drukarkę przez IP i zostaw integrację z chmurą wyłączoną.
:::

## Rozwiązywanie problemów

**Logowanie nie działa:**
- Sprawdź, czy adres e-mail i hasło są poprawne dla aplikacji Bambu Lab
- Sprawdź, czy konto używa uwierzytelniania dwuskładnikowego (jeszcze nie obsługiwane)
- Spróbuj wylogować się i zalogować ponownie

**Synchronizacja się zatrzymuje:**
- Token mógł wygasnąć — wyloguj się i zaloguj ponownie w Ustawieniach
- Sprawdź połączenie internetowe serwera
