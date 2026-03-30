---
sidebar_position: 4
title: API Playground
description: Testa tutti i 177 endpoint API direttamente nel browser con documentazione OpenAPI integrata e autenticazione
---

# API Playground

L'API Playground ti consente di esplorare e testare tutti i 177 endpoint API di Bambu Dashboard direttamente nel browser — senza scrivere codice.

Vai a: **https://localhost:3443/api/docs**

## Cos'è l'API Playground?

Il playground è una versione interattiva della documentazione OpenAPI (Swagger UI) completamente integrata con il dashboard. Sei già autenticato quando sei connesso, quindi puoi testare gli endpoint direttamente.

## Navigare nella documentazione

Gli endpoint sono organizzati in categorie:

| Categoria | N. endpoint | Descrizione |
|---|---|---|
| Stampanti | 24 | Recupera stato, controlla, configura |
| Stampe / Cronologia | 18 | Recupera, cerca, esporta cronologia |
| Filamento | 22 | Magazzino, bobine, profili |
| Coda | 12 | Gestisci la coda di stampa |
| Statistiche | 15 | Statistiche aggregate ed esportazione |
| Notifiche | 8 | Configura e testa i canali |
| Utenti | 10 | Utenti, ruoli, chiavi API |
| Impostazioni | 14 | Leggi e modifica la configurazione |
| Manutenzione | 12 | Attività di manutenzione e registro |
| Integrazioni | 18 | HA, Tibber, webhook, ecc. |
| Libreria file | 14 | Carica, analizza, gestisci |
| Sistema | 10 | Backup, salute, log |

Clicca su una categoria per espanderla e vedere tutti gli endpoint.

## Testare un endpoint

1. Clicca su un endpoint (es. `GET /api/printers`)
2. Clicca **Try it out** (prova)
3. Compila eventuali parametri (filtro, paginazione, ID stampante, ecc.)
4. Clicca **Execute**
5. Vedi la risposta di seguito: codice di stato HTTP, header e corpo JSON

### Esempio: Recupera tutte le stampanti

```
GET /api/printers
```
Restituisce un elenco di tutte le stampanti registrate con lo stato in tempo reale.

### Esempio: Invia un comando alla stampante

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Ambiente di produzione
L'API Playground è connessa al sistema reale. I comandi vengono inviati alle stampanti vere. Fai attenzione con le operazioni distruttive come `DELETE` e `POST /command`.
:::

## Autenticazione

### Autenticazione sessione (utente connesso)
Quando sei connesso al dashboard, il playground è già autenticato tramite cookie di sessione. Nessuna configurazione aggiuntiva necessaria.

### Autenticazione con chiave API

Per accesso esterno:

1. Clicca **Authorize** (icona lucchetto in cima al playground)
2. Inserisci la tua chiave API nel campo **ApiKeyAuth**: `Bearer LA_TUA_CHIAVE`
3. Clicca **Authorize**

Genera le chiavi API in **Impostazioni → Chiavi API** (vedi [Autenticazione](../system/auth)).

## Rate limiting

L'API ha un rate limiting di **200 richieste al minuto** per utente/chiave. Il playground mostra le richieste rimanenti nell'intestazione di risposta `X-RateLimit-Remaining`.

:::info Specifica OpenAPI
Scarica l'intera specifica OpenAPI come YAML o JSON:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Usa la specifica per generare librerie client in Python, TypeScript, Go, ecc.
:::

## Test webhook

Testa le integrazioni webhook direttamente:

1. Vai a `POST /api/webhooks/test`
2. Seleziona il tipo di evento dall'elenco a discesa
3. Il sistema invia un evento di prova all'URL webhook configurato
4. Vedi la richiesta/risposta nel playground
