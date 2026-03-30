---
sidebar_position: 3
title: ABS
description: Guide pour l'impression ABS — température, enceinte fermée, warping et colle en bâton
---

# ABS

L'ABS (Acrylonitrile Butadiène Styrène) est un thermoplastique avec une bonne stabilité thermique et une bonne résistance aux chocs. Il nécessite une enceinte fermée et est plus exigeant que le PLA/PETG, mais produit des pièces fonctionnelles durables.

## Paramètres

| Paramètre | Valeur |
|-----------|-------|
| Température buse | 240–260 °C |
| Température plateau | 90–110 °C |
| Température chambre | 45–55 °C (X1C/P1S) |
| Refroidissement pièce | 0–20% |
| Ventilateur auxiliaire | 0% |
| Vitesse | 80–100% |
| Séchage | Recommandé (4–6 h à 70 °C) |

## Plateaux recommandés

| Plateau | Compatibilité | Colle en bâton ? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excellent | Oui (recommandé) |
| High Temp Plate | Excellent | Oui |
| Cool Plate (Smooth PEI) | Éviter | — |
| Textured PEI | Bon | Oui |

:::tip Colle en bâton pour ABS
Utilisez toujours de la colle en bâton sur l'Engineering Plate avec l'ABS. Cela améliore l'adhérence et facilite le retrait de l'impression sans endommager le plateau.
:::

## Enceinte fermée (chambre)

L'ABS **nécessite** une chambre fermée pour éviter le warping :

- **X1C et P1S :** Chambre intégrée avec gestion active de la chaleur — idéal pour l'ABS
- **P1P :** Partiellement ouvert — ajoutez des capots supérieurs pour de meilleurs résultats
- **A1 / A1 Mini :** CoreXY ouvert — **non recommandé** pour l'ABS sans enceinte sur mesure

Gardez la chambre fermée pendant toute l'impression. Ne l'ouvrez pas pour vérifier l'impression — en attendant le refroidissement, vous éviterez aussi le warping lors du détachement.

## Warping

L'ABS est très sujet au warping (les coins se soulèvent) :

- **Augmentez la température du plateau** — essayez 105–110 °C
- **Utilisez un brim** — brim de 5–10 mm dans Bambu Studio
- **Évitez les courants d'air** — fermez tous les flux d'air autour de l'imprimante
- **Réduisez le refroidissement pièce à 0%** — le refroidissement provoque la déformation

:::warning Vapeurs
L'ABS dégage des vapeurs de styrène pendant l'impression. Assurez une bonne ventilation dans la pièce ou utilisez un filtre HEPA/charbon actif. Le Bambu P1S dispose d'un filtre intégré.
:::

## Post-traitement

L'ABS peut être poncé, peint et collé plus facilement que le PETG et le PLA. Il peut aussi être lissé à l'acétone pour une surface lisse — mais soyez extrêmement prudent avec l'exposition à l'acétone.

## Stockage

Séchez à **70 °C pendant 4–6 heures** avant l'impression. Conservez dans une boîte hermétique — l'ABS absorbe l'humidité, ce qui provoque des craquements et des couches faibles.
