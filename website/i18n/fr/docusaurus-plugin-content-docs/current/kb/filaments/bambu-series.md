---
sidebar_position: 9
title: Filaments Bambu Lab
description: Vue d'ensemble complète des séries de filaments Bambu Lab — paramètres, RFID et compatibilité AMS
---

# Filaments Bambu Lab

Bambu Lab produit une large gamme de filaments spécialement optimisés pour leurs imprimantes. Tous les filaments Bambu Lab sont livrés avec un **tag RFID** automatiquement détecté par l'imprimante qui règle les paramètres appropriés.

## RFID et AMS

Tous les filaments Bambu Lab ont une **puce RFID** intégrée dans la bobine. Elle fournit :

- **Reconnaissance automatique** — l'imprimante lit le type de matériau, la couleur et les paramètres
- **Quantité restante** — estimation du filament restant sur la bobine
- **Paramètres corrects** — température, vitesse et refroidissement réglés automatiquement
- **Compatibilité AMS** — changement de matériau transparent dans l'AMS

:::tip Filaments tiers dans l'AMS
L'AMS fonctionne aussi avec des filaments tiers, mais vous devez régler les paramètres manuellement dans Bambu Studio. La détection automatique RFID est exclusive aux filaments Bambu Lab.
:::

---

## Série PLA

La série PLA de Bambu Lab est la plus complète, couvrant tout des produits de base aux effets spéciaux.

### PLA Basic

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220 °C |
| Température plateau | 35–45 °C |
| Refroidissement | 100% |
| RFID | Oui |
| Compatible AMS | Oui |
| Prix | Budget |

Le filament standard pour l'impression quotidienne. Disponible dans une large palette de couleurs.

### PLA Matte

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220 °C |
| Température plateau | 35–45 °C |
| Refroidissement | 100% |
| Surface | Mate, sans brillance |

Donne une surface lisse et mate qui masque mieux les lignes de couche que le PLA standard. Choix populaire pour les impressions esthétiques.

### PLA Silk

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 230 °C |
| Température plateau | 45–55 °C |
| Refroidissement | 80% |
| Surface | Brillante, reflet métallique |

Donne une surface brillante et soyeuse avec un effet métallique. Nécessite un refroidissement et une vitesse légèrement inférieurs au PLA standard.

### PLA Sparkle

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220–230 °C |
| Température plateau | 35–45 °C |
| Refroidissement | 100% |
| Surface | Particules de paillettes |

Contient des particules de paillettes qui donnent un effet scintillant. S'imprime comme le PLA standard.

### PLA Marble

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220 °C |
| Température plateau | 35–45 °C |
| Refroidissement | 100% |
| Surface | Motif marbré |

Donne un effet marbré unique avec des variations de couleur dans toute l'impression. Chaque impression est légèrement unique.

### PLA Tough (PLA-S)

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220–230 °C |
| Température plateau | 35–55 °C |
| Refroidissement | 100% |
| Résistance | 20–30% plus résistant que le PLA standard |

PLA renforcé avec une résistance aux chocs accrue. Adapté aux pièces mécaniques nécessitant plus de résistance que le PLA standard.

### PLA Galaxy

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220–230 °C |
| Température plateau | 35–45 °C |
| Refroidissement | 100% |
| Surface | Paillettes + dégradé de couleurs |

Combine l'effet paillettes avec des dégradés de couleurs pour un effet visuel unique. S'imprime avec les paramètres PLA standard.

---

## Série PETG

### PETG Basic

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 240–250 °C |
| Température plateau | 70–80 °C |
| Refroidissement | 50–70% |
| RFID | Oui |
| Compatible AMS | Oui |

PETG standard avec bonne résistance et flexibilité. Disponible dans un bon choix de couleurs.

### PETG HF (High Flow)

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 240–260 °C |
| Température plateau | 70–80 °C |
| Refroidissement | 50–70% |
| Vitesse | Jusqu'à 300 mm/s |

Version haute vitesse du PETG formulée pour une extrusion plus rapide sans sacrifier la qualité. Idéal pour les grandes pièces et la production en série.

### PETG-CF

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 250–270 °C |
| Température plateau | 70–80 °C |
| Refroidissement | 40–60% |
| Buse | Acier trempé requis |

PETG renforcé fibre de carbone avec rigidité et stabilité dimensionnelle accrues. Nécessite une buse durcie (HS01 ou équivalent).

:::warning Buse durcie pour les variantes CF
Tous les filaments renforcés fibre de carbone (PLA-CF, PETG-CF, PA-CF, PC-CF) nécessitent une buse en acier trempé. Le laiton s'use en quelques heures avec les matériaux CF.
:::

