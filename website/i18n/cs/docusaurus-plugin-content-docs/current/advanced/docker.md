---
sidebar_position: 3
title: Nastavení Docker
description: Spusťte 3DPrintForge s Docker a docker-compose
---

# Nastavení Docker

3DPrintForge obsahuje `Dockerfile` a `docker-compose.yml` pro snadnou kontejnerizaci.

## Rychlý start

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

Otevřete `https://localhost:3443` v prohlížeči.

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
      - "9001-9010:9001-9010"   # Streamy kamer
    volumes:
      - ./data:/app/data         # Databáze a konfigurace
      - ./certs:/app/certs       # SSL certifikáty (volitelné)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Doporučeno pro připojení MQTT
```

:::warning network_mode: host
`network_mode: host` je doporučen, aby kontejner mohl dosáhnout tiskárny v lokální síti přes MQTT. Bez toho může připojení MQTT selhat v závislosti na konfiguraci sítě.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Instalace ffmpeg pro streamování kamer
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Svazky

| Hostitelská cesta | Cesta v kontejneru | Obsah |
|-----------|---------------|---------|
| `./data` | `/app/data` | Databáze SQLite, konfigurace |
| `./certs` | `/app/certs` | SSL certifikáty (volitelné) |

:::tip Trvalá data
Vždy připojte svazek `./data`. Bez něj budou všechna data ztracena při restartu kontejneru.
:::

## Proměnné prostředí

| Proměnná | Výchozí | Popis |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Prostředí |
| `PORT` | `3000` | HTTP port |
| `HTTPS_PORT` | `3443` | HTTPS port |
| `AUTH_SECRET` | (auto) | Tajný klíč JWT — nastavte explicitně v produkci |
| `LOG_LEVEL` | `info` | Úroveň protokolování (debug, info, warn, error) |

## SSL certifikáty v Docker

### Samogenerovaný (výchozí)
Není potřeba žádná konfigurace. Certifikát se automaticky generuje a ukládá do `./data/certs/`.

### Vlastní certifikát
```yaml
volumes:
  - ./muj-cert.pem:/app/certs/cert.pem:ro
  - ./muj-klic.pem:/app/certs/key.pem:ro
```

## Správa

```bash
# Spustit
docker-compose up -d

# Zastavit
docker-compose down

# Protokoly
docker-compose logs -f

# Aktualizovat na novou verzi
docker-compose pull
docker-compose up -d --build

# Záloha databáze
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Stav zdraví

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

Kontejner hlásí `healthy`, když server běží a odpovídá na `/api/health`.
