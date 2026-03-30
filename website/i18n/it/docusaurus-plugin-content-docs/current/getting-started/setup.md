---
sidebar_position: 2
title: Configurazione iniziale
description: Collega la tua stampante Bambu Lab e configura il dashboard
---

# Configurazione iniziale

Al primo avvio del dashboard, la procedura guidata di configurazione si apre automaticamente.

## Procedura guidata

La procedura guidata è disponibile su `https://tuo-server:3443/setup` e ti guida attraverso:

1. Crea l'utente amministratore
2. Aggiungi una stampante
3. Testa la connessione
4. Configura le notifiche (opzionale)

## Aggiungere una stampante

Per connettere la stampante hai bisogno di tre informazioni:

| Campo | Descrizione | Esempio |
|------|-------------|---------|
| Indirizzo IP | IP locale della stampante | `192.168.1.100` |
| Numero di serie | 15 caratteri, si trova sotto la stampante | `01P09C123456789` |
| Access Code | 8 caratteri, si trova nelle impostazioni di rete della stampante | `12345678` |

### Trovare l'Access Code sulla stampante

**X1C / P1S / P1P:**
1. Vai a **Impostazioni** sullo schermo
2. Seleziona **WLAN** o **LAN**
3. Cerca **Access Code**

**A1 / A1 Mini:**
1. Tocca lo schermo e seleziona **Impostazioni**
2. Vai a **WLAN**
3. Cerca **Access Code**

:::tip Indirizzo IP fisso
Imposta un indirizzo IP fisso per la stampante nel router (prenotazione DHCP). In questo modo non dovrai aggiornare il dashboard ogni volta che la stampante ottiene un nuovo IP.
:::

## Configurazione AMS

Dopo aver connesso la stampante, lo stato dell'AMS si aggiorna automaticamente. Puoi:

- Assegnare un nome e un colore a ogni slot
- Collegare le bobine al magazzino filamento
- Vedere il consumo di filamento per bobina

Vai a **Impostazioni → Stampante → AMS** per la configurazione manuale.

## Certificati HTTPS {#https-sertifikater}

### Certificato auto-generato (predefinito)

Il dashboard genera automaticamente un certificato auto-firmato all'avvio. Per accettarlo nel browser:

- **Chrome/Edge:** Clicca «Avanzate» → «Continua su questo sito»
- **Firefox:** Clicca «Avanzate» → «Accetta il rischio e continua»

### Certificato personalizzato

Copia i file del certificato nella cartella e configurali in `config.json`:

```json
{
  "ssl": {
    "cert": "/percorso/al/cert.pem",
    "key": "/percorso/alla/key.pem"
  }
}
```

:::info Let's Encrypt
Hai un nome di dominio? Genera un certificato gratuito con Let's Encrypt e Certbot, e punta `cert` e `key` ai file in `/etc/letsencrypt/live/tuo-dominio/`.
:::

## Variabili d'ambiente

Tutte le impostazioni possono essere sovrascritte con variabili d'ambiente:

| Variabile | Valore predefinito | Descrizione |
|----------|---------|-------------|
| `PORT` | `3000` | Porta HTTP |
| `HTTPS_PORT` | `3443` | Porta HTTPS |
| `NODE_ENV` | `production` | Ambiente |
| `AUTH_SECRET` | (auto) | Segreto JWT |

## Configurazione multi-stampante

Puoi aggiungere più stampanti in **Impostazioni → Stampanti → Aggiungi stampante**. Usa il selettore stampante in cima al dashboard per passare da una all'altra.
