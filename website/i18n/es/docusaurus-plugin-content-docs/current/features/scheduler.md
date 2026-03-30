---
sidebar_position: 4
title: Planificador
description: Planifica impresiones, gestiona la cola de impresión y configura el despacho automático
---

# Planificador

El planificador te permite organizar y automatizar trabajos de impresión con una vista de calendario y una cola de impresión inteligente.

## Vista de calendario

La vista de calendario ofrece un resumen de todas las impresiones planificadas y realizadas:

- **Vista mensual, semanal y diaria** — elige el nivel de detalle
- **Código de colores** — diferentes colores por impresora y estado
- **Haz clic en un evento** — ve los detalles de la impresión

Las impresiones completadas se muestran automáticamente basándose en el historial de impresión.

## Cola de impresión

La cola de impresión te permite poner trabajos en cola para enviarlos a la impresora en orden:

### Agregar trabajo a la cola

1. Haz clic en **+ Agregar trabajo**
2. Selecciona el archivo (desde SD de la impresora, carga local, o FTP)
3. Establece la prioridad (alta, normal, baja)
4. Selecciona la impresora objetivo (o "automático")
5. Haz clic en **Agregar**

### Gestión de la cola

| Acción | Descripción |
|----------|-------------|
| Arrastrar y soltar | Reorganiza el orden |
| Pausar cola | Detiene el envío temporalmente |
| Saltar | Envía el siguiente trabajo sin esperar |
| Eliminar | Quita el trabajo de la cola |

:::tip Despacho multi-impresora
Con varias impresoras, la cola puede distribuir automáticamente los trabajos a las impresoras disponibles. Activa **Despacho automático** en **Planificador → Configuración**.
:::

## Impresiones planificadas

Configura impresiones que deben comenzar en un momento específico:

1. Haz clic en **+ Planificar impresión**
2. Selecciona el archivo y la impresora
3. Establece la hora de inicio
4. Configura la alerta (opcional)
5. Guarda

:::warning La impresora debe estar disponible
Las impresiones planificadas solo comienzan si la impresora está en modo de espera a la hora indicada. Si la impresora está ocupada, el inicio se pospone hasta el próximo momento disponible (configurable).
:::

## Balanceo de carga

Con el balanceo de carga automático, los trabajos se distribuyen inteligentemente entre las impresoras:

- **Round-robin** — distribución equitativa entre todas las impresoras
- **Menos ocupada** — envía a la impresora con el tiempo de finalización estimado más corto
- **Manual** — tú eliges la impresora para cada trabajo

Configura en **Planificador → Balanceo de carga**.

## Alertas

El planificador se integra con los canales de alerta:

- Alerta cuando el trabajo comienza
- Alerta cuando el trabajo termina
- Alerta ante error o retraso

Ver [Resumen de funciones](./overview#alertas) para configurar los canales de alerta.
