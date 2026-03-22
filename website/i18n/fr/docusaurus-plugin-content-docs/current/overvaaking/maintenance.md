---
sidebar_position: 4
title: Maintenance
description: Suivez les changements de buse, la lubrification et autres tâches de maintenance avec rappels, intervalles et journal des coûts
---

# Maintenance

Le module de maintenance vous aide à planifier et à suivre toute la maintenance de vos imprimantes Bambu Lab — du remplacement de buse à la lubrification des rails.

Accédez à : **https://localhost:3443/#maintenance**

## Plan de maintenance

Bambu Dashboard est livré avec des intervalles de maintenance préconfigurés pour tous les modèles d'imprimantes Bambu Lab :

| Tâche | Intervalle (standard) | Modèle |
|-------|----------------------|--------|
| Nettoyer la buse | Toutes les 200 heures | Tous |
| Remplacer la buse (laiton) | Toutes les 500 heures | Tous |
| Remplacer la buse (acier trempé) | Toutes les 2000 heures | Tous |
| Lubrifier l'axe X | Toutes les 300 heures | X1C, P1S |
| Lubrifier l'axe Z | Toutes les 300 heures | Tous |
| Nettoyer les roues dentées AMS | Toutes les 200 heures | AMS |
| Nettoyer la chambre | Toutes les 500 heures | X1C |
| Remplacer le tube PTFE | Selon besoin / 1000 heures | Tous |
| Calibration (complète) | Mensuelle | Tous |

Tous les intervalles peuvent être personnalisés par imprimante.

## Journal de remplacement de buse

1. Accédez à **Maintenance → Buses**
2. Cliquez sur **Enregistrer un remplacement de buse**
3. Renseignez :
   - **Date** — automatiquement définie à aujourd'hui
   - **Matériau de la buse** — Laiton / Acier trempé / Cuivre / Pointe rubis
   - **Diamètre de la buse** — 0,2 / 0,4 / 0,6 / 0,8 mm
   - **Marque/modèle** — facultatif
   - **Prix** — pour le journal des coûts
   - **Heures lors du remplacement** — automatiquement récupéré depuis le compteur de temps d'impression
4. Cliquez sur **Enregistrer**

Le journal affiche tout l'historique des buses trié par date.

:::tip Rappel anticipé
Définissez **Alerter X heures à l'avance** (ex. 50 heures) pour recevoir une alerte bien avant le prochain remplacement recommandé.
:::

## Créer des tâches de maintenance

1. Cliquez sur **Nouvelle tâche** (icône +)
2. Renseignez :
   - **Nom de la tâche** — ex. « Lubrifier l'axe Y »
   - **Imprimante** — sélectionnez la ou les imprimantes concernées
   - **Type d'intervalle** — Heures / Jours / Nombre d'impressions
   - **Intervalle** — ex. 300 heures
   - **Dernière exécution** — indiquez quand cela a été fait pour la dernière fois (date passée)
3. Cliquez sur **Créer**

## Intervalles et rappels

Pour les tâches actives, l'affichage est :
- **Vert** — temps avant la prochaine maintenance > 50 % de l'intervalle restant
- **Jaune** — temps avant la prochaine maintenance < 50 % restant
- **Orange** — temps avant la prochaine maintenance < 20 % restant
- **Rouge** — maintenance échue

### Configurer les rappels

1. Cliquez sur une tâche → **Modifier**
2. Activez **Rappels**
3. Définissez **Alerter à** ex. 10 % restant avant l'échéance
4. Choisissez le canal de notification (voir [Notifications](../funksjoner/notifications))

## Marquer comme effectuée

1. Trouvez la tâche dans la liste
2. Cliquez sur **Effectuée** (icône coche)
3. L'intervalle est réinitialisé à partir de la date/heure actuelle
4. Une entrée de journal est créée automatiquement

## Journal des coûts

Toutes les tâches de maintenance peuvent avoir un coût associé :

- **Pièces** — buses, tubes PTFE, lubrifiants
- **Temps** — heures passées × taux horaire
- **Service externe** — réparation payante

Les coûts sont totalisés par imprimante et affichés dans la vue des statistiques.

## Historique de maintenance

Accédez à **Maintenance → Historique** pour voir :
- Toutes les tâches de maintenance effectuées
- Date, heures et coût
- Qui a effectué la tâche (en système multi-utilisateurs)
- Commentaires et notes

Exportez l'historique en CSV à des fins comptables.
