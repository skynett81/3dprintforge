---
sidebar_position: 4
title: Serveurs distants
description: Connectez plusieurs instances de 3DPrintForge pour voir toutes les imprimantes depuis un tableau de bord central
---

# Serveurs distants (Remote Nodes)

La fonction Serveurs distants vous permet de connecter plusieurs instances de 3DPrintForge afin de voir et de contrôler toutes les imprimantes depuis une interface centrale — que celles-ci se trouvent sur le même réseau ou sur des sites différents.

Accédez à : **https://localhost:3443/#settings** → **Intégrations → Serveurs distants**

## Cas d'utilisation

- **Domicile + bureau** — Voir les imprimantes des deux sites depuis le même tableau de bord
- **Makerspace** — Tableau de bord central pour toutes les instances de la salle
- **Instances invitées** — Donnez un accès limité aux clients sans accès complet

## Architecture

```
Instance principale (votre PC)
  ├── Imprimante A (MQTT local)
  ├── Imprimante B (MQTT local)
  └── Serveur distant : Instance secondaire
        ├── Imprimante C (MQTT sur site distant)
        └── Imprimante D (MQTT sur site distant)
```

L'instance principale interroge les serveurs distants via l'API REST et agrège les données localement.

## Ajouter un serveur distant

### Étape 1 : Générer une clé API sur l'instance distante

1. Connectez-vous à l'instance distante (ex. `https://192.168.2.50:3443`)
2. Accédez à **Paramètres → Clés API**
3. Cliquez sur **Nouvelle clé** → donnez-lui le nom « Nœud principal »
4. Définissez les permissions : **Lecture** (au minimum) ou **Lecture + Écriture** (pour le contrôle à distance)
5. Copiez la clé

### Étape 2 : Se connecter depuis l'instance principale

1. Accédez à **Paramètres → Serveurs distants**
2. Cliquez sur **Ajouter un serveur distant**
3. Renseignez :
   - **Nom** : ex. « Bureau » ou « Garage »
   - **URL** : `https://192.168.2.50:3443` ou URL externe
   - **Clé API** : la clé de l'étape 1
4. Cliquez sur **Tester la connexion**
5. Cliquez sur **Enregistrer**

:::warning Certificat auto-signé
Si l'instance distante utilise un certificat auto-signé, activez **Ignorer les erreurs TLS** — mais faites-le uniquement pour les connexions réseau internes.
:::

## Vue agrégée

Après connexion, les imprimantes distantes s'affichent dans :

- **La vue de flotte** — marquée avec le nom du serveur distant et une icône nuage
- **Statistiques** — agrégées sur toutes les instances
- **Stock de filaments** — vue d'ensemble combinée

## Contrôle à distance

Avec les permissions **Lecture + Écriture**, vous pouvez contrôler directement les imprimantes distantes :

- Pause / Reprise / Arrêt
- Ajouter à la file d'impression (la tâche est envoyée à l'instance distante)
- Voir le flux caméra (transmis par l'instance distante)

:::info Latence
Le flux caméra via serveur distant peut présenter un délai notable selon la vitesse du réseau et la distance.
:::

## Contrôle d'accès

Limitez les données partagées par le serveur distant :

1. Sur l'instance distante : accédez à **Paramètres → Clés API → [Nom de la clé]**
2. Limitez l'accès :
   - Uniquement des imprimantes spécifiques
   - Pas de flux caméra
   - Lecture seule (aucune écriture)

## Santé et surveillance

Le statut de chaque serveur distant s'affiche dans **Paramètres → Serveurs distants** :

- **Connecté** — dernière interrogation réussie
- **Déconnecté** — impossible d'atteindre le serveur distant
- **Erreur d'authentification** — clé API invalide ou expirée
- **Dernière synchronisation** — horodatage de la dernière synchronisation réussie
