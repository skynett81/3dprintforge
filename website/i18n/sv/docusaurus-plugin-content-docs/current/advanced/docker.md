---
sidebar_position: 3
title: Docker-installation
description: Kör Bambu Dashboard med Docker och docker-compose
---

# Docker-installation

Bambu Dashboard inkluderar en `Dockerfile` och `docker-compose.yml` för enkel containerisering.

## Snabbstart

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

Öppna `https://localhost:3443` i webbläsaren.

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
      - "9001-9010:9001-9010"   # Kameraströmmar
    volumes:
      - ./data:/app/data         # Databas och konfiguration
      - ./certs:/app/certs       # SSL-certifikat (valfritt)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Rekommenderat för MQTT-anslutning
```

:::warning network_mode: host
`network_mode: host` rekommenderas för att containern ska kunna nå skrivaren på det lokala nätverket via MQTT. Utan detta kan MQTT-anslutningen misslyckas beroende på nätverkskonfigurationen.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Installera ffmpeg för kameraströmning
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Volymer

| Värdsökväg | Containersökväg | Innehåll |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite-databas, konfiguration |
| `./certs` | `/app/certs` | SSL-certifikat (valfritt) |

:::tip Persistent data
Montera alltid `./data`-volymen. Utan detta förloras all data när containern startas om.
:::

## Miljövariabler

| Variabel | Standard | Beskrivning |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Miljö |
| `PORT` | `3000` | HTTP-port |
| `HTTPS_PORT` | `3443` | HTTPS-port |
| `AUTH_SECRET` | (auto) | JWT-hemlighet — ange explicit i produktion |
| `LOG_LEVEL` | `info` | Loggnivå (debug, info, warn, error) |

## SSL-certifikat i Docker

### Självgenererat (standard)
Ingen konfiguration behövs. Certifikatet genereras automatiskt och lagras i `./data/certs/`.

### Eget certifikat
```yaml
volumes:
  - ./mitt-cert.pem:/app/certs/cert.pem:ro
  - ./min-nyckel.pem:/app/certs/key.pem:ro
```

## Administration

```bash
# Starta
docker-compose up -d

# Stoppa
docker-compose down

# Logg
docker-compose logs -f

# Uppdatera till ny version
docker-compose pull
docker-compose up -d --build

# Säkerhetskopiera databas
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Hälsostatus

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

Containern rapporterar `healthy` när servern är uppe och svarar på `/api/health`.
