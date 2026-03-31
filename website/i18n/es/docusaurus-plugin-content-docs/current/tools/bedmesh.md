---
sidebar_position: 6
title: Bed Mesh
description: Visualización 3D de la calibración de planitud de la placa de construcción con mapa de calor, escaneo desde la UI y guía de calibración
---

# Bed Mesh

La herramienta de bed mesh te ofrece una representación visual de la planitud de la placa de construcción — fundamental para una buena adhesión y una primera capa uniforme.

Ir a: **https://localhost:3443/#bedmesh**

## ¿Qué es el bed mesh?

Las impresoras Bambu Lab escanean la superficie de la placa de construcción con una sonda y crean un mapa (mesh) de las desviaciones de altura. El firmware de la impresora compensa automáticamente las desviaciones durante la impresión. 3DPrintForge visualiza este mapa para ti.

## Visualización

### Superficie 3D

El mapa del bed mesh se muestra como una superficie 3D interactiva:

- Usa el ratón para rotar la vista
- Desplaza la rueda para acercar/alejar
- Haz clic en **Vista superior** para perspectiva de pájaro
- Haz clic en **Vista lateral** para ver el perfil

La escala de colores muestra la desviación respecto a la altura promedio:
- **Azul** — más bajo que el centro (cóncavo)
- **Verde** — aproximadamente plano (< 0.1 mm de desviación)
- **Amarillo** — desviación moderada (0.1–0.2 mm)
- **Rojo** — desviación alta (> 0.2 mm)

### Mapa de calor

Haz clic en **Mapa de calor** para una vista 2D plana del mapa mesh — más fácil de leer para la mayoría.

El mapa de calor muestra:
- Valores exactos de desviación (mm) para cada punto de medición
- Puntos problemáticos marcados (desviación > 0.3 mm)
- Dimensiones de las mediciones (número de filas × columnas)

## Escanear bed mesh desde la UI

:::warning Requisitos
El escaneo requiere que la impresora esté inactiva y la temperatura de la cama estabilizada. Calienta la cama a la temperatura deseada ANTES del escaneo.
:::

1. Ve a **Bed Mesh**
2. Selecciona la impresora en el menú desplegable
3. Haz clic en **Escanear ahora**
4. Selecciona la temperatura de la cama para el escaneo:
   - **Fría** (temperatura ambiente) — rápida, pero menos precisa
   - **Caliente** (50–60 °C PLA, 70–90 °C PETG) — recomendado
5. Confirma en el diálogo — la impresora inicia automáticamente la secuencia de sonda
6. Espera a que el escaneo termine (3–8 minutos según el tamaño del mesh)
7. El nuevo mapa mesh se muestra automáticamente

## Guía de calibración

Tras el escaneo, el sistema ofrece recomendaciones concretas:

| Resultado | Recomendación |
|---|---|
| Desviación < 0.1 mm en todas partes | Excelente — no se requiere acción |
| Desviación 0.1–0.2 mm | Bien — la compensación la maneja el firmware |
| Desviación > 0.2 mm en esquinas | Ajusta los tornillos de nivelación manualmente (si es posible) |
| Desviación > 0.3 mm | La cama puede estar dañada o mal montada |
| Centro más alto que las esquinas | Expansión térmica — normal para camas calientes |

:::tip Comparación histórica
Haz clic en **Comparar con anterior** para ver si el mapa mesh ha cambiado con el tiempo — útil para detectar que la placa se está doblando gradualmente.
:::

## Historial de mesh

Todos los escaneos mesh se guardan con marca de tiempo:

1. Haz clic en **Historial** en el panel lateral del bed mesh
2. Selecciona dos escaneos para compararlos (se muestra un mapa de diferencias)
3. Elimina los escaneos antiguos que ya no necesites

## Exportar

Exporta los datos del mesh como:
- **PNG** — imagen del mapa de calor (para documentación)
- **CSV** — datos en bruto con X, Y y desviación de altura por punto
