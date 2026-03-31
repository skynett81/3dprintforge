---
sidebar_position: 10
title: Streaming avec OBS
description: Configurer 3DPrintForge comme overlay dans OBS Studio pour un streaming d'impression 3D professionnel
---

# Streamer l'impression 3D avec OBS

3DPrintForge dispose d'un overlay OBS intégré qui affiche le statut de l'imprimante, la progression, les températures et le flux caméra directement dans votre stream.

## Prérequis

- OBS Studio installé ([obsproject.com](https://obsproject.com))
- 3DPrintForge en cours d'exécution et connecté à l'imprimante
- (Optionnel) Caméra Bambu activée pour le flux en direct

## Étape 1 — OBS Browser Source

OBS dispose d'une **Browser Source** intégrée qui affiche une page web directement dans votre scène.

**Ajouter l'overlay dans OBS :**

1. Ouvrez OBS Studio
2. Sous **Sources**, cliquez sur **+**
3. Sélectionnez **Navigateur** (Browser)
4. Donnez un nom à la source, par ex. « Bambu Overlay »
5. Remplissez :

| Paramètre | Valeur |
|-----------|--------|
| URL | `http://localhost:3000/obs/overlay` |
| Largeur | `1920` |
| Hauteur | `1080` |
| FPS | `30` |
| CSS personnalisé | Voir ci-dessous |

6. Cochez **Contrôler l'audio via OBS**
7. Cliquez sur **OK**

:::info Adaptez l'URL à votre serveur
Le tableau de bord fonctionne sur une autre machine qu'OBS ? Remplacez `localhost` par l'adresse IP du serveur, par ex. `http://192.168.1.50:3000/obs/overlay`
:::

## Étape 2 — Fond transparent

Pour que l'overlay s'intègre dans l'image, le fond doit être transparent :

**Dans les paramètres OBS Browser Source :**
- Cochez **Supprimer le fond** (Shutdown source when not visible / Remove background)

**CSS personnalisé pour forcer la transparence :**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Collez ceci dans le champ **CSS personnalisé** dans les paramètres Browser Source.

L'overlay n'affiche plus que le widget lui-même — sans fond blanc ou noir.

## Étape 3 — Personnaliser l'overlay

Dans 3DPrintForge, vous pouvez configurer ce que l'overlay affiche :

1. Allez dans **Fonctionnalités → Overlay OBS**
2. Configurez :

| Paramètre | Options |
|-----------|---------|
| Position | Haut gauche, droite, bas gauche, droite |
| Taille | Petit, moyen, grand |
| Thème | Sombre, clair, transparent |
| Couleur d'accent | Choisir la couleur correspondant au style du stream |
| Éléments | Choisir ce qui s'affiche (voir ci-dessous) |

**Éléments d'overlay disponibles :**

- Nom de l'imprimante et statut (en ligne/impression/erreur)
- Barre de progression avec pourcentage et temps restant
- Filament et couleur
- Température de buse et de plateau
- Filament consommé (grammes)
- Vue d'ensemble AMS (compacte)
- Statut Print Guard

3. Cliquez sur **Aperçu** pour voir le résultat sans basculer vers OBS
4. Cliquez sur **Enregistrer**

:::tip URL par imprimante
Vous avez plusieurs imprimantes ? Utilisez des URL d'overlay séparées :
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Flux caméra dans OBS (source séparée)

La caméra Bambu peut être ajoutée comme source séparée dans OBS — indépendamment de l'overlay :

**Alternative 1 : Via le proxy caméra du tableau de bord**

1. Allez dans **Système → Caméra**
2. Copiez l'**URL de streaming RTSP ou MJPEG**
3. Dans OBS : Cliquez sur **+** → **Source média** (Media Source)
4. Collez l'URL
5. Cochez **Répéter** (Loop) et désactivez les fichiers locaux

**Alternative 2 : Browser Source avec vue caméra**

1. Dans OBS : Ajoutez une **Browser Source**
2. URL : `http://localhost:3000/obs/camera?printer=1`
3. Largeur/hauteur : correspond à la résolution de la caméra (1080p ou 720p)

Vous pouvez maintenant placer le flux caméra librement dans la scène et superposer l'overlay dessus.

## Conseils pour un bon stream

### Composition de la scène de streaming

Une scène typique pour le streaming d'impression 3D :

```
┌─────────────────────────────────────────┐
│                                         │
│      [Flux caméra de l'imprimante]      │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Bas gauche    │
│  │ Imp.: Logo.3mf   │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1h 24m restant   │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Paramètres recommandés

| Paramètre | Valeur recommandée |
|-----------|-------------------|
| Taille de l'overlay | Moyen (pas trop dominant) |
| Fréquence de mise à jour | 30 FPS (correspond à OBS) |
| Position de l'overlay | Bas gauche (évite le visage/chat) |
| Thème de couleur | Sombre avec accent bleu |

### Scènes et changement de scènes

Créez vos propres scènes OBS :

- **« Impression en cours »** — vue caméra + overlay
- **« Pause / en attente »** — image statique + overlay
- **« Terminé »** — image du résultat + overlay affichant « Terminé »

Basculez entre les scènes avec un raccourci clavier dans OBS ou via la collection de scènes.

### Stabilisation de l'image caméra

La caméra Bambu peut parfois se figer. Dans le tableau de bord sous **Système → Caméra** :
- Activez **Auto-reconnexion** — le tableau de bord se reconnecte automatiquement
- Définissez l'**Intervalle de reconnexion** à 10 secondes

### Audio

Les imprimantes 3D font du bruit — surtout l'AMS et le refroidissement. Envisagez :
- Placer le microphone loin de l'imprimante
- Ajouter un filtre de réduction du bruit sur le microphone dans OBS
- Ou utiliser de la musique de fond / l'audio du chat à la place

:::tip Changement de scène automatique
OBS dispose d'une prise en charge intégrée du changement de scène basé sur les titres. Combinez avec un plugin (par ex. obs-websocket) et l'API 3DPrintForge pour changer de scène automatiquement lorsqu'une impression démarre et se termine.
:::
