---
sidebar_position: 1
title: API-referentie
description: REST API met 284+ eindpunten, authenticatie en rate limiting
---

# API-referentie

3DPrintForge biedt een volledig REST API met 284+ eindpunten. De API-documentatie is direct beschikbaar in het dashboard.

## Interactieve documentatie

Open de OpenAPI-documentatie in de browser:

```
https://uw-server:3443/api/docs
```

Hier vindt u alle eindpunten, parameters, verzoek-/antwoordschema's en de mogelijkheid om de API direct te testen.

## Authenticatie

De API gebruikt **Bearer token**-authenticatie (JWT):

```bash
# Inloggen en token ophalen
curl -X POST https://uw-server:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "uw-wachtwoord"}'

# Antwoord
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Gebruik het token in alle volgende aanroepen:

```bash
curl https://uw-server:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate limiting

De API heeft rate limiting om de server te beschermen:

| Limiet | Waarde |
|--------|-------|
| Verzoeken per minuut | 200 |
| Burst (max per seconde) | 20 |
| Antwoord bij overschrijding | `429 Too Many Requests` |

De `Retry-After`-header in het antwoord geeft aan hoeveel seconden tot het volgende verzoek is toegestaan.

## Overzicht eindpunten

### Authenticatie
| Methode | Eindpunt | Beschrijving |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Inloggen, JWT ophalen |
| POST | `/api/auth/logout` | Uitloggen |
| GET | `/api/auth/me` | Ingelogde gebruiker ophalen |

### Printers
| Methode | Eindpunt | Beschrijving |
|--------|-----------|-------------|
| GET | `/api/printers` | Alle printers weergeven |
| POST | `/api/printers` | Printer toevoegen |
| GET | `/api/printers/:id` | Printer ophalen |
| PUT | `/api/printers/:id` | Printer bijwerken |
| DELETE | `/api/printers/:id` | Printer verwijderen |
| GET | `/api/printers/:id/status` | Realtime status |
| POST | `/api/printers/:id/command` | Opdracht sturen |

### Filament
| Methode | Eindpunt | Beschrijving |
|--------|-----------|-------------|
| GET | `/api/filaments` | Alle spoelen weergeven |
| POST | `/api/filaments` | Spoel toevoegen |
| PUT | `/api/filaments/:id` | Spoel bijwerken |
| DELETE | `/api/filaments/:id` | Spoel verwijderen |
| GET | `/api/filaments/stats` | Verbruiksstatistieken |

### Printgeschiedenis
| Methode | Eindpunt | Beschrijving |
|--------|-----------|-------------|
| GET | `/api/history` | Geschiedenis weergeven (gepagineerd) |
| GET | `/api/history/:id` | Individuele print ophalen |
| GET | `/api/history/export` | CSV exporteren |
| GET | `/api/history/stats` | Statistieken |

### Printwachtrij
| Methode | Eindpunt | Beschrijving |
|--------|-----------|-------------|
| GET | `/api/queue` | Wachtrij ophalen |
| POST | `/api/queue` | Taak toevoegen |
| PUT | `/api/queue/:id` | Taak bijwerken |
| DELETE | `/api/queue/:id` | Taak verwijderen |
| POST | `/api/queue/dispatch` | Verzending forceren |

## WebSocket API

Naast REST is er een WebSocket API voor realtime data:

```javascript
const ws = new WebSocket('wss://uw-server:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Berichttypen (inkomend)
- `printer.status` — bijgewerkte printerstatus
- `print.progress` — voortgangspercentage bijgewerkt
- `ams.update` — AMS-statuswijziging
- `notification` — waarschuwingsbericht

## Foutcodes

| Code | Betekenis |
|------|-------|
| 200 | OK |
| 201 | Aangemaakt |
| 400 | Ongeldig verzoek |
| 401 | Niet geauthenticeerd |
| 403 | Niet geautoriseerd |
| 404 | Niet gevonden |
| 429 | Te veel verzoeken |
| 500 | Serverfout |
