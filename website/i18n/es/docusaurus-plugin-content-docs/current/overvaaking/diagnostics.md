---
sidebar_position: 3
title: Diagnósticos
description: Puntuación de salud, gráficas de telemetría, visualización de bed mesh y monitoreo de componentes para impresoras Bambu Lab
---

# Diagnósticos

La página de diagnósticos te da una visión profunda del estado, el rendimiento y la condición de la impresora a lo largo del tiempo.

Ir a: **https://localhost:3443/#diagnostics**

## Puntuación de salud

Cada impresora calcula una **puntuación de salud** de 0–100 basada en:

| Factor | Ponderación | Descripción |
|---|---|---|
| Tasa de éxito (30d) | 30 % | Proporción de impresiones exitosas en los últimos 30 días |
| Desgaste de componentes | 25 % | Desgaste promedio de piezas críticas |
| Errores HMS (30d) | 20 % | Número y gravedad de los errores |
| Estado de calibración | 15 % | Tiempo desde la última calibración |
| Estabilidad de temperatura | 10 % | Desviación de la temperatura objetivo durante la impresión |

**Interpretación de la puntuación:**
- 🟢 80–100 — Excelente estado
- 🟡 60–79 — Bueno, pero algo merece revisión
- 🟠 40–59 — Rendimiento reducido, se recomienda mantenimiento
- 🔴 0–39 — Crítico, se requiere mantenimiento

:::tip Historial
Haz clic en el gráfico de salud para ver la evolución de la puntuación a lo largo del tiempo. Las caídas grandes pueden indicar un evento específico.
:::

## Gráficas de telemetría

La página de telemetría muestra gráficas interactivas para todos los valores de los sensores:

### Conjuntos de datos disponibles

- **Temperatura de boquilla** — real vs. objetivo
- **Temperatura de cama** — real vs. objetivo
- **Temperatura de cámara** — temperatura ambiental dentro de la máquina
- **Motor del extrusor** — consumo de corriente y temperatura
- **Velocidades de ventiladores** — cabezal de herramientas, cámara, AMS
- **Presión** (X1C) — presión de cámara para AMS
- **Aceleración** — datos de vibración (ADXL345)

### Navegar por las gráficas

1. Selecciona el **Período de tiempo**: Última hora / 24 horas / 7 días / 30 días / Personalizado
2. Selecciona la **Impresora** en el menú desplegable
3. Selecciona los **Conjuntos de datos** a mostrar (se admite selección múltiple)
4. Desplaza la rueda para acercar la línea de tiempo
5. Haz clic y arrastra para desplazarte
6. Haz doble clic para restablecer el zoom

### Exportar datos de telemetría

1. Haz clic en **Exportar** en la gráfica
2. Selecciona el formato: **CSV**, **JSON** o **PNG** (imagen)
3. Se exporta el período de tiempo y los conjuntos de datos seleccionados

## Bed Mesh

La visualización del bed mesh muestra la calibración de planitud de la placa de construcción:

1. Ve a **Diagnósticos → Bed Mesh**
2. Selecciona la impresora
3. El último mesh se muestra como una superficie 3D y mapa de calor:
   - **Azul** — más bajo que el centro (cóncavo)
   - **Verde** — aproximadamente plano
   - **Rojo** — más alto que el centro (convexo)
4. Pasa el cursor sobre un punto para ver la desviación exacta en mm

### Escanear bed mesh desde la UI

1. Haz clic en **Escanear ahora** (requiere que la impresora esté inactiva)
2. Confirma en el diálogo — la impresora inicia la calibración automáticamente
3. Espera a que el escaneo termine (aprox. 3–5 minutos)
4. El nuevo mesh se muestra automáticamente

:::warning Precalentamiento previo
El bed mesh debe escanearse con la cama caliente (50–60 °C para PLA) para una calibración precisa.
:::

## Desgaste de componentes

Ver [Predicción de desgaste](./wearprediction) para documentación detallada.

La página de diagnósticos muestra un resumen comprimido:
- Puntuación porcentual por componente
- Próximo mantenimiento recomendado
- Haz clic en **Detalles** para un análisis completo de desgaste
