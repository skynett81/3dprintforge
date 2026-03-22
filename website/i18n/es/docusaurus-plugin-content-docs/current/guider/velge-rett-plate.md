---
sidebar_position: 4
title: Elegir la placa de construcción correcta
description: Descripción general de las placas de construcción de Bambu Labs y cuál es la más adecuada para tu filamento
---

# Elegir la placa de construcción correcta

La placa de construcción correcta es fundamental para una buena adhesión y un fácil desprendimiento de la impresión. La combinación incorrecta resulta en mala adhesión o en que la impresión quede pegada y dañe la placa.

## Tabla de resumen

| Filamento | Placa recomendada | Barra de pegamento | Temperatura de placa |
|-----------|------------------|-------------------|----------------------|
| PLA | Cool Plate / Textured PEI | No / Sí | 35–45°C |
| PETG | Textured PEI | **Sí (obligatorio)** | 70°C |
| ABS | Engineering Plate / High Temp | Sí | 90–110°C |
| ASA | Engineering Plate / High Temp | Sí | 90–110°C |
| TPU | Textured PEI | No | 35–45°C |
| PA (Nylon) | Engineering Plate | Sí | 90°C |
| PC | High Temp Plate | Sí | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Sí | 45–90°C |
| PVA | Cool Plate | No | 35°C |

## Descripción de placas

### Cool Plate (PEI lisa)
**Ideal para:** PLA, PVA
**Superficie:** Lisa, da una parte inferior lisa a la impresión
**Desprendimiento:** Dobla ligeramente la placa o espera a que se enfríe — la impresión se desprende sola

No uses Cool Plate con PETG — se adhiere **demasiado bien** y puede arrancar el recubrimiento de la placa.

### Textured PEI (Texturizado)
**Ideal para:** PETG, TPU, PLA (da superficie rugosa)
**Superficie:** Texturizado, da una parte inferior rugosa y estética
**Desprendimiento:** Espera a temperatura ambiente — se desprende solo

:::warning El PETG requiere barra de pegamento en Textured PEI
Sin barra de pegamento, el PETG se adhiere extremadamente bien al Textured PEI y puede arrancar el recubrimiento al desprender. Aplica siempre una capa fina de barra de pegamento (barra de pegamento Bambu o Elmer's Disappearing Purple Glue) sobre toda la superficie.
:::

### Engineering Plate
**Ideal para:** ABS, ASA, PA, PLA-CF, PETG-CF
**Superficie:** Tiene una superficie PEI mate con menor adhesión que el Textured PEI
**Desprendimiento:** Fácil de retirar después de enfriar. Usa barra de pegamento para ABS/ASA

### High Temp Plate
**Ideal para:** PC, PA-CF, ABS a temperaturas altas
**Superficie:** Soporta temperaturas de placa de hasta 120°C sin deformación
**Desprendimiento:** Enfriar a temperatura ambiente

## Errores comunes

### PETG en Cool Plate lisa (sin barra de pegamento)
**Problema:** El PETG se adhiere tan fuerte que la impresión no se puede retirar sin daño
**Solución:** Usar siempre Textured PEI con barra de pegamento o Engineering Plate

### ABS en Cool Plate
**Problema:** Warping — las esquinas se levantan durante la impresión
**Solución:** Engineering Plate + barra de pegamento + aumentar temperatura de cámara (cerrar la puerta frontal)

### PLA en High Temp Plate
**Problema:** Temperatura de placa demasiado alta da adhesión excesiva, difícil desprendimiento
**Solución:** Cool Plate o Textured PEI para PLA

### Demasiada barra de pegamento
**Problema:** Una barra de pegamento gruesa provoca Elephant Foot (primera capa que se extiende)
**Solución:** Una capa fina — la barra de pegamento debe ser apenas visible

## Cambiar la placa

1. **Dejar que la placa se enfríe** a temperatura ambiente (o usar guantes — la placa puede estar caliente)
2. Levantar la placa por el frente y sacarla
3. Insertar la nueva placa — el imán la mantiene en su lugar
4. **Realizar calibración automática** (Flow Rate y Bed Leveling) después del cambio de placa en Bambu Studio o a través del panel de control en **Control → Calibración**

:::info Recuerda calibrar después del cambio
Las placas tienen espesores ligeramente diferentes. Sin calibración, la primera capa puede quedar demasiado lejos o chocar contra la placa.
:::

## Mantenimiento de las placas

### Limpieza (después de cada 2–5 impresiones)
- Limpiar con IPA (isopropanol 70–99%) y un paño sin pelusa
- Evitar tocar la superficie con las manos desnudas — la grasa de la piel reduce la adhesión
- Para Textured PEI: lavar con agua tibia y detergente suave después de muchas impresiones

### Eliminar residuos de barra de pegamento
- Calentar la placa a 60°C
- Limpiar con un paño húmedo
- Terminar con una limpieza con IPA

### Sustitución
Cambia la placa cuando veas:
- Marcas o cráteres visibles después de retirar impresiones
- Mala adhesión constante incluso después de limpiar
- Burbujas o manchas en el recubrimiento

Las placas Bambu duran típicamente 200–500 impresiones dependiendo del tipo de filamento y el tratamiento.

:::tip Almacenar las placas correctamente
Guarda las placas sin uso en su embalaje original o de pie en un soporte — no apiladas con objetos pesados encima. Las placas deformadas dan una primera capa irregular.
:::
