---
sidebar_position: 4
title: API-speeltuin
description: Alle 177 API-eindpunten rechtstreeks in de browser testen met ingebouwde OpenAPI-documentatie en authenticatie
---

# API-speeltuin

De API-speeltuin stelt u in staat alle 177 API-eindpunten in Bambu Dashboard rechtstreeks in de browser te verkennen en te testen — zonder code te schrijven.

Ga naar: **https://localhost:3443/api/docs**

## Wat is de API-speeltuin?

De speeltuin is een interactieve versie van de OpenAPI-documentatie (Swagger UI) die volledig is geïntegreerd met het dashboard. U bent al geauthenticeerd wanneer u bent ingelogd, zodat u eindpunten direct kunt testen.

## Navigeren in de documentatie

De eindpunten zijn georganiseerd in categorieën:

| Categorie | Aantal eindpunten | Beschrijving |
|---|---|---|
| Printers | 24 | Status ophalen, bedienen, configureren |
| Prints / Geschiedenis | 18 | Geschiedenis ophalen, zoeken, exporteren |
| Filament | 22 | Opslag, spoelen, profielen |
| Wachtrij | 12 | Printwachtrij beheren |
| Statistieken | 15 | Geaggregeerde statistieken en export |
| Meldingen | 8 | Meldingskanalen configureren en testen |
| Gebruikers | 10 | Gebruikers, rollen, API-sleutels |
| Instellingen | 14 | Configuratie lezen en wijzigen |
| Onderhoud | 12 | Onderhoudstaken en logboek |
| Integraties | 18 | HA, Tibber, webhooks, enz. |
| Bestandsbibliotheek | 14 | Uploaden, analyseren, beheren |
| Systeem | 10 | Back-up, gezondheid, logboek |

Klik op een categorie om uit te vouwen en alle eindpunten te zien.

## Een eindpunt testen

1. Klik op een eindpunt (bijv. `GET /api/printers`)
2. Klik **Try it out** (probeer het)
3. Vul eventuele parameters in (filter, paginering, printer-ID, enz.)
4. Klik **Execute**
5. Bekijk het antwoord hieronder: HTTP-statuscode, headers en JSON-body

### Voorbeeld: Alle printers ophalen

```
GET /api/printers
```
Geeft een lijst van alle geregistreerde printers met realtime status terug.

### Voorbeeld: Opdracht sturen naar printer

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Productieomgeving
De API-speeltuin is verbonden met het werkelijke systeem. Opdrachten worden naar echte printers gestuurd. Wees voorzichtig met destructieve bewerkingen zoals `DELETE` en `POST /command`.
:::

## Authenticatie

### Sessie-authenticatie (ingelogde gebruiker)
Wanneer u bent ingelogd in het dashboard, is de speeltuin al geauthenticeerd via een sessiecookie. Geen extra configuratie nodig.

### API-sleutelauthenticatie

Voor externe toegang:

1. Klik **Authorize** (slotje-icoon bovenaan de speeltuin)
2. Vul uw API-sleutel in het veld **ApiKeyAuth** in: `Bearer UW_SLEUTEL`
3. Klik **Authorize**

Genereer API-sleutels via **Instellingen → API-sleutels** (zie [Authenticatie](../system/auth)).

## Rate limiting

De API heeft rate limiting van **200 verzoeken per minuut** per gebruiker/sleutel. De speeltuin toont het resterende aantal verzoeken in de antwoordheader `X-RateLimit-Remaining`.

:::info OpenAPI-specificatie
Download de volledige OpenAPI-specificatie als YAML of JSON:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Gebruik de specificatie om clientbibliotheken te genereren in Python, TypeScript, Go, enz.
:::

## Webhook-testen

Test webhook-integraties rechtstreeks:

1. Ga naar `POST /api/webhooks/test`
2. Kies het gebeurtenistype uit de keuzelijst
3. Het systeem stuurt een testgebeurtenis naar de geconfigureerde webhook-URL
4. Bekijk de aanvraag/het antwoord in de speeltuin
