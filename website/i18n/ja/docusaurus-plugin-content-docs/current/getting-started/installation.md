---
sidebar_position: 1
title: インストール
description: サーバーまたはローカルマシンにBambu Dashboardをインストールする
---

# インストール

## 要件

| 要件 | 最小 | 推奨 |
|------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB以上 |
| ディスク | 500 MB | 2 GB以上 |
| OS | Linux、macOS、Windows | Linux（Ubuntu/Debian） |

:::warning Node.js 22が必要です
Bambu Dashboardは、Node.js 22に組み込まれている`--experimental-sqlite`を使用します。古いバージョンはサポートされていません。
:::

## install.shによるインストール（推奨）

最も簡単な方法は、インタラクティブなインストールスクリプトを使用することです。

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

スクリプトはブラウザでのセットアップをガイドします。systemdサポートを含むターミナルベースのインストールの場合：

```bash
./install.sh --cli
```

## 手動インストール

```bash
# 1. リポジトリをクローン
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. 依存関係をインストール
npm install

# 3. ダッシュボードを起動
npm start
```

`https://localhost:3443`（または`http://localhost:3000`がリダイレクト）でブラウザを開いてください。

:::info 自己署名SSL証明書
初回起動時に、ダッシュボードは自己署名SSL証明書を生成します。ブラウザに警告が表示されますが、これは正常です。独自の証明書をインストールするには、[HTTPS証明書](./setup#https-sertifikater)を参照してください。
:::

## Docker

```bash
docker-compose up -d
```

詳細な設定については[Dockerセットアップ](../advanced/docker)を参照してください。

## systemdサービス

ダッシュボードをバックグラウンドサービスとして実行するには：

```bash
./install.sh --cli
# systemdサービスについて尋ねられたら「はい」を選択
```

または手動で：

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## 更新

Bambu DashboardにはGitHub Releasesを通じた組み込みの自動更新機能があります。**設定 → 更新**からダッシュボード上で更新できます。または手動で：

```bash
git pull
npm install
npm start
```

## アンインストール

```bash
./uninstall.sh
```

スクリプトはサービス、設定、データを削除します（何を削除するかを選択できます）。
