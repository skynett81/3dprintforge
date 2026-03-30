---
sidebar_position: 11
title: Precios de productos — calcular el precio de venta
description: Guía completa para fijar precios de impresiones 3D para la venta con todos los factores de coste
---

# Precios de productos — calcular el precio de venta

Esta guía explica cómo usar la calculadora de costes para encontrar el precio de venta correcto para las impresiones 3D que vendes.

## Resumen de costes

El coste de una impresión 3D se compone de estos elementos:

| Componente | Descripción | Ejemplo |
|-----------|-------------|---------|
| **Filamento** | Coste de material basado en peso y precio de la bobina | 100g × 0,25 kr/g = 25 kr |
| **Residuo** | Desperdicio de material (purga, impresiones fallidas, soporte) | 10% extra = 2,50 kr |
| **Electricidad** | Consumo eléctrico durante la impresión | 3,5h × 150W × 1,50 kr/kWh = 0,79 kr |
| **Desgaste** | Boquilla + valor de la máquina durante su vida útil | 3,5h × 0,15 kr/h = 0,53 kr |
| **Mano de obra** | Tu tiempo para configuración, postprocesado, empaquetado | 10 min × 200 kr/h = 33,33 kr |
| **Margen** | Margen de beneficio | 20% = 12,43 kr |

**Coste total de producción** = suma de todos los componentes

## Configurar ajustes

### Ajustes básicos

Ve a **Filament → ⚙ Ajustes** y completa:

1. **Precio de electricidad (kr/kWh)** — tu precio de electricidad. Consulta tu factura eléctrica o usa la integración de Nordpool
2. **Potencia de la impresora (W)** — típicamente 150W para impresoras Bambu Lab
3. **Coste de la máquina (kr)** — lo que pagaste por la impresora
4. **Vida útil de la máquina (horas)** — vida útil esperada (3000-8000 horas)
5. **Coste de mano de obra (kr/hora)** — tu tarifa por hora
6. **Tiempo de preparación (min)** — tiempo medio para cambio de filamento, revisión de placa, empaquetado
7. **Margen (%)** — margen de beneficio deseado
8. **Coste de boquilla (kr/hora)** — desgaste de la boquilla (HS01 ≈ 0,05 kr/h)
9. **Factor de residuo** — desperdicio de material (1,1 = 10% extra, 1,15 = 15%)

:::tip Valores típicos para Bambu Lab
| Ajuste | Aficionado | Semi-pro | Profesional |
|---|---|---|---|
| Precio de electricidad | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Potencia de la impresora | 150W | 150W | 150W |
| Coste de la máquina | 5 000 kr | 12 000 kr | 25 000 kr |
| Vida útil de la máquina | 3 000h | 5 000h | 8 000h |
| Coste de mano de obra | 0 kr/h | 150 kr/h | 250 kr/h |
| Tiempo de preparación | 5 min | 10 min | 15 min |
| Margen | 0% | 30% | 50% |
| Factor de residuo | 1,05 | 1,10 | 1,15 |
:::

## Calcular coste

1. Ve a la **Calculadora de costes** (`https://localhost:3443/#costestimator`)
2. **Arrastra y suelta** un archivo `.3mf` o `.gcode`
3. El sistema lee automáticamente: peso del filamento, tiempo estimado, colores
4. **Vincular bobinas** — selecciona qué bobinas del inventario se utilizan
5. Haz clic en **Calcular coste**

### El resultado muestra:

- **Filamento** — coste de material por color
- **Residuo/desperdicio** — basado en el factor de residuo
- **Electricidad** — usa el precio spot en vivo de Nordpool si está disponible
- **Desgaste** — boquilla + valor de la máquina
- **Mano de obra** — tarifa por hora + tiempo de preparación
- **Coste de producción** — suma de todo lo anterior
- **Margen** — tu margen de beneficio
- **Coste total** — lo mínimo que deberías cobrar
- **Precios de venta sugeridos** — margen 2×, 2,5×, 3×

## Estrategias de precios

### Margen 2× (mínimo recomendado)
Cubre el coste de producción + gastos imprevistos. Úsalo para amigos/familia y geometrías simples.

### Margen 2,5× (estándar)
Buen equilibrio entre precio y valor. Funciona para la mayoría de productos.

### Margen 3× (premium)
Para modelos complejos, multicolor, alta calidad o mercados de nicho.

:::warning No olvides los costes ocultos
- Impresiones fallidas (5-15% de todas las impresiones fallan)
- Filamento que no se usa completamente (los últimos 50g son a menudo difíciles)
- Tiempo dedicado al servicio al cliente
- Embalaje y envío
- Mantenimiento de la impresora
:::

## Ejemplo: Fijar precio de un soporte para teléfono

| Parámetro | Valor |
|-----------|-------|
| Peso del filamento | 45g PLA |
| Tiempo de impresión | 2 horas |
| Precio spot | 1,20 kr/kWh |

**Cálculo:**
- Filamento: 45g × 0,25 kr/g = 11,25 kr
- Residuo (10%): 1,13 kr
- Electricidad: 2h × 0,15kW × 1,20 = 0,36 kr
- Desgaste: 2h × 0,15 = 0,30 kr
- Mano de obra: (2h + 10min) × 200 kr/h = 433 kr (o 0 para aficionado)
- **Coste de producción (aficionado)**: ~13 kr
- **Precio de venta 2,5×**: ~33 kr

## Guardar estimación

Haz clic en **Guardar estimación** para archivar el cálculo. Las estimaciones guardadas se encuentran en la pestaña **Guardados** en la calculadora de costes.

## Comercio electrónico

Si usas el [módulo de comercio electrónico](../integrations/ecommerce), puedes vincular estimaciones de costes directamente a pedidos para el cálculo automático de precios.
