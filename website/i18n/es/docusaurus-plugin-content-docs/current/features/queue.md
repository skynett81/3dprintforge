---
sidebar_position: 5
title: Cola de impresión
description: Planifica y automatiza impresiones con cola prioritaria, despacho automático e inicio escalonado
---

# Cola de impresión

La cola de impresión te permite planificar impresiones con anticipación y enviarlas automáticamente a las impresoras disponibles cuando estén libres.

Ir a: **https://localhost:3443/#queue**

## Crear una cola

1. Ve a **Cola de impresión** en el menú de navegación
2. Haz clic en **Nuevo trabajo** (ícono +)
3. Completa:
   - **Nombre de archivo** — sube `.3mf` o `.gcode`
   - **Impresora objetivo** — selecciona una impresora específica o **Automático**
   - **Prioridad** — Baja / Normal / Alta / Crítica
   - **Inicio planificado** — ahora o una fecha/hora específica
4. Haz clic en **Agregar a la cola**

:::tip Arrastrar y soltar
Puedes arrastrar archivos directamente desde el explorador de archivos a la página de la cola para agregarlos rápidamente.
:::

## Agregar archivos

### Subir archivo

1. Haz clic en **Subir** o arrastra un archivo al campo de carga
2. Formatos soportados: `.3mf`, `.gcode`, `.bgcode`
3. El archivo se guarda en la biblioteca de archivos y se vincula al trabajo de la cola

### Desde la biblioteca de archivos

1. Ve a **Biblioteca de archivos** y encuentra el archivo
2. Haz clic en **Agregar a la cola** en el archivo
3. El trabajo se crea con la configuración predeterminada — edítala si es necesario

### Desde el historial

1. Abre una impresión anterior en **Historial**
2. Haz clic en **Imprimir de nuevo**
3. El trabajo se agrega con la misma configuración que la vez anterior

## Prioridad

La cola se procesa en orden de prioridad:

| Prioridad | Color | Descripción |
|---|---|---|
| Crítica | Rojo | Se envía a la primera impresora disponible independientemente de otros trabajos |
| Alta | Naranja | Delante de los trabajos normales y bajos |
| Normal | Azul | Orden estándar (FIFO) |
| Baja | Gris | Se envía solo cuando no hay trabajos de mayor prioridad esperando |

Arrastra y suelta trabajos en la cola para cambiar el orden manualmente dentro del mismo nivel de prioridad.

## Despacho automático

Cuando el **Despacho automático** está activado, Bambu Dashboard monitorea todas las impresoras y envía el siguiente trabajo automáticamente:

1. Ve a **Configuración → Cola**
2. Activa **Despacho automático**
3. Selecciona la **Estrategia de despacho**:
   - **Primera disponible** — envía a la primera impresora que quede libre
   - **Menos usada** — prioriza la impresora con menos impresiones hoy
   - **Round-robin** — rota equitativamente entre todas las impresoras

:::warning Confirmación
Activa **Requerir confirmación** en la configuración si quieres aprobar cada despacho manualmente antes de enviar el archivo.
:::

## Inicio escalonado

El inicio escalonado es útil para evitar que todas las impresoras comiencen y terminen al mismo tiempo:

1. En el diálogo **Nuevo trabajo**, expande **Configuración avanzada**
2. Activa **Inicio escalonado**
3. Establece el **Retraso entre impresoras** (p.ej. 30 minutos)
4. El sistema distribuye los tiempos de inicio automáticamente

**Ejemplo:** 4 trabajos idénticos con 30 minutos de retraso comienzan a las 08:00, 08:30, 09:00 y 09:30.

## Estado de la cola y seguimiento

La vista de la cola muestra todos los trabajos con su estado:

| Estado | Descripción |
|---|---|
| Esperando | El trabajo está en la cola esperando impresora |
| Planificado | Tiene una hora de inicio programada en el futuro |
| Enviando | Se está transfiriendo a la impresora |
| Imprimiendo | En curso en la impresora seleccionada |
| Completado | Terminado — vinculado al historial |
| Fallido | Error al enviar o durante la impresión |
| Cancelado | Cancelado manualmente |

:::info Alertas
Activa alertas para eventos de la cola en **Configuración → Alertas → Cola** para recibir notificaciones cuando un trabajo comienza, completa o falla. Ver [Alertas](./notifications).
:::
