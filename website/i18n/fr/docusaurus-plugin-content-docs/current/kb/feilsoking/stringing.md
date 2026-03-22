---
sidebar_position: 3
title: Stringing
description: Causes du stringing et solutions — rétraction, température et séchage
---

# Stringing

Le stringing (ou « oozing ») désigne les fins fils de plastique qui se forment entre des parties séparées de l'objet lorsque la buse se déplace sans extruder. Cela donne un aspect de « toile d'araignée » à l'impression.

## Causes du stringing

1. **Température de buse trop élevée** — le plastique chaud est liquide et goutte
2. **Mauvais paramètres de rétraction** — le filament n'est pas retiré assez rapidement
3. **Filament humide** — l'humidité provoque de la vapeur et un flux supplémentaire
4. **Vitesse trop faible** — la buse reste longtemps en positions de transit

## Diagnostic

**Filament humide ?** Entendez-vous un bruit crépitant/éclatant pendant l'impression ? Alors le filament est humide — séchez-le d'abord avant d'ajuster d'autres paramètres.

**Température trop élevée ?** Voyez-vous des gouttes de la buse dans les moments de « pause » ? Baissez la température de 5–10 °C.

## Solutions

### 1. Séchez le filament

Un filament humide est la cause la plus fréquente de stringing qui ne peut pas être réglé autrement :

| Matériau | Température de séchage | Durée |
|-----------|----------------|-----|
| PLA | 45–55 °C | 4–6 heures |
| PETG | 60–65 °C | 6–8 heures |
| TPU | 55–60 °C | 6–8 heures |
| PA | 75–85 °C | 8–12 heures |

### 2. Abaissez la température de buse

Commencez par baisser de 5 °C à la fois :
- PLA : essayez 210–215 °C (depuis 220 °C)
- PETG : essayez 235–240 °C (depuis 245 °C)

:::warning Une température trop basse donne une mauvaise fusion des couches
Abaissez la température prudemment. Une température trop basse donne une mauvaise fusion des couches, une impression fragile et des problèmes d'extrusion.
:::

### 3. Ajustez les paramètres de rétraction

La rétraction retire le filament dans la buse pendant le mouvement de « déplacement » pour éviter les gouttes :

```
Bambu Studio → Filament → Rétraction :
- Distance de rétraction : 0,4–1,0 mm (direct drive)
- Vitesse de rétraction : 30–45 mm/s
```

:::tip Les imprimantes Bambu Lab ont le direct drive
Toutes les imprimantes Bambu Lab (X1C, P1S, A1) utilisent un extrudeur direct drive. Le direct drive nécessite une **distance de rétraction plus courte** que les systèmes Bowden (généralement 0,5–1,5 mm vs. 3–7 mm).
:::

### 4. Augmentez la vitesse de déplacement

Un déplacement rapide entre les points laisse moins de temps à la buse pour couler :
- Augmentez la « vitesse de déplacement » à 200–300 mm/s
- Les imprimantes Bambu Lab gèrent bien cela

### 5. Activez « Avoid Crossing Perimeters »

Paramètre de slicer qui fait éviter à la buse de traverser des zones ouvertes où le stringing serait visible :
```
Bambu Studio → Qualité → Avoid crossing perimeters
```

### 6. Réduisez la vitesse (pour TPU)

Pour le TPU, la solution est à l'opposé des autres matériaux :
- Réduisez la vitesse d'impression à 20–35 mm/s
- Le TPU est élastique et se comprime à vitesse élevée — cela provoque un « flux retardé »

## Après les ajustements

Testez avec un modèle de test stringing standard (ex. « torture tower » sur MakerWorld). Ajustez une variable à la fois et observez le changement.

:::note La perfection est rarement atteignable
Un peu de stringing est normal pour la plupart des matériaux. Concentrez-vous sur la réduction à un niveau acceptable, pas sur l'élimination complète. Le PETG aura toujours un peu plus de stringing que le PLA.
:::
