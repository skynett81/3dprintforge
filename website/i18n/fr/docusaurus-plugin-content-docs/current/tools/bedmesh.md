---
sidebar_position: 6
title: Bed Mesh
description: Visualisation 3D de la calibration de planéité du plateau avec heatmap, scan depuis l'interface et guide de calibration
---

# Bed Mesh

L'outil Bed Mesh vous offre une représentation visuelle de la planéité du plateau de construction — essentielle pour une bonne adhérence et une première couche uniforme.

Accédez à : **https://localhost:3443/#bedmesh**

## Qu'est-ce que le bed mesh ?

Les imprimantes Bambu Lab scannent la surface du plateau avec une sonde et créent une carte (mesh) des écarts de hauteur. Le firmware de l'imprimante compense automatiquement ces écarts pendant l'impression. Bambu Dashboard visualise cette carte pour vous.

## Visualisation

### Surface 3D

La carte du bed mesh s'affiche sous forme de surface 3D interactive :

- Utilisez la souris pour faire pivoter la vue
- Faites défiler pour zoomer/dézoomer
- Cliquez sur **Vue du dessus** pour une vue en plongée
- Cliquez sur **Vue de côté** pour voir le profil

L'échelle de couleurs montre les écarts par rapport à la hauteur moyenne :
- **Bleu** — plus bas que le centre (concave)
- **Vert** — approximativement plat (< 0,1 mm d'écart)
- **Jaune** — écart modéré (0,1–0,2 mm)
- **Rouge** — écart important (> 0,2 mm)

### Carte thermique

Cliquez sur **Heatmap** pour une vue 2D plate de la carte mesh — plus facile à lire pour la plupart des utilisateurs.

La heatmap affiche :
- Valeurs d'écart précises (mm) pour chaque point de mesure
- Points problématiques marqués (écart > 0,3 mm)
- Dimensions des mesures (nombre de lignes × colonnes)

## Scanner le bed mesh depuis l'interface

:::warning Prérequis
Le scan nécessite que l'imprimante soit inactive et que la température du plateau soit stabilisée. Préchauffez le plateau à la température souhaitée AVANT le scan.
:::

1. Accédez à **Bed Mesh**
2. Sélectionnez l'imprimante dans la liste déroulante
3. Cliquez sur **Scanner maintenant**
4. Choisissez la température du plateau pour le scan :
   - **Froide** (température ambiante) — rapide, mais moins précise
   - **Chaude** (50–60 °C PLA, 70–90 °C PETG) — recommandé
5. Confirmez dans la boîte de dialogue — l'imprimante lance automatiquement la séquence de sonde
6. Attendez la fin du scan (3 à 8 minutes selon la taille du mesh)
7. La nouvelle carte mesh s'affiche automatiquement

## Guide de calibration

Après le scan, le système fournit des recommandations concrètes :

| Constat | Recommandation |
|---------|----------------|
| Écart < 0,1 mm partout | Excellent — aucune action requise |
| Écart 0,1–0,2 mm | Bon — la compensation est gérée par le firmware |
| Écart > 0,2 mm dans les coins | Ajustez manuellement les ressorts du plateau (si possible) |
| Écart > 0,3 mm | Le plateau peut être endommagé ou mal monté |
| Centre plus haut que les coins | Dilatation thermique — normal pour les plateaux chauds |

:::tip Comparaison historique
Cliquez sur **Comparer avec le précédent** pour voir si la carte mesh a changé dans le temps — utile pour détecter une déformation progressive du plateau.
:::

## Historique des mesh

Tous les scans de mesh sont enregistrés avec un horodatage :

1. Cliquez sur **Historique** dans le panneau latéral du bed mesh
2. Sélectionnez deux scans pour les comparer (une carte de différence s'affiche)
3. Supprimez les anciens scans dont vous n'avez plus besoin

## Export

Exportez les données du mesh sous forme de :
- **PNG** — image de la heatmap (pour documentation)
- **CSV** — données brutes avec X, Y et écart de hauteur par point
