---
sidebar_position: 5
title: PA / Nylon
description: Guía para imprimir nylon — secado, bastón adhesivo, configuración y variantes
---

# PA / Nylon

El nylon (Poliamida / PA) es uno de los materiales de impresión 3D más fuertes y duraderos. Es ideal para piezas mecánicas, engranajes, cojinetes y otras piezas de alta carga.

## Configuración

| Parámetro | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Temperatura de boquilla | 260–280 °C | 250–270 °C | 270–290 °C |
| Temperatura de cama | 70–90 °C | 60–80 °C | 80–100 °C |
| Refrigeración de pieza | 0–30% | 0–30% | 0–20% |
| Secado (requerido) | 80 °C / 8–12 h | 80 °C / 8 h | 80 °C / 12 h |

## Secado — crítico para el nylon

El nylon es **extremadamente higroscópico**. Absorbe humedad del aire en horas.

:::danger Seca siempre el nylon
El nylon húmedo da malos resultados — impresión débil, burbujas, superficie con ampollas y mala fusión de capas. Seca el nylon **inmediatamente** antes de imprimir y úsalo en pocas horas después.

- **Temperatura:** 75–85 °C
- **Tiempo:** 8–12 horas
- **Método:** Secador de filamento u horno con ventilador
:::

El AMS de Bambu no se recomienda para nylon sin una configuración sellada y seca. Si es posible, usa un alimentador de filamento externo directamente a la impresora.

## Placas de construcción

| Placa | Idoneidad | ¿Bastón adhesivo? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excelente | Sí (requerido) |
| High Temp Plate | Buena | Sí (requerido) |
| Cool Plate | Mala | — |

:::warning El bastón adhesivo es requerido
El nylon no se adhiere bien sin bastón adhesivo. Usa una capa delgada y uniforme de bastón adhesivo (Bambu Lab o Pritt). Sin bastón adhesivo, el nylon se levanta de la placa.
:::

## Warping

El nylon tiene un warping significativo:
- Usa brim (8–15 mm)
- Cierra la cámara (X1C/P1S dan los mejores resultados)
- Evita piezas grandes y planas sin brim
- Minimiza la ventilación

## Variantes

### PA6 (Nylon 6)
El más común, buena resistencia y flexibilidad. Absorbe mucha humedad.

### PA12 (Nylon 12)
Más dimensionalmente estable y absorbe algo menos de humedad que PA6. Más fácil de imprimir.

### PA-CF (fibra de carbono)
Muy rígido y ligero. Requiere boquilla de acero endurecido. Imprime más seco que el nylon estándar.

### PA-GF (relleno de fibra de vidrio)
Buena rigidez a menor costo que CF. Requiere boquilla de acero endurecido.

## Almacenamiento

Guarda el nylon en caja sellada con gel de sílice agresivo. La caja de secado de Bambu Lab es ideal. Nunca dejes el nylon expuesto al aire durante la noche.
