---
sidebar_position: 2
title: Calendrier d'activité
description: Calendrier heatmap style GitHub montrant l'activité de l'imprimante par jour tout au long de l'année avec sélecteur d'année et vue détaillée
---

# Calendrier d'activité

Le calendrier d'activité affiche un aperçu visuel de votre activité d'impression tout au long de l'année — inspiré de la vue des contributions GitHub.

Accédez à : **https://localhost:3443/#calendar**

## Aperçu heatmap

Le calendrier affiche 365 jours (52 semaines) sous forme de grille de cases colorées :

- **Gris** — aucune impression ce jour
- **Vert clair** — 1–2 impressions
- **Vert** — 3–5 impressions
- **Vert foncé** — 6–10 impressions
- **Vert profond** — 11+ impressions

Les cases sont organisées avec les jours de la semaine à la verticale (Lun–Dim) et les semaines à l'horizontale de gauche (janvier) à droite (décembre).

:::tip Code couleur
Vous pouvez changer la métrique de la heatmap de **Nombre d'impressions** à **Heures** ou **Grammes de filament** via le sélecteur au-dessus du calendrier.
:::

## Sélecteur d'année

Cliquez sur **< Année >** pour naviguer entre les années :

- Toutes les années avec une activité d'impression enregistrée sont disponibles
- L'année en cours s'affiche par défaut
- L'avenir est en gris (pas de données)

## Vue détaillée par jour

Cliquez sur une case pour voir les détails de ce jour :

- **Date** et jour de la semaine
- **Nombre d'impressions** — réussies et échouées
- **Total de filament utilisé** (grammes)
- **Total des heures d'impression**
- **Liste des impressions** — cliquez pour ouvrir dans l'historique

## Aperçu mensuel

Sous la heatmap s'affiche un aperçu mensuel avec :
- Total des impressions par mois en diagramme en barres
- Meilleur jour du mois mis en évidence
- Comparaison avec le même mois de l'année précédente (%)

## Filtre par imprimante

Sélectionnez une imprimante dans la liste déroulante en haut pour afficher l'activité d'une seule imprimante, ou choisissez **Toutes** pour la vue agrégée.

La vue multi-imprimantes affiche les couleurs empilées en cliquant sur **Empilé** dans le sélecteur de vue.

## Séries et records

Sous le calendrier s'affichent :

| Statistique | Description |
|-------------|-------------|
| **Plus longue série** | Plus grand nombre de jours consécutifs avec au moins une impression |
| **Série en cours** | Suite de jours actifs en cours |
| **Jour le plus actif** | Le jour avec le plus d'impressions au total |
| **Semaine la plus active** | La semaine avec le plus d'impressions |
| **Mois le plus actif** | Le mois avec le plus d'impressions |

## Export

Cliquez sur **Exporter** pour télécharger les données du calendrier :

- **PNG** — image de la heatmap (pour le partage)
- **CSV** — données brutes avec une ligne par jour (date, nombre, grammes, heures)

L'export PNG est optimisé pour le partage sur les réseaux sociaux avec le nom de l'imprimante et l'année comme sous-titre.
