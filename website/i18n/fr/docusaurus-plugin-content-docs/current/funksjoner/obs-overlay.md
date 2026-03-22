---
sidebar_position: 4
title: Overlay OBS
description: Ajoutez un overlay de statut transparent pour votre imprimante Bambu Lab directement dans OBS Studio
---

# Overlay OBS

L'overlay OBS vous permet d'afficher le statut en temps réel de l'imprimante directement dans OBS Studio — parfait pour le livestreaming ou l'enregistrement d'impressions 3D.

## URL de l'overlay

L'overlay est disponible en tant que page web avec un arrière-plan transparent :

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Remplacez `PRINTER_ID` par l'ID de l'imprimante (disponible sous **Paramètres → Imprimantes**).

### Paramètres disponibles

| Paramètre | Valeur par défaut | Description |
|-----------|-------------------|-------------|
| `printer` | première imprimante | ID d'imprimante à afficher |
| `theme` | `dark` | `dark`, `light` ou `minimal` |
| `scale` | `1.0` | Mise à l'échelle (0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Opacité (0.0–1.0) |
| `fields` | tous | Liste séparée par des virgules : `progress,temp,ams,time` |
| `color` | `#00d4ff` | Couleur d'accent (hex) |

**Exemple avec paramètres :**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Configuration dans OBS Studio

### Étape 1 : Ajouter une source navigateur

1. Ouvrez OBS Studio
2. Cliquez sur **+** sous **Sources**
3. Sélectionnez **Navigateur** (Browser Source)
4. Donnez un nom à la source, ex. `Bambu Overlay`
5. Cliquez sur **OK**

### Étape 2 : Configurer la source navigateur

Renseignez les informations suivantes dans la boîte de dialogue des paramètres :

| Champ | Valeur |
|-------|--------|
| URL | `https://localhost:3443/obs-overlay?printer=VOTRE_ID` |
| Largeur | `400` |
| Hauteur | `200` |
| FPS | `30` |
| CSS personnalisé | *(laisser vide)* |

Cochez :
- ✅ **Désactiver la source quand elle n'est pas visible**
- ✅ **Actualiser le navigateur quand la scène devient active**

:::warning HTTPS et localhost
OBS peut avertir à propos du certificat auto-signé. Accédez d'abord à `https://localhost:3443` dans Chrome/Firefox et acceptez le certificat. OBS utilisera ensuite la même approbation.
:::

### Étape 3 : Arrière-plan transparent

L'overlay est construit avec `background: transparent`. Pour que cela fonctionne dans OBS :

1. Ne cochez **pas** **Couleur d'arrière-plan personnalisée** dans la source navigateur
2. Assurez-vous que l'overlay n'est pas enveloppé dans un élément opaque
3. Définissez de préférence le **Mode de fusion** sur **Normal** pour la source dans OBS

:::tip Alternative : Chroma key
Si la transparence ne fonctionne pas, utilisez le filtre → **Chroma Key** avec un arrière-plan vert :
Ajoutez `&bg=green` dans l'URL, et définissez le filtre chroma key sur la source dans OBS.
:::

## Contenu de l'overlay

L'overlay standard contient :

- **Barre de progression** avec valeur en pourcentage
- **Temps restant** (estimé)
- **Température de la buse** et **température du plateau**
- **Emplacement AMS actif** avec couleur et nom du filament
- **Modèle d'imprimante** et nom (peut être désactivé)

## Mode minimal pour le streaming

Pour un overlay discret pendant le streaming :

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Cela affiche uniquement une petite barre de progression avec le temps restant dans le coin.
