---
sidebar_position: 3
title: Configuration Docker
description: Exécutez 3DPrintForge avec Docker et docker-compose
---

# Configuration Docker

3DPrintForge inclut un `Dockerfile` et un `docker-compose.yml` pour une conteneurisation facile.

## Démarrage rapide

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

Ouvrez `https://localhost:3443` dans le navigateur.

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
      - "9001-9010:9001-9010"   # Flux caméra
    volumes:
      - ./data:/app/data         # Base de données et configuration
      - ./certs:/app/certs       # Certificats SSL (facultatif)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Recommandé pour la connexion MQTT
```

:::warning network_mode: host
`network_mode: host` est recommandé pour que le conteneur puisse atteindre l'imprimante sur le réseau local via MQTT. Sans cela, la connexion MQTT peut échouer selon la configuration réseau.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Installer ffmpeg pour le streaming caméra
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Volumes

| Chemin hôte | Chemin conteneur | Contenu |
|-----------|---------------|---------|
| `./data` | `/app/data` | Base de données SQLite, configuration |
| `./certs` | `/app/certs` | Certificats SSL (facultatif) |

:::tip Données persistantes
Montez toujours le volume `./data`. Sans cela, toutes les données seront perdues lors du redémarrage du conteneur.
:::

## Variables d'environnement

| Variable | Par défaut | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environnement |
| `PORT` | `3000` | Port HTTP |
| `HTTPS_PORT` | `3443` | Port HTTPS |
| `AUTH_SECRET` | (auto) | Secret JWT — définissez-le explicitement en production |
| `LOG_LEVEL` | `info` | Niveau de journal (debug, info, warn, error) |

## Certificats SSL dans Docker

### Auto-généré (par défaut)
Aucune configuration nécessaire. Le certificat est généré automatiquement et stocké dans `./data/certs/`.

### Certificat personnalisé
```yaml
volumes:
  - ./mon-cert.pem:/app/certs/cert.pem:ro
  - ./ma-cle.pem:/app/certs/key.pem:ro
```

## Administration

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Journal
docker-compose logs -f

# Mettre à jour vers une nouvelle version
docker-compose pull
docker-compose up -d --build

# Sauvegarde de la base de données
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## État de santé

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

Le conteneur rapporte `healthy` quand le serveur est en ligne et répond sur `/api/health`.
