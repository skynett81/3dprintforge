---
sidebar_position: 5
title: Control de impresora
description: Controla temperatura, velocidad, ventiladores y envía G-code directamente a la impresora
---

# Control de impresora

El panel de control te da control manual completo sobre la impresora directamente desde el panel.

## Control de temperatura

### Boquilla
- Establece la temperatura objetivo entre 0–350 °C
- Haz clic en **Establecer** para enviar el comando
- La lectura en tiempo real se muestra con un medidor de anillo animado

### Cama caliente
- Establece la temperatura objetivo entre 0–120 °C
- Apagado automático tras la impresión (configurable)

### Cámara
- Consulta la temperatura de la cámara (lectura en tiempo real)
- **X1E, H2S, H2D, H2C**: Control activo de calefacción de cámara mediante M141 (temperatura objetivo controlable)
- **X1C**: Carcasa pasiva — la temperatura de la cámara se muestra pero no se puede controlar directamente
- **P1S**: Carcasa pasiva — muestra la temperatura, sin control activo de calefacción de cámara
- **P1P, A1, A1 mini y serie H sin chamberHeat**: Sin sensor de cámara

:::warning Temperaturas máximas
No superes las temperaturas recomendadas para la boquilla y la cama. Para boquilla de acero endurecido (tipo HF): máx. 300 °C. Para latón: máx. 260 °C. Consulta el manual de la impresora.
:::

## Perfiles de velocidad

El control de velocidad ofrece cuatro perfiles preestablecidos:

| Perfil | Velocidad | Uso |
|--------|----------|-------------|
| Silencioso | 50% | Reducción de ruido, impresión nocturna |
| Estándar | 100% | Uso normal |
| Sport | 124% | Impresiones más rápidas |
| Turbo | 166% | Velocidad máxima (pérdida de calidad) |

El deslizador te permite establecer un porcentaje personalizado entre 50–200%.

## Control de ventiladores

Controla las velocidades de los ventiladores manualmente:

| Ventilador | Descripción | Rango |
|-------|-------------|--------|
| Part cooling fan | Enfría el objeto impreso | 0–100% |
| Auxiliary fan | Circulación de cámara | 0–100% |
| Chamber fan | Enfriamiento activo de cámara | 0–100% |

:::tip Configuraciones recomendadas
- **PLA/PETG:** Part cooling 100%, aux 30%
- **ABS/ASA:** Part cooling 0–20%, chamber fan apagado
- **TPU:** Part cooling 50%, velocidad baja
:::

## Consola G-code

Envía comandos G-code directamente a la impresora:

```gcode
; Ejemplo: Mover posición del cabezal
G28 ; Inicio de todos los ejes
G1 X150 Y150 Z10 F3000 ; Mover al centro
M104 S220 ; Establecer temperatura de boquilla
M140 S60  ; Establecer temperatura de cama
```

:::danger Cuidado con el G-code
Un G-code incorrecto puede dañar la impresora. Envía solo comandos que entiendas. Evita `M600` (cambio de filamento) en medio de una impresión.
:::

## Operaciones de filamento

Desde el panel de control puedes:

- **Cargar filamento** — calienta la boquilla e introduce el filamento
- **Descargar filamento** — calienta y extrae el filamento
- **Limpiar boquilla** — ejecutar ciclo de limpieza

## Macros

Guarda y ejecuta secuencias de comandos G-code como macros:

1. Haz clic en **Nueva macro**
2. Dale un nombre a la macro
3. Escribe la secuencia G-code
4. Guarda y ejecuta con un solo clic

Macro de ejemplo para calibración de cama:
```gcode
G28
M84
M500
```

## Control de impresión

Durante una impresión activa puedes:

- **Pausar** — pausa la impresión tras la capa actual
- **Reanudar** — continúa una impresión pausada
- **Detener** — cancela la impresión (irreversible)
- **Parada de emergencia** — detención inmediata de todos los motores
