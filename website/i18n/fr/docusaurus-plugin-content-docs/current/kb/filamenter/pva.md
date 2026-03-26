---
sidebar_position: 8
title: PVA et matériaux de support
description: Guide du PVA, HIPS, PVB et autres matériaux de support pour les imprimantes Bambu Lab
---

# PVA et matériaux de support

Les matériaux de support servent à imprimer des géométries complexes avec des surplombs, des ponts et des cavités internes qui ne peuvent pas être imprimées sans support temporaire. Après l'impression, le matériau de support est retiré — soit mécaniquement, soit par dissolution dans un solvant.

## Vue d'ensemble

| Matériau | Solvant | Combiner avec | Temps de dissolution | Difficulté |
|----------|---------|--------------|---------------------|------------|
| PVA | Eau | PLA, PETG | 12–24 heures | Exigeant |
| HIPS | d-Limonène | ABS, ASA | 12–24 heures | Modéré |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 heures | Modéré |
| BVOH | Eau | PLA, PETG, PA | 4–8 heures | Exigeant |

---

## PVA (Alcool polyvinylique)

Le PVA est un matériau de support soluble dans l'eau, le choix le plus courant pour les impressions à base de PLA avec des structures de support complexes.

### Paramètres

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 190–210 °C |
| Température plateau | 45–60 °C |
| Refroidissement pièce | 100% |
| Vitesse | 60–80% |
| Rétraction | Augmentée (6–8 mm) |

### Plateaux recommandés

| Plateau | Compatibilité | Bâton de colle ? |
|---------|--------------|-----------------|
| Cool Plate (Smooth PEI) | Excellent | Non |
| Textured PEI | Bon | Non |
| Engineering Plate | Bon | Non |
| High Temp Plate | À éviter | — |

### Compatibilité

Le PVA fonctionne mieux avec les matériaux qui impriment à des **températures similaires** :

| Matériau principal | Compatibilité | Remarque |
|-------------------|--------------|----------|
| PLA | Excellent | Combinaison idéale |
| PETG | Bon | La température du plateau peut être un peu élevée pour le PVA |
| ABS/ASA | Mauvais | Température de chambre trop élevée — le PVA se dégrade |
| PA (Nylon) | Mauvais | Températures trop élevées |

### Dissolution

- Placer l'impression finie dans de l'**eau tiède** (env. 40 °C)
- Le PVA se dissout en **12–24 heures** selon l'épaisseur
- Remuer l'eau régulièrement pour accélérer le processus
- Changer l'eau toutes les 6–8 heures pour une dissolution plus rapide
- Un nettoyeur à ultrasons donne des résultats nettement plus rapides (2–6 heures)

:::danger Le PVA est extrêmement hygroscopique
Le PVA absorbe l'humidité de l'air **très rapidement** — même quelques heures d'exposition peuvent ruiner les résultats d'impression. Un PVA qui a absorbé de l'humidité provoque :

- Bulles importantes et crépitements
- Mauvaise adhésion au matériau principal
- Stringing et surface collante
- Buse bouchée

**Séchez toujours le PVA immédiatement avant utilisation** et imprimez depuis un environnement sec (boîte de séchage).
:::

### Séchage du PVA

| Paramètre | Valeur |
|-----------|--------|
| Température de séchage | 45–55 °C |
| Durée de séchage | 6–10 heures |
| Niveau hygroscopique | Extrêmement élevé |
| Méthode de stockage | Boîte scellée avec déshydratant, toujours |

---

## HIPS (Polystyrène choc)

Le HIPS est un matériau de support qui se dissout dans le d-limonène (solvant à base d'agrumes). C'est le matériau de support préféré pour l'ABS et l'ASA.

### Paramètres

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220–240 °C |
| Température plateau | 90–100 °C |
| Température chambre | 40–50 °C (recommandé) |
| Refroidissement pièce | 20–40% |
| Vitesse | 70–90% |

### Compatibilité

| Matériau principal | Compatibilité | Remarque |
|-------------------|--------------|----------|
| ABS | Excellent | Combinaison idéale — températures similaires |
| ASA | Excellent | Très bonne adhésion |
| PLA | Mauvais | Différence de température trop grande |
| PETG | Mauvais | Comportement thermique différent |

### Dissolution dans le d-Limonène

- Placer l'impression dans du **d-limonène** (solvant à base d'agrumes)
- Temps de dissolution : **12–24 heures** à température ambiante
- Le chauffage à 35–40 °C accélère le processus
- Le d-limonène peut être réutilisé 2–3 fois
- Rincer la pièce à l'eau et sécher après dissolution

