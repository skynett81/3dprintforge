---
sidebar_position: 4
title: プラグインシステム
description: Bambu Dashboardを拡張するプラグインを作成・インストールする
---

# プラグインシステム

Bambu Dashboardはソースコードを変更せずに機能を拡張できるプラグインシステムをサポートしています。

:::info 実験的
プラグインシステムは活発に開発中です。APIはバージョン間で変更される場合があります。
:::

## プラグインでできること

- 新しいAPIエンドポイントを追加する
- プリンターイベントをリッスンして反応する
- 新しいフロントエンドパネルを追加する
- サードパーティサービスと統合する
- 通知チャンネルを拡張する

## プラグイン構造

プラグインは`plugins/`フォルダーのNode.jsモジュールです：

```
plugins/
└── my-plugin/
    ├── plugin.json    # メタデータ
    ├── index.js       # エントリーポイント
    └── README.md      # ドキュメント（オプション）
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "プラグインの説明",
  "author": "あなたの名前",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // プラグインがロードされたときに呼ばれる
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('私のプラグインがロードされました');

    // 新しいAPIルートを登録する
    api.get('/plugins/my-plugin/status', (req, res) => {
      res.json({ status: 'active' });
    });
  },

  // プリントが開始されたときに呼ばれる
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`プリント開始：${printJob.name}`);
  },

  // プリントが完了したときに呼ばれる
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`プリント完了：${printJob.name}`);
    // データベースにデータを保存する
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['my-plugin', 'last-print', printJob.name]
    );
  }
};
```

## 利用可能なフック

| フック | トリガー |
|------|---------|
| `onLoad` | プラグインがロードされる |
| `onUnload` | プラグインがアンロードされる |
| `onPrinterConnect` | プリンターが接続する |
| `onPrinterDisconnect` | プリンターが切断する |
| `onPrintStart` | プリントが開始される |
| `onPrintEnd` | プリントが完了する |
| `onPrintFail` | プリントが失敗する |
| `onFilamentChange` | フィラメントが交換される |
| `onAmsUpdate` | AMSステータスが更新される |

## プラグインコンテキスト

すべてのフックは`context`オブジェクトを受け取ります：

| プロパティ | タイプ | 説明 |
|----------|------|-------------|
| `api` | Express Router | カスタムAPIルートを追加 |
| `db` | SQLite | データベースへのアクセス |
| `logger` | Logger | ログ記録 |
| `events` | EventEmitter | イベントをリッスン |
| `config` | Object | ダッシュボードの設定 |
| `printers` | Map | 接続されているすべてのプリンター |

## プラグインをインストールする

```bash
# プラグインフォルダーをコピー
cp -r my-plugin/ plugins/

# ダッシュボードを再起動
npm start
```

プラグインは`plugins/`フォルダーに存在する場合、起動時に自動的に有効化されます。

## プラグインを無効にする

`plugin.json`に`"disabled": true`を追加するか、フォルダーを削除します。

## サンプルプラグイン：Slack通知

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `プリント完了！ *${job.name}* は ${job.duration} かかりました`
    });
  }
};
```
