---
sidebar_position: 4
title: Terrain de jeu API
description: Testez tous les 177 endpoints API directement dans le navigateur avec la documentation OpenAPI intégrée et l'authentification
---

# Terrain de jeu API

Le terrain de jeu API vous permet d'explorer et de tester tous les 177 endpoints API de Bambu Dashboard directement dans le navigateur — sans écrire de code.

Accédez à : **https://localhost:3443/api/docs**

## Qu'est-ce que le terrain de jeu API ?

Le terrain de jeu est une version interactive de la documentation OpenAPI (Swagger UI) entièrement intégrée au tableau de bord. Vous êtes déjà authentifié lorsque vous êtes connecté, vous pouvez donc tester les endpoints directement.

## Naviguer dans la documentation

Les endpoints sont organisés en catégories :

| Catégorie | Nombre d'endpoints | Description |
|-----------|-------------------|-------------|
| Imprimantes | 24 | Récupérer le statut, contrôler, configurer |
| Impressions / Historique | 18 | Récupérer, rechercher, exporter l'historique |
| Filament | 22 | Stock, bobines, profils |
| File | 12 | Gérer la file d'impression |
| Statistiques | 15 | Statistiques agrégées et export |
| Notifications | 8 | Configurer et tester les canaux de notification |
| Utilisateurs | 10 | Utilisateurs, rôles, clés API |
| Paramètres | 14 | Lire et modifier la configuration |
| Maintenance | 12 | Tâches de maintenance et journal |
| Intégrations | 18 | HA, Tibber, webhooks, etc. |
| Bibliothèque | 14 | Télécharger, analyser, gérer |
| Système | 10 | Sauvegarde, santé, journal |

Cliquez sur une catégorie pour la développer et voir tous les endpoints.

## Tester un endpoint

1. Cliquez sur un endpoint (ex. `GET /api/printers`)
2. Cliquez sur **Try it out** (essayez-le)
3. Renseignez les paramètres éventuels (filtre, pagination, ID d'imprimante, etc.)
4. Cliquez sur **Execute**
5. Consultez la réponse ci-dessous : code de statut HTTP, en-têtes et corps JSON

### Exemple : Récupérer toutes les imprimantes

```
GET /api/printers
```
Retourne une liste de toutes les imprimantes enregistrées avec leur statut en temps réel.

### Exemple : Envoyer une commande à une imprimante

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Environnement de production
Le terrain de jeu API est connecté au système réel. Les commandes sont envoyées aux vraies imprimantes. Soyez prudent avec les opérations destructives telles que `DELETE` et `POST /command`.
:::

## Authentification

### Authentification par session (utilisateur connecté)
Lorsque vous êtes connecté au tableau de bord, le terrain de jeu est déjà authentifié via le cookie de session. Aucune configuration supplémentaire n'est nécessaire.

### Authentification par clé API

Pour l'accès externe :

1. Cliquez sur **Authorize** (icône cadenas en haut du terrain de jeu)
2. Renseignez votre clé API dans le champ **ApiKeyAuth** : `Bearer VOTRE_CLÉ`
3. Cliquez sur **Authorize**

Générez des clés API sous **Paramètres → Clés API** (voir [Authentification](../system/auth)).

## Limitation de débit

L'API a une limitation de débit de **200 requêtes par minute** par utilisateur/clé. Le terrain de jeu affiche les requêtes restantes dans l'en-tête de réponse `X-RateLimit-Remaining`.

:::info Spécification OpenAPI
Téléchargez la spécification OpenAPI complète en YAML ou JSON :
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Utilisez la spécification pour générer des bibliothèques clientes en Python, TypeScript, Go, etc.
:::

## Test des webhooks

Testez les intégrations webhook directement :

1. Accédez à `POST /api/webhooks/test`
2. Sélectionnez le type d'événement dans la liste déroulante
3. Le système envoie un événement de test à l'URL de webhook configurée
4. Consultez la requête/réponse dans le terrain de jeu
