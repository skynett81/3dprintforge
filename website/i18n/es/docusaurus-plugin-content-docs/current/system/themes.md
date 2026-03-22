---
sidebar_position: 4
title: Tema
description: Personaliza la apariencia de Bambu Dashboard con modo claro/oscuro/automático, 6 paletas de colores y color de acento personalizado
---

# Tema

Bambu Dashboard tiene un sistema de temas flexible que te permite personalizar la apariencia a tu gusto y situación de uso.

Ir a: **https://localhost:3443/#settings** → **Tema**

## Modo de color

Elige entre tres modos:

| Modo | Descripción |
|---|---|
| **Claro** | Fondo claro, texto oscuro — bueno en habitaciones bien iluminadas |
| **Oscuro** | Fondo oscuro, texto claro — estándar y recomendado para monitoreo |
| **Automático** | Sigue la configuración del sistema operativo (OS oscuro/claro) |

Cambia el modo en la parte superior de los ajustes de tema o mediante el atajo en la barra de navegación (ícono de luna/sol).

## Paletas de colores

Seis paletas de colores predefinidas están disponibles:

| Paleta | Color primario | Estilo |
|---|---|---|
| **Bambu** | Verde (#00C853) | Estándar, inspirado en Bambu Lab |
| **Noche azul** | Azul (#2196F3) | Tranquilo y profesional |
| **Atardecer** | Naranja (#FF6D00) | Cálido y enérgico |
| **Púrpura** | Púrpura (#9C27B0) | Creativo y distintivo |
| **Rojo** | Rojo (#F44336) | Alto contraste, llamativo |
| **Monocromático** | Gris (#607D8B) | Neutral y minimalista |

Haz clic en una paleta para previsualizarla y activarla inmediatamente.

## Color de acento personalizado

Usa tu propio color como color de acento:

1. Haz clic en **Color personalizado** debajo del selector de paleta
2. Usa el selector de color o escribe un código hexadecimal (p.ej. `#FF5722`)
3. La vista previa se actualiza en tiempo real
4. Haz clic en **Aplicar** para activar

:::tip Contraste
Asegúrate de que el color de acento tenga buen contraste con el fondo. El sistema advierte si el color puede causar problemas de legibilidad (estándar WCAG AA).
:::

## Redondeo

Ajusta el redondeo de botones, tarjetas y elementos:

| Configuración | Descripción |
|---|---|
| **Nítido** | Sin redondeo (estilo rectangular) |
| **Pequeño** | Redondeo sutil (4 px) |
| **Mediano** | Redondeo estándar (8 px) |
| **Grande** | Redondeo notable (16 px) |
| **Píldora** | Redondeo máximo (50 px) |

Desliza el control para ajustar manualmente entre 0–50 px.

## Compacidad

Personaliza la densidad de la interfaz:

| Configuración | Descripción |
|---|---|
| **Espacioso** | Más espacio entre elementos |
| **Estándar** | Equilibrado, configuración estándar |
| **Compacto** | Empaquetado más denso — más información en pantalla |

El modo compacto se recomienda para pantallas por debajo de 1080p o vista de quiosco.

## Tipografía

Selecciona la tipografía:

- **Sistema** — usa la fuente predeterminada del sistema operativo (carga rápida)
- **Inter** — clara y moderna (selección predeterminada)
- **JetBrains Mono** — monoespaciada, buena para valores numéricos
- **Nunito** — estilo más suave y redondeado

## Animaciones

Desactiva o personaliza las animaciones:

- **Completa** — todas las transiciones y animaciones activas (predeterminado)
- **Reducida** — solo las animaciones necesarias (respeta la preferencia del SO)
- **Desactivada** — sin animaciones para máximo rendimiento

:::tip Modo quiosco
Para la vista de quiosco, activa **Compacto** + **Oscuro** + **Animaciones reducidas** para un rendimiento y legibilidad óptimos a distancia. Consulta [Modo quiosco](./kiosk).
:::

## Exportar e importar configuración de tema

Comparte tu tema con otros:

1. Haz clic en **Exportar tema** — descarga un archivo `.json`
2. Comparte el archivo con otros usuarios de Bambu Dashboard
3. Ellos importan mediante **Importar tema** → selecciona el archivo
