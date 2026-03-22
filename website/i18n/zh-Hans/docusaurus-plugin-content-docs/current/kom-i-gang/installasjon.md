---
sidebar_position: 1
title: 安装
description: 在服务器或本地计算机上安装 Bambu Dashboard
---

# 安装

## 系统要求

| 要求 | 最低配置 | 推荐配置 |
|------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| 内存 | 512 MB | 1 GB+ |
| 磁盘空间 | 500 MB | 2 GB+ |
| 操作系统 | Linux、macOS、Windows | Linux（Ubuntu/Debian） |

:::warning 必须使用 Node.js 22
Bambu Dashboard 使用 `--experimental-sqlite`，该功能内置于 Node.js 22。不支持旧版本。
:::

## 使用 install.sh 安装（推荐）

最简单的方式是使用交互式安装脚本：

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

脚本将引导您在浏览器中完成配置。如需基于终端的安装并支持 systemd：

```bash
./install.sh --cli
```

## 手动安装

```bash
# 1. 克隆仓库
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. 安装依赖
npm install

# 3. 启动仪表板
npm start
```

在浏览器中打开 `https://localhost:3443`（或 `http://localhost:3000` 会自动跳转）。

:::info 自签名 SSL 证书
首次启动时，仪表板会自动生成自签名 SSL 证书。浏览器会显示警告——这是正常现象。请参阅[HTTPS 证书](./oppsett#https-sertifikater)了解如何安装自定义证书。
:::

## Docker

```bash
docker-compose up -d
```

完整配置请参阅 [Docker 部署](../avansert/docker)。

## Systemd 服务

将仪表板作为后台服务运行：

```bash
./install.sh --cli
# 询问是否设置 systemd 服务时选择"是"
```

或手动设置：

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## 更新

Bambu Dashboard 内置通过 GitHub Releases 自动更新的功能。您可以在仪表板的**设置 → 更新**中更新，或手动更新：

```bash
git pull
npm install
npm start
```

## 卸载

```bash
./uninstall.sh
```

脚本将移除服务、配置和数据（您可以选择保留哪些内容）。
