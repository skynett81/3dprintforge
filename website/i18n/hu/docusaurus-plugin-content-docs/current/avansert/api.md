---
sidebar_position: 1
title: API-referencia
description: REST API 284+ végponttal, hitelesítéssel és sebességkorlátozással
---

# API-referencia

A Bambu Dashboard egy teljes értékű REST API-t tesz elérhetővé 284+ végponttal. Az API-dokumentáció közvetlenül a dashboardon érhető el.

## Interaktív dokumentáció

Nyisd meg az OpenAPI dokumentációt a böngészőben:

```
https://a-te-szervered:3443/api/docs
```

Itt megtalálod az összes végpontot, paramétert, kérés/válasz sémákat, és lehetőséged van az API közvetlen tesztelésére.

## Hitelesítés

Az API **Bearer token** hitelesítést (JWT) használ:

```bash
# Bejelentkezés és token lekérése
curl -X POST https://a-te-szervered:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "a-te-jelszavad"}'

# Válasz
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Használd a tokent az összes következő kérésben:

```bash
curl https://a-te-szervered:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Sebességkorlátozás

Az API sebességkorlátozással van ellátva a szerver védelme érdekében:

| Korlát | Érték |
|--------|-------|
| Kérések percenként | 200 |
| Burst (max. másodpercenként) | 20 |
| Válasz túllépéskor | `429 Too Many Requests` |

A `Retry-After` fejléc a válaszban megadja, hány másodperc múlva engedélyezett a következő kérés.

## Végpontok áttekintése

### Hitelesítés
| Metódus | Végpont | Leírás |
|---------|---------|--------|
| POST | `/api/auth/login` | Bejelentkezés, JWT lekérése |
| POST | `/api/auth/logout` | Kijelentkezés |
| GET | `/api/auth/me` | Bejelentkezett felhasználó lekérése |

### Nyomtatók
| Metódus | Végpont | Leírás |
|---------|---------|--------|
| GET | `/api/printers` | Összes nyomtató listázása |
| POST | `/api/printers` | Nyomtató hozzáadása |
| GET | `/api/printers/:id` | Nyomtató lekérése |
| PUT | `/api/printers/:id` | Nyomtató frissítése |
| DELETE | `/api/printers/:id` | Nyomtató törlése |
| GET | `/api/printers/:id/status` | Valós idejű állapot |
| POST | `/api/printers/:id/command` | Parancs küldése |

### Filament
| Metódus | Végpont | Leírás |
|---------|---------|--------|
| GET | `/api/filaments` | Összes orsó listázása |
| POST | `/api/filaments` | Orsó hozzáadása |
| PUT | `/api/filaments/:id` | Orsó frissítése |
| DELETE | `/api/filaments/:id` | Orsó törlése |
| GET | `/api/filaments/stats` | Felhasználási statisztika |

### Nyomtatási előzmények
| Metódus | Végpont | Leírás |
|---------|---------|--------|
| GET | `/api/history` | Előzmények listázása (lapozható) |
| GET | `/api/history/:id` | Egyedi nyomtatás lekérése |
| GET | `/api/history/export` | CSV exportálása |
| GET | `/api/history/stats` | Statisztika |

### Nyomtatási sor
| Metódus | Végpont | Leírás |
|---------|---------|--------|
| GET | `/api/queue` | Sor lekérése |
| POST | `/api/queue` | Feladat hozzáadása |
| PUT | `/api/queue/:id` | Feladat frissítése |
| DELETE | `/api/queue/:id` | Feladat eltávolítása |
| POST | `/api/queue/dispatch` | Kézzel indítás |

## WebSocket API

A REST mellett egy WebSocket API is elérhető valós idejű adatokhoz:

```javascript
const ws = new WebSocket('wss://a-te-szervered:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Üzenettípusok (bejövő)
- `printer.status` — frissített nyomtatóállapot
- `print.progress` — haladás százalékos frissítése
- `ams.update` — AMS állapotváltozás
- `notification` — értesítési üzenet

## Hibakódok

| Kód | Jelentés |
|-----|----------|
| 200 | OK |
| 201 | Létrehozva |
| 400 | Érvénytelen kérés |
| 401 | Nem hitelesített |
| 403 | Nem jogosult |
| 404 | Nem található |
| 429 | Túl sok kérés |
| 500 | Szerverhiba |
