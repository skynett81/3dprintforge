---
sidebar_position: 4
title: TPU
description: Guide pour l'impression TPU — température, vitesse et paramètres de rétraction
---

# TPU

Le TPU (Polyuréthane Thermoplastique) est un matériau flexible utilisé pour les coques, les joints, les roues et autres pièces nécessitant de l'élasticité.

## Paramètres

| Paramètre | Valeur |
|-----------|-------|
| Température buse | 220–240 °C |
| Température plateau | 30–45 °C |
| Refroidissement pièce | 50–80% |
| Vitesse | 30–50% (IMPORTANT) |
| Rétraction | Minimale ou désactivée |
| Séchage | Recommandé (6–8 h à 60 °C) |

:::danger La faible vitesse est critique
Le TPU doit être imprimé lentement. Une vitesse trop élevée provoque la compression du matériau dans l'extrudeur et crée des bourrages. Commencez à 30% de vitesse et augmentez prudemment.
:::

## Plateaux recommandés

| Plateau | Compatibilité | Colle en bâton ? |
|-------|---------|----------|
| Textured PEI | Excellent | Non |
| Cool Plate (Smooth PEI) | Bon | Non |
| Engineering Plate | Bon | Non |

## Paramètres de rétraction

Le TPU est élastique et réagit mal à une rétraction agressive :

- **Direct drive (X1C/P1S/A1) :** Rétraction 0,5–1,0 mm, 25 mm/s
- **Bowden (éviter avec TPU) :** Très difficile, non recommandé

Pour les TPU très mous (Shore A 85 ou moins) : désactivez complètement la rétraction et reposez-vous sur le contrôle de température et de vitesse.

## Conseils

- **Séchez le filament** — un TPU humide est extrêmement difficile à imprimer
- **Utilisez un extrudeur direct** — le Bambu Lab P1S/X1C/A1 disposent tous du direct drive
- **Évitez les températures élevées** — au-dessus de 250 °C, le TPU se dégrade et donne une impression décolorée
- **Stringing** — le TPU tend à former des fils ; baissez la température de 5 °C ou augmentez le refroidissement

:::tip Dureté Shore
Le TPU est disponible en différentes duretés Shore (A85, A95, A98). Plus le Shore A est bas, plus le matériau est mou et difficile à imprimer. Le TPU de Bambu Lab est Shore A 95 — un bon point de départ.
:::

## Stockage

Le TPU est très hygroscopique (absorbe l'humidité). Un TPU humide provoque :
- Des bulles et des sifflements
- Une impression faible et fragile (paradoxalement pour un matériau flexible)
- Du stringing

**Séchez toujours le TPU** à 60 °C pendant 6–8 heures avant l'impression. Conservez dans une boîte hermétique avec du gel de silice.
