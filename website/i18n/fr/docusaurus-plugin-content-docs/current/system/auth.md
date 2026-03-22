---
sidebar_position: 1
title: Authentification
description: Gérez les utilisateurs, les rôles, les permissions, les clés API et l'authentification à deux facteurs avec TOTP
---

# Authentification

Bambu Dashboard prend en charge plusieurs utilisateurs avec contrôle d'accès basé sur les rôles, des clés API et une authentification à deux facteurs (2FA) optionnelle via TOTP.

Accédez à : **https://localhost:3443/#settings** → **Utilisateurs et accès**

## Utilisateurs

### Créer un utilisateur

1. Accédez à **Paramètres → Utilisateurs**
2. Cliquez sur **Nouvel utilisateur**
3. Renseignez :
   - **Nom d'utilisateur** — utilisé pour la connexion
   - **Adresse e-mail**
   - **Mot de passe** — minimum 12 caractères recommandé
   - **Rôle** — voir les rôles ci-dessous
4. Cliquez sur **Créer**

Le nouvel utilisateur peut maintenant se connecter à **https://localhost:3443/login**.

### Changer le mot de passe

1. Accédez à **Profil** (coin supérieur droit → cliquez sur le nom d'utilisateur)
2. Cliquez sur **Changer le mot de passe**
3. Renseignez le mot de passe actuel et le nouveau mot de passe
4. Cliquez sur **Enregistrer**

Les administrateurs peuvent réinitialiser le mot de passe des autres utilisateurs depuis **Paramètres → Utilisateurs → [Utilisateur] → Réinitialiser le mot de passe**.

## Rôles

| Rôle | Description |
|---|---|
| **Administrateur** | Accès complet — tous les paramètres, utilisateurs et fonctionnalités |
| **Opérateur** | Contrôle des imprimantes, voir tout, mais ne peut pas modifier les paramètres système |
| **Invité** | Lecture seule — voir le tableau de bord, l'historique et les statistiques |
| **Utilisateur API** | Accès API uniquement — pas d'interface web |

### Rôles personnalisés

1. Accédez à **Paramètres → Rôles**
2. Cliquez sur **Nouveau rôle**
3. Sélectionnez les permissions individuellement :
   - Voir le tableau de bord / l'historique / les statistiques
   - Contrôler les imprimantes (pause/arrêt/démarrage)
   - Gérer le stock de filaments
   - Gérer la file d'impression
   - Voir le flux caméra
   - Modifier les paramètres
   - Gérer les utilisateurs
4. Cliquez sur **Enregistrer**

## Clés API

Les clés API donnent un accès programmatique sans avoir à se connecter.

### Créer une clé API

1. Accédez à **Paramètres → Clés API**
2. Cliquez sur **Nouvelle clé**
3. Renseignez :
   - **Nom** — nom descriptif (ex. « Home Assistant », « Script Python »)
   - **Date d'expiration** — facultatif, à définir pour la sécurité
   - **Permissions** — sélectionnez un rôle ou des permissions spécifiques
4. Cliquez sur **Générer**
5. **Copiez la clé maintenant** — elle n'est affichée qu'une seule fois

### Utiliser la clé API

Ajoutez-la dans l'en-tête HTTP pour tous les appels API :
```
Authorization: Bearer VOTRE_CLÉ_API
```

Consultez le [Terrain de jeu API](../verktoy/playground) pour les tests.

:::danger Conservation sécurisée
Les clés API ont le même accès que l'utilisateur auquel elles sont liées. Conservez-les en lieu sûr et faites-les tourner régulièrement.
:::

## TOTP 2FA

Activez l'authentification à deux facteurs avec une application d'authentification (Google Authenticator, Authy, Bitwarden, etc.) :

### Activer la 2FA

1. Accédez à **Profil → Sécurité → Authentification à deux facteurs**
2. Cliquez sur **Activer la 2FA**
3. Scannez le QR code avec l'application d'authentification
4. Entrez le code à 6 chiffres généré pour confirmer
5. Enregistrez les **codes de récupération** (10 codes à usage unique) dans un endroit sûr
6. Cliquez sur **Activer**

### Se connecter avec la 2FA

1. Entrez le nom d'utilisateur et le mot de passe normalement
2. Entrez le code TOTP à 6 chiffres de l'application
3. Cliquez sur **Se connecter**

### 2FA obligatoire pour tous les utilisateurs

Les administrateurs peuvent exiger la 2FA pour tous les utilisateurs :

1. Accédez à **Paramètres → Sécurité → Forcer la 2FA**
2. Activez le paramètre
3. Les utilisateurs sans 2FA seront obligés de la configurer lors de leur prochaine connexion

## Gestion des sessions

- Durée de session par défaut : 24 heures
- Ajustez sous **Paramètres → Sécurité → Durée de session**
- Consultez les sessions actives par utilisateur et terminez des sessions individuelles
