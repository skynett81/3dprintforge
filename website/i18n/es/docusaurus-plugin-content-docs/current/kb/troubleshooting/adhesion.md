---
sidebar_position: 1
title: Mala adherencia
description: Causas y soluciones para la mala adherencia de la primera capa — placa, temperatura, bastón adhesivo, velocidad, desplazamiento Z
---

# Mala adherencia

La mala adherencia es uno de los problemas más comunes en la impresión 3D. La primera capa no se pega, o las piezas dejan de adherirse a mitad del trabajo.

## Síntomas

- La primera capa no se adhiere — la pieza se mueve o se levanta
- Las esquinas y los bordes se levantan (warping)
- La pieza se suelta a mitad del trabajo
- Primera capa irregular con huecos o hilos sueltos

## Lista de verificación — prueba en este orden

### 1. Limpia la placa
La causa más común de mala adherencia es la grasa o suciedad en la placa.

```
1. Limpia la placa con IPA (alcohol isopropílico)
2. Evita tocar la superficie de impresión con los dedos desnudos
3. Si el problema persiste: lava con agua y detergente suave
```

### 2. Calibra el desplazamiento Z

El desplazamiento Z es la altura entre la boquilla y la placa en la primera capa. Demasiado alto = el hilo cuelga suelto. Demasiado bajo = la boquilla raspa la placa.

**Desplazamiento Z correcto:**
- La primera capa debe verse ligeramente transparente
- El hilo debe presionarse hacia la placa con un pequeño aplastamiento
- Los hilos deben fundirse ligeramente entre sí

Ajusta el desplazamiento Z en **Control → Ajustar Z en vivo** durante la impresión.

:::tip Ajusta en vivo mientras imprimes
Bambu Dashboard muestra botones de ajuste de desplazamiento Z durante la impresión activa. Ajusta en pasos de ±0.02 mm mientras observas la primera capa.
:::

### 3. Verifica la temperatura de la cama

| Material | Temperatura baja | Recomendada |
|-----------|-------------|---------|
| PLA | Por debajo de 30 °C | 35–45 °C |
| PETG | Por debajo de 60 °C | 70–85 °C |
| ABS | Por debajo de 80 °C | 90–110 °C |
| TPU | Por debajo de 25 °C | 30–45 °C |

Intenta aumentar la temperatura de la cama en pasos de 5 °C.

### 4. Usa bastón adhesivo

El bastón adhesivo mejora la adherencia para la mayoría de los materiales en la mayoría de las placas:
- Aplica una capa delgada y uniforme
- Deja secar 30 segundos antes de iniciar
- Especialmente importante para: ABS, PA, PC, PETG (en Smooth PEI)

### 5. Reduce la velocidad de la primera capa

Una menor velocidad en la primera capa da mejor contacto entre el filamento y la placa:
- Estándar: 50 mm/s para la primera capa
- Prueba: 30–40 mm/s
- En Bambu Studio: en **Calidad → Velocidad de primera capa**

### 6. Verifica el estado de la placa

Una placa desgastada da mala adherencia incluso con la configuración perfecta. Reemplaza la placa si:
- El recubrimiento PEI tiene daños visibles
- La limpieza no ayuda

### 7. Usa brim

Para materiales propensos al warping (ABS, PA, objetos planos grandes):
- Agrega brim en el slicer: 5–10 mm de ancho
- Aumenta el área de contacto y mantiene los bordes hacia abajo

## Casos especiales

### Objetos planos grandes
Los objetos planos grandes son los más propensos a soltarse. Medidas:
- Brim 8–10 mm
- Aumenta la temperatura de la cama
- Cierra la cámara (ABS/PA)
- Reduce la refrigeración de pieza

### Superficies glaseadas
Las placas con demasiado bastón adhesivo con el tiempo pueden volverse glaseadas. Lava bien con agua y empieza de nuevo.

### Después de cambiar el filamento
Los diferentes materiales requieren diferentes configuraciones. Verifica que la temperatura de la cama y la placa estén configuradas para el nuevo material.
