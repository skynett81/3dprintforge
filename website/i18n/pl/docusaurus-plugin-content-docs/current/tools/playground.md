---
sidebar_position: 4
title: Plac zabaw API
description: Testuj wszystkie 177 endpointów API bezpośrednio w przeglądarce ze wbudowaną dokumentacją OpenAPI i uwierzytelnianiem
---

# Plac zabaw API

Plac zabaw API pozwala eksplorować i testować wszystkie 177 endpointów API Bambu Dashboard bezpośrednio w przeglądarce — bez pisania kodu.

Przejdź do: **https://localhost:3443/api/docs**

## Czym jest plac zabaw API?

Plac zabaw to interaktywna wersja dokumentacji OpenAPI (Swagger UI) w pełni zintegrowana z dashboardem. Jesteś już uwierzytelniony po zalogowaniu, więc możesz testować endpointy bezpośrednio.

## Nawigacja w dokumentacji

Endpointy są zorganizowane w kategoriach:

| Kategoria | Liczba endpointów | Opis |
|---|---|---|
| Drukarki | 24 | Pobierz status, steruj, konfiguruj |
| Wydruki / Historia | 18 | Pobierz, szukaj, eksportuj historię |
| Filament | 22 | Magazyn, szpule, profile |
| Kolejka | 12 | Zarządzaj kolejką wydruków |
| Statystyki | 15 | Zagregowane statystyki i eksport |
| Powiadomienia | 8 | Konfiguruj i testuj kanały powiadomień |
| Użytkownicy | 10 | Użytkownicy, role, klucze API |
| Ustawienia | 14 | Odczytaj i zmień konfigurację |
| Konserwacja | 12 | Zadania konserwacyjne i dziennik |
| Integracje | 18 | HA, Tibber, webhooks itp. |
| Biblioteka plików | 14 | Przesyłaj, analizuj, zarządzaj |
| System | 10 | Backup, kondycja, dziennik |

Kliknij kategorię, aby rozwinąć i zobaczyć wszystkie endpointy.

## Testowanie endpointu

1. Kliknij endpoint (np. `GET /api/printers`)
2. Kliknij **Try it out** (wypróbuj)
3. Wypełnij ewentualne parametry (filtr, paginację, ID drukarki itp.)
4. Kliknij **Execute**
5. Zobacz odpowiedź poniżej: kod statusu HTTP, nagłówki i treść JSON

### Przykład: Pobierz wszystkie drukarki

```
GET /api/printers
```
Zwraca listę wszystkich zarejestrowanych drukarek ze statusem w czasie rzeczywistym.

### Przykład: Wyślij polecenie do drukarki

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Środowisko produkcyjne
Plac zabaw API jest połączony z rzeczywistym systemem. Polecenia są wysyłane do prawdziwych drukarek. Zachowaj ostrożność z destrukcyjnymi operacjami takimi jak `DELETE` i `POST /command`.
:::

## Uwierzytelnianie

### Uwierzytelnianie sesji (zalogowany użytkownik)
Po zalogowaniu do dashboardu, plac zabaw jest już uwierzytelniony przez cookie sesji. Nie jest wymagana żadna dodatkowa konfiguracja.

### Uwierzytelnianie kluczem API

Dla zewnętrznego dostępu:

1. Kliknij **Authorize** (ikona kłódki na górze placu zabaw)
2. Wypełnij swój klucz API w polu **ApiKeyAuth**: `Bearer TWÓJ_KLUCZ`
3. Kliknij **Authorize**

Generuj klucze API w **Ustawienia → Klucze API** (zob. [Uwierzytelnianie](../system/auth)).

## Ograniczanie szybkości

API ma ograniczenie szybkości do **200 żądań na minutę** na użytkownika/klucz. Plac zabaw pokazuje pozostałe żądania w nagłówku odpowiedzi `X-RateLimit-Remaining`.

:::info Specyfikacja OpenAPI
Pobierz całą specyfikację OpenAPI jako YAML lub JSON:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Użyj specyfikacji do generowania bibliotek klienckich w Python, TypeScript, Go itp.
:::

## Testowanie webhook

Testuj integracje webhook bezpośrednio:

1. Przejdź do `POST /api/webhooks/test`
2. Wybierz typ zdarzenia z listy rozwijanej
3. System wysyła zdarzenie testowe do skonfigurowanego URL webhook
4. Zobacz żądanie/odpowiedź w placu zabaw
