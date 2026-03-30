---
sidebar_position: 2
title: Warping
description: Causas del warping y soluciones — cámara cerrada, brim, temperatura y draft shield
---

# Warping

El warping ocurre cuando las esquinas o los bordes de la pieza se levantan de la placa durante o después de la impresión. Se debe a la contracción térmica del material.

## ¿Qué es el warping?

Cuando el plástico se enfría, se contrae. Las capas superiores están más calientes que las capas inferiores — esto crea una tensión que jala los bordes hacia arriba y dobla la pieza. Cuanto mayor es la diferencia de temperatura, mayor es el warping.

## Materiales más propensos

| Material | Riesgo de warping | Requiere cámara cerrada |
|-----------|-------------|-----------------|
| PLA | Bajo | No |
| PETG | Bajo–Moderado | No |
| ABS | Alto | Sí |
| ASA | Alto | Sí |
| PA/Nylon | Muy alto | Sí |
| PC | Muy alto | Sí |
| TPU | Bajo | No |

## Soluciones

### 1. Usa cámara cerrada

La medida más importante para ABS, ASA, PA y PC:
- Mantén la temperatura de la cámara a 40–55 °C para el mejor resultado
- X1C y P1S: activa los ventiladores de cámara en modo "cerrado"
- A1/P1P: usa una cubierta superior para retener el calor

### 2. Usa brim

El brim es una capa de bordes extra anchos que mantiene la pieza fija a la placa:

```
Bambu Studio:
1. Selecciona la pieza en el slicer
2. Ve a Soporte → Brim
3. Establece el ancho a 5–10 mm (cuanto más warping, más ancho)
4. Tipo: Outer Brim Only (recomendado)
```

:::tip Guía de ancho de brim
- PLA (raramente necesario): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Aumenta la temperatura de la cama

Una mayor temperatura de la cama reduce la diferencia de temperatura entre capas:
- ABS: Prueba 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Reduce la refrigeración de pieza

Para materiales propensos al warping — reduce o desactiva la refrigeración de pieza:
- ABS/ASA: 0–20% de refrigeración de pieza
- PA: 0–30% de refrigeración de pieza

### 5. Evita corrientes de aire frío

Mantén la impresora alejada de:
- Ventanas y puertas exteriores
- Aire acondicionado y ventiladores
- Corrientes de aire en la habitación

Para P1P y A1: cubre las aberturas con cartón durante las impresiones críticas.

### 6. Draft Shield

Un draft shield es una pared delgada alrededor del objeto que retiene el calor:

```
Bambu Studio:
1. Ve a Soporte → Draft Shield
2. Activa y establece la distancia (3–5 mm)
```

Especialmente útil para objetos altos y delgados.

### 7. Medidas de diseño del modelo

Al diseñar modelos propios:
- Evita bases planas grandes (agrega chaflán/redondeo en las esquinas)
- Divide las partes planas grandes en secciones más pequeñas
- Usa "mouse ears" — pequeños círculos en las esquinas — en el slicer o CAD

## Warping después de enfriar

A veces la pieza se ve bien, pero el warping ocurre después de retirarla de la placa:
- Espera siempre hasta que la placa y la pieza estén **completamente frías** (por debajo de 40 °C) antes de retirar
- Para ABS: deja enfriar dentro de la cámara cerrada para un enfriamiento más lento
- Evita poner una pieza caliente sobre una superficie fría
