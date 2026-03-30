---
sidebar_position: 9
title: Proyectos
description: Organiza impresiones en proyectos, rastrea costos, genera facturas y comparte proyectos con clientes
---

# Proyectos

Los proyectos te permiten agrupar impresiones relacionadas, rastrear costos de materiales, facturar a clientes y compartir un resumen de tu trabajo.

Ir a: **https://localhost:3443/#projects**

## Crear un proyecto

1. Haz clic en **Nuevo proyecto** (ícono +)
2. Completa:
   - **Nombre del proyecto** — nombre descriptivo (máx. 100 caracteres)
   - **Cliente** — cuenta de cliente opcional (ver [E-commerce](../integrations/ecommerce))
   - **Descripción** — breve descripción de texto
   - **Color** — elige un color para identificación visual
   - **Etiquetas** — palabras clave separadas por comas
3. Haz clic en **Crear proyecto**

## Vincular impresiones a un proyecto

### Durante una impresión

1. Abre el panel mientras una impresión está en curso
2. Haz clic en **Vincular a proyecto** en el panel lateral
3. Selecciona un proyecto existente o crea uno nuevo
4. La impresión se vincula automáticamente al proyecto cuando se completa

### Desde el historial

1. Ve a **Historial**
2. Encuentra la impresión en cuestión
3. Haz clic en la impresión → **Vincular a proyecto**
4. Selecciona el proyecto en el menú desplegable

### Vinculación masiva

1. Selecciona varias impresiones en el historial con las casillas de verificación
2. Haz clic en **Acciones → Vincular a proyecto**
3. Selecciona el proyecto — todas las impresiones seleccionadas se vinculan

## Resumen de costos

Cada proyecto calcula los costos totales basándose en:

| Tipo de costo | Fuente |
|---|---|
| Consumo de filamento | Gramos × precio por gramo por material |
| Electricidad | kWh × precio de electricidad (de Tibber/Nordpool si está configurado) |
| Desgaste de máquina | Calculado desde [Predicción de desgaste](../monitoring/wearprediction) |
| Costo manual | Entradas de texto libre que agregas manualmente |

El resumen de costos se muestra como tabla y gráfico circular por impresión y total.

:::tip Tarifas eléctricas
Activa la integración de Tibber o Nordpool para obtener costos eléctricos precisos por impresión. Ver [Precio de electricidad](../integrations/energy).
:::

## Facturación

1. Abre un proyecto y haz clic en **Generar factura**
2. Completa:
   - **Fecha de factura** y **fecha de vencimiento**
   - **Tasa de IVA** (0 %, 15 %, 25 %)
   - **Margen** (%)
   - **Nota al cliente**
3. Previsualiza la factura en formato PDF
4. Haz clic en **Descargar PDF** o **Enviar al cliente** (por correo electrónico)

Las facturas se guardan bajo el proyecto y se pueden abrir y editar hasta que sean enviadas.

:::info Datos del cliente
Los datos del cliente (nombre, dirección, número de registro) se obtienen de la cuenta de cliente que vinculaste al proyecto. Ver [E-commerce](../integrations/ecommerce) para gestionar clientes.
:::

## Estado del proyecto

| Estado | Descripción |
|---|---|
| Activo | El proyecto está en proceso |
| Completado | Todas las impresiones están listas, factura enviada |
| Archivado | Oculto de la vista estándar, pero buscable |
| En espera | Temporalmente detenido |

Cambia el estado haciendo clic en el indicador de estado en la parte superior del proyecto.

## Compartir un proyecto

Genera un enlace compartible para mostrar el resumen del proyecto a los clientes:

1. Haz clic en **Compartir proyecto** en el menú del proyecto
2. Elige qué mostrar:
   - ✅ Impresiones e imágenes
   - ✅ Consumo total de filamento
   - ❌ Costos y precios (ocultos por defecto)
3. Establece el tiempo de expiración del enlace
4. Copia y comparte el enlace

El cliente ve una página de solo lectura sin necesidad de iniciar sesión.
