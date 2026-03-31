---
sidebar_position: 3
title: Docker-installatie
description: 3DPrintForge uitvoeren met Docker en docker-compose
---

# Docker-installatie

3DPrintForge bevat een `Dockerfile` en `docker-compose.yml` voor eenvoudige containerisatie.

## Snelstart

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

Open `https://localhost:3443` in de browser.

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
      - "9001-9010:9001-9010"   # Camerastreams
    volumes:
      - ./data:/app/data         # Database en configuratie
      - ./certs:/app/certs       # SSL-certificaten (optioneel)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Aanbevolen voor MQTT-verbinding
```

:::warning network_mode: host
`network_mode: host` wordt aanbevolen zodat de container de printer op het lokale netwerk kan bereiken via MQTT. Zonder dit kan de MQTT-verbinding mislukken afhankelijk van de netwerkconfiguratie.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# ffmpeg installeren voor camerastreaming
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Volumes

| Hostpad | Containerpad | Inhoud |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite-database, configuratie |
| `./certs` | `/app/certs` | SSL-certificaten (optioneel) |

:::tip Persistente data
Koppel altijd het `./data`-volume. Zonder dit gaan alle data verloren wanneer de container herstart.
:::

## Omgevingsvariabelen

| Variabele | Standaard | Beschrijving |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Omgeving |
| `PORT` | `3000` | HTTP-poort |
| `HTTPS_PORT` | `3443` | HTTPS-poort |
| `AUTH_SECRET` | (auto) | JWT-geheim — stel expliciet in voor productie |
| `LOG_LEVEL` | `info` | Logniveau (debug, info, warn, error) |

## SSL-certificaten in Docker

### Zelfgegenereerd (standaard)
Geen configuratie nodig. Het certificaat wordt automatisch gegenereerd en opgeslagen in `./data/certs/`.

### Eigen certificaat
```yaml
volumes:
  - ./mijn-cert.pem:/app/certs/cert.pem:ro
  - ./mijn-sleutel.pem:/app/certs/key.pem:ro
```

## Beheer

```bash
# Starten
docker-compose up -d

# Stoppen
docker-compose down

# Logs
docker-compose logs -f

# Bijwerken naar nieuwe versie
docker-compose pull
docker-compose up -d --build

# Database back-up
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Gezondheidsstatus

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

De container rapporteert `healthy` wanneer de server actief is en reageert op `/api/health`.
