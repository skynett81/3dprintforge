---
sidebar_position: 4
title: Lubrification
description: Lubrification des tiges linéaires, des rails et intervalles pour les imprimantes Bambu Lab
---

# Lubrification

Une lubrification appropriée des pièces mobiles réduit l'usure, diminue le niveau sonore et assure un mouvement précis. Les imprimantes Bambu Lab utilisent des systèmes de mouvement linéaires qui nécessitent une lubrification périodique.

## Types de lubrification

| Composant | Type de lubrification | Produit |
|-----------|-------------|---------|
| Tiges linéaires (XY) | Huile légère ou spray PTFE | 3-en-1, Super Lube |
| Vis sans fin axe Z | Graisse épaisse | Graisse Super Lube |
| Rails linéaires | Graisse légère au lithium | Graisse Bambu Lab |
| Joints de chaîne de câbles | Aucun (à sec) | — |

## Tiges linéaires

### Axes X et Y
Les tiges sont des tiges en acier poli qui glissent dans des rails linéaires :

```
Intervalle : Toutes les 200–300 heures, ou en cas de bruits grinçants
Quantité : Très peu — une goutte par point de tige suffit
Méthode :
1. Éteignez l'imprimante
2. Déplacez le chariot manuellement jusqu'à l'extrémité
3. Appliquez 1 goutte d'huile légère au milieu de la tige
4. Déplacez lentement le chariot d'avant en arrière 10 fois
5. Essuyez l'excès d'huile avec du papier sans peluches
```

:::warning Ne sur-lubrifiez pas
Trop d'huile attire la poussière et crée une pâte abrasive. Utilisez des quantités minimales et essuyez toujours l'excédent.
:::

### Axe Z (vertical)
L'axe Z utilise une vis sans fin (leadscrew) qui nécessite de la graisse (pas de l'huile) :

```
Intervalle : Toutes les 200 heures
Méthode :
1. Éteignez l'imprimante
2. Appliquez une fine couche de graisse le long de la vis sans fin
3. Déplacez l'axe Z de haut en bas manuellement (ou via le menu de maintenance)
4. La graisse se répartit automatiquement
```

## Rails linéaires

Le Bambu Lab P1S et X1C utilisent des rails linéaires (MGN12) sur l'axe Y :

```
Intervalle : Toutes les 300–500 heures
Méthode :
1. Retirez un peu de graisse avec une aiguille ou un cure-dent de l'orifice d'injection
2. Injectez de la nouvelle graisse avec une seringue et une canule fine
3. Déplacez l'axe d'avant en arrière pour répartir la graisse
```

Bambu Lab vend de la graisse officielle (Bambu Lubricant) calibrée pour le système.

## Maintenance de la lubrification par modèle

### X1C / P1S
- Axe Y : Rails linéaires — graisse Bambu
- Axe X : Tiges carbone — huile légère
- Axe Z : Double vis sans fin — graisse Bambu

### A1 / A1 Mini
- Tous les axes : Tiges en acier — huile légère
- Axe Z : Vis sans fin simple — graisse Bambu

## Signes indiquant que la lubrification est nécessaire

- **Bruits grinçants ou raclants** lors du mouvement
- **Patterns de vibration** visibles sur les murs verticaux (VFA)
- **Dimensions imprécises** sans autre cause
- **Augmentation du bruit** du système de mouvement

## Intervalles de lubrification

| Activité | Intervalle |
|-----------|---------|
| Huile tiges XY | Toutes les 200–300 heures |
| Graisse vis Z | Toutes les 200 heures |
| Graisse rails linéaires (X1C/P1S) | Toutes les 300–500 heures |
| Cycle complet de maintenance | Semestriel (ou 500 heures) |

Utilisez le module de maintenance dans le tableau de bord pour suivre les intervalles automatiquement.
