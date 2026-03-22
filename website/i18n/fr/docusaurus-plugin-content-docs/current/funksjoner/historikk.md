---
sidebar_position: 3
title: Historique d'impression
description: Journal complet de toutes les impressions avec statistiques, suivi du filament et export
---

# Historique d'impression

L'historique d'impression fournit un journal complet de toutes les impressions effectuées avec le tableau de bord, incluant les statistiques, la consommation de filament et les liens vers les sources des modèles.

## Tableau de l'historique

Le tableau affiche toutes les impressions avec :

| Colonne | Description |
|---------|-------------|
| Date/heure | Heure de démarrage |
| Nom du modèle | Nom de fichier ou titre MakerWorld |
| Imprimante | Quelle imprimante a été utilisée |
| Durée | Temps d'impression total |
| Filament | Matériau et grammes utilisés |
| Couches | Nombre de couches et poids (g) |
| Statut | Terminé, annulé, échoué |
| Image | Miniature (avec intégration cloud) |

## Recherche et filtrage

Utilisez le champ de recherche et les filtres pour trouver des impressions :

- Recherche en texte libre sur le nom du modèle
- Filtrer par imprimante, matériau, statut, date
- Trier sur toutes les colonnes

## Liens vers la source du modèle

Si l'impression a été lancée depuis MakerWorld, un lien direct vers la page du modèle s'affiche. Cliquez sur le nom du modèle pour ouvrir MakerWorld dans un nouvel onglet.

:::info Bambu Cloud
Les liens vers les modèles et les miniatures nécessitent l'intégration Bambu Cloud. Voir [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Suivi du filament

Pour chaque impression, les données suivantes sont enregistrées :

- **Matériau** — PLA, PETG, ABS, etc.
- **Grammes utilisés** — consommation estimée
- **Bobine** — quelle bobine a été utilisée (si enregistrée dans le stock)
- **Couleur** — code hexadécimal de la couleur

Cela donne une image précise de la consommation de filament dans le temps et vous aide à planifier vos achats.

## Statistiques

Sous **Historique → Statistiques**, vous trouverez des données agrégées :

- **Nombre total d'impressions** — et taux de succès
- **Temps d'impression total** — heures et jours
- **Consommation de filament** — grammes et km par matériau
- **Impressions par jour** — graphique défilant
- **Matériaux les plus utilisés** — diagramme circulaire
- **Distribution de la durée des impressions** — histogramme

Les statistiques peuvent être filtrées par période (7j, 30j, 90j, 1 an, tout).

## Export

### Export CSV
Exportez l'intégralité de l'historique ou les résultats filtrés :
**Historique → Exporter → Télécharger CSV**

Les fichiers CSV contiennent toutes les colonnes et peuvent être ouverts dans Excel, LibreOffice Calc ou importés dans d'autres outils.

### Sauvegarde automatique
L'historique fait partie de la base de données SQLite qui est automatiquement sauvegardée lors des mises à jour. Sauvegarde manuelle sous **Paramètres → Sauvegarde**.

## Modification

Vous pouvez modifier les entrées du journal d'impression ultérieurement :

- Corriger le nom du modèle
- Ajouter des notes
- Corriger la consommation de filament
- Supprimer les impressions enregistrées par erreur

Cliquez avec le bouton droit sur une ligne et sélectionnez **Modifier** ou cliquez sur l'icône crayon.
