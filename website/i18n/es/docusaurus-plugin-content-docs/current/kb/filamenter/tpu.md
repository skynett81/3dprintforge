---
sidebar_position: 4
title: TPU
description: Guía para imprimir TPU — temperatura, velocidad y configuración de retracción
---

# TPU

TPU (Poliuretano Termoplástico) es un material flexible usado para cubiertas, juntas, ruedas y otras piezas que requieren elasticidad.

## Configuración

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 220–240 °C |
| Temperatura de cama | 30–45 °C |
| Refrigeración de pieza | 50–80% |
| Velocidad | 30–50% (IMPORTANTE) |
| Retracción | Mínima o desactivada |
| Secado | Recomendado (6–8 h a 60 °C) |

:::danger La baja velocidad es crítica
El TPU debe imprimirse lentamente. Una velocidad demasiado alta hace que el material se comprima en el extrusor y crea atascos. Empieza con 30% de velocidad y aumenta con cuidado.
:::

## Placas de construcción recomendadas

| Placa | Idoneidad | ¿Bastón adhesivo? |
|-------|---------|----------|
| Textured PEI | Excelente | No |
| Cool Plate (Smooth PEI) | Buena | No |
| Engineering Plate | Buena | No |

## Configuración de retracción

El TPU es elástico y reacciona mal a una retracción agresiva:

- **Direct drive (X1C/P1S/A1):** Retracción 0.5–1.0 mm, 25 mm/s
- **Bowden (evitar con TPU):** Muy exigente, no recomendado

Para TPU muy blando (Shore A 85 o inferior): desactiva la retracción completamente y confía en el control de temperatura y velocidad.

## Consejos

- **Seca el filamento** — el TPU húmedo es extremadamente difícil de imprimir
- **Usa extrusor directo** — Bambu Lab P1S/X1C/A1 tienen todos direct drive
- **Evita alta temperatura** — por encima de 250 °C el TPU se degrada y da una impresión decolorada
- **Stringing** — el TPU tiende a formar hilos; baja la temperatura 5 °C o aumenta la refrigeración

:::tip Dureza Shore
El TPU viene en diferentes durezas Shore (A85, A95, A98). Cuanto menor sea el Shore A, más blando y más difícil de imprimir. El TPU de Bambu Lab es Shore A 95 — un buen punto de partida.
:::

## Almacenamiento

El TPU es muy higroscópico (absorbe humedad). El TPU húmedo produce:
- Burbujas y siseo
- Impresión débil y frágil (paradójicamente para un material flexible)
- Stringing

**Seca siempre el TPU** a 60 °C durante 6–8 horas antes de imprimir. Guarda en caja sellada con gel de sílice.
