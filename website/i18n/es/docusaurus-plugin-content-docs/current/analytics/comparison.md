---
sidebar_position: 6
title: Comparación de impresiones
description: Compara dos impresiones lado a lado con métricas detalladas, gráficas e imágenes de galería para análisis A/B
---

# Comparación de impresiones

La comparación de impresiones te permite analizar dos impresiones lado a lado — útil para comparar configuraciones, materiales, impresoras o versiones del mismo modelo.

Ir a: **https://localhost:3443/#comparison**

## Seleccionar impresiones para comparar

1. Ve a **Comparación de impresiones**
2. Haz clic en **Seleccionar impresión A** y busca en el historial
3. Haz clic en **Seleccionar impresión B** y busca en el historial
4. Haz clic en **Comparar** para cargar la vista de comparación

:::tip Acceso más rápido
Desde **Historial** puedes hacer clic derecho en una impresión y seleccionar **Definir como impresión A** o **Comparar con...** para saltar directamente al modo de comparación.
:::

## Comparación de métricas

Las métricas se muestran en dos columnas (A y B) con indicación de cuál es mejor:

| Métrica | Descripción |
|---|---|
| Éxito | Completada / Cancelada / Fallida |
| Duración | Tiempo total de impresión |
| Consumo de filamento | Gramos totales y por color |
| Eficiencia de filamento | % del modelo sobre el consumo total |
| Temperatura máxima de boquilla | Mayor temperatura de boquilla registrada |
| Temperatura máxima de cama | Mayor temperatura de cama registrada |
| Configuración de velocidad | Silencioso / Estándar / Sport / Turbo |
| Cambios AMS | Número de cambios de color |
| Errores HMS | Errores ocurridos durante la impresión |
| Impresora | Qué impresora se utilizó |

Las celdas con el mejor valor se muestran con fondo verde.

## Gráficas de temperatura

Se muestran dos gráficas de temperatura lado a lado (o superpuestas):

- **Vista separada** — gráfica A a la izquierda, gráfica B a la derecha
- **Vista superpuesta** — ambas en la misma gráfica con diferentes colores

Usa la vista superpuesta para ver la estabilidad de temperatura y la velocidad de calentamiento directamente.

## Imágenes de galería

Si ambas impresiones tienen capturas de hitos, se muestran en una cuadrícula:

| Impresión A | Impresión B |
|---|---|
| Imagen al 25 % A | Imagen al 25 % B |
| Imagen al 50 % A | Imagen al 50 % B |
| Imagen al 75 % A | Imagen al 75 % B |
| Imagen al 100 % A | Imagen al 100 % B |

Haz clic en una imagen para abrir la vista previa a pantalla completa con animación de deslizamiento.

## Comparación de timelapse

Si ambas impresiones tienen timelapse, los videos se muestran lado a lado:

- Reproducción sincronizada — ambas comienzan y pausan al mismo tiempo
- Reproducción independiente — controla cada video por separado

## Diferencias de configuración

El sistema resalta automáticamente las diferencias en la configuración de impresión (obtenidas de los metadatos G-code):

- Diferentes grosores de capa
- Diferentes patrones o porcentajes de relleno
- Diferentes configuraciones de soporte
- Diferentes perfiles de velocidad

Las diferencias se muestran con marcado naranja en la tabla de configuración.

## Guardar comparación

1. Haz clic en **Guardar comparación**
2. Dale un nombre a la comparación (p.ej. «PLA vs PETG - Benchy»)
3. La comparación se guarda y está disponible en **Historial → Comparaciones**

## Exportar

1. Haz clic en **Exportar**
2. Selecciona **PDF** para un informe con todas las métricas e imágenes
3. El informe se puede vincular a un proyecto para documentar la selección de materiales
