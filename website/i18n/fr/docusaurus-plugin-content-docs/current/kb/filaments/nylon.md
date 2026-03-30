---
sidebar_position: 5
title: PA / Nylon
description: Guide pour l'impression nylon — séchage, colle en bâton, paramètres et variantes
---

# PA / Nylon

Le Nylon (Polyamide / PA) est l'un des matériaux d'impression 3D les plus solides et les plus résistants à l'usure. Il est idéal pour les pièces mécaniques, les engrenages, les paliers et autres pièces à forte sollicitation.

## Paramètres

| Paramètre | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Température buse | 260–280 °C | 250–270 °C | 270–290 °C |
| Température plateau | 70–90 °C | 60–80 °C | 80–100 °C |
| Refroidissement pièce | 0–30% | 0–30% | 0–20% |
| Séchage (requis) | 80 °C / 8–12 h | 80 °C / 8 h | 80 °C / 12 h |

## Séchage — critique pour le nylon

Le nylon est **extrêmement hygroscopique**. Il absorbe l'humidité de l'air en quelques heures.

:::danger Séchez toujours le nylon
Un nylon humide donne de mauvais résultats — impression faible, bulles, surface bullante et mauvaise fusion des couches. Séchez le nylon **immédiatement** avant l'impression et utilisez-le dans les quelques heures suivantes.

- **Température :** 75–85 °C
- **Durée :** 8–12 heures
- **Méthode :** Séchoir à filament ou four avec ventilateur
:::

Le Bambu AMS n'est pas recommandé pour le nylon sans configuration hermétique et sèche. Utilisez si possible un alimenteur de filament externe directement vers l'imprimante.

## Plateaux recommandés

| Plateau | Compatibilité | Colle en bâton ? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excellent | Oui (requis) |
| High Temp Plate | Bon | Oui (requis) |
| Cool Plate | Mauvais | — |

:::warning La colle en bâton est requise
Le nylon adhère mal sans colle en bâton. Utilisez une fine couche uniforme de colle en bâton (Bambu Lab ou Pritt stick). Sans colle, le nylon se décolle du plateau.
:::

## Warping

Le nylon se déforme considérablement :
- Utilisez un brim (8–15 mm)
- Fermez la chambre (X1C/P1S donnent les meilleurs résultats)
- Évitez les grandes pièces plates sans brim
- Minimisez la ventilation

## Variantes

### PA6 (Nylon 6)
Le plus courant, bonne résistance et flexibilité. Absorbe beaucoup d'humidité.

### PA12 (Nylon 12)
Plus stable dimensionnellement et absorbe un peu moins d'humidité que le PA6. Plus facile à imprimer.

### PA-CF (fibre de carbone)
Très rigide et léger. Nécessite une buse en acier trempé. S'imprime plus sec que le nylon standard.

### PA-GF (renforcé fibre de verre)
Bonne rigidité à un coût inférieur au CF. Nécessite une buse en acier trempé.

## Stockage

Conservez le nylon dans une boîte hermétique avec du gel de silice agressif. La boîte de séchage Bambu Lab est idéale. Ne laissez jamais le nylon exposé à l'air.
