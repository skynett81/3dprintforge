---
sidebar_position: 3
title: Konfiguracja Docker
description: Uruchom 3DPrintForge z Docker i docker-compose
---

# Konfiguracja Docker

3DPrintForge zawiera `Dockerfile` i `docker-compose.yml` dla łatwej konteneryzacji.

## Szybki start

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

Otwórz `https://localhost:3443` w przeglądarce.

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
      - "9001-9010:9001-9010"   # Strumienie kamery
    volumes:
      - ./data:/app/data         # Baza danych i konfiguracja
      - ./certs:/app/certs       # Certyfikaty SSL (opcjonalne)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Zalecane dla połączenia MQTT
```

:::warning network_mode: host
`network_mode: host` jest zalecany, aby kontener mógł dotrzeć do drukarki w sieci lokalnej przez MQTT. Bez tego połączenie MQTT może zawodzić w zależności od konfiguracji sieci.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Zainstaluj ffmpeg dla strumieniowania kamery
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Wolumeny

| Ścieżka hosta | Ścieżka kontenera | Zawartość |
|-----------|---------------|---------|
| `./data` | `/app/data` | Baza danych SQLite, konfiguracja |
| `./certs` | `/app/certs` | Certyfikaty SSL (opcjonalne) |

:::tip Trwałe dane
Zawsze montuj wolumin `./data`. Bez tego wszystkie dane zostaną utracone po restarcie kontenera.
:::

## Zmienne środowiskowe

| Zmienna | Domyślna | Opis |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Środowisko |
| `PORT` | `3000` | Port HTTP |
| `HTTPS_PORT` | `3443` | Port HTTPS |
| `AUTH_SECRET` | (auto) | Sekret JWT — ustaw jawnie w produkcji |
| `LOG_LEVEL` | `info` | Poziom dziennika (debug, info, warn, error) |

## Certyfikaty SSL w Docker

### Generowany automatycznie (domyślnie)
Nie jest wymagana żadna konfiguracja. Certyfikat jest generowany automatycznie i przechowywany w `./data/certs/`.

### Własny certyfikat
```yaml
volumes:
  - ./moj-cert.pem:/app/certs/cert.pem:ro
  - ./moj-klucz.pem:/app/certs/key.pem:ro
```

## Administracja

```bash
# Uruchom
docker-compose up -d

# Zatrzymaj
docker-compose down

# Dziennik
docker-compose logs -f

# Zaktualizuj do nowej wersji
docker-compose pull
docker-compose up -d --build

# Kopia zapasowa bazy danych
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Status kondycji

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

Kontener zgłasza `healthy`, gdy serwer jest uruchomiony i odpowiada na `/api/health`.
