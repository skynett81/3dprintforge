---
sidebar_position: 8
title: PVA y materiales de soporte
description: Guía de PVA, HIPS, PVB y otros materiales de soporte para impresoras Bambu Lab
---

# PVA y materiales de soporte

Los materiales de soporte se utilizan para imprimir geometrías complejas con voladizos, puentes y cavidades internas que no pueden imprimirse sin soporte temporal. Después de la impresión, el material de soporte se retira — ya sea mecánicamente o por disolución en un disolvente.

## Resumen

| Material | Disolvente | Combinar con | Tiempo de disolución | Dificultad |
|----------|-----------|-------------|---------------------|------------|
| PVA | Agua | PLA, PETG | 12–24 horas | Exigente |
| HIPS | d-Limoneno | ABS, ASA | 12–24 horas | Moderada |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 horas | Moderada |
| BVOH | Agua | PLA, PETG, PA | 4–8 horas | Exigente |

---

## PVA (Alcohol polivinílico)

El PVA es un material de soporte soluble en agua, la opción más utilizada para impresiones basadas en PLA con estructuras de soporte complejas.

### Ajustes

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 190–210 °C |
| Temperatura de cama | 45–60 °C |
| Enfriamiento de pieza | 100% |
| Velocidad | 60–80% |
| Retracción | Aumentada (6–8 mm) |

### Placas de construcción recomendadas

| Placa | Idoneidad | ¿Barra de pegamento? |
|-------|-----------|---------------------|
| Cool Plate (Smooth PEI) | Excelente | No |
| Textured PEI | Buena | No |
| Engineering Plate | Buena | No |
| High Temp Plate | Evitar | — |

### Compatibilidad

El PVA funciona mejor con materiales que imprimen a **temperaturas similares**:

| Material principal | Compatibilidad | Nota |
|-------------------|---------------|------|
| PLA | Excelente | Combinación ideal |
| PETG | Buena | La temperatura de cama puede ser algo alta para PVA |
| ABS/ASA | Mala | Temperatura de cámara demasiado alta — el PVA se degrada |
| PA (Nylon) | Mala | Temperaturas demasiado altas |

### Disolución

- Coloca la impresión terminada en **agua tibia** (aprox. 40 °C)
- El PVA se disuelve en **12–24 horas** dependiendo del grosor
- Remueve el agua periódicamente para acelerar el proceso
- Cambia el agua cada 6–8 horas para una disolución más rápida
- Un limpiador ultrasónico da resultados significativamente más rápidos (2–6 horas)

:::danger El PVA es extremadamente higroscópico
El PVA absorbe humedad del aire **muy rápidamente** — incluso horas de exposición pueden arruinar los resultados de impresión. El PVA que ha absorbido humedad causa:

- Burbujeo intenso y chasquidos
- Mala adhesión al material principal
- Stringing y superficie pegajosa
- Boquilla obstruida

**Seca siempre el PVA inmediatamente antes de usar** e imprime desde un ambiente seco (caja secadora).
:::

### Secado del PVA

| Parámetro | Valor |
|-----------|-------|
| Temperatura de secado | 45–55 °C |
| Tiempo de secado | 6–10 horas |
| Nivel higroscópico | Extremadamente alto |
| Método de almacenamiento | Caja sellada con desecante, siempre |

---

## HIPS (Poliestireno de alto impacto)

El HIPS es un material de soporte que se disuelve en d-limoneno (disolvente a base de cítricos). Es el material de soporte preferido para ABS y ASA.

### Ajustes

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 220–240 °C |
| Temperatura de cama | 90–100 °C |
| Temperatura de cámara | 40–50 °C (recomendado) |
| Enfriamiento de pieza | 20–40% |
| Velocidad | 70–90% |

### Compatibilidad

| Material principal | Compatibilidad | Nota |
|-------------------|---------------|------|
| ABS | Excelente | Combinación ideal — temperaturas similares |
| ASA | Excelente | Muy buena adhesión |
| PLA | Mala | Diferencia de temperatura demasiado grande |
| PETG | Mala | Comportamiento térmico diferente |

### Disolución en d-Limoneno

- Coloca la impresión en **d-limoneno** (disolvente a base de cítricos)
- Tiempo de disolución: **12–24 horas** a temperatura ambiente
- Calentar a 35–40 °C acelera el proceso
- El d-limoneno puede reutilizarse 2–3 veces
- Enjuaga la pieza con agua y seca después de la disolución

