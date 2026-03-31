---
sidebar_position: 1
title: Bienvenido a 3DPrintForge
description: Un panel de control potente y auto-alojado para impresoras 3D Bambu Lab
---

# Bienvenido a 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** es un panel de control completo y auto-alojado para impresoras 3D Bambu Lab. Le ofrece visibilidad y control total sobre su impresora, inventario de filamentos, historial de impresión y más — todo desde una sola pestaña del navegador.

## ¿Qué es 3DPrintForge?

3DPrintForge se conecta directamente a su impresora mediante MQTT sobre la red local, sin dependencia de los servidores de Bambu Lab. También puede conectarse a Bambu Cloud para sincronizar modelos e historial de impresión.

### Funciones principales

- **Panel en vivo** — temperatura en tiempo real, progreso, cámara, estado AMS con indicador LIVE
- **Inventario de filamentos** — rastree todas las bobinas con sincronización AMS, soporte para bobina EXT, información de material, compatibilidad de placa y guía de secado
- **Seguimiento de filamentos** — seguimiento preciso con 4 niveles de respaldo (sensor AMS → estimación EXT → cloud → duración)
- **Guía de materiales** — 15 materiales con temperaturas, compatibilidad de placa, secado, propiedades y consejos
- **Historial de impresión** — registro completo con nombres de modelos, enlaces MakerWorld, consumo de filamento y costos
- **Planificador** — vista de calendario, cola de impresión con balanceo de carga y verificación de filamento
- **Control de impresora** — temperatura, velocidad, ventiladores, consola G-code
- **Print Guard** — protección automática con xcam + 5 monitores de sensores
- **Estimador de costos** — material, electricidad, mano de obra, desgaste, margen con precio de venta sugerido
- **Mantenimiento** — seguimiento con intervalos basados en KB, vida útil de la boquilla, vida útil de la placa y guía
- **Alertas de sonido** — 9 eventos configurables con carga de sonido personalizado y altavoz de impresora (M300)
- **Registro de actividad** — línea de tiempo persistente de todos los eventos (impresiones, errores, mantenimiento, filamento)
- **Notificaciones** — 7 canales (Telegram, Discord, correo electrónico, ntfy, Pushover, SMS, webhook)
- **Multi-impresora** — compatible con toda la gama Bambu Lab
- **17 idiomas** — noruego, inglés, alemán, francés, español, italiano, japonés, coreano, neerlandés, polaco, portugués, sueco, turco, ucraniano, chino, checo, húngaro
- **Auto-alojado** — sin dependencia de la nube, sus datos en su máquina

### Novedades en v1.1.14

- **Integración AdminLTE 4** — reestructuración HTML completa con sidebar treeview, diseño moderno y soporte CSP para CDN
- **Sistema CRM** — gestión completa de clientes con 4 paneles: clientes, pedidos, facturas y configuración de empresa con integración de historial
- **UI moderna** — acento teal, títulos en degradado, brillo hover, orbes flotantes y tema oscuro mejorado
- **Logros: 18 monumentos** — barco vikingo, Estatua de la Libertad, Eiffel Tower, Big Ben, Puerta de Brandeburgo, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, molino de viento holandés, Dragón de Wawel, Cristo Redentor, Turning Torso, Hagia Sophia, La Madre Patria, Gran Muralla China, Reloj Astronómico de Praga, Parlamento de Budapest — con popup de detalles, XP y rareza
- **Humedad/temperatura AMS** — valoración de 5 niveles con recomendaciones de almacenamiento y secado
- **Seguimiento de filamento en vivo** — actualización en tiempo real durante la impresión mediante fallback de estimación cloud
- **Rediseño de la sección de filamento** — bobinas grandes con información completa (marca, peso, temperatura, RFID, color), diseño horizontal y clic para detalles
- **Bobina EXT en línea** — bobina externa mostrada junto a las bobinas AMS con mejor uso del espacio
- **Diseño del dashboard optimizado** — 2 columnas por defecto para monitores de 24–27", vista 3D/cámara grande, filamento/AMS compacto
- **Tiempo de cambio de filamento** en el estimador de costos con contador de cambios visible
- **Sistema global de alertas** — barra de alertas con notificaciones toast en la esquina inferior derecha, no bloquea la barra de navegación
- **Tour guiado i18n** — las 14 claves del tour traducidas a 17 idiomas
- **5 nuevas páginas KB** — matriz de compatibilidad y nuevas guías de filamento traducidas a 17 idiomas
- **i18n completo** — todas las 3252 claves traducidas a 17 idiomas, incluyendo CRM y logros de monumentos

