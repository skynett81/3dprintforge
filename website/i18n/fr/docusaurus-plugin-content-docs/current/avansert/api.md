---
sidebar_position: 1
title: Référence API
description: API REST avec 284+ endpoints, authentification et rate limiting
---

# Référence API

Bambu Dashboard expose une API REST complète avec 284+ endpoints. La documentation de l'API est disponible directement dans le tableau de bord.

## Documentation interactive

Ouvrez la documentation OpenAPI dans le navigateur :

```
https://votre-serveur:3443/api/docs
```

Vous y trouverez tous les endpoints, les paramètres, les schémas requête/réponse et la possibilité de tester l'API directement.

## Authentification

L'API utilise l'authentification **Bearer token** (JWT) :

```bash
# Se connecter et obtenir un token
curl -X POST https://votre-serveur:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "votre-mot-de-passe"}'

# Réponse
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Utilisez le token dans tous les appels suivants :

```bash
curl https://votre-serveur:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate limiting

L'API est soumise à un rate limiting pour protéger le serveur :

| Limite | Valeur |
|--------|-------|
| Requêtes par minute | 200 |
| Burst (max par seconde) | 20 |
| Réponse en cas de dépassement | `429 Too Many Requests` |

L'en-tête `Retry-After` dans la réponse indique le nombre de secondes avant que la prochaine requête soit autorisée.

## Vue d'ensemble des endpoints

### Authentification
| Méthode | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Se connecter, obtenir un JWT |
| POST | `/api/auth/logout` | Se déconnecter |
| GET | `/api/auth/me` | Obtenir l'utilisateur connecté |

### Imprimantes
| Méthode | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/printers` | Lister toutes les imprimantes |
| POST | `/api/printers` | Ajouter une imprimante |
| GET | `/api/printers/:id` | Obtenir une imprimante |
| PUT | `/api/printers/:id` | Mettre à jour une imprimante |
| DELETE | `/api/printers/:id` | Supprimer une imprimante |
| GET | `/api/printers/:id/status` | Statut en temps réel |
| POST | `/api/printers/:id/command` | Envoyer une commande |

### Filament
| Méthode | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/filaments` | Lister toutes les bobines |
| POST | `/api/filaments` | Ajouter une bobine |
| PUT | `/api/filaments/:id` | Mettre à jour une bobine |
| DELETE | `/api/filaments/:id` | Supprimer une bobine |
| GET | `/api/filaments/stats` | Statistiques de consommation |

### Historique d'impression
| Méthode | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/history` | Lister l'historique (paginé) |
| GET | `/api/history/:id` | Obtenir une impression |
| GET | `/api/history/export` | Exporter en CSV |
| GET | `/api/history/stats` | Statistiques |

### File d'impression
| Méthode | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/queue` | Obtenir la file |
| POST | `/api/queue` | Ajouter une tâche |
| PUT | `/api/queue/:id` | Mettre à jour une tâche |
| DELETE | `/api/queue/:id` | Supprimer une tâche |
| POST | `/api/queue/dispatch` | Forcer l'envoi |

## API WebSocket

En plus du REST, il existe une API WebSocket pour les données en temps réel :

```javascript
const ws = new WebSocket('wss://votre-serveur:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Types de messages (entrants)
- `printer.status` — statut de l'imprimante mis à jour
- `print.progress` — mise à jour du pourcentage de progression
- `ams.update` — changement d'état AMS
- `notification` — message de notification

## Codes d'erreur

| Code | Signification |
|------|-------|
| 200 | OK |
| 201 | Créé |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Non trouvé |
| 429 | Trop de requêtes |
| 500 | Erreur serveur |
