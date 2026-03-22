---
sidebar_position: 3
title: Docker Kurulumu
description: Bambu Dashboard'u Docker ve docker-compose ile çalıştırın
---

# Docker Kurulumu

Bambu Dashboard, kolay konteynerleştirme için bir `Dockerfile` ve `docker-compose.yml` içerir.

## Hızlı Başlangıç

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

Tarayıcıda `https://localhost:3443`'ü açın.

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
      - "9001-9010:9001-9010"   # Kamera akışları
    volumes:
      - ./data:/app/data         # Veritabanı ve yapılandırma
      - ./certs:/app/certs       # SSL sertifikaları (isteğe bağlı)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # MQTT bağlantısı için önerilen
```

:::warning network_mode: host
Konteynerin MQTT aracılığıyla yerel ağdaki yazıcıya erişebilmesi için `network_mode: host` önerilir. Bu olmadan ağ yapılandırmasına bağlı olarak MQTT bağlantısı başarısız olabilir.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Kamera akışı için ffmpeg yükle
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Birimler

| Ana Bilgisayar Yolu | Konteyner Yolu | İçerik |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite veritabanı, yapılandırma |
| `./certs` | `/app/certs` | SSL sertifikaları (isteğe bağlı) |

:::tip Kalıcı Veriler
Her zaman `./data` birimini bağlayın. Bu olmadan konteyner yeniden başladığında tüm veriler kaybolur.
:::

## Ortam Değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Ortam |
| `PORT` | `3000` | HTTP portu |
| `HTTPS_PORT` | `3443` | HTTPS portu |
| `AUTH_SECRET` | (otomatik) | JWT gizli anahtarı — üretimde açıkça ayarlayın |
| `LOG_LEVEL` | `info` | Günlük seviyesi (debug, info, warn, error) |

## Docker'da SSL Sertifikaları

### Kendinden Oluşturulan (varsayılan)
Yapılandırma gerekmez. Sertifika otomatik olarak oluşturulur ve `./data/certs/` içinde saklanır.

### Kendi Sertifikanız
```yaml
volumes:
  - ./benim-certim.pem:/app/certs/cert.pem:ro
  - ./benim-anahtarim.pem:/app/certs/key.pem:ro
```

## Yönetim

```bash
# Başlat
docker-compose up -d

# Durdur
docker-compose down

# Günlük
docker-compose logs -f

# Yeni sürüme güncelle
docker-compose pull
docker-compose up -d --build

# Veritabanını yedekle
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Sağlık Durumu

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

Sunucu ayakta ve `/api/health`'e yanıt verirken konteyner `healthy` olarak raporlar.
