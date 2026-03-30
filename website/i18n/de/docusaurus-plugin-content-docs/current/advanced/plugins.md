---
sidebar_position: 4
title: Plugin-System
description: Plugins erstellen und installieren, um Bambu Dashboard zu erweitern
---

# Plugin-System

Bambu Dashboard unterstützt ein Plugin-System, mit dem Sie die Funktionalität erweitern können, ohne den Quellcode zu ändern.

:::info Experimentell
Das Plugin-System befindet sich in aktiver Entwicklung. Die API kann sich zwischen Versionen ändern.
:::

## Was können Plugins tun?

- Neue API-Endpunkte hinzufügen
- Auf Druckerereignisse hören und darauf reagieren
- Neue Frontend-Panels hinzufügen
- Mit Drittanbieterdiensten integrieren
- Benachrichtigungskanäle erweitern

## Plugin-Struktur

Ein Plugin ist ein Node.js-Modul im `plugins/`-Ordner:

```
plugins/
└── mein-plugin/
    ├── plugin.json    # Metadaten
    ├── index.js       # Einstiegspunkt
    └── README.md      # Dokumentation (optional)
```

### plugin.json

```json
{
  "name": "mein-plugin",
  "version": "1.0.0",
  "description": "Beschreibung des Plugins",
  "author": "Ihr Name",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Wird aufgerufen, wenn das Plugin geladen wird
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Mein Plugin ist geladen');

    // Eine neue API-Route registrieren
    api.get('/plugins/mein-plugin/status', (req, res) => {
      res.json({ status: 'aktiv' });
    });
  },

  // Wird aufgerufen, wenn ein Druck startet
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Druck gestartet: ${printJob.name}`);
  },

  // Wird aufgerufen, wenn ein Druck fertig ist
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Druck fertig: ${printJob.name}`);
    // Daten in der Datenbank speichern
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['mein-plugin', 'letzter-druck', printJob.name]
    );
  }
};
```

## Verfügbare Hooks

| Hook | Auslöser |
|------|---------|
| `onLoad` | Plugin wird geladen |
| `onUnload` | Plugin wird entladen |
| `onPrinterConnect` | Drucker verbindet sich |
| `onPrinterDisconnect` | Drucker trennt die Verbindung |
| `onPrintStart` | Druck startet |
| `onPrintEnd` | Druck wird abgeschlossen |
| `onPrintFail` | Druck schlägt fehl |
| `onFilamentChange` | Filamentwechsel |
| `onAmsUpdate` | AMS-Status wird aktualisiert |

## Plugin-Kontext

Alle Hooks erhalten ein `context`-Objekt:

| Eigenschaft | Typ | Beschreibung |
|----------|------|-------------|
| `api` | Express Router | Eigene API-Routen hinzufügen |
| `db` | SQLite | Zugriff auf die Datenbank |
| `logger` | Logger | Protokollierung |
| `events` | EventEmitter | Auf Ereignisse hören |
| `config` | Object | Dashboard-Konfiguration |
| `printers` | Map | Alle verbundenen Drucker |

## Ein Plugin installieren

```bash
# Plugin-Ordner kopieren
cp -r mein-plugin/ plugins/

# Dashboard neu starten
npm start
```

Plugins werden beim Start automatisch aktiviert, wenn sie sich im `plugins/`-Ordner befinden.

## Ein Plugin deaktivieren

`"disabled": true` zu `plugin.json` hinzufügen oder den Ordner entfernen.

## Beispiel-Plugin: Slack-Benachrichtigungen

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Druck fertig! *${job.name}* dauerte ${job.duration}`
    });
  }
};
```
