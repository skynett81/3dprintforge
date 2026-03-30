---
sidebar_position: 1
title: Dokumentacja API
description: REST API z 284+ endpointami, uwierzytelnianiem i ograniczaniem szybkości
---

# Dokumentacja API

Bambu Dashboard udostępnia kompletne REST API z 284+ endpointami. Dokumentacja API jest dostępna bezpośrednio w dashboardzie.

## Interaktywna dokumentacja

Otwórz dokumentację OpenAPI w przeglądarce:

```
https://twoj-serwer:3443/api/docs
```

Znajdziesz tu wszystkie endpointy, parametry, schematy żądań/odpowiedzi i możliwość bezpośredniego testowania API.

## Uwierzytelnianie

API używa uwierzytelniania **Bearer token** (JWT):

```bash
# Zaloguj się i pobierz token
curl -X POST https://twoj-serwer:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "twoje-haslo"}'

# Odpowiedź
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Użyj tokenu we wszystkich kolejnych wywołaniach:

```bash
curl https://twoj-serwer:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Ograniczanie szybkości

API jest ograniczone szybkościowo w celu ochrony serwera:

| Limit | Wartość |
|--------|-------|
| Żądania na minutę | 200 |
| Burst (maks. na sekundę) | 20 |
| Odpowiedź przy przekroczeniu | `429 Too Many Requests` |

Nagłówek `Retry-After` w odpowiedzi wskazuje, ile sekund do następnego dozwolonego żądania.

## Przegląd endpointów

### Uwierzytelnianie
| Metoda | Endpoint | Opis |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Zaloguj się, pobierz JWT |
| POST | `/api/auth/logout` | Wyloguj się |
| GET | `/api/auth/me` | Pobierz zalogowanego użytkownika |

### Drukarki
| Metoda | Endpoint | Opis |
|--------|-----------|-------------|
| GET | `/api/printers` | Lista wszystkich drukarek |
| POST | `/api/printers` | Dodaj drukarkę |
| GET | `/api/printers/:id` | Pobierz drukarkę |
| PUT | `/api/printers/:id` | Zaktualizuj drukarkę |
| DELETE | `/api/printers/:id` | Usuń drukarkę |
| GET | `/api/printers/:id/status` | Status w czasie rzeczywistym |
| POST | `/api/printers/:id/command` | Wyślij polecenie |

### Filament
| Metoda | Endpoint | Opis |
|--------|-----------|-------------|
| GET | `/api/filaments` | Lista wszystkich szpul |
| POST | `/api/filaments` | Dodaj szpulę |
| PUT | `/api/filaments/:id` | Zaktualizuj szpulę |
| DELETE | `/api/filaments/:id` | Usuń szpulę |
| GET | `/api/filaments/stats` | Statystyki zużycia |

### Historia wydruków
| Metoda | Endpoint | Opis |
|--------|-----------|-------------|
| GET | `/api/history` | Lista historii (stronicowana) |
| GET | `/api/history/:id` | Pobierz pojedynczy wydruk |
| GET | `/api/history/export` | Eksportuj CSV |
| GET | `/api/history/stats` | Statystyki |

### Kolejka wydruków
| Metoda | Endpoint | Opis |
|--------|-----------|-------------|
| GET | `/api/queue` | Pobierz kolejkę |
| POST | `/api/queue` | Dodaj zadanie |
| PUT | `/api/queue/:id` | Zaktualizuj zadanie |
| DELETE | `/api/queue/:id` | Usuń zadanie |
| POST | `/api/queue/dispatch` | Wymuś wysyłkę |

## WebSocket API

Oprócz REST dostępne jest API WebSocket dla danych w czasie rzeczywistym:

```javascript
const ws = new WebSocket('wss://twoj-serwer:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Typy wiadomości (przychodzące)
- `printer.status` — zaktualizowany status drukarki
- `print.progress` — aktualizacja procentu postępu
- `ams.update` — zmiana stanu AMS
- `notification` — wiadomość powiadomienia

## Kody błędów

| Kod | Znaczenie |
|------|-------|
| 200 | OK |
| 201 | Utworzono |
| 400 | Nieprawidłowe żądanie |
| 401 | Nieuwierzytelniony |
| 403 | Brak autoryzacji |
| 404 | Nie znaleziono |
| 429 | Zbyt wiele żądań |
| 500 | Błąd serwera |
