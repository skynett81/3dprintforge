---
sidebar_position: 7
title: PC
description: Guide d'impression polycarbonate avec Bambu Lab — haute résistance, tenue thermique et exigences
---

# PC (Polycarbonate)

Le polycarbonate est l'un des matériaux thermoplastiques les plus résistants disponibles pour l'impression FDM. Il combine une résistance aux chocs extrêmement élevée, une tenue thermique jusqu'à 110–130 °C et une transparence naturelle. Le PC est un matériau exigeant à imprimer, mais il délivre des résultats proches de la qualité des pièces injectées.

## Paramètres

| Paramètre | PC pur | Blend PC-ABS | PC-CF |
|-----------|--------|-------------|-------|
| Température buse | 260–280 °C | 250–270 °C | 270–290 °C |
| Température plateau | 100–120 °C | 90–110 °C | 100–120 °C |
| Température chambre | 50–60 °C (requis) | 45–55 °C | 50–60 °C |
| Refroidissement pièce | 0–20% | 20–30% | 0–20% |
| Vitesse | 60–80% | 70–90% | 50–70% |
| Séchage nécessaire | Oui (critique) | Oui | Oui (critique) |

## Plateaux recommandés

| Plateau | Compatibilité | Bâton de colle ? |
|---------|--------------|-----------------|
| High Temp Plate | Excellent (requis) | Non |
| Engineering Plate | Acceptable | Oui |
| Textured PEI | Non recommandé | — |
| Cool Plate (Smooth PEI) | Ne pas utiliser | — |

:::danger Le High Temp Plate est requis
Le PC nécessite des températures de plateau de 100–120 °C. Le Cool Plate et le Textured PEI ne supportent pas ces températures et seront endommagés. Utilisez **toujours** le High Temp Plate pour le PC pur.
:::

## Exigences d'imprimante et d'équipement

### Enceinte (requise)

Le PC nécessite une **chambre entièrement fermée** avec une température stable de 50–60 °C. Sans cela, vous rencontrerez un warping sévère, une délamination et une séparation des couches.

### Buse durcie (fortement recommandée)

Le PC pur n'est pas abrasif, mais le PC-CF et le PC-GF **nécessitent une buse en acier trempé** (par ex., Bambu Lab HS01). Pour le PC pur, une buse durcie est tout de même recommandée en raison des températures élevées.

### Compatibilité des imprimantes

| Imprimante | Adaptée pour le PC ? | Remarque |
|------------|---------------------|----------|
| X1C | Excellent | Entièrement fermée, HS01 disponible |
| X1E | Excellent | Conçue pour les matériaux d'ingénierie |
| P1S | Limité | Fermée, mais sans chauffage actif de chambre |
| P1P | Non recommandé | Sans enceinte |
| A1 / A1 Mini | Ne pas utiliser | Cadre ouvert, températures trop basses |

:::warning Seules X1C et X1E sont recommandées
Le PC nécessite un chauffage actif de la chambre pour des résultats réguliers. La P1S peut donner des résultats acceptables avec de petites pièces, mais attendez-vous à du warping et de la délamination avec les pièces plus grandes.
:::

## Séchage

Le PC est **très hygroscopique** et absorbe rapidement l'humidité. Un PC humide donne des résultats d'impression catastrophiques.

| Paramètre | Valeur |
|-----------|--------|
| Température de séchage | 70–80 °C |
| Durée de séchage | 6–8 heures |
| Niveau hygroscopique | Élevé |
| Humidité max recommandée | < 0,02% |

- **Toujours** sécher le PC avant l'impression — même les bobines fraîchement ouvertes peuvent avoir absorbé de l'humidité
- Imprimer directement depuis une boîte de séchage si possible
- L'AMS n'est **pas suffisant** pour le stockage du PC — l'humidité est trop élevée
- Utiliser un sécheur de filament dédié avec chauffage actif

:::danger L'humidité détruit les impressions PC
Signes de PC humide : crépitements forts, bulles en surface, très mauvaise liaison entre couches, stringing. Un PC humide ne peut pas être compensé par les paramètres — il **doit** être séché d'abord.
:::

## Propriétés

