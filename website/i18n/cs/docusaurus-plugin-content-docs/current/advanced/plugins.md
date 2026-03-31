---
sidebar_position: 4
title: Systém pluginů
description: Vytvářejte a instalujte pluginy pro rozšíření 3DPrintForge
---

# Systém pluginů

3DPrintForge podporuje systém pluginů, který vám umožňuje rozšířit funkčnost bez změny zdrojového kódu.

:::info Experimentální
Systém pluginů je aktivně vyvíjen. API se může měnit mezi verzemi.
:::

## Co mohou pluginy dělat?

- Přidávat nové API koncové body
- Naslouchat událostem tiskárny a reagovat na ně
- Přidávat nové frontendové panely
- Integrovat se službami třetích stran
- Rozšiřovat kanály oznámení

## Struktura pluginu

Plugin je Node.js modul ve složce `plugins/`:

```
plugins/
└── muj-plugin/
    ├── plugin.json    # Metadata
    ├── index.js       # Vstupní bod
    └── README.md      # Dokumentace (volitelné)
```

### plugin.json

```json
{
  "name": "muj-plugin",
  "version": "1.0.0",
  "description": "Popis pluginu",
  "author": "Vaše jméno",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Volá se při načtení pluginu
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Můj plugin byl načten');

    // Registrace nové API trasy
    api.get('/plugins/muj-plugin/status', (req, res) => {
      res.json({ status: 'aktivní' });
    });
  },

  // Volá se při spuštění tisku
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Tisk zahájen: ${printJob.name}`);
  },

  // Volá se při dokončení tisku
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Tisk dokončen: ${printJob.name}`);
    // Uložení dat do databáze
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['muj-plugin', 'posledni-tisk', printJob.name]
    );
  }
};
```

## Dostupné hooky

| Hook | Spouštěč |
|------|---------|
| `onLoad` | Plugin je načten |
| `onUnload` | Plugin je uvolněn |
| `onPrinterConnect` | Tiskárna se připojí |
| `onPrinterDisconnect` | Tiskárna se odpojí |
| `onPrintStart` | Tisk začíná |
| `onPrintEnd` | Tisk se dokončuje |
| `onPrintFail` | Tisk selže |
| `onFilamentChange` | Výměna filamentu |
| `onAmsUpdate` | Stav AMS se aktualizuje |

## Kontext pluginu

Všechny hooky dostávají objekt `context`:

| Vlastnost | Typ | Popis |
|----------|------|-------------|
| `api` | Express Router | Přidávání vlastních API tras |
| `db` | SQLite | Přístup k databázi |
| `logger` | Logger | Protokolování |
| `events` | EventEmitter | Naslouchání událostem |
| `config` | Object | Konfigurace dashboardu |
| `printers` | Map | Všechny připojené tiskárny |

## Instalace pluginu

```bash
# Zkopírujte složku pluginu
cp -r muj-plugin/ plugins/

# Restartujte dashboard
npm start
```

Pluginy se automaticky aktivují při spuštění, pokud se nacházejí ve složce `plugins/`.

## Deaktivace pluginu

Přidejte `"disabled": true` do `plugin.json` nebo odeberte složku.

## Ukázkový plugin: Slack oznámení

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Tisk dokončen! *${job.name}* trval ${job.duration}`
    });
  }
};
```
