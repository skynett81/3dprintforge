---
sidebar_position: 3
title: Diagnostics
description: Score de santé, graphiques de télémétrie, visualisation du bed mesh et surveillance des composants pour les imprimantes Bambu Lab
---

# Diagnostics

La page de diagnostics vous offre une vue approfondie de la santé, des performances et de l'état de l'imprimante dans le temps.

Accédez à : **https://localhost:3443/#diagnostics**

## Score de santé

Chaque imprimante calcule un **score de santé** de 0 à 100 basé sur :

| Facteur | Pondération | Description |
|---------|-------------|-------------|
| Taux de succès (30j) | 30 % | Part des impressions réussies sur les 30 derniers jours |
| Usure des composants | 25 % | Usure moyenne sur les pièces critiques |
| Erreurs HMS (30j) | 20 % | Nombre et gravité des erreurs |
| Statut de calibration | 15 % | Temps depuis la dernière calibration |
| Stabilité de la température | 10 % | Écart par rapport à la température cible pendant l'impression |

**Interprétation du score :**
- 🟢 80–100 — Excellent état
- 🟡 60–79 — Bon, mais quelque chose mérite investigation
- 🟠 40–59 — Performances réduites, maintenance recommandée
- 🔴 0–39 — Critique, maintenance requise

:::tip Historique
Cliquez sur le graphique de santé pour voir l'évolution du score dans le temps. Les chutes importantes peuvent indiquer un événement spécifique.
:::

## Graphiques de télémétrie

La page de télémétrie affiche des graphiques interactifs pour toutes les valeurs des capteurs :

### Jeux de données disponibles

- **Température de la buse** — réelle vs. cible
- **Température du plateau** — réelle vs. cible
- **Température de la chambre** — température ambiante à l'intérieur de la machine
- **Moteur extrudeur** — consommation de courant et température
- **Vitesses des ventilateurs** — tête d'impression, chambre, AMS
- **Pression** (X1C) — pression de chambre pour l'AMS
- **Accélération** — données de vibration (ADXL345)

### Navigation dans les graphiques

1. Sélectionnez la **Période** : Dernière heure / 24 heures / 7 jours / 30 jours / Personnalisée
2. Sélectionnez l'**Imprimante** dans la liste déroulante
3. Sélectionnez le(s) **Jeu(x) de données** à afficher (sélection multiple supportée)
4. Défilez pour zoomer sur la timeline
5. Cliquez et faites glisser pour vous déplacer
6. Double-cliquez pour réinitialiser le zoom

### Exporter les données de télémétrie

1. Cliquez sur **Exporter** sur le graphique
2. Sélectionnez le format : **CSV**, **JSON** ou **PNG** (image)
3. La période et le jeu de données sélectionnés sont exportés

## Bed Mesh

La visualisation du bed mesh montre la calibration de planéité du plateau de construction :

1. Accédez à **Diagnostics → Bed Mesh**
2. Sélectionnez l'imprimante
3. Le dernier mesh s'affiche en tant que surface 3D et carte thermique :
   - **Bleu** — plus bas que le centre (concave)
   - **Vert** — approximativement plat
   - **Rouge** — plus haut que le centre (convexe)
4. Survolez un point pour voir l'écart exact en mm

### Scanner le bed mesh depuis l'interface

1. Cliquez sur **Scanner maintenant** (nécessite que l'imprimante soit inactive)
2. Confirmez dans la boîte de dialogue — l'imprimante lance automatiquement la calibration
3. Attendez la fin du scan (environ 3 à 5 minutes)
4. Le nouveau mesh s'affiche automatiquement

:::warning Préchauffez d'abord
Le bed mesh doit être scanné avec le plateau chauffé (50–60 °C pour PLA) pour une calibration précise.
:::

## Usure des composants

Voir [Prédiction d'usure](./wearprediction) pour la documentation détaillée.

La page de diagnostics affiche un aperçu condensé :
- Score en pourcentage par composant
- Prochain entretien recommandé
- Cliquez sur **Détails** pour une analyse complète de l'usure
