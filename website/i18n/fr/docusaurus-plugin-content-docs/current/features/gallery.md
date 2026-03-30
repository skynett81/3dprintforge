---
sidebar_position: 8
title: Galerie
description: Consultez les captures d'écran automatiques prises à 25, 50, 75 et 100 % de progression pour toutes les impressions
---

# Galerie

La galerie rassemble les captures d'écran automatiques prises au cours de chaque impression. Les images sont capturées à des jalons fixes et vous offrent un journal visuel de l'évolution de l'impression.

Accédez à : **https://localhost:3443/#gallery**

## Captures d'écran aux jalons

Bambu Dashboard prend automatiquement une capture d'écran depuis la caméra aux jalons suivants :

| Jalon | Moment |
|-------|--------|
| **25 %** | Un quart de l'impression |
| **50 %** | À mi-chemin |
| **75 %** | Trois quarts de l'impression |
| **100 %** | Impression terminée |

Les captures d'écran sont enregistrées et associées à l'entrée correspondante de l'historique d'impression, puis affichées dans la galerie.

:::info Prérequis
Les captures d'écran aux jalons nécessitent que la caméra soit connectée et active. Les caméras désactivées ne génèrent pas d'images.
:::

## Activer la fonction de capture

1. Accédez à **Paramètres → Galerie**
2. Activez **Captures d'écran automatiques aux jalons**
3. Choisissez les jalons à activer (les quatre sont activés par défaut)
4. Sélectionnez la **Qualité d'image** : Basse (640×360) / Moyenne (1280×720) / Haute (1920×1080)
5. Cliquez sur **Enregistrer**

## Affichage des images

La galerie est organisée par impression :

1. Utilisez le **filtre** en haut pour sélectionner l'imprimante, la date ou le nom de fichier
2. Cliquez sur une ligne d'impression pour la développer et voir les quatre images
3. Cliquez sur une image pour ouvrir l'aperçu

### Aperçu

L'aperçu affiche :
- Image en taille réelle
- Jalon et horodatage
- Nom de l'impression et imprimante
- **←** / **→** pour naviguer entre les images de la même impression

## Affichage plein écran

Cliquez sur **Plein écran** (ou appuyez sur `F`) dans l'aperçu pour remplir tout l'écran. Utilisez les touches fléchées pour naviguer entre les images.

## Télécharger les images

- **Image unique** : Cliquez sur **Télécharger** dans l'aperçu
- **Toutes les images d'une impression** : Cliquez sur **Tout télécharger** sur la ligne d'impression — vous obtenez un fichier `.zip`
- **Sélection multiple** : Cochez les cases et cliquez sur **Télécharger la sélection**

## Supprimer les images

:::warning Espace de stockage
Les images de la galerie peuvent prendre une place considérable au fil du temps. Configurez la suppression automatique des anciennes images.
:::

### Suppression manuelle

1. Sélectionnez une ou plusieurs images (cochez)
2. Cliquez sur **Supprimer la sélection**
3. Confirmez dans la boîte de dialogue

### Nettoyage automatique

1. Accédez à **Paramètres → Galerie → Nettoyage automatique**
2. Activez **Supprimer les images antérieures à**
3. Définissez le nombre de jours (ex. 90 jours)
4. Le nettoyage s'exécute automatiquement chaque nuit à 03h00

## Lien avec l'historique d'impression

Chaque image est liée à une entrée d'impression dans l'historique :

- Cliquez sur **Voir dans l'historique** sur une impression dans la galerie pour accéder à l'entrée d'historique correspondante
- Dans l'historique, une miniature de l'image à 100 % s'affiche si elle est disponible

## Partage

Partagez une image de la galerie via un lien à durée limitée :

1. Ouvrez l'image dans l'aperçu
2. Cliquez sur **Partager**
3. Choisissez la durée d'expiration et copiez le lien
