---
sidebar_position: 9
title: Sauvegarde et restauration
description: Sauvegarde automatique et manuelle de Bambu Dashboard, restauration et migration vers un nouveau serveur
---

# Sauvegarde et restauration

Bambu Dashboard stocke toutes les données localement — historique d'impression, stock de filament, paramètres, utilisateurs et plus encore. Des sauvegardes régulières garantissent que vous ne perdez rien en cas de panne du serveur ou lors d'une migration.

## Que contient une sauvegarde ?

| Données | Inclus | Remarque |
|---------|--------|----------|
| Historique d'impression | Oui | Tous les journaux et statistiques |
| Stock de filament | Oui | Bobines, poids, marques |
| Paramètres | Oui | Tous les paramètres système |
| Configuration d'imprimante | Oui | Adresses IP, codes d'accès |
| Utilisateurs et rôles | Oui | Mots de passe stockés hashés |
| Configuration des notifications | Oui | Tokens Telegram, etc. |
| Images de caméra | Optionnel | Peuvent être de gros fichiers |
| Vidéos timelapse | Optionnel | Exclues par défaut |

## Sauvegarde automatique nocturne

Par défaut, une sauvegarde automatique est effectuée chaque nuit à 03h00.

**Voir et configurer la sauvegarde automatique :**
1. Allez dans **Système → Sauvegarde**
2. Sous **Sauvegarde automatique**, vous voyez :
   - Dernière sauvegarde réussie et heure
   - Prochaine sauvegarde planifiée
   - Nombre de sauvegardes stockées (par défaut : 7 jours)

**Configurer :**
- **Heure** — changer de 03h00 par défaut à une heure qui vous convient
- **Durée de conservation** — nombre de jours pendant lesquels les sauvegardes sont conservées (7, 14, 30 jours)
- **Emplacement de stockage** — dossier local (par défaut) ou chemin externe
- **Compression** — activée par défaut (réduit la taille de 60–80%)

:::info Les fichiers de sauvegarde sont stockés ici par défaut
```
/chemin/vers/bambu-dashboard/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Sauvegarde manuelle

Effectuez une sauvegarde à tout moment :

1. Allez dans **Système → Sauvegarde**
2. Cliquez sur **Sauvegarder maintenant**
3. Attendez que le statut affiche **Terminé**
4. Téléchargez le fichier de sauvegarde en cliquant sur **Télécharger**

**Alternative via terminal :**
```bash
cd /chemin/vers/bambu-dashboard
node scripts/backup.js
```

Le fichier de sauvegarde est stocké dans `data/backups/` avec un horodatage dans le nom de fichier.

## Restaurer depuis une sauvegarde

:::warning La restauration écrase les données existantes
Toutes les données existantes sont remplacées par le contenu du fichier de sauvegarde. Assurez-vous de restaurer à partir du bon fichier.
:::

### Via le tableau de bord

1. Allez dans **Système → Sauvegarde**
2. Cliquez sur **Restaurer**
3. Sélectionnez un fichier de sauvegarde dans la liste ou téléchargez un fichier de sauvegarde depuis le disque
4. Cliquez sur **Restaurer maintenant**
5. Le tableau de bord redémarre automatiquement après la restauration

### Via terminal

```bash
cd /chemin/vers/bambu-dashboard
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Après la restauration, redémarrez le tableau de bord :
```bash
sudo systemctl restart bambu-dashboard
# ou
npm start
```

## Exporter et importer les paramètres

Vous souhaitez simplement conserver les paramètres (sans tout l'historique) ?

**Exporter :**
1. Allez dans **Système → Paramètres → Export**
2. Sélectionnez ce qui doit être inclus :
   - Configuration d'imprimante
   - Configuration des notifications
   - Comptes utilisateurs
   - Marques et profils de filament
3. Cliquez sur **Exporter** — vous téléchargez un fichier `.json`

**Importer :**
1. Allez dans **Système → Paramètres → Import**
2. Téléchargez le fichier `.json`
3. Sélectionnez quelles parties doivent être importées
4. Cliquez sur **Importer**

:::tip Utile lors d'une nouvelle installation
Les paramètres exportés sont pratiques pour un nouveau serveur. Importez-les après la nouvelle installation pour éviter de tout reconfigurer.
:::

## Migrer vers un nouveau serveur

Comment déplacer Bambu Dashboard avec toutes les données vers une nouvelle machine :

### Étape 1 — Créer une sauvegarde sur l'ancien serveur

1. Allez dans **Système → Sauvegarde → Sauvegarder maintenant**
2. Téléchargez le fichier de sauvegarde
3. Copiez le fichier sur le nouveau serveur (USB, scp, partage réseau)

### Étape 2 — Installer sur le nouveau serveur

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Suivez le guide d'installation. Vous n'avez rien à configurer — il suffit de faire fonctionner le tableau de bord.

### Étape 3 — Restaurer la sauvegarde

Lorsque le tableau de bord fonctionne sur le nouveau serveur :

1. Allez dans **Système → Sauvegarde → Restaurer**
2. Téléchargez le fichier de sauvegarde depuis l'ancien serveur
3. Cliquez sur **Restaurer maintenant**

Tout est maintenant en place : historique, stock de filament, paramètres et utilisateurs.

### Étape 4 — Vérifier la connexion

1. Allez dans **Paramètres → Imprimantes**
2. Testez la connexion à chaque imprimante
3. Vérifiez que les adresses IP sont toujours correctes (le nouveau serveur peut avoir une autre IP)

## Conseils pour une bonne hygiène de sauvegarde

- **Testez la restauration** — effectuez une sauvegarde et restaurez sur une machine de test au moins une fois. Des sauvegardes non testées ne sont pas des sauvegardes.
- **Stockez en externe** — copiez régulièrement le fichier de sauvegarde sur un disque externe ou un stockage cloud (Nextcloud, Google Drive, etc.)
- **Configurez une notification** — activez la notification pour « Sauvegarde échouée » sous **Paramètres → Notifications → Événements** afin de savoir immédiatement si quelque chose tourne mal
