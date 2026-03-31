---
sidebar_position: 2
title: Stock de filament
description: Gérez vos bobines de filament, la synchronisation AMS, le séchage et plus encore
---

# Stock de filament

Le stock de filament vous offre une vue d'ensemble complète de toutes vos bobines, intégré avec l'AMS et l'historique d'impression.

## Aperçu

Le stock affiche toutes les bobines enregistrées avec :

- **Couleur** — carte de couleur visuelle
- **Matériau** — PLA, PETG, ABS, TPU, PA, etc.
- **Fournisseur** — Bambu Lab, Polymaker, eSUN, etc.
- **Poids** — grammes restants (estimé ou pesé)
- **Emplacement AMS** — emplacement AMS où se trouve la bobine
- **Statut** — active, vide, en séchage, stockée

## Ajout de bobines

1. Cliquez sur **+ Nouvelle bobine**
2. Renseignez le matériau, la couleur, le fournisseur et le poids
3. Scannez l'étiquette NFC si disponible, ou saisissez manuellement
4. Enregistrez

:::tip Bobines Bambu Lab
Les bobines officielles Bambu Lab peuvent être importées automatiquement via l'intégration Bambu Cloud. Voir [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Synchronisation AMS

Lorsque le tableau de bord est connecté à l'imprimante, le statut AMS se synchronise automatiquement :

- Les emplacements s'affichent avec la bonne couleur et le bon matériau depuis l'AMS
- La consommation se met à jour après chaque impression
- Les bobines vides sont automatiquement marquées

Pour associer une bobine locale à un emplacement AMS :
1. Accédez à **Filament → AMS**
2. Cliquez sur l'emplacement que vous souhaitez associer
3. Sélectionnez la bobine dans le stock

## Séchage

Enregistrez les cycles de séchage pour suivre l'exposition à l'humidité :

| Champ | Description |
|-------|-------------|
| Date de séchage | Quand la bobine a été séchée |
| Température | Température de séchage (°C) |
| Durée | Nombre d'heures |
| Méthode | Four, étuve, séchoir à filament |

:::info Températures de séchage recommandées
Consultez la [Base de connaissances](../kb/intro) pour les durées et températures de séchage spécifiques à chaque matériau.
:::

## Carte de couleurs

La vue carte de couleurs organise visuellement les bobines par couleur. Utile pour trouver rapidement la bonne couleur. Filtrez par matériau, fournisseur ou statut.

## Étiquettes NFC

3DPrintForge prend en charge les étiquettes NFC pour identifier rapidement les bobines :

1. Saisissez l'ID de l'étiquette NFC dans la fiche de la bobine du stock
2. Scannez l'étiquette avec votre téléphone
3. La bobine s'ouvre directement dans le tableau de bord

## Import et export

### Export
Exportez l'intégralité du stock en CSV : **Filament → Exporter → CSV**

### Import
Importez des bobines depuis un CSV : **Filament → Importer → Sélectionner un fichier**

Format CSV :
```
nom,materiau,couleur_hex,fournisseur,poids_grammes,nfc_id
PLA Blanc,PLA,#FFFFFF,Bambu Lab,1000,
PETG Noir,PETG,#000000,Polymaker,850,ABC123
```

## Statistiques

Sous **Filament → Statistiques**, vous trouverez :

- Consommation totale par matériau (30/90/365 derniers jours)
- Consommation par imprimante
- Durée de vie restante estimée par bobine
- Couleurs et fournisseurs les plus utilisés