## Inicio rápido

| Tarea | Enlace |
|-------|--------|
| Instalar el panel | [Instalación](./getting-started/installation) |
| Configurar la primera impresora | [Configuración](./getting-started/setup) |
| Conectar Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Explorar todas las funciones | [Funciones](./features/overview) |
| Guía de filamentos | [Guía de materiales](./kb/filaments/guide) |
| Guía de mantenimiento | [Mantenimiento](./kb/maintenance/nozzle) |
| Documentación de la API | [API](./advanced/api) |

:::tip Modo demo
Puede probar el panel sin una impresora física ejecutando `npm run demo`. Esto inicia 3 impresoras simuladas con ciclos de impresión en vivo.
:::

## Impresoras compatibles

Todas las impresoras Bambu Lab con modo LAN:

- **Serie X1**: X1C, X1C Combo, X1E
- **Serie P1**: P1S, P1S Combo, P1P
- **Serie P2**: P2S, P2S Combo
- **Serie A**: A1, A1 Combo, A1 mini
- **Serie H2**: H2S, H2D (boquilla doble), H2C (cambiador de herramientas, 6 cabezales)

## Funciones en detalle

### Seguimiento de filamentos

El panel rastrea el consumo de filamento automáticamente con 4 niveles de respaldo:

1. **Diff sensor AMS** — más preciso, compara remain% de inicio/fin
2. **EXT directo** — para P2S/A1 sin vt_tray, usa estimación cloud
3. **Estimación cloud** — datos del trabajo de impresión de Bambu Cloud
4. **Estimación por duración** — ~30 g/hora como último respaldo

Todos los valores se muestran como el mínimo del sensor AMS y la base de datos de bobinas para evitar errores tras impresiones fallidas.

### Guía de materiales

Base de datos integrada con 15 materiales que incluye:
- Temperaturas (boquilla, cama, cámara)
- Compatibilidad de placa (Cool, Engineering, High Temp, Textured PEI)
- Información de secado (temperatura, tiempo, higroscopicidad)
- 8 propiedades (resistencia, flexibilidad, resistencia al calor, UV, superficie, facilidad de uso)
- Nivel de dificultad y requisitos especiales (boquilla endurecida, recinto)

### Alertas de sonido

9 eventos configurables con soporte para:
- **Clips de audio personalizados** — cargue MP3/OGG/WAV (máx. 10 segundos, 500 KB)
- **Tonos integrados** — sonidos metálicos/synth generados con Web Audio API
- **Altavoz de impresora** — melodías G-code M300 directamente en el buzzer de la impresora
- **Cuenta regresiva** — alerta de sonido cuando queda 1 minuto de impresión

### Mantenimiento

Sistema de mantenimiento completo con:
- Seguimiento de componentes (boquilla, tubo PTFE, varillas, cojinetes, AMS, placa, secado)
- Intervalos basados en KB de la documentación
- Vida útil de boquilla por tipo (latón, acero endurecido, HS01)
- Vida útil de placa por tipo (Cool, Engineering, High Temp, Textured PEI)
- Pestaña de guía con consejos y enlaces a la documentación completa

## Descripción técnica

3DPrintForge está construido con Node.js 22 y HTML/CSS/JS puro — sin frameworks pesados, sin paso de compilación. La base de datos es SQLite, integrada en Node.js 22.

- **Backend**: Node.js 22 con solo 3 paquetes npm (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, sin paso de compilación
- **Base de datos**: SQLite mediante el built-in de Node.js 22 `--experimental-sqlite`
- **Documentación**: Docusaurus con 17 idiomas, generada automáticamente durante la instalación
- **API**: 177+ endpoints, documentación OpenAPI en `/api/docs`

Consulte [Arquitectura](./advanced/architecture) para más detalles.
