---
sidebar_position: 4
title: Plugin-system
description: Skapa och installera plugins för att utöka 3DPrintForge
---

# Plugin-system

3DPrintForge stöder ett plugin-system som låter dig utöka funktionaliteten utan att ändra källkoden.

:::info Experimentellt
Plugin-systemet är under aktiv utveckling. API:et kan ändras mellan versioner.
:::

## Vad kan plugins göra?

- Lägga till nya API-endpunkter
- Lyssna på skrivarhändelser och reagera på dem
- Lägga till nya frontendpaneler
- Integrera med tredjepartstjänster
- Utöka aviseringskanaler

## Plugin-struktur

Ett plugin är en Node.js-modul i `plugins/`-mappen:

```
plugins/
└── mitt-plugin/
    ├── plugin.json    # Metadata
    ├── index.js       # Startpunkt
    └── README.md      # Dokumentation (valfritt)
```

### plugin.json

```json
{
  "name": "mitt-plugin",
  "version": "1.0.0",
  "description": "Beskrivning av pluginen",
  "author": "Ditt namn",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Anropas när pluginen laddas
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Mitt plugin är laddat');

    // Registrera en ny API-rutt
    api.get('/plugins/mitt-plugin/status', (req, res) => {
      res.json({ status: 'aktiv' });
    });
  },

  // Anropas när en utskrift startar
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Utskrift startad: ${printJob.name}`);
  },

  // Anropas när en utskrift är klar
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Utskrift klar: ${printJob.name}`);
    // Spara data i databasen
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['mitt-plugin', 'senaste-utskrift', printJob.name]
    );
  }
};
```

## Tillgängliga hooks

| Hook | Utlösare |
|------|---------|
| `onLoad` | Plugin laddas in |
| `onUnload` | Plugin laddas ur |
| `onPrinterConnect` | Skrivare ansluter |
| `onPrinterDisconnect` | Skrivare kopplar från |
| `onPrintStart` | Utskrift startar |
| `onPrintEnd` | Utskrift slutförs |
| `onPrintFail` | Utskrift misslyckas |
| `onFilamentChange` | Filamentbyte |
| `onAmsUpdate` | AMS-status uppdateras |

## Plugin context

Alla hooks tar emot ett `context`-objekt:

| Egenskap | Typ | Beskrivning |
|----------|------|-------------|
| `api` | Express Router | Lägg till egna API-rutter |
| `db` | SQLite | Åtkomst till databasen |
| `logger` | Logger | Loggning |
| `events` | EventEmitter | Lyssna på händelser |
| `config` | Object | Dashboardets konfiguration |
| `printers` | Map | Alla anslutna skrivare |

## Installera ett plugin

```bash
# Kopiera plugin-mappen
cp -r mitt-plugin/ plugins/

# Starta om dashboardet
npm start
```

Plugins aktiveras automatiskt vid uppstart om de finns i `plugins/`-mappen.

## Inaktivera ett plugin

Lägg till `"disabled": true` i `plugin.json`, eller ta bort mappen.

## Exempelplugin: Slack-aviseringar

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Utskrift klar! *${job.name}* tog ${job.duration}`
    });
  }
};
```
