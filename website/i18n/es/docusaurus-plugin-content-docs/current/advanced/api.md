---
sidebar_position: 1
title: Referencia de API
description: REST API con 284+ endpoints, autenticación y límite de solicitudes
---

# Referencia de API

3DPrintForge expone una REST API completa con 284+ endpoints. La documentación de la API está disponible directamente en el panel.

## Documentación interactiva

Abre la documentación OpenAPI en el navegador:

```
https://tu-servidor:3443/api/docs
```

Aquí encontrarás todos los endpoints, parámetros, esquemas de solicitud/respuesta y la posibilidad de probar la API directamente.

## Autenticación

La API usa autenticación con **Bearer token** (JWT):

```bash
# Iniciar sesión y obtener token
curl -X POST https://tu-servidor:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "tu-contraseña"}'

# Respuesta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Usa el token en todas las llamadas siguientes:

```bash
curl https://tu-servidor:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Límite de solicitudes

La API tiene un límite de solicitudes para proteger el servidor:

| Límite | Valor |
|--------|-------|
| Solicitudes por minuto | 200 |
| Burst (máx. por segundo) | 20 |
| Respuesta al exceder | `429 Too Many Requests` |

El encabezado `Retry-After` en la respuesta indica cuántos segundos hasta que se permite la próxima solicitud.

## Resumen de endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión, obtener JWT |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/me` | Obtener usuario en sesión |

### Impresoras
| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| GET | `/api/printers` | Listar todas las impresoras |
| POST | `/api/printers` | Agregar impresora |
| GET | `/api/printers/:id` | Obtener impresora |
| PUT | `/api/printers/:id` | Actualizar impresora |
| DELETE | `/api/printers/:id` | Eliminar impresora |
| GET | `/api/printers/:id/status` | Estado en tiempo real |
| POST | `/api/printers/:id/command` | Enviar comando |

### Filamento
| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| GET | `/api/filaments` | Listar todas las bobinas |
| POST | `/api/filaments` | Agregar bobina |
| PUT | `/api/filaments/:id` | Actualizar bobina |
| DELETE | `/api/filaments/:id` | Eliminar bobina |
| GET | `/api/filaments/stats` | Estadísticas de consumo |

### Historial de impresiones
| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| GET | `/api/history` | Listar historial (paginado) |
| GET | `/api/history/:id` | Obtener impresión individual |
| GET | `/api/history/export` | Exportar CSV |
| GET | `/api/history/stats` | Estadísticas |

### Cola de impresión
| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| GET | `/api/queue` | Obtener la cola |
| POST | `/api/queue` | Agregar trabajo |
| PUT | `/api/queue/:id` | Actualizar trabajo |
| DELETE | `/api/queue/:id` | Eliminar trabajo |
| POST | `/api/queue/dispatch` | Forzar despacho |

## API WebSocket

Además de REST, existe una API WebSocket para datos en tiempo real:

```javascript
const ws = new WebSocket('wss://tu-servidor:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Tipos de mensajes (entrantes)
- `printer.status` — estado de impresora actualizado
- `print.progress` — actualización del porcentaje de progreso
- `ams.update` — cambio de estado del AMS
- `notification` — mensaje de alerta

## Códigos de error

| Código | Significa |
|------|-------|
| 200 | OK |
| 201 | Creado |
| 400 | Solicitud inválida |
| 401 | No autenticado |
| 403 | No autorizado |
| 404 | No encontrado |
| 429 | Demasiadas solicitudes |
| 500 | Error del servidor |
