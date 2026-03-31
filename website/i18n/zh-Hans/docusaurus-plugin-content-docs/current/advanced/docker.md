---
sidebar_position: 3
title: Docker 部署
description: 使用 Docker 和 docker-compose 运行 3DPrintForge
---

# Docker 部署

3DPrintForge 内置 `Dockerfile` 和 `docker-compose.yml`，便于容器化部署。

## 快速开始

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

在浏览器中打开 `https://localhost:3443`。

## docker-compose.yml

```yaml
version: '3.8'

services:
  3dprintforge:
    build: .
    container_name: 3dprintforge
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "3443:3443"
      - "9001-9010:9001-9010"   # 摄像头流
    volumes:
      - ./data:/app/data         # 数据库和配置
      - ./certs:/app/certs       # SSL 证书（可选）
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # 推荐用于 MQTT 连接
```

:::warning network_mode: host
推荐使用 `network_mode: host`，以便容器能够通过 MQTT 访问本地网络上的打印机。如果不使用此模式，根据网络配置，MQTT 连接可能会失败。
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# 安装 ffmpeg 用于摄像头流
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## 卷挂载

| 主机路径 | 容器路径 | 内容 |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite 数据库，配置文件 |
| `./certs` | `/app/certs` | SSL 证书（可选） |

:::tip 持久化数据
请务必挂载 `./data` 卷。否则，容器重启时所有数据将丢失。
:::

## 环境变量

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `NODE_ENV` | `production` | 运行环境 |
| `PORT` | `3000` | HTTP 端口 |
| `HTTPS_PORT` | `3443` | HTTPS 端口 |
| `AUTH_SECRET` | （自动） | JWT 密钥 — 生产环境中请显式设置 |
| `LOG_LEVEL` | `info` | 日志级别（debug、info、warn、error） |

## Docker 中的 SSL 证书

### 自签名（默认）
无需任何配置。证书将自动生成并保存在 `./data/certs/` 中。

### 使用自定义证书
```yaml
volumes:
  - ./my-cert.pem:/app/certs/cert.pem:ro
  - ./my-key.pem:/app/certs/key.pem:ro
```

## 管理命令

```bash
# 启动
docker-compose up -d

# 停止
docker-compose down

# 查看日志
docker-compose logs -f

# 更新到新版本
docker-compose pull
docker-compose up -d --build

# 备份数据库
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## 健康状态

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

当服务器启动并响应 `/api/health` 时，容器将报告 `healthy` 状态。
