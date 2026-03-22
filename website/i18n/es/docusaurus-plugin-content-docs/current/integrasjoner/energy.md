---
sidebar_position: 2
title: Precio de la electricidad
description: Conecta con Tibber o Nordpool para precios en tiempo real por hora, historial de precios y alertas de precio
---

# Precio de la electricidad

La integración de precio de electricidad obtiene precios en tiempo real de Tibber o Nordpool para proporcionar cálculos precisos del costo de electricidad por impresión y alertas sobre buenos o malos momentos para imprimir.

Ir a: **https://localhost:3443/#settings** → **Integraciones → Precio de electricidad**

## Integración con Tibber

Tibber es un proveedor de electricidad con una API abierta para precios spot.

### Configuración

1. Inicia sesión en [developer.tibber.com](https://developer.tibber.com)
2. Genera un **Personal Access Token**
3. En Bambu Dashboard: pega el token en **Token API de Tibber**
4. Selecciona **Hogar** (de dónde obtener los precios, si tienes varios hogares)
5. Haz clic en **Probar conexión**
6. Haz clic en **Guardar**

### Datos disponibles de Tibber

- **Precio spot actual** — precio instantáneo incluyendo impuestos
- **Precios para las próximas 24 horas** — Tibber entrega los precios del día siguiente desde aprox. las 13:00
- **Historial de precios** — hasta 30 días hacia atrás
- **Costo por impresión** — calculado según el tiempo real de impresión × precios por hora

## Integración con Nordpool

Nordpool es la bolsa de energía que entrega precios spot brutos para la región nórdica.

### Configuración

1. Ve a **Integraciones → Nordpool**
2. Selecciona **Área de precio**: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen)
3. Selecciona **Moneda**: NOK / EUR
4. Selecciona **Impuestos y tasas**:
   - Marca **Incluir IVA** (25 %)
   - Ingresa **Tarifa de red** (NOK/kWh) — consulta la factura de tu empresa de red
   - Ingresa **Impuesto al consumo** (NOK/kWh)
5. Haz clic en **Guardar**

:::info Tarifa de red
La tarifa de red varía según la empresa de distribución y el modelo de precios. Consulta tu última factura de electricidad para obtener la tasa correcta.
:::

## Precios por hora

Los precios por hora se muestran como un gráfico de barras para las próximas 24–48 horas:

- **Verde** — horas baratas (por debajo del promedio)
- **Amarillo** — precio promedio
- **Rojo** — horas caras (por encima del promedio)
- **Gris** — horas sin proyección de precio disponible

Pasa el cursor sobre una hora para ver el precio exacto.

## Historial de precios

Ve a **Precio de electricidad → Historial** para ver:

- Precio promedio diario de los últimos 30 días
- Hora más cara y más barata por día
- Costo total de electricidad para impresiones por día

## Alertas de precio

Configura alertas automáticas basadas en el precio de la electricidad:

1. Ve a **Precio de electricidad → Alertas de precio**
2. Haz clic en **Nueva alerta**
3. Selecciona el tipo de alerta:
   - **Precio por debajo del límite** — notificar cuando el precio baje de X/kWh
   - **Precio por encima del límite** — notificar cuando el precio suba sobre X/kWh
   - **Hora más barata del día** — notificar cuando empiece la hora más barata del día
4. Selecciona el canal de alerta
5. Haz clic en **Guardar**

:::tip Planificación inteligente
Combina las alertas de precio con la cola de impresión: configura una automatización que envíe trabajos de la cola automáticamente cuando el precio de la electricidad sea bajo (requiere integración de webhook o Home Assistant).
:::

## Precio de electricidad en la calculadora de costos

La integración de precio de electricidad activada proporciona costos de electricidad precisos en la [Calculadora de costos](../analyse/costestimator). Selecciona **Precio en vivo** en lugar de precio fijo para usar el precio actual de Tibber/Nordpool.
