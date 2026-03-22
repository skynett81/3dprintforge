---
sidebar_position: 1
title: Autenticazione
description: Gestisci utenti, ruoli, permessi, chiavi API e autenticazione a due fattori con TOTP
---

# Autenticazione

Bambu Dashboard supporta più utenti con controllo degli accessi basato sui ruoli, chiavi API e autenticazione a due fattori opzionale (2FA) tramite TOTP.

Vai a: **https://localhost:3443/#settings** → **Utenti e accesso**

## Utenti

### Creare un utente

1. Vai a **Impostazioni → Utenti**
2. Clicca **Nuovo utente**
3. Compila:
   - **Nome utente** — utilizzato per l'accesso
   - **Indirizzo email**
   - **Password** — minimo 12 caratteri consigliato
   - **Ruolo** — vedi i ruoli di seguito
4. Clicca **Crea**

Il nuovo utente può ora accedere su **https://localhost:3443/login**.

### Cambiare password

1. Vai a **Profilo** (angolo in alto a destra → clicca sul nome utente)
2. Clicca **Cambia password**
3. Inserisci la password attuale e la nuova password
4. Clicca **Salva**

Gli amministratori possono reimpostare la password di altri da **Impostazioni → Utenti → [Utente] → Reimposta password**.

## Ruoli

| Ruolo | Descrizione |
|---|---|
| **Amministratore** | Accesso completo — tutte le impostazioni, utenti e funzionalità |
| **Operatore** | Controlla le stampanti, vede tutto, ma non può modificare le impostazioni di sistema |
| **Ospite** | Solo lettura — vedi dashboard, cronologia e statistiche |
| **Utente API** | Solo accesso API — nessuna interfaccia web |

### Ruoli personalizzati

1. Vai a **Impostazioni → Ruoli**
2. Clicca **Nuovo ruolo**
3. Seleziona i permessi singolarmente:
   - Visualizza dashboard / cronologia / statistiche
   - Controlla stampanti (pausa/arresta/avvia)
   - Gestisci magazzino filamento
   - Gestisci coda
   - Visualizza feed camera
   - Modifica impostazioni
   - Gestisci utenti
4. Clicca **Salva**

## Chiavi API

Le chiavi API forniscono accesso programmatico senza effettuare il login.

### Creare una chiave API

1. Vai a **Impostazioni → Chiavi API**
2. Clicca **Nuova chiave**
3. Compila:
   - **Nome** — nome descrittivo (es. «Home Assistant», «Script Python»)
   - **Data di scadenza** — opzionale, imposta per sicurezza
   - **Permessi** — seleziona ruolo o permessi specifici
4. Clicca **Genera**
5. **Copia la chiave ora** — viene mostrata una sola volta

### Usare la chiave API

Aggiungi nell'intestazione HTTP per tutte le chiamate API:
```
Authorization: Bearer LA_TUA_CHIAVE_API
```

Vedi [API Playground](../verktoy/playground) per i test.

:::danger Conservazione sicura
Le chiavi API hanno lo stesso accesso dell'utente a cui sono associate. Conservale in modo sicuro e ruotale regolarmente.
:::

## TOTP 2FA

Abilita l'autenticazione a due fattori con un'app di autenticazione (Google Authenticator, Authy, Bitwarden, ecc.):

### Attivare il 2FA

1. Vai a **Profilo → Sicurezza → Autenticazione a due fattori**
2. Clicca **Abilita 2FA**
3. Scansiona il codice QR con l'app di autenticazione
4. Inserisci il codice a 6 cifre generato per confermare
5. Salva i **codici di recupero** (10 codici monouso) in un posto sicuro
6. Clicca **Attiva**

### Accedere con 2FA

1. Inserisci nome utente e password come al solito
2. Inserisci il codice TOTP a 6 cifre dall'app
3. Clicca **Accedi**

### Richiedere il 2FA per tutti gli utenti

Gli amministratori possono richiedere il 2FA per tutti gli utenti:

1. Vai a **Impostazioni → Sicurezza → Forza 2FA**
2. Attiva l'impostazione
3. Gli utenti senza 2FA saranno costretti a configurarlo al prossimo accesso

## Gestione sessioni

- Durata sessione predefinita: 24 ore
- Modifica in **Impostazioni → Sicurezza → Durata sessione**
- Visualizza le sessioni attive per utente e termina le singole sessioni
