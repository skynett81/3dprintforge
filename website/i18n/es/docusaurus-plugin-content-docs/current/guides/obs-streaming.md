---
sidebar_position: 10
title: Streaming con OBS
description: Configurar 3DPrintForge como overlay en OBS Studio para streaming profesional de impresión 3D
---

# Hacer streaming de impresión 3D con OBS

3DPrintForge tiene un overlay de OBS integrado que muestra el estado de la impresora, el progreso, las temperaturas y el feed de la cámara directamente en tu stream.

## Requisitos previos

- OBS Studio instalado ([obsproject.com](https://obsproject.com))
- 3DPrintForge ejecutándose y conectado a la impresora
- (Opcional) Cámara Bambu activada para feed en vivo

## Paso 1 — OBS Browser Source

OBS tiene una **Browser Source** integrada que muestra una página web directamente en tu escena.

**Agregar el overlay en OBS:**

1. Abre OBS Studio
2. En **Fuentes** (Sources), haz clic en **+**
3. Selecciona **Navegador** (Browser)
4. Dale un nombre a la fuente, por ej. "Bambu Overlay"
5. Completa:

| Configuración | Valor |
|--------------|-------|
| URL | `http://localhost:3000/obs/overlay` |
| Ancho | `1920` |
| Alto | `1080` |
| FPS | `30` |
| CSS personalizado | Ver abajo |

6. Marca **Controlar audio a través de OBS**
7. Haz clic en **Aceptar**

:::info Adapta la URL a tu servidor
¿El panel de control se ejecuta en una máquina diferente a OBS? Reemplaza `localhost` con la dirección IP del servidor, por ej. `http://192.168.1.50:3000/obs/overlay`
:::

## Paso 2 — Fondo transparente

Para que el overlay se integre en la imagen, el fondo debe ser transparente:

**En la configuración de OBS Browser Source:**
- Marca **Eliminar fondo** (Shutdown source when not visible / Remove background)

**CSS personalizado para forzar transparencia:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Pega esto en el campo **CSS personalizado** en la configuración de Browser Source.

El overlay ahora solo muestra el propio widget — sin fondo blanco ni negro.

## Paso 3 — Personalizar el overlay

En 3DPrintForge puedes configurar qué muestra el overlay:

1. Ve a **Funciones → Overlay de OBS**
2. Configura:

| Configuración | Opciones |
|--------------|---------|
| Posición | Arriba izquierda, derecha, abajo izquierda, derecha |
| Tamaño | Pequeño, mediano, grande |
| Tema | Oscuro, claro, transparente |
| Color de acento | Elegir color que combine con el estilo del stream |
| Elementos | Elegir qué se muestra (ver abajo) |

**Elementos de overlay disponibles:**

- Nombre de impresora y estado (en línea/imprimiendo/error)
- Barra de progreso con porcentaje y tiempo restante
- Filamento y color
- Temperatura de boquilla y de placa
- Filamento usado (gramos)
- Vista general del AMS (compacta)
- Estado del Print Guard

3. Haz clic en **Vista previa** para ver el resultado sin cambiar a OBS
4. Haz clic en **Guardar**

:::tip URL por impresora
¿Tienes varias impresoras? Usa URLs de overlay separadas:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Feed de cámara en OBS (fuente separada)

La cámara Bambu puede agregarse como fuente separada en OBS — independientemente del overlay:

**Alternativa 1: A través del proxy de cámara del panel de control**

1. Ve a **Sistema → Cámara**
2. Copia la **URL de streaming RTSP o MJPEG**
3. En OBS: Haz clic en **+** → **Fuente multimedia** (Media Source)
4. Pega la URL
5. Marca **Repetir** (Loop) y desactiva archivos locales

**Alternativa 2: Browser Source con vista de cámara**

1. En OBS: Agrega una **Browser Source**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Ancho/alto: coincide con la resolución de la cámara (1080p o 720p)

Ahora puedes colocar el feed de la cámara libremente en la escena y poner el overlay encima.

## Consejos para un buen stream

### Composición de la escena de streaming

Una escena típica para streaming de impresión 3D:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Feed de cámara de la impresora]   │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Abajo izquierda│
│  │ Imp.: Logo.3mf   │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1h 24m restante  │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Configuraciones recomendadas

| Parámetro | Valor recomendado |
|-----------|------------------|
| Tamaño del overlay | Mediano (no demasiado dominante) |
| Frecuencia de actualización | 30 FPS (coincide con OBS) |
| Posición del overlay | Abajo izquierda (evita cara/chat) |
| Tema de color | Oscuro con acento azul |

### Escenas y cambio de escenas

Crea tus propias escenas OBS:

- **"Impresión en progreso"** — vista de cámara + overlay
- **"Pausa / esperando"** — imagen estática + overlay
- **"Terminado"** — imagen del resultado + overlay que muestra "Completado"

Cambia entre escenas con atajo de teclado en OBS o mediante la Colección de escenas.

### Estabilización de la imagen de la cámara

La cámara Bambu a veces puede congelarse. En el panel de control en **Sistema → Cámara**:
- Activa **Auto-reconexión** — el panel de control se reconecta automáticamente
- Establece el **Intervalo de reconexión** en 10 segundos

### Audio

Las impresoras 3D hacen ruido — especialmente el AMS y el enfriamiento. Considera:
- Colocar el micrófono lejos de la impresora
- Agregar filtro de reducción de ruido al micrófono en OBS
- O usar música de fondo / audio del chat en su lugar

:::tip Cambio automático de escena
OBS tiene soporte integrado para el cambio de escena basado en títulos. Combina con un Plugin (por ej. obs-websocket) y la API de 3DPrintForge para cambiar la escena automáticamente cuando la impresión inicia y termina.
:::
