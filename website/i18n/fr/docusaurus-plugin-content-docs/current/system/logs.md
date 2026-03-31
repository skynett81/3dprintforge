---
sidebar_position: 8
title: Journal serveur
description: Consultez le journal serveur en temps réel, filtrez par niveau et module, et diagnostiquez les problèmes avec 3DPrintForge
---

# Journal serveur

Le journal serveur vous offre un aperçu de ce qui se passe à l'intérieur de 3DPrintForge — utile pour le diagnostic, la surveillance et les investigations.

Accédez à : **https://localhost:3443/#logs**

## Affichage en temps réel

Le flux de journal se met à jour en temps réel via WebSocket :

1. Accédez à **Système → Journal serveur**
2. Les nouvelles lignes de journal s'affichent automatiquement en bas
3. Cliquez sur **Verrouiller en bas** pour toujours faire défiler jusqu'au journal le plus récent
4. Cliquez sur **Geler** pour arrêter le défilement automatique et lire les lignes existantes

L'affichage par défaut montre les 500 dernières lignes de journal.

## Niveaux de journal

Chaque ligne de journal a un niveau :

| Niveau | Couleur | Description |
|---|---|---|
| **ERROR** | Rouge | Erreurs affectant la fonctionnalité |
| **WARN** | Orange | Avertissements — quelque chose peut mal tourner |
| **INFO** | Bleu | Informations de fonctionnement normal |
| **DEBUG** | Gris | Informations détaillées pour les développeurs |

:::info Configuration du niveau de journal
Modifiez le niveau de journal sous **Paramètres → Système → Niveau de journal**. Pour un fonctionnement normal, utilisez **INFO**. Utilisez **DEBUG** uniquement lors du diagnostic car il génère beaucoup plus de données.
:::

## Filtrage

Utilisez la barre d'outils de filtre en haut de la vue journal :

1. **Niveau de journal** — afficher uniquement ERROR / WARN / INFO / DEBUG ou une combinaison
2. **Module** — filtrer par module système :
   - `mqtt` — communication MQTT avec les imprimantes
   - `api` — requêtes API
   - `db` — opérations de base de données
   - `auth` — événements d'authentification
   - `queue` — événements de file d'impression
   - `guard` — événements Print Guard
   - `backup` — opérations de sauvegarde
3. **Texte libre** — rechercher dans le texte du journal (supporte les expressions régulières)
4. **Horodatage** — filtrer sur une période de dates

Combinez les filtres pour un diagnostic précis.

## Situations d'erreur courantes

### Problèmes de connexion MQTT

Recherchez les lignes de journal du module `mqtt` :

```
ERROR [mqtt] Connexion à l'imprimante XXXX échouée : Connection refused
```

**Solution :** Vérifiez que l'imprimante est allumée, que la clé d'accès est correcte et que le réseau fonctionne.

### Erreurs de base de données

```
ERROR [db] La migration v95 a échoué : SQLITE_CONSTRAINT
```

**Solution :** Effectuez une sauvegarde et exécutez la réparation de base de données via **Paramètres → Système → Réparer la base de données**.

### Erreurs d'authentification

```
WARN [auth] Échec de connexion pour l'utilisateur admin depuis l'IP 192.168.1.x
```

De nombreuses tentatives de connexion échouées peuvent indiquer une tentative de force brute. Vérifiez si la liste blanche d'IP doit être activée.

## Exporter les journaux

1. Cliquez sur **Exporter le journal**
2. Sélectionnez la période (par défaut : dernières 24 heures)
3. Sélectionnez le format : **TXT** (lisible par l'homme) ou **JSON** (lisible par machine)
4. Le fichier est téléchargé

Les journaux exportés sont utiles pour signaler des bugs ou lors d'une demande de support.

## Rotation des journaux

Les journaux sont automatiquement tournés :

| Paramètre | Par défaut |
|---|---|
| Taille maximale du fichier journal | 50 Mo |
| Nombre de fichiers tournés à conserver | 5 |
| Taille maximale totale des journaux | 250 Mo |

Ajustez sous **Paramètres → Système → Rotation des journaux**. Les anciens fichiers journaux sont automatiquement compressés avec gzip.

## Emplacement des fichiers journaux

Les fichiers journaux sont stockés sur le serveur :

```
./data/logs/
├── 3dprintforge.log          (journal actif)
├── 3dprintforge.log.1.gz     (tourné)
├── 3dprintforge.log.2.gz     (tourné)
└── ...
```

:::tip Accès SSH
Pour lire les journaux directement sur le serveur via SSH :
```bash
tail -f ./data/logs/3dprintforge.log
```
:::
