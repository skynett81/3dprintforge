---
sidebar_position: 3
title: Dockerセットアップ
description: DockerとDocker Composeを使用してBambu Dashboardを実行する
---

# Dockerセットアップ

Bambu Dashboardには簡単なコンテナ化のための`Dockerfile`と`docker-compose.yml`が含まれています。

## クイックスタート

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

ブラウザで`https://localhost:3443`を開きます。

## docker-compose.yml

```yaml
version: '3.8'

services:
  bambu-dashboard:
    build: .
    container_name: bambu-dashboard
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "3443:3443"
      - "9001-9010:9001-9010"   # カメラストリーム
    volumes:
      - ./data:/app/data         # データベースと設定
      - ./certs:/app/certs       # SSL証明書（オプション）
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # MQTT接続に推奨
```

:::warning network_mode: host
コンテナがMQTT経由でローカルネットワーク上のプリンターに到達できるようにするため、`network_mode: host`が推奨されます。これがないと、ネットワーク設定によってはMQTT接続が失敗する場合があります。
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# カメラストリーミング用にffmpegをインストール
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## ボリューム

| ホストパス | コンテナパス | 内容 |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLiteデータベース、設定 |
| `./certs` | `/app/certs` | SSL証明書（オプション） |

:::tip 永続データ
常に`./data`ボリュームをマウントしてください。これがないと、コンテナの再起動時にすべてのデータが失われます。
:::

## 環境変数

| 変数 | デフォルト | 説明 |
|----------|---------|-------------|
| `NODE_ENV` | `production` | 環境 |
| `PORT` | `3000` | HTTPポート |
| `HTTPS_PORT` | `3443` | HTTPSポート |
| `AUTH_SECRET` | （自動） | JWTシークレット — 本番環境では明示的に設定 |
| `LOG_LEVEL` | `info` | ログレベル（debug、info、warn、error） |

## DockerでのSSL証明書

### 自己生成（デフォルト）
設定不要です。証明書が自動的に生成され、`./data/certs/`に保存されます。

### カスタム証明書
```yaml
volumes:
  - ./my-cert.pem:/app/certs/cert.pem:ro
  - ./my-key.pem:/app/certs/key.pem:ro
```

## 管理

```bash
# 起動
docker-compose up -d

# 停止
docker-compose down

# ログ
docker-compose logs -f

# 新バージョンに更新
docker-compose pull
docker-compose up -d --build

# データベースのバックアップ
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## ヘルスステータス

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

コンテナはサーバーが起動して`/api/health`に応答すると`healthy`を報告します。
