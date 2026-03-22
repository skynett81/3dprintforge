---
sidebar_position: 3
title: Analyse du filament
description: Analyse détaillée de la consommation de filament, des coûts, des prévisions, des taux de consommation et des déchets par matériau et fournisseur
---

# Analyse du filament

L'analyse du filament vous offre une visibilité complète sur votre consommation de filament — ce que vous utilisez, ce que ça coûte, et ce que vous pouvez économiser.

Accédez à : **https://localhost:3443/#filament-analytics**

## Aperçu de la consommation

En haut s'affiche un résumé pour la période sélectionnée :

- **Consommation totale** — grammes et mètres pour tous les matériaux
- **Coût estimé** — basé sur le prix enregistré par bobine
- **Matériau le plus utilisé** — type et fournisseur
- **Taux de recyclage** — proportion de filament dans le modèle réel vs. support/purge

### Consommation par matériau

Un diagramme circulaire et un tableau montrent la répartition entre les matériaux :

| Colonne | Description |
|---------|-------------|
| Matériau | PLA, PETG, ABS, PA, etc. |
| Fournisseur | Bambu Lab, PolyMaker, Prusament, etc. |
| Grammes utilisés | Poids total |
| Mètres | Longueur estimée |
| Coût | Grammes × prix par gramme |
| Impressions | Nombre d'impressions avec ce matériau |

Cliquez sur une ligne pour entrer dans le détail au niveau de la bobine individuelle.

## Taux de consommation

Le taux de consommation montre la consommation moyenne de filament par unité de temps :

- **Grammes par heure** — pendant l'impression active
- **Grammes par semaine** — y compris les temps d'arrêt de l'imprimante
- **Grammes par impression** — moyenne par impression

Ces données servent à calculer les prévisions pour les besoins futurs.

:::tip Planification des achats
Utilisez le taux de consommation pour planifier votre stock de bobines. Le système vous alerte automatiquement quand le stock estimé sera épuisé dans 14 jours (configurable).
:::

## Prévision des coûts

À partir du taux de consommation historique, le système calcule :

- **Consommation estimée sur 30 prochains jours** (grammes par matériau)
- **Coût estimé sur 30 prochains jours**
- **Stock recommandé** (suffisant pour 30 / 60 / 90 jours de fonctionnement)

La prévision tient compte des variations saisonnières si vous avez des données d'au moins un an.

## Déchets et efficacité

Voir [Suivi des déchets](./waste) pour la documentation complète. L'analyse du filament affiche un résumé :

- **Purge AMS** — grammes et proportion de la consommation totale
- **Matériau de support** — grammes et proportion
- **Matériau de modèle réel** — proportion restante (efficacité %)
- **Coût estimé des déchets** — ce que les déchets vous coûtent

## Journal des bobines

Toutes les bobines (actives et vides) sont enregistrées :

| Champ | Description |
|-------|-------------|
| Nom de la bobine | Nom du matériau et couleur |
| Poids initial | Poids enregistré au départ |
| Poids restant | Poids restant calculé |
| Utilisé | Grammes utilisés au total |
| Dernier usage | Date de la dernière impression |
| Statut | Active / Vide / Stockée |

## Enregistrement des prix

Pour une analyse des coûts précise, enregistrez les prix par bobine :

1. Accédez au **Stock de filament**
2. Cliquez sur une bobine → **Modifier**
3. Renseignez le **Prix d'achat** et le **Poids à l'achat**
4. Le système calcule automatiquement le prix par gramme

Les bobines sans prix enregistré utilisent le **prix standard par gramme** (défini sous **Paramètres → Filament → Prix standard**).

## Export

1. Cliquez sur **Exporter les données de filament**
2. Sélectionnez la période et le format (CSV / PDF)
3. Le CSV inclut une ligne par impression avec les grammes, le coût et le matériau
