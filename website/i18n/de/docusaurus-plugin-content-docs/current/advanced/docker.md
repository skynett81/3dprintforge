---
sidebar_position: 3
title: Docker-Einrichtung
description: Bambu Dashboard mit Docker und docker-compose ausführen
---

# Docker-Einrichtung

Bambu Dashboard enthält eine `Dockerfile` und `docker-compose.yml` für einfache Containerisierung.

## Schnellstart

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

Öffnen Sie `https://localhost:3443` im Browser.

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
      - "9001-9010:9001-9010"   # Kamerastreams
    volumes:
      - ./data:/app/data         # Datenbank und Konfiguration
      - ./certs:/app/certs       # SSL-Zertifikate (optional)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Empfohlen für MQTT-Verbindung
```

:::warning network_mode: host
`network_mode: host` wird empfohlen, damit der Container den Drucker im lokalen Netzwerk über MQTT erreichen kann. Ohne dies kann die MQTT-Verbindung je nach Netzwerkkonfiguration fehlschlagen.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# ffmpeg für Kamera-Streaming installieren
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Volumes

| Host-Pfad | Container-Pfad | Inhalt |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite-Datenbank, Konfiguration |
| `./certs` | `/app/certs` | SSL-Zertifikate (optional) |

:::tip Persistente Daten
Das `./data`-Volume immer einbinden. Ohne dies gehen alle Daten verloren, wenn der Container neu startet.
:::

## Umgebungsvariablen

| Variable | Standard | Beschreibung |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Umgebung |
| `PORT` | `3000` | HTTP-Port |
| `HTTPS_PORT` | `3443` | HTTPS-Port |
| `AUTH_SECRET` | (auto) | JWT-Geheimnis — in der Produktion explizit setzen |
| `LOG_LEVEL` | `info` | Protokollstufe (debug, info, warn, error) |

## SSL-Zertifikate in Docker

### Selbst generiert (Standard)
Keine Konfiguration erforderlich. Das Zertifikat wird automatisch generiert und in `./data/certs/` gespeichert.

### Eigenes Zertifikat
```yaml
volumes:
  - ./mein-cert.pem:/app/certs/cert.pem:ro
  - ./mein-schluessel.pem:/app/certs/key.pem:ro
```

## Verwaltung

```bash
# Starten
docker-compose up -d

# Stoppen
docker-compose down

# Protokoll
docker-compose logs -f

# Auf neue Version aktualisieren
docker-compose pull
docker-compose up -d --build

# Datenbank sichern
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Gesundheitsstatus

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

Der Container meldet `healthy`, wenn der Server läuft und auf `/api/health` antwortet.
