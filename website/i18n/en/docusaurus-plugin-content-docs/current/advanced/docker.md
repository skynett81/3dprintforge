---
sidebar_position: 3
title: Docker Setup
description: Run 3DPrintForge with Docker and docker-compose
---

# Docker Setup

3DPrintForge includes a `Dockerfile` and `docker-compose.yml` for easy containerization.

## Quick start

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

Open `https://localhost:3443` in the browser.

## docker-compose.yml

```yaml
services:
  3dprintforge:
    build: .
    container_name: 3dprintforge
    network_mode: host
    restart: unless-stopped
    volumes:
      - ./config.json:/app/config.json
      - ./data:/app/data
      - ./certs:/app/certs
    environment:
      - NODE_ENV=production
```

:::warning network_mode: host
`network_mode: host` is recommended so the container can reach the printer on the local network via MQTT. Without this, the MQTT connection may fail depending on the network configuration.
:::

## Dockerfile

```dockerfile
FROM node:22-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p data data/uploads data/library data/model-cache data/history-models data/toolpath-cache certs

EXPOSE 3000 3443 9001-9010

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok&&r.status!==301)throw new Error();process.exit(0)}).catch(()=>process.exit(1))"

CMD ["node", "server/index.js"]
```

## Volumes

| Host path | Container path | Contents |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite database, configuration |
| `./certs` | `/app/certs` | SSL certificates (optional) |

:::tip Persistent data
Always mount the `./data` volume. Without this, all data will be lost when the container restarts.
:::

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment |
| `PORT` | `3000` | HTTP port |
| `HTTPS_PORT` | `3443` | HTTPS port |
| `AUTH_SECRET` | (auto) | JWT secret — set explicitly in production |
| `LOG_LEVEL` | `info` | Log level (debug, info, warn, error) |

## SSL certificates in Docker

### Self-generated (default)
No configuration needed. The certificate is generated automatically and stored in `./data/certs/`.

### Custom certificate
```yaml
volumes:
  - ./my-cert.pem:/app/certs/cert.pem:ro
  - ./my-key.pem:/app/certs/key.pem:ro
```

## Administration

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Update to new version
docker-compose pull
docker-compose up -d --build

# Backup database
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Health status

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

The container reports `healthy` when the server is up and responding to `/api/health`.
