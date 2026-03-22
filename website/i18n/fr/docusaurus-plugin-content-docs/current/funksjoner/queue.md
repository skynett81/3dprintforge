---
sidebar_position: 5
title: File d'impression
description: Planifiez et automatisez les impressions avec une file prioritaire, dispatch automatique et démarrage décalé
---

# File d'impression

La file d'impression vous permet de planifier des impressions à l'avance et de les envoyer automatiquement aux imprimantes disponibles lorsqu'elles sont inactives.

Accédez à : **https://localhost:3443/#queue**

## Créer une file

1. Accédez à **File d'impression** dans le menu de navigation
2. Cliquez sur **Nouvelle tâche** (icône +)
3. Renseignez :
   - **Nom de fichier** — téléchargez un fichier `.3mf` ou `.gcode`
   - **Imprimante cible** — sélectionnez une imprimante spécifique ou **Automatique**
   - **Priorité** — Basse / Normale / Haute / Critique
   - **Démarrage planifié** — maintenant ou à une date/heure précise
4. Cliquez sur **Ajouter à la file**

:::tip Glisser-déposer
Vous pouvez faire glisser des fichiers directement depuis l'explorateur de fichiers vers la page de file pour les ajouter rapidement.
:::

## Ajouter des fichiers

### Télécharger un fichier

1. Cliquez sur **Télécharger** ou faites glisser un fichier vers la zone de téléchargement
2. Formats supportés : `.3mf`, `.gcode`, `.bgcode`
3. Le fichier est enregistré dans la bibliothèque de fichiers et lié à la tâche de file

### Depuis la bibliothèque de fichiers

1. Accédez à **Bibliothèque de fichiers** et trouvez le fichier
2. Cliquez sur **Ajouter à la file** sur le fichier
3. La tâche est créée avec les paramètres par défaut — modifiez si nécessaire

### Depuis l'historique

1. Ouvrez une impression précédente dans **Historique**
2. Cliquez sur **Réimprimer**
3. La tâche est ajoutée avec les mêmes paramètres que la dernière fois

## Priorité

La file est traitée par ordre de priorité :

| Priorité | Couleur | Description |
|----------|---------|-------------|
| Critique | Rouge | Envoyée à la première imprimante disponible indépendamment des autres tâches |
| Haute | Orange | Avant les tâches normales et basses |
| Normale | Bleu | Ordre standard (FIFO) |
| Basse | Gris | Envoyée uniquement quand aucune tâche plus prioritaire n'attend |

Faites glisser les tâches dans la file pour modifier manuellement l'ordre au sein du même niveau de priorité.

## Dispatch automatique

Lorsque le **Dispatch automatique** est activé, Bambu Dashboard surveille toutes les imprimantes et envoie la prochaine tâche automatiquement :

1. Accédez à **Paramètres → File**
2. Activez le **Dispatch automatique**
3. Sélectionnez la **Stratégie de dispatch** :
   - **Première disponible** — envoie à la première imprimante qui se libère
   - **Moins utilisée** — privilégie l'imprimante avec le moins d'impressions aujourd'hui
   - **Round-robin** — alterne équitablement entre toutes les imprimantes

:::warning Confirmation
Activez **Exiger une confirmation** dans les paramètres si vous souhaitez approuver manuellement chaque dispatch avant l'envoi du fichier.
:::

## Démarrage décalé (Staggered start)

Le démarrage décalé est utile pour éviter que toutes les imprimantes démarrent et se terminent en même temps :

1. Dans la boîte de dialogue **Nouvelle tâche**, développez **Paramètres avancés**
2. Activez le **Démarrage décalé**
3. Définissez le **Délai entre les imprimantes** (ex. 30 minutes)
4. Le système répartit automatiquement les heures de démarrage

**Exemple :** 4 tâches identiques avec 30 minutes de délai démarrent à 08h00, 08h30, 09h00 et 09h30.

## Statut et suivi de la file

La vue de la file affiche toutes les tâches avec leur statut :

| Statut | Description |
|--------|-------------|
| En attente | La tâche est en file et attend une imprimante |
| Planifiée | A un heure de démarrage planifiée dans le futur |
| Envoi | Transfert vers l'imprimante |
| En impression | En cours sur l'imprimante sélectionnée |
| Terminée | Achevée — liée à l'historique |
| Échouée | Erreur lors de l'envoi ou pendant l'impression |
| Annulée | Annulée manuellement |

:::info Notifications
Activez les notifications pour les événements de file sous **Paramètres → Notifications → File** pour être informé quand une tâche démarre, se termine ou échoue. Voir [Notifications](./notifications).
:::
