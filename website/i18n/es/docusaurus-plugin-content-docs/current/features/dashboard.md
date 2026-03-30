---
sidebar_position: 2
title: Panel principal
description: Vista en tiempo real de la impresora activa con visualización 3D del modelo, estado del AMS, cámara y widgets personalizables
---

# Panel principal

El panel principal es el centro de control central de Bambu Dashboard. Muestra el estado en tiempo real de la impresora seleccionada y te permite monitorear, controlar y personalizar la vista según tus necesidades.

Ir a: **https://localhost:3443/**

## Vista en tiempo real

Cuando una impresora está activa, todos los valores se actualizan continuamente vía MQTT:

- **Temperatura de boquilla** — medidor de anillo SVG animado con temperatura objetivo
- **Temperatura de cama** — medidor de anillo equivalente para la placa de construcción
- **Porcentaje de progreso** — gran indicador de porcentaje con tiempo restante
- **Contador de capas** — capa actual / total de capas
- **Velocidad** — Silencioso / Estándar / Sport / Turbo con deslizador

:::tip Actualización en tiempo real
Todos los valores se actualizan directamente desde la impresora vía MQTT sin recargar la página. El retraso es típicamente inferior a 1 segundo.
:::

## Visualización 3D del modelo

Si la impresora envía un archivo `.3mf` con el modelo, se muestra una previsualización 3D interactiva:

1. El modelo se carga automáticamente cuando comienza una impresión
2. Rota el modelo arrastrando con el ratón
3. Desplaza la rueda para acercar/alejar
4. Haz clic en **Restablecer** para volver a la vista predeterminada

:::info Compatibilidad
La visualización 3D requiere que la impresora envíe datos del modelo. No todos los trabajos de impresión incluyen esto.
:::

## Estado del AMS

El panel AMS muestra todas las unidades AMS montadas con sus ranuras y filamento:

- **Color de ranura** — representación visual del color de los metadatos de Bambu
- **Nombre del filamento** — material y marca
- **Ranura activa** — marcada con animación de pulso durante la impresión
- **Errores** — indicador rojo en caso de error AMS (bloqueo, vacío, húmedo)

Haz clic en una ranura para ver la información completa del filamento y vincularla al inventario.

## Feed de cámara

La vista de cámara en vivo se convierte vía ffmpeg (RTSPS → MPEG1):

1. La cámara se inicia automáticamente cuando abres el panel
2. Haz clic en la imagen de la cámara para abrir a pantalla completa
3. Usa el botón **Captura** para tomar una imagen fija
4. Haz clic en **Ocultar cámara** para liberar espacio

:::warning Rendimiento
El stream de cámara consume aprox. 2–5 Mbit/s. Desactiva la cámara en conexiones de red lentas.
:::

## Sparklines de temperatura

Debajo del panel AMS se muestran mini gráficas (sparklines) de los últimos 30 minutos:

- Temperatura de boquilla a lo largo del tiempo
- Temperatura de cama a lo largo del tiempo
- Temperatura de cámara (donde esté disponible)

Haz clic en una sparkline para abrir la vista completa de gráficas de telemetría.

## Personalización de widgets

El panel usa una cuadrícula de arrastrar y soltar (grid layout):

1. Haz clic en **Personalizar diseño** (ícono de lápiz en la esquina superior derecha)
2. Arrastra los widgets a la posición deseada
3. Cambia el tamaño arrastrando desde la esquina
4. Haz clic en **Bloquear diseño** para fijar la posición
5. Haz clic en **Guardar** para conservar la disposición

Widgets disponibles:
| Widget | Descripción |
|---|---|
| Cámara | Vista de cámara en vivo |
| AMS | Estado de bobinas y filamento |
| Temperatura | Medidores de anillo para boquilla y cama |
| Progreso | Indicador de porcentaje y estimación de tiempo |
| Telemetría | Ventiladores, presión, velocidad |
| Modelo 3D | Visualización interactiva del modelo |
| Sparklines | Mini gráficas de temperatura |

:::tip Guardado
El diseño se guarda por usuario en el navegador (localStorage). Distintos usuarios pueden tener diseños diferentes.
:::
