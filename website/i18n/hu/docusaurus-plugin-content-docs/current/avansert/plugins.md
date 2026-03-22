---
sidebar_position: 4
title: Plugin-rendszer
description: Hozz létre és telepíts plugineket a Bambu Dashboard bővítéséhez
---

# Plugin-rendszer

A Bambu Dashboard támogat egy plugin-rendszert, amely lehetővé teszi a funkcionalitás bővítését a forráskód módosítása nélkül.

:::info Kísérleti
A plugin-rendszer aktív fejlesztés alatt áll. Az API verziók között változhat.
:::

## Mit tehetnek a pluginek?

- Új API-végpontok hozzáadása
- Nyomtatóeseményekre való figyelés és reagálás
- Új frontend panelek hozzáadása
- Harmadik felek szolgáltatásaival való integráció
- Értesítési csatornák bővítése

## Plugin-struktúra

A plugin egy Node.js modul a `plugins/` mappában:

```
plugins/
└── en-pluginom/
    ├── plugin.json    # Metaadatok
    ├── index.js       # Belépési pont
    └── README.md      # Dokumentáció (opcionális)
```

### plugin.json

```json
{
  "name": "en-pluginom",
  "version": "1.0.0",
  "description": "A plugin leírása",
  "author": "A te neved",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // A plugin betöltésekor hívódik meg
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('A pluginom betöltve');

    // Új API-útvonal regisztrálása
    api.get('/plugins/en-pluginom/status', (req, res) => {
      res.json({ status: 'aktiv' });
    });
  },

  // Nyomtatás indításakor hívódik meg
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Nyomtatás indult: ${printJob.name}`);
  },

  // Nyomtatás befejezésekor hívódik meg
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Nyomtatás kész: ${printJob.name}`);
    // Adatok mentése az adatbázisba
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['en-pluginom', 'utolso-nyomtatas', printJob.name]
    );
  }
};
```

## Elérhető hookok

| Hook | Kiváltja |
|------|----------|
| `onLoad` | Plugin betöltése |
| `onUnload` | Plugin eltávolítása |
| `onPrinterConnect` | Nyomtató csatlakozása |
| `onPrinterDisconnect` | Nyomtató lecsatlakozása |
| `onPrintStart` | Nyomtatás indítása |
| `onPrintEnd` | Nyomtatás befejezése |
| `onPrintFail` | Nyomtatás meghiúsulása |
| `onFilamentChange` | Filamentcsere |
| `onAmsUpdate` | AMS állapotfrissítés |

## Plugin-kontextus

Minden hook kap egy `context` objektumot:

| Tulajdonság | Típus | Leírás |
|-------------|-------|--------|
| `api` | Express Router | Egyedi API-útvonalak hozzáadása |
| `db` | SQLite | Hozzáférés az adatbázishoz |
| `logger` | Logger | Naplózás |
| `events` | EventEmitter | Eseményekre való figyelés |
| `config` | Object | A dashboard konfigurációja |
| `printers` | Map | Összes csatlakozott nyomtató |

## Plugin telepítése

```bash
# Plugin mappa másolása
cp -r en-pluginom/ plugins/

# Dashboard újraindítása
npm start
```

A pluginek automatikusan aktiválódnak indításkor, ha a `plugins/` mappában találhatók.

## Plugin deaktiválása

Add hozzá a `"disabled": true` sort a `plugin.json`-hoz, vagy töröld a mappát.

## Példa plugin: Slack értesítések

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Nyomtatás kész! *${job.name}* ennyi ideig tartott: ${job.duration}`
    });
  }
};
```
