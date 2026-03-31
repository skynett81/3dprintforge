---
sidebar_position: 5
title: Rastreo de desperdicio
description: Rastrea el desperdicio de filamento por purga AMS y material de soporte, calcula costos y optimiza la eficiencia
---

# Rastreo de desperdicio

El rastreo de desperdicio te da plena visibilidad sobre cuánto filamento se desperdicia durante la impresión — purga AMS, enjuague al cambiar de material y material de soporte — y cuánto te cuesta.

Ir a: **https://localhost:3443/#waste**

## Categorías de desperdicio

3DPrintForge distingue tres tipos de desperdicio:

| Categoría | Fuente | Proporción típica |
|---|---|---|
| **Purga AMS** | Cambio de color en AMS durante impresión multicolor | 5–30 g por cambio |
| **Enjuague al cambiar material** | Limpieza al cambiar entre diferentes materiales | 10–50 g por cambio |
| **Material de soporte** | Estructuras de soporte que se retiran tras la impresión | Variable |

## Rastreo de purga AMS

Los datos de purga AMS se obtienen directamente de la telemetría MQTT y el análisis G-code:

- **Gramos por cambio de color** — calculados del bloque de purga del G-code
- **Número de cambios de color** — contados del registro de impresión
- **Consumo total de purga** — suma del período seleccionado

:::tip Reducir la purga
Bambu Studio tiene ajustes para el volumen de purga por combinación de colores. Reduce el volumen de purga para pares de colores con poca diferencia (p.ej. blanco → gris claro) para ahorrar filamento.
:::

## Cálculo de eficiencia

La eficiencia se calcula como:

```
Eficiencia % = (material del modelo / consumo total) × 100

Consumo total = material del modelo + purga + material de soporte
```

**Ejemplo:**
- Modelo: 45 g
- Purga: 12 g
- Soporte: 8 g
- Total: 65 g
- **Eficiencia: 69 %**

La eficiencia se muestra como gráfico de tendencia a lo largo del tiempo para ver si estás mejorando.

## Costo del desperdicio

Basándose en los precios de filamento registrados se calcula:

| Concepto | Cálculo |
|---|---|
| Costo de purga | Gramos de purga × precio/gramo por color |
| Costo de soporte | Gramos de soporte × precio/gramo |
| **Costo total de desperdicio** | Suma de los anteriores |
| **Costo por impresión exitosa** | Costo de desperdicio / número de impresiones |

## Desperdicio por impresora y material

Filtra la vista por:

- **Impresora** — ve qué impresora genera más desperdicio
- **Material** — ve el desperdicio por tipo de filamento
- **Período** — día, semana, mes, año

La vista de tabla muestra la lista ordenada con mayor desperdicio primero, incluyendo el costo estimado.

## Consejos de optimización

El sistema genera sugerencias automáticas para reducir el desperdicio:

- **Orden de colores invertido** — Si el color A→B purga más que B→A, el sistema sugiere invertir el orden
- **Agrupar capas de cambio de color** — Agrupa capas con el mismo color para minimizar los cambios
- **Optimización de estructura de soporte** — Estima la reducción de soporte al cambiar la orientación

:::info Precisión
Los cálculos de purga son estimados a partir del G-code. El desperdicio real puede variar un 10–20 % por el comportamiento de la impresora.
:::

## Exportar e informar

1. Haz clic en **Exportar datos de desperdicio**
2. Selecciona el período y el formato (CSV / PDF)
3. Los datos de desperdicio pueden incluirse en informes de proyectos y facturas como partida de costo

Ver también [Análisis de filamento](./filamentanalytics) para una vista general del consumo.
