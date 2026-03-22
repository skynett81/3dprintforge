---
sidebar_position: 3
title: Docker-beállítás
description: Futtasd a Bambu Dashboardot Docker és docker-compose segítségével
---

# Docker-beállítás

A Bambu Dashboard tartalmaz egy `Dockerfile`-t és `docker-compose.yml`-t az egyszerű konténerizációhoz.

## Gyors kezdés

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

Nyisd meg a `https://localhost:3443` címet a böngészőben.

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
      - "9001-9010:9001-9010"   # Kamerafolyamok
    volumes:
      - ./data:/app/data         # Adatbázis és konfiguráció
      - ./certs:/app/certs       # SSL tanúsítványok (opcionális)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Ajánlott az MQTT csatlakozáshoz
```

:::warning network_mode: host
A `network_mode: host` ajánlott, hogy a konténer elérje a nyomtatót a helyi hálózaton MQTT-n keresztül. Enélkül az MQTT-csatlakozás meghiúsulhat a hálózati konfigurációtól függően.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# ffmpeg telepítése kamerastreaming-hez
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Kötetek

| Gazdaelérési út | Konténer elérési út | Tartalom |
|-----------------|---------------------|----------|
| `./data` | `/app/data` | SQLite adatbázis, konfiguráció |
| `./certs` | `/app/certs` | SSL tanúsítványok (opcionális) |

:::tip Állandó adatok
Mindig csatold a `./data` kötetet. Enélkül minden adat elvész a konténer újraindításakor.
:::

## Környezeti változók

| Változó | Alapértelmezett | Leírás |
|---------|-----------------|--------|
| `NODE_ENV` | `production` | Környezet |
| `PORT` | `3000` | HTTP port |
| `HTTPS_PORT` | `3443` | HTTPS port |
| `AUTH_SECRET` | (auto) | JWT titkos kulcs — állítsd be explicit produkciós környezetben |
| `LOG_LEVEL` | `info` | Naplószint (debug, info, warn, error) |

## SSL tanúsítványok Dockerben

### Automatikusan generált (alapértelmezett)
Nincs szükség konfigurációra. A tanúsítvány automatikusan generálódik és a `./data/certs/` mappában tárolódik.

### Saját tanúsítvány
```yaml
volumes:
  - ./en-cert.pem:/app/certs/cert.pem:ro
  - ./en-kulcs.pem:/app/certs/key.pem:ro
```

## Kezelés

```bash
# Indítás
docker-compose up -d

# Leállítás
docker-compose down

# Napló
docker-compose logs -f

# Frissítés új verzióra
docker-compose pull
docker-compose up -d --build

# Adatbázis mentése
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Állapotellenőrzés

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

A konténer `healthy` állapotot jelent, amikor a szerver fut és válaszol a `/api/health` végponton.
