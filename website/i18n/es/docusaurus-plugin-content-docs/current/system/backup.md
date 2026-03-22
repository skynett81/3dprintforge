---
sidebar_position: 2
title: Copia de seguridad
description: Crea, restaura y programa copias de seguridad automáticas de los datos de Bambu Dashboard
---

# Copia de seguridad

Bambu Dashboard puede hacer copias de seguridad de toda la configuración, historial y datos para que puedas restaurar fácilmente en caso de fallo del sistema, migración de servidor o problemas de actualización.

Ir a: **https://localhost:3443/#settings** → **Sistema → Copia de seguridad**

## Qué se incluye en una copia de seguridad

| Tipo de datos | Incluido | Nota |
|---|---|---|
| Configuración de impresoras | ✅ | |
| Historial de impresiones | ✅ | |
| Inventario de filamento | ✅ | |
| Usuarios y roles | ✅ | Las contraseñas se almacenan con hash |
| Configuración | ✅ | Incluye configuraciones de alertas |
| Registro de mantenimiento | ✅ | |
| Proyectos y facturas | ✅ | |
| Biblioteca de archivos (metadatos) | ✅ | |
| Biblioteca de archivos (archivos) | Opcional | Puede ser grande |
| Videos de timelapse | Opcional | Puede ser muy grande |
| Imágenes de galería | Opcional | |

## Crear una copia de seguridad manual

1. Ve a **Configuración → Copia de seguridad**
2. Selecciona qué incluir (ver tabla anterior)
3. Haz clic en **Crear copia de seguridad ahora**
4. Se muestra un indicador de progreso mientras se crea la copia de seguridad
5. Haz clic en **Descargar** cuando esté lista

La copia de seguridad se guarda como un archivo `.zip` con marca de tiempo en el nombre:
```
bambu-dashboard-backup-2026-03-22T14-30-00.zip
```

## Descargar la copia de seguridad

Los archivos de copia de seguridad se guardan en la carpeta de copias de seguridad del servidor (configurable). Además, puedes descargarlos directamente:

1. Ve a **Copia de seguridad → Copias de seguridad existentes**
2. Encuentra la copia de seguridad en la lista (ordenada por fecha)
3. Haz clic en **Descargar** (ícono de descarga)

:::info Carpeta de almacenamiento
Carpeta de almacenamiento estándar: `./data/backups/`. Cambia en **Configuración → Copia de seguridad → Carpeta de almacenamiento**.
:::

## Copia de seguridad automática programada

1. Activa **Copia de seguridad automática** en **Copia de seguridad → Programación**
2. Selecciona el intervalo:
   - **Diaria** — se ejecuta a las 03:00 (configurable)
   - **Semanal** — un día y hora específicos
   - **Mensual** — el primer día del mes
3. Selecciona el **Número de copias de seguridad a conservar** (p.ej. 7 — las más antiguas se eliminan automáticamente)
4. Haz clic en **Guardar**

:::tip Almacenamiento externo
Para datos importantes: monta un disco externo o disco de red como carpeta de almacenamiento de copias de seguridad. Así las copias de seguridad sobreviven incluso si falla el disco del sistema.
:::

## Restaurar desde una copia de seguridad

:::warning La restauración sobrescribe los datos existentes
La restauración reemplaza todos los datos existentes con el contenido del archivo de copia de seguridad. Asegúrate de tener una copia de seguridad reciente de los datos actuales primero.
:::

### Desde una copia de seguridad existente en el servidor

1. Ve a **Copia de seguridad → Copias de seguridad existentes**
2. Encuentra la copia de seguridad en la lista
3. Haz clic en **Restaurar**
4. Confirma en el diálogo
5. El sistema se reinicia automáticamente después de la restauración

### Desde un archivo de copia de seguridad descargado

1. Haz clic en **Subir copia de seguridad**
2. Selecciona el archivo `.zip` de tu computadora
3. El archivo se valida — verás qué está incluido
4. Haz clic en **Restaurar desde archivo**
5. Confirma en el diálogo

## Validación de la copia de seguridad

Bambu Dashboard valida todos los archivos de copia de seguridad antes de restaurar:

- Verifica que el formato ZIP sea válido
- Verifica que el esquema de la base de datos sea compatible con la versión actual
- Muestra una advertencia si la copia de seguridad es de una versión anterior (la migración se realizará automáticamente)
