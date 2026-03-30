---
sidebar_position: 3
title: Docker-налаштування
description: Запустіть Bambu Dashboard за допомогою Docker та docker-compose
---

# Docker-налаштування

Bambu Dashboard включає `Dockerfile` та `docker-compose.yml` для зручної контейнеризації.

## Швидкий старт

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

Відкрийте `https://localhost:3443` у браузері.

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
      - "9001-9010:9001-9010"   # Потоки камери
    volumes:
      - ./data:/app/data         # База даних та конфігурація
      - ./certs:/app/certs       # SSL-сертифікати (необов'язково)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Рекомендовано для MQTT-підключення
```

:::warning network_mode: host
`network_mode: host` рекомендований для того, щоб контейнер міг досягти принтера в локальній мережі через MQTT. Без цього MQTT-підключення може не вдатись залежно від конфігурації мережі.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Встановіть ffmpeg для потокової передачі камери
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Томи

| Шлях на хості | Шлях у контейнері | Вміст |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite-база даних, конфігурація |
| `./certs` | `/app/certs` | SSL-сертифікати (необов'язково) |

:::tip Постійні дані
Завжди монтуйте том `./data`. Без цього всі дані будуть втрачені при перезапуску контейнера.
:::

## Змінні середовища

| Змінна | Стандарт | Опис |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Середовище |
| `PORT` | `3000` | HTTP-порт |
| `HTTPS_PORT` | `3443` | HTTPS-порт |
| `AUTH_SECRET` | (авто) | JWT-секрет — встановіть явно в продакшені |
| `LOG_LEVEL` | `info` | Рівень журналу (debug, info, warn, error) |

## SSL-сертифікати у Docker

### Самогенеровані (стандарт)
Конфігурація не потрібна. Сертифікат генерується автоматично та зберігається в `./data/certs/`.

### Власний сертифікат
```yaml
volumes:
  - ./my-cert.pem:/app/certs/cert.pem:ro
  - ./my-key.pem:/app/certs/key.pem:ro
```

## Адміністрування

```bash
# Запуск
docker-compose up -d

# Зупинка
docker-compose down

# Журнал
docker-compose logs -f

# Оновлення до нової версії
docker-compose pull
docker-compose up -d --build

# Резервне копіювання бази даних
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Стан здоров'я

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

Контейнер повідомляє `healthy`, коли сервер запущений та відповідає на `/api/health`.
