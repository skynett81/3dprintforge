---
sidebar_position: 10
title: Matriz de compatibilidad
description: Resumen completo de compatibilidad de materiales con placas, impresoras y boquillas Bambu Lab
---

# Matriz de compatibilidad

Esta página proporciona un resumen completo de qué materiales funcionan con qué placas de construcción, impresoras y tipos de boquillas. Usa las tablas como referencia al planificar impresiones con nuevos materiales.

---

## Materiales y placas de construcción

| Material | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Barra de pegamento |
|----------|-----------|-------------------|-----------------|--------------|-------------------|
| PLA | Excelente | Buena | No recomendada | Buena | No |
| PLA+ | Excelente | Buena | No recomendada | Buena | No |
| PLA-CF | Excelente | Buena | No recomendada | Buena | No |
| PLA Silk | Excelente | Buena | No recomendada | Buena | No |
| PETG | Mala | Excelente | Buena | Buena | Sí (Cool) |
| PETG-CF | Mala | Excelente | Buena | Aceptable | Sí (Cool) |
| ABS | No recomendada | Excelente | Buena | Aceptable | Sí (HT) |
| ASA | No recomendada | Excelente | Buena | Aceptable | Sí (HT) |
| TPU | Buena | Buena | No recomendada | Excelente | No |
| PA (Nylon) | No recomendada | Excelente | Buena | Mala | Sí |
| PA-CF | No recomendada | Excelente | Buena | Mala | Sí |
| PA-GF | No recomendada | Excelente | Buena | Mala | Sí |
| PC | No recomendada | Aceptable | Excelente | No recomendada | Sí (Eng) |
| PC-CF | No recomendada | Aceptable | Excelente | No recomendada | Sí (Eng) |
| PVA | Excelente | Buena | No recomendada | Buena | No |
| HIPS | No recomendada | Buena | Buena | Aceptable | No |
| PVB | Buena | Buena | No recomendada | Buena | No |

**Leyenda:**
- **Excelente** — funciona de forma óptima, combinación recomendada
- **Buena** — funciona bien, alternativa aceptable
- **Aceptable** — funciona, pero no es ideal — requiere medidas adicionales
- **Mala** — puede funcionar con modificaciones, pero no recomendada
- **No recomendada** — malos resultados o riesgo de daño a la placa

:::tip PETG y Cool Plate
El PETG adhiere **demasiado bien** a la Cool Plate (Smooth PEI) y puede arrancar el revestimiento PEI al retirar la pieza. Usa siempre barra de pegamento como película de separación, o elige la Engineering Plate.
:::

:::warning PC y selección de placa
El PC requiere High Temp Plate debido a las altas temperaturas de cama (100–120 °C). Otras placas pueden deformarse permanentemente a estas temperaturas.
:::

---

## Materiales e impresoras

| Material | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| PLA+ | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| PLA-CF | Sí* | Sí* | Sí* | Sí* | Sí* | Sí | Sí | Sí* | Sí* | Sí* |
| PETG | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| PETG-CF | Sí* | Sí* | Sí* | Sí* | Sí* | Sí | Sí | Sí* | Sí* | Sí* |
| ABS | No | No | Posible** | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| ASA | No | No | Posible** | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| TPU | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| PA (Nylon) | No | No | No | Posible** | Posible** | Sí | Sí | Sí | Sí | Sí |
| PA-CF | No | No | No | No | No | Sí | Sí | Posible** | Posible** | Posible** |
| PA-GF | No | No | No | No | No | Sí | Sí | Posible** | Posible** | Posible** |
| PC | No | No | No | Posible** | No | Sí | Sí | Posible** | Posible** | Posible** |
| PC-CF | No | No | No | No | No | Sí | Sí | No | No | No |
| PVA | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| HIPS | No | No | Posible** | Sí | Sí | Sí | Sí | Sí | Sí | Sí |

**Leyenda:**
- **Sí** — totalmente compatible y recomendado
- **Sí*** — requiere boquilla de acero endurecido (HS01 o equivalente)
- **Posible**** — puede funcionar con limitaciones, no recomendado oficialmente
- **No** — no apto (falta encerramiento, temperaturas demasiado bajas, etc.)

:::danger Requisitos de encerramiento
Materiales que requieren encerramiento (ABS, ASA, PA, PC):
- **A1 y A1 Mini** tienen marco abierto — no aptos
- **P1P** tiene marco abierto — requiere accesorio de encerramiento
- **P1S** tiene encerramiento, pero sin calefacción activa de cámara
- **X1C y X1E** tienen encerramiento completo con calefacción activa — recomendados para materiales exigentes
:::

