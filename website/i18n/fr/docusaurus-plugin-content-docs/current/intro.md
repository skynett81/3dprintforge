---
sidebar_position: 1
title: Bienvenue sur Bambu Dashboard
description: Un tableau de bord puissant et auto-hébergé pour les imprimantes 3D Bambu Lab
---

# Bienvenue sur Bambu Dashboard

**Bambu Dashboard** est un panneau de contrôle complet et auto-hébergé pour les imprimantes 3D Bambu Lab. Il vous offre une vue d'ensemble et un contrôle total sur votre imprimante, le stock de filaments, l'historique d'impression et bien plus — le tout depuis un seul onglet de navigateur.

## Qu'est-ce que Bambu Dashboard ?

Bambu Dashboard se connecte directement à votre imprimante via MQTT sur le réseau local, sans dépendance aux serveurs Bambu Lab. Vous pouvez également vous connecter à Bambu Cloud pour synchroniser les modèles et l'historique d'impression.

### Fonctionnalités principales

- **Tableau de bord en direct** — Températures en temps réel, progression, caméra, statut AMS
- **Stock de filaments** — Suivez toutes les bobines, couleurs, synchronisation AMS, séchage
- **Historique d'impression** — Journal complet avec statistiques et export
- **Planificateur** — Vue calendrier et file d'attente d'impression
- **Contrôle de l'imprimante** — Température, vitesse, ventilateurs, console G-code
- **Notifications** — 7 canaux (Telegram, Discord, e-mail, ntfy, Pushover, SMS, webhook)
- **Multi-imprimante** — Prend en charge toute la gamme Bambu Lab : X1C, X1E, P1S, P1P, P2S, A1, A1 mini, A1 Combo, H2S, H2D, H2C et plus
- **Auto-hébergé** — Aucune dépendance au cloud, vos données sur votre machine

## Démarrage rapide

| Tâche | Lien |
|-------|------|
| Installer le tableau de bord | [Installation](./kom-i-gang/installasjon) |
| Configurer la première imprimante | [Configuration](./kom-i-gang/oppsett) |
| Connecter Bambu Cloud | [Bambu Cloud](./kom-i-gang/bambu-cloud) |
| Explorer toutes les fonctionnalités | [Fonctionnalités](./funksjoner/oversikt) |
| Documentation API | [API](./avansert/api) |

:::tip Mode démo
Vous pouvez essayer le tableau de bord sans imprimante physique en exécutant `npm run demo`. Cela démarre 3 imprimantes simulées avec des cycles d'impression en direct.
:::

## Imprimantes prises en charge

- **Série X1** : X1C, X1C Combo, X1E
- **Série P1** : P1S, P1S Combo, P1P
- **Série P2** : P2S, P2S Combo
- **Série A** : A1, A1 Combo, A1 mini
- **Série H2** : H2S, H2D (double buse), H2C (changeur d'outils, 6 têtes)

## Aperçu technique

Bambu Dashboard est construit avec Node.js 22 et du HTML/CSS/JS natif — pas de frameworks lourds, pas d'étape de build. La base de données est SQLite, intégrée à Node.js 22. Voir [Architecture](./avansert/arkitektur) pour les détails.
