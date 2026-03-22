---
sidebar_position: 2
title: Arquitectura técnica
description: Resumen de arquitectura de Bambu Dashboard — stack, módulos, base de datos y WebSocket
---

# Arquitectura técnica

## Diagrama del sistema

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

El panel se comunica con la impresora mediante MQTT sobre TLS (puerto 8883) y con la cámara mediante RTSPS (puerto 322). El navegador se conecta al panel mediante HTTPS y WebSocket.

## Stack técnico

| Capa | Tecnología |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 módulos de componentes, sin paso de build, sin frameworks |
| Backend | Node.js 22 con 3 paquetes npm: `mqtt`, `ws`, `basic-ftp` |
| Base de datos | SQLite (integrado en Node.js 22 mediante `--experimental-sqlite`) |
| Cámara | ffmpeg transcode RTSPS a MPEG1, jsmpeg renderiza en el navegador |
| Tiempo real | WebSocket hub envía el estado de la impresora a todos los clientes conectados |
| Protocolo | MQTT sobre TLS (puerto 8883) con el LAN Access Code de la impresora |

## Puertos

| Puerto | Protocolo | Dirección | Descripción |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | Entrante | Panel (redirige a HTTPS) |
| 3443 | HTTPS + WSS | Entrante | Panel seguro (estándar) |
| 9001+ | WS | Entrante | Transmisiones de cámara (una por impresora) |
| 8883 | MQTTS | Saliente | Conexión a la impresora |
| 322 | RTSPS | Saliente | Cámara de la impresora |

## Módulos del servidor (44)

| Módulo | Propósito |
|-------|--------|
| `index.js` | Servidores HTTP/HTTPS, SSL automático, encabezados CSP/HSTS, archivos estáticos, modo demo |
| `config.js` | Carga de configuración, valores predeterminados, anulaciones de env y migraciones |
| `database.js` | Esquema SQLite, 105 migraciones, operaciones CRUD |
| `api-routes.js` | REST API (284+ endpoints) |
| `auth.js` | Autenticación y gestión de sesiones |
| `backup.js` | Copia de seguridad y restauración |
| `printer-manager.js` | Ciclo de vida de la impresora, gestión de conexiones MQTT |
| `mqtt-client.js` | Conexión MQTT a impresoras Bambu |
| `mqtt-commands.js` | Construcción de comandos MQTT (pausar, reanudar, detener, etc.) |
| `websocket-hub.js` | Difusión WebSocket a todos los clientes del navegador |
| `camera-stream.js` | Gestión de procesos ffmpeg para transmisiones de cámara |
| `print-tracker.js` | Seguimiento de trabajos de impresión, transiciones de estado, registro de historial |
| `print-guard.js` | Protección de impresión mediante xcam + monitoreo de sensores |
| `queue-manager.js` | Cola de impresión con despacho multipresora y balanceo de carga |
| `slicer-service.js` | Puente CLI de slicer local, carga de archivos, carga FTPS |
| `telemetry.js` | Procesamiento de datos de telemetría |
| `telemetry-sampler.js` | Muestreo de datos de series temporales |
| `thumbnail-service.js` | Obtención de miniaturas mediante FTPS desde la SD de la impresora |
| `timelapse-service.js` | Grabación y gestión de timelapse |
| `notifications.js` | Sistema de notificaciones de 7 canales (Telegram, Discord, Correo, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | Actualización automática desde GitHub Releases con copia de seguridad |
| `setup-wizard.js` | Asistente de configuración web para el primer uso |
| `ecom-license.js` | Gestión de licencias |
| `failure-detection.js` | Detección y análisis de fallos |
| `bambu-cloud.js` | Integración con la API de Bambu Cloud |
| `bambu-rfid-data.js` | Datos de filamento RFID del AMS |
| `circuit-breaker.js` | Patrón de circuit breaker para estabilidad del servicio |
| `energy-service.js` | Cálculo de energía y precio de electricidad |
| `error-pattern-analyzer.js` | Análisis de patrones de errores HMS |
| `file-parser.js` | Análisis de archivos 3MF/GCode |
| `logger.js` | Logging estructurado |
| `material-recommender.js` | Recomendaciones de materiales |
| `milestone-service.js` | Seguimiento de hitos y logros |
| `plugin-manager.js` | Sistema de plugins para extensiones |
| `power-monitor.js` | Integración de medidor de consumo (Shelly/Tasmota) |
| `price-checker.js` | Obtención de precios de electricidad (Tibber/Nordpool) |
| `printer-discovery.js` | Descubrimiento automático de impresoras en la LAN |
| `remote-nodes.js` | Gestión de múltiples nodos |
| `report-service.js` | Generación de informes |
| `seed-filament-db.js` | Población de la base de datos de filamento |
| `spoolease-data.js` | Integración con SpoolEase |
| `validate.js` | Validación de datos de entrada |
| `wear-prediction.js` | Predicción de desgaste de componentes |

## Componentes de frontend (76)

Todos los componentes son módulos JavaScript vanilla sin paso de build. Se cargan directamente en el navegador mediante `<script type="module">`.

| Componente | Propósito |
|-----------|--------|
| `print-preview.js` | Visor de modelo 3D + revelación de imágenes de MakerWorld |
| `model-viewer.js` | Renderizado 3D WebGL con animación de capas |
| `temperature-gauge.js` | Medidores de anillo SVG animados |
| `sparkline-stats.js` | Paneles de estadísticas estilo Grafana |
| `ams-panel.js` | Visualización de filamento AMS |
| `camera-view.js` | Reproductor de video jsmpeg con pantalla completa |
| `controls-panel.js` | Interfaz de control de la impresora |
| `history-table.js` | Historial de impresiones con búsqueda, filtros, exportación CSV |
| `filament-tracker.js` | Inventario de filamento con favoritos, filtrado por color |
| `queue-panel.js` | Gestión de la cola de impresión |
| `knowledge-panel.js` | Lector y editor de la base de conocimientos |

## Base de datos

La base de datos SQLite está integrada en Node.js 22 y no requiere instalación externa. El esquema se gestiona mediante 105 migraciones en `db/migrations.js`.

Tablas principales:

- `printers` — configuración de la impresora
- `print_history` — todos los trabajos de impresión
- `filaments` — inventario de filamento
- `ams_slots` — vinculación de ranuras AMS
- `queue` — cola de impresión
- `notifications_config` — ajustes de alertas
- `maintenance_log` — registro de mantenimiento

## Seguridad

- HTTPS con certificado generado automáticamente (o el tuyo propio)
- Autenticación basada en JWT
- Encabezados CSP y HSTS
- Límite de solicitudes (200 req/min)
- Sin dependencia de nube externa para las funciones principales
