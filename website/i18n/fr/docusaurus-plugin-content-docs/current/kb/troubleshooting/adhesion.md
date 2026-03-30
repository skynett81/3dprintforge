---
sidebar_position: 1
title: Mauvaise adhérence
description: Causes et solutions pour une mauvaise adhérence de la première couche — plateau, température, colle, vitesse, décalage Z
---

# Mauvaise adhérence

La mauvaise adhérence est l'un des problèmes les plus courants en impression 3D. La première couche ne colle pas, ou les impressions cessent d'adhérer à mi-chemin.

## Symptômes

- La première couche n'accroche pas — l'impression se déplace ou se soulève
- Les bords et les coins se soulèvent (warping)
- L'impression se détache en cours de travail
- Première couche inégale avec des trous ou des fils libres

## Liste de contrôle — essayez dans cet ordre

### 1. Nettoyez le plateau
La cause la plus fréquente de mauvaise adhérence est la graisse ou la saleté sur le plateau.

```
1. Essuyez le plateau avec de l'IPA (alcool isopropylique)
2. Évitez de toucher la surface d'impression avec les doigts nus
3. En cas de problèmes persistants : lavez avec de l'eau et du liquide vaisselle doux
```

### 2. Calibrez le décalage Z

Le décalage Z est la hauteur entre la buse et le plateau pour la première couche. Trop haut = le fil est lâche. Trop bas = la buse racle le plateau.

**Décalage Z correct :**
- La première couche doit paraître légèrement transparente
- Le fil doit être pressé vers le bas contre le plateau avec un léger « écrasement »
- Les fils doivent légèrement se fondre les uns dans les autres

Ajustez le décalage Z via **Contrôle → Ajuster Z en direct** pendant l'impression.

:::tip Ajustez en direct pendant l'impression
Bambu Dashboard affiche des boutons d'ajustement du décalage Z pendant une impression active. Ajustez par paliers de ±0,02 mm tout en observant la première couche.
:::

### 3. Vérifiez la température du plateau

| Matériau | Température trop basse | Recommandé |
|-----------|-------------|---------|
| PLA | En dessous de 30 °C | 35–45 °C |
| PETG | En dessous de 60 °C | 70–85 °C |
| ABS | En dessous de 80 °C | 90–110 °C |
| TPU | En dessous de 25 °C | 30–45 °C |

Essayez d'augmenter la température du plateau de 5 °C à la fois.

### 4. Utilisez de la colle en bâton

La colle en bâton améliore l'adhérence pour la plupart des matériaux sur la plupart des plateaux :
- Appliquez une couche fine et uniforme
- Laissez sécher 30 secondes avant le démarrage
- Particulièrement important pour : ABS, PA, PC, PETG (sur Smooth PEI)

### 5. Réduisez la vitesse de la première couche

Une vitesse plus lente pour la première couche offre un meilleur contact entre le filament et le plateau :
- Standard : 50 mm/s pour la première couche
- Essayez : 30–40 mm/s
- Bambu Studio : sous **Qualité → Vitesse première couche**

### 6. Vérifiez l'état du plateau

Un plateau usé donne une mauvaise adhérence même avec des paramètres parfaits. Remplacez le plateau si :
- Le revêtement PEI est visiblement endommagé
- Le nettoyage n'aide pas

### 7. Utilisez un brim

Pour les matériaux sujets au warping (ABS, PA, grands objets plats) :
- Ajoutez un brim dans le slicer : 5–10 mm de largeur
- Augmente la surface de contact et maintient les bords vers le bas

## Cas spéciaux

### Grands objets plats
Les grands objets plats sont les plus sujets au décollement. Mesures :
- Brim 8–10 mm
- Augmentez la température du plateau
- Fermez la chambre (ABS/PA)
- Réduisez le refroidissement pièce

### Surfaces vitrifiées
Les plateaux avec trop de colle en bâton accumulée peuvent devenir vitrifiés. Lavez soigneusement avec de l'eau et recommencez.

### Après changement de filament
Différents matériaux nécessitent des paramètres différents. Vérifiez que la température du plateau et le plateau sont configurés pour le nouveau matériau.
