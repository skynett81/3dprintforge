---
sidebar_position: 4
title: Lubricación
description: Lubricación de varillas lineales, guías y intervalos para impresoras Bambu Lab
---

# Lubricación

La lubricación adecuada de las piezas móviles reduce el desgaste, disminuye el nivel de ruido y garantiza un movimiento preciso. Las impresoras Bambu Lab usan sistemas de movimiento lineal que requieren lubricación periódica.

## Tipos de lubricación

| Componente | Tipo de lubricante | Producto |
|-----------|-------------|---------|
| Varillas lineales (XY) | Aceite de máquina ligero o spray PTFE | 3-en-1, Super Lube |
| Husillo de eje Z | Grasa espesa | Grasa Super Lube |
| Guías lineales | Grasa de litio ligera | Grasa Bambu Lab |
| Articulaciones de cadena de cables | Ninguno (seco) | — |

## Varillas lineales

### Eje X y Y
Las varillas son barras de acero pulidas que deslizan a través de guías lineales:

```
Intervalo: Cada 200–300 horas, o cuando haya ruidos chirriantes
Cantidad: Muy poco — una gota por punto de varilla es suficiente
Método:
1. Apaga la impresora
2. Mueve el carro manualmente hasta el extremo
3. Aplica 1 gota de aceite ligero en el centro de la varilla
4. Mueve el carro lentamente hacia adelante y atrás 10 veces
5. Limpia el aceite sobrante con papel sin pelusa
```

:::warning No sobre-lubrifiques
Demasiado aceite atrae polvo y crea una pasta abrasiva. Usa cantidades mínimas y siempre limpia el exceso.
:::

### Eje Z (vertical)
El eje Z usa un husillo (leadscrew) que requiere grasa (no aceite):

```
Intervalo: Cada 200 horas
Método:
1. Apaga la impresora
2. Aplica una capa delgada de grasa a lo largo del husillo
3. Mueve el eje Z hacia arriba y abajo manualmente (o mediante el menú de mantenimiento)
4. La grasa se distribuye automáticamente
```

## Guías lineales

Bambu Lab P1S y X1C usan guías lineales (MGN12) en el eje Y:

```
Intervalo: Cada 300–500 horas
Método:
1. Retira un poco de grasa vieja con un palillo o mondadientes del orificio de entrada
2. Inyecta grasa nueva con una jeringa y cánula delgada
3. Mueve el eje hacia adelante y atrás para distribuir la grasa
```

Bambu Lab vende grasa lubricante oficial (Bambu Lubricant) calibrada para el sistema.

## Mantenimiento de lubricación por modelo

### X1C / P1S
- Eje Y: Guías lineales — grasa de Bambu
- Eje X: Varillas de carbono — aceite ligero
- Eje Z: Husillo doble — grasa de Bambu

### A1 / A1 Mini
- Todos los ejes: Varillas de acero — aceite ligero
- Eje Z: Husillo simple — grasa de Bambu

## Señales de que se necesita lubricación

- **Ruidos chirriantes o raspantes** durante el movimiento
- **Patrones de vibración** visibles en las paredes verticales (VFA)
- **Dimensiones imprecisas** sin otras causas
- **Mayor nivel de ruido** del sistema de movimiento

## Intervalos de lubricación

| Actividad | Intervalo |
|-----------|---------|
| Aceitar varillas XY | Cada 200–300 horas |
| Engrasar husillo Z | Cada 200 horas |
| Engrasar guías lineales (X1C/P1S) | Cada 300–500 horas |
| Ciclo completo de mantenimiento | Semestral (o 500 horas) |

Usa el módulo de mantenimiento en el panel para rastrear los intervalos automáticamente.
