---
sidebar_position: 2
title: Configurar el stock de filamento
description: Cómo crear, configurar y hacer seguimiento de tus carretes de filamento en 3DPrintForge
---

# Configurar el stock de filamento

El stock de filamento en 3DPrintForge te da una visión completa de todos tus carretes — qué queda, qué se ha consumido y qué carretes están en el AMS ahora mismo.

## Creación automática desde el AMS

Cuando conectas una impresora con AMS, el panel de control lee automáticamente la información de los chips RFID en los carretes Bambu:

- Tipo de filamento (PLA, PETG, ABS, TPU, etc.)
- Color (con código hexadecimal)
- Marca (Bambu Lab)
- Peso del carrete y cantidad restante

**Estos carretes se crean automáticamente en el stock** — no necesitas hacer nada. Vélos en **Filamento → Stock**.

:::info Solo los carretes Bambu tienen RFID
Los carretes de terceros (por ej. eSUN, Polymaker, recargas Bambu sin chip) no se reconocen automáticamente. Estos deben agregarse manualmente.
:::

## Agregar carretes manualmente

Para carretes sin RFID o carretes que no están en el AMS:

1. Ve a **Filamento → Stock**
2. Haz clic en **+ Nuevo carrete** en la parte superior derecha
3. Completa los campos:

| Campo | Ejemplo | Obligatorio |
|-------|---------|-------------|
| Marca | eSUN, Polymaker, Bambu | Sí |
| Tipo | PLA, PETG, ABS, TPU | Sí |
| Color | #FF5500 o elegir del selector de color | Sí |
| Peso inicial | 1000 g | Recomendado |
| Restante | 850 g | Recomendado |
| Diámetro | 1,75 mm | Sí |
| Nota | "Comprado 2025-01, funciona bien" | Opcional |

4. Haz clic en **Guardar**

## Configurar colores y marcas

Puedes editar un carrete en cualquier momento haciendo clic en él en la vista general del stock:

- **Color** — Elige del selector de color o escribe un valor hexadecimal. El color se usa como marcador visual en la vista general del AMS
- **Marca** — Se muestra en estadísticas y filtrado. Crea tus propias marcas en **Filamento → Marcas**
- **Perfil de temperatura** — Escribe la temperatura recomendada de boquilla y placa del fabricante del filamento. El panel de control puede entonces advertir si eliges la temperatura incorrecta

## Entender la sincronización del AMS

El panel de control sincroniza el estado del AMS en tiempo real:

```
AMS Ranura 1 → Carrete: Bambu PLA Blanco  [███████░░░] 72% restante
AMS Ranura 2 → Carrete: eSUN PETG Gris    [████░░░░░░] 41% restante
AMS Ranura 3 → (vacía)
AMS Ranura 4 → Carrete: Bambu PLA Rojo    [██████████] 98% restante
```

La sincronización se actualiza:
- **Durante la impresión** — el consumo se descuenta en tiempo real
- **Al final de la impresión** — el consumo final se registra en el historial
- **Manualmente** — haz clic en el icono de sincronización de un carrete para obtener datos actualizados del AMS

:::tip Corregir la estimación del AMS
La estimación del AMS desde RFID no siempre es 100% precisa después del primer uso. Pesa el carrete y actualiza el peso manualmente para mayor precisión.
:::

## Verificar el consumo y el restante

### Por carrete
Haz clic en un carrete en el stock para ver:
- Total usado (gramos, todas las impresiones)
- Cantidad restante estimada
- Lista de todas las impresiones que usaron este carrete

### Estadísticas globales
En **Análisis → Análisis de filamento** puedes ver:
- Consumo por tipo de filamento a lo largo del tiempo
- Qué marcas usas más
- Costo estimado basado en el precio de compra por kg

### Alertas de nivel bajo
Configura alertas cuando un carrete se acerca al final:

1. Ve a **Filamento → Configuración**
2. Activa **Alertar con stock bajo**
3. Establece el umbral (por ej. 100 g restantes)
4. Elige el canal de notificación (Telegram, Discord, email)

## Consejo: Pesar carretes para mayor precisión

Las estimaciones del AMS y las estadísticas de impresión nunca son del todo exactas. El método más preciso es pesar el carrete en sí:

**Cómo hacerlo:**

1. Encuentra el peso tara (carrete vacío) — normalmente 200–250 g, comprueba el sitio web del fabricante o el fondo del carrete
2. Pesa el carrete con filamento en una balanza de cocina
3. Resta el peso tara
4. Actualiza **Restante** en el perfil del carrete

**Ejemplo:**
```
Peso medido:      743 g
Tara (vacío):   - 230 g
Filamento restante: 513 g
```

:::tip Generador de etiquetas de carrete
En **Herramientas → Etiquetas** puedes imprimir etiquetas con código QR para tus carretes. Escanea el código con el teléfono para abrir rápidamente el perfil del carrete.
:::
