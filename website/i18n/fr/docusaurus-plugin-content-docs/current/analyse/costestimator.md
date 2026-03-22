---
sidebar_position: 4
title: Estimateur de coûts
description: Téléchargez un fichier 3MF ou GCode et calculez le coût total du filament, de l'électricité et de l'usure de la machine avant d'imprimer
---

# Estimateur de coûts

L'estimateur de coûts vous permet de calculer le coût total d'une impression avant de l'envoyer à l'imprimante — basé sur la consommation de filament, le prix de l'électricité et l'usure de la machine.

Accédez à : **https://localhost:3443/#cost-estimator**

## Télécharger un fichier

1. Accédez à **Estimateur de coûts**
2. Faites glisser un fichier dans la zone de téléchargement, ou cliquez sur **Sélectionner un fichier**
3. Formats supportés : `.3mf`, `.gcode`, `.bgcode`
4. Cliquez sur **Analyser**

:::info Analyse
Le système analyse le G-code pour extraire la consommation de filament, le temps d'impression estimé et le profil de matériau. Cela prend généralement 2 à 10 secondes.
:::

## Calcul du filament

Après l'analyse s'affichent :

| Champ | Valeur (exemple) |
|-------|-----------------|
| Filament estimé | 47,3 g |
| Matériau (du fichier) | PLA |
| Prix par gramme | 0,025 € (du stock de filament) |
| **Coût filament** | **1,18 €** |

Changez le matériau dans la liste déroulante pour comparer les coûts avec différents types de filament ou fournisseurs.

:::tip Remplacement de matériau
Si le G-code ne contient pas d'informations sur le matériau, sélectionnez le matériau manuellement dans la liste. Le prix est automatiquement récupéré du stock de filament.
:::

## Calcul de l'électricité

Le coût de l'électricité est calculé à partir de :

- **Temps d'impression estimé** — depuis l'analyse du G-code
- **Puissance de l'imprimante** — configurée par modèle d'imprimante (W)
- **Prix de l'électricité** — prix fixe (€/kWh) ou en direct depuis Tibber/Nordpool

| Champ | Valeur (exemple) |
|-------|-----------------|
| Temps d'impression estimé | 3 heures 22 min |
| Puissance de l'imprimante | 350 W (X1C) |
| Consommation estimée | 1,17 kWh |
| Prix de l'électricité | 0,18 €/kWh |
| **Coût électricité** | **0,21 €** |

Activez l'intégration Tibber ou Nordpool pour utiliser les prix horaires planifiés basés sur l'heure de démarrage souhaitée.

## Usure de la machine

Le coût d'usure est estimé à partir de :

- Temps d'impression × coût horaire par modèle d'imprimante
- Usure supplémentaire pour les matériaux abrasifs (CF, GF, etc.)

| Champ | Valeur (exemple) |
|-------|-----------------|
| Temps d'impression | 3 heures 22 min |
| Coût horaire (usure) | 0,08 €/heure |
| **Coût d'usure** | **0,27 €** |

Le coût horaire est calculé à partir des prix des composants et de la durée de vie attendue (voir [Prédiction d'usure](../overvaaking/wearprediction)).

## Total

| Poste de coût | Montant |
|---------------|---------|
| Filament | 1,18 € |
| Électricité | 0,21 € |
| Usure machine | 0,27 € |
| **Total** | **1,66 €** |
| + Marge (30 %) | 0,50 € |
| **Prix de vente** | **2,16 €** |

Ajustez la marge dans le champ pourcentage pour calculer le prix de vente recommandé au client.

## Enregistrer l'estimation

Cliquez sur **Enregistrer l'estimation** pour lier l'analyse à un projet :

1. Sélectionnez un projet existant ou créez-en un nouveau
2. L'estimation est enregistrée et peut servir de base pour la facturation
3. Le coût réel (après impression) est automatiquement comparé à l'estimation

## Calcul par lots

Téléchargez plusieurs fichiers simultanément pour calculer le coût total d'un ensemble complet :

1. Cliquez sur **Mode lot**
2. Téléchargez tous les fichiers `.3mf`/`.gcode`
3. Le système calcule les coûts individuels et totaux
4. Exportez le récapitulatif en PDF ou CSV
