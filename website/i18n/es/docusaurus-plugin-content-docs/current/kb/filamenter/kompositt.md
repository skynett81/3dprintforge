---
sidebar_position: 6
title: Materiales compuestos (CF/GF)
description: Filamentos rellenos de fibra de carbono y fibra de vidrio — boquilla de acero endurecido requerida, configuración y desgaste
---

# Materiales compuestos (CF/GF)

Los filamentos compuestos contienen fibras cortas de carbono (CF) o fibras de vidrio (GF) mezcladas en un plástico base como PLA, PETG, PA o ABS. Proporcionan mayor rigidez, peso reducido y mejor estabilidad dimensional.

## Tipos disponibles

| Filamento | Base | Rigidez | Reducción de peso | Dificultad |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Alta | Moderada | Fácil |
| PETG-CF | PETG | Alta | Moderada | Moderada |
| PA6-CF | Nylon 6 | Muy alta | Buena | Exigente |
| PA12-CF | Nylon 12 | Muy alta | Buena | Moderada |
| ABS-CF | ABS | Alta | Moderada | Moderada |
| PLA-GF | PLA | Alta | Moderada | Fácil |

## Boquilla de acero endurecido requerida

:::danger Nunca uses boquilla de latón con CF/GF
Las fibras de carbono y vidrio son muy abrasivas. Desgastarán una boquilla de latón estándar en horas o días. Usa siempre una **boquilla de acero endurecido** (Hardened Steel) o **boquilla HS01** con todos los materiales CF y GF.

- Bambu Lab Hardened Steel Nozzle (0.4 mm)
- Bambu Lab HS01 Nozzle (recubrimiento especial, mayor vida útil)
:::

## Configuración (ejemplo PA-CF)

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 270–290 °C |
| Temperatura de cama | 80–100 °C |
| Refrigeración de pieza | 0–20% |
| Velocidad | 80% |
| Secado | 80 °C / 12 horas |

Para PLA-CF: boquilla 220–230 °C, cama 35–50 °C — mucho más sencillo que PA-CF.

## Placas de construcción

| Placa | Idoneidad | ¿Bastón adhesivo? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excelente | Sí (para base PA) |
| High Temp Plate | Buena | Sí |
| Cool Plate | Evitar (CF raya) | — |
| Textured PEI | Buena | Sí |

:::warning La placa puede rayarse
Los materiales CF pueden rayar las placas lisas al retirar la pieza. Usa siempre Engineering Plate o Textured PEI. No jales la pieza — dobla la placa suavemente.
:::

## Acabado superficial

Los filamentos CF dan una superficie mate similar al carbono que no necesita pintura. La superficie es algo porosa y puede impregnarse con epoxi para un acabado más liso.

## Desgaste y vida útil de la boquilla

| Tipo de boquilla | Vida útil con CF | Costo |
|----------|---------------|---------|
| Latón (estándar) | Horas–días | Bajo |
| Acero endurecido | 200–500 horas | Moderado |
| HS01 (Bambu) | 500–1000 horas | Alto |

Cambia la boquilla cuando haya desgaste visible: orificio de boquilla ampliado, paredes delgadas, mala precisión dimensional.

## Secado

Las variantes CF de PA y PETG requieren secado igual que la base:
- **PLA-CF:** Secado recomendado, pero no crítico
- **PETG-CF:** 65 °C / 6–8 horas
- **PA-CF:** 80 °C / 12 horas — crítico
