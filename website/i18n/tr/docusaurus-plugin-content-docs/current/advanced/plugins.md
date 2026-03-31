---
sidebar_position: 4
title: Eklenti Sistemi
description: 3DPrintForge'u genişletmek için eklentiler oluşturun ve yükleyin
---

# Eklenti Sistemi

3DPrintForge, kaynak kodunu değiştirmeden işlevselliği genişletmenize olanak tanıyan bir eklenti sistemini destekler.

:::info Deneysel
Eklenti sistemi aktif geliştirme aşamasındadır. API sürümler arasında değişebilir.
:::

## Eklentiler Ne Yapabilir?

- Yeni API uç noktaları ekle
- Yazıcı olaylarını dinle ve bunlara tepki ver
- Yeni frontend panelleri ekle
- Üçüncü taraf hizmetlerle entegre ol
- Bildirim kanallarını genişlet

## Eklenti Yapısı

Eklenti, `plugins/` klasöründe bir Node.js modülüdür:

```
plugins/
└── benim-eklentim/
    ├── plugin.json    # Meta veriler
    ├── index.js       # Giriş noktası
    └── README.md      # Dokümantasyon (isteğe bağlı)
```

### plugin.json

```json
{
  "name": "benim-eklentim",
  "version": "1.0.0",
  "description": "Eklentinin açıklaması",
  "author": "Adınız",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Eklenti yüklendiğinde çağrılır
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Eklentim yüklendi');

    // Yeni bir API rotası kaydet
    api.get('/plugins/benim-eklentim/status', (req, res) => {
      res.json({ status: 'aktif' });
    });
  },

  // Baskı başladığında çağrılır
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Baskı başladı: ${printJob.name}`);
  },

  // Baskı bittiğinde çağrılır
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Baskı bitti: ${printJob.name}`);
    // Veritabanına veri kaydet
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['benim-eklentim', 'son-baski', printJob.name]
    );
  }
};
```

## Mevcut Hook'lar

| Hook | Tetikleyici |
|------|---------|
| `onLoad` | Eklenti yüklendi |
| `onUnload` | Eklenti kaldırıldı |
| `onPrinterConnect` | Yazıcı bağlandı |
| `onPrinterDisconnect` | Yazıcı bağlantısı kesildi |
| `onPrintStart` | Baskı başladı |
| `onPrintEnd` | Baskı tamamlandı |
| `onPrintFail` | Baskı başarısız |
| `onFilamentChange` | Filament değişimi |
| `onAmsUpdate` | AMS durumu güncellendi |

## Eklenti Context'i

Tüm hook'lar bir `context` nesnesi alır:

| Özellik | Tür | Açıklama |
|----------|------|-------------|
| `api` | Express Router | Kendi API rotalarını ekle |
| `db` | SQLite | Veritabanına erişim |
| `logger` | Logger | Günlük kaydı |
| `events` | EventEmitter | Olayları dinle |
| `config` | Object | Panonun yapılandırması |
| `printers` | Map | Tüm bağlı yazıcılar |

## Eklenti Yükleme

```bash
# Eklenti klasörünü kopyala
cp -r benim-eklentim/ plugins/

# Panoyu yeniden başlat
npm start
```

Eklentiler, `plugins/` klasöründe bulunurlarsa başlangıçta otomatik olarak etkinleştirilir.

## Eklentiyi Devre Dışı Bırakma

`plugin.json`'a `"disabled": true` ekleyin veya klasörü kaldırın.

## Örnek Eklenti: Slack Bildirimleri

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Baskı bitti! *${job.name}* ${job.duration} sürdü`
    });
  }
};
```
