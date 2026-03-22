---
sidebar_position: 2
title: Configuration initiale
description: Connectez votre imprimante Bambu Lab et configurez le tableau de bord
---

# Configuration initiale

Lors du premier démarrage du tableau de bord, l'assistant de configuration s'ouvre automatiquement.

## Assistant de configuration

L'assistant est disponible à l'adresse `https://votre-serveur:3443/setup`. Il vous guide à travers :

1. Création du compte administrateur
2. Ajout d'une imprimante
3. Test de la connexion
4. Configuration des notifications (facultatif)

## Ajout d'une imprimante

Vous avez besoin de trois informations pour connecter l'imprimante :

| Champ | Description | Exemple |
|-------|-------------|---------|
| Adresse IP | IP locale de l'imprimante | `192.168.1.100` |
| Numéro de série | 15 caractères, inscrit sous l'imprimante | `01P09C123456789` |
| Code d'accès | 8 caractères, dans les paramètres réseau de l'imprimante | `12345678` |

### Trouver le code d'accès sur l'imprimante

**X1C / P1S / P1P :**
1. Accédez à **Paramètres** sur l'écran
2. Sélectionnez **WLAN** ou **LAN**
3. Recherchez le **Code d'accès**

**A1 / A1 Mini :**
1. Appuyez sur l'écran et sélectionnez **Paramètres**
2. Accédez à **WLAN**
3. Recherchez le **Code d'accès**

:::tip Adresse IP fixe
Définissez une adresse IP fixe pour l'imprimante dans votre routeur (réservation DHCP). Cela vous évite de mettre à jour le tableau de bord chaque fois que l'imprimante obtient une nouvelle IP.
:::

## Configuration AMS

Une fois l'imprimante connectée, le statut AMS se met à jour automatiquement. Vous pouvez :

- Attribuer un nom et une couleur à chaque emplacement
- Associer les bobines à votre stock de filament
- Consulter la consommation de filament par bobine

Accédez à **Paramètres → Imprimante → AMS** pour la configuration manuelle.

## Certificats HTTPS {#https-certificats}

### Certificat auto-généré (par défaut)

Le tableau de bord génère automatiquement un certificat auto-signé au démarrage. Pour l'approuver dans le navigateur :

- **Chrome/Edge :** Cliquez sur « Avancé » → « Continuer vers le site »
- **Firefox :** Cliquez sur « Avancé » → « Accepter le risque et continuer »

### Certificat personnalisé

Placez les fichiers de certificat dans le dossier et configurez dans `config.json` :

```json
{
  "ssl": {
    "cert": "/chemin/vers/cert.pem",
    "key": "/chemin/vers/key.pem"
  }
}
```

:::info Let's Encrypt
Vous utilisez un nom de domaine ? Générez un certificat gratuit avec Let's Encrypt et Certbot, puis pointez `cert` et `key` vers les fichiers dans `/etc/letsencrypt/live/votre-domaine/`.
:::

## Variables d'environnement

Tous les paramètres peuvent être remplacés par des variables d'environnement :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `3000` | Port HTTP |
| `HTTPS_PORT` | `3443` | Port HTTPS |
| `NODE_ENV` | `production` | Environnement |
| `AUTH_SECRET` | (auto) | Secret JWT |

## Configuration multi-imprimantes

Vous pouvez ajouter plusieurs imprimantes sous **Paramètres → Imprimantes → Ajouter une imprimante**. Utilisez le sélecteur d'imprimante en haut du tableau de bord pour basculer entre elles.
