---
sidebar_position: 2
title: Bibliothèque de fichiers
description: Téléchargez et gérez les modèles 3D et fichiers G-code, analysez le G-code et connectez-vous à MakerWorld et Printables
---

# Bibliothèque de fichiers

La bibliothèque de fichiers est un espace centralisé pour stocker et gérer tous vos modèles 3D et fichiers G-code — avec analyse automatique du G-code et intégration avec MakerWorld et Printables.

Accédez à : **https://localhost:3443/#library**

## Télécharger des modèles

### Téléchargement simple

1. Accédez à **Bibliothèque de fichiers**
2. Cliquez sur **Télécharger** ou faites glisser des fichiers vers la zone de téléchargement
3. Formats supportés : `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Le fichier est analysé automatiquement après le téléchargement

:::info Dossier de stockage
Les fichiers sont stockés dans le dossier configuré sous **Paramètres → Bibliothèque de fichiers → Dossier de stockage**. Par défaut : `./data/library/`
:::

### Téléchargement en lot

Faites glisser et déposez un dossier entier pour télécharger tous les fichiers supportés en une fois. Les fichiers sont traités en arrière-plan et vous êtes notifié quand tout est prêt.

## Analyse G-code

Après le téléchargement, les fichiers `.gcode` et `.bgcode` sont automatiquement analysés :

| Métrique | Description |
|----------|-------------|
| Temps d'impression estimé | Temps calculé depuis les commandes G-code |
| Consommation de filament | Grammes et mètres par matériau/couleur |
| Compteur de couches | Nombre total de couches |
| Épaisseur de couche | Épaisseur de couche enregistrée |
| Matériaux | Matériaux détectés (PLA, PETG, etc.) |
| Pourcentage de remplissage | Si disponible dans les métadonnées |
| Matériau de support | Poids de support estimé |
| Modèle d'imprimante | Imprimante cible depuis les métadonnées |

Les données d'analyse s'affichent dans la fiche du fichier et sont utilisées par l'[Estimateur de coûts](../analyse/costestimator).

## Fiches de fichiers et métadonnées

Chaque fiche de fichier affiche :
- **Nom du fichier** et format
- **Date de téléchargement**
- **Miniature** (depuis `.3mf` ou générée)
- **Temps d'impression analysé** et consommation de filament
- **Tags** et catégorie
- **Impressions associées** — nombre de fois imprimé

Cliquez sur une fiche pour ouvrir la vue détaillée avec toutes les métadonnées et l'historique.

## Organisation

### Tags

Ajoutez des tags pour une recherche facile :
1. Cliquez sur le fichier → **Modifier les métadonnées**
2. Saisissez des tags (séparés par des virgules) : `benchy, test, PLA, calibration`
3. Recherchez dans la bibliothèque avec le filtre de tags

### Catégories

Organisez les fichiers en catégories :
- Cliquez sur **Nouvelle catégorie** dans le panneau latéral
- Faites glisser les fichiers vers la catégorie
- Les catégories peuvent être imbriquées (sous-catégories supportées)

## Connexion à MakerWorld

1. Accédez à **Paramètres → Intégrations → MakerWorld**
2. Connectez-vous avec votre compte Bambu Lab
3. De retour dans la bibliothèque : cliquez sur un fichier → **Connecter à MakerWorld**
4. Recherchez le modèle sur MakerWorld et sélectionnez la bonne correspondance
5. Les métadonnées (designer, licence, note) sont importées depuis MakerWorld

La connexion affiche le nom du designer et l'URL originale sur la fiche du fichier.

## Connexion à Printables

1. Accédez à **Paramètres → Intégrations → Printables**
2. Collez votre clé API Printables
3. Connectez les fichiers aux modèles Printables de la même manière que MakerWorld

## Envoyer à l'imprimante

Depuis la bibliothèque de fichiers, vous pouvez envoyer directement à l'imprimante :

1. Cliquez sur le fichier → **Envoyer à l'imprimante**
2. Sélectionnez l'imprimante cible
3. Sélectionnez les emplacements AMS (pour les impressions multicolores)
4. Cliquez sur **Démarrer l'impression** ou **Ajouter à la file**

:::warning Envoi direct
L'envoi direct démarre l'impression immédiatement sans confirmation dans Bambu Studio. Assurez-vous que l'imprimante est prête.
:::
