---
sidebar_position: 1
title: Maintenance des buses
description: Nettoyage, cold pull, remplacement de buse et types de buses pour les imprimantes Bambu Lab
---

# Maintenance des buses

La buse est l'un des composants les plus critiques de l'imprimante. Un entretien approprié prolonge sa durée de vie et garantit de bons résultats d'impression.

## Types de buses

| Type de buse | Matériaux | Durée de vie (estimée) | Temp. max |
|----------|-----------|-------------------|----------|
| Laiton (standard) | PLA, PETG, ABS, TPU | 200–500 heures | 300 °C |
| Acier trempé | Tous incl. CF/GF | 300–600 heures | 300 °C |
| HS01 (Bambu) | Tous incl. CF/GF | 500–1000 heures | 300 °C |

:::danger N'utilisez jamais une buse en laiton avec CF/GF
Les filaments renforcés carbone et fibre de verre usent les buses en laiton en quelques heures. Remplacez par de l'acier trempé avant d'imprimer des matériaux CF/GF.
:::

## Nettoyage

### Nettoyage simple (entre les bobines)
1. Chauffez la buse à 200–220 °C
2. Poussez manuellement du filament jusqu'à ce qu'il ressort propre
3. Retirez rapidement le filament (« cold pull » — voir ci-dessous)

### Nettoyage à l'IPA
Pour les résidus tenaces :
1. Chauffez la buse à 200 °C
2. Déposez 1–2 gouttes d'IPA sur l'extrémité de la buse (avec précaution !)
3. Laissez la vapeur dissoudre les résidus
4. Faites passer du filament frais

:::warning Soyez prudent avec l'IPA sur une buse chaude
L'IPA bout à 83 °C et s'évapore fortement sur une buse chaude. Utilisez de petites quantités et évitez d'inhaler les vapeurs.
:::

## Cold Pull (Traction à froid)

Le cold pull est la méthode la plus efficace pour éliminer les contaminations et les résidus de carbone de la buse.

**Étape par étape :**
1. Chauffez la buse à 200–220 °C
2. Poussez du filament nylon (ou ce qui est dans la buse) manuellement
3. Laissez le nylon s'imprégner dans la buse pendant 1–2 minutes
4. Abaissez la température à 80–90 °C (pour le nylon)
5. Attendez que la buse refroidisse à la cible
6. Retirez le filament rapidement et fermement en un seul mouvement
7. Regardez l'extrémité : elle doit avoir la forme de l'intérieur de la buse — propre et sans résidus
8. Répétez 3–5 fois jusqu'à ce que le filament ressorte propre et blanc

:::tip Nylon pour le cold pull
Le nylon donne le meilleur résultat pour le cold pull car il accroche bien aux contaminations. Du nylon blanc permet de voir facilement si la traction est propre.
:::

## Remplacement de buse

### Signes indiquant que la buse doit être remplacée
- Surfaces grumelées et mauvaise précision dimensionnelle
- Problèmes d'extrusion persistants après nettoyage
- Usure ou déformation visible de l'orifice de la buse
- La buse a dépassé sa durée de vie estimée

### Procédure (P1S/X1C)
1. Chauffez la buse à 200 °C
2. Freinez le moteur d'extrudeur (libérez le filament)
3. Utilisez une clé pour dévisser la buse (sens antihoraire)
4. Remplacez la buse à chaud — **ne laissez pas la buse refroidir avec des outils dessus**
5. Serrez à la valeur souhaitée (ne pas trop serrer)
6. Effectuez une calibration après le remplacement

:::warning Remplacez toujours à chaud
Le couple de serrage d'une buse froide peut faire éclater la pièce lors du chauffage. Remplacez et serrez toujours quand la buse est chaude (200 °C).
:::

## Intervalles de maintenance

| Activité | Intervalle |
|-----------|---------|
| Nettoyage (cold pull) | Après 50 heures, ou lors d'un changement de matériau |
| Contrôle visuel | Hebdomadaire |
| Remplacement (laiton) | 200–500 heures |
| Remplacement (acier trempé) | 300–600 heures |
