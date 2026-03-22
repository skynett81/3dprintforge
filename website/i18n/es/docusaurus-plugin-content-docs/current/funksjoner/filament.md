---
sidebar_position: 2
title: Inventario de filamento
description: Gestiona bobinas de filamento, sincronización con AMS, secado y más
---

# Inventario de filamento

El inventario de filamento te da una vista completa de todas tus bobinas, integrado con el AMS y el historial de impresión.

## Vista general

El inventario muestra todas las bobinas registradas con:

- **Color** — tarjeta de color visual
- **Material** — PLA, PETG, ABS, TPU, PA, etc.
- **Proveedor** — Bambu Lab, Polymaker, eSUN, etc.
- **Peso** — gramos restantes (estimado o pesado)
- **Ranura AMS** — en qué ranura está la bobina
- **Estado** — activa, vacía, secando, almacenada

## Agregar bobinas

1. Haz clic en **+ Nueva bobina**
2. Completa material, color, proveedor y peso
3. Escanea la etiqueta NFC si está disponible, o introduce manualmente
4. Guarda

:::tip Bobinas de Bambu Lab
Las bobinas oficiales de Bambu Lab se pueden importar automáticamente mediante la integración Bambu Cloud. Ver [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Sincronización con AMS

Cuando el panel está conectado a la impresora, el estado del AMS se sincroniza automáticamente:

- Las ranuras se muestran con el color y material correcto del AMS
- El consumo se actualiza tras cada impresión
- Las bobinas vacías se marcan automáticamente

Para vincular una bobina local a una ranura AMS:
1. Ve a **Filamento → AMS**
2. Haz clic en la ranura que quieres vincular
3. Selecciona la bobina del inventario

## Secado

Registra ciclos de secado para rastrear la exposición a la humedad:

| Campo | Descripción |
|------|-------------|
| Fecha de secado | Cuándo se secó la bobina |
| Temperatura | Temperatura de secado (°C) |
| Duración | Número de horas |
| Método | Horno, caja secadora, secador de filamento |

:::info Temperaturas de secado recomendadas
Consulta la [Base de conocimiento](../kb/intro) para tiempos y temperaturas de secado específicos por material.
:::

## Tarjetas de color

La vista de tarjetas de color organiza las bobinas visualmente por color. Útil para encontrar rápidamente el color correcto. Filtra por material, proveedor o estado.

## Etiquetas NFC

Bambu Dashboard soporta etiquetas NFC para identificar rápidamente las bobinas:

1. Escribe el ID de la etiqueta NFC en la bobina del inventario
2. Escanea la etiqueta con el móvil
3. La bobina se abre directamente en el panel

## Importar y exportar

### Exportar
Exporta todo el inventario como CSV: **Filamento → Exportar → CSV**

### Importar
Importa bobinas desde CSV: **Filamento → Importar → Seleccionar archivo**

Formato CSV:
```
nombre,material,color_hex,proveedor,peso_gramos,nfc_id
PLA Blanco,PLA,#FFFFFF,Bambu Lab,1000,
PETG Negro,PETG,#000000,Polymaker,850,ABC123
```

## Estadísticas

En **Filamento → Estadísticas** encontrarás:

- Consumo total por material (últimos 30/90/365 días)
- Consumo por impresora
- Vida útil estimada restante por bobina
- Colores y proveedores más utilizados
