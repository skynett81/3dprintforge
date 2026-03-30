---
sidebar_position: 1
title: Aperçu des fonctionnalités
description: Aperçu complet de toutes les fonctionnalités de Bambu Dashboard
---

# Aperçu des fonctionnalités

Bambu Dashboard regroupe tout ce dont vous avez besoin pour surveiller et contrôler vos imprimantes Bambu Lab — en un seul endroit.

## Tableau de bord

Le tableau de bord principal affiche le statut en temps réel de l'imprimante active :

- **Température** — Jauges circulaires SVG animées pour la buse et le plateau
- **Progression** — Pourcentage de progression avec heure de fin estimée
- **Caméra** — Vue caméra en direct (RTSPS → MPEG1 via ffmpeg)
- **Panneau AMS** — Représentation visuelle de tous les emplacements AMS avec couleur de filament
- **Contrôle de vitesse** — Curseur pour ajuster la vitesse (Silencieux, Standard, Sport, Turbo)
- **Panneaux statistiques** — Panneaux style Grafana avec graphiques défilants
- **Télémétrie** — Valeurs en direct pour les ventilateurs, températures, pression

Les panneaux peuvent être déplacés par glisser-déposer pour personnaliser la disposition. Utilisez le bouton de verrouillage pour fixer la disposition.

## Stock de filaments

Voir [Filament](./filament) pour la documentation complète.

- Gérer toutes les bobines avec nom, couleur, poids et fabricant
- Synchronisation AMS — voir quelles bobines sont insérées dans l'AMS
- Journal de séchage et planning de séchage
- Cartes de couleurs et prise en charge des étiquettes NFC
- Import/Export (CSV)

## Historique d'impression

Voir [Historique](./history) pour la documentation complète.

- Journal complet de toutes les impressions
- Suivi des filaments par impression
- Liens vers les modèles MakerWorld
- Statistiques et export CSV

## Planificateur

Voir [Planificateur](./scheduler) pour la documentation complète.

- Vue calendrier des impressions
- File d'attente d'impression avec priorisation
- Répartition multi-imprimante

## Contrôle de l'imprimante

Voir [Contrôle](./controls) pour la documentation complète.

- Contrôle de température (buse, plateau, chambre)
- Contrôle du profil de vitesse
- Contrôle des ventilateurs
- Console G-code
- Chargement/déchargement du filament

## Notifications

Bambu Dashboard prend en charge 7 canaux de notification :

| Canal | Événements |
|-------|-----------|
| Telegram | Impression terminée, erreur, pause |
| Discord | Impression terminée, erreur, pause |
| E-mail | Impression terminée, erreur |
| ntfy | Tous les événements |
| Pushover | Tous les événements |
| SMS (Twilio) | Erreurs critiques |
| Webhook | Charge utile personnalisée |

Configurez sous **Paramètres → Notifications**.

## Print Guard

Print Guard surveille l'impression active via la caméra (xcam) et les capteurs :

- Pause automatique en cas d'erreur spaghetti
- Niveau de sensibilité configurable
- Journal des événements détectés

## Maintenance

La section maintenance suit :

- Prochaine maintenance recommandée par composant (buse, plateaux, AMS)
- Suivi de l'usure basé sur l'historique d'impression
- Enregistrement manuel des tâches de maintenance

## Multi-imprimante

Avec la prise en charge multi-imprimante, vous pouvez :

- Gérer plusieurs imprimantes depuis un seul tableau de bord
- Basculer entre les imprimantes avec le sélecteur d'imprimante
- Afficher l'aperçu du statut de toutes les imprimantes simultanément
- Distribuer les travaux d'impression avec la file d'attente

## Overlay OBS

Une page `obs.html` dédiée fournit un overlay propre pour l'intégration OBS Studio lors des diffusions en direct d'impressions.

## Mises à jour

Mise à jour automatique intégrée via GitHub Releases. Notification et mise à jour directement depuis le tableau de bord sous **Paramètres → Mise à jour**.
