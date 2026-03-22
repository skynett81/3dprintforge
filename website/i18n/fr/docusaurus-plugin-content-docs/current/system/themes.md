---
sidebar_position: 4
title: Thème
description: Personnalisez l'apparence de Bambu Dashboard avec les modes clair/sombre/automatique, 6 palettes de couleurs et une couleur d'accentuation personnalisée
---

# Thème

Bambu Dashboard dispose d'un système de thèmes flexible qui vous permet de personnaliser l'apparence selon vos goûts et votre contexte d'utilisation.

Accédez à : **https://localhost:3443/#settings** → **Thème**

## Mode de couleur

Choisissez parmi trois modes :

| Mode | Description |
|---|---|
| **Clair** | Fond clair, texte sombre — adapté aux pièces bien éclairées |
| **Sombre** | Fond sombre, texte clair — standard et recommandé pour la surveillance |
| **Automatique** | Suit le réglage du système d'exploitation (OS clair/sombre) |

Changez de mode en haut des paramètres de thème ou via le raccourci dans la barre de navigation (icône lune/soleil).

## Palettes de couleurs

Six palettes de couleurs prédéfinies sont disponibles :

| Palette | Couleur principale | Style |
|---|---|---|
| **Bambu** | Vert (#00C853) | Standard, inspiré de Bambu Lab |
| **Nuit bleue** | Bleu (#2196F3) | Calme et professionnel |
| **Coucher de soleil** | Orange (#FF6D00) | Chaud et énergique |
| **Violet** | Violet (#9C27B0) | Créatif et distinctif |
| **Rouge** | Rouge (#F44336) | Contraste élevé, accrocheur |
| **Monochrome** | Gris (#607D8B) | Neutre et minimaliste |

Cliquez sur une palette pour la prévisualiser et l'activer immédiatement.

## Couleur d'accentuation personnalisée

Utilisez votre propre couleur comme couleur d'accentuation :

1. Cliquez sur **Couleur personnalisée** sous le sélecteur de palette
2. Utilisez le sélecteur de couleur ou entrez un code hexadécimal (ex. `#FF5722`)
3. L'aperçu se met à jour en temps réel
4. Cliquez sur **Appliquer** pour activer

:::tip Contraste
Assurez-vous que la couleur d'accentuation présente un bon contraste par rapport à l'arrière-plan. Le système vous avertit si la couleur peut poser des problèmes de lisibilité (standard WCAG AA).
:::

## Arrondi

Ajustez l'arrondi des boutons, des fiches et des éléments :

| Paramètre | Description |
|---|---|
| **Net** | Aucun arrondi (style rectangulaire) |
| **Petit** | Arrondi subtil (4 px) |
| **Moyen** | Arrondi standard (8 px) |
| **Grand** | Arrondi prononcé (16 px) |
| **Pilule** | Arrondi maximal (50 px) |

Faites glisser le curseur pour ajuster manuellement entre 0–50 px.

## Compacité

Personnalisez la densité de l'interface :

| Paramètre | Description |
|---|---|
| **Aéré** | Plus d'espace entre les éléments |
| **Standard** | Équilibré, réglage par défaut |
| **Compact** | Emballage plus serré — plus d'informations à l'écran |

Le mode compact est recommandé pour les écrans en dessous de 1080p ou l'affichage kiosque.

## Typographie

Choisissez la police :

- **Système** — utilise la police par défaut du système d'exploitation (chargement rapide)
- **Inter** — claire et moderne (choix par défaut)
- **JetBrains Mono** — monospace, idéale pour les valeurs numériques
- **Nunito** — style plus doux et arrondi

## Animations

Désactivez ou personnalisez les animations :

- **Complètes** — toutes les transitions et animations actives (par défaut)
- **Réduites** — uniquement les animations nécessaires (respecte la préférence du système d'exploitation)
- **Désactivées** — aucune animation pour des performances maximales

:::tip Mode kiosque
Pour l'affichage kiosque, activez **Compact** + **Sombre** + **Animations réduites** pour des performances optimales et une lisibilité à distance. Consultez [Mode kiosque](./kiosk).
:::

## Export et import des paramètres de thème

Partagez votre thème avec d'autres :

1. Cliquez sur **Exporter le thème** — télécharge un fichier `.json`
2. Partagez le fichier avec d'autres utilisateurs de Bambu Dashboard
3. Ils importent via **Importer le thème** → sélectionnez le fichier
