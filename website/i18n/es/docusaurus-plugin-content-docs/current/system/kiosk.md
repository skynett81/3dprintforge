---
sidebar_position: 6
title: Modo quiosco
description: Configura 3DPrintForge como una pantalla montada en pared o vista de hub con modo quiosco y rotación automática
---

# Modo quiosco

El modo quiosco está diseñado para pantallas montadas en pared, televisores o monitores dedicados que muestran continuamente el estado de las impresoras — sin teclado, interacción con el ratón ni interfaz del navegador.

Ir a: **https://localhost:3443/#settings** → **Sistema → Quiosco**

## Qué es el modo quiosco

En el modo quiosco:
- El menú de navegación está oculto
- No hay controles interactivos visibles
- El panel se actualiza automáticamente
- La pantalla rota entre impresoras (si está configurado)
- El tiempo de espera de inactividad está desactivado

## Activar el modo quiosco mediante URL

Agrega `?kiosk=true` a la URL para activar el modo quiosco sin cambiar la configuración:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

El modo quiosco se desactiva eliminando el parámetro o agregando `?kiosk=false`.

## Configuración del quiosco

1. Ve a **Configuración → Sistema → Quiosco**
2. Configura:

| Configuración | Valor predeterminado | Descripción |
|---|---|---|
| Vista predeterminada | Vista de flota | Qué página se muestra |
| Intervalo de rotación | 30 segundos | Tiempo por impresora en la rotación |
| Modo de rotación | Solo activas | Rotar solo entre impresoras activas |
| Tema | Oscuro | Recomendado para pantallas |
| Tamaño de fuente | Grande | Legible a distancia |
| Reloj | Desactivado | Mostrar reloj en la esquina |

## Vista de flota para quiosco

La vista de flota está optimizada para el quiosco:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parámetros para la vista de flota:
- `cols=N` — número de columnas (1–6)
- `size=small|medium|large` — tamaño de tarjeta

## Rotación de impresora única

Para rotación entre impresoras individuales (una impresora a la vez):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — activar rotación
- `interval=N` — segundos por impresora

## Configuración en Raspberry Pi / NUC

Para hardware de quiosco dedicado:

### Chromium en modo quiosco (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Agrega el comando al autostart (`~/.config/autostart/bambu-kiosk.desktop`).

### Inicio de sesión automático y arranque

1. Configura el inicio de sesión automático en el sistema operativo
2. Crea una entrada de autostart para Chromium
3. Desactiva el protector de pantalla y el ahorro de energía:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Cuenta de usuario dedicada
Crea una cuenta de usuario de 3DPrintForge dedicada con rol de **Invitado** para el dispositivo quiosco. Así el dispositivo tiene solo acceso de lectura y no puede cambiar la configuración incluso si alguien accede a la pantalla.
:::

## Configuración de hub

El modo hub muestra una página de resumen con todas las impresoras y estadísticas clave — diseñado para televisores grandes:

```
https://localhost:3443/#hub?kiosk=true
```

La vista de hub incluye:
- Cuadrícula de impresoras con estado
- Cifras clave agregadas (impresiones activas, progreso total)
- Reloj y fecha
- Últimas alertas HMS