### Avantages par rapport au PVA

- **Bien moins sensible à l'humidité** — plus facile à stocker et manipuler
- **Plus résistant comme support** — supporte davantage sans se décomposer
- **Meilleure compatibilité thermique** avec l'ABS/ASA
- **Plus facile à imprimer** — moins de bouchons et de problèmes

:::warning Le d-Limonène est un solvant
Portez des gants et travaillez dans un local ventilé. Le d-limonène peut irriter la peau et les muqueuses. Conserver hors de portée des enfants.
:::

---

## PVB (Polyvinyl butyral)

Le PVB est un matériau de support unique qui se dissout dans l'isopropanol (IPA) et peut être utilisé pour lisser les surfaces avec de la vapeur d'IPA.

### Paramètres

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 200–220 °C |
| Température plateau | 55–75 °C |
| Refroidissement pièce | 80–100% |
| Vitesse | 70–80% |

### Compatibilité

| Matériau principal | Compatibilité | Remarque |
|-------------------|--------------|----------|
| PLA | Bon | Adhésion acceptable |
| PETG | Modéré | La température du plateau peut varier |
| ABS/ASA | Mauvais | Températures trop élevées |

### Lissage de surface à la vapeur d'IPA

La propriété unique du PVB est que sa surface peut être lissée à la vapeur d'IPA :

1. Placer la pièce dans un récipient fermé
2. Poser un chiffon imbibé d'IPA au fond (sans contact direct avec la pièce)
3. Laisser agir la vapeur pendant **30–60 minutes**
4. Retirer et laisser sécher 24 heures
5. Le résultat est une surface lisse et semi-brillante

:::tip Le PVB comme finition de surface
Bien que le PVB soit principalement un matériau de support, il peut être imprimé comme couche extérieure sur des pièces PLA pour obtenir une surface lissable à l'IPA. Cela donne une finition rappelant l'ABS lissé à l'acétone.
:::

---

## Comparaison des matériaux de support

| Propriété | PVA | HIPS | PVB | BVOH |
|-----------|-----|------|-----|------|
| Solvant | Eau | d-Limonène | IPA | Eau |
| Temps de dissolution | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Sensibilité à l'humidité | Extrêmement élevée | Faible | Modérée | Extrêmement élevée |
| Difficulté | Exigeant | Modéré | Modéré | Exigeant |
| Prix | Élevé | Modéré | Élevé | Très élevé |
| Idéal avec | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Disponibilité | Bonne | Bonne | Limitée | Limitée |
| Compatible AMS | Oui (avec déshydratant) | Oui | Oui | Problématique |

---

## Conseils pour la double extrusion et le multicolore

### Recommandations générales

- **Volume de purge** — les matériaux de support nécessitent un bon purge lors du changement de matériau (minimum 150–200 mm³)
- **Couches d'interface** — utilisez 2–3 couches d'interface entre le support et la pièce pour une surface propre
- **Distance** — réglez la distance de support à 0,1–0,15 mm pour un retrait facile après dissolution
- **Motif de support** — motif triangle pour PVA/BVOH, grille pour HIPS

### Configuration AMS

- Placer le matériau de support dans un **slot AMS avec déshydratant**
- Pour le PVA : envisager une boîte de séchage externe avec raccordement Bowden
- Configurer le bon profil de matériau dans Bambu Studio
- Tester avec un modèle simple avec surplomb avant d'imprimer des pièces complexes

### Problèmes courants et solutions

| Problème | Cause | Solution |
|----------|-------|----------|
| Le support n'adhère pas | Distance trop grande | Réduire la distance d'interface à 0,05 mm |
| Le support adhère trop | Distance trop faible | Augmenter la distance d'interface à 0,2 mm |
| Bulles dans le support | Humidité | Sécher le filament soigneusement |
| Stringing entre matériaux | Rétraction insuffisante | Augmenter la rétraction de 1–2 mm |
| Mauvaise surface côté support | Trop peu de couches d'interface | Augmenter à 3–4 couches d'interface |

:::tip Commencez simplement
Pour votre première impression avec matériau de support : utilisez PLA + PVA, un modèle simple avec un surplomb net (45°+) et les paramètres par défaut de Bambu Studio. Optimisez au fur et à mesure de votre expérience.
:::
