---
sidebar_position: 5
title: Comercio electrónico
description: Administra pedidos, clientes y facturación para la venta de impresiones 3D — requiere licencia de geektech.no
---

# Comercio electrónico

El módulo de comercio electrónico te proporciona un sistema completo para administrar clientes, pedidos y facturación — perfecto para quienes venden impresiones 3D de forma profesional o semiprofesional.

Ir a: **https://localhost:3443/#orders**

:::danger Licencia de comercio electrónico requerida
El módulo de comercio electrónico requiere una licencia válida. Las licencias **solo pueden adquirirse en [geektech.no](https://geektech.no)**. Sin una licencia activa, el módulo está bloqueado e inaccesible.
:::

## Licencia — compra y activación

### Comprar una licencia

1. Ve a **[geektech.no](https://geektech.no)** y crea una cuenta
2. Selecciona **Bambu Dashboard — Licencia de comercio electrónico**
3. Elige el tipo de licencia:

| Tipo de licencia | Descripción | Impresoras |
|---|---|---|
| **Hobby** | Una impresora, uso personal y ventas pequeñas | 1 |
| **Profesional** | Hasta 5 impresoras, uso comercial | 1–5 |
| **Enterprise** | Impresoras ilimitadas, soporte completo | Ilimitadas |

4. Completa el pago
5. Recibirás una **clave de licencia** por correo electrónico

### Activar la licencia

1. Ve a **Configuración → Comercio electrónico** en el panel
2. Pega la **clave de licencia** en el campo
3. Haz clic en **Activar licencia**
4. El panel autentica la clave contra los servidores de geektech.no
5. Si la activación es exitosa, se muestran el tipo de licencia, la fecha de vencimiento y el número de impresoras

:::warning La clave de licencia está vinculada a tu instalación
La clave se activa para una instalación de Bambu Dashboard. Contacta a [geektech.no](https://geektech.no) si necesitas trasladar la licencia a un nuevo servidor.
:::

### Validación de la licencia

- La licencia se **valida en línea** al iniciar y luego cada 24 horas
- En caso de fallo de red, la licencia funciona hasta **7 días sin conexión**
- Licencia vencida → el módulo se bloquea, pero los datos existentes se conservan
- La renovación se realiza en **[geektech.no](https://geektech.no)** → Mis licencias → Renovar

### Verificar el estado de la licencia

Ve a **Configuración → Comercio electrónico** o llama a la API:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

La respuesta contiene:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Nombre de empresa",
  "provider": "geektech.no"
}
```

## Clientes

### Crear un cliente

1. Ve a **Comercio electrónico → Clientes**
2. Haz clic en **Nuevo cliente**
3. Completa:
   - **Nombre / Nombre de empresa**
   - **Persona de contacto** (para empresas)
   - **Correo electrónico**
   - **Teléfono**
   - **Dirección** (dirección de facturación)
   - **NIF / Número de identificación** (opcional, para contribuyentes de IVA)
   - **Nota** — anotación interna
4. Haz clic en **Crear**

### Resumen de clientes

La lista de clientes muestra:
- Nombre e información de contacto
- Número total de pedidos
- Facturación total
- Fecha del último pedido
- Estado (Activo / Inactivo)

Haz clic en un cliente para ver todo el historial de pedidos y facturación.

## Gestión de pedidos

### Crear un pedido

1. Ve a **Comercio electrónico → Pedidos**
2. Haz clic en **Nuevo pedido**
3. Selecciona el **Cliente** de la lista
4. Agrega líneas de pedido:
   - Selecciona el archivo/modelo de la biblioteca de archivos, o agrega una entrada de texto libre
   - Indica la cantidad y el precio unitario
   - El sistema calcula el costo automáticamente si se vincula a un proyecto
5. Indica la **Fecha de entrega** (estimada)
6. Haz clic en **Crear pedido**

### Estado del pedido

| Estado | Descripción |
|---|---|
| Solicitud | Solicitud recibida, no confirmada |
| Confirmado | El cliente ha confirmado |
| En producción | Impresiones en curso |
| Listo para entrega | Terminado, esperando retiro/envío |
| Entregado | Pedido completado |
| Cancelado | Cancelado por el cliente o por ti |

Actualiza el estado haciendo clic en el pedido → **Cambiar estado**.

### Vincular impresiones al pedido

1. Abre el pedido
2. Haz clic en **Vincular impresión**
3. Selecciona las impresiones del historial (se admite selección múltiple)
4. Los datos de costo se obtienen automáticamente del historial de impresiones

## Facturación

Consulta [Proyectos → Facturación](../funksjoner/projects#fakturering) para la documentación detallada de facturación.

La factura puede generarse directamente desde un pedido:

1. Abre el pedido
2. Haz clic en **Generar factura**
3. Verifica el importe e IVA
4. Descarga el PDF o envíalo al correo electrónico del cliente

### Serie de números de factura

Configura la serie de números de factura en **Configuración → Comercio electrónico**:
- **Prefijo**: por ejemplo, `2026-`
- **Número inicial**: por ejemplo, `1001`
- Los números de factura se asignan automáticamente en orden ascendente

## Informes e impuestos

### Informe de comisiones

El sistema registra todas las comisiones de transacción:
- Consulta las comisiones en **Comercio electrónico → Comisiones**
- Marca las comisiones como reportadas para fines contables
- Exporta el resumen de comisiones por período

### Estadísticas

En **Comercio electrónico → Estadísticas**:
- Facturación mensual (gráfico de barras)
- Principales clientes por facturación
- Modelos/materiales más vendidos
- Tamaño promedio de pedido

Exporta a CSV para el sistema contable.

## Soporte y contacto

:::info ¿Necesitas ayuda?
- **Preguntas sobre licencias**: contacta el soporte de [geektech.no](https://geektech.no)
- **Problemas técnicos**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Solicitudes de funciones**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
