---
sidebar_position: 7
title: PC
description: Guía de impresión en policarbonato con Bambu Lab — alta resistencia, resistencia térmica y requisitos
---

# PC (Policarbonato)

El policarbonato es uno de los materiales termoplásticos más resistentes disponibles para la impresión FDM. Combina una resistencia al impacto extremadamente alta, resistencia térmica de hasta 110–130 °C y transparencia natural. El PC es un material exigente de imprimir, pero ofrece resultados que se acercan a la calidad de piezas moldeadas por inyección.

## Ajustes

| Parámetro | PC puro | Mezcla PC-ABS | PC-CF |
|-----------|---------|--------------|-------|
| Temperatura de boquilla | 260–280 °C | 250–270 °C | 270–290 °C |
| Temperatura de cama | 100–120 °C | 90–110 °C | 100–120 °C |
| Temperatura de cámara | 50–60 °C (requerido) | 45–55 °C | 50–60 °C |
| Enfriamiento de pieza | 0–20% | 20–30% | 0–20% |
| Velocidad | 60–80% | 70–90% | 50–70% |
| Secado necesario | Sí (crítico) | Sí | Sí (crítico) |

## Placas de construcción recomendadas

| Placa | Idoneidad | ¿Barra de pegamento? |
|-------|-----------|---------------------|
| High Temp Plate | Excelente (requerida) | No |
| Engineering Plate | Aceptable | Sí |
| Textured PEI | No recomendada | — |
| Cool Plate (Smooth PEI) | No usar | — |

:::danger Se requiere High Temp Plate
El PC necesita temperaturas de cama de 100–120 °C. La Cool Plate y la Textured PEI no soportan estas temperaturas y se dañarán. Usa **siempre** High Temp Plate para PC puro.
:::

## Requisitos de impresora y equipo

### Encerramiento (requerido)

El PC requiere una **cámara completamente cerrada** con temperatura estable de 50–60 °C. Sin esto experimentarás warping severo, delaminación y separación de capas.

### Boquilla endurecida (muy recomendada)

El PC puro no es abrasivo, pero el PC-CF y PC-GF **requieren boquilla de acero endurecido** (por ej., Bambu Lab HS01). Para PC puro, se recomienda igualmente una boquilla endurecida por las altas temperaturas.

### Compatibilidad de impresoras

| Impresora | ¿Apta para PC? | Nota |
|-----------|----------------|------|
| X1C | Excelente | Completamente cerrada, HS01 disponible |
| X1E | Excelente | Diseñada para materiales de ingeniería |
| P1S | Limitada | Cerrada, pero sin calefacción activa de cámara |
| P1P | No recomendada | Sin encerramiento |
| A1 / A1 Mini | No usar | Marco abierto, temperaturas demasiado bajas |

:::warning Solo se recomiendan X1C y X1E
El PC requiere calefacción activa de cámara para resultados consistentes. La P1S puede dar resultados aceptables con piezas pequeñas, pero espera warping y delaminación con piezas más grandes.
:::

## Secado

El PC es **altamente higroscópico** y absorbe humedad rápidamente. Un PC húmedo da resultados de impresión catastróficos.

| Parámetro | Valor |
|-----------|-------|
| Temperatura de secado | 70–80 °C |
| Tiempo de secado | 6–8 horas |
| Nivel higroscópico | Alto |
| Humedad máx. recomendada | < 0,02% |

- **Siempre** seca el PC antes de imprimir — incluso bobinas recién abiertas pueden haber absorbido humedad
- Imprime directamente desde una caja secadora si es posible
- El AMS **no es suficiente** para almacenar PC — la humedad es demasiado alta
- Usa un secador de filamento dedicado con calefacción activa

:::danger La humedad destruye las impresiones de PC
Señales de PC húmedo: chasquidos fuertes, burbujas en la superficie, muy mala unión entre capas, stringing. El PC húmedo no se puede compensar con ajustes — **debe** secarse primero.
:::

## Propiedades

