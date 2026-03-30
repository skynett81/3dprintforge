---
sidebar_position: 3
title: Configuración
description: Resumen completo de todos los ajustes en Bambu Dashboard — impresoras, alertas, tema, OBS, energía, webhooks y más
---

# Configuración

Todos los ajustes de Bambu Dashboard están reunidos en una página con categorías claras. Aquí hay un resumen de lo que se encuentra en cada categoría.

Ir a: **https://localhost:3443/#settings**

## Impresoras

Administra las impresoras registradas:

| Ajuste | Descripción |
|---|---|
| Agregar impresora | Registrar una nueva impresora con número de serie y clave de acceso |
| Nombre de la impresora | Nombre de visualización personalizado |
| Modelo de impresora | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| Conexión MQTT | Bambu Cloud MQTT o MQTT local |
| Clave de acceso | LAN Access Code de la app de Bambu Lab |
| Dirección IP | Para el modo local (LAN) |
| Configuración de cámara | Activar/desactivar, resolución |

Consulta [Comenzar](../getting-started/setup) para la configuración paso a paso de la primera impresora.

## Alertas

Consulta la documentación completa en [Alertas](../features/notifications).

Resumen rápido:
- Activar/desactivar canales de alerta (Telegram, Discord, correo electrónico, etc.)
- Filtro de eventos por canal
- Horas silenciosas (período sin alertas)
- Botón de prueba por canal

## Tema

Consulta la documentación completa en [Tema](./themes).

- Modo claro / oscuro / automático
- 6 paletas de colores
- Color de acento personalizado
- Redondeo y compacidad

## OBS overlay

Configuración del OBS overlay:

| Ajuste | Descripción |
|---|---|
| Tema predeterminado | dark / light / minimal |
| Posición predeterminada | Esquina del overlay |
| Escala predeterminada | Escala (0.5–2.0) |
| Mostrar código QR | Mostrar código QR al panel en el overlay |

Consulta [OBS overlay](../features/obs-overlay) para la sintaxis completa de URL y configuración.

## Energía y electricidad

| Ajuste | Descripción |
|---|---|
| Token API de Tibber | Acceso a precios spot de Tibber |
| Área de precio de Nordpool | Selecciona la región de precio |
| Tarifa de red | Tu tarifa de red |
| Potencia de la impresora (W) | Configura el consumo de potencia por modelo de impresora |

## Home Assistant

| Ajuste | Descripción |
|---|---|
| Broker MQTT | IP, puerto, usuario, contraseña |
| Prefijo de descubrimiento | Estándar: `homeassistant` |
| Activar discovery | Publicar dispositivos a HA |

## Webhooks

Ajustes globales de webhook:

| Ajuste | Descripción |
|---|---|
| URL de webhook | URL de destino para eventos |
| Clave secreta | Firma HMAC-SHA256 |
| Filtro de eventos | Qué eventos se envían |
| Intentos de reintento | Número de intentos en caso de fallo (predeterminado: 3) |
| Tiempo de espera | Segundos antes de que la solicitud se abandone (predeterminado: 10) |

## Ajustes de cola

| Ajuste | Descripción |
|---|---|
| Despacho automático | Activar/desactivar |
| Estrategia de despacho | Primera libre / Menos usada / Round-robin |
| Requerir confirmación | Aprobación manual antes de enviar |
| Inicio escalonado | Retraso entre impresoras en cola |

## Seguridad

| Ajuste | Descripción |
|---|---|
| Duración de sesión | Horas/días antes del cierre de sesión automático |
| Forzar 2FA | Requerir 2FA para todos los usuarios |
| Lista blanca de IP | Limitar el acceso a direcciones IP específicas |
| Certificado HTTPS | Subir un certificado personalizado |

## Sistema

| Ajuste | Descripción |
|---|---|
| Puerto del servidor | Predeterminado: 3443 |
| Formato de registro | JSON / Texto |
| Nivel de registro | Error / Warn / Info / Debug |
| Limpieza de base de datos | Eliminación automática del historial antiguo |
| Actualizaciones | Verificar nuevas versiones |
