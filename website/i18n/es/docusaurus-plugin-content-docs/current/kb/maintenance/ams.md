---
sidebar_position: 3
title: Mantenimiento del AMS
description: Mantenimiento del AMS — tubos PTFE, vía del filamento y prevención de humedad
---

# Mantenimiento del AMS

El AMS (Automatic Material System) es un sistema preciso que requiere mantenimiento regular para funcionar de manera confiable. Los problemas más comunes son la vía del filamento sucia y la humedad en el alojamiento.

## Tubos PTFE

Los tubos PTFE transportan el filamento del AMS a la impresora. Son de las primeras piezas que se desgastan.

### Inspección
Verifica los tubos PTFE para detectar:
- **Dobleces o curvas** — obstaculizan el flujo del filamento
- **Desgaste en las conexiones** — polvo blanco alrededor de las entradas
- **Deformación de forma** — especialmente con el uso de materiales CF

### Cambio de tubos PTFE
1. Libera el filamento del AMS (ejecuta ciclo de descarga)
2. Presiona el anillo de bloqueo azul alrededor del tubo en la conexión
3. Jala el tubo hacia afuera (requiere un agarre firme)
4. Corta el nuevo tubo a la longitud correcta (no más corto que el original)
5. Empuja hasta que se detenga y bloquea

:::tip AMS Lite vs. AMS
El AMS Lite (A1/A1 Mini) tiene una configuración PTFE más simple que el AMS completo (P1S/X1C). Los tubos son más cortos y más fáciles de cambiar.
:::

## Vía del filamento

### Limpieza de la vía del filamento
Los filamentos dejan polvo y residuos en la vía del filamento, especialmente los materiales CF:

1. Ejecuta la descarga de todas las ranuras
2. Usa aire comprimido o un pincel suave para soplar el polvo suelto
3. Pasa un trozo limpio de nylon o filamento de limpieza PTFE por la vía

### Sensores
El AMS usa sensores para detectar la posición del filamento y las roturas. Mantén las ventanas de los sensores limpias:
- Limpia suavemente las lentes de los sensores con un pincel limpio
- Evita el IPA directamente en los sensores

## Humedad

El AMS no protege el filamento de la humedad. Para materiales higroscópicos (PA, PETG, TPU) se recomienda:

### Alternativas secas para AMS
- **Caja sellada:** Coloca las bobinas en una caja hermética con gel de sílice
- **Bambu Dry Box:** Accesorio de caja de secado oficial
- **Alimentador externo:** Usa un alimentador de filamento externo al AMS para materiales sensibles

### Indicadores de humedad
Coloca tarjetas indicadoras de humedad (higrómetro) en el alojamiento del AMS. Cambia las bolsas de gel de sílice cuando la humedad relativa supere el 30%.

## Ruedas dentadas y mecanismo de agarre

### Inspección
Verifica las ruedas dentadas (ruedas del extrusor en el AMS) para detectar:
- Restos de filamento entre los dientes
- Desgaste en el dentado
- Fricción irregular al jalar manualmente

### Limpieza
1. Usa un cepillo de dientes o cepillo para eliminar restos entre los dientes de la rueda
2. Sopla con aire comprimido
3. Evita aceite y lubricante — el nivel de tracción está calibrado para funcionamiento en seco

## Intervalos de mantenimiento

| Actividad | Intervalo |
|-----------|---------|
| Inspección visual de tubos PTFE | Mensual |
| Limpieza de la vía del filamento | Cada 100 horas |
| Control de sensores | Mensual |
| Cambio de gel de sílice (configuración de secado) | Según sea necesario (al 30%+ de humedad relativa) |
| Cambio de tubos PTFE | Cuando haya desgaste visible |
