---
sidebar_position: 2
title: Calendario de actividad
description: Calendario de mapa de calor estilo GitHub que muestra la actividad de la impresora por día a lo largo del año con selector de año y vista detallada
---

# Calendario de actividad

El calendario de actividad muestra una vista visual de tu actividad de impresión durante todo el año — inspirado en el resumen de contribuciones de GitHub.

Ir a: **https://localhost:3443/#calendar**

## Vista del mapa de calor

El calendario muestra 365 días (52 semanas) como una cuadrícula de casillas de colores:

- **Gris** — sin impresiones ese día
- **Verde claro** — 1–2 impresiones
- **Verde** — 3–5 impresiones
- **Verde oscuro** — 6–10 impresiones
- **Verde intenso** — 11+ impresiones

Las casillas están organizadas con los días de la semana verticalmente (Lun–Dom) y las semanas horizontalmente de izquierda (enero) a derecha (diciembre).

:::tip Código de colores
Puedes cambiar la métrica del mapa de calor de **Número de impresiones** a **Horas** o **Gramos de filamento** mediante el selector encima del calendario.
:::

## Selector de año

Haz clic en **< Año >** para navegar entre años:

- Todos los años con actividad de impresión registrada están disponibles
- El año actual se muestra por defecto
- El futuro aparece en gris (sin datos)

## Vista detallada por día

Haz clic en una casilla para ver los detalles de ese día:

- **Fecha** y día de la semana
- **Número de impresiones** — exitosas y fallidas
- **Total de filamento usado** (gramos)
- **Total de horas de impresión**
- **Lista de impresiones** — haz clic para abrir en el historial

## Resumen mensual

Debajo del mapa de calor se muestra un resumen mensual con:
- Total de impresiones por mes como gráfico de barras
- Mejor día del mes resaltado
- Comparación con el mismo mes del año anterior (%)

## Filtro de impresoras

Selecciona una impresora en el menú desplegable en la parte superior para mostrar la actividad solo de esa impresora, o selecciona **Todas** para una vista agregada.

La vista de múltiples impresoras muestra los colores apilados al hacer clic en **Apilado** en el selector de vista.

## Rachas y récords

Debajo del calendario se muestra:

| Estadística | Descripción |
|---|---|
| **Racha más larga** | Días consecutivos con al menos una impresión |
| **Racha actual** | Serie en curso de días activos |
| **Día más activo** | El día con más impresiones en total |
| **Semana más activa** | La semana con más impresiones |
| **Mes más activo** | El mes con más impresiones |

## Exportar

Haz clic en **Exportar** para descargar los datos del calendario:

- **PNG** — imagen del mapa de calor (para compartir)
- **CSV** — datos en bruto con una fila por día (fecha, número, gramos, horas)

La exportación PNG está optimizada para compartir en redes sociales con el nombre de la impresora y el año como subtítulo.
