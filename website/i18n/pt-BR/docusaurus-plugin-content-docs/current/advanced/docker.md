---
sidebar_position: 3
title: Configuração Docker
description: Execute o Bambu Dashboard com Docker e docker-compose
---

# Configuração Docker

O Bambu Dashboard inclui um `Dockerfile` e `docker-compose.yml` para containerização fácil.

## Início rápido

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
docker-compose up -d
```

Abra `https://localhost:3443` no navegador.

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
      - "9001-9010:9001-9010"   # Streams de câmera
    volumes:
      - ./data:/app/data         # Banco de dados e configuração
      - ./certs:/app/certs       # Certificados SSL (opcional)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Recomendado para conexão MQTT
```

:::warning network_mode: host
`network_mode: host` é recomendado para que o container possa alcançar a impressora na rede local via MQTT. Sem isso, a conexão MQTT pode falhar dependendo da configuração de rede.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Instalar ffmpeg para streaming de câmera
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Volumes

| Caminho do host | Caminho do container | Conteúdo |
|-----------------|---------------------|----------|
| `./data` | `/app/data` | Banco de dados SQLite, configuração |
| `./certs` | `/app/certs` | Certificados SSL (opcional) |

:::tip Dados persistentes
Monte sempre o volume `./data`. Sem isso, todos os dados serão perdidos quando o container reiniciar.
:::

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NODE_ENV` | `production` | Ambiente |
| `PORT` | `3000` | Porta HTTP |
| `HTTPS_PORT` | `3443` | Porta HTTPS |
| `AUTH_SECRET` | (automático) | Segredo JWT — defina explicitamente em produção |
| `LOG_LEVEL` | `info` | Nível de log (debug, info, warn, error) |

## Certificados SSL no Docker

### Autogerado (padrão)
Nenhuma configuração necessária. O certificado é gerado automaticamente e armazenado em `./data/certs/`.

### Certificado próprio
```yaml
volumes:
  - ./meu-cert.pem:/app/certs/cert.pem:ro
  - ./minha-chave.pem:/app/certs/key.pem:ro
```

## Administração

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Log
docker-compose logs -f

# Atualizar para nova versão
docker-compose pull
docker-compose up -d --build

# Backup do banco de dados
docker cp bambu-dashboard:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Status de saúde

```bash
docker inspect --format='{{.State.Health.Status}}' bambu-dashboard
```

O container reporta `healthy` quando o servidor está em funcionamento e respondendo em `/api/health`.
