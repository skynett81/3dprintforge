---
sidebar_position: 7
title: Timelapse
description: Activez l'enregistrement automatique de timelapse pour les impressions 3D, gérez les vidéos et lisez-les directement dans le tableau de bord
---

# Timelapse

3DPrintForge peut automatiquement prendre des photos pendant l'impression et les assembler en une vidéo timelapse. Les vidéos sont stockées localement et peuvent être lues directement dans le tableau de bord.

Accédez à : **https://localhost:3443/#timelapse**

## Activation

1. Accédez à **Paramètres → Timelapse**
2. Activez **Activer l'enregistrement timelapse**
3. Sélectionnez le **Mode d'enregistrement** :
   - **Par couche** — une image par couche (recommandé pour la haute qualité)
   - **Basé sur le temps** — une image toutes les N secondes (ex. toutes les 30 secondes)
4. Choisissez les imprimantes pour lesquelles le timelapse est activé
5. Cliquez sur **Enregistrer**

:::tip Intervalle d'images
« Par couche » donne l'animation la plus fluide car le mouvement est constant. « Basé sur le temps » utilise moins d'espace de stockage.
:::

## Paramètres d'enregistrement

| Paramètre | Valeur par défaut | Description |
|-----------|-------------------|-------------|
| Résolution | 1280×720 | Taille de l'image (640×480 / 1280×720 / 1920×1080) |
| Qualité d'image | 85 % | Qualité de compression JPEG |
| FPS de la vidéo | 30 | Images par seconde dans la vidéo finale |
| Format vidéo | MP4 (H.264) | Format de sortie |
| Rotation d'image | Désactivé | Rotation 90°/180°/270° selon l'orientation de montage |

:::warning Espace de stockage
Un timelapse avec 500 images en 1080p utilise environ 200 à 400 Mo avant assemblage. La vidéo MP4 finale est typiquement de 20 à 80 Mo.
:::

## Stockage

Les images et vidéos timelapse sont stockées dans `data/timelapse/` sous le dossier du projet. La structure est organisée par imprimante et impression :

```
data/timelapse/
├── <printer-id>/                     ← ID unique de l'imprimante
│   ├── 2026-03-22_nomdumodele/        ← Session d'impression (date_nomdumodele)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Images brutes (supprimées après assemblage)
│   ├── 2026-03-22_nomdumodele.mp4     ← Vidéo timelapse finale
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_supporttelephone.mp4
├── <printer-id-2>/                   ← Plusieurs imprimantes (multi-imprimantes)
│   └── ...
```

:::tip Stockage externe
Pour économiser de l'espace sur le disque système, vous pouvez créer un lien symbolique vers le dossier timelapse sur un disque externe :
```bash
# Exemple : déplacer vers un disque externe monté sur /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Créer un lien symbolique
ln -s /mnt/storage/timelapse data/timelapse
```
Le tableau de bord suit automatiquement le lien symbolique. Vous pouvez utiliser n'importe quel disque ou partage réseau.
:::

## Assemblage automatique

Lorsque l'impression est terminée, les images sont automatiquement assemblées en vidéo avec ffmpeg :

1. 3DPrintForge reçoit l'événement « impression terminée » depuis MQTT
2. ffmpeg est appelé avec les images collectées
3. La vidéo est sauvegardée dans le dossier de stockage
4. La page timelapse se met à jour avec la nouvelle vidéo

Vous pouvez suivre la progression sous l'onglet **Timelapse → En traitement**.

## Lecture

1. Accédez à **https://localhost:3443/#timelapse**
2. Sélectionnez une imprimante dans la liste déroulante
3. Cliquez sur une vidéo dans la liste pour la lire
4. Utilisez les commandes de lecture :
   - ▶ / ⏸ — Lecture / Pause
   - ⏪ / ⏩ — Rembobiner / Avancer rapidement
   - Boutons de vitesse : 0.5× / 1× / 2× / 4×
5. Cliquez sur **Plein écran** pour ouvrir en plein écran
6. Cliquez sur **Télécharger** pour télécharger le fichier MP4

## Supprimer un timelapse

1. Sélectionnez la vidéo dans la liste
2. Cliquez sur **Supprimer** (icône corbeille)
3. Confirmez dans la boîte de dialogue

:::danger Suppression permanente
Les vidéos timelapse et les images brutes supprimées ne peuvent pas être récupérées. Téléchargez la vidéo d'abord si vous souhaitez la conserver.
:::

## Partager un timelapse

Les vidéos timelapse peuvent être partagées via un lien à durée limitée :

1. Sélectionnez la vidéo et cliquez sur **Partager**
2. Définissez la durée d'expiration (1 heure / 24 heures / 7 jours / sans expiration)
3. Copiez le lien généré et partagez-le
4. Le destinataire n'a pas besoin de se connecter pour voir la vidéo
