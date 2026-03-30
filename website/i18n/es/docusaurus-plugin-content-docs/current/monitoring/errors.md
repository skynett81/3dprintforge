---
sidebar_position: 2
title: Registro de errores
description: Descripción completa de los códigos de error HMS de las impresoras con nivel de gravedad, búsqueda y enlaces a la wiki de Bambu
---

# Registro de errores

El registro de errores recopila todos los errores y alertas HMS (Health, Maintenance, Safety) de tus impresoras. Bambu Dashboard tiene una base de datos integrada con más de 269 códigos HMS para impresoras Bambu Lab.

Ir a: **https://localhost:3443/#errors**

## Códigos HMS

Las impresoras Bambu Lab envían códigos HMS vía MQTT cuando algo va mal. Bambu Dashboard los traduce automáticamente a mensajes de error legibles:

| Código | Ejemplo | Categoría |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Boquilla/extrusor |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Placa de construcción |
| `0700 0500 0001 0001` | MC disconnect | Electrónica |

La lista completa cubre los más de 269 códigos conocidos para X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D y H2C.

## Nivel de gravedad

Los errores se clasifican en cuatro niveles:

| Nivel | Color | Descripción |
|---|---|---|
| **Crítico** | Rojo | Requiere acción inmediata — impresión detenida |
| **Alto** | Naranja | Debe tratarse rápidamente — la impresión puede continuar |
| **Medio** | Amarillo | Debe revisarse — sin peligro inmediato |
| **Info** | Azul | Mensaje informativo, no se requiere acción |

## Búsqueda y filtrado

Usa la barra de herramientas en la parte superior del registro de errores:

1. **Búsqueda de texto libre** — busca en el mensaje de error, código HMS o descripción de la impresora
2. **Impresora** — muestra errores solo de una impresora
3. **Categoría** — AMS / Boquilla / Placa / Electrónica / Calibración / Otros
4. **Nivel de gravedad** — Todos / Crítico / Alto / Medio / Info
5. **Fecha** — filtra por período de fechas
6. **Sin reconocer** — muestra solo errores que no han sido reconocidos

Haz clic en **Restablecer filtro** para ver todos los errores.

## Enlaces a la wiki

Para cada código HMS se muestra un enlace a la wiki de Bambu Lab con:

- Descripción completa del error
- Posibles causas
- Guía de solución de problemas paso a paso
- Recomendaciones oficiales de Bambu Lab

Haz clic en **Abrir wiki** en una entrada de error para abrir la página de la wiki correspondiente en una nueva pestaña.

:::tip Copia local
Bambu Dashboard almacena en caché el contenido de la wiki localmente para uso sin conexión. El contenido se actualiza automáticamente cada semana.
:::

## Reconocer errores

El reconocimiento marca un error como tratado sin eliminarlo:

1. Haz clic en un error de la lista
2. Haz clic en **Reconocer** (ícono de marca de verificación)
3. Escribe una nota opcional sobre lo que se hizo
4. El error se marca con una marca de verificación y se mueve a la lista de «Reconocidos»

### Reconocimiento masivo

1. Selecciona varios errores con las casillas de verificación
2. Haz clic en **Reconocer seleccionados**
3. Todos los errores seleccionados se reconocen simultáneamente

## Estadísticas

En la parte superior del registro de errores se muestra:

- Total de errores en los últimos 30 días
- Número de errores sin reconocer
- Código HMS más frecuente
- Impresora con más errores

## Exportar

1. Haz clic en **Exportar** (ícono de descarga)
2. Selecciona el formato: **CSV** o **JSON**
3. El filtro se aplica a la exportación — establece el filtro deseado primero
4. El archivo se descarga automáticamente

## Alertas para nuevos errores

Activa alertas para nuevos errores HMS:

1. Ve a **Configuración → Alertas**
2. Marca **Nuevos errores HMS**
3. Selecciona el nivel de gravedad mínimo para la alerta (recomendado: **Alto** y superiores)
4. Selecciona el canal de alerta

Ver [Alertas](../features/notifications) para la configuración de canales.
