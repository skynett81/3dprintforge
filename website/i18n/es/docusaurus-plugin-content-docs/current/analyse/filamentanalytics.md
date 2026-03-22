---
sidebar_position: 3
title: Análisis de filamento
description: Análisis detallado del consumo de filamento, costos, pronósticos, tasas de consumo y desperdicio por material y proveedor
---

# Análisis de filamento

El análisis de filamento te da plena visibilidad sobre tu consumo de filamento — qué usas, cuánto cuesta y qué puedes ahorrar.

Ir a: **https://localhost:3443/#filament-analytics**

## Resumen de consumo

En la parte superior se muestra un resumen del período seleccionado:

- **Consumo total** — gramos y metros para todos los materiales
- **Costo estimado** — basado en el precio registrado por bobina
- **Material más usado** — tipo y proveedor
- **Tasa de reutilización** — proporción de filamento en el modelo real vs. soporte/purga

### Consumo por material

El gráfico circular y la tabla muestran la distribución entre materiales:

| Columna | Descripción |
|---|---|
| Material | PLA, PETG, ABS, PA, etc. |
| Proveedor | Bambu Lab, PolyMaker, Prusament, etc. |
| Gramos usados | Peso total |
| Metros | Longitud estimada |
| Costo | Gramos × precio por gramo |
| Impresiones | Número de impresiones con este material |

Haz clic en una fila para profundizar al nivel de bobina individual.

## Tasas de consumo

La tasa de consumo muestra el promedio de consumo de filamento por unidad de tiempo:

- **Gramos por hora** — durante la impresión activa
- **Gramos por semana** — incluyendo el tiempo de inactividad de la impresora
- **Gramos por impresión** — promedio por impresión

Estas se usan para calcular pronósticos de necesidades futuras.

:::tip Planificación de compras
Usa la tasa de consumo para planificar el inventario de bobinas. El sistema alerta automáticamente cuando el inventario estimado se agotará en 14 días (configurable).
:::

## Pronóstico de costos

Basándose en la tasa de consumo histórica se calcula:

- **Consumo estimado para los próximos 30 días** (gramos por material)
- **Costo estimado para los próximos 30 días**
- **Inventario recomendado** (suficiente para 30 / 60 / 90 días de operación)

El pronóstico tiene en cuenta la variación estacional si tienes datos de al menos un año.

## Desperdicio y eficiencia

Ver [Rastreo de desperdicio](./waste) para documentación completa. El análisis de filamento muestra un resumen:

- **Purga AMS** — gramos y proporción del consumo total
- **Material de soporte** — gramos y proporción
- **Material real del modelo** — proporción restante (% de eficiencia)
- **Costo estimado del desperdicio** — cuánto te cuesta el desperdicio

## Registro de bobinas

Todas las bobinas (activas y vacías) están registradas:

| Campo | Descripción |
|---|---|
| Nombre de bobina | Nombre del material y color |
| Peso original | Peso registrado al inicio |
| Peso restante | Peso restante calculado |
| Usado | Gramos usados en total |
| Último uso | Fecha de la última impresión |
| Estado | Activa / Vacía / Almacenada |

## Registro de precios

Para un análisis de costos preciso, registra los precios por bobina:

1. Ve a **Inventario de filamento**
2. Haz clic en una bobina → **Editar**
3. Completa **Precio de compra** y **Peso al comprar**
4. El sistema calcula el precio por gramo automáticamente

Las bobinas sin precio registrado usan el **precio estándar por gramo** (se establece en **Configuración → Filamento → Precio estándar**).

## Exportar

1. Haz clic en **Exportar datos de filamento**
2. Selecciona el período y el formato (CSV / PDF)
3. El CSV incluye una fila por impresión con gramos, costo y material
