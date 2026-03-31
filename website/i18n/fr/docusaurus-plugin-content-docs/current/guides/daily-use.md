---
sidebar_position: 3
title: Utilisation quotidienne
description: Un guide pratique pour l'utilisation quotidienne de 3DPrintForge — routine matinale, surveillance, après impression et maintenance
---

# Utilisation quotidienne

Ce guide explique comment utiliser 3DPrintForge efficacement au quotidien — du début de la journée jusqu'à l'extinction des lumières.

## Routine matinale

Ouvrez le tableau de bord et passez rapidement en revue ces points :

### 1. Vérifier le statut des imprimantes
Le panneau de vue d'ensemble affiche le statut de toutes vos imprimantes. Regardez :
- **Icônes rouges** — erreurs nécessitant votre attention
- **Messages en attente** — avertissements HMS de la nuit
- **Impressions non terminées** — si vous aviez une impression nocturne, est-elle terminée ?

### 2. Vérifier les niveaux AMS
Allez dans **Filament** ou consultez le widget AMS dans le tableau de bord :
- Des bobines ont-elles moins de 100 g ? Remplacez ou commandez de nouvelles
- Le bon filament est-il dans le bon emplacement pour les impressions du jour ?

### 3. Vérifier les notifications et les événements
Sous **Journal des notifications** (icône en forme de cloche), vous voyez :
- Les événements survenus pendant la nuit
- Les erreurs enregistrées automatiquement
- Les codes HMS qui ont déclenché une alarme

## Démarrer une impression

### Depuis un fichier (Bambu Studio)
1. Ouvrez Bambu Studio
2. Chargez et découpez le modèle
3. Envoyez à l'imprimante — le tableau de bord se met à jour automatiquement

### Depuis la file d'attente
Si vous avez planifié des impressions à l'avance :
1. Allez dans **File d'attente**
2. Cliquez sur **Démarrer le suivant** ou faites glisser une tâche vers le haut
3. Confirmez avec **Envoyer à l'imprimante**

Voir la [documentation de la file d'impression](../features/queue) pour des informations complètes sur la gestion de la file d'attente.

### Impression planifiée (scheduler)
Pour démarrer une impression à un moment précis :
1. Allez dans **Planificateur**
2. Cliquez sur **+ Nouvelle tâche**
3. Choisissez le fichier, l'imprimante et l'heure
4. Activez **Optimisation du prix de l'électricité** pour choisir automatiquement l'heure la moins chère

Voir [Planificateur](../features/scheduler) pour les détails.

## Surveiller une impression active

### Vue caméra
Cliquez sur l'icône de caméra sur la carte de l'imprimante. Vous pouvez :
- Voir le flux en direct dans le tableau de bord
- Ouvrir dans un onglet séparé pour une surveillance en arrière-plan
- Prendre une capture d'écran manuelle

### Informations de progression
La carte d'impression active affiche :
- Pourcentage d'avancement
- Temps restant estimé
- Couche actuelle / nombre total de couches
- Filament actif et couleur

### Températures
Les courbes de température en temps réel s'affichent dans le panneau de détails :
- Température de buse — doit rester stable à ±2°C
- Température du plateau — importante pour une bonne adhérence
- Température de chambre — monte progressivement, particulièrement pertinente pour ABS/ASA

### Print Guard
Si **Print Guard** est activé, le tableau de bord surveille automatiquement les spaghettis et les déviations volumétriques. Si quelque chose est détecté :
1. L'impression est mise en pause
2. Vous recevez une notification
3. Les images de caméra sont sauvegardées pour vérification ultérieure

## Après l'impression — liste de vérification

### Vérifier la qualité
1. Ouvrez la caméra et regardez le résultat pendant qu'il est encore sur le plateau
2. Allez dans **Historique → Dernière impression** pour consulter les statistiques
3. Ajoutez une note : ce qui s'est bien passé, ce qui peut être amélioré

### Archiver
Les impressions dans l'historique ne sont jamais archivées automatiquement — elles restent en place. Si vous souhaitez faire du rangement :
- Cliquez sur une impression → **Archiver** pour la déplacer vers l'archive
- Utilisez **Projets** pour regrouper les impressions connexes

### Mettre à jour le poids du filament
Si vous pesez la bobine pour plus de précision (recommandé) :
1. Pesez la bobine
2. Allez dans **Filament → [Bobine]**
3. Mettez à jour le **Poids restant**

## Rappels de maintenance

Le tableau de bord suit automatiquement les intervalles de maintenance. Sous **Maintenance**, vous voyez :

| Tâche | Intervalle | Statut |
|-------|-----------|--------|
| Nettoyer la buse | Toutes les 50 heures | Vérifié automatiquement |
| Lubrifier les tiges | Toutes les 200 heures | Suivi dans le tableau de bord |
| Calibrer le plateau | Après un changement de plateau | Rappel manuel |
| Nettoyer l'AMS | Mensuel | Notification calendrier |

Activez les notifications de maintenance dans **Surveillance → Maintenance → Notifications**.

:::tip Définir un jour de maintenance hebdomadaire
Un jour de maintenance fixe par semaine (par ex. dimanche soir) vous évite des temps d'arrêt inutiles. Utilisez la fonction de rappel dans le tableau de bord.
:::

## Prix de l'électricité — meilleur moment pour imprimer

Si vous avez connecté l'intégration du prix de l'électricité (Nordpool / Home Assistant) :

1. Allez dans **Analyse → Prix de l'électricité**
2. Consultez le graphique des prix pour les 24 prochaines heures
3. Les heures les moins chères sont marquées en vert

Utilisez le **Planificateur** avec l'**Optimisation du prix de l'électricité** activée — le tableau de bord démarrera alors automatiquement la tâche dans la fenêtre disponible la moins chère.

:::info Heures typiquement les moins chères
La nuit (01h00–06h00) est généralement la moins chère en Europe du Nord. Une impression de 8 heures mise en file d'attente la veille au soir peut vous faire économiser 30 à 50 % sur les coûts d'électricité.
:::
