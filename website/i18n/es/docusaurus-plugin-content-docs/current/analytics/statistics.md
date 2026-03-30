---
sidebar_position: 1
title: Estadísticas
description: Tasa de éxito, consumo de filamento, tendencias e indicadores clave para todas las impresoras Bambu Lab a lo largo del tiempo
---

# Estadísticas

La página de estadísticas te ofrece una descripción completa de tu actividad de impresión con indicadores clave, tendencias y consumo de filamento para cualquier período de tiempo.

Ir a: **https://localhost:3443/#statistics**

## Indicadores clave

En la parte superior de la página se muestran cuatro tarjetas KPI:

| Indicador | Descripción |
|---|---|
| **Tasa de éxito** | Proporción de impresiones exitosas sobre el total |
| **Filamento total** | Gramos usados en el período seleccionado |
| **Horas totales de impresión** | Tiempo de impresión acumulado |
| **Tiempo promedio de impresión** | Duración mediana por impresión |

Cada indicador muestra el cambio respecto al período anterior (↑ subida / ↓ bajada) como desviación porcentual.

## Tasa de éxito

La tasa de éxito se calcula por impresora y en total:

- **Exitosa** — impresión completada sin interrupciones
- **Cancelada** — detenida manualmente por el usuario
- **Fallida** — detenida por Print Guard, error HMS o fallo de hardware

Haz clic en el gráfico de tasa de éxito para ver qué impresiones fallaron y la causa.

:::tip Mejorar la tasa de éxito
Usa [Análisis de patrones de error](../monitoring/erroranalysis) para identificar y corregir las causas de las impresiones fallidas.
:::

## Tendencias

La vista de tendencias muestra la evolución a lo largo del tiempo como gráfico de líneas:

1. Selecciona el **Período de tiempo**: Últimos 7 / 30 / 90 / 365 días
2. Selecciona la **Agrupación**: Día / Semana / Mes
3. Selecciona la **Métrica**: Número de impresiones / Horas / Gramos / Tasa de éxito
4. Haz clic en **Comparar** para superponer dos métricas

La gráfica soporta zoom (rueda) y desplazamiento (clic y arrastrar).

## Consumo de filamento

El consumo de filamento se muestra como:

- **Gráfico de barras** — consumo por día/semana/mes
- **Gráfico circular** — distribución entre materiales (PLA, PETG, ABS, etc.)
- **Tabla** — lista detallada con total de gramos, metros y costo por material

### Consumo por impresora

Usa el filtro de selección múltiple en la parte superior para:
- Mostrar solo una impresora
- Comparar dos impresoras lado a lado
- Ver el total agregado de todas las impresoras

## Calendario de actividad

Consulta un mapa de calor compacto estilo GitHub directamente en la página de estadísticas (vista simplificada), o ve al [Calendario de actividad](./calendar) completo para una vista más detallada.

## Exportar

1. Haz clic en **Exportar estadísticas**
2. Selecciona el intervalo de fechas y las métricas que deseas incluir
3. Selecciona el formato: **CSV** (datos en bruto), **PDF** (informe) o **JSON**
4. El archivo se descarga

La exportación CSV es compatible con Excel y Google Sheets para análisis adicional.

## Comparación con el período anterior

Activa **Mostrar período anterior** para superponer las gráficas con el período anterior equivalente:

- Últimos 30 días vs. los 30 días anteriores
- Mes actual vs. mes anterior
- Año actual vs. año anterior

Esto facilita ver si imprimes más o menos que antes, y si la tasa de éxito está mejorando.
