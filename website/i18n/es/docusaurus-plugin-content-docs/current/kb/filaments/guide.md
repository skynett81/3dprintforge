---
sidebar_position: 0
title: Guía de filamentos
description: Guía completa de todos los filamentos de impresión 3D — temperaturas, placas, secado y propiedades
---

# Guía de filamentos

Una referencia completa para todos los materiales de impresión 3D comunes. Usa esta guía para elegir el filamento y los ajustes correctos para tu proyecto.

## Resumen — Ajustes de temperatura

| Material | Boquilla (°C) | Cama (°C) | Cámara (°C) | Dificultad |
|-----------|-----------|-----------|-------------|--------------|
| PLA | 190–230 (210) | 35–65 (55) | — | Principiante |
| PLA-CF | 210–240 (220) | 45–65 (55) | — | Intermedio |
| PETG | 220–260 (240) | 60–80 (70) | — | Principiante |
| PETG-CF | 230–270 (250) | 65–80 (70) | — | Intermedio |
| ABS | 240–270 (255) | 90–110 (100) | 40–60 | Intermedio |
| ASA | 240–270 (260) | 90–110 (100) | 40–60 | Intermedio |
| TPU | 210–240 (225) | 40–60 (50) | — | Avanzado |
| PA (Nylon) | 260–290 (275) | 80–100 (90) | 40–60 | Avanzado |
| PA-CF | 270–300 (285) | 80–100 (90) | 45–65 | Experto |
| PA-GF | 270–300 (285) | 80–100 (90) | 45–65 | Experto |
| PC | 260–300 (280) | 100–120 (110) | 50–70 | Experto |
| PVA | 190–220 (200) | 45–60 (55) | — | Intermedio |
| PVB | 200–230 (215) | 50–70 (60) | — | Intermedio |
| HIPS | 220–250 (235) | 80–100 (90) | 35–50 | Intermedio |
| PET-CF | 250–280 (265) | 65–85 (75) | — | Avanzado |

*Los valores entre paréntesis son valores recomendados.*

## Compatibilidad de placas

| Material | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI |
|-----------|:----------:|:-----------------:|:---------------:|:------------:|
| PLA | ★★★ | ★★ | ✗ | ★★★ |
| PLA-CF | ★★ | ★★★ | ✗ | ★★★ |
| PETG | ✗ (pegamento) | ★★★ | ★★ | ★★★ |
| PETG-CF | ✗ (pegamento) | ★★★ | ★★ | ★★★ |
| ABS | ⊘ | ★★★ | ★★★ | ★★ |
| ASA | ⊘ | ★★★ | ★★★ | ★★ |
| TPU | ★★★ | ★★ | ✗ | ★★ |
| PA (Nylon) | ⊘ | ★★ (pegamento) | ★★★ | ★★ (pegamento) |
| PA-CF | ⊘ | ★★ (pegamento) | ★★★ | ★★ (pegamento) |
| PA-GF | ⊘ | ★★ (pegamento) | ★★★ | ★★ (pegamento) |
| PC | ⊘ | ★★ (pegamento) | ★★★ | ✗ (pegamento) |
| PVA | ★★ | ★★ | ✗ | ★★ |
| PVB | ★★ | ★★ | ✗ | ★★ |
| HIPS | ⊘ | ★★ | ★★★ | ★★ |
| PET-CF | ✗ (pegamento) | ★★★ | ★★ | ★★★ |

**Leyenda:** ★★★ = Excelente, ★★ = Bueno, ✗ = Malo, ⊘ = No recomendado, (pegamento) = Se necesita barra de pegamento

## Secado

| Material | Temperatura | Tiempo | Sensibilidad a la humedad |
|-----------|:----------:|:---:|:----------------:|
| PLA | 50 °C | 4h | Baja |
| PLA-CF | 55 °C | 6h | Baja |
| PETG | 65 °C | 6h | Media |
| PETG-CF | 65 °C | 8h | Media |
| ABS | 65 °C | 6h | Media |
| ASA | 65 °C | 6h | Media |
| TPU | 50 °C | 6h | Alta |
| PA (Nylon) | 80 °C | 12h | Extrema |
| PA-CF | 80 °C | 12h | Extrema |
| PA-GF | 80 °C | 12h | Extrema |
| PC | 80 °C | 8h | Alta |
| PVA | 45 °C | 8h | Extrema |
| PVB | 50 °C | 6h | Media |
| HIPS | 60 °C | 6h | Baja |
| PET-CF | 65 °C | 8h | Media |

