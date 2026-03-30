---
sidebar_position: 3
title: Vista de flota
description: Gestiona y monitorea todas las impresoras Bambu Lab en una cuadrícula con ordenación, filtrado y estado en tiempo real
---

# Vista de flota

La vista de flota te da una descripción compacta de todas las impresoras conectadas en una sola página. Perfecta para talleres, aulas o cualquiera que tenga más de una impresora.

Ir a: **https://localhost:3443/#fleet**

## Cuadrícula multi-impresora

Todas las impresoras registradas se muestran en una cuadrícula responsiva:

- **Tamaño de tarjeta** — Pequeño (compacto), Mediano (estándar), Grande (detallado)
- **Número de columnas** — Se adapta automáticamente al ancho de pantalla, o configúralo manualmente
- **Actualización** — Cada tarjeta se actualiza de forma independiente vía MQTT

Cada tarjeta de impresora muestra:
| Campo | Descripción |
|---|---|
| Nombre de impresora | Nombre configurado con ícono del modelo |
| Estado | Inactiva / Imprimiendo / Pausada / Error / Desconectada |
| Progreso | Barra de porcentaje con tiempo restante |
| Temperatura | Boquilla y cama (compacto) |
| Filamento activo | Color y material del AMS |
| Miniatura de cámara | Imagen fija actualizada cada 30 segundos |

## Indicador de estado por impresora

Los colores de estado facilitan ver la situación a distancia:

- **Verde pulsante** — Imprimiendo activamente
- **Azul** — Inactiva y lista
- **Amarillo** — Pausada (manual o por Print Guard)
- **Rojo** — Error detectado
- **Gris** — Desconectada o inaccesible

:::tip Modo kiosco
Usa la vista de flota en modo kiosco en una pantalla montada en la pared. Ver [Modo kiosco](../system/kiosk) para la configuración.
:::

## Ordenación

Haz clic en **Ordenar** para elegir el orden:

1. **Nombre** — Alfabético A–Z
2. **Estado** — Impresoras activas primero
3. **Progreso** — Más avanzadas primero
4. **Última actividad** — Usadas más recientemente primero
5. **Modelo** — Agrupadas por modelo de impresora

La ordenación se recuerda hasta la próxima visita.

## Filtrado

Usa el campo de filtro en la parte superior para limitar la vista:

- Escribe el nombre de la impresora o parte de él
- Selecciona **Estado** en el menú desplegable (Todas / Imprimiendo / Inactiva / Error)
- Selecciona **Modelo** para mostrar solo un tipo de impresora (X1C, P1S, A1, etc.)
- Haz clic en **Restablecer filtro** para mostrar todas

:::info Búsqueda
La búsqueda filtra en tiempo real sin recargar la página.
:::

## Acciones desde la vista de flota

Haz clic derecho en una tarjeta (o haz clic en los tres puntos) para acciones rápidas:

- **Abrir panel** — Ve directamente al panel principal de la impresora
- **Pausar impresión** — Pone la impresora en pausa
- **Detener impresión** — Cancela la impresión en curso (requiere confirmación)
- **Ver cámara** — Abre la vista de cámara en una ventana emergente
- **Ir a configuración** — Abre la configuración de la impresora

:::danger Detener impresión
Detener una impresión es irreversible. Confirma siempre en el diálogo que aparece.
:::

## Estadísticas agregadas

En la parte superior de la vista de flota se muestra una fila de resumen:

- Total de impresoras
- Número de impresiones activas
- Consumo total de filamento hoy
- Tiempo estimado de finalización para la impresión en curso más larga
