---
sidebar_position: 3
title: Stringing
description: Causas del stringing y soluciones — retracción, temperatura y secado
---

# Stringing

El stringing (o "oozing") son hilos delgados de plástico que se forman entre partes separadas del objeto mientras la boquilla se mueve sin extruir. Da un aspecto similar a una "telaraña" a la pieza.

## Causas del stringing

1. **Temperatura de boquilla demasiado alta** — el plástico caliente es fluido y gotea
2. **Mala configuración de retracción** — el filamento no se retrae lo suficientemente rápido
3. **Filamento húmedo** — la humedad causa vapor y flujo adicional
4. **Velocidad demasiado baja** — la boquilla pasa mucho tiempo en posiciones de tránsito

## Diagnóstico

**¿Filamento húmedo?** ¿Escuchas un chasquido/explosión durante la impresión? Entonces el filamento está húmedo — sécalo primero antes de ajustar otras configuraciones.

**¿Temperatura demasiado alta?** ¿Ves goteo de la boquilla en los momentos de "pausa"? Baja la temperatura 5–10 °C.

## Soluciones

### 1. Seca el filamento

El filamento húmedo es la causa más común de stringing que no puede eliminarse con ajustes:

| Material | Temperatura de secado | Tiempo |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 horas |
| PETG | 60–65 °C | 6–8 horas |
| TPU | 55–60 °C | 6–8 horas |
| PA | 75–85 °C | 8–12 horas |

### 2. Baja la temperatura de la boquilla

Empieza bajando 5 °C a la vez:
- PLA: prueba 210–215 °C (bajando desde 220 °C)
- PETG: prueba 235–240 °C (bajando desde 245 °C)

:::warning La temperatura demasiado baja da mala fusión de capas
Baja la temperatura con cuidado. Una temperatura demasiado baja da mala fusión de capas, pieza débil y problemas de extrusión.
:::

### 3. Ajusta la configuración de retracción

La retracción jala el filamento de vuelta a la boquilla durante el movimiento de "travel" para evitar el goteo:

```
Bambu Studio → Filamento → Retracción:
- Distancia de retracción: 0.4–1.0 mm (direct drive)
- Velocidad de retracción: 30–45 mm/s
```

:::tip Las impresoras Bambu Lab tienen direct drive
Todas las impresoras Bambu Lab (X1C, P1S, A1) usan extrusor direct drive. El direct drive requiere una distancia de retracción **más corta** que los sistemas Bowden (típicamente 0.5–1.5 mm vs. 3–7 mm).
:::

### 4. Aumenta la velocidad de travel

El movimiento rápido entre puntos da menos tiempo a la boquilla para gotear:
- Aumenta "travel speed" a 200–300 mm/s
- Las impresoras Bambu Lab manejan esto bien

### 5. Activa "Avoid Crossing Perimeters"

Configuración del slicer que hace que la boquilla evite cruzar áreas abiertas donde el stringing será visible:
```
Bambu Studio → Calidad → Avoid crossing perimeters
```

### 6. Reduce la velocidad (para TPU)

Para TPU la solución es lo contrario de otros materiales:
- Reduce la velocidad de impresión a 20–35 mm/s
- El TPU es elástico y se comprime con velocidad demasiado alta — esto da "flujo posterior"

## Después de los ajustes

Prueba con un modelo estándar de prueba de stringing (p.ej. "torture tower" de MakerWorld). Ajusta una variable a la vez y observa el cambio.

:::note La perfección raramente es posible
Algo de stringing es normal para la mayoría de los materiales. Enfócate en reducir a un nivel aceptable, no en eliminar completamente. El PETG siempre tendrá algo más de stringing que el PLA.
:::
