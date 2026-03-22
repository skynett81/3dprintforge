---
sidebar_position: 4
title: Sistema de plugins
description: Crea e instala plugins para extender Bambu Dashboard
---

# Sistema de plugins

Bambu Dashboard admite un sistema de plugins que te permite extender la funcionalidad sin modificar el código fuente.

:::info Experimental
El sistema de plugins está en desarrollo activo. La API puede cambiar entre versiones.
:::

## ¿Qué pueden hacer los plugins?

- Agregar nuevos endpoints de API
- Escuchar eventos de la impresora y reaccionar a ellos
- Agregar nuevos paneles de frontend
- Integrarse con servicios de terceros
- Extender los canales de notificación

## Estructura del plugin

Un plugin es un módulo Node.js en la carpeta `plugins/`:

```
plugins/
└── mi-plugin/
    ├── plugin.json    # Metadatos
    ├── index.js       # Punto de entrada
    └── README.md      # Documentación (opcional)
```

### plugin.json

```json
{
  "name": "mi-plugin",
  "version": "1.0.0",
  "description": "Descripción del plugin",
  "author": "Tu nombre",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Se llama cuando el plugin se carga
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Mi plugin está cargado');

    // Registrar una nueva ruta de API
    api.get('/plugins/mi-plugin/status', (req, res) => {
      res.json({ status: 'activo' });
    });
  },

  // Se llama cuando una impresión comienza
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Impresión iniciada: ${printJob.name}`);
  },

  // Se llama cuando una impresión termina
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Impresión terminada: ${printJob.name}`);
    // Guardar datos en la base de datos
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['mi-plugin', 'ultima-impresion', printJob.name]
    );
  }
};
```

## Hooks disponibles

| Hook | Disparador |
|------|---------|
| `onLoad` | El plugin se carga |
| `onUnload` | El plugin se descarga |
| `onPrinterConnect` | La impresora se conecta |
| `onPrinterDisconnect` | La impresora se desconecta |
| `onPrintStart` | La impresión comienza |
| `onPrintEnd` | La impresión se completa |
| `onPrintFail` | La impresión falla |
| `onFilamentChange` | Cambio de filamento |
| `onAmsUpdate` | El estado del AMS se actualiza |

## Contexto del plugin

Todos los hooks reciben un objeto `context`:

| Propiedad | Tipo | Descripción |
|----------|------|-------------|
| `api` | Express Router | Agregar rutas de API propias |
| `db` | SQLite | Acceso a la base de datos |
| `logger` | Logger | Logging |
| `events` | EventEmitter | Escuchar eventos |
| `config` | Object | Configuración del panel |
| `printers` | Map | Todas las impresoras conectadas |

## Instalar un plugin

```bash
# Copiar la carpeta del plugin
cp -r mi-plugin/ plugins/

# Reiniciar el panel
npm start
```

Los plugins se activan automáticamente al inicio si están en la carpeta `plugins/`.

## Desactivar un plugin

Agrega `"disabled": true` en `plugin.json`, o elimina la carpeta.

## Plugin de ejemplo: Notificaciones de Slack

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `¡Impresión terminada! *${job.name}* tomó ${job.duration}`
    });
  }
};
```
