---
sidebar_position: 8
title: Registro del servidor
description: Ve el registro del servidor en tiempo real, filtra por nivel y módulo, y diagnostica problemas con Bambu Dashboard
---

# Registro del servidor

El registro del servidor te da información sobre lo que ocurre dentro de Bambu Dashboard — útil para diagnóstico, monitoreo y resolución de problemas.

Ir a: **https://localhost:3443/#logs**

## Vista en tiempo real

El flujo del registro se actualiza en tiempo real mediante WebSocket:

1. Ve a **Sistema → Registro del servidor**
2. Las nuevas líneas del registro aparecen automáticamente en la parte inferior
3. Haz clic en **Fijar al final** para desplazarte siempre al último registro
4. Haz clic en **Pausar** para detener el desplazamiento automático y leer las líneas existentes

La vista predeterminada muestra las últimas 500 líneas del registro.

## Niveles de registro

Cada línea del registro tiene un nivel:

| Nivel | Color | Descripción |
|---|---|---|
| **ERROR** | Rojo | Errores que afectan la funcionalidad |
| **WARN** | Naranja | Advertencias — algo puede salir mal |
| **INFO** | Azul | Información de funcionamiento normal |
| **DEBUG** | Gris | Información detallada para desarrollo |

:::info Configuración del nivel de registro
Cambia el nivel de registro en **Configuración → Sistema → Nivel de registro**. Para operación normal, usa **INFO**. Usa **DEBUG** solo para diagnóstico ya que genera muchos más datos.
:::

## Filtrado

Usa la barra de herramientas de filtros en la parte superior de la vista del registro:

1. **Nivel de registro** — mostrar solo ERROR / WARN / INFO / DEBUG o una combinación
2. **Módulo** — filtrar por módulo del sistema:
   - `mqtt` — comunicación MQTT con impresoras
   - `api` — solicitudes de API
   - `db` — operaciones de base de datos
   - `auth` — eventos de autenticación
   - `queue` — eventos de la cola de impresión
   - `guard` — eventos de Print Guard
   - `backup` — operaciones de copia de seguridad
3. **Texto libre** — buscar en el texto del registro (admite expresiones regulares)
4. **Fecha y hora** — filtrar por período de fecha

Combina los filtros para un diagnóstico preciso.

## Situaciones de error comunes

### Problemas de conexión MQTT

Busca líneas del registro del módulo `mqtt`:

```
ERROR [mqtt] Conexión a impresora XXXX fallida: Connection refused
```

**Solución:** Verifica que la impresora esté encendida, que la clave de acceso sea correcta y que la red funcione.

### Errores de base de datos

```
ERROR [db] La migración v95 falló: SQLITE_CONSTRAINT
```

**Solución:** Haz una copia de seguridad y ejecuta la reparación de base de datos en **Configuración → Sistema → Reparar base de datos**.

### Errores de autenticación

```
WARN [auth] Inicio de sesión fallido para usuario admin desde IP 192.168.1.x
```

Muchos inicios de sesión fallidos pueden indicar un intento de fuerza bruta. Verifica si se debe activar la lista blanca de IP.

## Exportar registros

1. Haz clic en **Exportar registro**
2. Selecciona el período de tiempo (predeterminado: últimas 24 horas)
3. Selecciona el formato: **TXT** (legible por humanos) o **JSON** (legible por máquina)
4. El archivo se descarga

Los registros exportados son útiles para reportar errores o al contactar al soporte.

## Rotación de registros

Los registros se rotan automáticamente:

| Configuración | Predeterminado |
|---|---|
| Tamaño máximo del archivo de registro | 50 MB |
| Número de archivos rotados a conservar | 5 |
| Tamaño máximo total del registro | 250 MB |

Ajusta en **Configuración → Sistema → Rotación de registros**. Los archivos de registro más antiguos se comprimen automáticamente con gzip.

## Ubicación de los archivos de registro

Los archivos de registro se guardan en el servidor:

```
./data/logs/
├── bambu-dashboard.log          (registro activo)
├── bambu-dashboard.log.1.gz     (rotado)
├── bambu-dashboard.log.2.gz     (rotado)
└── ...
```

:::tip Acceso SSH
Para leer los registros directamente en el servidor mediante SSH:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
