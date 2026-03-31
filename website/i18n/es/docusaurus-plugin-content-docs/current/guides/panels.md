---
sidebar_position: 8
title: Navegar por el panel de control
description: Aprende a navegar por 3DPrintForge — barra lateral, paneles, atajos de teclado y personalización
---

# Navegar por el panel de control

Esta guía te da una introducción rápida a cómo está organizado el panel de control y cómo navegar de manera eficiente.

## La barra lateral

La barra lateral a la izquierda es tu centro de navegación. Está organizada en secciones:

```
┌────────────────────┐
│ 🖨  Estado impr.   │  ← Una fila por impresora
├────────────────────┤
│ Resumen            │
│ Flota              │
│ Impresión activa   │
├────────────────────┤
│ Filamento          │
│ Historial          │
│ Proyectos          │
│ Cola               │
│ Planificador       │
├────────────────────┤
│ Monitoreo          │
│  └ Print Guard     │
│  └ Errores         │
│  └ Diagnóstico     │
│  └ Mantenimiento   │
├────────────────────┤
│ Análisis           │
│ Herramientas       │
│ Integraciones      │
│ Sistema            │
├────────────────────┤
│ ⚙ Configuración   │
└────────────────────┘
```

**La barra lateral puede ocultarse** haciendo clic en el icono de hamburguesa (☰) en la parte superior izquierda. Útil en pantallas más pequeñas o en modo quiosco.

## El panel principal

Cuando haces clic en un elemento de la barra lateral, el contenido se muestra en el panel principal a la derecha. El diseño varía:

| Panel | Diseño |
|-------|--------|
| Resumen | Cuadrícula de tarjetas con todas las impresoras |
| Impresión activa | Tarjeta de detalle grande + curvas de temperatura |
| Historial | Tabla filtrable |
| Filamento | Vista de tarjetas con carretes |
| Análisis | Gráficos y diagramas |

## Hacer clic en el estado de la impresora para detalles

La tarjeta de impresora en el panel de resumen es clicable:

**Clic simple** → Abre el panel de detalle para esa impresora:
- Temperaturas en tiempo real
- Impresión activa (si está en progreso)
- Estado del AMS con todas las ranuras
- Últimos errores y eventos
- Botones rápidos: Pausar, Detener, Luz encendida/apagada

**Clic en el icono de cámara** → Abre la vista de cámara en vivo

**Clic en el icono ⚙** → Configuración de la impresora

## Atajo de teclado — paleta de comandos

La paleta de comandos ofrece acceso rápido a todas las funciones sin navegar:

| Atajo | Acción |
|-------|--------|
| `Ctrl + K` (Linux/Windows) | Abrir la paleta de comandos |
| `Cmd + K` (macOS) | Abrir la paleta de comandos |
| `Esc` | Cerrar la paleta |

En la paleta de comandos puedes:
- Buscar páginas y funciones
- Iniciar una impresión directamente
- Pausar / reanudar impresiones activas
- Cambiar el tema (claro/oscuro)
- Navegar a cualquier página

**Ejemplo:** Pulsa `Ctrl+K`, escribe "pausa" → selecciona "Pausar todas las impresiones activas"

## Personalización de widgets

El panel de resumen puede personalizarse con widgets de tu elección:

**Para editar el panel de control:**
1. Haz clic en **Editar diseño** (icono de lápiz) en la parte superior derecha del panel de resumen
2. Arrastra los widgets a la posición deseada
3. Haz clic y arrastra la esquina de un widget para cambiar el tamaño
4. Haz clic en **+ Agregar widget** para añadir nuevos:

Widgets disponibles:

| Widget | Muestra |
|--------|---------|
| Estado de impresoras | Tarjetas para todas las impresoras |
| Impresión activa (grande) | Vista detallada de la impresión en progreso |
| Vista general del AMS | Todas las ranuras y niveles de filamento |
| Curva de temperatura | Gráfico en tiempo real |
| Precio de la electricidad | Gráfico de precios de las próximas 24 horas |
| Medidor de filamento | Consumo total de los últimos 30 días |
| Acceso directo al historial | Últimas 5 impresiones |
| Feed de cámara | Imagen de cámara en vivo |

5. Haz clic en **Guardar diseño**

:::tip Guardar varios diseños
Puedes tener diferentes diseños para diferentes propósitos — uno compacto para uso diario, uno grande para mostrar en una pantalla grande. Cambia entre ellos con el selector de diseño.
:::

## Tema — cambiar entre claro y oscuro

**Cambio rápido:**
- Haz clic en el icono de sol/luna en la parte superior derecha de la navegación
- O: `Ctrl+K` → escribe "tema"

**Configuración permanente:**
1. Ve a **Sistema → Temas**
2. Elige entre:
   - **Claro** — fondo blanco
   - **Oscuro** — fondo oscuro (recomendado de noche)
   - **Automático** — sigue la configuración del sistema de tu dispositivo
3. Elige el color de acento (azul, verde, morado, etc.)
4. Haz clic en **Guardar**

## Navegación por teclado

Para una navegación eficiente sin ratón:

| Atajo | Acción |
|-------|--------|
| `Tab` | Siguiente elemento interactivo |
| `Shift+Tab` | Elemento anterior |
| `Enter` / `Espacio` | Activar botón/enlace |
| `Esc` | Cerrar modal/desplegable |
| `Ctrl+K` | Paleta de comandos |
| `Alt+1` – `Alt+9` | Navegar directamente a las 9 primeras páginas |

## PWA — instalar como aplicación

3DPrintForge puede instalarse como Progressive Web App (PWA) y ejecutarse como una aplicación independiente sin menús de navegador:

1. Abre el panel de control en Chrome, Edge o Safari
2. Haz clic en el icono **Instalar aplicación** en la barra de direcciones
3. Confirma la instalación

Ver la [documentación PWA](../system/pwa) para más detalles.

## Modo quiosco

El modo quiosco oculta toda la navegación y muestra solo el panel de control — perfecto para una pantalla dedicada en el taller de impresión:

1. Ve a **Sistema → Quiosco**
2. Activa el **Modo quiosco**
3. Elige qué widgets mostrar
4. Establece el intervalo de actualización

Ver la [documentación del modo quiosco](../system/kiosk) para la configuración completa.