---

## ABS et ASA

### ABS

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 250–270 °C |
| Température plateau | 90–110 °C |
| Température chambre | Recommandé 40 °C+ |
| Refroidissement | 20–40% |
| Enceinte | Recommandée |

### ASA

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 240–260 °C |
| Température plateau | 90–110 °C |
| Température chambre | Recommandé 40 °C+ |
| Refroidissement | 30–50% |
| Enceinte | Recommandée |
| Résistance UV | Excellente |

---

## TPU 95A

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220–240 °C |
| Température plateau | 35–50 °C |
| Refroidissement | 50–80% |
| Vitesse | 50–70% (réduite) |
| Dureté Shore | 95A |
| Compatible AMS | Limité (alimentation directe recommandée) |

Filament flexible pour des pièces caoutchouteuses. L'AMS peut gérer le TPU 95A, mais l'alimentation directe donne de meilleurs résultats pour les variantes plus souples.

:::tip TPU dans l'AMS
Le TPU 95A de Bambu Lab est spécialement formulé pour fonctionner avec l'AMS. Les TPU plus souples (85A et en dessous) doivent être alimentés directement à l'extrudeur.
:::

---

## Série PA (Nylon)

### PA6-CF

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 270–290 °C |
| Température plateau | 90–100 °C |
| Température chambre | 50 °C+ (requis) |
| Refroidissement | 0–20% |
| Buse | Acier trempé requis |
| Enceinte | Requise |
| Séchage | 70–80 °C pendant 8–12 heures |

Nylon renforcé fibre de carbone avec résistance et rigidité extrêmement élevées. L'un des matériaux FDM les plus résistants disponibles.

### PA6-GF

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 270–290 °C |
| Température plateau | 90–100 °C |
| Température chambre | 50 °C+ (requis) |
| Refroidissement | 0–20% |
| Buse | Acier trempé requis |
| Enceinte | Requise |
| Séchage | 70–80 °C pendant 8–12 heures |

Nylon renforcé fibre de verre — moins cher que le PA6-CF avec une bonne rigidité et stabilité dimensionnelle.

---

## PC

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 260–280 °C |
| Température plateau | 100–120 °C |
| Température chambre | 50–60 °C (requis) |
| Refroidissement | 0–20% |
| Enceinte | Requise |
| Séchage | 70–80 °C pendant 6–8 heures |

Le polycarbonate de Bambu Lab pour une résistance et une tenue thermique maximales.

---

## Matériaux de support

### PVA

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 190–210 °C |
| Température plateau | 45–60 °C |
| Solvant | Eau |
| Combiner avec | PLA, PETG |

### HIPS

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 220–240 °C |
| Température plateau | 90–100 °C |
| Solvant | d-Limonène |
| Combiner avec | ABS, ASA |

---

## Contrôle qualité et cohérence des couleurs

Bambu Lab maintient un contrôle qualité strict sur ses filaments :

- **Tolérance de diamètre** — ±0,02 mm (leader de l'industrie)
- **Cohérence des couleurs** — contrôle par lot garantissant la correspondance des couleurs entre bobines
- **Qualité de la bobine** — enroulement régulier sans nœuds ni chevauchement
- **Scellé sous vide** — chaque bobine est livrée sous vide avec déshydratant
- **Tests de profil de température** — chaque lot est testé pour la température optimale

:::tip Numéro de couleur pour la cohérence
Bambu Lab utilise des numéros de couleur (par ex., « Bambu PLA Matte Charcoal ») avec contrôle par lot. Si vous avez besoin de couleurs identiques sur plusieurs bobines pour un grand projet, commandez du même lot ou contactez le support pour l'appariement des lots.
:::

---

## Prix et disponibilité

| Série | Gamme de prix | Disponibilité |
|-------|-------------|--------------|
| PLA Basic | Budget | Bonne — large sélection |
| PLA Matte/Silk/Sparkle | Modéré | Bonne |
| PLA Tough | Modéré | Bonne |
| PETG Basic/HF | Modéré | Bonne |
| PETG-CF | Élevé | Modérée |
| ABS/ASA | Modéré | Bonne |
| TPU 95A | Modéré | Sélection limitée |
| PA6-CF/GF | Élevé | Modérée |
| PC | Élevé | Limité |
| PVA/HIPS | Élevé | Bonne |

Les filaments Bambu Lab sont disponibles via la boutique en ligne de Bambu Lab et chez des revendeurs sélectionnés. Les prix sont généralement compétitifs par rapport aux autres marques premium, en particulier le PLA Basic positionné sur le marché budget.
