---
sidebar_position: 1
title: API-referens
description: REST API med 284+ endpunkter, autentisering och rate limiting
---

# API-referens

3DPrintForge exponerar ett fullständigt REST API med 284+ endpunkter. API-dokumentationen är tillgänglig direkt i dashboardet.

## Interaktiv dokumentation

Öppna OpenAPI-dokumentationen i webbläsaren:

```
https://din-server:3443/api/docs
```

Här hittar du alla endpunkter, parametrar, request/response-scheman och möjlighet att testa API:et direkt.

## Autentisering

API:et använder **Bearer token**-autentisering (JWT):

```bash
# Logga in och hämta token
curl -X POST https://din-server:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "ditt-lösenord"}'

# Svar
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Använd token i alla efterföljande anrop:

```bash
curl https://din-server:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate limiting

API:et är rate-begränsat för att skydda servern:

| Gräns | Värde |
|--------|-------|
| Förfrågningar per minut | 200 |
| Burst (max per sekund) | 20 |
| Svar vid överskridande | `429 Too Many Requests` |

`Retry-After`-header i svaret anger hur många sekunder till nästa förfrågan är tillåten.

## Endpunktsöversikt

### Autentisering
| Metod | Endpunkt | Beskrivning |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Logga in, hämta JWT |
| POST | `/api/auth/logout` | Logga ut |
| GET | `/api/auth/me` | Hämta inloggad användare |

### Skrivare
| Metod | Endpunkt | Beskrivning |
|--------|-----------|-------------|
| GET | `/api/printers` | Lista alla skrivare |
| POST | `/api/printers` | Lägg till skrivare |
| GET | `/api/printers/:id` | Hämta skrivare |
| PUT | `/api/printers/:id` | Uppdatera skrivare |
| DELETE | `/api/printers/:id` | Ta bort skrivare |
| GET | `/api/printers/:id/status` | Realtidsstatus |
| POST | `/api/printers/:id/command` | Skicka kommando |

### Filament
| Metod | Endpunkt | Beskrivning |
|--------|-----------|-------------|
| GET | `/api/filaments` | Lista alla spolar |
| POST | `/api/filaments` | Lägg till spole |
| PUT | `/api/filaments/:id` | Uppdatera spole |
| DELETE | `/api/filaments/:id` | Ta bort spole |
| GET | `/api/filaments/stats` | Förbrukningsstatistik |

### Utskriftshistorik
| Metod | Endpunkt | Beskrivning |
|--------|-----------|-------------|
| GET | `/api/history` | Lista historik (paginerad) |
| GET | `/api/history/:id` | Hämta enskild utskrift |
| GET | `/api/history/export` | Exportera CSV |
| GET | `/api/history/stats` | Statistik |

### Utskriftskö
| Metod | Endpunkt | Beskrivning |
|--------|-----------|-------------|
| GET | `/api/queue` | Hämta kön |
| POST | `/api/queue` | Lägg till jobb |
| PUT | `/api/queue/:id` | Uppdatera jobb |
| DELETE | `/api/queue/:id` | Ta bort jobb |
| POST | `/api/queue/dispatch` | Tvinga utsändning |

## WebSocket API

Utöver REST finns ett WebSocket API för realtidsdata:

```javascript
const ws = new WebSocket('wss://din-server:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Meddelandetyper (inkommande)
- `printer.status` — uppdaterad skrivarstatus
- `print.progress` — förloppsprocentuppdatering
- `ams.update` — AMS-tillståndsändring
- `notification` — aviseringsmeddelande

## Felkoder

| Kod | Innebär |
|------|-------|
| 200 | OK |
| 201 | Skapad |
| 400 | Ogiltig förfrågan |
| 401 | Inte autentiserad |
| 403 | Inte auktoriserad |
| 404 | Hittades inte |
| 429 | För många förfrågningar |
| 500 | Serverfel |
