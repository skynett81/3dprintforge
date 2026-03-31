---
sidebar_position: 2
title: 技術アーキテクチャ
description: 3DPrintForgeのアーキテクチャ概要 — スタック、モジュール、データベース、WebSocket
---

# 技術アーキテクチャ

## システム図

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

ダッシュボードはTLS上のMQTT（ポート8883）でプリンターと、RTSPS（ポート322）でカメラと通信します。ブラウザはHTTPSとWebSocketでダッシュボードに接続します。

## 技術スタック

| レイヤー | 技術 |
|-----|-----------|
| フロントエンド | バニラHTML/CSS/JS — 76コンポーネントモジュール、ビルドステップなし、フレームワークなし |
| バックエンド | Node.js 22と3つのnpmパッケージ：`mqtt`、`ws`、`basic-ftp` |
| データベース | SQLite（Node.js 22経由で組み込み `--experimental-sqlite`） |
| カメラ | ffmpegがRTSPSをMPEG1にトランスコード、jsmpegがブラウザでレンダリング |
| リアルタイム | WebSocketハブがすべての接続クライアントにプリンター状態をブロードキャスト |
| プロトコル | TLS上のMQTT（ポート8883）とプリンターのLANアクセスコード |

## ポート

| ポート | プロトコル | 方向 | 説明 |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | 受信 | ダッシュボード（HTTPSにリダイレクト） |
| 3443 | HTTPS + WSS | 受信 | セキュアなダッシュボード（標準） |
| 9001+ | WS | 受信 | カメラストリーム（プリンターごとに1つ） |
| 8883 | MQTTS | 送信 | プリンターへの接続 |
| 322 | RTSPS | 送信 | プリンターからのカメラ |

## サーバーモジュール（44）

| モジュール | 目的 |
|-------|--------|
| `index.js` | HTTP/HTTPSサーバー、自動SSL、CSP/HSTSヘッダー、静的ファイル、デモモード |
| `config.js` | 設定の読み込み、デフォルト値、env上書き、移行 |
| `database.js` | SQLiteスキーマ、105回の移行、CRUD操作 |
| `api-routes.js` | REST API（284以上のエンドポイント） |
| `auth.js` | 認証とセッション管理 |
| `backup.js` | バックアップと復元 |
| `printer-manager.js` | プリンターライフサイクル、MQTT接続管理 |
| `mqtt-client.js` | BambuプリンターへのMQTT接続 |
| `mqtt-commands.js` | MQTTコマンド構築（一時停止、再開、停止など） |
| `websocket-hub.js` | すべてのブラウザクライアントへのWebSocketブロードキャスト |
| `camera-stream.js` | カメラストリーム用ffmpegプロセス管理 |
| `print-tracker.js` | プリントジョブ追跡、状態遷移、履歴ログ |
| `print-guard.js` | xcam + センサー監視によるプリント保護 |
| `queue-manager.js` | マルチプリンターディスパッチと負荷分散を持つプリントキュー |
| `slicer-service.js` | ローカルスライサーCLIブリッジ、ファイルアップロード、FTPSアップロード |
| `telemetry.js` | テレメトリーデータ処理 |
| `telemetry-sampler.js` | 時系列データサンプリング |
| `thumbnail-service.js` | プリンターSDからFTPSを通じたサムネイル取得 |
| `timelapse-service.js` | タイムラプス録画と管理 |
| `notifications.js` | 7チャンネル通知システム（Telegram、Discord、メール、Webhook、ntfy、Pushover、SMS） |
| `updater.js` | バックアップ付きGitHub Releases自動更新 |
| `setup-wizard.js` | 初回使用のWebベースセットアップウィザード |
| `ecom-license.js` | ライセンス管理 |
| `failure-detection.js` | 障害検知と分析 |
| `bambu-cloud.js` | Bambu Cloud API統合 |
| `bambu-rfid-data.js` | AMSからのRFIDフィラメントデータ |
| `circuit-breaker.js` | サービス安定性のためのサーキットブレーカーパターン |
| `energy-service.js` | エネルギーと電力料金計算 |
| `error-pattern-analyzer.js` | HMSエラーのパターン分析 |
| `file-parser.js` | 3MF/Gcodeファイルの解析 |
| `logger.js` | 構造化ログ |
| `material-recommender.js` | 素材推奨 |
| `milestone-service.js` | マイルストーンと実績追跡 |
| `plugin-manager.js` | 拡張機能のプラグインシステム |
| `power-monitor.js` | 電力メーター統合（Shelly/Tasmota） |
| `price-checker.js` | 電力料金取得（Tibber/Nordpool） |
| `printer-discovery.js` | LAN上の自動プリンター発見 |
| `remote-nodes.js` | マルチノード管理 |
| `report-service.js` | レポート生成 |
| `seed-filament-db.js` | フィラメントデータベースのシーディング |
| `spoolease-data.js` | SpoolEase統合 |
| `validate.js` | 入力検証 |
| `wear-prediction.js` | コンポーネントの消耗予測 |

## フロントエンドコンポーネント（76）

すべてのコンポーネントはビルドステップなしのバニラJavaScriptモジュールです。`<script type="module">`を通じてブラウザに直接ロードされます。

| コンポーネント | 目的 |
|-----------|--------|
| `print-preview.js` | 3Dモデルビューア + MakerWorld画像解決 |
| `model-viewer.js` | レイヤーアニメーション付きWebGL 3Dレンダリング |
| `temperature-gauge.js` | アニメーションSVGリングゲージ |
| `sparkline-stats.js` | Grafana風統計パネル |
| `ams-panel.js` | AMSフィラメント可視化 |
| `camera-view.js` | フルスクリーン付きjsmpegビデオプレーヤー |
| `controls-panel.js` | プリンターコントロールUI |
| `history-table.js` | 検索、フィルター、CSVエクスポート付きプリント履歴 |
| `filament-tracker.js` | お気に入り、カラーフィルタリング付きフィラメント在庫 |
| `queue-panel.js` | プリントキュー管理 |
| `knowledge-panel.js` | ナレッジベースリーダーとエディター |

## データベース

SQLiteデータベースはNode.js 22に組み込まれており、外部インストールは不要です。スキーマは`db/migrations.js`の105回の移行によって管理されます。

主要テーブル：

- `printers` — プリンター設定
- `print_history` — すべてのプリントジョブ
- `filaments` — フィラメント在庫
- `ams_slots` — AMSスロットマッピング
- `queue` — プリントキュー
- `notifications_config` — 通知設定
- `maintenance_log` — メンテナンスログ

## セキュリティ

- 自動生成証明書（またはお客様の証明書）によるHTTPS
- JWTベースの認証
- CSPとHSTSヘッダー
- レート制限（200 req/分）
- コア機能に対する外部クラウド依存なし
