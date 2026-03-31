---
sidebar_position: 1
title: Reference API
description: REST API s 284+ koncovými body, autentizací a omezením počtu požadavků
---

# Reference API

3DPrintForge zpřístupňuje plnohodnotné REST API s 284+ koncovými body. Dokumentace API je dostupná přímo v dashboardu.

## Interaktivní dokumentace

Otevřete dokumentaci OpenAPI v prohlížeči:

```
https://vas-server:3443/api/docs
```

Zde najdete všechny koncové body, parametry, schémata požadavků/odpovědí a možnost přímého testování API.

## Autentizace

API používá autentizaci **Bearer token** (JWT):

```bash
# Přihlášení a získání tokenu
curl -X POST https://vas-server:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "vase-heslo"}'

# Odpověď
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Použijte token ve všech následujících voláních:

```bash
curl https://vas-server:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Omezení počtu požadavků

API je omezeno na ochranu serveru:

| Limit | Hodnota |
|--------|-------|
| Požadavků za minutu | 200 |
| Burst (max. za sekundu) | 20 |
| Odpověď při překročení | `429 Too Many Requests` |

Záhlaví `Retry-After` v odpovědi udává, kolik sekund do dalšího povoleného požadavku.

## Přehled koncových bodů

### Autentizace
| Metoda | Koncový bod | Popis |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Přihlásit se, získat JWT |
| POST | `/api/auth/logout` | Odhlásit se |
| GET | `/api/auth/me` | Získat přihlášeného uživatele |

### Tiskárny
| Metoda | Koncový bod | Popis |
|--------|-----------|-------------|
| GET | `/api/printers` | Vypsat všechny tiskárny |
| POST | `/api/printers` | Přidat tiskárnu |
| GET | `/api/printers/:id` | Získat tiskárnu |
| PUT | `/api/printers/:id` | Aktualizovat tiskárnu |
| DELETE | `/api/printers/:id` | Smazat tiskárnu |
| GET | `/api/printers/:id/status` | Stav v reálném čase |
| POST | `/api/printers/:id/command` | Odeslat příkaz |

### Filament
| Metoda | Koncový bod | Popis |
|--------|-----------|-------------|
| GET | `/api/filaments` | Vypsat všechny cívky |
| POST | `/api/filaments` | Přidat cívku |
| PUT | `/api/filaments/:id` | Aktualizovat cívku |
| DELETE | `/api/filaments/:id` | Smazat cívku |
| GET | `/api/filaments/stats` | Statistiky spotřeby |

### Historie tisků
| Metoda | Koncový bod | Popis |
|--------|-----------|-------------|
| GET | `/api/history` | Výpis historie (stránkovaný) |
| GET | `/api/history/:id` | Získat jednotlivý tisk |
| GET | `/api/history/export` | Exportovat CSV |
| GET | `/api/history/stats` | Statistiky |

### Fronta tisků
| Metoda | Koncový bod | Popis |
|--------|-----------|-------------|
| GET | `/api/queue` | Získat frontu |
| POST | `/api/queue` | Přidat úlohu |
| PUT | `/api/queue/:id` | Aktualizovat úlohu |
| DELETE | `/api/queue/:id` | Odebrat úlohu |
| POST | `/api/queue/dispatch` | Vynutit odeslání |

## WebSocket API

Kromě REST existuje WebSocket API pro data v reálném čase:

```javascript
const ws = new WebSocket('wss://vas-server:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Typy zpráv (příchozí)
- `printer.status` — aktualizovaný stav tiskárny
- `print.progress` — aktualizace průběhu tisku
- `ams.update` — změna stavu AMS
- `notification` — oznámení

## Kódy chyb

| Kód | Význam |
|------|-------|
| 200 | OK |
| 201 | Vytvořeno |
| 400 | Neplatný požadavek |
| 401 | Neautentizováno |
| 403 | Neautorizováno |
| 404 | Nenalezeno |
| 429 | Příliš mnoho požadavků |
| 500 | Chyba serveru |
