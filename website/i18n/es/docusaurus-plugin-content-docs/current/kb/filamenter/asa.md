---
sidebar_position: 6
title: ASA
description: Guía de impresión ASA con Bambu Lab — resistente a UV, uso exterior, temperaturas y consejos
---

# ASA

El ASA (Acrilonitrilo Estireno Acrilato) es una variante del ABS resistente a los UV, desarrollada específicamente para uso en exteriores. El material combina la resistencia y rigidez del ABS con una resistencia significativamente mejor a la radiación UV, el envejecimiento y la intemperie.

## Ajustes

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 240–260 °C |
| Temperatura de cama | 90–110 °C |
| Temperatura de cámara | 40–50 °C (recomendado) |
| Enfriamiento de pieza | 30–50% |
| Velocidad | 80–100% |
| Secado necesario | Sí |

## Placas de construcción recomendadas

| Placa | Idoneidad | ¿Barra de pegamento? |
|-------|-----------|---------------------|
| Engineering Plate | Excelente | No |
| High Temp Plate | Buena | Sí |
| Textured PEI | Aceptable | Sí |
| Cool Plate (Smooth PEI) | No recomendada | — |

:::tip La Engineering Plate es la mejor para ASA
La Engineering Plate ofrece la adherencia más fiable para ASA sin barra de pegamento. La placa soporta las altas temperaturas de cama y proporciona buena adhesión sin que la pieza quede pegada permanentemente.
:::

## Requisitos de la impresora

El ASA requiere una **cámara cerrada (encerramiento)** para mejores resultados. Sin encerramiento experimentarás:

- **Warping** — las esquinas se levantan de la placa de construcción
- **Delaminación** — mala unión entre capas
- **Grietas superficiales** — grietas visibles a lo largo de la impresión

| Impresora | ¿Apta para ASA? | Nota |
|-----------|-----------------|------|
| X1C | Excelente | Completamente cerrada, calefacción activa |
| X1E | Excelente | Completamente cerrada, calefacción activa |
| P1S | Buena | Cerrada, calefacción pasiva |
| P1P | Posible con accesorio | Requiere accesorio de encerramiento |
| A1 | No recomendada | Marco abierto |
| A1 Mini | No recomendada | Marco abierto |

## ASA vs ABS — comparación

| Propiedad | ASA | ABS |
|-----------|-----|-----|
| Resistencia UV | Excelente | Mala |
| Uso exterior | Sí | No (amarillea y se vuelve frágil) |
| Warping | Moderado | Alto |
| Superficie | Mate, uniforme | Mate, uniforme |
| Resistencia química | Buena | Buena |
| Precio | Algo más alto | Más bajo |
| Olor durante impresión | Moderado | Fuerte |
| Resistencia al impacto | Buena | Buena |
| Resistencia térmica | ~95–105 °C | ~95–105 °C |

:::warning Ventilación
El ASA emite gases durante la impresión que pueden ser irritantes. Imprime en una habitación bien ventilada o con un sistema de filtración de aire. No imprimas ASA en una habitación donde permanezcas mucho tiempo sin ventilación.
:::

## Secado

El ASA es **moderadamente higroscópico** y absorbe humedad del aire con el tiempo.

| Parámetro | Valor |
|-----------|-------|
| Temperatura de secado | 65 °C |
| Tiempo de secado | 4–6 horas |
| Nivel higroscópico | Medio |
| Señales de humedad | Chasquidos, burbujas, mala superficie |

- Guardar en bolsa sellada con gel de sílice después de abrir
- El AMS con desecante es suficiente para almacenamiento a corto plazo
- Para almacenamiento prolongado: usar bolsas de vacío o caja secadora de filamento

## Aplicaciones

El ASA es el material preferido para todo lo que se usará **en exteriores**:

- **Componentes automotrices** — carcasas de espejos, detalles del salpicadero, tapas de ventilación
- **Herramientas de jardín** — soportes, pinzas, piezas para muebles de jardín
- **Señalización exterior** — carteles, letras, logotipos
- **Piezas de drones** — tren de aterrizaje, soportes de cámara
- **Montajes de paneles solares** — soportes y ángulos
- **Piezas de buzón** — mecanismos y decoraciones

## Consejos para una impresión ASA exitosa

### Brim y adhesión

- **Usa brim** para piezas grandes y piezas con poca superficie de contacto
- Un brim de 5–8 mm previene el warping eficazmente
- Para piezas más pequeñas puedes intentar sin brim, pero tenlo listo como respaldo

### Evitar corrientes de aire

- **Cierra todas las puertas y ventanas** de la habitación durante la impresión
- Las corrientes de aire y el aire frío son el peor enemigo del ASA
- No abras la puerta de la cámara durante la impresión

### Estabilidad de temperatura

- Deja que la cámara se caliente durante **10–15 minutos** antes de iniciar la impresión
- Una temperatura de cámara estable da resultados más consistentes
- Evita colocar la impresora cerca de ventanas o salidas de ventilación

### Enfriamiento

- El ASA necesita **enfriamiento limitado** — 30–50% es típico
- Para voladizos y puentes puedes aumentar a 60–70%, pero espera algo de delaminación
- Para piezas mecánicas: prioriza la unión entre capas sobre los detalles reduciendo el enfriamiento

:::tip ¿Primera vez con ASA?
Comienza con una pieza de prueba pequeña (por ej., un cubo de 30 mm) para calibrar tus ajustes. El ASA se comporta muy similar al ABS, pero con tendencia al warping ligeramente menor. Si tienes experiencia con ABS, el ASA te parecerá una mejora.
:::

---

## Contracción

El ASA se contrae más que el PLA y el PETG, pero generalmente algo menos que el ABS:

| Material | Contracción |
|----------|------------|
| PLA | ~0,3–0,5% |
| PETG | ~0,3–0,6% |
| ASA | ~0,5–0,7% |
| ABS | ~0,7–0,8% |

Para piezas con tolerancias ajustadas: compensa con 0,5–0,7% en el slicer, o prueba primero con piezas de muestra.

---

## Postprocesado

- **Alisado con acetona** — el ASA puede alisarse con vapores de acetona, igual que el ABS
- **Lijado** — se lija bien con papel de lija de grano 200–400
- **Pegado** — el pegamento CA o la soldadura con acetona funcionan excelentemente
- **Pintura** — acepta bien la pintura después de un lijado ligero

:::danger Manejo de acetona
La acetona es inflamable y emite gases tóxicos. Úsala siempre en un lugar bien ventilado, evita llamas abiertas y usa equipo de protección (guantes y gafas).
:::
