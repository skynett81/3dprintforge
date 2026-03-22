---
sidebar_position: 4
title: Choisir le bon plateau
description: Aperçu des plateaux de construction Bambu Labs et lequel convient le mieux à votre filament
---

# Choisir le bon plateau

Le bon plateau est essentiel pour une bonne adhérence et un retrait facile de l'impression. Une mauvaise combinaison donne soit une mauvaise adhérence, soit une impression qui colle et endommage le plateau.

## Tableau récapitulatif

| Filament | Plateau recommandé | Bâton de colle | Température du plateau |
|----------|-------------------|----------------|------------------------|
| PLA | Cool Plate / Textured PEI | Non / Oui | 35–45°C |
| PETG | Textured PEI | **Oui (obligatoire)** | 70°C |
| ABS | Engineering Plate / High Temp | Oui | 90–110°C |
| ASA | Engineering Plate / High Temp | Oui | 90–110°C |
| TPU | Textured PEI | Non | 35–45°C |
| PA (Nylon) | Engineering Plate | Oui | 90°C |
| PC | High Temp Plate | Oui | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Oui | 45–90°C |
| PVA | Cool Plate | Non | 35°C |

## Description des plateaux

### Cool Plate (PEI lisse)
**Idéal pour :** PLA, PVA
**Surface :** Lisse, donne une face inférieure lisse à l'impression
**Retrait :** Plier légèrement le plateau ou attendre qu'il refroidisse — l'impression se détache d'elle-même

N'utilisez pas le Cool Plate avec du PETG — il adhère **trop bien** et peut arracher le revêtement du plateau.

### Textured PEI (Texturé)
**Idéal pour :** PETG, TPU, PLA (donne une surface rugueuse)
**Surface :** Texturé, donne une face inférieure rugueuse et esthétique
**Retrait :** Attendre la température ambiante — se détache tout seul

:::warning Le PETG nécessite un bâton de colle sur le Textured PEI
Sans bâton de colle, le PETG adhère extrêmement bien au Textured PEI et peut arracher le revêtement lors du retrait. Appliquez toujours une fine couche de bâton de colle (bâton de colle Bambu ou Elmer's Disappearing Purple Glue) sur toute la surface.
:::

### Engineering Plate
**Idéal pour :** ABS, ASA, PA, PLA-CF, PETG-CF
**Surface :** A une surface PEI mate avec une adhérence plus faible que le Textured PEI
**Retrait :** Facile à retirer après refroidissement. Utilisez un bâton de colle pour ABS/ASA

### High Temp Plate
**Idéal pour :** PC, PA-CF, ABS à températures élevées
**Surface :** Supporte des températures de plateau jusqu'à 120°C sans déformation
**Retrait :** Refroidir à température ambiante

## Erreurs courantes

### PETG sur Cool Plate lisse (sans bâton de colle)
**Problème :** Le PETG adhère si fortement que l'impression ne peut pas être retirée sans dommage
**Solution :** Toujours utiliser Textured PEI avec bâton de colle, ou Engineering Plate

### ABS sur Cool Plate
**Problème :** Gauchissement — les coins se soulèvent pendant l'impression
**Solution :** Engineering Plate + bâton de colle + augmenter la température de chambre (fermer la porte frontale)

### PLA sur High Temp Plate
**Problème :** Température de plateau trop élevée donne une adhérence excessive, retrait difficile
**Solution :** Cool Plate ou Textured PEI pour PLA

### Trop de bâton de colle
**Problème :** Un bâton de colle épais donne un Elephant Foot (première couche qui s'étale)
**Solution :** Une fine couche — le bâton de colle doit être à peine visible

## Changer de plateau

1. **Laisser le plateau refroidir** à température ambiante (ou utiliser des gants — le plateau peut être chaud)
2. Soulever le plateau par le devant et le retirer
3. Insérer le nouveau plateau — l'aimant le maintient en place
4. **Effectuer une calibration automatique** (Flow Rate et Bed Leveling) après le changement de plateau dans Bambu Studio ou via le tableau de bord sous **Contrôle → Calibration**

:::info N'oubliez pas de calibrer après le changement
Les plateaux ont des épaisseurs légèrement différentes. Sans calibration, la première couche peut être trop éloignée ou s'écraser dans le plateau.
:::

## Entretien des plateaux

### Nettoyage (après 2 à 5 impressions)
- Essuyez avec de l'IPA (isopropanol 70–99%) et un chiffon non pelucheux
- Évitez de toucher la surface à mains nues — la graisse de la peau réduit l'adhérence
- Pour le Textured PEI : lavez avec de l'eau tiède et un peu de liquide vaisselle doux après de nombreuses impressions

### Enlever les résidus de bâton de colle
- Chauffez le plateau à 60°C
- Essuyez avec un chiffon humide
- Terminez avec un essuyage à l'IPA

### Remplacement
Remplacez le plateau lorsque vous voyez :
- Des cratères ou marques visibles après le retrait des impressions
- Une mauvaise adhérence constante même après nettoyage
- Des bulles ou taches dans le revêtement

Les plateaux Bambu durent généralement 200 à 500 impressions selon le type de filament et le traitement.

:::tip Ranger les plateaux correctement
Conservez les plateaux inutilisés dans leur emballage d'origine ou debout dans un support — pas empilés avec des objets lourds dessus. Les plateaux déformés donnent une première couche inégale.
:::
