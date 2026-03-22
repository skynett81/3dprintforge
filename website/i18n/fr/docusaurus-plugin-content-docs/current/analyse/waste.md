---
sidebar_position: 5
title: Suivi des déchets
description: Suivez les déchets de filament liés à la purge AMS et au matériau de support, calculez les coûts et optimisez l'efficacité
---

# Suivi des déchets

Le suivi des déchets vous offre une visibilité complète sur la quantité de filament gaspillée pendant l'impression — purge AMS, rinçage lors des changements de matériau et matériau de support — et ce que cela vous coûte.

Accédez à : **https://localhost:3443/#waste**

## Catégories de déchets

Bambu Dashboard distingue trois types de déchets :

| Catégorie | Source | Part typique |
|-----------|--------|-------------|
| **Purge AMS** | Changement de couleur dans l'AMS pendant une impression multicolore | 5–30 g par changement |
| **Rinçage changement de matériau** | Nettoyage lors du passage entre différents matériaux | 10–50 g par changement |
| **Matériau de support** | Structures de support retirées après l'impression | Variable |

## Suivi de la purge AMS

Les données de purge AMS sont extraites directement depuis la télémétrie MQTT et l'analyse G-code :

- **Grammes par changement de couleur** — calculé à partir du bloc de purge G-code
- **Nombre de changements de couleur** — compté depuis le journal d'impression
- **Consommation totale de purge** — somme sur la période sélectionnée

:::tip Réduire la purge
Bambu Studio dispose de paramètres pour le volume de purge par combinaison de couleurs. Réduisez le volume de purge pour les paires de couleurs avec peu de différence (ex. blanc → gris clair) pour économiser du filament.
:::

## Calcul de l'efficacité

L'efficacité est calculée comme suit :

```
Efficacité % = (matériau du modèle / consommation totale) × 100

Consommation totale = matériau du modèle + purge + matériau de support
```

**Exemple :**
- Modèle : 45 g
- Purge : 12 g
- Support : 8 g
- Total : 65 g
- **Efficacité : 69 %**

L'efficacité s'affiche sous forme de graphique de tendance dans le temps pour voir si vous progressez.

## Coût des déchets

À partir des prix de filament enregistrés, le système calcule :

| Poste | Calcul |
|-------|--------|
| Coût de purge | Grammes de purge × prix/gramme par couleur |
| Coût de support | Grammes de support × prix/gramme |
| **Coût total des déchets** | Somme des lignes ci-dessus |
| **Coût par impression réussie** | Coût des déchets / nombre d'impressions |

## Déchets par imprimante et matériau

Filtrez la vue par :

- **Imprimante** — voir quelle imprimante génère le plus de déchets
- **Matériau** — voir les déchets par type de filament
- **Période** — jour, semaine, mois, année

La vue tableau affiche une liste classée avec le plus de déchets en premier, incluant le coût estimé.

## Conseils d'optimisation

Le système génère automatiquement des suggestions pour réduire les déchets :

- **Ordre de couleurs inversé** — si la couleur A→B purge plus que B→A, le système suggère d'inverser l'ordre
- **Regrouper les couches de changement de couleur** — regroupe les couches de même couleur pour minimiser les changements
- **Optimisation de la structure de support** — estime la réduction de support en changeant l'orientation

:::info Précision
Les calculs de purge sont estimés à partir du G-code. Les déchets réels peuvent varier de 10 à 20 % en raison du comportement de l'imprimante.
:::

## Export et rapport

1. Cliquez sur **Exporter les données de déchets**
2. Sélectionnez la période et le format (CSV / PDF)
3. Les données de déchets peuvent être incluses dans les rapports de projet et les factures comme poste de coût

Voir aussi [Analyse du filament](./filamentanalytics) pour l'aperçu global de la consommation.
