---
sidebar_position: 2
title: Tableau de bord principal
description: Vue en temps réel de l'imprimante active avec visualisation 3D, statut AMS, caméra et widgets personnalisables
---

# Tableau de bord principal

Le tableau de bord principal est le centre de contrôle central de Bambu Dashboard. Il affiche le statut en temps réel de l'imprimante sélectionnée et vous permet de surveiller, contrôler et personnaliser l'affichage selon vos besoins.

Accédez à : **https://localhost:3443/**

## Vue en temps réel

Lorsqu'une imprimante est active, toutes les valeurs se mettent à jour en continu via MQTT :

- **Température de la buse** — jauge circulaire SVG animée avec température cible
- **Température du plateau** — jauge circulaire similaire pour le plateau de construction
- **Pourcentage de progression** — grand indicateur de pourcentage avec temps restant
- **Compteur de couches** — couche actuelle / nombre total de couches
- **Vitesse** — Silencieux / Standard / Sport / Turbo avec curseur

:::tip Mise à jour en temps réel
Toutes les valeurs sont mises à jour directement depuis l'imprimante via MQTT sans rechargement de page. Le délai est typiquement inférieur à 1 seconde.
:::

## Visualisation de modèle 3D

Si l'imprimante envoie un fichier `.3mf` avec le modèle, un aperçu 3D interactif s'affiche :

1. Le modèle se charge automatiquement au démarrage d'une impression
2. Faites pivoter le modèle en faisant glisser la souris
3. Faites défiler pour zoomer/dézoomer
4. Cliquez sur **Réinitialiser** pour revenir à la vue par défaut

:::info Compatibilité
La visualisation 3D nécessite que l'imprimante envoie les données du modèle. Tous les travaux d'impression ne l'incluent pas.
:::

## Statut AMS

Le panneau AMS affiche toutes les unités AMS montées avec leurs emplacements et filaments :

- **Couleur de l'emplacement** — représentation visuelle de la couleur depuis les métadonnées Bambu
- **Nom du filament** — matériau et marque
- **Emplacement actif** — marqué par une animation pulsée pendant l'impression
- **Erreurs** — indicateur rouge en cas d'erreur AMS (blocage, vide, humide)

Cliquez sur un emplacement pour voir les informations complètes sur le filament et l'associer au stock de filament.

## Flux caméra

La visualisation caméra en direct est convertie via ffmpeg (RTSPS → MPEG1) :

1. La caméra démarre automatiquement à l'ouverture du tableau de bord
2. Cliquez sur l'image de la caméra pour ouvrir en plein écran
3. Utilisez le bouton **Capture** pour prendre une image fixe
4. Cliquez sur **Masquer la caméra** pour libérer de l'espace

:::warning Performance
Le flux caméra utilise environ 2 à 5 Mbit/s. Désactivez la caméra sur les connexions réseau lentes.
:::

## Graphiques sparkline de température

Sous le panneau AMS s'affichent des mini-graphiques (sparklines) pour les 30 dernières minutes :

- Température de la buse dans le temps
- Température du plateau dans le temps
- Température de la chambre (si disponible)

Cliquez sur un graphique sparkline pour ouvrir la vue complète des graphiques de télémétrie.

## Personnalisation des widgets

Le tableau de bord utilise une grille glisser-déposer (disposition en grille) :

1. Cliquez sur **Personnaliser la disposition** (icône crayon en haut à droite)
2. Faites glisser les widgets vers la position souhaitée
3. Redimensionnez en faisant glisser le coin
4. Cliquez sur **Verrouiller la disposition** pour figer le placement
5. Cliquez sur **Enregistrer** pour conserver la configuration

Widgets disponibles :
| Widget | Description |
|--------|-------------|
| Caméra | Vue caméra en direct |
| AMS | Statut des bobines et filaments |
| Température | Jauges circulaires pour buse et plateau |
| Progression | Indicateur de pourcentage et estimation du temps |
| Télémétrie | Ventilateurs, pression, vitesse |
| Modèle 3D | Visualisation interactive du modèle |
| Sparklines | Mini-graphiques de température |

:::tip Enregistrement
La disposition est enregistrée par utilisateur dans le navigateur (localStorage). Différents utilisateurs peuvent avoir des configurations différentes.
:::
