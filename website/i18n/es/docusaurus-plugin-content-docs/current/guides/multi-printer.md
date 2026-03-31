---
sidebar_position: 6
title: Varias impresoras
description: Configurar y gestionar varias impresoras Bambu en 3DPrintForge — vista de flota, cola e inicio escalonado
---

# Varias impresoras

¿Tienes más de una impresora? 3DPrintForge está diseñado para la gestión de flotas — puedes monitorear, controlar y coordinar todas las impresoras desde un solo lugar.

## Agregar una nueva impresora

1. Ve a **Configuración → Impresoras**
2. Haz clic en **+ Agregar impresora**
3. Completa:

| Campo | Ejemplo | Explicación |
|-------|---------|-------------|
| Número de serie (SN) | 01P... | Se encuentra en Bambu Handy o en la pantalla de la impresora |
| Dirección IP | 192.168.1.101 | Para el modo LAN (recomendado) |
| Código de acceso | 12345678 | Código de 8 dígitos en la pantalla de la impresora |
| Nombre | "Bambu #2 - P1S" | Se muestra en el panel de control |
| Modelo | P1P, P1S, X1C, A1 | Elige el modelo correcto para los iconos y funciones correctos |

4. Haz clic en **Probar conexión** — deberías ver un estado verde
5. Haz clic en **Guardar**

:::tip Dar nombres descriptivos a las impresoras
"Bambu 1" y "Bambu 2" son confusos. Usa nombres como "X1C - Producción" y "P1S - Prototipos" para mantener una buena visión general.
:::

## La vista de flota

Después de agregar todas las impresoras, se muestran juntas en el panel de **Flota**. Aquí puedes ver:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Producción│  │ P1S - Prototipos│  │ A1 - Hobby      │
│ ████████░░ 82%  │  │ Libre           │  │ ████░░░░░░ 38%  │
│ 1h 24m restante │  │ Lista para imp. │  │ 3h 12m restante │
│ Temp: 220/60°C  │  │ AMS: 4 carretes │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Puedes:
- Hacer clic en una impresora para abrir la vista detallada completa
- Ver todas las temperaturas, el estado del AMS y los errores activos a la vez
- Filtrar por estado (impresiones activas, libres, errores)

## Cola de impresión — distribuir el trabajo

La cola de impresión te permite planificar impresiones para todas las impresoras desde un solo lugar.

**Cómo funciona:**
1. Ve a **Cola**
2. Haz clic en **+ Agregar trabajo**
3. Elige archivo y configuración
4. Elige impresora o selecciona **Asignación automática**

### Asignación automática
Con la asignación automática, el panel de control elige la impresora según:
- Capacidad disponible
- Filamento disponible en el AMS
- Ventanas de mantenimiento programadas

Activa en **Configuración → Cola → Asignación automática**.

### Priorización
Arrastra y suelta los trabajos en la cola para cambiar el orden. Un trabajo con **Alta prioridad** se adelanta a los trabajos normales.

## Inicio escalonado — evitar picos de corriente

Si inicias muchas impresoras al mismo tiempo, la fase de calentamiento puede generar un fuerte pico de corriente. El inicio escalonado distribuye el arranque:

**Cómo activarlo:**
1. Ve a **Configuración → Flota → Inicio escalonado**
2. Activa **Inicio distribuido**
3. Establece el retraso entre impresoras (recomendado: 2–5 minutos)

**Ejemplo con 3 impresoras y 3 minutos de retraso:**
```
08:00 — Impresora 1 comienza el calentamiento
08:03 — Impresora 2 comienza el calentamiento
08:06 — Impresora 3 comienza el calentamiento
```

:::tip Relevante para el tamaño del fusible
Un X1C consume aproximadamente 1000 W durante el calentamiento. Tres impresoras al mismo tiempo = 3000 W, lo que puede activar el fusible de 16A. El inicio escalonado elimina el problema.
:::

## Grupos de impresoras

Los grupos de impresoras te permiten organizar las impresoras de forma lógica y enviar comandos a todo el grupo:

**Crear un grupo:**
1. Ve a **Configuración → Grupos de impresoras**
2. Haz clic en **+ Nuevo grupo**
3. Dale un nombre al grupo (por ej. "Sala de producción", "Cuarto de hobby")
4. Agrega impresoras al grupo

**Funciones de grupo:**
- Ver estadísticas globales del grupo
- Enviar comando de pausa a todo el grupo simultáneamente
- Establecer ventana de mantenimiento para el grupo

## Monitorear todas las impresoras

### Vista multi-cámara
Ve a **Flota → Vista de cámara** para ver todos los feeds de cámara uno al lado del otro:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [En vivo]   │  │  [Libre]     │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Agregar   │
│  [En vivo]   │  │              │
└──────────────┘  └──────────────┘
```

### Notificaciones por impresora
Puedes configurar diferentes reglas de notificación para distintas impresoras:
- Impresora de producción: notificar siempre, incluyendo de noche
- Impresora de hobby: notificar solo durante el día

Ver [Notificaciones](./notification-setup) para la configuración.

## Consejos para la gestión de flota

- **Estandarizar ranuras de filamento**: Mantener PLA blanco en ranura 1, PLA negro en ranura 2 en todas las impresoras — la distribución de trabajos es entonces más sencilla
- **Verificar los niveles del AMS diariamente**: Ver [Uso diario](./daily-use) para la rutina matutina
- **Mantenimiento en rotación**: No hacer mantenimiento en todas las impresoras al mismo tiempo — mantener siempre al menos una activa
- **Nombrar archivos claramente**: Nombres de archivo como `logo_x1c_pla_0.2mm.3mf` facilitan elegir la impresora correcta
