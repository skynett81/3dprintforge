---
sidebar_position: 2
title: Architecture technique
description: Vue d'ensemble de l'architecture de Bambu Dashboard — stack, modules, base de données et WebSocket
---

# Architecture technique

## Diagramme système

```
Navigateur <──WebSocket──> Node.js <──MQTTS:8883──> Imprimante
Navigateur <──WS:9001+──> ffmpeg  <──RTSPS:322───> Caméra
```

Le tableau de bord communique avec l'imprimante via MQTT over TLS (port 8883) et la caméra via RTSPS (port 322). Le navigateur se connecte au tableau de bord via HTTPS et WebSocket.

## Stack technique

| Couche | Technologie |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 modules de composants, aucune étape de build, aucun framework |
| Backend | Node.js 22 avec 3 packages npm : `mqtt`, `ws`, `basic-ftp` |
| Base de données | SQLite (intégré à Node.js 22 via `--experimental-sqlite`) |
| Caméra | ffmpeg transcode RTSPS en MPEG1, jsmpeg rend dans le navigateur |
| Temps réel | Hub WebSocket diffuse l'état des imprimantes à tous les clients connectés |
| Protocole | MQTT over TLS (port 8883) avec le LAN Access Code de l'imprimante |

## Ports

| Port | Protocole | Direction | Description |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | Entrant | Tableau de bord (redirige vers HTTPS) |
| 3443 | HTTPS + WSS | Entrant | Tableau de bord sécurisé (par défaut) |
| 9001+ | WS | Entrant | Flux caméra (un par imprimante) |
| 8883 | MQTTS | Sortant | Connexion à l'imprimante |
| 322 | RTSPS | Sortant | Caméra depuis l'imprimante |

## Modules serveur (44)

| Module | Rôle |
|-------|--------|
| `index.js` | Serveurs HTTP/HTTPS, SSL auto, en-têtes CSP/HSTS, fichiers statiques, mode démo |
| `config.js` | Chargement de la configuration, valeurs par défaut, substitutions env et migrations |
| `database.js` | Schéma SQLite, 105 migrations, opérations CRUD |
| `api-routes.js` | API REST (284+ endpoints) |
| `auth.js` | Authentification et gestion des sessions |
| `backup.js` | Sauvegarde et restauration |
| `printer-manager.js` | Cycle de vie des imprimantes, gestion des connexions MQTT |
| `mqtt-client.js` | Connexion MQTT aux imprimantes Bambu |
| `mqtt-commands.js` | Construction des commandes MQTT (pause, reprise, arrêt, etc.) |
| `websocket-hub.js` | Diffusion WebSocket à tous les clients navigateur |
| `camera-stream.js` | Gestion des processus ffmpeg pour les flux caméra |
| `print-tracker.js` | Suivi des travaux d'impression, transitions d'état, journalisation de l'historique |
| `print-guard.js` | Protection d'impression via xcam + surveillance des capteurs |
| `queue-manager.js` | File d'impression avec distribution multi-imprimantes et équilibrage de charge |
| `slicer-service.js` | Pont CLI slicer local, upload de fichiers, upload FTPS |
| `telemetry.js` | Traitement des données de télémétrie |
| `telemetry-sampler.js` | Échantillonnage de données temporelles |
| `thumbnail-service.js` | Récupération de miniatures via FTPS depuis la carte SD de l'imprimante |
| `timelapse-service.js` | Enregistrement et gestion des timelapse |
| `notifications.js` | Système de notification à 7 canaux (Telegram, Discord, E-mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | Mise à jour automatique via GitHub Releases avec sauvegarde |
| `setup-wizard.js` | Assistant de configuration web pour la première utilisation |
| `ecom-license.js` | Gestion des licences |
| `failure-detection.js` | Détection et analyse des défaillances |
| `bambu-cloud.js` | Intégration API Bambu Cloud |
| `bambu-rfid-data.js` | Données filament RFID depuis AMS |
| `circuit-breaker.js` | Pattern disjoncteur pour la stabilité des services |
| `energy-service.js` | Calcul d'énergie et de prix d'électricité |
| `error-pattern-analyzer.js` | Analyse de patterns d'erreurs HMS |
| `file-parser.js` | Analyse des fichiers 3MF/GCode |
| `logger.js` | Journalisation structurée |
| `material-recommender.js` | Recommandations de matériaux |
| `milestone-service.js` | Suivi des jalons et succès |
| `plugin-manager.js` | Système de plugins pour les extensions |
| `power-monitor.js` | Intégration de mesure d'énergie (Shelly/Tasmota) |
| `price-checker.js` | Récupération des prix d'électricité (Tibber/Nordpool) |
| `printer-discovery.js` | Découverte automatique des imprimantes sur le LAN |
| `remote-nodes.js` | Gestion multi-nœuds |
| `report-service.js` | Génération de rapports |
| `seed-filament-db.js` | Peuplement de la base de données filaments |
| `spoolease-data.js` | Intégration SpoolEase |
| `validate.js` | Validation des entrées |
| `wear-prediction.js` | Prédiction d'usure des composants |

## Composants frontend (76)

Tous les composants sont des modules JavaScript vanilla sans étape de build. Ils sont chargés directement dans le navigateur via `<script type="module">`.

| Composant | Rôle |
|-----------|--------|
| `print-preview.js` | Visionneuse 3D + révélation d'image MakerWorld |
| `model-viewer.js` | Rendu 3D WebGL avec animation de couches |
| `temperature-gauge.js` | Jauges annulaires SVG animées |
| `sparkline-stats.js` | Panneaux de statistiques style Grafana |
| `ams-panel.js` | Visualisation du filament AMS |
| `camera-view.js` | Lecteur vidéo jsmpeg avec plein écran |
| `controls-panel.js` | Interface de contrôle des imprimantes |
| `history-table.js` | Historique d'impression avec recherche, filtres, export CSV |
| `filament-tracker.js` | Stock de filaments avec favoris, filtrage par couleur |
| `queue-panel.js` | Gestion de la file d'impression |
| `knowledge-panel.js` | Lecteur et éditeur de base de connaissances |

## Base de données

La base de données SQLite est intégrée à Node.js 22 et ne nécessite aucune installation externe. Le schéma est géré par 105 migrations dans `db/migrations.js`.

Tables principales :

- `printers` — configuration des imprimantes
- `print_history` — tous les travaux d'impression
- `filaments` — stock de filaments
- `ams_slots` — liaison des emplacements AMS
- `queue` — file d'impression
- `notifications_config` — paramètres de notification
- `maintenance_log` — journal de maintenance

## Sécurité

- HTTPS avec certificat auto-généré (ou le vôtre)
- Authentification basée sur JWT
- En-têtes CSP et HSTS
- Rate limiting (200 req/min)
- Aucune dépendance cloud externe pour les fonctions principales
