---
sidebar_position: 1
title: API-Referenz
description: REST API mit 284+ Endpunkten, Authentifizierung und Rate Limiting
---

# API-Referenz

Bambu Dashboard stellt ein vollständiges REST API mit 284+ Endpunkten bereit. Die API-Dokumentation ist direkt im Dashboard verfügbar.

## Interaktive Dokumentation

Die OpenAPI-Dokumentation im Browser öffnen:

```
https://ihr-server:3443/api/docs
```

Hier finden Sie alle Endpunkte, Parameter, Request/Response-Schemata und die Möglichkeit, das API direkt zu testen.

## Authentifizierung

Das API verwendet **Bearer-Token**-Authentifizierung (JWT):

```bash
# Anmelden und Token abrufen
curl -X POST https://ihr-server:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "ihr-passwort"}'

# Antwort
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Token bei allen nachfolgenden Aufrufen verwenden:

```bash
curl https://ihr-server:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate Limiting

Das API ist ratenbegrenzt, um den Server zu schützen:

| Grenzwert | Wert |
|--------|-------|
| Anfragen pro Minute | 200 |
| Burst (max pro Sekunde) | 20 |
| Antwort bei Überschreitung | `429 Too Many Requests` |

Der `Retry-After`-Header in der Antwort gibt an, wie viele Sekunden bis zur nächsten erlaubten Anfrage verbleiben.

## Endpunkte-Übersicht

### Authentifizierung
| Methode | Endpunkt | Beschreibung |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Anmelden, JWT abrufen |
| POST | `/api/auth/logout` | Abmelden |
| GET | `/api/auth/me` | Angemeldeten Benutzer abrufen |

### Drucker
| Methode | Endpunkt | Beschreibung |
|--------|-----------|-------------|
| GET | `/api/printers` | Alle Drucker auflisten |
| POST | `/api/printers` | Drucker hinzufügen |
| GET | `/api/printers/:id` | Drucker abrufen |
| PUT | `/api/printers/:id` | Drucker aktualisieren |
| DELETE | `/api/printers/:id` | Drucker löschen |
| GET | `/api/printers/:id/status` | Echtzeitstatus |
| POST | `/api/printers/:id/command` | Befehl senden |

### Filament
| Methode | Endpunkt | Beschreibung |
|--------|-----------|-------------|
| GET | `/api/filaments` | Alle Spulen auflisten |
| POST | `/api/filaments` | Spule hinzufügen |
| PUT | `/api/filaments/:id` | Spule aktualisieren |
| DELETE | `/api/filaments/:id` | Spule löschen |
| GET | `/api/filaments/stats` | Verbrauchsstatistiken |

### Druckverlauf
| Methode | Endpunkt | Beschreibung |
|--------|-----------|-------------|
| GET | `/api/history` | Verlauf auflisten (paginiert) |
| GET | `/api/history/:id` | Einzelnen Druck abrufen |
| GET | `/api/history/export` | Als CSV exportieren |
| GET | `/api/history/stats` | Statistiken |

### Druckwarteschlange
| Methode | Endpunkt | Beschreibung |
|--------|-----------|-------------|
| GET | `/api/queue` | Warteschlange abrufen |
| POST | `/api/queue` | Auftrag hinzufügen |
| PUT | `/api/queue/:id` | Auftrag aktualisieren |
| DELETE | `/api/queue/:id` | Auftrag entfernen |
| POST | `/api/queue/dispatch` | Versand erzwingen |

## WebSocket API

Zusätzlich zu REST gibt es ein WebSocket API für Echtzeitdaten:

```javascript
const ws = new WebSocket('wss://ihr-server:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Nachrichtentypen (eingehend)
- `printer.status` — aktualisierter Druckerstatus
- `print.progress` — Fortschrittsprozent-Aktualisierung
- `ams.update` — AMS-Zustandsänderung
- `notification` — Benachrichtigungsnachricht

## Fehlercodes

| Code | Bedeutung |
|------|-------|
| 200 | OK |
| 201 | Erstellt |
| 400 | Ungültige Anfrage |
| 401 | Nicht authentifiziert |
| 403 | Nicht autorisiert |
| 404 | Nicht gefunden |
| 429 | Zu viele Anfragen |
| 500 | Serverfehler |
