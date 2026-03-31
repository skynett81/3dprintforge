---
sidebar_position: 4
title: Plugin-system
description: Lag og installer plugins for å utvide 3DPrintForge
---

# Plugin-system

3DPrintForge støtter et plugin-system som lar deg utvide funksjonaliteten uten å endre kildekoden.

:::info Eksperimentelt
Plugin-systemet er under aktiv utvikling. API-et kan endre seg mellom versjoner.
:::

## Hva kan plugins gjøre?

- Legge til nye API-endepunkter
- Lytte på printer-hendelser og reagere på dem
- Legge til nye frontend-paneler
- Integrere med tredjeparts tjenester
- Utvide varslingskanaler

## Plugin-struktur

Et plugin er en Node.js-modul i `plugins/`-mappen:

```
plugins/
└── mitt-plugin/
    ├── plugin.json    # Metadata
    ├── index.js       # Inngangspunkt
    └── README.md      # Dokumentasjon (valgfritt)
```

### plugin.json

```json
{
  "name": "mitt-plugin",
  "version": "1.0.0",
  "description": "Beskrivelse av pluginen",
  "author": "Ditt navn",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Kalles når pluginen lastes
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Mitt plugin er lastet');

    // Registrer en ny API-rute
    api.get('/plugins/mitt-plugin/status', (req, res) => {
      res.json({ status: 'aktiv' });
    });
  },

  // Kalles når en print starter
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Print startet: ${printJob.name}`);
  },

  // Kalles når en print er ferdig
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Print ferdig: ${printJob.name}`);
    // Lagre data i databasen
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['mitt-plugin', 'siste-print', printJob.name]
    );
  }
};
```

## Tilgjengelige hooks

| Hook | Utløser |
|------|---------|
| `onLoad` | Plugin lastes inn |
| `onUnload` | Plugin lastes ut |
| `onPrinterConnect` | Printer kobler til |
| `onPrinterDisconnect` | Printer kobler fra |
| `onPrintStart` | Print starter |
| `onPrintEnd` | Print fullføres |
| `onPrintFail` | Print feiler |
| `onFilamentChange` | Filamentbytte |
| `onAmsUpdate` | AMS-status oppdateres |

## Plugin context

Alle hooks mottar et `context`-objekt:

| Egenskap | Type | Beskrivelse |
|----------|------|-------------|
| `api` | Express Router | Legg til egne API-ruter |
| `db` | SQLite | Tilgang til databasen |
| `logger` | Logger | Logging |
| `events` | EventEmitter | Lytt på hendelser |
| `config` | Object | Dashboardets konfigurasjon |
| `printers` | Map | Alle tilkoblede printere |

## Installere en plugin

```bash
# Kopier plugin-mappen
cp -r mitt-plugin/ plugins/

# Restart dashboardet
npm start
```

Plugins aktiveres automatisk ved oppstart hvis de finnes i `plugins/`-mappen.

## Deaktivere en plugin

Legg til `"disabled": true` i `plugin.json`, eller fjern mappen.

## Eksempel-plugin: Slack-varsler

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Print ferdig! *${job.name}* tok ${job.duration}`
    });
  }
};
```
