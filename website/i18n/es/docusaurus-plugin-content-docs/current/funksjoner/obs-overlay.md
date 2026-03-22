---
sidebar_position: 4
title: OBS Overlay
description: Agrega un overlay de estado transparente de tu impresora Bambu Lab directamente en OBS Studio
---

# OBS Overlay

El overlay de OBS te permite mostrar el estado en tiempo real de la impresora directamente en OBS Studio — perfecto para streaming en directo o grabación de impresión 3D.

## URL del overlay

El overlay está disponible como una página web con fondo transparente:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Reemplaza `PRINTER_ID` con el ID de la impresora (se encuentra en **Configuración → Impresoras**).

### Parámetros disponibles

| Parámetro | Valor por defecto | Descripción |
|---|---|---|
| `printer` | primera impresora | ID de la impresora a mostrar |
| `theme` | `dark` | `dark`, `light` o `minimal` |
| `scale` | `1.0` | Escala (0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Transparencia (0.0–1.0) |
| `fields` | todos | Lista separada por comas: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Color de acento (hex) |

**Ejemplo con parámetros:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Configuración en OBS Studio

### Paso 1: Agregar fuente de navegador

1. Abre OBS Studio
2. Haz clic en **+** debajo de **Fuentes**
3. Selecciona **Navegador** (Browser Source)
4. Dale un nombre a la fuente, p.ej. `Bambu Overlay`
5. Haz clic en **Aceptar**

### Paso 2: Configurar la fuente de navegador

Completa lo siguiente en el diálogo de configuración:

| Campo | Valor |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=TU_ID` |
| Ancho | `400` |
| Alto | `200` |
| FPS | `30` |
| CSS personalizado | *(déjalo vacío)* |

Marca:
- ✅ **Apagar fuente cuando no es visible**
- ✅ **Actualizar el navegador cuando la escena se activa**

:::warning HTTPS y localhost
OBS puede advertir sobre certificado autofirmado. Ve primero a `https://localhost:3443` en Chrome/Firefox y acepta el certificado. OBS usará entonces la misma autorización.
:::

### Paso 3: Fondo transparente

El overlay está construido con `background: transparent`. Para que funcione en OBS:

1. **No** marques **Color de fondo personalizado** en la fuente de navegador
2. Asegúrate de que el overlay no está envuelto en un elemento opaco
3. Establece el **Modo de mezcla** a **Normal** en la fuente de OBS

:::tip Alternativa: Chroma key
Si la transparencia no funciona, usa filtro → **Chroma Key** con fondo verde:
Agrega `&bg=green` a la URL y aplica el filtro chroma key en la fuente de OBS.
:::

## Qué muestra el overlay

El overlay estándar incluye:

- **Barra de progreso** con valor porcentual
- **Tiempo restante** (estimado)
- **Temperatura de boquilla** y **temperatura de cama**
- **Ranura AMS activa** con color y nombre del filamento
- **Modelo** e nombre de la impresora (puede desactivarse)

## Modo minimal para streaming

Para un overlay discreto durante el streaming:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Esto muestra solo una pequeña barra de progreso con el tiempo restante en la esquina.
