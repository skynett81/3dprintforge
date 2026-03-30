---
sidebar_position: 6
title: Análisis de patrones de error
description: Análisis basado en IA de patrones de error, correlaciones entre errores y factores ambientales, y sugerencias concretas de mejora
---

# Análisis de patrones de error

El análisis de patrones de error utiliza datos históricos de impresiones y errores para identificar patrones, causas y correlaciones — y te ofrece sugerencias concretas de mejora.

Ir a: **https://localhost:3443/#error-analysis**

## Qué se analiza

El sistema analiza los siguientes puntos de datos:

- Códigos de error HMS y marcas de tiempo
- Tipo de filamento y proveedor al momento del error
- Temperatura al momento del error (boquilla, cama, cámara)
- Velocidad y perfil de impresión
- Hora del día y día de la semana
- Tiempo desde el último mantenimiento
- Modelo de impresora y versión de firmware

## Análisis de correlaciones

El sistema busca correlaciones estadísticas entre errores y factores:

**Ejemplos de correlaciones detectadas:**
- «El 78 % de los errores de bloqueo AMS ocurren con filamento del proveedor X»
- «El atasco de boquilla ocurre 3× con más frecuencia tras 6+ horas de impresión continua»
- «Los errores de adhesión aumentan con temperatura de cámara por debajo de 18 °C»
- «Los errores de stringing correlacionan con humedad superior al 60 % (si hay higrómetro conectado)»

Las correlaciones con significación estadística (p < 0.05) se muestran en la parte superior.

:::info Requisito de datos
El análisis es más preciso con un mínimo de 50 impresiones en el historial. Con menos impresiones, se muestran estimados con baja confianza.
:::

## Sugerencias de mejora

Basándose en los análisis, se generan sugerencias concretas:

| Tipo de sugerencia | Ejemplo |
|---|---|
| Filamento | «Cambia a otro proveedor para PA-CF — 3 de 4 errores usaron ProveedorX» |
| Temperatura | «Aumenta la temperatura de cama 5 °C para PETG — se estima reducción del 60 % en errores de adhesión» |
| Velocidad | «Reduce la velocidad al 80 % tras 4 horas — se estima reducción del 45 % en bloqueos de boquilla» |
| Mantenimiento | «Limpia el engranaje del extrusor — el desgaste correlaciona con el 40 % de los errores de extrusión» |
| Calibración | «Ejecuta nivelación de cama — 12 de 15 errores de adhesión de la semana pasada correlacionan con calibración incorrecta» |

Cada sugerencia muestra:
- Efecto estimado (reducción porcentual de errores)
- Confianza (baja / media / alta)
- Implementación paso a paso
- Enlace a la documentación relevante

## Impacto en la puntuación de salud

El análisis se vincula a la puntuación de salud (ver [Diagnósticos](./diagnostics)):

- Muestra qué factores reducen más la puntuación
- Estima la mejora de la puntuación al implementar cada sugerencia
- Prioriza las sugerencias según la mejora potencial de la puntuación

## Vista de línea de tiempo

Ve a **Análisis de errores → Línea de tiempo** para ver un resumen cronológico:

1. Selecciona la impresora y el período de tiempo
2. Los errores se muestran como puntos en la línea de tiempo, codificados por color según el tipo
3. Las líneas horizontales marcan las tareas de mantenimiento
4. Los grupos de errores (muchos errores en poco tiempo) aparecen resaltados en rojo

Haz clic en un grupo para abrir el análisis de ese período específico.

## Informes

Genera un informe PDF del análisis de errores:

1. Haz clic en **Generar informe**
2. Selecciona el período de tiempo (p.ej. últimos 90 días)
3. Selecciona el contenido: correlaciones, sugerencias, línea de tiempo, puntuación de salud
4. Descarga el PDF o envíalo por correo electrónico

Los informes se guardan bajo los proyectos si la impresora está vinculada a un proyecto.

:::tip Revisión semanal
Configura un informe semanal automático por correo electrónico en **Configuración → Informes** para mantenerte al día sin visitar el panel manualmente. Ver [Informes](../system/reports).
:::
