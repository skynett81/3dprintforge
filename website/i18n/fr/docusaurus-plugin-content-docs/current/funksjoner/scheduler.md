---
sidebar_position: 4
title: Planificateur
description: Planifiez des impressions, gérez la file d'impression et configurez le dispatch automatique
---

# Planificateur

Le planificateur vous permet d'organiser et d'automatiser les tâches d'impression avec une vue calendrier et une file d'impression intelligente.

## Vue calendrier

La vue calendrier offre un aperçu de toutes les impressions planifiées et réalisées :

- **Vue mensuelle, hebdomadaire et journalière** — choisissez le niveau de détail
- **Code couleur** — couleurs différentes par imprimante et statut
- **Cliquez sur un événement** — voir les détails de l'impression

Les impressions terminées s'affichent automatiquement à partir de l'historique d'impression.

## File d'impression

La file d'impression vous permet de mettre en file des tâches envoyées à l'imprimante dans l'ordre :

### Ajouter une tâche à la file

1. Cliquez sur **+ Ajouter une tâche**
2. Sélectionnez le fichier (depuis la carte SD de l'imprimante, téléchargement local ou FTP)
3. Définissez la priorité (haute, normale, basse)
4. Sélectionnez l'imprimante cible (ou « automatique »)
5. Cliquez sur **Ajouter**

### Gestion de la file

| Action | Description |
|--------|-------------|
| Glisser-déposer | Réorganiser l'ordre |
| Pause de la file | Suspendre temporairement l'envoi |
| Passer | Envoyer la prochaine tâche sans attendre |
| Supprimer | Retirer une tâche de la file |

:::tip Dispatch multi-imprimantes
Avec plusieurs imprimantes, la file peut distribuer automatiquement les tâches aux imprimantes disponibles. Activez le **Dispatch automatique** sous **Planificateur → Paramètres**.
:::

## Impressions planifiées

Configurez des impressions à démarrer à un moment précis :

1. Cliquez sur **+ Planifier une impression**
2. Sélectionnez le fichier et l'imprimante
3. Définissez l'heure de démarrage
4. Configurez les notifications (facultatif)
5. Enregistrez

:::warning L'imprimante doit être disponible
Les impressions planifiées ne démarrent que si l'imprimante est en mode veille à l'heure indiquée. Si l'imprimante est occupée, le démarrage est reporté à la prochaine heure disponible (configurable).
:::

## Équilibrage de charge

Avec l'équilibrage de charge automatique, les tâches sont réparties intelligemment entre les imprimantes :

- **Round-robin** — répartition équitable entre toutes les imprimantes
- **Moins occupée** — envoie à l'imprimante avec le temps d'achèvement estimé le plus court
- **Manuel** — vous choisissez l'imprimante pour chaque tâche

Configurez sous **Planificateur → Équilibrage de charge**.

## Notifications

Le planificateur s'intègre avec les canaux de notification :

- Notification quand une tâche démarre
- Notification quand une tâche est terminée
- Notification en cas d'erreur ou de retard

Voir [Aperçu des fonctionnalités](./oversikt#varsler) pour configurer les canaux de notification.
