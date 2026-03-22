---
sidebar_position: 6
title: Matériaux composites (CF/GF)
description: Filaments renforcés carbone et fibre de verre — buse en acier trempé, usure et paramètres
---

# Matériaux composites (CF/GF)

Les filaments composites contiennent de courtes fibres de carbone (CF) ou de fibre de verre (GF) mélangées dans une base plastique comme le PLA, le PETG, le PA ou l'ABS. Ils offrent une rigidité accrue, un poids réduit et une meilleure stabilité dimensionnelle.

## Types disponibles

| Filament | Base | Rigidité | Réduction de poids | Difficulté |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Élevée | Modérée | Facile |
| PETG-CF | PETG | Élevée | Modérée | Modérée |
| PA6-CF | Nylon 6 | Très élevée | Bonne | Exigeante |
| PA12-CF | Nylon 12 | Très élevée | Bonne | Modérée |
| ABS-CF | ABS | Élevée | Modérée | Modérée |
| PLA-GF | PLA | Élevée | Modérée | Facile |

## Buse en acier trempé obligatoire

:::danger N'utilisez jamais une buse en laiton avec CF/GF
Les fibres de carbone et de verre sont très abrasives. Elles useront une buse en laiton standard en quelques heures ou jours. Utilisez toujours une **buse en acier trempé** (Hardened Steel) ou la **buse HS01** avec tous les matériaux CF et GF.

- Bambu Lab Hardened Steel Nozzle (0,4 mm)
- Bambu Lab HS01 Nozzle (revêtement spécial, durée de vie plus longue)
:::

## Paramètres (exemple PA-CF)

| Paramètre | Valeur |
|-----------|-------|
| Température buse | 270–290 °C |
| Température plateau | 80–100 °C |
| Refroidissement pièce | 0–20% |
| Vitesse | 80% |
| Séchage | 80 °C / 12 heures |

Pour PLA-CF : buse 220–230 °C, plateau 35–50 °C — bien plus simple que PA-CF.

## Plateaux recommandés

| Plateau | Compatibilité | Colle en bâton ? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Excellent | Oui (pour base PA) |
| High Temp Plate | Bon | Oui |
| Cool Plate | Éviter (CF raye) | — |
| Textured PEI | Bon | Oui |

:::warning Le plateau peut être rayé
Les matériaux CF peuvent rayer les plateaux lisses lors du retrait. Utilisez toujours l'Engineering Plate ou le Textured PEI. Ne tirez pas sur l'impression — pliez doucement le plateau.
:::

## Traitement de surface

Les filaments CF donnent une surface mate, aspect carbone, qui ne nécessite pas de peinture. La surface est légèrement poreuse et peut être imprégnée d'époxy pour une finition plus lisse.

## Usure et durée de vie de la buse

| Type de buse | Durée de vie avec CF | Coût |
|----------|---------------|---------|
| Laiton (standard) | Heures–jours | Faible |
| Acier trempé | 200–500 heures | Modéré |
| HS01 (Bambu) | 500–1000 heures | Élevé |

Remplacez la buse en cas d'usure visible : orifice élargi, parois minces, mauvaise précision dimensionnelle.

## Séchage

Les variantes CF de PA et PETG nécessitent le même séchage que la base :
- **PLA-CF :** Séchage recommandé, mais pas critique
- **PETG-CF :** 65 °C / 6–8 heures
- **PA-CF :** 80 °C / 12 heures — critique
