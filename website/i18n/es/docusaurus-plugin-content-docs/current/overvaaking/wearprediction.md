---
sidebar_position: 5
title: Predicción de desgaste
description: Análisis predictivo de 8 componentes de la impresora con cálculo de vida útil, alertas de mantenimiento y pronóstico de costos
---

# Predicción de desgaste

La predicción de desgaste calcula la vida útil esperada de los componentes críticos basándose en el uso real, el tipo de filamento y el comportamiento de la impresora — para que puedas planificar el mantenimiento de forma proactiva en lugar de reactiva.

Ir a: **https://localhost:3443/#wear**

## Componentes monitoreados

Bambu Dashboard rastrea el desgaste de 8 componentes por impresora:

| Componente | Factor principal de desgaste | Vida útil típica |
|---|---|---|
| **Boquilla (latón)** | Tipo de filamento + horas | 300–800 horas |
| **Boquilla (endurecida)** | Horas + material abrasivo | 1500–3000 horas |
| **Tubo PTFE** | Horas + temperatura alta | 500–1500 horas |
| **Engranaje del extrusor** | Horas + material abrasivo | 1000–2000 horas |
| **Guía eje X (CNC)** | Número de impresiones + velocidad | 2000–5000 horas |
| **Superficie de la placa** | Número de impresiones + temperatura | 200–500 impresiones |
| **Engranaje AMS** | Número de cambios de filamento | 5000–15000 cambios |
| **Ventiladores de cámara** | Horas en funcionamiento | 3000–8000 horas |

## Cálculo del desgaste

El desgaste se calcula como un porcentaje acumulado (0–100 % desgastado):

```
Desgaste % = (uso real / vida útil esperada) × 100
           × multiplicador de material
           × multiplicador de velocidad
```

**Multiplicadores de material:**
- PLA, PETG: 1.0× (desgaste normal)
- ABS, ASA: 1.1× (ligeramente más agresivo)
- PA, PC: 1.2× (duro con PTFE y boquilla)
- Compuestos CF/GF: 2.0–3.0× (muy abrasivo)

:::warning Fibra de carbono
Los filamentos reforzados con fibra de carbono (CF-PLA, CF-PA, etc.) desgastan las boquillas de latón extremadamente rápido. Usa boquilla de acero endurecido y espera un desgaste 2–3× más rápido.
:::

## Cálculo de vida útil

Para cada componente se muestra:

- **Desgaste actual** — porcentaje utilizado
- **Vida útil restante estimada** — horas o impresiones
- **Fecha de expiración estimada** — basada en el uso promedio de los últimos 30 días
- **Intervalo de confianza** — margen de incertidumbre de la predicción

Haz clic en un componente para ver un gráfico detallado de la acumulación de desgaste a lo largo del tiempo.

## Alertas

Configura alertas automáticas por componente:

1. Ve a **Desgaste → Configuración**
2. Para cada componente, establece el **Umbral de alerta** (recomendado: 75 % y 90 %)
3. Selecciona el canal de alerta (ver [Alertas](../funksjoner/notifications))

**Ejemplo de mensaje de alerta:**
> ⚠️ Boquilla (latón) en Mi X1C está desgastada al 78 %. Vida útil estimada: ~45 horas. Recomendado: Planifica el cambio de boquilla.

## Costo de mantenimiento

El módulo de desgaste se integra con el registro de costos:

- **Costo por componente** — precio de la pieza de repuesto
- **Costo total de reemplazo** — suma para todos los componentes que se acercan al límite
- **Pronóstico para los próximos 6 meses** — costo estimado de mantenimiento futuro

Ingresa los precios de los componentes en **Desgaste → Precios**:

1. Haz clic en **Establecer precios**
2. Completa el precio por unidad para cada componente
3. El precio se usa en los pronósticos de costos y puede variar por modelo de impresora

## Restablecer el contador de desgaste

Tras el mantenimiento, restablece el contador del componente correspondiente:

1. Ve a **Desgaste → [Nombre del componente]**
2. Haz clic en **Marcar como reemplazado**
3. Completa:
   - Fecha del cambio
   - Costo (opcional)
   - Nota (opcional)
4. El contador de desgaste se restablece y se recalcula

Los restablecimientos aparecen en el historial de mantenimiento.

:::tip Calibración
Compara la predicción de desgaste con datos de experiencia real y ajusta los parámetros de vida útil en **Desgaste → Configurar vida útil** para adaptar los cálculos a tu uso real.
:::
