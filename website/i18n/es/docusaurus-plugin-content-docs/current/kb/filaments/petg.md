---
sidebar_position: 2
title: PETG
description: Guía para imprimir PETG — temperatura, IMPORTANTE sobre el bastón adhesivo, placa y consejos
---

# PETG

PETG (Polietileno Tereftalato Glicolado) es un material popular para piezas funcionales. Es más fuerte y más estable al calor que el PLA, y tolera una exposición química leve.

## Configuración

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 230–250 °C |
| Temperatura de cama | 70–85 °C |
| Refrigeración de pieza | 30–60% |
| Velocidad | Estándar |
| Secado | Recomendado (6–8 h a 65 °C) |

## Placas de construcción recomendadas

| Placa | Idoneidad | ¿Bastón adhesivo? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excelente | No/Sí* |
| Textured PEI | Buena | Sí** |
| Cool Plate (Smooth PEI) | Ver advertencia | Ver advertencia |
| High Temp Plate | Buena | Sí |

:::danger IMPORTANTE: Bastón adhesivo en Smooth PEI con PETG
El PETG se adhiere **extremadamente bien** al Smooth PEI (Cool Plate). Sin bastón adhesivo, corres el riesgo de **arrancar el recubrimiento de la placa** al retirar la pieza. Usa siempre una capa delgada de bastón adhesivo en Smooth PEI cuando imprimas PETG — esto actúa como barrera.

**Alternativa:** Usa Engineering Plate o Textured PEI — estas dan buena adherencia sin dañar la placa.
:::

## Consejos para una impresión exitosa

- **Reduce la refrigeración de pieza** — demasiada refrigeración causa delaminación y pieza frágil
- **Aumenta la temperatura de la boquilla** — si hay stringing, prueba bajar 5–10 °C; si hay mala fusión de capas, sube
- **Temperatura de cama en primera capa** — 80–85 °C para buena adherencia, baja a 70 °C después de la primera capa
- **Reduce la velocidad** — el PETG es más exigente que el PLA, empieza con 80% de velocidad

:::warning Stringing
El PETG es propenso al stringing. Aumenta la distancia de retracción (prueba 0.8–1.5 mm para direct drive), aumenta la velocidad de retracción y baja la temperatura de la boquilla 5 °C a la vez.
:::

## Secado

El PETG absorbe humedad más rápido que el PLA. El PETG húmedo produce:
- Burbujas y siseo durante la impresión
- Capas débiles con superficie porosa
- Mayor stringing

**Seca a 65 °C durante 6–8 horas** antes de imprimir, especialmente si la bobina ha estado abierta por mucho tiempo.

## Almacenamiento

Guarda siempre en bolsa sellada o caja de secado con gel de sílice. El PETG no debe estar expuesto más de unos pocos días en un ambiente húmedo.
