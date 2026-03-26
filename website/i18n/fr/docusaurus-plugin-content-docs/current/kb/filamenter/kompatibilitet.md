---
sidebar_position: 10
title: Matrice de compatibilité
description: Vue d'ensemble complète de la compatibilité des matériaux avec les plateaux, imprimantes et buses Bambu Lab
---

# Matrice de compatibilité

Cette page fournit une vue d'ensemble complète des matériaux compatibles avec chaque type de plateau, d'imprimante et de buse. Utilisez les tableaux comme référence lors de la planification d'impressions avec de nouveaux matériaux.

---

## Matériaux et plateaux

| Matériau | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Bâton de colle |
|----------|-----------|-------------------|-----------------|--------------|---------------|
| PLA | Excellent | Bon | Non recommandé | Bon | Non |
| PLA+ | Excellent | Bon | Non recommandé | Bon | Non |
| PLA-CF | Excellent | Bon | Non recommandé | Bon | Non |
| PLA Silk | Excellent | Bon | Non recommandé | Bon | Non |
| PETG | Mauvais | Excellent | Bon | Bon | Oui (Cool) |
| PETG-CF | Mauvais | Excellent | Bon | Acceptable | Oui (Cool) |
| ABS | Non recommandé | Excellent | Bon | Acceptable | Oui (HT) |
| ASA | Non recommandé | Excellent | Bon | Acceptable | Oui (HT) |
| TPU | Bon | Bon | Non recommandé | Excellent | Non |
| PA (Nylon) | Non recommandé | Excellent | Bon | Mauvais | Oui |
| PA-CF | Non recommandé | Excellent | Bon | Mauvais | Oui |
| PA-GF | Non recommandé | Excellent | Bon | Mauvais | Oui |
| PC | Non recommandé | Acceptable | Excellent | Non recommandé | Oui (Eng) |
| PC-CF | Non recommandé | Acceptable | Excellent | Non recommandé | Oui (Eng) |
| PVA | Excellent | Bon | Non recommandé | Bon | Non |
| HIPS | Non recommandé | Bon | Bon | Acceptable | Non |
| PVB | Bon | Bon | Non recommandé | Bon | Non |

**Légende :**
- **Excellent** — fonctionne de manière optimale, combinaison recommandée
- **Bon** — fonctionne bien, alternative acceptable
- **Acceptable** — fonctionne, mais pas idéal — nécessite des mesures supplémentaires
- **Mauvais** — peut fonctionner avec des modifications, mais non recommandé
- **Non recommandé** — mauvais résultats ou risque de dommage au plateau

:::tip PETG et Cool Plate
Le PETG adhère **trop bien** au Cool Plate (Smooth PEI) et peut arracher le revêtement PEI lors du retrait de la pièce. Utilisez toujours un bâton de colle comme film de séparation, ou choisissez l'Engineering Plate.
:::

:::warning PC et choix du plateau
Le PC nécessite le High Temp Plate en raison des températures de plateau élevées (100–120 °C). Les autres plateaux peuvent être déformés de manière permanente à ces températures.
:::

---

## Matériaux et imprimantes

| Matériau | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| PLA+ | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| PLA-CF | Oui* | Oui* | Oui* | Oui* | Oui* | Oui | Oui | Oui* | Oui* | Oui* |
| PETG | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| PETG-CF | Oui* | Oui* | Oui* | Oui* | Oui* | Oui | Oui | Oui* | Oui* | Oui* |
| ABS | Non | Non | Possible** | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| ASA | Non | Non | Possible** | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| TPU | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| PA (Nylon) | Non | Non | Non | Possible** | Possible** | Oui | Oui | Oui | Oui | Oui |
| PA-CF | Non | Non | Non | Non | Non | Oui | Oui | Possible** | Possible** | Possible** |
| PA-GF | Non | Non | Non | Non | Non | Oui | Oui | Possible** | Possible** | Possible** |
| PC | Non | Non | Non | Possible** | Non | Oui | Oui | Possible** | Possible** | Possible** |
| PC-CF | Non | Non | Non | Non | Non | Oui | Oui | Non | Non | Non |
| PVA | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| HIPS | Non | Non | Possible** | Oui | Oui | Oui | Oui | Oui | Oui | Oui |

