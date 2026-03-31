---
sidebar_position: 4
title: Sistema Plugin
description: Crea e installa plugin per estendere 3DPrintForge
---

# Sistema Plugin

3DPrintForge supporta un sistema di plugin che ti permette di estendere la funzionalità senza modificare il codice sorgente.

:::info Sperimentale
Il sistema di plugin è in sviluppo attivo. L'API potrebbe cambiare tra le versioni.
:::

## Cosa Possono Fare i Plugin?

- Aggiungere nuovi endpoint API
- Ascoltare gli eventi della stampante e reagire ad essi
- Aggiungere nuovi pannelli frontend
- Integrarsi con servizi di terze parti
- Estendere i canali di notifica

## Struttura Plugin

Un plugin è un modulo Node.js nella cartella `plugins/`:

```
plugins/
└── mio-plugin/
    ├── plugin.json    # Metadati
    ├── index.js       # Punto di ingresso
    └── README.md      # Documentazione (opzionale)
```

### plugin.json

```json
{
  "name": "mio-plugin",
  "version": "1.0.0",
  "description": "Descrizione del plugin",
  "author": "Il tuo nome",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Chiamato quando il plugin viene caricato
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Il mio plugin è stato caricato');

    // Registra una nuova rotta API
    api.get('/plugins/mio-plugin/status', (req, res) => {
      res.json({ status: 'attivo' });
    });
  },

  // Chiamato quando una stampa inizia
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Stampa avviata: ${printJob.name}`);
  },

  // Chiamato quando una stampa è terminata
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Stampa completata: ${printJob.name}`);
    // Salva dati nel database
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['mio-plugin', 'ultima-stampa', printJob.name]
    );
  }
};
```

## Hook Disponibili

| Hook | Trigger |
|------|---------|
| `onLoad` | Plugin caricato |
| `onUnload` | Plugin scaricato |
| `onPrinterConnect` | Stampante connessa |
| `onPrinterDisconnect` | Stampante disconnessa |
| `onPrintStart` | Stampa avviata |
| `onPrintEnd` | Stampa completata |
| `onPrintFail` | Stampa fallita |
| `onFilamentChange` | Cambio filamento |
| `onAmsUpdate` | Stato AMS aggiornato |

## Context del Plugin

Tutti gli hook ricevono un oggetto `context`:

| Proprietà | Tipo | Descrizione |
|----------|------|-------------|
| `api` | Express Router | Aggiungi rotte API personalizzate |
| `db` | SQLite | Accesso al database |
| `logger` | Logger | Logging |
| `events` | EventEmitter | Ascolta eventi |
| `config` | Object | Configurazione del dashboard |
| `printers` | Map | Tutte le stampanti connesse |

## Installare un Plugin

```bash
# Copia la cartella del plugin
cp -r mio-plugin/ plugins/

# Riavvia il dashboard
npm start
```

I plugin vengono attivati automaticamente all'avvio se sono presenti nella cartella `plugins/`.

## Disabilitare un Plugin

Aggiungi `"disabled": true` nel `plugin.json`, oppure rimuovi la cartella.

## Plugin di Esempio: Notifiche Slack

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Stampa completata! *${job.name}* ha impiegato ${job.duration}`
    });
  }
};
```
