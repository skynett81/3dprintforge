---
sidebar_position: 6
title: Notifiche
description: Configura notifiche tramite Telegram, Discord, email, webhook, ntfy, Pushover e SMS per tutti gli eventi della stampante
---

# Notifiche

3DPrintForge supporta le notifiche attraverso numerosi canali in modo che tu sappia sempre cosa sta succedendo con le tue stampanti — che tu sia a casa o in giro.

Vai a: **https://localhost:3443/#settings** → scheda **Notifiche**

## Canali Disponibili

| Canale | Richiede | Supporta immagini |
|---|---|---|
| Telegram | Token bot + Chat-ID | ✅ |
| Discord | URL Webhook | ✅ |
| Email | Server SMTP | ✅ |
| Webhook | URL + chiave opzionale | ✅ (base64) |
| ntfy | Server ntfy + topic | ❌ |
| Pushover | Token API + User-key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Push browser | Nessuna configurazione necessaria | ❌ |

## Configurazione per Canale

### Telegram

1. Crea un bot tramite [@BotFather](https://t.me/BotFather) — invia `/newbot`
2. Copia il **token bot** (formato: `123456789:ABC-def...`)
3. Avvia una conversazione con il bot e invia `/start`
4. Trova il tuo **Chat-ID**: vai a `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. In 3DPrintForge: incolla il token e il Chat-ID, clicca su **Test**

:::tip Canale di gruppo
Puoi usare un gruppo Telegram come destinatario. Il Chat-ID per i gruppi inizia con `-`.
:::

### Discord

1. Apri il server Discord a cui vuoi inviare notifiche
2. Vai alle impostazioni del canale → **Integrazioni → Webhook**
3. Clicca su **Nuovo webhook**, assegnagli un nome e seleziona il canale
4. Copia l'URL del webhook
5. Incolla l'URL in 3DPrintForge e clicca su **Test**

### Email

1. Inserisci il server SMTP, la porta (di solito 587 per TLS)
2. Nome utente e password per l'account SMTP
3. Indirizzo **Da** e indirizzo/i **A** (separati da virgola per più destinatari)
4. Attiva **TLS/STARTTLS** per l'invio sicuro
5. Clicca su **Test** per inviare un'email di prova

:::warning Gmail
Usa una **Password app** per Gmail, non la password normale. Prima attiva l'autenticazione a 2 fattori nel tuo account Google.
:::

### ntfy

1. Crea un topic su [ntfy.sh](https://ntfy.sh) oppure esegui il tuo server ntfy
2. Inserisci l'URL del server (ad es. `https://ntfy.sh`) e il nome del topic
3. Installa l'app ntfy sul telefono e iscriviti allo stesso topic
4. Clicca su **Test**

### Pushover

1. Crea un account su [pushover.net](https://pushover.net)
2. Crea una nuova applicazione — copia il **Token API**
3. Trova la tua **User Key** nel dashboard di Pushover
4. Inserisci entrambi in 3DPrintForge e clicca su **Test**

### Webhook (personalizzato)

3DPrintForge invia una HTTP POST con payload JSON:

```json
{
  "event": "print_complete",
  "printer": "La mia X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Aggiungi una **Chiave segreta** per validare le richieste con firma HMAC-SHA256 nell'header `X-Bambu-Signature`.

## Filtro Eventi

Seleziona quali eventi devono attivare le notifiche per canale:

| Evento | Descrizione |
|---|---|
| Stampa avviata | Nuova stampa inizia |
| Stampa completata | Stampa finita (con immagine) |
| Stampa fallita | Stampa interrotta con errore |
| Stampa in pausa | Pausa manuale o automatica |
| Avviso Print Guard | XCam o sensore ha attivato un'azione |
| Filamento esaurito | Bobina quasi vuota |
| Errore AMS | Blocco, filamento umido, ecc. |
| Stampante disconnessa | Connessione MQTT persa |
| Lavoro coda inviato | Lavoro inviato dalla coda |

Spunta gli eventi che desideri per ciascun canale individualmente.

## Ore Silenziose

Evita notifiche di notte:

1. Attiva **Ore silenziose** nelle impostazioni notifiche
2. Imposta l'orario **Da** e **A** (ad es. 23:00 → 07:00)
3. Seleziona il **Fuso orario** per il timer
4. Le notifiche critiche (errori Print Guard) possono essere ignorate — spunta **Invia sempre le critiche**

## Notifiche Push Browser

Ricevi notifiche direttamente nel browser senza app:

1. Vai a **Impostazioni → Notifiche → Push Browser**
2. Clicca su **Attiva notifiche push**
3. Accetta la finestra di dialogo dei permessi del browser
4. Le notifiche funzionano anche con il dashboard ridotto a icona (richiede la scheda aperta)

:::info PWA
Installa 3DPrintForge come PWA per notifiche push in background senza scheda aperta. Vedi [PWA](../system/pwa).
:::
