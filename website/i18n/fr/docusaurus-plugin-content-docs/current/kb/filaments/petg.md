---
sidebar_position: 2
title: PETG
description: Guide pour l'impression PETG — température, IMPORTANT sur la colle en bâton, plateau et conseils
---

# PETG

Le PETG (Polyéthylène Téréphtalate Glycol) est un matériau populaire pour les pièces fonctionnelles. Il est plus résistant et plus stable à la chaleur que le PLA, et tolère une légère exposition chimique.

## Paramètres

| Paramètre | Valeur |
|-----------|-------|
| Température buse | 230–250 °C |
| Température plateau | 70–85 °C |
| Refroidissement pièce | 30–60% |
| Vitesse | Standard |
| Séchage | Recommandé (6–8 h à 65 °C) |

## Plateaux recommandés

| Plateau | Compatibilité | Colle en bâton ? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excellent | Non/Oui* |
| Textured PEI | Bon | Oui** |
| Cool Plate (Smooth PEI) | Voir avertissement | Voir avertissement |
| High Temp Plate | Bon | Oui |

:::danger IMPORTANT : Colle en bâton sur Smooth PEI avec PETG
Le PETG adhère **extrêmement bien** au Smooth PEI (Cool Plate). Sans colle en bâton, vous risquez d'**arracher le revêtement du plateau** lors du retrait de l'impression. Utilisez toujours une fine couche de colle en bâton sur le Smooth PEI lors de l'impression de PETG — cela sert de barrière.

**Alternative :** Utilisez l'Engineering Plate ou le Textured PEI — ceux-ci offrent une bonne adhérence sans endommager le plateau.
:::

## Conseils pour une impression réussie

- **Réduisez le refroidissement pièce** — trop de refroidissement provoque la délamination et une impression fragile
- **Augmentez la température de buse** — en cas de stringing, essayez de baisser de 5–10 °C ; en cas de mauvaise fusion des couches, montez
- **Température plateau première couche** — 80–85 °C pour une bonne adhérence, baissez à 70 °C après la première couche
- **Réduisez la vitesse** — le PETG est plus exigeant que le PLA, commencez à 80% de vitesse

:::warning Stringing
Le PETG est sujet au stringing. Augmentez la distance de rétraction (essayez 0,8–1,5 mm pour le direct drive), augmentez la vitesse de rétraction et baissez la température de buse de 5 °C à la fois.
:::

## Séchage

Le PETG absorbe l'humidité plus vite que le PLA. Un PETG humide provoque :
- Des bulles et des sifflements pendant l'impression
- Des couches faibles avec une surface poreuse
- Plus de stringing

**Séchez à 65 °C pendant 6–8 heures** avant l'impression, surtout si la bobine est restée ouverte longtemps.

## Stockage

Conservez toujours dans un sachet hermétique ou une boîte de séchage avec du gel de silice. Le PETG ne doit pas rester ouvert plus de quelques jours dans un environnement humide.
