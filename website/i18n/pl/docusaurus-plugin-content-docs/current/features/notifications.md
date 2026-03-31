---
sidebar_position: 6
title: Powiadomienia
description: Konfiguruj powiadomienia przez Telegram, Discord, e-mail, webhook, ntfy, Pushover i SMS dla wszystkich zdarzeń drukarki
---

# Powiadomienia

3DPrintForge obsługuje powiadomienia przez wiele kanałów, dzięki czemu zawsze wiesz, co dzieje się z Twoimi drukarkami — czy jesteś w domu, czy w trasie.

Przejdź do: **https://localhost:3443/#settings** → zakładka **Powiadomienia**

## Dostępne kanały

| Kanał | Wymaga | Obsługuje zdjęcia |
|---|---|---|
| Telegram | Token bota + Chat-ID | ✅ |
| Discord | URL webhooka | ✅ |
| E-mail | Serwer SMTP | ✅ |
| Webhook | URL + opcjonalny klucz | ✅ (base64) |
| ntfy | Serwer ntfy + temat | ❌ |
| Pushover | Token API + klucz użytkownika | ✅ |
| SMS (Twilio) | Account SID + token auth | ❌ |
| Push w przeglądarce | Brak konfiguracji | ❌ |

## Konfiguracja per kanał

### Telegram

1. Utwórz bota przez [@BotFather](https://t.me/BotFather) — wyślij `/newbot`
2. Skopiuj **token bota** (format: `123456789:ABC-def...`)
3. Rozpocznij rozmowę z botem i wyślij `/start`
4. Znajdź swój **Chat-ID**: przejdź do `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. W 3DPrintForge: wklej token i Chat-ID, kliknij **Test**

:::tip Kanał grupowy
Możesz używać grupy Telegram jako odbiorcy. Chat-ID dla grup zaczyna się od `-`.
:::

### Discord

1. Otwórz serwer Discord, do którego chcesz wysyłać powiadomienia
2. Przejdź do ustawień kanału → **Integracje → Webhooks**
3. Kliknij **Nowy webhook**, nadaj mu nazwę i wybierz kanał
4. Skopiuj URL webhooka
5. Wklej URL w 3DPrintForge i kliknij **Test**

### E-mail

1. Wypełnij serwer SMTP, port (zazwyczaj 587 dla TLS)
2. Nazwa użytkownika i hasło do konta SMTP
3. Adres **Od** i adres(y) **Do** (oddzielone przecinkami dla wielu)
4. Aktywuj **TLS/STARTTLS** dla bezpiecznego wysyłania
5. Kliknij **Test**, aby wysłać testowy e-mail

:::warning Gmail
Używaj **Hasła aplikacji** dla Gmail, nie zwykłego hasła. Najpierw aktywuj uwierzytelnianie dwuskładnikowe na koncie Google.
:::

### ntfy

1. Utwórz temat na [ntfy.sh](https://ntfy.sh) lub uruchom własny serwer ntfy
2. Wypełnij URL serwera (np. `https://ntfy.sh`) i nazwę tematu
3. Zainstaluj aplikację ntfy na telefonie i subskrybuj ten sam temat
4. Kliknij **Test**

### Pushover

1. Utwórz konto na [pushover.net](https://pushover.net)
2. Utwórz nową aplikację — skopiuj **token API**
3. Znajdź swój **User Key** na dashboardzie Pushover
4. Wypełnij oba pola w 3DPrintForge i kliknij **Test**

### Webhook (niestandardowy)

3DPrintForge wysyła HTTP POST z payloadem JSON:

```json
{
  "event": "print_complete",
  "printer": "Mój X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Dodaj **Tajny klucz**, aby weryfikować żądania za pomocą podpisu HMAC-SHA256 w nagłówku `X-Bambu-Signature`.

## Filtr zdarzeń

Wybierz, które zdarzenia mają wyzwalać powiadomienia per kanał:

| Zdarzenie | Opis |
|---|---|
| Wydruk rozpoczęty | Nowy wydruk się zaczyna |
| Wydruk ukończony | Wydruk gotowy (ze zdjęciem) |
| Wydruk nieudany | Wydruk przerwany z błędem |
| Wydruk wstrzymany | Ręczna lub automatyczna pauza |
| Alert Print Guard | XCam lub czujnik wyzwolił działanie |
| Mało filamentu | Szpula prawie pusta |
| Błąd AMS | Zablokowanie, wilgotny filament itp. |
| Drukarka rozłączona | Utracono połączenie MQTT |
| Zadanie z kolejki wysłane | Zadanie wysłane z kolejki |

Zaznacz zdarzenia, które chcesz dla każdego kanału oddzielnie.

## Cisza nocna

Unikaj powiadomień w nocy:

1. Aktywuj **Ciszę nocną** w ustawieniach powiadomień
2. Ustaw **Od** i **Do** (np. 23:00 → 07:00)
3. Wybierz **Strefę czasową** dla timera
4. Krytyczne powiadomienia (błędy Print Guard) mogą być zastępowane — zaznacz **Zawsze wysyłaj krytyczne**

## Powiadomienia push w przeglądarce

Otrzymuj powiadomienia bezpośrednio w przeglądarce bez aplikacji:

1. Przejdź do **Ustawienia → Powiadomienia → Push w przeglądarce**
2. Kliknij **Aktywuj powiadomienia push**
3. Zaakceptuj okno dialogowe uprawnień w przeglądarce
4. Powiadomienia działają nawet gdy dashboard jest zminimalizowany (wymaga otwartej karty)

:::info PWA
Zainstaluj 3DPrintForge jako PWA, aby otrzymywać powiadomienia push w tle bez otwartej karty. Zobacz [PWA](../system/pwa).
:::
