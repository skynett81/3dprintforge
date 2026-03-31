---
sidebar_position: 2
title: Journal d'erreurs
description: Vue d'ensemble complète des codes d'erreur HMS des imprimantes avec niveau de gravité, recherche et liens vers le wiki Bambu
---

# Journal d'erreurs

Le journal d'erreurs rassemble toutes les erreurs et alertes HMS (Health, Maintenance, Safety) de vos imprimantes. 3DPrintForge dispose d'une base de données intégrée de 269+ codes HMS pour les imprimantes Bambu Lab.

Accédez à : **https://localhost:3443/#errors**

## Codes HMS

Les imprimantes Bambu Lab envoient des codes HMS via MQTT lorsqu'un problème survient. 3DPrintForge les traduit automatiquement en messages d'erreur lisibles :

| Code | Exemple | Catégorie |
|------|---------|-----------|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Buse/extrudeur |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Plateau de construction |
| `0700 0500 0001 0001` | MC disconnect | Électronique |

La liste complète couvre tous les 269+ codes connus pour X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D et H2C.

## Niveau de gravité

Les erreurs sont classées en quatre niveaux :

| Niveau | Couleur | Description |
|--------|---------|-------------|
| **Critique** | Rouge | Nécessite une action immédiate — impression arrêtée |
| **Haute** | Orange | Doit être traité rapidement — l'impression peut continuer |
| **Moyenne** | Jaune | Doit être investigué — pas de danger immédiat |
| **Info** | Bleu | Message d'information, aucune action requise |

## Recherche et filtrage

Utilisez la barre d'outils en haut du journal d'erreurs :

1. **Recherche en texte libre** — recherchez dans le message d'erreur, le code HMS ou la description de l'imprimante
2. **Imprimante** — affichez les erreurs d'une seule imprimante
3. **Catégorie** — AMS / Buse / Plateau / Électronique / Calibration / Autre
4. **Gravité** — Tous / Critique / Haute / Moyenne / Info
5. **Date** — filtrez par période de dates
6. **Non acquittées** — affichez uniquement les erreurs non acquittées

Cliquez sur **Réinitialiser le filtre** pour voir toutes les erreurs.

## Liens vers le wiki

Pour chaque code HMS, un lien vers le wiki Bambu Lab s'affiche avec :

- Description complète de l'erreur
- Causes possibles
- Guide de dépannage étape par étape
- Recommandations officielles de Bambu Lab

Cliquez sur **Ouvrir le wiki** sur une entrée d'erreur pour ouvrir la page wiki correspondante dans un nouvel onglet.

:::tip Copie locale
3DPrintForge met en cache le contenu du wiki localement pour une utilisation hors ligne. Le contenu est mis à jour automatiquement chaque semaine.
:::

## Acquitter les erreurs

L'acquittement marque une erreur comme traitée sans la supprimer :

1. Cliquez sur une erreur dans la liste
2. Cliquez sur **Acquitter** (icône coche)
3. Saisissez une note optionnelle sur ce qui a été fait
4. L'erreur est marquée d'une coche et déplacée dans la liste « Acquittées »

### Acquittement en masse

1. Sélectionnez plusieurs erreurs avec les cases à cocher
2. Cliquez sur **Acquitter la sélection**
3. Toutes les erreurs sélectionnées sont acquittées simultanément

## Statistiques

En haut du journal d'erreurs s'affichent :

- Nombre total d'erreurs sur les 30 derniers jours
- Nombre d'erreurs non acquittées
- Code HMS le plus fréquent
- Imprimante avec le plus d'erreurs

## Export

1. Cliquez sur **Exporter** (icône téléchargement)
2. Sélectionnez le format : **CSV** ou **JSON**
3. Le filtre est appliqué à l'export — définissez d'abord le filtre souhaité
4. Le fichier est téléchargé automatiquement

## Notifications pour les nouvelles erreurs

Activez les notifications pour les nouvelles erreurs HMS :

1. Accédez à **Paramètres → Notifications**
2. Cochez **Nouvelles erreurs HMS**
3. Sélectionnez le niveau de gravité minimum pour la notification (recommandé : **Haute** et plus)
4. Choisissez le canal de notification

Voir [Notifications](../features/notifications) pour la configuration des canaux.
