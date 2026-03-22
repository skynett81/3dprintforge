---
sidebar_position: 6
title: Analyse des patterns d'erreurs
description: Analyse basée sur l'IA des patterns d'erreurs, corrélations entre erreurs et facteurs environnementaux, et suggestions d'amélioration concrètes
---

# Analyse des patterns d'erreurs

L'analyse des patterns d'erreurs utilise les données historiques des impressions et des erreurs pour identifier les patterns, les causes et les corrélations — et vous fournit des suggestions d'amélioration concrètes.

Accédez à : **https://localhost:3443/#error-analysis**

## Ce qui est analysé

Le système analyse les points de données suivants :

- Codes d'erreur HMS et horodatages
- Type de filament et fournisseur en cas d'erreur
- Température en cas d'erreur (buse, plateau, chambre)
- Vitesse et profil d'impression
- Heure de la journée et jour de la semaine
- Temps depuis le dernier entretien
- Modèle d'imprimante et version firmware

## Analyse de corrélation

Le système recherche des corrélations statistiques entre les erreurs et les facteurs :

**Exemples de corrélations détectées :**
- « 78 % des erreurs de blocage AMS surviennent avec du filament du fournisseur X »
- « Les obstructions de buse sont 3× plus fréquentes après 6+ heures d'impression continue »
- « Les erreurs d'adhérence augmentent quand la température de chambre est inférieure à 18 °C »
- « Les erreurs de stringing corrèlent avec une humidité supérieure à 60 % (si hygromètre connecté) »

Les corrélations avec une signification statistique (p < 0.05) s'affichent en premier.

:::info Exigences de données
L'analyse est la plus précise avec un minimum de 50 impressions dans l'historique. Avec moins d'impressions, les estimations s'affichent avec une faible confiance.
:::

## Suggestions d'amélioration

Des suggestions concrètes sont générées à partir des analyses :

| Type de suggestion | Exemple |
|-------------------|---------|
| Filament | « Changez de fournisseur pour PA-CF — 3 des 4 erreurs utilisaient FournisseurX » |
| Température | « Augmentez la température du plateau de 5 °C pour PETG — réduction estimée des erreurs d'adhérence de 60 % » |
| Vitesse | « Réduisez la vitesse à 80 % après 4 heures — réduction estimée des obstructions de buse de 45 % » |
| Entretien | « Nettoyez la roue dentée de l'extrudeur — l'usure corrèle avec 40 % des erreurs d'extrusion » |
| Calibration | « Effectuez un nivellement du plateau — 12 des 15 erreurs d'adhérence de la semaine dernière corrèlent avec une mauvaise calibration » |

Chaque suggestion indique :
- Effet estimé (% de réduction des erreurs)
- Confiance (basse / moyenne / haute)
- Mise en œuvre étape par étape
- Lien vers la documentation pertinente

## Impact sur le score de santé

L'analyse est liée au score de santé (voir [Diagnostics](./diagnostics)) :

- Affiche les facteurs qui font le plus baisser le score
- Estime l'amélioration du score en implémentant chaque suggestion
- Priorise les suggestions selon l'amélioration potentielle du score

## Vue chronologique

Accédez à **Analyse d'erreurs → Chronologie** pour voir un aperçu chronologique :

1. Sélectionnez l'imprimante et la période
2. Les erreurs s'affichent comme des points sur la chronologie, codés par couleur selon le type
3. Les lignes horizontales marquent les tâches d'entretien
4. Les clusters d'erreurs (nombreuses erreurs en peu de temps) sont mis en évidence en rouge

Cliquez sur un cluster pour ouvrir l'analyse de cette période spécifique.

## Rapports

Générez un rapport PDF sur l'analyse d'erreurs :

1. Cliquez sur **Générer un rapport**
2. Sélectionnez la période (ex. 90 derniers jours)
3. Choisissez le contenu : corrélations, suggestions, chronologie, score de santé
4. Téléchargez le PDF ou envoyez par e-mail

Les rapports sont enregistrés sous les projets si l'imprimante est liée à un projet.

:::tip Révision hebdomadaire
Configurez un rapport automatique hebdomadaire par e-mail sous **Paramètres → Rapports** pour rester informé sans visiter manuellement le tableau de bord. Voir [Rapports](../system/reports).
:::
