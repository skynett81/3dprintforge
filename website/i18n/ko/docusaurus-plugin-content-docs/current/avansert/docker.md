---
sidebar_position: 3
title: Docker 설정
description: Docker 및 docker-compose로 Bambu Dashboard 실행
---

# Docker 설정

Bambu Dashboard에는 간편한 컨테이너화를 위한 `Dockerfile`과 `docker-compose.yml`이 포함되어 있습니다.

## 빠른 시작

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

브라우저에서 `https://localhost:3443`을 엽니다.

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
      - "9001-9010:9001-9010"   # 카메라 스트림
    volumes:
      - ./data:/app/data         # 데이터베이스 및 설정
      - ./certs:/app/certs       # SSL 인증서(선택 사항)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # MQTT 연결에 권장
```

:::warning network_mode: host
컨테이너가 MQTT를 통해 로컬 네트워크의 프린터에 도달하려면 `network_mode: host`가 권장됩니다. 이 설정 없이는 네트워크 설정에 따라 MQTT 연결이 실패할 수 있습니다.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# 카메라 스트리밍을 위한 ffmpeg 설치
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## 볼륨

| 호스트 경로 | 컨테이너 경로 | 내용 |
|-----------|---------------|---------|
| `./data` | `/app/data` | SQLite 데이터베이스, 설정 |
| `./certs` | `/app/certs` | SSL 인증서(선택 사항) |

:::tip 영구 데이터
항상 `./data` 볼륨을 마운트하세요. 이 설정 없이는 컨테이너가 재시작될 때 모든 데이터가 손실됩니다.
:::

## 환경 변수

| 변수 | 기본값 | 설명 |
|----------|---------|-------------|
| `NODE_ENV` | `production` | 환경 |
| `PORT` | `3000` | HTTP 포트 |
| `HTTPS_PORT` | `3443` | HTTPS 포트 |
| `AUTH_SECRET` | (자동) | JWT 비밀 — 프로덕션에서 명시적으로 설정 |
| `LOG_LEVEL` | `info` | 로그 레벨(debug, info, warn, error) |

## Docker에서의 SSL 인증서

### 자동 생성(기본값)
설정이 필요하지 않습니다. 인증서가 자동으로 생성되어 `./data/certs/`에 저장됩니다.

### 직접 제공 인증서
```yaml
volumes:
  - ./my-cert.pem:/app/certs/cert.pem:ro
  - ./my-key.pem:/app/certs/key.pem:ro
```

## 관리

```bash
# 시작
docker-compose up -d

# 중지
docker-compose down

# 로그
docker-compose logs -f

# 새 버전으로 업데이트
docker-compose pull
docker-compose up -d --build

# 데이터베이스 백업
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## 상태 확인

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

서버가 실행 중이고 `/api/health`에 응답하면 컨테이너가 `healthy`를 보고합니다.