**Légende :**
- **Oui** — entièrement pris en charge et recommandé
- **Oui*** — nécessite une buse en acier trempé (HS01 ou équivalent)
- **Possible**** — peut fonctionner avec des limitations, non officiellement recommandé
- **Non** — non adapté (manque d'enceinte, températures trop basses, etc.)

:::danger Exigences d'enceinte
Matériaux nécessitant une enceinte (ABS, ASA, PA, PC) :
- **A1 et A1 Mini** ont un cadre ouvert — non adaptés
- **P1P** a un cadre ouvert — nécessite un accessoire d'enceinte
- **P1S** a une enceinte, mais pas de chauffage actif de chambre
- **X1C et X1E** ont une enceinte complète avec chauffage actif — recommandés pour les matériaux exigeants
:::

---

## Matériaux et types de buses

| Matériau | Laiton (standard) | Acier trempé (HS01) | Hardened Steel |
|----------|-------------------|---------------------|----------------|
| PLA | Excellent | Excellent | Excellent |
| PLA+ | Excellent | Excellent | Excellent |
| PLA-CF | Ne pas utiliser | Excellent | Excellent |
| PLA Silk | Excellent | Excellent | Excellent |
| PETG | Excellent | Excellent | Excellent |
| PETG-CF | Ne pas utiliser | Excellent | Excellent |
| ABS | Excellent | Excellent | Excellent |
| ASA | Excellent | Excellent | Excellent |
| TPU | Excellent | Bon | Bon |
| PA (Nylon) | Bon | Excellent | Excellent |
| PA-CF | Ne pas utiliser | Excellent | Excellent |
| PA-GF | Ne pas utiliser | Excellent | Excellent |
| PC | Bon | Excellent | Excellent |
| PC-CF | Ne pas utiliser | Excellent | Excellent |
| PVA | Excellent | Bon | Bon |
| HIPS | Excellent | Excellent | Excellent |
| PVB | Excellent | Bon | Bon |

:::danger Les fibres de carbone et de verre nécessitent une buse durcie
Tous les matériaux avec **-CF** (fibre de carbone) ou **-GF** (fibre de verre) **nécessitent une buse en acier trempé**. Le laiton s'use en quelques heures à quelques jours avec ces matériaux. Bambu Lab HS01 est recommandé.

Matériaux nécessitant une buse durcie :
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Laiton vs acier trempé pour les matériaux courants
La buse en laiton offre une **meilleure conductivité thermique** et donc une extrusion plus régulière pour les matériaux courants (PLA, PETG, ABS). L'acier trempé fonctionne bien, mais peut nécessiter 5–10 °C de plus. Utilisez le laiton au quotidien et passez à l'acier trempé pour les matériaux CF/GF.
:::

---

## Conseils pour les changements de matériau

Lors du changement de matériau dans l'AMS ou manuellement, un purge correct est important pour éviter la contamination.

### Volume de purge recommandé

| De → Vers | Volume de purge | Remarque |
|-----------|----------------|----------|
| PLA → PLA (autre couleur) | 100–150 mm³ | Changement de couleur standard |
| PLA → PETG | 200–300 mm³ | Augmentation de température, flux différent |
| PETG → PLA | 200–300 mm³ | Baisse de température |
| ABS → PLA | 300–400 mm³ | Grande différence de température |
| PLA → ABS | 300–400 mm³ | Grande différence de température |
| PA → PLA | 400–500 mm³ | Le nylon reste dans le hotend |
| PC → PLA | 400–500 mm³ | Le PC nécessite un purge approfondi |
| Foncé → Clair | 200–300 mm³ | Le pigment foncé est difficile à rincer |
| Clair → Foncé | 100–150 mm³ | Transition plus facile |

### Changement de température lors du changement de matériau

| Transition | Recommandation |
|-----------|---------------|
| Froid → Chaud (par ex., PLA → ABS) | Chauffer au nouveau matériau, purger à fond |
| Chaud → Froid (par ex., ABS → PLA) | Purger d'abord à haute température, puis baisser |
| Températures similaires (par ex., PLA → PLA) | Purge standard |
| Grande différence (par ex., PLA → PC) | Un arrêt intermédiaire avec du PETG peut aider |

:::warning Le nylon et le PC laissent des résidus
Le PA (Nylon) et le PC sont particulièrement difficiles à purger. Après utilisation de ces matériaux :
1. Purger avec du **PETG** ou de l'**ABS** à haute température (260–280 °C)
2. Faire passer au moins **500 mm³** de matériau de purge
3. Inspecter visuellement l'extrusion — elle doit être entièrement propre sans décoloration
:::

---

## Référence rapide — choix du matériau

Vous ne savez pas quel matériau choisir ? Utilisez ce guide :

| Besoin | Matériau recommandé |
|--------|-------------------|
| Prototypage / usage quotidien | PLA |
| Résistance mécanique | PETG, PLA Tough |
| Usage extérieur | ASA |
| Résistance thermique | ABS, ASA, PC |
| Pièces flexibles | TPU |
| Résistance maximale | PA-CF, PC-CF |
| Transparent | PETG (naturel), PC (naturel) |
| Esthétique / décoration | PLA Silk, PLA Sparkle |
| Clips / charnières souples | PETG, PA |
| Contact alimentaire | PLA (avec réserves) |
