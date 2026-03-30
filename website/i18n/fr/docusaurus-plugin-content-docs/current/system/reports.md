---
sidebar_position: 7
title: Rapports
description: Rapports e-mail automatiques hebdomadaires et mensuels avec statistiques, résumé d'activité et rappels de maintenance
---

# Rapports

Bambu Dashboard peut envoyer des rapports e-mail automatiques avec statistiques et résumé d'activité — hebdomadairement, mensuellement ou les deux.

Accédez à : **https://localhost:3443/#settings** → **Système → Rapports**

## Prérequis

Les rapports nécessitent que les notifications par e-mail soient configurées. Configurez SMTP sous **Paramètres → Notifications → E-mail** avant d'activer les rapports. Consultez [Notifications](../features/notifications).

## Activer les rapports automatiques

1. Accédez à **Paramètres → Rapports**
2. Activez **Rapport hebdomadaire** et/ou **Rapport mensuel**
3. Choisissez l'**Heure d'envoi** :
   - Hebdomadaire : jour de la semaine et heure
   - Mensuel : jour du mois (ex. 1er lundi / dernier vendredi)
4. Renseignez l'**E-mail destinataire** (séparés par des virgules pour plusieurs destinataires)
5. Cliquez sur **Enregistrer**

Envoyez un rapport de test pour voir la mise en forme : cliquez sur **Envoyer un rapport de test maintenant**.

## Contenu du rapport hebdomadaire

Le rapport hebdomadaire couvre les 7 derniers jours :

### Résumé
- Nombre total d'impressions
- Nombre de réussites / échecs / annulations
- Taux de réussite et variation par rapport à la semaine précédente
- Imprimante la plus active

### Activité
- Impressions par jour (mini-graphique)
- Total des heures d'impression
- Consommation totale de filament (grammes et coût)

### Filament
- Consommation par matériau et fournisseur
- Estimation du reste par bobine (bobines sous 20 % mises en évidence)

### Maintenance
- Tâches de maintenance effectuées cette semaine
- Tâches de maintenance en retard (avertissement rouge)
- Tâches dues la semaine prochaine

### Erreurs HMS
- Nombre d'erreurs HMS cette semaine par imprimante
- Erreurs non acquittées (nécessitent une attention)

## Contenu du rapport mensuel

Le rapport mensuel couvre les 30 derniers jours et contient tout ce du rapport hebdomadaire, plus :

### Tendance
- Comparaison avec le mois précédent (%)
- Calendrier d'activité (miniature de la heatmap du mois)
- Évolution du taux de réussite mensuel

### Coûts
- Coût total du filament
- Coût électrique total (si la mesure de consommation est configurée)
- Coût total d'usure
- Coût total de maintenance

### Usure et santé
- Score de santé par imprimante (avec variation par rapport au mois précédent)
- Composants approchant de leur date de remplacement

### Points forts des statistiques
- Impression réussie la plus longue
- Type de filament le plus utilisé
- Imprimante avec le plus d'activité

## Personnaliser le rapport

1. Accédez à **Paramètres → Rapports → Personnalisation**
2. Cochez/décochez les sections à inclure
3. Choisissez le **Filtre d'imprimante** : toutes les imprimantes ou une sélection
4. Choisissez l'**Affichage du logo** : afficher le logo Bambu Dashboard dans l'en-tête ou désactiver
5. Cliquez sur **Enregistrer**

## Archive des rapports

Tous les rapports envoyés sont conservés et peuvent être rouverts :

1. Accédez à **Paramètres → Rapports → Archive**
2. Sélectionnez un rapport dans la liste (trié par date)
3. Cliquez sur **Ouvrir** pour voir la version HTML
4. Cliquez sur **Télécharger en PDF** pour télécharger le rapport

Les rapports sont automatiquement supprimés après **90 jours** (configurable).
