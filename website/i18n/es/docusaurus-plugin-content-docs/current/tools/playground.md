---
sidebar_position: 4
title: Área de pruebas de API
description: Prueba los 177 endpoints de la API directamente en el navegador con documentación OpenAPI integrada y autenticación
---

# Área de pruebas de API

El área de pruebas de API te permite explorar y probar los 177 endpoints de la API de 3DPrintForge directamente en el navegador — sin escribir código.

Ir a: **https://localhost:3443/api/docs**

## ¿Qué es el área de pruebas de API?

El área de pruebas es una versión interactiva de la documentación OpenAPI (Swagger UI) completamente integrada con el panel. Ya estás autenticado cuando has iniciado sesión, por lo que puedes probar los endpoints directamente.

## Navegar por la documentación

Los endpoints están organizados en categorías:

| Categoría | Número de endpoints | Descripción |
|---|---|---|
| Impresoras | 24 | Obtener estado, controlar, configurar |
| Impresiones / Historial | 18 | Obtener, buscar, exportar historial |
| Filamento | 22 | Inventario, bobinas, perfiles |
| Cola | 12 | Gestionar cola de impresión |
| Estadísticas | 15 | Estadísticas agregadas y exportación |
| Alertas | 8 | Configurar y probar canales de alerta |
| Usuarios | 10 | Usuarios, roles, claves API |
| Configuración | 14 | Leer y modificar configuración |
| Mantenimiento | 12 | Tareas de mantenimiento y registro |
| Integraciones | 18 | HA, Tibber, webhooks, etc. |
| Biblioteca de archivos | 14 | Subir, analizar, gestionar |
| Sistema | 10 | Copia de seguridad, salud, registro |

Haz clic en una categoría para expandirla y ver todos los endpoints.

## Probar un endpoint

1. Haz clic en un endpoint (p.ej. `GET /api/printers`)
2. Haz clic en **Try it out** (pruébalo)
3. Completa los parámetros opcionales (filtro, paginación, ID de impresora, etc.)
4. Haz clic en **Execute**
5. Ve la respuesta a continuación: código de estado HTTP, encabezados y cuerpo JSON

### Ejemplo: Obtener todas las impresoras

```
GET /api/printers
```
Devuelve una lista de todas las impresoras registradas con el estado en tiempo real.

### Ejemplo: Enviar comando a la impresora

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Entorno de producción
El área de pruebas está conectada al sistema real. Los comandos se envían a impresoras reales. Ten cuidado con las operaciones destructivas como `DELETE` y `POST /command`.
:::

## Autenticación

### Autenticación de sesión (usuario con sesión iniciada)
Cuando has iniciado sesión en el panel, el área de pruebas ya está autenticada mediante la cookie de sesión. No se necesita configuración adicional.

### Autenticación con clave API

Para acceso externo:

1. Haz clic en **Authorize** (ícono de candado en la parte superior del área de pruebas)
2. Completa tu clave API en el campo **ApiKeyAuth**: `Bearer TU_CLAVE`
3. Haz clic en **Authorize**

Genera claves API en **Configuración → Claves API** (ver [Autenticación](../system/auth)).

## Límite de solicitudes

La API tiene un límite de **200 solicitudes por minuto** por usuario/clave. El área de pruebas muestra las solicitudes restantes en el encabezado de respuesta `X-RateLimit-Remaining`.

:::info Especificación OpenAPI
Descarga la especificación OpenAPI completa como YAML o JSON:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Usa la especificación para generar bibliotecas de cliente en Python, TypeScript, Go, etc.
:::

## Prueba de webhooks

Prueba las integraciones de webhooks directamente:

1. Ve a `POST /api/webhooks/test`
2. Selecciona el tipo de evento en el menú desplegable
3. El sistema envía un evento de prueba a la URL de webhook configurada
4. Ve la solicitud/respuesta en el área de pruebas
