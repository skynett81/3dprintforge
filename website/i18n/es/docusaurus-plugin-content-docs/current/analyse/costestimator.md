---
sidebar_position: 4
title: Calculadora de costos
description: Sube un archivo 3MF o GCode y calcula el costo total de filamento, electricidad y desgaste de máquina antes de imprimir
---

# Calculadora de costos

La calculadora de costos te permite estimar el costo total de una impresión antes de enviarla a la impresora — basándose en el consumo de filamento, el precio de la electricidad y el desgaste de la máquina.

Ir a: **https://localhost:3443/#cost-estimator**

## Subir archivo

1. Ve a **Calculadora de costos**
2. Arrastra y suelta un archivo en el campo de carga, o haz clic en **Seleccionar archivo**
3. Formatos soportados: `.3mf`, `.gcode`, `.bgcode`
4. Haz clic en **Analizar**

:::info Análisis
El sistema analiza el G-code para extraer el consumo de filamento, el tiempo estimado de impresión y el perfil de material. Esto suele tardar 2–10 segundos.
:::

## Cálculo de filamento

Tras el análisis se muestra:

| Campo | Valor (ejemplo) |
|---|---|
| Filamento estimado | 47.3 g |
| Material (del archivo) | PLA |
| Precio por gramo | 0.025 € (del inventario de filamento) |
| **Costo de filamento** | **1.18 €** |

Cambia el material en el menú desplegable para comparar costos con diferentes tipos de filamento o proveedores.

:::tip Sustitución de material
Si el G-code no contiene información del material, selecciona el material manualmente de la lista. El precio se obtiene automáticamente del inventario de filamento.
:::

## Cálculo de electricidad

El costo eléctrico se calcula basándose en:

- **Tiempo estimado de impresión** — del análisis del G-code
- **Potencia de la impresora** — configurada por modelo de impresora (W)
- **Precio de electricidad** — precio fijo (€/kWh) o en tiempo real de Tibber/Nordpool

| Campo | Valor (ejemplo) |
|---|---|
| Tiempo estimado de impresión | 3 horas 22 min |
| Potencia de la impresora | 350 W (X1C) |
| Consumo estimado | 1.17 kWh |
| Precio de electricidad | 1.85 €/kWh |
| **Costo de electricidad** | **2.16 €** |

Activa la integración de Tibber o Nordpool para usar los precios por hora planificados según la hora de inicio deseada.

## Desgaste de máquina

El costo de desgaste se estima basándose en:

- Tiempo de impresión × costo por hora por modelo de impresora
- Desgaste adicional para material abrasivo (CF, GF, etc.)

| Campo | Valor (ejemplo) |
|---|---|
| Tiempo de impresión | 3 horas 22 min |
| Costo por hora (desgaste) | 0.80 €/hora |
| **Costo de desgaste** | **2.69 €** |

El costo por hora se calcula a partir de los precios de los componentes y la vida útil esperada (ver [Predicción de desgaste](../overvaaking/wearprediction)).

## Total

| Concepto | Importe |
|---|---|
| Filamento | 1.18 € |
| Electricidad | 2.16 € |
| Desgaste de máquina | 2.69 € |
| **Total** | **6.03 €** |
| + Margen (30 %) | 1.81 € |
| **Precio de venta** | **7.84 €** |

Ajusta el margen en el campo de porcentaje para calcular el precio de venta recomendado al cliente.

## Guardar estimado

Haz clic en **Guardar estimado** para vincular el análisis a un proyecto:

1. Selecciona un proyecto existente o crea uno nuevo
2. El estimado se guarda y puede usarse como base para una factura
3. El costo real (tras la impresión) se compara automáticamente con el estimado

## Cálculo por lotes

Sube varios archivos a la vez para calcular el costo total de un conjunto completo:

1. Haz clic en **Modo por lotes**
2. Sube todos los archivos `.3mf`/`.gcode`
3. El sistema calcula el costo individual y sumado
4. Exporta el resumen como PDF o CSV
