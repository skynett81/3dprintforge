---
sidebar_position: 1
title: Etiquetas
description: Genera códigos QR, etiquetas de bobina para impresoras térmicas (ZPL), tarjetas de color y paletas de colores compartidas para el inventario de filamento
---

# Etiquetas

La herramienta de etiquetas genera etiquetas profesionales para tus bobinas de filamento — códigos QR, etiquetas de bobina para impresoras térmicas y tarjetas de color para identificación visual.

Ir a: **https://localhost:3443/#labels**

## Códigos QR

Genera códigos QR que enlazan a la información del filamento en el panel:

1. Ve a **Etiquetas → Códigos QR**
2. Selecciona la bobina para la que quieres generar el código QR
3. El código QR se genera automáticamente y se muestra en la vista previa
4. Haz clic en **Descargar PNG** o **Imprimir**

El código QR contiene una URL al perfil del filamento en el panel. Escanéalo con el móvil para acceder rápidamente a la información de la bobina.

### Generación por lotes

1. Haz clic en **Seleccionar todas** o marca bobinas individuales
2. Haz clic en **Generar todos los códigos QR**
3. Descarga como ZIP con un PNG por bobina, o imprime todos de una vez

## Etiquetas de bobina

Etiquetas profesionales para impresoras térmicas con información completa de la bobina:

### Contenido de la etiqueta (estándar)

- Color de la bobina (bloque de color relleno)
- Nombre del material (letra grande)
- Proveedor
- Código hexadecimal del color
- Temperaturas recomendadas (boquilla y cama)
- Código QR
- Código de barras (opcional)

### ZPL para impresoras térmicas

Genera código ZPL (Zebra Programming Language) para impresoras Zebra, Brother y Dymo:

1. Ve a **Etiquetas → Impresión térmica**
2. Selecciona el tamaño de etiqueta: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Selecciona la(s) bobina(s)
4. Haz clic en **Generar ZPL**
5. Envía el código ZPL a la impresora mediante:
   - **Imprimir directamente** (conexión USB)
   - **Copiar ZPL** y enviar mediante comando de terminal
   - **Descargar archivo .zpl**

:::tip Configuración de impresora
Para impresión automática, configura la estación de impresión en **Configuración → Impresora de etiquetas** con la dirección IP y el puerto (estándar: 9100 para TCP RAW).
:::

### Etiquetas PDF

Para impresoras normales, genera un PDF con las dimensiones correctas:

1. Selecciona el tamaño de etiqueta de la plantilla
2. Haz clic en **Generar PDF**
3. Imprime en papel autoadhesivo (Avery o similar)

## Tarjetas de color

Las tarjetas de color son una cuadrícula compacta que muestra todas las bobinas visualmente:

1. Ve a **Etiquetas → Tarjetas de color**
2. Selecciona qué bobinas incluir (todas las activas, o selecciona manualmente)
3. Selecciona el formato de tarjeta: **A4** (4×8), **A3** (6×10), **Carta**
4. Haz clic en **Generar PDF**

Cada celda muestra:
- Bloque de color con el color real
- Nombre del material y código hexadecimal
- Número de material (para referencia rápida)

Ideal para laminar y colgar junto a la estación de impresión.

## Paletas de colores compartidas

Exporta una selección de colores como paleta compartida:

1. Ve a **Etiquetas → Paletas de colores**
2. Selecciona las bobinas a incluir en la paleta
3. Haz clic en **Compartir paleta**
4. Copia el enlace — otros pueden importar la paleta a su panel
5. La paleta se muestra con códigos hexadecimales y puede exportarse a **Adobe Swatch** (`.ase`) o **Procreate** (`.swatches`)
