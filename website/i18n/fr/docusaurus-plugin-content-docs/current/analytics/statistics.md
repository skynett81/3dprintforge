---
sidebar_position: 1
title: Statistiques
description: Taux de succès, consommation de filament, tendances et indicateurs clés pour toutes les imprimantes Bambu Lab dans le temps
---

# Statistiques

La page de statistiques vous offre un aperçu complet de votre activité d'impression avec des indicateurs clés, des tendances et la consommation de filament sur une période au choix.

Accédez à : **https://localhost:3443/#statistics**

## Indicateurs clés

En haut de la page s'affichent quatre cartes KPI :

| Indicateur | Description |
|------------|-------------|
| **Taux de succès** | Part des impressions réussies sur le total |
| **Filament total** | Grammes utilisés dans la période sélectionnée |
| **Heures d'impression totales** | Temps d'impression cumulé |
| **Durée moyenne d'impression** | Durée médiane par impression |

Chaque indicateur affiche la variation par rapport à la période précédente (↑ hausse / ↓ baisse) en pourcentage d'écart.

## Taux de succès

Le taux de succès est calculé par imprimante et au total :

- **Réussie** — impression terminée sans interruption
- **Annulée** — arrêtée manuellement par l'utilisateur
- **Échouée** — arrêtée par Print Guard, erreur HMS ou défaillance matérielle

Cliquez sur le graphique du taux de succès pour voir quelles impressions ont échoué et la raison.

:::tip Améliorer le taux de succès
Utilisez l'[Analyse des patterns d'erreurs](../monitoring/erroranalysis) pour identifier et corriger les causes des impressions échouées.
:::

## Tendances

La vue des tendances montre l'évolution dans le temps sous forme de graphique linéaire :

1. Sélectionnez la **Période** : 7 / 30 / 90 / 365 derniers jours
2. Sélectionnez le **Regroupement** : Jour / Semaine / Mois
3. Sélectionnez la **Métrique** : Nombre d'impressions / Heures / Grammes / Taux de succès
4. Cliquez sur **Comparer** pour superposer deux métriques

Le graphique supporte le zoom (défilement) et le déplacement (cliquer et faire glisser).

## Consommation de filament

La consommation de filament s'affiche sous forme de :

- **Diagramme en barres** — consommation par jour/semaine/mois
- **Diagramme circulaire** — répartition entre les matériaux (PLA, PETG, ABS, etc.)
- **Tableau** — liste détaillée avec grammes, mètres et coût total par matériau

### Consommation par imprimante

Utilisez le filtre de sélection multiple en haut pour :
- Afficher une seule imprimante
- Comparer deux imprimantes côte à côte
- Voir le total agrégé pour toutes les imprimantes

## Calendrier d'activité

Consultez une heatmap compacte style GitHub directement sur la page de statistiques (vue simplifiée), ou accédez au [Calendrier d'activité](./calendar) complet pour une vue plus détaillée.

## Export

1. Cliquez sur **Exporter les statistiques**
2. Sélectionnez la plage de dates et les métriques à inclure
3. Sélectionnez le format : **CSV** (données brutes), **PDF** (rapport) ou **JSON**
4. Le fichier est téléchargé

L'export CSV est compatible avec Excel et Google Sheets pour une analyse approfondie.

## Comparaison avec la période précédente

Activez **Afficher la période précédente** pour superposer les graphiques avec la période précédente correspondante :

- 30 derniers jours vs. les 30 jours d'avant
- Mois en cours vs. mois précédent
- Année en cours vs. année précédente

Cela permet de voir facilement si vous imprimez plus ou moins qu'avant, et si le taux de succès s'améliore.
