---
sidebar_position: 8
title: Galería
description: Visualiza capturas automáticas tomadas al 25, 50, 75 y 100 % del progreso para todas las impresiones
---

# Galería

La galería recopila capturas automáticas tomadas durante cada impresión. Las imágenes se toman en hitos fijos y te dan un registro visual del progreso de la impresión.

Ir a: **https://localhost:3443/#gallery**

## Capturas en hitos

Bambu Dashboard toma automáticamente una captura de la cámara en los siguientes hitos:

| Hito | Momento |
|---|---|
| **25 %** | Un cuarto de la impresión |
| **50 %** | A la mitad |
| **75 %** | Tres cuartos de la impresión |
| **100 %** | Impresión completada |

Las capturas se vinculan a la entrada correspondiente del historial de impresión y se muestran en la galería.

:::info Requisitos
Las capturas de hitos requieren que la cámara esté conectada y activa. Las cámaras desactivadas no generan imágenes.
:::

## Activar la función de captura

1. Ve a **Configuración → Galería**
2. Activa **Capturas automáticas en hitos**
3. Elige qué hitos activar (los cuatro están activados por defecto)
4. Elige **Calidad de imagen**: Baja (640×360) / Media (1280×720) / Alta (1920×1080)
5. Haz clic en **Guardar**

## Visualización de imágenes

La galería está organizada por impresión:

1. Usa el **filtro** en la parte superior para seleccionar impresora, fecha o nombre de archivo
2. Haz clic en una fila de impresión para expandirla y ver las cuatro imágenes
3. Haz clic en una imagen para abrir la vista previa

### Vista previa

La vista previa muestra:
- Imagen a tamaño completo
- Hito y marca de tiempo
- Nombre de impresión e impresora
- **←** / **→** para navegar entre imágenes de la misma impresión

## Vista de pantalla completa

Haz clic en **Pantalla completa** (o presiona `F`) en la vista previa para llenar toda la pantalla. Usa las flechas del teclado para navegar entre imágenes.

## Descargar imágenes

- **Imagen individual**: Haz clic en **Descargar** en la vista previa
- **Todas las imágenes de una impresión**: Haz clic en **Descargar todas** en la fila de impresión — recibirás un archivo `.zip`
- **Selección múltiple**: Marca las casillas de verificación y haz clic en **Descargar seleccionadas**

## Eliminar imágenes

:::warning Espacio de almacenamiento
Las imágenes de la galería pueden ocupar un espacio considerable con el tiempo. Configura la eliminación automática de imágenes antiguas.
:::

### Eliminación manual

1. Selecciona una o más imágenes (marca la casilla)
2. Haz clic en **Eliminar seleccionadas**
3. Confirma en el diálogo

### Limpieza automática

1. Ve a **Configuración → Galería → Limpieza automática**
2. Activa **Eliminar imágenes de más de**
3. Establece el número de días (p.ej. 90 días)
4. La limpieza se ejecuta automáticamente cada noche a las 03:00

## Vínculo con el historial de impresión

Cada imagen está vinculada a una entrada de impresión en el historial:

- Haz clic en **Ver en historial** en una impresión de la galería para saltar a la entrada del historial
- En el historial se muestra una miniatura de la imagen del 100 % si existe

## Compartir

Comparte una imagen de la galería mediante un enlace de tiempo limitado:

1. Abre la imagen en la vista previa
2. Haz clic en **Compartir**
3. Elige el tiempo de expiración y copia el enlace
