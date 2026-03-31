---
sidebar_position: 3
title: Configuración de Docker
description: Ejecuta 3DPrintForge con Docker y docker-compose
---

# Configuración de Docker

3DPrintForge incluye un `Dockerfile` y `docker-compose.yml` para una contenedorización sencilla.

## Inicio rápido

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
docker-compose up -d
```

Abre `https://localhost:3443` en el navegador.

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
      - "9001-9010:9001-9010"   # Transmisiones de cámara
    volumes:
      - ./data:/app/data         # Base de datos y configuración
      - ./certs:/app/certs       # Certificados SSL (opcional)
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HTTPS_PORT=3443
    network_mode: host           # Recomendado para la conexión MQTT
```

:::warning network_mode: host
`network_mode: host` es recomendado para que el contenedor pueda alcanzar la impresora en la red local mediante MQTT. Sin esto, la conexión MQTT puede fallar dependiendo de la configuración de red.
:::

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Instalar ffmpeg para transmisión de cámara
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3443

CMD ["node", "--experimental-sqlite", "server/index.js"]
```

## Volúmenes

| Ruta del host | Ruta del contenedor | Contenido |
|-----------|---------------|---------|
| `./data` | `/app/data` | Base de datos SQLite, configuración |
| `./certs` | `/app/certs` | Certificados SSL (opcional) |

:::tip Datos persistentes
Monta siempre el volumen `./data`. Sin esto, todos los datos se perderán cuando el contenedor se reinicie.
:::

## Variables de entorno

| Variable | Predeterminado | Descripción |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Entorno |
| `PORT` | `3000` | Puerto HTTP |
| `HTTPS_PORT` | `3443` | Puerto HTTPS |
| `AUTH_SECRET` | (auto) | Secreto JWT — establece explícitamente en producción |
| `LOG_LEVEL` | `info` | Nivel de registro (debug, info, warn, error) |

## Certificados SSL en Docker

### Autogenerado (predeterminado)
No se necesita configuración. El certificado se genera automáticamente y se guarda en `./data/certs/`.

### Certificado propio
```yaml
volumes:
  - ./mi-cert.pem:/app/certs/cert.pem:ro
  - ./mi-clave.pem:/app/certs/key.pem:ro
```

## Administración

```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Registros
docker-compose logs -f

# Actualizar a nueva versión
docker-compose pull
docker-compose up -d --build

# Copia de seguridad de la base de datos
docker cp 3dprintforge:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Estado de salud

```bash
docker inspect --format='{{.State.Health.Status}}' 3dprintforge
```

El contenedor reporta `healthy` cuando el servidor está en funcionamiento y responde a `/api/health`.
