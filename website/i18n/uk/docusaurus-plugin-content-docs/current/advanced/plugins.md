---
sidebar_position: 4
title: Система плагінів
description: Створюйте та встановлюйте плагіни для розширення 3DPrintForge
---

# Система плагінів

3DPrintForge підтримує систему плагінів, яка дозволяє розширювати функціональність без зміни вихідного коду.

:::info Експериментально
Система плагінів знаходиться в активній розробці. API може змінюватись між версіями.
:::

## Що можуть робити плагіни?

- Додавати нові API-ендпоінти
- Слухати події принтера та реагувати на них
- Додавати нові панелі frontend
- Інтегруватись з сторонніми сервісами
- Розширювати канали сповіщень

## Структура плагіна

Плагін — це Node.js-модуль у папці `plugins/`:

```
plugins/
└── my-plugin/
    ├── plugin.json    # Метадані
    ├── index.js       # Точка входу
    └── README.md      # Документація (необов'язково)
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Опис плагіна",
  "author": "Ваше ім'я",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Викликається при завантаженні плагіна
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Мій плагін завантажено');

    // Зареєструйте новий API-маршрут
    api.get('/plugins/my-plugin/status', (req, res) => {
      res.json({ status: 'active' });
    });
  },

  // Викликається при початку друку
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Друк розпочато: ${printJob.name}`);
  },

  // Викликається при завершенні друку
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Друк завершено: ${printJob.name}`);
    // Збережіть дані в базі даних
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['my-plugin', 'last-print', printJob.name]
    );
  }
};
```

## Доступні hooks

| Hook | Тригер |
|------|---------|
| `onLoad` | Плагін завантажується |
| `onUnload` | Плагін вивантажується |
| `onPrinterConnect` | Принтер підключається |
| `onPrinterDisconnect` | Принтер відключається |
| `onPrintStart` | Друк починається |
| `onPrintEnd` | Друк завершується |
| `onPrintFail` | Друк не вдається |
| `onFilamentChange` | Заміна філаменту |
| `onAmsUpdate` | Оновлення статусу AMS |

## Контекст плагіна

Всі hooks отримують об'єкт `context`:

| Властивість | Тип | Опис |
|----------|------|-------------|
| `api` | Express Router | Додайте власні API-маршрути |
| `db` | SQLite | Доступ до бази даних |
| `logger` | Logger | Журналювання |
| `events` | EventEmitter | Слухайте події |
| `config` | Object | Конфігурація дашборду |
| `printers` | Map | Всі підключені принтери |

## Встановлення плагіна

```bash
# Скопіюйте папку плагіна
cp -r my-plugin/ plugins/

# Перезапустіть дашборд
npm start
```

Плагіни активуються автоматично при запуску, якщо вони знаходяться в папці `plugins/`.

## Вимкнення плагіна

Додайте `"disabled": true` до `plugin.json` або видаліть папку.

## Приклад плагіна: Slack-сповіщення

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Друк завершено! *${job.name}* зайняв ${job.duration}`
    });
  }
};
```
