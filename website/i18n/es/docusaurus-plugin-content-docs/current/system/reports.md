---
sidebar_position: 7
title: Informes
description: Informes automáticos semanales y mensuales por correo electrónico con estadísticas, resumen de actividad y recordatorios de mantenimiento
---

# Informes

Bambu Dashboard puede enviar informes automáticos por correo electrónico con estadísticas y resúmenes de actividad — semanales, mensuales o ambos.

Ir a: **https://localhost:3443/#settings** → **Sistema → Informes**

## Requisitos previos

Los informes requieren que las alertas por correo electrónico estén configuradas. Configura SMTP en **Configuración → Alertas → Correo electrónico** antes de activar los informes. Consulta [Alertas](../features/notifications).

## Activar informes automáticos

1. Ve a **Configuración → Informes**
2. Activa **Informe semanal** y/o **Informe mensual**
3. Selecciona el **Horario de envío**:
   - Semanal: día de la semana y hora
   - Mensual: día del mes (p.ej. 1.° día / último viernes)
4. Ingresa el **Correo electrónico del destinatario** (separado por comas para varios)
5. Haz clic en **Guardar**

Envía un informe de prueba para ver el formato: haz clic en **Enviar informe de prueba ahora**.

## Contenido del informe semanal

El informe semanal cubre los últimos 7 días:

### Resumen
- Número total de impresiones
- Número de exitosas / fallidas / canceladas
- Tasa de éxito y cambio respecto a la semana anterior
- Impresora más activa

### Actividad
- Impresiones por día (mini gráfico)
- Total de horas de impresión
- Consumo total de filamento (gramos y costo)

### Filamento
- Consumo por material y proveedor
- Estimado restante por bobina (bobinas por debajo del 20 % resaltadas)

### Mantenimiento
- Tareas de mantenimiento realizadas esta semana
- Tareas de mantenimiento vencidas (advertencia en rojo)
- Tareas que vencen la próxima semana

### Errores HMS
- Número de errores HMS esta semana por impresora
- Errores sin confirmar (requieren atención)

## Contenido del informe mensual

El informe mensual cubre los últimos 30 días e incluye todo del informe semanal, más:

### Tendencia
- Comparación con el mes anterior (%)
- Mapa de actividad (miniatura del mapa de calor del mes)
- Evolución mensual de la tasa de éxito

### Costos
- Costo total de filamento
- Costo total de electricidad (si está configurada la medición de consumo)
- Costo total de desgaste
- Costo total de mantenimiento

### Desgaste y salud
- Puntuación de salud por impresora (con cambio respecto al mes anterior)
- Componentes que se acercan al momento de reemplazo

### Destacados estadísticos
- Impresión exitosa más larga
- Tipo de filamento más utilizado
- Impresora con mayor actividad

## Personalizar el informe

1. Ve a **Configuración → Informes → Personalización**
2. Marca / desmarca las secciones que deseas incluir
3. Selecciona el **Filtro de impresoras**: todas las impresoras o una selección
4. Selecciona **Mostrar logo**: mostrar el logo de Bambu Dashboard en el encabezado o desactivarlo
5. Haz clic en **Guardar**

## Archivo de informes

Todos los informes enviados se guardan y pueden abrirse de nuevo:

1. Ve a **Configuración → Informes → Archivo**
2. Selecciona el informe de la lista (ordenado por fecha)
3. Haz clic en **Abrir** para ver la versión HTML
4. Haz clic en **Descargar PDF** para descargar el informe

Los informes se eliminan automáticamente después de **90 días** (configurable).
