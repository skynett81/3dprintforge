---
sidebar_position: 4
title: Plug-insysteem
description: Maak en installeer plug-ins om 3DPrintForge uit te breiden
---

# Plug-insysteem

3DPrintForge ondersteunt een plug-insysteem waarmee u de functionaliteit kunt uitbreiden zonder de broncode te wijzigen.

:::info Experimenteel
Het plug-insysteem is in actieve ontwikkeling. De API kan wijzigen tussen versies.
:::

## Wat kunnen plug-ins doen?

- Nieuwe API-eindpunten toevoegen
- Luisteren naar printergebeurtenissen en daarop reageren
- Nieuwe frontend-panelen toevoegen
- Integreren met diensten van derden
- Meldingskanalen uitbreiden

## Plug-instructuur

Een plug-in is een Node.js-module in de map `plugins/`:

```
plugins/
└── mijn-plugin/
    ├── plugin.json    # Metadata
    ├── index.js       # Toegangspunt
    └── README.md      # Documentatie (optioneel)
```

### plugin.json

```json
{
  "name": "mijn-plugin",
  "version": "1.0.0",
  "description": "Beschrijving van de plug-in",
  "author": "Uw naam",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Wordt aangeroepen wanneer de plug-in wordt geladen
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Mijn plug-in is geladen');

    // Een nieuwe API-route registreren
    api.get('/plugins/mijn-plugin/status', (req, res) => {
      res.json({ status: 'actief' });
    });
  },

  // Wordt aangeroepen wanneer een print start
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Print gestart: ${printJob.name}`);
  },

  // Wordt aangeroepen wanneer een print klaar is
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Print klaar: ${printJob.name}`);
    // Data opslaan in de database
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['mijn-plugin', 'laatste-print', printJob.name]
    );
  }
};
```

## Beschikbare hooks

| Hook | Trigger |
|------|---------|
| `onLoad` | Plug-in wordt geladen |
| `onUnload` | Plug-in wordt verwijderd |
| `onPrinterConnect` | Printer verbindt |
| `onPrinterDisconnect` | Printer verbreekt verbinding |
| `onPrintStart` | Print start |
| `onPrintEnd` | Print voltooid |
| `onPrintFail` | Print mislukt |
| `onFilamentChange` | Filamentwisseling |
| `onAmsUpdate` | AMS-status bijgewerkt |

## Plug-in context

Alle hooks ontvangen een `context`-object:

| Eigenschap | Type | Beschrijving |
|----------|------|-------------|
| `api` | Express Router | Eigen API-routes toevoegen |
| `db` | SQLite | Toegang tot de database |
| `logger` | Logger | Logging |
| `events` | EventEmitter | Luisteren naar gebeurtenissen |
| `config` | Object | Dashboardconfiguratie |
| `printers` | Map | Alle verbonden printers |

## Een plug-in installeren

```bash
# Plug-inmap kopiëren
cp -r mijn-plugin/ plugins/

# Dashboard herstarten
npm start
```

Plug-ins worden automatisch geactiveerd bij het opstarten als ze aanwezig zijn in de map `plugins/`.

## Een plug-in deactiveren

Voeg `"disabled": true` toe aan `plugin.json`, of verwijder de map.

## Voorbeeldplug-in: Slack-meldingen

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Print klaar! *${job.name}* duurde ${job.duration}`
    });
  }
};
```
