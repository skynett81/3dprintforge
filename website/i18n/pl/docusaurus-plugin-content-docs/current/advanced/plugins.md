---
sidebar_position: 4
title: System wtyczek
description: Twórz i instaluj wtyczki, aby rozszerzyć 3DPrintForge
---

# System wtyczek

3DPrintForge obsługuje system wtyczek, który pozwala rozszerzyć funkcjonalność bez modyfikowania kodu źródłowego.

:::info Eksperymentalne
System wtyczek jest aktywnie rozwijany. API może się zmieniać między wersjami.
:::

## Co mogą robić wtyczki?

- Dodawać nowe endpointy API
- Nasłuchiwać zdarzeń drukarki i reagować na nie
- Dodawać nowe panele frontendowe
- Integrować z usługami zewnętrznymi
- Rozszerzać kanały powiadomień

## Struktura wtyczki

Wtyczka to moduł Node.js w folderze `plugins/`:

```
plugins/
└── moja-wtyczka/
    ├── plugin.json    # Metadane
    ├── index.js       # Punkt wejścia
    └── README.md      # Dokumentacja (opcjonalne)
```

### plugin.json

```json
{
  "name": "moja-wtyczka",
  "version": "1.0.0",
  "description": "Opis wtyczki",
  "author": "Twoje imię",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Wywoływane gdy wtyczka jest ładowana
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Moja wtyczka jest załadowana');

    // Zarejestruj nową trasę API
    api.get('/plugins/moja-wtyczka/status', (req, res) => {
      res.json({ status: 'aktywna' });
    });
  },

  // Wywoływane gdy wydruk się zaczyna
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Wydruk started: ${printJob.name}`);
  },

  // Wywoływane gdy wydruk jest gotowy
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Wydruk gotowy: ${printJob.name}`);
    // Zapisz dane w bazie danych
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['moja-wtyczka', 'ostatni-wydruk', printJob.name]
    );
  }
};
```

## Dostępne hooki

| Hook | Wyzwalacz |
|------|---------|
| `onLoad` | Wtyczka jest ładowana |
| `onUnload` | Wtyczka jest rozładowywana |
| `onPrinterConnect` | Drukarka się łączy |
| `onPrinterDisconnect` | Drukarka się rozłącza |
| `onPrintStart` | Wydruk się zaczyna |
| `onPrintEnd` | Wydruk jest ukończony |
| `onPrintFail` | Wydruk zawodzi |
| `onFilamentChange` | Zmiana filamentu |
| `onAmsUpdate` | Status AMS jest aktualizowany |

## Kontekst wtyczki

Wszystkie hooki otrzymują obiekt `context`:

| Właściwość | Typ | Opis |
|----------|------|-------------|
| `api` | Express Router | Dodaj własne trasy API |
| `db` | SQLite | Dostęp do bazy danych |
| `logger` | Logger | Logowanie |
| `events` | EventEmitter | Nasłuchuj zdarzeń |
| `config` | Object | Konfiguracja dashboardu |
| `printers` | Map | Wszystkie podłączone drukarki |

## Instalowanie wtyczki

```bash
# Skopiuj folder wtyczki
cp -r moja-wtyczka/ plugins/

# Zrestartuj dashboard
npm start
```

Wtyczki są aktywowane automatycznie przy uruchomieniu, jeśli są obecne w folderze `plugins/`.

## Dezaktywowanie wtyczki

Dodaj `"disabled": true` do `plugin.json` lub usuń folder.

## Przykładowa wtyczka: Powiadomienia Slack

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Wydruk gotowy! *${job.name}* zajął ${job.duration}`
    });
  }
};
```