### Ventajas sobre el PVA

- **Mucho menos sensible a la humedad** — más fácil de almacenar y manipular
- **Más fuerte como soporte** — soporta más sin degradarse
- **Mejor compatibilidad térmica** con ABS/ASA
- **Más fácil de imprimir** — menos obstrucciones y problemas

:::warning El d-Limoneno es un disolvente
Usa guantes y trabaja en un lugar ventilado. El d-limoneno puede irritar la piel y las mucosas. Almacenar fuera del alcance de los niños.
:::

---

## PVB (Polivinil butiral)

El PVB es un material de soporte único que se disuelve en isopropanol (IPA) y puede usarse para alisar superficies con vapor de IPA.

### Ajustes

| Parámetro | Valor |
|-----------|-------|
| Temperatura de boquilla | 200–220 °C |
| Temperatura de cama | 55–75 °C |
| Enfriamiento de pieza | 80–100% |
| Velocidad | 70–80% |

### Compatibilidad

| Material principal | Compatibilidad | Nota |
|-------------------|---------------|------|
| PLA | Buena | Adhesión aceptable |
| PETG | Moderada | La temperatura de cama puede variar |
| ABS/ASA | Mala | Temperaturas demasiado altas |

### Alisado de superficie con vapor de IPA

La propiedad única del PVB es que la superficie puede alisarse con vapor de IPA:

1. Coloca la pieza en un recipiente cerrado
2. Pon un paño humedecido en IPA en el fondo (sin contacto directo con la pieza)
3. Deja actuar el vapor durante **30–60 minutos**
4. Retira y deja secar 24 horas
5. El resultado es una superficie lisa y semi-brillante

:::tip PVB como acabado superficial
Aunque el PVB es principalmente un material de soporte, puede imprimirse como capa exterior en piezas de PLA para obtener una superficie que puede alisarse con IPA. Esto da un acabado que recuerda al ABS alisado con acetona.
:::

---

## Comparación de materiales de soporte

| Propiedad | PVA | HIPS | PVB | BVOH |
|-----------|-----|------|-----|------|
| Disolvente | Agua | d-Limoneno | IPA | Agua |
| Tiempo de disolución | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Sensibilidad a humedad | Extremadamente alta | Baja | Moderada | Extremadamente alta |
| Dificultad | Exigente | Moderada | Moderada | Exigente |
| Precio | Alto | Moderado | Alto | Muy alto |
| Mejor con | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Disponibilidad | Buena | Buena | Limitada | Limitada |
| Compatible AMS | Sí (con desecante) | Sí | Sí | Problemático |

---

## Consejos para doble extrusión y multicolor

### Pautas generales

- **Cantidad de purga** — los materiales de soporte requieren buena purga durante los cambios de material (mínimo 150–200 mm³)
- **Capas de interfaz** — usa 2–3 capas de interfaz entre soporte y pieza principal para una superficie limpia
- **Distancia** — establece la distancia de soporte en 0,1–0,15 mm para fácil remoción después de la disolución
- **Patrón de soporte** — usa patrón triangular para PVA/BVOH, rejilla para HIPS

### Configuración AMS

- Coloca el material de soporte en una **ranura AMS con desecante**
- Para PVA: considera una caja secadora externa con conexión Bowden
- Configura el perfil de material correcto en Bambu Studio
- Prueba con un modelo simple con voladizo antes de imprimir piezas complejas

### Problemas comunes y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| El soporte no adhiere | Distancia demasiado grande | Reducir distancia de interfaz a 0,05 mm |
| El soporte adhiere demasiado | Distancia demasiado pequeña | Aumentar distancia de interfaz a 0,2 mm |
| Burbujas en material de soporte | Humedad | Secar el filamento a fondo |
| Stringing entre materiales | Retracción insuficiente | Aumentar retracción en 1–2 mm |
| Mala superficie contra el soporte | Pocas capas de interfaz | Aumentar a 3–4 capas de interfaz |

:::tip Empieza simple
Para tu primera impresión con material de soporte: usa PLA + PVA, un modelo simple con voladizo claro (45°+) y ajustes predeterminados en Bambu Studio. Optimiza a medida que adquieras experiencia.
:::
