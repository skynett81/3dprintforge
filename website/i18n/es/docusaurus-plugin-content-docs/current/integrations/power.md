---
sidebar_position: 3
title: Medición de consumo
description: Mide el consumo real de electricidad por impresión con Shelly o Tasmota y vincúlalo al resumen de costos
---

# Medición de consumo

Conecta un enchufe inteligente con medición de energía a la impresora para registrar el consumo real de electricidad por impresión — no solo estimaciones.

Ir a: **https://localhost:3443/#settings** → **Integraciones → Medición de consumo**

## Dispositivos compatibles

| Dispositivo | Protocolo | Recomendación |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Recomendado — configuración sencilla |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Para instalación fija |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Modelos más nuevos con API extendida |
| **Dispositivos Tasmota** | MQTT | Flexible para configuraciones personalizadas |

:::tip Dispositivo recomendado
Shelly Plug S Plus con firmware 1.0+ está probado y recomendado. Soporta Wi-Fi, MQTT y HTTP REST sin dependencia de la nube.
:::

## Configuración con Shelly

### Requisitos previos

- El enchufe Shelly está conectado a la misma red que 3DPrintForge
- El Shelly está configurado con IP estática o reserva DHCP

### Configuración

1. Ve a **Configuración → Medición de consumo**
2. Haz clic en **Agregar medidor de consumo**
3. Selecciona el **Tipo**: Shelly
4. Completa:
   - **Dirección IP**: p.ej. `192.168.1.150`
   - **Canal**: 0 (para enchufes de salida única)
   - **Autenticación**: usuario y contraseña si está configurado
5. Haz clic en **Probar conexión**
6. Vincula el enchufe a una **Impresora**: selecciona del menú desplegable
7. Haz clic en **Guardar**

### Intervalo de sondeo

El intervalo de sondeo estándar es de 10 segundos. Redúcelo a 5 para mediciones más precisas, auméntalo a 30 para menor carga de red.

## Configuración con Tasmota

1. Configura el dispositivo Tasmota con MQTT (consulta la documentación de Tasmota)
2. En 3DPrintForge: selecciona **Tipo**: Tasmota
3. Ingresa el topic MQTT del dispositivo: p.ej. `tasmota/power-plug-1`
4. Vincula a la impresora y haz clic en **Guardar**

3DPrintForge se suscribe automáticamente a `{topic}/SENSOR` para las mediciones de potencia.

## Qué se mide

Cuando la medición de consumo está activa, se registra lo siguiente por impresión:

| Métrica | Descripción |
|---|---|
| **Potencia instantánea** | Vatios durante la impresión (en vivo) |
| **Consumo total de energía** | kWh para toda la impresión |
| **Potencia promedio** | kWh / tiempo de impresión |
| **Costo de energía** | kWh × precio de electricidad (de Tibber/Nordpool) |

Los datos se guardan en el historial de impresiones y están disponibles para análisis.

## Vista en vivo

El consumo instantáneo de potencia se muestra en:

- **El panel** — como un widget adicional (activar en la configuración de widgets)
- **La vista de flota** — como un pequeño indicador en la tarjeta de la impresora

## Comparación con la estimación

Después de la impresión se muestra una comparación:

| | Estimado | Real |
|---|---|---|
| Consumo de energía | 1.17 kWh | 1.09 kWh |
| Costo de electricidad | $2.16 | $2.02 |
| Diferencia | — | -6.8 % |

Una diferencia consistente puede usarse para calibrar las estimaciones en la [Calculadora de costos](../analytics/costestimator).

## Apagar la impresora automáticamente

Shelly/Tasmota puede apagar la impresora automáticamente al terminar la impresión:

1. Ve a **Medición de consumo → [Impresora] → Apagado automático**
2. Activa **Apagar X minutos después de terminar la impresión**
3. Establece el tiempo de espera (p.ej. 10 minutos)

:::danger Enfriamiento
Deja que la impresora se enfríe al menos 5–10 minutos después de terminar la impresión antes de cortar la corriente. La boquilla debe enfriarse por debajo de 50 °C para evitar el "heat creep" en el hotend.
:::
