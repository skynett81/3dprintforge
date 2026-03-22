---
sidebar_position: 6
title: Comparaison d'impressions
description: Comparez deux impressions côte à côte avec des métriques détaillées, des graphiques et des images de galerie pour une analyse A/B
---

# Comparaison d'impressions

La comparaison d'impressions vous permet d'analyser deux impressions côte à côte — utile pour comparer des paramètres, des matériaux, des imprimantes ou des versions du même modèle.

Accédez à : **https://localhost:3443/#comparison**

## Sélectionner les impressions à comparer

1. Accédez à **Comparaison d'impressions**
2. Cliquez sur **Sélectionner l'impression A** et recherchez dans l'historique
3. Cliquez sur **Sélectionner l'impression B** et recherchez dans l'historique
4. Cliquez sur **Comparer** pour charger la vue de comparaison

:::tip Accès rapide
Depuis **Historique**, vous pouvez cliquer avec le bouton droit sur une impression et sélectionner **Définir comme impression A** ou **Comparer avec...** pour accéder directement au mode de comparaison.
:::

## Comparaison de métriques

Les métriques s'affichent en deux colonnes (A et B) avec indication de la meilleure valeur :

| Métrique | Description |
|----------|-------------|
| Succès | Terminé / Annulé / Échoué |
| Durée | Temps d'impression total |
| Consommation de filament | Grammes total et par couleur |
| Efficacité du filament | % du modèle sur la consommation totale |
| Température de buse max | Température de buse la plus élevée enregistrée |
| Température de plateau max | Température de plateau la plus élevée enregistrée |
| Réglage de vitesse | Silencieux / Standard / Sport / Turbo |
| Changements AMS | Nombre de changements de couleur |
| Erreurs HMS | Erreurs éventuelles pendant l'impression |
| Imprimante | Quelle imprimante a été utilisée |

Les cellules avec la meilleure valeur s'affichent sur fond vert.

## Graphiques de température

Deux graphiques de température s'affichent côte à côte (ou superposés) :

- **Vue séparée** — graphique A à gauche, graphique B à droite
- **Vue superposée** — les deux dans le même graphique avec des couleurs différentes

Utilisez la vue superposée pour voir directement la stabilité de la température et la vitesse de chauffe.

## Images de galerie

Si les deux impressions ont des captures d'écran aux jalons, elles s'affichent dans une grille :

| Impression A | Impression B |
|-------------|-------------|
| Image à 25 % A | Image à 25 % B |
| Image à 50 % A | Image à 50 % B |
| Image à 75 % A | Image à 75 % B |
| Image à 100 % A | Image à 100 % B |

Cliquez sur une image pour ouvrir l'aperçu en plein écran avec animation de défilement.

## Comparaison de timelapse

Si les deux impressions ont un timelapse, les vidéos s'affichent côte à côte :

- Lecture synchronisée — les deux démarrent et se mettent en pause simultanément
- Lecture indépendante — contrôlez chaque vidéo séparément

## Différences de paramètres

Le système met automatiquement en évidence les différences dans les paramètres d'impression (extraits des métadonnées G-code) :

- Épaisseurs de couches différentes
- Motifs ou pourcentages de remplissage différents
- Paramètres de support différents
- Profils de vitesse différents

Les différences s'affichent avec un marquage orange dans le tableau des paramètres.

## Enregistrer la comparaison

1. Cliquez sur **Enregistrer la comparaison**
2. Donnez un nom à la comparaison (ex. « PLA vs PETG - Benchy »)
3. La comparaison est enregistrée et accessible via **Historique → Comparaisons**

## Export

1. Cliquez sur **Exporter**
2. Sélectionnez **PDF** pour un rapport avec toutes les métriques et images
3. Le rapport peut être lié à un projet pour documenter le choix des matériaux
