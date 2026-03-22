---
sidebar_position: 7
title: Timelapse
description: Activa la grabación automática de timelapse de impresiones 3D, gestiona videos y reprodúcelos directamente en el panel
---

# Timelapse

Bambu Dashboard puede tomar automáticamente fotos durante la impresión y ensamblarlas en un video timelapse. Los videos se guardan localmente y se pueden reproducir directamente en el panel.

Ir a: **https://localhost:3443/#timelapse**

## Activación

1. Ve a **Configuración → Timelapse**
2. Activa **Habilitar grabación timelapse**
3. Selecciona el **Modo de grabación**:
   - **Por capa** — una imagen por capa (recomendado para alta calidad)
   - **Basado en tiempo** — una imagen cada N segundos (p.ej. cada 30 segundos)
4. Selecciona qué impresoras deben tener timelapse activado
5. Haz clic en **Guardar**

:::tip Intervalo de imagen
«Por capa» da la animación más suave porque el movimiento es consistente. «Basado en tiempo» usa menos espacio de almacenamiento.
:::

## Configuración de grabación

| Configuración | Valor por defecto | Descripción |
|---|---|---|
| Resolución | 1280×720 | Tamaño de imagen (640×480 / 1280×720 / 1920×1080) |
| Calidad de imagen | 85 % | Calidad de compresión JPEG |
| FPS en video | 30 | Fotogramas por segundo en el video final |
| Formato de video | MP4 (H.264) | Formato de salida |
| Rotar imagen | Desactivado | Rotar 90°/180°/270° según la orientación de montaje |

:::warning Espacio de almacenamiento
Un timelapse con 500 imágenes en 1080p usa aprox. 200–400 MB antes del ensamblaje. El video MP4 final suele ser de 20–80 MB.
:::

## Almacenamiento

Las imágenes y videos timelapse se guardan en `data/timelapse/` bajo la carpeta del proyecto. La estructura se organiza por impresora e impresión:

```
data/timelapse/
├── <printer-id>/                     ← ID único de la impresora
│   ├── 2026-03-22_nombremodelo/      ← Sesión de impresión (fecha_nombremodelo)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Imágenes en bruto (eliminadas tras el ensamblaje)
│   ├── 2026-03-22_nombremodelo.mp4   ← Video timelapse final
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_soporte-telefono.mp4
├── <printer-id-2>/                   ← Más impresoras (en multi-impresora)
│   └── ...
```

:::tip Almacenamiento externo
Para ahorrar espacio en el disco del sistema, puedes crear un enlace simbólico de la carpeta timelapse a un disco externo:
```bash
# Ejemplo: mover a un disco externo montado en /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Crear enlace simbólico de vuelta
ln -s /mnt/storage/timelapse data/timelapse
```
El panel sigue el enlace simbólico automáticamente. Puedes usar cualquier disco o recurso compartido de red.
:::

## Ensamblaje automático

Cuando la impresión termina, las imágenes se ensamblan automáticamente en un video con ffmpeg:

1. Bambu Dashboard recibe el evento «print complete» de MQTT
2. Se llama a ffmpeg con las imágenes recopiladas
3. El video se guarda en la carpeta de almacenamiento
4. La página de timelapse se actualiza con el nuevo video

Puedes ver el progreso en la pestaña **Timelapse → Procesando**.

## Reproducción

1. Ve a **https://localhost:3443/#timelapse**
2. Selecciona una impresora en el menú desplegable
3. Haz clic en un video de la lista para reproducirlo
4. Usa los controles de reproducción:
   - ▶ / ⏸ — Reproducir / Pausar
   - ⏪ / ⏩ — Retroceder / Avanzar
   - Botones de velocidad: 0.5× / 1× / 2× / 4×
5. Haz clic en **Pantalla completa** para abrir a pantalla completa
6. Haz clic en **Descargar** para descargar el archivo MP4

## Eliminar timelapse

1. Selecciona el video en la lista
2. Haz clic en **Eliminar** (ícono de papelera)
3. Confirma en el diálogo

:::danger Eliminación permanente
Los videos timelapse y las imágenes en bruto eliminados no se pueden recuperar. Descarga el video primero si deseas conservarlo.
:::

## Compartir timelapse

Los videos timelapse se pueden compartir mediante un enlace de tiempo limitado:

1. Selecciona el video y haz clic en **Compartir**
2. Establece el tiempo de expiración (1 hora / 24 horas / 7 días / sin expiración)
3. Copia el enlace generado y compártelo
4. El destinatario no necesita iniciar sesión para ver el video