| Propriété | Valeur |
|-----------|--------|
| Résistance à la traction | 55–75 MPa |
| Résistance aux chocs | Extrêmement élevée |
| Résistance thermique (HDT) | 110–130 °C |
| Transparence | Oui (variante naturelle/transparente) |
| Résistance chimique | Modérée |
| Résistance UV | Modérée (jaunit avec le temps) |
| Retrait | ~0,5–0,7% |

## Blends PC

### PC-ABS

Un mélange de polycarbonate et d'ABS qui combine les forces des deux matériaux :

- **Plus facile à imprimer** que le PC pur — températures plus basses et moins de warping
- **Résistance aux chocs** entre l'ABS et le PC
- **Populaire dans l'industrie** — utilisé dans les intérieurs automobiles et les boîtiers électroniques
- Imprime à 250–270 °C buse, 90–110 °C plateau

### PC-CF (fibre de carbone)

PC renforcé fibre de carbone pour une rigidité et une résistance maximales :

- **Extrêmement rigide** — idéal pour les pièces structurelles
- **Léger** — la fibre de carbone réduit le poids
- **Nécessite une buse durcie** — le laiton s'use en quelques heures
- Imprime à 270–290 °C buse, 100–120 °C plateau
- Plus cher que le PC pur, mais offre des propriétés mécaniques proches de l'aluminium

### PC-GF (fibre de verre)

PC renforcé fibre de verre :

- **Moins cher que le PC-CF** avec une bonne rigidité
- **Surface plus blanche** que le PC-CF
- **Nécessite une buse durcie** — les fibres de verre sont très abrasives
- Légèrement moins rigide que le PC-CF, mais meilleure résistance aux chocs

## Applications

Le PC est utilisé là où vous avez besoin d'une **résistance et/ou tenue thermique maximale** :

- **Pièces mécaniques** — engrenages, supports, couplages sous charge
- **Pièces optiques** — lentilles, guides de lumière, capots transparents (PC clair)
- **Pièces résistantes à la chaleur** — compartiment moteur, près d'éléments chauffants
- **Boîtiers électroniques** — enveloppes protectrices avec bonne résistance aux chocs
- **Outils et gabarits** — outils de montage de précision

## Conseils pour une impression PC réussie

### Première couche

- Réduire la vitesse à **30–40%** pour la première couche
- Augmenter la température du plateau de 5 °C au-dessus du standard pour les 3–5 premières couches
- **Le brim est obligatoire** pour la plupart des pièces PC — utilisez 8–10 mm

### Température de chambre

- La chambre doit atteindre **50 °C+** avant le début de l'impression
- **N'ouvrez pas la porte de la chambre** pendant l'impression — la chute de température provoque un warping immédiat
- Après l'impression : laisser la pièce refroidir **lentement** dans la chambre (1–2 heures)

### Refroidissement

- Utiliser un **refroidissement minimal** (0–20%) pour la meilleure liaison entre couches
- Pour les ponts et surplombs : augmenter temporairement à 30–40%
- Privilégier la résistance des couches plutôt que l'esthétique avec le PC

### Considérations de conception

- **Éviter les coins vifs** — arrondir avec un rayon minimum de 1 mm
- **Épaisseur de paroi uniforme** — une épaisseur irrégulière crée des contraintes internes
- **Les grandes surfaces planes** sont difficiles — diviser ou ajouter des nervures

:::tip Nouveau avec le PC ? Commencez par le PC-ABS
Si vous n'avez jamais imprimé du PC, commencez par un blend PC-ABS. Il est beaucoup plus tolérant que le PC pur et vous permet d'acquérir de l'expérience avec le matériau sans les exigences extrêmes. Une fois le PC-ABS maîtrisé, passez au PC pur.
:::

---

## Post-traitement

- **Ponçage** — le PC se ponce bien, mais utilisez le ponçage humide pour le PC clair
- **Polissage** — le PC clair peut être poli jusqu'à une qualité quasi optique
- **Collage** — le collage au dichlorométhane donne des joints invisibles (portez des protections !)
- **Peinture** — nécessite un apprêt pour une bonne adhérence
- **Recuit** — 120 °C pendant 1–2 heures réduit les contraintes internes

:::warning Collage au dichlorométhane
Le dichlorométhane est toxique et nécessite une extraction, des gants résistants aux produits chimiques et des lunettes de protection. Travaillez toujours dans un local bien ventilé ou sous hotte aspirante.
:::
