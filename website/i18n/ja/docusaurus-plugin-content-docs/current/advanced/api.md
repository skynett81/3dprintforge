---
sidebar_position: 1
title: APIリファレンス
description: 284以上のエンドポイント、認証、レート制限を持つREST API
---

# APIリファレンス

3DPrintForgeは284以上のエンドポイントを持つフル機能のREST APIを公開しています。APIドキュメントはダッシュボード内で直接利用できます。

## インタラクティブドキュメント

ブラウザでOpenAPIドキュメントを開きます：

```
https://あなたのサーバー:3443/api/docs
```

すべてのエンドポイント、パラメーター、リクエスト/レスポンススキーマ、APIを直接テストする機能が確認できます。

## 認証

APIは**Bearerトークン**認証（JWT）を使用します：

```bash
# ログインしてトークンを取得
curl -X POST https://あなたのサーバー:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "あなたのパスワード"}'

# レスポンス
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

後続のすべての呼び出しでトークンを使用します：

```bash
curl https://あなたのサーバー:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## レート制限

APIはサーバーを保護するためにレート制限されています：

| 制限 | 値 |
|--------|-------|
| 1分あたりのリクエスト数 | 200 |
| バースト（1秒あたりの最大） | 20 |
| 超過時のレスポンス | `429 Too Many Requests` |

レスポンスの`Retry-After`ヘッダーは次のリクエストが許可されるまでの秒数を示します。

## エンドポイント概要

### 認証
| メソッド | エンドポイント | 説明 |
|--------|-----------|-------------|
| POST | `/api/auth/login` | ログイン、JWTを取得 |
| POST | `/api/auth/logout` | ログアウト |
| GET | `/api/auth/me` | ログインユーザーを取得 |

### プリンター
| メソッド | エンドポイント | 説明 |
|--------|-----------|-------------|
| GET | `/api/printers` | すべてのプリンターをリスト |
| POST | `/api/printers` | プリンターを追加 |
| GET | `/api/printers/:id` | プリンターを取得 |
| PUT | `/api/printers/:id` | プリンターを更新 |
| DELETE | `/api/printers/:id` | プリンターを削除 |
| GET | `/api/printers/:id/status` | リアルタイムステータス |
| POST | `/api/printers/:id/command` | コマンドを送信 |

### フィラメント
| メソッド | エンドポイント | 説明 |
|--------|-----------|-------------|
| GET | `/api/filaments` | すべてのスプールをリスト |
| POST | `/api/filaments` | スプールを追加 |
| PUT | `/api/filaments/:id` | スプールを更新 |
| DELETE | `/api/filaments/:id` | スプールを削除 |
| GET | `/api/filaments/stats` | 消費統計 |

### プリント履歴
| メソッド | エンドポイント | 説明 |
|--------|-----------|-------------|
| GET | `/api/history` | 履歴をリスト（ページネーション） |
| GET | `/api/history/:id` | 単一プリントを取得 |
| GET | `/api/history/export` | CSVをエクスポート |
| GET | `/api/history/stats` | 統計 |

### プリントキュー
| メソッド | エンドポイント | 説明 |
|--------|-----------|-------------|
| GET | `/api/queue` | キューを取得 |
| POST | `/api/queue` | ジョブを追加 |
| PUT | `/api/queue/:id` | ジョブを更新 |
| DELETE | `/api/queue/:id` | ジョブを削除 |
| POST | `/api/queue/dispatch` | ディスパッチを強制 |

## WebSocket API

RESTに加えて、リアルタイムデータ用のWebSocket APIがあります：

```javascript
const ws = new WebSocket('wss://あなたのサーバー:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### メッセージタイプ（受信）
- `printer.status` — 更新されたプリンターステータス
- `print.progress` — 進捗率の更新
- `ams.update` — AMSステータスの変更
- `notification` — 通知メッセージ

## エラーコード

| コード | 意味 |
|------|-------|
| 200 | OK |
| 201 | 作成済み |
| 400 | 不正なリクエスト |
| 401 | 未認証 |
| 403 | 未承認 |
| 404 | 見つからない |
| 429 | リクエストが多すぎる |
| 500 | サーバーエラー |
