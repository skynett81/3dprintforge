---
sidebar_position: 1
title: Descripción general de funciones
description: Descripción completa de todas las funciones de 3DPrintForge
---

# Descripción general de funciones

3DPrintForge reúne todo lo que necesita para monitorear y controlar sus impresoras Bambu Lab — en un solo lugar.

## Panel de control

El panel principal muestra el estado en tiempo real de la impresora activa:

- **Temperatura** — Medidores circulares SVG animados para la boquilla y la cama
- **Progreso** — Porcentaje de progreso con hora de finalización estimada
- **Cámara** — Vista de cámara en vivo (RTSPS → MPEG1 mediante ffmpeg)
- **Panel AMS** — Representación visual de todas las ranuras AMS con color de filamento
- **Control de velocidad** — Deslizador para ajustar la velocidad (Silencioso, Estándar, Sport, Turbo)
- **Paneles de estadísticas** — Paneles estilo Grafana con gráficos desplazables
- **Telemetría** — Valores en vivo para ventiladores, temperaturas, presión

Los paneles se pueden reorganizar mediante arrastrar y soltar. Use el botón de bloqueo para fijar el diseño.

## Inventario de filamentos

Consulte [Filamento](./filament) para la documentación completa.

- Gestione todas las bobinas con nombre, color, peso y fabricante
- Sincronización AMS — vea qué bobinas están cargadas en el AMS
- Registro de secado y plan de secado
- Tarjetas de color y compatibilidad con etiquetas NFC
- Importación/exportación (CSV)

## Historial de impresión

Consulte [Historial](./history) para la documentación completa.

- Registro completo de todas las impresiones
- Seguimiento de filamentos por impresión
- Enlaces a modelos de MakerWorld
- Estadísticas y exportación a CSV

## Planificador

Consulte [Planificador](./scheduler) para la documentación completa.

- Vista de calendario de impresiones
- Cola de impresión con priorización
- Asignación multi-impresora

## Control de la impresora

Consulte [Control](./controls) para la documentación completa.

- Control de temperatura (boquilla, cama, cámara)
- Control del perfil de velocidad
- Control de ventiladores
- Consola G-code
- Carga/descarga de filamento

## Notificaciones

3DPrintForge admite 7 canales de notificación:

| Canal | Eventos |
|-------|---------|
| Telegram | Impresión terminada, error, pausa |
| Discord | Impresión terminada, error, pausa |
| Correo electrónico | Impresión terminada, error |
| ntfy | Todos los eventos |
| Pushover | Todos los eventos |
| SMS (Twilio) | Errores críticos |
| Webhook | Carga útil personalizada |

Configure en **Configuración → Notificaciones**.

## Print Guard

Print Guard monitorea la impresión activa mediante la cámara (xcam) y sensores:

- Pausa automática en caso de error de espagueti
- Nivel de sensibilidad configurable
- Registro de eventos detectados

## Mantenimiento

La sección de mantenimiento realiza un seguimiento de:

- Próximo mantenimiento recomendado por componente (boquilla, placas, AMS)
- Seguimiento del desgaste basado en el historial de impresión
- Registro manual de tareas de mantenimiento

## Multi-impresora

Con el soporte multi-impresora puede:

- Gestionar varias impresoras desde un solo panel
- Cambiar entre impresoras con el selector de impresoras
- Ver el resumen de estado de todas las impresoras simultáneamente
- Distribuir trabajos de impresión con la cola de impresión

## Overlay OBS

Una página `obs.html` dedicada proporciona un overlay limpio para la integración con OBS Studio durante la transmisión en vivo de impresiones.

## Actualizaciones

Actualización automática integrada a través de GitHub Releases. Notificación y actualización directamente desde el panel en **Configuración → Actualización**.
