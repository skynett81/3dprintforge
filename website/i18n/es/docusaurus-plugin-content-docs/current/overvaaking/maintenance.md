---
sidebar_position: 4
title: Mantenimiento
description: Controla el cambio de boquilla, lubricación y otras tareas de mantenimiento con recordatorios, intervalos y registro de costos
---

# Mantenimiento

El módulo de mantenimiento te ayuda a planificar y rastrear todo el mantenimiento de tus impresoras Bambu Lab — desde el cambio de boquilla hasta la lubricación de las guías.

Ir a: **https://localhost:3443/#maintenance**

## Plan de mantenimiento

Bambu Dashboard incluye intervalos de mantenimiento preconfigurados para todos los modelos de impresoras Bambu Lab:

| Tarea | Intervalo (estándar) | Modelo |
|---|---|---|
| Limpiar boquilla | Cada 200 horas | Todos |
| Cambiar boquilla (latón) | Cada 500 horas | Todos |
| Cambiar boquilla (endurecida) | Cada 2000 horas | Todos |
| Lubricar eje X | Cada 300 horas | X1C, P1S |
| Lubricar eje Z | Cada 300 horas | Todos |
| Limpiar engranaje AMS | Cada 200 horas | AMS |
| Limpiar cámara | Cada 500 horas | X1C |
| Cambiar tubo PTFE | Según sea necesario / 1000 horas | Todos |
| Calibración (completa) | Mensualmente | Todos |

Todos los intervalos se pueden personalizar por impresora.

## Registro de cambio de boquilla

1. Ve a **Mantenimiento → Boquillas**
2. Haz clic en **Registrar cambio de boquilla**
3. Completa:
   - **Fecha** — se establece automáticamente a hoy
   - **Material de boquilla** — Latón / Acero endurecido / Cobre / Rubí
   - **Diámetro de boquilla** — 0.2 / 0.4 / 0.6 / 0.8 mm
   - **Marca/modelo** — opcional
   - **Precio** — para el registro de costos
   - **Horas al cambio** — obtenido automáticamente del contador de tiempo de impresión
4. Haz clic en **Guardar**

El registro muestra todo el historial de boquillas ordenado por fecha.

:::tip Recordatorio anticipado
Establece **Avisar X horas antes** (p.ej. 50 horas) para recibir una alerta con suficiente antelación antes del próximo cambio recomendado.
:::

## Crear tareas de mantenimiento

1. Haz clic en **Nueva tarea** (ícono +)
2. Completa:
   - **Nombre de la tarea** — p.ej. «Lubricar eje Y»
   - **Impresora** — selecciona la(s) impresora(s) correspondiente(s)
   - **Tipo de intervalo** — Horas / Días / Número de impresiones
   - **Intervalo** — p.ej. 300 horas
   - **Último realizado** — indica cuándo se hizo por última vez (fecha retroactiva)
3. Haz clic en **Crear**

## Intervalos y recordatorios

Para las tareas activas se muestra:
- **Verde** — tiempo hasta el próximo mantenimiento > 50 % del intervalo restante
- **Amarillo** — tiempo hasta el próximo mantenimiento < 50 % restante
- **Naranja** — tiempo hasta el próximo mantenimiento < 20 % restante
- **Rojo** — mantenimiento vencido

### Configurar recordatorios

1. Haz clic en una tarea → **Editar**
2. Activa **Recordatorios**
3. Establece **Avisar al** p.ej. 10 % restante antes del vencimiento
4. Selecciona el canal de alerta (ver [Alertas](../funksjoner/notifications))

## Marcar como realizado

1. Encuentra la tarea en la lista
2. Haz clic en **Realizado** (ícono de marca de verificación)
3. El intervalo se restablece desde la fecha/horas de hoy
4. Se crea automáticamente una entrada de registro

## Registro de costos

Todas las tareas de mantenimiento pueden tener un costo asociado:

- **Piezas** — boquillas, tubos PTFE, lubricantes
- **Tiempo** — horas empleadas × tarifa por hora
- **Servicio externo** — reparación pagada

Los costos se suman por impresora y se muestran en el resumen de estadísticas.

## Historial de mantenimiento

Ve a **Mantenimiento → Historial** para ver:
- Todas las tareas de mantenimiento realizadas
- Fecha, horas y costo
- Quién lo realizó (en sistemas multiusuario)
- Comentarios y notas

Exporta el historial a CSV para fines contables.
