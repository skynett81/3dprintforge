---
sidebar_position: 3
title: Vue de flotte
description: Gérez et surveillez toutes vos imprimantes Bambu Lab dans une grille avec tri, filtrage et statut en temps réel
---

# Vue de flotte

La vue de flotte vous offre un aperçu compact de toutes les imprimantes connectées sur une seule page. Parfaite pour les ateliers, les salles de classe ou quiconque possède plusieurs imprimantes.

Accédez à : **https://localhost:3443/#fleet**

## Grille multi-imprimantes

Toutes les imprimantes enregistrées s'affichent dans une grille responsive :

- **Taille des cartes** — Petite (compacte), Moyenne (standard), Grande (détaillée)
- **Nombre de colonnes** — S'adapte automatiquement à la largeur de l'écran, ou définissez manuellement
- **Mise à jour** — Chaque carte se met à jour indépendamment via MQTT

Chaque carte d'imprimante affiche :
| Champ | Description |
|-------|-------------|
| Nom de l'imprimante | Nom configuré avec icône du modèle |
| Statut | Inactive / En impression / Pause / Erreur / Déconnectée |
| Progression | Barre de pourcentage avec temps restant |
| Température | Buse et plateau (compact) |
| Filament actif | Couleur et matériau depuis l'AMS |
| Miniature caméra | Image fixe mise à jour toutes les 30 secondes |

## Indicateur de statut par imprimante

Les couleurs de statut permettent de voir l'état à distance :

- **Vert pulsé** — Impression en cours
- **Bleu** — Inactive et prête
- **Jaune** — En pause (manuelle ou par Print Guard)
- **Rouge** — Erreur détectée
- **Gris** — Déconnectée ou inaccessible

:::tip Mode kiosque
Utilisez la vue de flotte en mode kiosque sur un écran mural. Voir [Mode kiosque](../system/kiosk) pour la configuration.
:::

## Tri

Cliquez sur **Trier** pour choisir l'ordre :

1. **Nom** — Alphabétique A–Z
2. **Statut** — Imprimantes actives en premier
3. **Progression** — Plus avancée en premier
4. **Dernière activité** — Utilisée le plus récemment en premier
5. **Modèle** — Regroupé par modèle d'imprimante

Le tri est mémorisé jusqu'à la prochaine visite.

## Filtrage

Utilisez le champ de filtre en haut pour restreindre l'affichage :

- Saisissez le nom de l'imprimante ou une partie du nom
- Sélectionnez le **Statut** dans la liste déroulante (Tous / En impression / Inactive / Erreur)
- Sélectionnez le **Modèle** pour afficher uniquement un type d'imprimante (X1C, P1S, A1, etc.)
- Cliquez sur **Réinitialiser le filtre** pour tout afficher

:::info Recherche
La recherche filtre en temps réel sans rechargement de page.
:::

## Actions depuis la vue de flotte

Cliquez avec le bouton droit sur une carte (ou cliquez sur les trois points) pour les actions rapides :

- **Ouvrir le tableau de bord** — Accéder directement au panneau principal de l'imprimante
- **Mettre en pause** — Met l'imprimante en pause
- **Arrêter l'impression** — Annule l'impression en cours (confirmation requise)
- **Voir la caméra** — Ouvre la vue caméra dans un popup
- **Aller aux paramètres** — Ouvre les paramètres de l'imprimante

:::danger Arrêter l'impression
L'arrêt d'une impression est irréversible. Confirmez toujours dans la boîte de dialogue qui s'affiche.
:::

## Statistiques agrégées

En haut de la vue de flotte s'affiche une ligne récapitulative :

- Nombre total d'imprimantes
- Nombre d'impressions actives
- Consommation totale de filament aujourd'hui
- Temps de fin estimé pour l'impression en cours la plus longue
