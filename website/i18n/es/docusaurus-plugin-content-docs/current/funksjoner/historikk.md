---
sidebar_position: 3
title: Historial de impresión
description: Registro completo de todas las impresiones con estadísticas, rastreo de filamento y exportación
---

# Historial de impresión

El historial de impresión ofrece un registro completo de todas las impresiones realizadas con el panel, incluyendo estadísticas, consumo de filamento y enlaces a las fuentes del modelo.

## Tabla del historial

La tabla muestra todas las impresiones con:

| Columna | Descripción |
|---------|-------------|
| Fecha/hora | Hora de inicio |
| Nombre del modelo | Nombre del archivo o título de MakerWorld |
| Impresora | Qué impresora se utilizó |
| Duración | Tiempo total de impresión |
| Filamento | Material y gramos usados |
| Placas | Número de capas y peso (g) |
| Estado | Completada, cancelada, fallida |
| Imagen | Miniatura (con integración cloud) |

## Búsqueda y filtrado

Usa el campo de búsqueda y los filtros para encontrar impresiones:

- Búsqueda de texto libre por nombre del modelo
- Filtrar por impresora, material, estado, fecha
- Ordenar por todas las columnas

## Enlaces a la fuente del modelo

Si la impresión fue iniciada desde MakerWorld, se muestra un enlace directo a la página del modelo. Haz clic en el nombre del modelo para abrir MakerWorld en una nueva pestaña.

:::info Bambu Cloud
Los enlaces de modelos y miniaturas requieren la integración Bambu Cloud. Ver [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Rastreo de filamento

Para cada impresión se registra:

- **Material** — PLA, PETG, ABS, etc.
- **Gramos usados** — consumo estimado
- **Bobina** — qué bobina se usó (si está registrada en el inventario)
- **Color** — código hexadecimal del color

Esto proporciona una imagen precisa del consumo de filamento a lo largo del tiempo y te ayuda a planificar las compras.

## Estadísticas

En **Historial → Estadísticas** encontrarás datos agregados:

- **Total de impresiones** — y tasa de éxito
- **Tiempo total de impresión** — horas y días
- **Consumo de filamento** — gramos y km por material
- **Impresiones por día** — gráfico de tendencia
- **Materiales más usados** — gráfico circular
- **Distribución de duración de impresión** — histograma

Las estadísticas se pueden filtrar por período de tiempo (7d, 30d, 90d, 1 año, todo).

## Exportar

### Exportación CSV
Exporta todo el historial o los resultados filtrados:
**Historial → Exportar → Descargar CSV**

Los archivos CSV contienen todas las columnas y se pueden abrir en Excel, LibreOffice Calc o importar en otras herramientas.

### Copia de seguridad automática
El historial forma parte de la base de datos SQLite que se respalda automáticamente en las actualizaciones. Copia de seguridad manual en **Configuración → Copia de seguridad**.

## Edición

Puedes editar entradas del registro de impresión posteriormente:

- Corregir el nombre del modelo
- Agregar notas
- Corregir el consumo de filamento
- Eliminar impresiones registradas incorrectamente

Haz clic derecho en una fila y selecciona **Editar** o haz clic en el ícono de lápiz.
