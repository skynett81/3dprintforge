---
sidebar_position: 3
title: Docker-oppsett
description: Kjør 3DPrintForge med Docker og docker-compose
---

# Docker-oppsett

3DPrintForge inkluderer en `Dockerfile` og `docker-compose.yml` for enkel containerisering.

## Hurtigstart

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

Åpne `https://localhost:3443` i nettleseren.

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
      - "9001-9010:9001-9010"   # Kamerastrømmer
    volumes:
      - ./data:/app/data         # Database og konfigurasjon
      - ./certs:/app/certs       # SSL-sertifikater (valgfritt)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Anbefalt for MQTT-tilkobling
```

:::warning network_mode: host
`network_mode: host` er anbefalt for at containeren skal nå printeren på lokalt nettverk via MQTT. Uten dette kan MQTT-tilkoblingen feile avhengig av nettverkskonfigurasjonen.
:::

## Dockerfile

```dockerfile
FROM node:22-slim

WORKDIR /app

# Installer ffmpeg og openssl for kamerastrømming og SSL
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server/index.js"]
```

## Volumer

| Verts-sti | Container-sti | Innhold |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite-database, konfigurasjon |
| `./certs` | `/app/certs` | SSL-sertifikater (valgfritt) |

:::tip Persistent data
Monter alltid `./data`-volumet. Uten dette vil all data gå tapt når containeren restarter.
:::

## Miljøvariabler

| Variabel | Standard | Beskrivelse |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Miljø |
| `PORT` | `3000` | HTTP-port |
| `HTTPS_PORT` | `3443` | HTTPS-port |
| `AUTH_SECRET` | (auto) | JWT-hemmelighet — sett eksplisitt i produksjon |
| `LOG_LEVEL` | `info` | Loggnivå (debug, info, warn, error) |

## SSL-sertifikater i Docker

### Selvgenerert (standard)
Ingen konfigurasjon nødvendig. Sertifikatet genereres automatisk og lagres i `./data/certs/`.

### Eget sertifikat
```yaml
volumes:
  - ./mitt-cert.pem:/app/certs/cert.pem:ro
  - ./min-nøkkel.pem:/app/certs/key.pem:ro
```

## Administrasjon

```bash
# Start
docker-compose up -d

# Stopp
docker-compose down

# Logg
docker-compose logs -f

# Oppdater til ny versjon
docker-compose pull
docker-compose up -d --build

# Backup database
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Helsestatus

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

Containeren rapporterer `healthy` når serveren er oppe og svarer på `/api/health`.
