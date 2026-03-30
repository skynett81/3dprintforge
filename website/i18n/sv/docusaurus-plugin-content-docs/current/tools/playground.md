---
sidebar_position: 4
title: API-lekplats
description: Testa alla 177 API-endpunkter direkt i webbläsaren med inbyggd OpenAPI-dokumentation och autentisering
---

# API-lekplats

API-lekplatsen låter dig utforska och testa alla 177 API-endpunkter i Bambu Dashboard direkt i webbläsaren — utan att skriva kod.

Gå till: **https://localhost:3443/api/docs**

## Vad är API-lekplatsen?

Lekplatsen är en interaktiv version av OpenAPI-dokumentationen (Swagger UI) som är fullständigt integrerad med dashboardet. Du är redan autentiserad när du är inloggad, så du kan testa endpunkter direkt.

## Navigera i dokumentationen

Endpunkterna är organiserade i kategorier:

| Kategori | Antal endpunkter | Beskrivning |
|---|---|---|
| Skrivare | 24 | Hämta status, styr, konfigurera |
| Utskrifter / Historik | 18 | Hämta, sök, exportera historik |
| Filament | 22 | Lager, spolar, profiler |
| Kö | 12 | Hantera utskriftskö |
| Statistik | 15 | Aggregerad statistik och export |
| Aviseringar | 8 | Konfigurera och testa aviseringskanaler |
| Användare | 10 | Användare, roller, API-nycklar |
| Inställningar | 14 | Läs och ändra konfiguration |
| Underhåll | 12 | Underhållsuppgifter och logg |
| Integrationer | 18 | HA, Tibber, webhooks, osv. |
| Filbibliotek | 14 | Ladda upp, analysera, hantera |
| System | 10 | Säkerhetskopiering, hälsa, logg |

Klicka på en kategori för att expandera och se alla endpunkter.

## Testa ett endpunkt

1. Klicka på ett endpunkt (t.ex. `GET /api/printers`)
2. Klicka **Try it out** (prova det)
3. Fyll i eventuella parametrar (filter, paginering, skrivare-ID, osv.)
4. Klicka **Execute**
5. Se svaret under: HTTP-statuskod, headers och JSON-body

### Exempel: Hämta alla skrivare

```
GET /api/printers
```
Returnerar en lista över alla registrerade skrivare med realtidsstatus.

### Exempel: Skicka kommando till skrivare

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Produktionsmiljö
API-lekplatsen är ansluten till det faktiska systemet. Kommandon skickas till riktiga skrivare. Var försiktig med destruktiva operationer som `DELETE` och `POST /command`.
:::

## Autentisering

### Session-autentisering (inloggad användare)
När du är inloggad i dashboardet är lekplatsen redan autentiserad via session-cookie. Ingen extra konfiguration behövs.

### API-nyckelautentisering

För extern åtkomst:

1. Klicka **Authorize** (låsikonen längst upp på lekplatsen)
2. Fyll i din API-nyckel i **ApiKeyAuth**-fältet: `Bearer DIN_NYCKEL`
3. Klicka **Authorize**

Generera API-nycklar under **Inställningar → API-nycklar** (se [Autentisering](../system/auth)).

## Rate limiting

API:et har rate limiting på **200 förfrågningar per minut** per användare/nyckel. Lekplatsen visar återstående förfrågningar i svarsheadern `X-RateLimit-Remaining`.

:::info OpenAPI-specifikation
Ladda ner hela OpenAPI-specifikationen som YAML eller JSON:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Använd specifikationen för att generera klientbibliotek i Python, TypeScript, Go, osv.
:::

## Webhook-testning

Testa webhook-integrationer direkt:

1. Gå till `POST /api/webhooks/test`
2. Välj event-typ från rullgardinsmenyn
3. Systemet skickar en testhändelse till konfigurerad webhook-URL
4. Se request/response på lekplatsen
