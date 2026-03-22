---
sidebar_position: 2
title: Warping
description: Causes du warping et solutions — enceinte fermée, brim, température et draft shield
---

# Warping

Le warping survient lorsque les coins ou les bords de l'impression se soulèvent du plateau pendant ou après l'impression. Il est causé par le retrait thermique du matériau.

## Qu'est-ce que le warping ?

Lorsque le plastique refroidit, il se rétracte. Les couches supérieures sont plus chaudes que les couches inférieures — cela crée une tension qui tire les bords vers le haut et déforme l'impression. Plus la différence de température est grande, plus le warping est important.

## Matériaux les plus sujets au warping

| Matériau | Risque de warping | Enceinte requise |
|-----------|-------------|-----------------|
| PLA | Faible | Non |
| PETG | Faible–Modéré | Non |
| ABS | Élevé | Oui |
| ASA | Élevé | Oui |
| PA/Nylon | Très élevé | Oui |
| PC | Très élevé | Oui |
| TPU | Faible | Non |

## Solutions

### 1. Utilisez une enceinte fermée (chambre)

La mesure la plus importante pour l'ABS, l'ASA, le PA et le PC :
- Maintenez la température de chambre à 40–55 °C pour le meilleur résultat
- X1C et P1S : activez les ventilateurs de chambre en mode « fermé »
- A1/P1P : utilisez un couvercle pour retenir la chaleur

### 2. Utilisez un brim

Le brim est une seule couche de bords larges supplémentaires qui maintient l'impression sur le plateau :

```
Bambu Studio :
1. Sélectionnez l'impression dans le slicer
2. Allez dans Support → Brim
3. Réglez la largeur à 5–10 mm (plus de warping = plus large)
4. Type : Outer Brim Only (recommandé)
```

:::tip Guide de largeur de brim
- PLA (rarement nécessaire) : 3–5 mm
- PETG : 4–6 mm
- ABS/ASA : 6–10 mm
- PA/Nylon : 8–15 mm
:::

### 3. Augmentez la température du plateau

Une température de plateau plus élevée réduit la différence de température entre les couches :
- ABS : essayez 105–110 °C
- PA : 85–95 °C
- PETG : 80–85 °C

### 4. Réduisez le refroidissement pièce

Pour les matériaux sujets au warping — réduisez ou désactivez le refroidissement pièce :
- ABS/ASA : 0–20% de refroidissement pièce
- PA : 0–30% de refroidissement pièce

### 5. Évitez les courants d'air et l'air froid

Éloignez l'imprimante de :
- Fenêtres et portes extérieures
- Climatiseurs et ventilateurs
- Courants d'air dans la pièce

Pour P1P et A1 : couvrez les ouvertures avec du carton lors des impressions critiques.

### 6. Draft Shield

Un draft shield est une fine paroi autour de l'objet qui retient la chaleur :

```
Bambu Studio :
1. Allez dans Support → Draft Shield
2. Activez et définissez la distance (3–5 mm)
```

Particulièrement utile pour les objets hauts et élancés.

### 7. Mesures de conception de modèle

Lors de la conception de vos propres modèles :
- Évitez les grands fonds plats (ajoutez un chanfrein/arrondi dans les coins)
- Divisez les grandes pièces plates en sections plus petites
- Utilisez des « mouse ears » — petits cercles dans les coins — dans le slicer ou en CAO

## Warping après refroidissement

Parfois l'impression semble correcte, mais le warping survient après son retrait du plateau :
- Attendez toujours que le plateau et l'impression soient **complètement refroidis** (en dessous de 40 °C) avant de retirer
- Pour l'ABS : laissez refroidir dans la chambre fermée pour un refroidissement plus lent
- Évitez de poser une impression chaude sur une surface froide