---

## Materiales y tipos de boquilla

| Material | Latón (estándar) | Acero endurecido (HS01) | Hardened Steel |
|----------|-----------------|------------------------|----------------|
| PLA | Excelente | Excelente | Excelente |
| PLA+ | Excelente | Excelente | Excelente |
| PLA-CF | No usar | Excelente | Excelente |
| PLA Silk | Excelente | Excelente | Excelente |
| PETG | Excelente | Excelente | Excelente |
| PETG-CF | No usar | Excelente | Excelente |
| ABS | Excelente | Excelente | Excelente |
| ASA | Excelente | Excelente | Excelente |
| TPU | Excelente | Buena | Buena |
| PA (Nylon) | Buena | Excelente | Excelente |
| PA-CF | No usar | Excelente | Excelente |
| PA-GF | No usar | Excelente | Excelente |
| PC | Buena | Excelente | Excelente |
| PC-CF | No usar | Excelente | Excelente |
| PVA | Excelente | Buena | Buena |
| HIPS | Excelente | Excelente | Excelente |
| PVB | Excelente | Buena | Buena |

:::danger La fibra de carbono y vidrio requieren boquilla endurecida
Todos los materiales con **-CF** (fibra de carbono) o **-GF** (fibra de vidrio) **requieren boquilla de acero endurecido**. El latón se desgasta en horas a días con estos materiales. Se recomienda Bambu Lab HS01.

Materiales que requieren boquilla endurecida:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Latón vs acero endurecido para materiales comunes
La boquilla de latón ofrece **mejor conductividad térmica** y por tanto una extrusión más uniforme para materiales comunes (PLA, PETG, ABS). El acero endurecido funciona bien, pero puede requerir 5–10 °C más de temperatura. Usa latón para el uso diario y cambia a acero endurecido para materiales CF/GF.
:::

---

## Consejos para cambios de material

Al cambiar entre materiales en AMS o manualmente, una purga correcta es importante para evitar contaminación.

### Cantidad de purga recomendada

| De → A | Cantidad de purga | Nota |
|--------|------------------|------|
| PLA → PLA (otro color) | 100–150 mm³ | Cambio de color estándar |
| PLA → PETG | 200–300 mm³ | Aumento de temperatura, flujo diferente |
| PETG → PLA | 200–300 mm³ | Disminución de temperatura |
| ABS → PLA | 300–400 mm³ | Gran diferencia de temperatura |
| PLA → ABS | 300–400 mm³ | Gran diferencia de temperatura |
| PA → PLA | 400–500 mm³ | El nylon permanece en el hotend |
| PC → PLA | 400–500 mm³ | El PC requiere purga exhaustiva |
| Oscuro → Claro | 200–300 mm³ | El pigmento oscuro es difícil de limpiar |
| Claro → Oscuro | 100–150 mm³ | Transición más fácil |

### Cambio de temperatura al cambiar material

| Transición | Recomendación |
|-----------|--------------|
| Frío → Caliente (por ej., PLA → ABS) | Calentar al nuevo material, purgar a fondo |
| Caliente → Frío (por ej., ABS → PLA) | Purgar primero a alta temperatura, luego bajar |
| Temperaturas similares (por ej., PLA → PLA) | Purga estándar |
| Gran diferencia (por ej., PLA → PC) | Una parada intermedia con PETG puede ayudar |

:::warning El nylon y el PC dejan residuos
El PA (Nylon) y el PC son particularmente difíciles de purgar. Después de usar estos materiales:
1. Purgar con **PETG** o **ABS** a alta temperatura (260–280 °C)
2. Pasar al menos **500 mm³** de material de purga
3. Inspeccionar visualmente la extrusión — debe estar completamente limpia sin decoloración
:::

---

## Referencia rápida — selección de material

¿No estás seguro de qué material necesitas? Usa esta guía:

| Necesidad | Material recomendado |
|-----------|---------------------|
| Prototipado / uso diario | PLA |
| Resistencia mecánica | PETG, PLA Tough |
| Uso exterior | ASA |
| Resistencia térmica | ABS, ASA, PC |
| Piezas flexibles | TPU |
| Resistencia máxima | PA-CF, PC-CF |
| Transparente | PETG (natural), PC (natural) |
| Estética / decoración | PLA Silk, PLA Sparkle |
| Clips / bisagras vivas | PETG, PA |
| Contacto alimentario | PLA (con reservas) |
