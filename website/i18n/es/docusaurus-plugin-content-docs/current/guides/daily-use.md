---
sidebar_position: 3
title: Uso diario
description: Una guía práctica para el uso diario de Bambu Dashboard — rutina matutina, monitoreo, después de la impresión y mantenimiento
---

# Uso diario

Esta guía describe cómo usar Bambu Dashboard de manera eficiente en el día a día — desde que empiezas el día hasta que apagas las luces.

## Rutina matutina

Abre el panel de control y repasa rápidamente estos puntos:

### 1. Verificar el estado de las impresoras
El panel de resumen muestra el estado de todas tus impresoras. Busca:
- **Iconos rojos** — errores que requieren atención
- **Mensajes pendientes** — advertencias HMS de la noche
- **Impresiones no terminadas** — si tuviste una impresión nocturna, ¿está lista?

### 2. Verificar los niveles del AMS
Ve a **Filamento** o consulta el widget del AMS en el panel de control:
- ¿Hay carretes con menos de 100 g? Reemplaza o pide nuevos
- ¿Está el filamento correcto en la ranura correcta para las impresiones del día?

### 3. Verificar notificaciones y eventos
En **Registro de notificaciones** (icono de campana) verás:
- Eventos que ocurrieron durante la noche
- Errores registrados automáticamente
- Códigos HMS que activaron una alarma

## Iniciar una impresión

### Desde un archivo (Bambu Studio)
1. Abre Bambu Studio
2. Carga y lamina el modelo
3. Envía a la impresora — el panel de control se actualiza automáticamente

### Desde la cola
Si has planificado impresiones con antelación:
1. Ve a **Cola**
2. Haz clic en **Iniciar siguiente** o arrastra un trabajo al principio
3. Confirma con **Enviar a impresora**

Ver la [documentación de la cola de impresión](../features/queue) para información completa sobre la gestión de la cola.

### Impresión programada (scheduler)
Para iniciar una impresión en un momento específico:
1. Ve a **Planificador**
2. Haz clic en **+ Nuevo trabajo**
3. Elige archivo, impresora y hora
4. Activa **Optimización del precio de la electricidad** para elegir automáticamente la hora más barata

Ver [Planificador](../features/scheduler) para más detalles.

## Monitorear una impresión activa

### Vista de cámara
Haz clic en el icono de la cámara en la tarjeta de la impresora. Puedes:
- Ver el feed en vivo en el panel de control
- Abrir en una pestaña separada para monitoreo en segundo plano
- Tomar una captura de pantalla manual

### Información de progreso
La tarjeta de impresión activa muestra:
- Porcentaje completado
- Tiempo estimado restante
- Capa actual / número total de capas
- Filamento activo y color

### Temperaturas
Las curvas de temperatura en tiempo real se muestran en el panel de detalles:
- Temperatura de boquilla — debe mantenerse estable dentro de ±2°C
- Temperatura de placa — importante para buena adhesión
- Temperatura de cámara — sube gradualmente, especialmente relevante para ABS/ASA

### Print Guard
Si **Print Guard** está activado, el panel de control monitorea automáticamente en busca de espaguetis y desviaciones volumétricas. Si se detecta algo:
1. La impresión se pausa
2. Recibes una notificación
3. Las imágenes de la cámara se guardan para verificación posterior

## Después de la impresión — lista de verificación

### Verificar la calidad
1. Abre la cámara y mira el resultado mientras todavía está en la placa
2. Ve a **Historial → Última impresión** para ver estadísticas
3. Agrega una nota: qué salió bien, qué se puede mejorar

### Archivar
Las impresiones en el historial nunca se archivan automáticamente — permanecen allí. Si quieres hacer limpieza:
- Haz clic en una impresión → **Archivar** para moverla al archivo
- Usa **Proyectos** para agrupar impresiones relacionadas

### Actualizar el peso del filamento
Si pesas el carrete para mayor precisión (recomendado):
1. Pesa el carrete
2. Ve a **Filamento → [Carrete]**
3. Actualiza el **Peso restante**

## Recordatorios de mantenimiento

El panel de control rastrea automáticamente los intervalos de mantenimiento. En **Mantenimiento** verás:

| Tarea | Intervalo | Estado |
|-------|-----------|--------|
| Limpiar boquilla | Cada 50 horas | Verificado automáticamente |
| Lubricar varillas | Cada 200 horas | Rastreado en el panel |
| Calibrar placa | Después del cambio de placa | Recordatorio manual |
| Limpiar AMS | Mensual | Notificación de calendario |

Activa las notificaciones de mantenimiento en **Monitoreo → Mantenimiento → Notificaciones**.

:::tip Establecer un día de mantenimiento semanal
Un día de mantenimiento fijo a la semana (por ej. domingo por la noche) te evita paradas innecesarias. Usa la función de recordatorio en el panel de control.
:::

## Precio de la electricidad — mejor momento para imprimir

Si has conectado la integración del precio de la electricidad (Nordpool / Home Assistant):

1. Ve a **Análisis → Precio de la electricidad**
2. Mira el gráfico de precios para las próximas 24 horas
3. Las horas más baratas están marcadas en verde

Usa el **Planificador** con la **Optimización del precio de la electricidad** activada — el panel de control iniciará automáticamente el trabajo en la ventana disponible más barata.

:::info Horas típicamente más baratas
La noche (01:00–06:00) es generalmente la más barata en el norte de Europa. Una impresión de 8 horas enviada a la cola la noche anterior puede ahorrarte un 30–50 % en costos de electricidad.
:::
