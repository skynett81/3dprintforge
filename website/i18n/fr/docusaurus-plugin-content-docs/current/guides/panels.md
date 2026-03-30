---
sidebar_position: 8
title: Naviguer dans le tableau de bord
description: Apprenez à naviguer dans Bambu Dashboard — barre latérale, panneaux, raccourcis clavier et personnalisation
---

# Naviguer dans le tableau de bord

Ce guide vous donne une introduction rapide à l'organisation du tableau de bord et à la navigation efficace.

## La barre latérale

La barre latérale à gauche est votre centre de navigation. Elle est organisée en sections :

```
┌────────────────────┐
│ 🖨  Statut imprim. │  ← Une ligne par imprimante
├────────────────────┤
│ Vue d'ensemble     │
│ Flotte             │
│ Impression active  │
├────────────────────┤
│ Filament           │
│ Historique         │
│ Projets            │
│ File d'attente     │
│ Planificateur      │
├────────────────────┤
│ Surveillance       │
│  └ Print Guard     │
│  └ Erreurs         │
│  └ Diagnostic      │
│  └ Maintenance     │
├────────────────────┤
│ Analyse            │
│ Outils             │
│ Intégrations       │
│ Système            │
├────────────────────┤
│ ⚙ Paramètres      │
└────────────────────┘
```

**La barre latérale peut être masquée** en cliquant sur l'icône hamburger (☰) en haut à gauche. Utile sur les petits écrans ou en mode kiosque.

## Le panneau principal

Lorsque vous cliquez sur un élément dans la barre latérale, le contenu s'affiche dans le panneau principal à droite. La mise en page varie :

| Panneau | Mise en page |
|---------|-------------|
| Vue d'ensemble | Grille de cartes avec toutes les imprimantes |
| Impression active | Grande carte de détail + courbes de température |
| Historique | Tableau filtrable |
| Filament | Vue en cartes avec bobines |
| Analyse | Graphiques et diagrammes |

## Cliquer sur le statut de l'imprimante pour les détails

La carte d'imprimante dans le panneau de vue d'ensemble est cliquable :

**Clic simple** → Ouvre le panneau de détail pour cette imprimante :
- Températures en temps réel
- Impression active (si en cours)
- Statut AMS avec tous les emplacements
- Dernières erreurs et événements
- Boutons rapides : Pause, Arrêt, Lumière allumée/éteinte

**Clic sur l'icône de caméra** → Ouvre la vue caméra en direct

**Clic sur l'icône ⚙** → Paramètres de l'imprimante

## Raccourci clavier — palette de commandes

La palette de commandes offre un accès rapide à toutes les fonctions sans naviguer :

| Raccourci | Action |
|-----------|--------|
| `Ctrl + K` (Linux/Windows) | Ouvrir la palette de commandes |
| `Cmd + K` (macOS) | Ouvrir la palette de commandes |
| `Échap` | Fermer la palette |

Dans la palette de commandes, vous pouvez :
- Rechercher des pages et des fonctions
- Démarrer une impression directement
- Mettre en pause / reprendre les impressions actives
- Changer le thème (clair/sombre)
- Naviguer vers n'importe quelle page

**Exemple :** Appuyez sur `Ctrl+K`, tapez « pause » → sélectionnez « Mettre en pause toutes les impressions actives »

## Personnalisation des widgets

Le panneau de vue d'ensemble peut être personnalisé avec des widgets de votre choix :

**Pour modifier le tableau de bord :**
1. Cliquez sur **Modifier la mise en page** (icône crayon) en haut à droite du panneau de vue d'ensemble
2. Faites glisser les widgets à la position souhaitée
3. Cliquez et faites glisser le coin d'un widget pour modifier la taille
4. Cliquez sur **+ Ajouter un widget** pour en ajouter de nouveaux :

Widgets disponibles :

| Widget | Affiche |
|--------|---------|
| Statut des imprimantes | Cartes pour toutes les imprimantes |
| Impression active (grande) | Vue détaillée de l'impression en cours |
| Vue d'ensemble AMS | Tous les emplacements et niveaux de filament |
| Courbe de température | Graphique en temps réel |
| Prix de l'électricité | Graphique de prix sur 24 heures |
| Jauge filament | Consommation totale des 30 derniers jours |
| Raccourci historique | 5 dernières impressions |
| Flux caméra | Image caméra en direct |

5. Cliquez sur **Enregistrer la mise en page**

:::tip Enregistrer plusieurs mises en page
Vous pouvez avoir différentes mises en page pour différents usages — une compacte pour l'usage quotidien, une grande pour afficher sur un grand écran. Basculez entre elles avec le sélecteur de mise en page.
:::

## Thème — basculer entre clair et sombre

**Changement rapide :**
- Cliquer sur l'icône soleil/lune en haut à droite dans la navigation
- Ou : `Ctrl+K` → taper « thème »

**Paramètre permanent :**
1. Allez dans **Système → Thèmes**
2. Choisissez entre :
   - **Clair** — fond blanc
   - **Sombre** — fond sombre (recommandé le soir)
   - **Automatique** — suit le paramètre système de votre appareil
3. Choisissez la couleur d'accent (bleu, vert, violet, etc.)
4. Cliquez sur **Enregistrer**

## Navigation au clavier

Pour une navigation efficace sans souris :

| Raccourci | Action |
|-----------|--------|
| `Tab` | Élément interactif suivant |
| `Maj+Tab` | Élément précédent |
| `Entrée` / `Espace` | Activer un bouton/lien |
| `Échap` | Fermer modal/liste déroulante |
| `Ctrl+K` | Palette de commandes |
| `Alt+1` – `Alt+9` | Naviguer directement vers les 9 premières pages |

## PWA — installer comme application

Bambu Dashboard peut être installé comme Progressive Web App (PWA) et fonctionner comme une application autonome sans menus de navigateur :

1. Ouvrez le tableau de bord dans Chrome, Edge ou Safari
2. Cliquez sur l'icône **Installer l'application** dans la barre d'adresse
3. Confirmez l'installation

Voir la [documentation PWA](../system/pwa) pour plus de détails.

## Mode kiosque

Le mode kiosque masque toute la navigation et n'affiche que le tableau de bord — parfait pour un écran dédié dans l'atelier d'impression :

1. Allez dans **Système → Kiosque**
2. Activez le **Mode kiosque**
3. Choisissez quels widgets afficher
4. Définissez l'intervalle de mise à jour

Voir la [documentation du mode kiosque](../system/kiosk) pour la configuration complète.
