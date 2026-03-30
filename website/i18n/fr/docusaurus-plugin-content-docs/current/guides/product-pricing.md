---
sidebar_position: 11
title: Tarification des produits — calculer le prix de vente
description: Guide complet pour tarifer les impressions 3D destinées à la vente avec tous les facteurs de coût
---

# Tarification des produits — calculer le prix de vente

Ce guide explique comment utiliser le calculateur de coûts pour trouver le bon prix de vente pour les impressions 3D que vous vendez.

## Aperçu des coûts

Le coût d'une impression 3D se compose de ces éléments :

| Composant | Description | Exemple |
|-----------|-------------|---------|
| **Filament** | Coût matériel basé sur le poids et le prix de la bobine | 100g × 0,25 kr/g = 25 kr |
| **Déchet** | Gaspillage de matériau (purge, impressions ratées, support) | 10% supplémentaire = 2,50 kr |
| **Électricité** | Consommation électrique pendant l'impression | 3,5h × 150W × 1,50 kr/kWh = 0,79 kr |
| **Usure** | Buse + valeur machine sur la durée de vie | 3,5h × 0,15 kr/h = 0,53 kr |
| **Main-d'œuvre** | Votre temps pour la mise en place, le post-traitement, l'emballage | 10 min × 200 kr/h = 33,33 kr |
| **Majoration** | Marge bénéficiaire | 20% = 12,43 kr |

**Coût total de production** = somme de tous les composants

## Configurer les paramètres

### Paramètres de base

Allez dans **Filament → ⚙ Paramètres** et remplissez :

1. **Prix de l'électricité (kr/kWh)** — votre prix d'électricité. Vérifiez votre facture d'électricité ou utilisez l'intégration Nordpool
2. **Puissance de l'imprimante (W)** — typiquement 150W pour les imprimantes Bambu Lab
3. **Coût de la machine (kr)** — ce que vous avez payé pour l'imprimante
4. **Durée de vie de la machine (heures)** — durée de vie prévue (3000-8000 heures)
5. **Coût de main-d'œuvre (kr/heure)** — votre taux horaire
6. **Temps de préparation (min)** — temps moyen pour le changement de filament, vérification du plateau, emballage
7. **Majoration (%)** — marge bénéficiaire souhaitée
8. **Coût de la buse (kr/heure)** — usure de la buse (HS01 ≈ 0,05 kr/h)
9. **Facteur de déchet** — gaspillage de matériau (1,1 = 10% supplémentaire, 1,15 = 15%)

:::tip Valeurs typiques pour Bambu Lab
| Paramètre | Amateur | Semi-pro | Professionnel |
|---|---|---|---|
| Prix de l'électricité | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Puissance de l'imprimante | 150W | 150W | 150W |
| Coût de la machine | 5 000 kr | 12 000 kr | 25 000 kr |
| Durée de vie de la machine | 3 000h | 5 000h | 8 000h |
| Coût de main-d'œuvre | 0 kr/h | 150 kr/h | 250 kr/h |
| Temps de préparation | 5 min | 10 min | 15 min |
| Majoration | 0% | 30% | 50% |
| Facteur de déchet | 1,05 | 1,10 | 1,15 |
:::

## Calculer le coût

1. Allez dans le **Calculateur de coûts** (`https://localhost:3443/#costestimator`)
2. **Glissez-déposez** un fichier `.3mf` ou `.gcode`
3. Le système lit automatiquement : poids du filament, temps estimé, couleurs
4. **Associer les bobines** — sélectionnez quelles bobines du stock sont utilisées
5. Cliquez sur **Calculer le coût**

### Le résultat affiche :

- **Filament** — coût matériel par couleur
- **Déchet/perte** — basé sur le facteur de déchet
- **Électricité** — utilise le prix spot en direct de Nordpool si disponible
- **Usure** — buse + valeur machine
- **Main-d'œuvre** — taux horaire + temps de préparation
- **Coût de production** — somme de tout ce qui précède
- **Majoration** — votre marge bénéficiaire
- **Coût total** — ce que vous devriez facturer au minimum
- **Prix de vente suggérés** — marge 2×, 2,5×, 3×

## Stratégies de tarification

### Marge 2× (minimum recommandé)
Couvre le coût de production + dépenses imprévues. À utiliser pour les amis/famille et les géométries simples.

### Marge 2,5× (standard)
Bon équilibre entre prix et valeur. Fonctionne pour la plupart des produits.

### Marge 3× (premium)
Pour les modèles complexes, multicolores, haute qualité ou marchés de niche.

:::warning N'oubliez pas les coûts cachés
- Impressions ratées (5-15% de toutes les impressions échouent)
- Filament non utilisé (les derniers 50g sont souvent difficiles)
- Temps consacré au service client
- Emballage et expédition
- Maintenance de l'imprimante
:::

## Exemple : Tarifer un support de téléphone

| Paramètre | Valeur |
|-----------|-------|
| Poids du filament | 45g PLA |
| Temps d'impression | 2 heures |
| Prix spot | 1,20 kr/kWh |

**Calcul :**
- Filament : 45g × 0,25 kr/g = 11,25 kr
- Déchet (10%) : 1,13 kr
- Électricité : 2h × 0,15kW × 1,20 = 0,36 kr
- Usure : 2h × 0,15 = 0,30 kr
- Main-d'œuvre : (2h + 10min) × 200 kr/h = 433 kr (ou 0 pour amateur)
- **Coût de production (amateur)** : ~13 kr
- **Prix de vente 2,5×** : ~33 kr

## Enregistrer l'estimation

Cliquez sur **Enregistrer l'estimation** pour archiver le calcul. Les estimations enregistrées se trouvent sous l'onglet **Enregistrés** dans le calculateur de coûts.

## E-commerce

Si vous utilisez le [module e-commerce](../integrations/ecommerce), vous pouvez lier les estimations de coûts directement aux commandes pour un calcul automatique des prix.
