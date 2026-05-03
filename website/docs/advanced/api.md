---
sidebar_position: 1
title: API-referanse
description: REST API med 590+ endepunkter, autentisering og rate limiting
---

# API-referanse

3DPrintForge eksponerer et fullverdig REST API med 590+ endepunkter. API-dokumentasjonen er tilgjengelig direkte i dashboardet.

## Interaktiv dokumentasjon

Åpne OpenAPI-dokumentasjonen i nettleseren:

```
https://din-server:3443/api/docs
```

Her finner du alle endepunkter, parametere, request/response-skjemaer og mulighet for å teste API-et direkte.

## Autentisering

API-et bruker **Bearer token**-autentisering (JWT):

```bash
# Logg inn og hent token
curl -X POST https://din-server:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "ditt-passord"}'

# Respons
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Bruk tokenet i alle påfølgende kall:

```bash
curl https://din-server:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate limiting

API-et er rate-begrenset for å beskytte serveren:

| Grense | Verdi |
|--------|-------|
| Forespørsler per minutt | 200 |
| Burst (maks per sekund) | 20 |
| Respons ved overskridelse | `429 Too Many Requests` |

`Retry-After`-header i svaret angir hvor mange sekunder til neste forespørsel er tillatt.

## Endepunkter oversikt

### Autentisering
| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Logg inn, hent JWT |
| POST | `/api/auth/logout` | Logg ut |
| GET | `/api/auth/me` | Hent innlogget bruker |

### Printere
| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/printers` | Liste alle printere |
| POST | `/api/printers` | Legg til printer |
| GET | `/api/printers/:id` | Hent printer |
| PUT | `/api/printers/:id` | Oppdater printer |
| DELETE | `/api/printers/:id` | Slett printer |
| GET | `/api/printers/:id/status` | Sanntidsstatus |
| POST | `/api/printers/:id/command` | Send kommando |

### Filament
| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/filaments` | Liste alle spoler |
| POST | `/api/filaments` | Legg til spole |
| PUT | `/api/filaments/:id` | Oppdater spole |
| DELETE | `/api/filaments/:id` | Slett spole |
| GET | `/api/filaments/stats` | Forbruksstatistikk |
| GET | `/api/inventory/cost-estimate` | Kostnadsestimat for enkelt-print |
| POST | `/api/inventory/cost-estimate/batch` | Batch-kostnadsestimat (array av items) |

### Printhistorikk
| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/history` | Liste historikk (paginert) |
| GET | `/api/history/:id` | Hent enkeltprint |
| GET | `/api/history/export` | Eksporter CSV |
| GET | `/api/history/stats` | Statistikk |

### Print-kø
| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/queue` | Hent køen |
| POST | `/api/queue` | Legg til jobb |
| PUT | `/api/queue/:id` | Oppdater jobb |
| DELETE | `/api/queue/:id` | Fjern jobb |
| POST | `/api/queue/dispatch` | Tving utsendelse |

### 3DPrintForge Slicer
Proxy-endepunkter mot skynett81/OrcaSlicer-fork i tjenestemodus. Se [3DPrintForge Slicer-oppsett](../forge-slicer-setup.md) og den fulle [REST-kontrakten](../FORGE_SLICER_API.md).

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/slicer/forge/status` | Probe-status (cachet 60 s) |
| POST | `/api/slicer/forge/configure` | Oppdater URL/token/enabled (lagres i config.json) |
| GET | `/api/slicer/forge/profiles` | Profilkatalog fra fork |
| POST | `/api/slicer/forge/slice` | Slicing (multipart upload) |
| POST | `/api/slicer/forge/slice/stream` | Slicing med SSE live-progresjon |
| POST | `/api/slicer/forge/slice-and-send` | Slicing + opplasting til printer i ett kall |
| GET | `/api/slicer/forge/jobs` | Aktive slice-jobber |
| GET | `/api/slicer/forge/jobs/:id/gcode` | Last ned ferdig G-code |
| POST | `/api/slicer/forge/jobs/:id/cancel` | Avbryt pågående slice |
| GET | `/api/slicer/forge/preview` | PNG/SVG-forhåndsvisning av første lag |
| POST | `/api/slicer/forge/sync` | Tving synkronisering av profilkatalog |
| GET | `/api/slicer/forge/sync/status` | Siste synkroniseringsstatus |

## WebSocket API

I tillegg til REST finnes et WebSocket API for sanntidsdata:

```javascript
const ws = new WebSocket('wss://din-server:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Meldingstyper (innkommende)
- `printer.status` — oppdatert printerstatus
- `print.progress` — fremgangsprosent oppdatering
- `ams.update` — AMS-tilstandsendring
- `notification` — varselmelding

## Feilkoder

| Kode | Betyr |
|------|-------|
| 200 | OK |
| 201 | Opprettet |
| 400 | Ugyldig forespørsel |
| 401 | Ikke autentisert |
| 403 | Ikke autorisert |
| 404 | Ikke funnet |
| 429 | For mange forespørsler |
| 500 | Serverfeil |