| Propiedad | Valor |
|-----------|-------|
| Resistencia a la tracción | 55–75 MPa |
| Resistencia al impacto | Extremadamente alta |
| Resistencia térmica (HDT) | 110–130 °C |
| Transparencia | Sí (variante natural/transparente) |
| Resistencia química | Moderada |
| Resistencia UV | Moderada (amarillea con el tiempo) |
| Contracción | ~0,5–0,7% |

## Mezclas de PC

### PC-ABS

Una mezcla de policarbonato y ABS que combina las fortalezas de ambos materiales:

- **Más fácil de imprimir** que el PC puro — temperaturas más bajas y menos warping
- **Resistencia al impacto** entre ABS y PC
- **Popular en la industria** — usado en interiores de automóviles y carcasas electrónicas
- Imprime a 250–270 °C boquilla, 90–110 °C cama

### PC-CF (fibra de carbono)

PC reforzado con fibra de carbono para máxima rigidez y resistencia:

- **Extremadamente rígido** — ideal para piezas estructurales
- **Ligero** — la fibra de carbono reduce el peso
- **Requiere boquilla endurecida** — el latón se desgasta en horas
- Imprime a 270–290 °C boquilla, 100–120 °C cama
- Más caro que el PC puro, pero ofrece propiedades mecánicas cercanas al aluminio

### PC-GF (fibra de vidrio)

PC reforzado con fibra de vidrio:

- **Más barato que el PC-CF** con buena rigidez
- **Superficie más blanca** que el PC-CF
- **Requiere boquilla endurecida** — las fibras de vidrio son muy abrasivas
- Algo menos rígido que el PC-CF, pero mejor resistencia al impacto

## Aplicaciones

El PC se usa donde necesitas **máxima resistencia y/o resistencia térmica**:

- **Piezas mecánicas** — engranajes, soportes, acoplamientos bajo carga
- **Piezas ópticas** — lentes, guías de luz, cubiertas transparentes (PC transparente)
- **Piezas resistentes al calor** — compartimento motor, cerca de elementos calefactores
- **Carcasas electrónicas** — cubiertas protectoras con buena resistencia al impacto
- **Herramientas y utillaje** — herramientas de montaje de precisión

## Consejos para una impresión PC exitosa

### Primera capa

- Reduce la velocidad a **30–40%** para la primera capa
- Aumenta la temperatura de cama 5 °C por encima del estándar para las primeras 3–5 capas
- **El brim es obligatorio** para la mayoría de piezas PC — usa 8–10 mm

### Temperatura de cámara

- La cámara debe alcanzar **50 °C+** antes de iniciar la impresión
- **No abras la puerta de la cámara** durante la impresión — la caída de temperatura causa warping inmediato
- Después de imprimir: deja que la pieza se enfríe **lentamente** en la cámara (1–2 horas)

### Enfriamiento

- Usa **enfriamiento mínimo** (0–20%) para la mejor unión entre capas
- Para puentes y voladizos: aumenta temporalmente a 30–40%
- Prioriza la resistencia de capas sobre la estética con PC

### Consideraciones de diseño

- **Evita esquinas afiladas** — redondea con radio mínimo de 1 mm
- **Espesor de pared uniforme** — espesores desiguales crean tensiones internas
- **Las superficies grandes y planas** son difíciles — divide o añade nervios

:::tip ¿Nuevo con PC? Empieza con PC-ABS
Si nunca has impreso PC, empieza con una mezcla PC-ABS. Es mucho más tolerante que el PC puro y te da experiencia con el material sin los requisitos extremos. Cuando domines el PC-ABS, pasa al PC puro.
:::

---

## Postprocesado

- **Lijado** — el PC se lija bien, pero usa lijado húmedo para PC transparente
- **Pulido** — el PC transparente puede pulirse hasta calidad casi óptica
- **Pegado** — el pegado con diclorometano da juntas invisibles (¡usa equipo de protección!)
- **Pintura** — requiere imprimación para buena adherencia
- **Recocido** — 120 °C durante 1–2 horas reduce tensiones internas

:::warning Pegado con diclorometano
El diclorometano es tóxico y requiere extracción, guantes resistentes a químicos y gafas de protección. Trabaja siempre en un lugar bien ventilado o campana de extracción.
:::
