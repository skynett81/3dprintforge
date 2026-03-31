---
sidebar_position: 4
title: Système de plugins
description: Créez et installez des plugins pour étendre 3DPrintForge
---

# Système de plugins

3DPrintForge prend en charge un système de plugins qui vous permet d'étendre les fonctionnalités sans modifier le code source.

:::info Expérimental
Le système de plugins est en cours de développement actif. L'API peut changer entre les versions.
:::

## Que peuvent faire les plugins ?

- Ajouter de nouveaux endpoints API
- Écouter les événements des imprimantes et y réagir
- Ajouter de nouveaux panneaux frontend
- Intégrer avec des services tiers
- Étendre les canaux de notification

## Structure d'un plugin

Un plugin est un module Node.js dans le dossier `plugins/` :

```
plugins/
└── mon-plugin/
    ├── plugin.json    # Métadonnées
    ├── index.js       # Point d'entrée
    └── README.md      # Documentation (facultatif)
```

### plugin.json

```json
{
  "name": "mon-plugin",
  "version": "1.0.0",
  "description": "Description du plugin",
  "author": "Votre nom",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Appelé quand le plugin est chargé
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Mon plugin est chargé');

    // Enregistrer une nouvelle route API
    api.get('/plugins/mon-plugin/status', (req, res) => {
      res.json({ status: 'actif' });
    });
  },

  // Appelé quand une impression démarre
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Impression démarrée : ${printJob.name}`);
  },

  // Appelé quand une impression est terminée
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Impression terminée : ${printJob.name}`);
    // Sauvegarder des données dans la base de données
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['mon-plugin', 'derniere-impression', printJob.name]
    );
  }
};
```

## Hooks disponibles

| Hook | Déclencheur |
|------|---------|
| `onLoad` | Plugin chargé |
| `onUnload` | Plugin déchargé |
| `onPrinterConnect` | Imprimante connectée |
| `onPrinterDisconnect` | Imprimante déconnectée |
| `onPrintStart` | Impression démarrée |
| `onPrintEnd` | Impression terminée |
| `onPrintFail` | Impression échouée |
| `onFilamentChange` | Changement de filament |
| `onAmsUpdate` | Statut AMS mis à jour |

## Contexte du plugin

Tous les hooks reçoivent un objet `context` :

| Propriété | Type | Description |
|----------|------|-------------|
| `api` | Express Router | Ajouter des routes API personnalisées |
| `db` | SQLite | Accès à la base de données |
| `logger` | Logger | Journalisation |
| `events` | EventEmitter | Écouter les événements |
| `config` | Object | Configuration du tableau de bord |
| `printers` | Map | Toutes les imprimantes connectées |

## Installer un plugin

```bash
# Copier le dossier du plugin
cp -r mon-plugin/ plugins/

# Redémarrer le tableau de bord
npm start
```

Les plugins sont activés automatiquement au démarrage s'ils se trouvent dans le dossier `plugins/`.

## Désactiver un plugin

Ajoutez `"disabled": true` dans `plugin.json`, ou supprimez le dossier.

## Exemple de plugin : Notifications Slack

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Impression terminée ! *${job.name}* a pris ${job.duration}`
    });
  }
};
```
