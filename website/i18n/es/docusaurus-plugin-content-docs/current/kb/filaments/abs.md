---
sidebar_position: 3
title: ABS
description: Guía para imprimir ABS — temperatura, cámara cerrada, warping y bastón adhesivo
---

# ABS

ABS (Acrilonitrilo Butadieno Estireno) es un termoplástico con buena estabilidad térmica y resistencia al impacto. Requiere cámara cerrada y es más exigente que el PLA/PETG, pero produce piezas funcionales duraderas.

## Configuración

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 240–260 °C |
| Temperatura de cama | 90–110 °C |
| Temperatura de cámara | 45–55 °C (X1C/P1S) |
| Refrigeración de pieza | 0–20% |
| Ventilador aux | 0% |
| Velocidad | 80–100% |
| Secado | Recomendado (4–6 h a 70 °C) |

## Placas de construcción recomendadas

| Placa | Idoneidad | ¿Bastón adhesivo? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excelente | Sí (recomendado) |
| High Temp Plate | Excelente | Sí |
| Cool Plate (Smooth PEI) | Evitar | — |
| Textured PEI | Buena | Sí |

:::tip Bastón adhesivo para ABS
Usa siempre bastón adhesivo en Engineering Plate con ABS. Mejora la adherencia y facilita retirar la pieza sin dañar la placa.
:::

## Cámara cerrada

El ABS **requiere** una cámara cerrada para evitar el warping:

- **X1C y P1S:** Cámara integrada con control activo de temperatura — ideal para ABS
- **P1P:** Parcialmente abierta — agrega cubiertas superiores para mejores resultados
- **A1 / A1 Mini:** CoreXY abierta — **no recomendada** para ABS sin una carcasa personalizada

Mantén la cámara cerrada durante toda la impresión. No la abras para revisar la impresión — esperar al enfriamiento también evita el warping al soltar.

## Warping

El ABS es muy propenso al warping (las esquinas se levantan):

- **Aumenta la temperatura de cama** — prueba 105–110 °C
- **Usa brim** — brim de 5–10 mm en Bambu Studio
- **Evita corrientes de aire** — cierra todos los flujos de aire alrededor de la impresora
- **Reduce la refrigeración de pieza a 0%** — la refrigeración causa deformación

:::warning Vapores
El ABS emite vapores de estireno durante la impresión. Asegura una buena ventilación en la habitación, o usa un filtro HEPA/carbón activo. La Bambu P1S tiene filtro integrado.
:::

## Post-procesamiento

El ABS puede lijarse, pintarse y pegarse más fácilmente que el PETG y el PLA. También puede alisarse con vapor de acetona para una superficie lisa — pero ten mucho cuidado con la exposición al acetona.

## Almacenamiento

Seca a **70 °C durante 4–6 horas** antes de imprimir. Guarda en caja sellada — el ABS absorbe humedad, lo que produce ruidos explosivos y capas débiles.
