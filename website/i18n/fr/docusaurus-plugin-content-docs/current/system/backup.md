---
sidebar_position: 2
title: Sauvegarde
description: Créez, restaurez et planifiez des sauvegardes automatiques des données de Bambu Dashboard
---

# Sauvegarde

Bambu Dashboard peut sauvegarder toute la configuration, l'historique et les données pour vous permettre de restaurer facilement en cas de panne système, de migration de serveur ou de problèmes de mise à jour.

Accédez à : **https://localhost:3443/#settings** → **Système → Sauvegarde**

## Contenu d'une sauvegarde

| Type de données | Inclus | Remarque |
|---|---|---|
| Configuration des imprimantes | ✅ | |
| Historique d'impression | ✅ | |
| Stock de filaments | ✅ | |
| Utilisateurs et rôles | ✅ | Mots de passe stockés hachés |
| Paramètres | ✅ | Incl. configurations des notifications |
| Journal de maintenance | ✅ | |
| Projets et factures | ✅ | |
| Bibliothèque de fichiers (métadonnées) | ✅ | |
| Bibliothèque de fichiers (fichiers) | Facultatif | Peut être volumineuse |
| Vidéos timelapse | Facultatif | Peut être très volumineuse |
| Images de la galerie | Facultatif | |

## Créer une sauvegarde manuelle

1. Accédez à **Paramètres → Sauvegarde**
2. Sélectionnez ce qui doit être inclus (voir le tableau ci-dessus)
3. Cliquez sur **Créer une sauvegarde maintenant**
4. Un indicateur de progression s'affiche pendant la création de la sauvegarde
5. Cliquez sur **Télécharger** une fois la sauvegarde terminée

La sauvegarde est enregistrée sous forme de fichier `.zip` avec un horodatage dans le nom :
```
bambu-dashboard-backup-2026-03-22T14-30-00.zip
```

## Télécharger une sauvegarde

Les fichiers de sauvegarde sont stockés dans le dossier de sauvegarde sur le serveur (configurable). Vous pouvez également les télécharger directement :

1. Accédez à **Sauvegarde → Sauvegardes existantes**
2. Trouvez la sauvegarde dans la liste (triée par date)
3. Cliquez sur **Télécharger** (icône de téléchargement)

:::info Dossier de stockage
Dossier de stockage par défaut : `./data/backups/`. Modifiez-le sous **Paramètres → Sauvegarde → Dossier de stockage**.
:::

## Sauvegarde automatique planifiée

1. Activez **Sauvegarde automatique** sous **Sauvegarde → Planification**
2. Choisissez l'intervalle :
   - **Quotidienne** — s'exécute à 03h00 (configurable)
   - **Hebdomadaire** — un jour et une heure spécifiques
   - **Mensuelle** — premier jour du mois
3. Sélectionnez le **Nombre de sauvegardes à conserver** (ex. 7 — les plus anciennes sont supprimées automatiquement)
4. Cliquez sur **Enregistrer**

:::tip Stockage externe
Pour les données importantes : montez un disque externe ou un disque réseau comme dossier de stockage des sauvegardes. Les sauvegardes survivront ainsi même si le disque système tombe en panne.
:::

## Restaurer depuis une sauvegarde

:::warning La restauration écrase les données existantes
La restauration remplace toutes les données existantes par le contenu du fichier de sauvegarde. Assurez-vous d'avoir une sauvegarde récente des données actuelles au préalable.
:::

### Depuis une sauvegarde existante sur le serveur

1. Accédez à **Sauvegarde → Sauvegardes existantes**
2. Trouvez la sauvegarde dans la liste
3. Cliquez sur **Restaurer**
4. Confirmez dans la boîte de dialogue
5. Le système redémarre automatiquement après la restauration

### Depuis un fichier de sauvegarde téléchargé

1. Cliquez sur **Importer une sauvegarde**
2. Sélectionnez le fichier `.zip` depuis votre ordinateur
3. Le fichier est validé — vous voyez ce qui est inclus
4. Cliquez sur **Restaurer depuis le fichier**
5. Confirmez dans la boîte de dialogue

## Validation des sauvegardes

Bambu Dashboard valide tous les fichiers de sauvegarde avant la restauration :

- Vérifie que le format ZIP est valide
- Vérifie que le schéma de base de données est compatible avec la version actuelle
- Affiche un avertissement si la sauvegarde provient d'une version antérieure (la migration sera effectuée automatiquement)
