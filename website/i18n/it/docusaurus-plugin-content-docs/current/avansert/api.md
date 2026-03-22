---
sidebar_position: 1
title: Riferimento API
description: REST API con 284+ endpoint, autenticazione e rate limiting
---

# Riferimento API

Bambu Dashboard espone un REST API completo con 284+ endpoint. La documentazione API è disponibile direttamente nel dashboard.

## Documentazione Interattiva

Apri la documentazione OpenAPI nel browser:

```
https://tuo-server:3443/api/docs
```

Qui trovi tutti gli endpoint, i parametri, gli schemi di request/response e la possibilità di testare l'API direttamente.

## Autenticazione

L'API utilizza l'autenticazione **Bearer token** (JWT):

```bash
# Accedi e ottieni il token
curl -X POST https://tuo-server:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "la-tua-password"}'

# Risposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Usa il token in tutte le chiamate successive:

```bash
curl https://tuo-server:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate Limiting

L'API è limitata in velocità per proteggere il server:

| Limite | Valore |
|--------|-------|
| Richieste per minuto | 200 |
| Burst (max per secondo) | 20 |
| Risposta al superamento | `429 Too Many Requests` |

L'header `Retry-After` nella risposta indica quanti secondi attendere prima della prossima richiesta consentita.

## Panoramica Endpoint

### Autenticazione
| Metodo | Endpoint | Descrizione |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Accedi, ottieni JWT |
| POST | `/api/auth/logout` | Esci |
| GET | `/api/auth/me` | Ottieni utente corrente |

### Stampanti
| Metodo | Endpoint | Descrizione |
|--------|-----------|-------------|
| GET | `/api/printers` | Elenca tutte le stampanti |
| POST | `/api/printers` | Aggiungi stampante |
| GET | `/api/printers/:id` | Ottieni stampante |
| PUT | `/api/printers/:id` | Aggiorna stampante |
| DELETE | `/api/printers/:id` | Elimina stampante |
| GET | `/api/printers/:id/status` | Stato in tempo reale |
| POST | `/api/printers/:id/command` | Invia comando |

### Filamento
| Metodo | Endpoint | Descrizione |
|--------|-----------|-------------|
| GET | `/api/filaments` | Elenca tutte le bobine |
| POST | `/api/filaments` | Aggiungi bobina |
| PUT | `/api/filaments/:id` | Aggiorna bobina |
| DELETE | `/api/filaments/:id` | Elimina bobina |
| GET | `/api/filaments/stats` | Statistiche consumo |

### Cronologia Stampe
| Metodo | Endpoint | Descrizione |
|--------|-----------|-------------|
| GET | `/api/history` | Elenca cronologia (paginata) |
| GET | `/api/history/:id` | Ottieni singola stampa |
| GET | `/api/history/export` | Esporta CSV |
| GET | `/api/history/stats` | Statistiche |

### Coda di Stampa
| Metodo | Endpoint | Descrizione |
|--------|-----------|-------------|
| GET | `/api/queue` | Ottieni la coda |
| POST | `/api/queue` | Aggiungi lavoro |
| PUT | `/api/queue/:id` | Aggiorna lavoro |
| DELETE | `/api/queue/:id` | Rimuovi lavoro |
| POST | `/api/queue/dispatch` | Forza invio |

## API WebSocket

Oltre al REST esiste un'API WebSocket per i dati in tempo reale:

```javascript
const ws = new WebSocket('wss://tuo-server:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Tipi di Messaggi (in entrata)
- `printer.status` — stato stampante aggiornato
- `print.progress` — aggiornamento percentuale avanzamento
- `ams.update` — cambio stato AMS
- `notification` — messaggio di notifica

## Codici di Errore

| Codice | Significato |
|------|-------|
| 200 | OK |
| 201 | Creato |
| 400 | Richiesta non valida |
| 401 | Non autenticato |
| 403 | Non autorizzato |
| 404 | Non trovato |
| 429 | Troppe richieste |
| 500 | Errore server |
