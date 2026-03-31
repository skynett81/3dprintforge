---
sidebar_position: 1
title: Tu primera impresión
description: Guía paso a paso para iniciar tu primera impresión 3D y monitorearla en 3DPrintForge
---

# Tu primera impresión

Esta guía te lleva por todo el proceso — desde una impresora conectada hasta una impresión terminada — con el 3DPrintForge como centro de control.

## Paso 1 — Verificar que la impresora está conectada

Cuando abres el panel de control, verás la tarjeta de estado de tu impresora en la parte superior de la barra lateral o en el panel de resumen.

**Estado verde** significa que la impresora está en línea y lista.

| Estado | Color | Significado |
|--------|-------|-------------|
| En línea | Verde | Lista para imprimir |
| Inactiva | Gris | Conectada pero no activa |
| Imprimiendo | Azul | Impresión en progreso |
| Error | Rojo | Requiere atención |

Si la impresora muestra estado rojo:
1. Verifica que la impresora esté encendida
2. Comprueba que esté conectada a la misma red que el panel de control
3. Ve a **Configuración → Impresoras** y confirma la dirección IP y el código de acceso

:::tip Usar el modo LAN para una respuesta más rápida
El modo LAN ofrece menor latencia que el modo nube. Actívalo en la configuración de la impresora si la impresora y el panel de control están en la misma red.
:::

## Paso 2 — Subir tu modelo

3DPrintForge no inicia impresiones directamente — ese es el trabajo de Bambu Studio o MakerWorld. El panel de control toma el control tan pronto como comienza la impresión.

**Mediante Bambu Studio:**
1. Abre Bambu Studio en tu PC
2. Importa o abre tu archivo `.stl` o `.3mf`
3. Lamina el modelo (elige filamento, soportes, relleno, etc.)
4. Haz clic en **Imprimir** en la parte superior derecha

**Mediante MakerWorld:**
1. Encuentra el modelo en [makerworld.com](https://makerworld.com)
2. Haz clic en **Imprimir** directamente desde el sitio web
3. Bambu Studio se abre automáticamente con el modelo listo

## Paso 3 — Iniciar la impresión

En Bambu Studio elige el método de envío:

| Método | Requisito | Ventajas |
|--------|-----------|----------|
| **Nube** | Cuenta Bambu + Internet | Funciona en cualquier lugar |
| **LAN** | Misma red | Más rápido, sin nube |
| **Tarjeta SD** | Acceso físico | Sin requisitos de red |

Haz clic en **Enviar** — la impresora recibe el trabajo y comienza automáticamente la fase de calentamiento.

:::info La impresión aparece en el panel de control
A los pocos segundos de que Bambu Studio envíe el trabajo, la impresión activa se muestra en el panel de control bajo **Impresión activa**.
:::

## Paso 4 — Monitorear en el panel de control

Cuando la impresión está en marcha, el panel de control te da una visión completa:

### Progreso
- El porcentaje completado y el tiempo estimado restante se muestran en la tarjeta de la impresora
- Haz clic en la tarjeta para una vista detallada con información de capas

### Temperaturas
El panel de detalles muestra temperaturas en tiempo real:
- **Boquilla** — temperatura actual y objetivo
- **Placa de construcción** — temperatura actual y objetivo
- **Cámara** — temperatura ambiente dentro de la impresora (importante para ABS/ASA)

### Cámara
Haz clic en el icono de la cámara en la tarjeta de la impresora para ver el feed en vivo directamente en el panel de control. Puedes tener la cámara abierta en una ventana separada mientras haces otras cosas.

:::warning Verificar las primeras capas
Las primeras 3-5 capas son críticas. Una mala adhesión ahora significa una impresión fallida más tarde. Observa la cámara y verifica que el filamento se deposite de manera limpia y uniforme.
:::

### Print Guard
3DPrintForge tiene un **Print Guard** impulsado por IA que detecta automáticamente errores de tipo espagueti y puede pausar la impresión. Actívalo en **Monitoreo → Print Guard**.

## Paso 5 — Después de que termine la impresión

Cuando la impresión termina, el panel de control muestra un mensaje de finalización (y envía una notificación si has configurado [notificaciones](./notification-setup)).

### Revisar el historial
Ve a **Historial** en la barra lateral para ver la impresión completada:
- Tiempo total de impresión
- Consumo de filamento (gramos usados, costo estimado)
- Errores o eventos HMS durante la impresión
- Foto de la cámara al finalizar (si está activado)

### Agregar una nota
Haz clic en la impresión en el historial y agrega una nota — por ejemplo, "Necesitaba un poco más de brim" o "Resultado perfecto". Esto es útil cuando vuelves a imprimir el mismo modelo.

### Verificar el consumo de filamento
En **Filamento** puedes ver que el peso del carrete se ha actualizado según lo que se usó. El panel de control descuenta automáticamente.

## Consejos para principiantes

:::tip No abandones la primera impresión
Presta atención los primeros 10-15 minutos. Cuando estés seguro de que la impresión se adhiere bien, puedes dejar que el panel de control monitoree el resto.
:::

- **Pesar los carretes vacíos** — ingresa el peso inicial de los carretes para un cálculo preciso del restante (ver [Stock de filamento](./filament-setup))
- **Configurar notificaciones de Telegram** — recibe una notificación cuando la impresión esté lista sin tener que esperar (ver [Notificaciones](./notification-setup))
- **Revisar la placa de construcción** — placa limpia = mejor adhesión. Limpia con IPA (isopropanol) entre impresiones
- **Usar la placa correcta** — ver [Elegir la placa correcta](./choosing-plate) para lo que se adapta a tu filamento
