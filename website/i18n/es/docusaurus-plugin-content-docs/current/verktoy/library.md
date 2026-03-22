---
sidebar_position: 2
title: Biblioteca de archivos
description: Sube y gestiona modelos 3D y archivos G-code, analiza G-code y vincula a MakerWorld y Printables
---

# Biblioteca de archivos

La biblioteca de archivos es un lugar centralizado para almacenar y gestionar todos tus modelos 3D y archivos G-code — con análisis automático de G-code e integración con MakerWorld y Printables.

Ir a: **https://localhost:3443/#library**

## Subir modelos

### Carga individual

1. Ve a **Biblioteca de archivos**
2. Haz clic en **Subir** o arrastra archivos al área de carga
3. Formatos soportados: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. El archivo se analiza automáticamente tras la carga

:::info Carpeta de almacenamiento
Los archivos se guardan en la carpeta configurada en **Configuración → Biblioteca de archivos → Carpeta de almacenamiento**. Por defecto: `./data/library/`
:::

### Carga por lotes

Arrastra y suelta una carpeta completa para subir todos los archivos soportados de una vez. Los archivos se procesan en segundo plano y se te notifica cuando todo esté listo.

## Análisis de G-code

Tras la carga, los archivos `.gcode` y `.bgcode` se analizan automáticamente:

| Métrica | Descripción |
|---|---|
| Tiempo de impresión estimado | Tiempo calculado a partir de comandos G-code |
| Consumo de filamento | Gramos y metros por material/color |
| Contador de capas | Total de capas |
| Grosor de capa | Grosor de capa registrado |
| Materiales | Materiales detectados (PLA, PETG, etc.) |
| Porcentaje de relleno | Si está disponible en los metadatos |
| Material de soporte | Peso estimado del soporte |
| Modelo de impresora | Impresora objetivo de los metadatos |

Los datos del análisis se muestran en la tarjeta del archivo y los usa la [Calculadora de costos](../analyse/costestimator).

## Tarjetas de archivo y metadatos

Cada tarjeta de archivo muestra:
- **Nombre de archivo** y formato
- **Fecha de carga**
- **Miniatura** (del `.3mf` o generada)
- **Tiempo de impresión analizado** y consumo de filamento
- **Etiquetas** y categoría
- **Impresiones vinculadas** — número de veces impreso

Haz clic en una tarjeta para abrir la vista detallada con metadatos completos e historial.

## Organización

### Etiquetas

Agrega etiquetas para búsqueda fácil:
1. Haz clic en el archivo → **Editar metadatos**
2. Escribe las etiquetas (separadas por comas): `benchy, prueba, PLA, calibración`
3. Busca en la biblioteca con filtro de etiquetas

### Categorías

Organiza los archivos en categorías:
- Haz clic en **Nueva categoría** en la barra lateral
- Arrastra archivos a la categoría
- Las categorías pueden anidarse (se admiten subcategorías)

## Vinculación con MakerWorld

1. Ve a **Configuración → Integraciones → MakerWorld**
2. Inicia sesión con tu cuenta de Bambu Lab
3. De vuelta en la biblioteca: haz clic en un archivo → **Vincular a MakerWorld**
4. Busca el modelo en MakerWorld y selecciona la coincidencia correcta
5. Los metadatos (diseñador, licencia, valoración) se importan de MakerWorld

El vínculo muestra el nombre del diseñador y la URL original en la tarjeta del archivo.

## Vinculación con Printables

1. Ve a **Configuración → Integraciones → Printables**
2. Pega tu clave API de Printables
3. Vincula archivos a modelos de Printables del mismo modo que con MakerWorld

## Enviar a la impresora

Desde la biblioteca de archivos puedes enviar directamente a la impresora:

1. Haz clic en el archivo → **Enviar a impresora**
2. Selecciona la impresora objetivo
3. Selecciona la ranura AMS (para impresiones multicolor)
4. Haz clic en **Iniciar impresión** o **Agregar a la cola**

:::warning Envío directo
El envío directo inicia la impresión inmediatamente sin confirmación en Bambu Studio. Asegúrate de que la impresora está lista.
:::
