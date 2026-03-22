---
sidebar_position: 7
title: Konfiguracja powiadomień
description: Konfiguruj Telegram, Discord, e-mail i powiadomienia push w Bambu Dashboard
---

# Konfiguracja powiadomień

Bambu Dashboard może powiadamiać Cię o wszystkim — od ukończonych wydruków po krytyczne błędy — przez Telegram, Discord, e-mail lub powiadomienia push przeglądarki.

## Przegląd kanałów powiadomień

| Kanał | Najlepszy dla | Wymaga |
|-------|--------------|--------|
| Telegram | Szybko, wszędzie | Konto Telegram + token bota |
| Discord | Zespół/społeczność | Serwer Discord + URL webhooka |
| E-mail (SMTP) | Oficjalne powiadomienia | Serwer SMTP |
| Push przeglądarki | Powiadomienia desktopowe | Przeglądarka z obsługą push |

---

## Bot Telegram

### Krok 1 — Utwórz bota

1. Otwórz Telegram i wyszukaj **@BotFather**
2. Wyślij `/newbot`
3. Nadaj botowi nazwę (np. „Bambu Powiadomienia")
4. Nadaj botowi nazwę użytkownika (np. `bambu_powiadomienia_bot`) — musi kończyć się na `bot`
5. BotFather odpowie z **tokenem API**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Skopiuj i zachowaj ten token

### Krok 2 — Znajdź swoje Chat ID

1. Rozpocznij rozmowę ze swoim botem (wyszukaj nazwę użytkownika i kliknij **Start**)
2. Wyślij wiadomość do bota (np. „hej")
3. Przejdź do `https://api.telegram.org/bot<TWÓJ_TOKEN>/getUpdates` w przeglądarce
4. Znajdź `"chat":{"id": 123456789}` — to jest Twoje Chat ID

### Krok 3 — Połącz z panelem

1. Przejdź do **Ustawienia → Powiadomienia → Telegram**
2. Wklej **Token bota**
3. Wklej **Chat ID**
4. Kliknij **Testuj powiadomienie** — powinieneś otrzymać testową wiadomość na Telegramie
5. Kliknij **Zapisz**

:::tip Powiadomienie grupowe
Chcesz powiadomić całą grupę? Dodaj bota do grupy Telegram, znajdź grupowe Chat ID (liczba ujemna, np. `-100123456789`) i użyj go zamiast tego.
:::

---

## Webhook Discord

### Krok 1 — Utwórz webhook w Discord

1. Przejdź do swojego serwera Discord
2. Kliknij prawym przyciskiem myszy na kanale, w którym chcesz otrzymywać powiadomienia → **Edytuj kanał**
3. Przejdź do **Integracje → Webhooks**
4. Kliknij **Nowy Webhook**
5. Nadaj mu nazwę (np. „Bambu Dashboard")
6. Wybierz avatar (opcjonalne)
7. Kliknij **Kopiuj URL webhooka**

URL wygląda tak:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Krok 2 — Dodaj do panelu

1. Przejdź do **Ustawienia → Powiadomienia → Discord**
2. Wklej **URL webhooka**
3. Kliknij **Testuj powiadomienie** — kanał Discord powinien otrzymać testową wiadomość
4. Kliknij **Zapisz**

---

## E-mail (SMTP)

### Wymagane informacje

Potrzebujesz ustawień SMTP od swojego dostawcy poczty e-mail:

| Dostawca | Serwer SMTP | Port | Szyfrowanie |
|----------|-------------|------|-------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Własna domena | smtp.twojadomena.pl | 587 | TLS |

:::warning Gmail wymaga hasła aplikacji
Gmail blokuje logowanie zwykłym hasłem. Musisz utworzyć **Hasło aplikacji** w Koncie Google → Bezpieczeństwo → Weryfikacja dwuetapowa → Hasła aplikacji.
:::

### Konfiguracja w panelu

1. Przejdź do **Ustawienia → Powiadomienia → E-mail**
2. Wypełnij:
   - **Serwer SMTP**: np. `smtp.gmail.com`
   - **Port**: `587`
   - **Nazwa użytkownika**: Twój adres e-mail
   - **Hasło**: hasło aplikacji lub zwykłe hasło
   - **Adres od**: e-mail, z którego wysyłane jest powiadomienie
   - **Adres do**: e-mail, na który chcesz otrzymywać powiadomienia
3. Kliknij **Testuj e-mail**
4. Kliknij **Zapisz**

---

## Powiadomienia push przeglądarki

Powiadomienia push pojawiają się jako powiadomienia systemowe na pulpicie — nawet gdy karta przeglądarki jest w tle.

**Włączanie:**
1. Przejdź do **Ustawienia → Powiadomienia → Powiadomienia push**
2. Kliknij **Włącz powiadomienia push**
3. Przeglądarka pyta o pozwolenie — kliknij **Zezwól**
4. Kliknij **Testuj powiadomienie**

:::info Tylko w przeglądarce, w której to włączyłeś
Powiadomienia push są powiązane z konkretną przeglądarką i urządzeniem. Włącz je na każdym urządzeniu, na którym chcesz otrzymywać powiadomienia.
:::

---

## Wybór zdarzeń do powiadamiania

Po skonfigurowaniu kanału powiadomień możesz dokładnie wybrać, które zdarzenia wyzwalają powiadomienie:

**W Ustawienia → Powiadomienia → Zdarzenia:**

| Zdarzenie | Zalecane |
|-----------|----------|
| Wydruk ukończony | Tak |
| Wydruk nieudany / anulowany | Tak |
| Print Guard: wykryto spaghetti | Tak |
| Błąd HMS (krytyczny) | Tak |
| Ostrzeżenie HMS | Opcjonalne |
| Filament niski poziom | Tak |
| Błąd AMS | Tak |
| Drukarka rozłączona | Opcjonalne |
| Przypomnienie o konserwacji | Opcjonalne |
| Nocny backup ukończony | Nie (uciążliwe) |

---

## Godziny ciszy (bez powiadomień w nocy)

Unikaj budzenia się przez ukończony wydruk o 03:00:

1. Przejdź do **Ustawienia → Powiadomienia → Godziny ciszy**
2. Włącz **Godziny ciszy**
3. Ustaw czas od-do (np. **22:00 do 07:00**)
4. Wybierz, które zdarzenia nadal będą powiadamiać w ciszy:
   - **Krytyczne błędy HMS** — zalecane zachowanie
   - **Print Guard** — zalecane zachowanie
   - **Wydruk ukończony** — można wyłączyć w nocy

:::tip Nocne wydruki bez zakłóceń
Uruchamiaj wydruki w nocy z włączonymi godzinami ciszy. Print Guard czuwa — a rano otrzymasz podsumowanie.
:::