:::tip Regla de secado
Los materiales con sensibilidad a la humedad **alta** o **extrema** deben secarse siempre antes de usar y almacenarse con desecante.
:::

## Requisitos especiales

| Material | Cerramiento | Boquilla endurecida | Impresoras compatibles |
|-----------|:---------:|:-----------:|:-------------------:|
| PLA | No | No | Todas |
| PLA-CF | No | **Sí** | Todas |
| PETG | No | No | Todas |
| PETG-CF | No | **Sí** | Todas |
| ABS | **Sí** | No | Solo cerradas |
| ASA | **Sí** | No | Solo cerradas |
| TPU | No | No | Todas |
| PA (Nylon) | **Sí** | No | Solo cerradas |
| PA-CF | **Sí** | **Sí** | Solo cerradas |
| PA-GF | **Sí** | **Sí** | Solo cerradas |
| PC | **Sí** | No | Solo cerradas |
| PVA | No | No | Todas |
| PVB | No | No | Todas |
| HIPS | **Sí** | No | Solo cerradas |
| PET-CF | No | **Sí** | Todas |

## Propiedades (1–5)

| Material | Resistencia | Flexibilidad | Calor | UV | Superficie | Imprimibilidad |
|-----------|:------:|:-------------:|:-----:|:--:|:---------:|:-----------:|
| PLA | 3 | 2 | 2 | 1 | 4 | 5 |
| PLA-CF | 4 | 1 | 2 | 2 | 3 | 4 |
| PETG | 4 | 3 | 3 | 3 | 3 | 4 |
| PETG-CF | 5 | 2 | 3 | 3 | 3 | 3 |
| ABS | 4 | 3 | 4 | 2 | 3 | 2 |
| ASA | 4 | 3 | 4 | 5 | 3 | 2 |
| TPU | 3 | 5 | 2 | 3 | 3 | 2 |
| PA (Nylon) | 5 | 4 | 4 | 2 | 3 | 2 |
| PA-CF | 5 | 2 | 5 | 3 | 3 | 1 |
| PA-GF | 5 | 2 | 5 | 3 | 2 | 1 |
| PC | 5 | 3 | 5 | 3 | 3 | 1 |
| PVA | 1 | 2 | 1 | 1 | 3 | 2 |
| PVB | 3 | 3 | 2 | 2 | 5 | 3 |
| HIPS | 3 | 2 | 3 | 2 | 3 | 3 |
| PET-CF | 5 | 2 | 4 | 3 | 3 | 3 |

## Consejos por material

### Estándar (PLA, PETG)
- PLA es el material más fácil — perfecto para prototipos y decoración
- PETG ofrece mejor resistencia y tolerancia al calor, pero puede generar más hilos
- Ambos funcionan sin cerramiento y con boquilla de latón estándar

### Ingeniería (ABS, ASA, PC)
- Requiere una impresora cerrada para evitar el warping
- ASA es resistente a los UV — úsalo para piezas exteriores
- PC ofrece la mayor resistencia y tolerancia al calor, pero es el más difícil de imprimir

### Compuesto (CF/GF)
- Usa **siempre** una boquilla de acero endurecido — la fibra de carbono desgasta las boquillas de latón rápidamente
- Las variantes CF producen piezas más rígidas y ligeras con acabado mate
- Las variantes GF son más baratas pero producen una superficie más rugosa

### Flexible (TPU)
- Imprime lentamente (50 mm/s o menos) para mejores resultados
- Reduce la retracción para evitar atascos
- Los extrusores de tracción directa funcionan mucho mejor que los Bowden

### Soporte (PVA, HIPS)
- PVA se disuelve en agua — perfecto para soporte de PLA
- HIPS se disuelve en limoneno — se usa junto con ABS
- Ambos son muy sensibles a la humedad — almacenar en seco

:::warning Materiales de Nylon
PA, PA-CF y PA-GF son **extremadamente** higroscópicos. Absorben humedad del aire en minutos. Seca siempre durante 12+ horas antes de usar e imprime directamente desde una caja de secado si es posible.
:::
