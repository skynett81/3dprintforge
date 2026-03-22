---
sidebar_position: 7
title: Configurare le notifiche
description: Configura Telegram, Discord, e-mail e notifiche push nel browser in Bambu Dashboard
---

# Configurare le notifiche

Bambu Dashboard può avvisarti di tutto, dal completamento delle stampe agli errori critici — tramite Telegram, Discord, e-mail o notifiche push del browser.

## Panoramica dei canali di notifica

| Canale | Ideale per | Requisiti |
|--------|-----------|-----------|
| Telegram | Rapido, ovunque | Account Telegram + token bot |
| Discord | Team/community | Server Discord + URL webhook |
| E-mail (SMTP) | Notifica ufficiale | Server SMTP |
| Browser push | Notifiche desktop | Browser con supporto push |

---

## Bot Telegram

### Passo 1 — Crea il bot

1. Apri Telegram e cerca **@BotFather**
2. Invia `/newbot`
3. Dai un nome al bot (ad es. "Bambu Avvisi")
4. Dai un username al bot (ad es. `bambu_avvisi_bot`) — deve terminare con `bot`
5. BotFather risponde con un **token API**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Copia e salva questo token

### Passo 2 — Trova il tuo Chat ID

1. Avvia una conversazione con il tuo bot (cerca il nome utente e clicca **Avvia**)
2. Invia un messaggio al bot (ad es. "ciao")
3. Vai su `https://api.telegram.org/bot<TUO_TOKEN>/getUpdates` nel browser
4. Trova `"chat":{"id": 123456789}` — è il tuo Chat ID

### Passo 3 — Connetti al dashboard

1. Vai su **Impostazioni → Notifiche → Telegram**
2. Incolla il **Token Bot**
3. Incolla il **Chat ID**
4. Clicca **Test notifica** — dovresti ricevere un messaggio di test in Telegram
5. Clicca **Salva**

:::tip Notifica di gruppo
Vuoi avvisare un intero gruppo? Aggiungi il bot a un gruppo Telegram, trova il Chat ID del gruppo (numero negativo, ad es. `-100123456789`) e usalo invece.
:::

---

## Webhook Discord

### Passo 1 — Crea il webhook in Discord

1. Vai al tuo server Discord
2. Fai clic destro sul canale in cui vuoi ricevere le notifiche → **Modifica canale**
3. Vai su **Integrazioni → Webhook**
4. Clicca **Nuovo Webhook**
5. Dagli un nome (ad es. "Bambu Dashboard")
6. Scegli un avatar (facoltativo)
7. Clicca **Copia URL Webhook**

L'URL ha questo aspetto:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Passo 2 — Inserisci nel dashboard

1. Vai su **Impostazioni → Notifiche → Discord**
2. Incolla l'**URL Webhook**
3. Clicca **Test notifica** — il canale Discord dovrebbe ricevere un messaggio di test
4. Clicca **Salva**

---

## E-mail (SMTP)

### Informazioni necessarie

Hai bisogno delle impostazioni SMTP del tuo provider e-mail:

| Provider | Server SMTP | Porta | Crittografia |
|---------|-------------|-------|--------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Dominio proprio | smtp.tuodominio.it | 587 | TLS |

:::warning Gmail richiede password app
Gmail blocca l'accesso con la password normale. Devi creare una **Password app** in Account Google → Sicurezza → Verifica in 2 passaggi → Password app.
:::

### Configurazione nel dashboard

1. Vai su **Impostazioni → Notifiche → E-mail**
2. Compila:
   - **Server SMTP**: ad es. `smtp.gmail.com`
   - **Porta**: `587`
   - **Nome utente**: il tuo indirizzo e-mail
   - **Password**: password app o password normale
   - **Indirizzo mittente**: l'e-mail da cui viene inviata la notifica
   - **Indirizzo destinatario**: l'e-mail su cui vuoi ricevere le notifiche
3. Clicca **Test e-mail**
4. Clicca **Salva**

---

## Notifiche push del browser

Le notifiche push appaiono come notifiche di sistema sul desktop — anche quando la scheda del browser è in background.

**Attivazione:**
1. Vai su **Impostazioni → Notifiche → Notifiche push**
2. Clicca **Attiva notifiche push**
3. Il browser chiede il permesso — clicca **Consenti**
4. Clicca **Test notifica**

:::info Solo nel browser in cui hai attivato
Le notifiche push sono collegate allo specifico browser e dispositivo. Attivale su ogni dispositivo da cui vuoi ricevere notifiche.
:::

---

## Scegliere gli eventi per cui ricevere notifiche

Dopo aver configurato un canale di notifica, puoi scegliere esattamente quali eventi attivano le notifiche:

**Sotto Impostazioni → Notifiche → Eventi:**

| Evento | Consigliato |
|--------|-------------|
| Stampa completata | Sì |
| Stampa fallita / annullata | Sì |
| Print Guard: spaghetti rilevato | Sì |
| Errore HMS (critico) | Sì |
| Avviso HMS | Facoltativo |
| Filamento esaurito | Sì |
| Errore AMS | Sì |
| Stampante disconnessa | Facoltativo |
| Promemoria manutenzione | Facoltativo |
| Backup notturno completato | No (rumoroso) |

---

## Ore silenziose (non ricevere notifiche di notte)

Evita di essere svegliato da una stampa completata alle 03:00:

1. Vai su **Impostazioni → Notifiche → Ore silenziose**
2. Attiva **Ore silenziose**
3. Imposta ora di inizio e fine (ad es. **22:00 alle 07:00**)
4. Scegli quali eventi devono comunque notificare durante il periodo silenzioso:
   - **Errori HMS critici** — si consiglia di tenerli attivi
   - **Print Guard** — si consiglia di tenerlo attivo
   - **Stampa completata** — può essere disattivato di notte

:::tip Stampa notturna senza disturbi
Esegui stampe di notte con le ore silenziose attivate. Print Guard tiene d'occhio tutto — e ricevi un riepilogo al mattino.
:::
