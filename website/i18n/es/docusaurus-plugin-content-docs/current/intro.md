---
sidebar_position: 1
title: Bienvenido a Bambu Dashboard
description: Un panel de control potente y auto-alojado para impresoras 3D Bambu Lab
---

# Bienvenido a Bambu Dashboard

**Bambu Dashboard** es un panel de control completo y auto-alojado para impresoras 3D Bambu Lab. Le ofrece una visión general y control total sobre su impresora, inventario de filamentos, historial de impresión y más — todo desde una sola pestaña del navegador.

## ¿Qué es Bambu Dashboard?

Bambu Dashboard se conecta directamente a su impresora mediante MQTT sobre la red local, sin dependencia de los servidores de Bambu Lab. También puede conectarse a Bambu Cloud para sincronizar modelos e historial de impresión.

### Funciones principales

- **Panel en vivo** — Temperaturas en tiempo real, progreso, cámara, estado del AMS
- **Inventario de filamentos** — Rastree todas las bobinas, colores, sincronización AMS, secado
- **Historial de impresión** — Registro completo con estadísticas y exportación
- **Planificador** — Vista de calendario y cola de impresión
- **Control de impresora** — Temperatura, velocidad, ventiladores, consola G-code
- **Notificaciones** — 7 canales (Telegram, Discord, correo electrónico, ntfy, Pushover, SMS, webhook)
- **Multi-impresora** — Compatible con toda la gama Bambu Lab: X1C, X1E, P1S, P1P, P2S, A1, A1 mini, A1 Combo, H2S, H2D, H2C y más
- **Auto-alojado** — Sin dependencia de la nube, sus datos en su máquina

## Inicio rápido

| Tarea | Enlace |
|-------|--------|
| Instalar el panel | [Instalación](./kom-i-gang/installasjon) |
| Configurar la primera impresora | [Configuración](./kom-i-gang/oppsett) |
| Conectar Bambu Cloud | [Bambu Cloud](./kom-i-gang/bambu-cloud) |
| Explorar todas las funciones | [Funciones](./funksjoner/oversikt) |
| Documentación de la API | [API](./avansert/api) |

:::tip Modo demo
Puede probar el panel sin una impresora física ejecutando `npm run demo`. Esto inicia 3 impresoras simuladas con ciclos de impresión en vivo.
:::

## Impresoras compatibles

- **Serie X1**: X1C, X1C Combo, X1E
- **Serie P1**: P1S, P1S Combo, P1P
- **Serie P2**: P2S, P2S Combo
- **Serie A**: A1, A1 Combo, A1 mini
- **Serie H2**: H2S, H2D (doble boquilla), H2C (cambiador de herramientas, 6 cabezales)

## Descripción técnica

Bambu Dashboard está construido con Node.js 22 y HTML/CSS/JS puro — sin frameworks pesados, sin paso de compilación. La base de datos es SQLite, integrada en Node.js 22. Consulte [Arquitectura](./avansert/arkitektur) para más detalles.
