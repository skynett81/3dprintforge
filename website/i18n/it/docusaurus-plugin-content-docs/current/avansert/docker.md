---
sidebar_position: 3
title: Configurazione Docker
description: Esegui Bambu Dashboard con Docker e docker-compose
---

# Configurazione Docker

Bambu Dashboard include un `Dockerfile` e `docker-compose.yml` per una containerizzazione semplice.

## Avvio Rapido

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

Apri `https://localhost:3443` nel browser.

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
      - "9001-9010:9001-9010"   # Flussi videocamera
    volumes:
      - ./data:/app/data         # Database e configurazione
      - ./certs:/app/certs       # Certificati SSL (opzionale)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Consigliato per la connessione MQTT
```

:::warning network_mode: host
`network_mode: host` è consigliato affinché il container possa raggiungere la stampante sulla rete locale tramite MQTT. Senza questo, la connessione MQTT potrebbe fallire a seconda della configurazione di rete.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Installa ffmpeg per lo streaming videocamera
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Volumi

| Percorso host | Percorso container | Contenuto |
|-----------|---------------|---------|
| `./data` | `/app/data` | Database SQLite, configurazione |
| `./certs` | `/app/certs` | Certificati SSL (opzionale) |

:::tip Dati persistenti
Monta sempre il volume `./data`. Senza di esso, tutti i dati andranno persi al riavvio del container.
:::

## Variabili d'Ambiente

| Variabile | Predefinito | Descrizione |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Ambiente |
| `PORT` | `3000` | Porta HTTP |
| `HTTPS_PORT` | `3443` | Porta HTTPS |
| `AUTH_SECRET` | (auto) | Segreto JWT — impostalo esplicitamente in produzione |
| `LOG_LEVEL` | `info` | Livello di log (debug, info, warn, error) |

## Certificati SSL in Docker

### Auto-generato (predefinito)
Nessuna configurazione necessaria. Il certificato viene generato automaticamente e salvato in `./data/certs/`.

### Certificato personalizzato
```yaml
volumes:
  - ./mio-cert.pem:/app/certs/cert.pem:ro
  - ./mia-chiave.pem:/app/certs/key.pem:ro
```

## Gestione

```bash
# Avvia
docker-compose up -d

# Ferma
docker-compose down

# Log
docker-compose logs -f

# Aggiorna a nuova versione
docker-compose pull
docker-compose up -d --build

# Backup database
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Stato di Salute

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

Il container riporta `healthy` quando il server è attivo e risponde su `/api/health`.
