---
sidebar_position: 6
title: Plusieurs imprimantes
description: Configurer et gérer plusieurs imprimantes Bambu dans 3DPrintForge — vue de flotte, file d'attente et démarrage échelonné
---

# Plusieurs imprimantes

Vous avez plus d'une imprimante ? 3DPrintForge est conçu pour la gestion de flotte — vous pouvez surveiller, contrôler et coordonner toutes les imprimantes depuis un seul endroit.

## Ajouter une nouvelle imprimante

1. Allez dans **Paramètres → Imprimantes**
2. Cliquez sur **+ Ajouter une imprimante**
3. Remplissez :

| Champ | Exemple | Explication |
|-------|---------|-------------|
| Numéro de série (SN) | 01P... | Trouvé dans Bambu Handy ou sur l'écran de l'imprimante |
| Adresse IP | 192.168.1.101 | Pour le mode LAN (recommandé) |
| Code d'accès | 12345678 | Code à 8 chiffres sur l'écran de l'imprimante |
| Nom | « Bambu #2 - P1S » | Affiché dans le tableau de bord |
| Modèle | P1P, P1S, X1C, A1 | Choisissez le bon modèle pour les bonnes icônes et fonctions |

4. Cliquez sur **Tester la connexion** — vous devriez voir un statut vert
5. Cliquez sur **Enregistrer**

:::tip Donnez des noms descriptifs aux imprimantes
« Bambu 1 » et « Bambu 2 » sont confusants. Utilisez des noms comme « X1C - Production » et « P1S - Prototypes » pour garder une bonne vue d'ensemble.
:::

## La vue de flotte

Après avoir ajouté toutes les imprimantes, elles s'affichent ensemble dans le panneau **Flotte**. Vous pouvez y voir :

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Production│  │ P1S - Prototypes│  │ A1 - Loisirs    │
│ ████████░░ 82%  │  │ Libre           │  │ ████░░░░░░ 38%  │
│ 1h 24m restant  │  │ Prête à imprimer│  │ 3h 12m restant  │
│ Temp: 220/60°C  │  │ AMS: 4 bobines  │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Vous pouvez :
- Cliquer sur une imprimante pour ouvrir la vue détaillée complète
- Voir toutes les températures, le statut AMS et les erreurs actives en une fois
- Filtrer par statut (impressions actives, libres, erreurs)

## File d'impression — répartir le travail

La file d'impression vous permet de planifier des impressions pour toutes les imprimantes depuis un seul endroit.

**Comment ça fonctionne :**
1. Allez dans **File d'attente**
2. Cliquez sur **+ Ajouter une tâche**
3. Choisissez le fichier et les paramètres
4. Choisissez l'imprimante ou sélectionnez **Attribution automatique**

### Attribution automatique
Avec l'attribution automatique, le tableau de bord choisit l'imprimante en fonction de :
- La capacité disponible
- Le filament disponible dans l'AMS
- Les fenêtres de maintenance planifiées

Activez dans **Paramètres → File d'attente → Attribution automatique**.

### Priorisation
Glissez-déposez les tâches dans la file d'attente pour changer l'ordre. Une tâche avec **Haute priorité** passe devant les tâches normales.

## Démarrage échelonné — éviter les pics de courant

Si vous démarrez plusieurs imprimantes simultanément, la phase de préchauffage peut générer un fort pic de courant. Le démarrage échelonné répartit le démarrage :

**Comment l'activer :**
1. Allez dans **Paramètres → Flotte → Démarrage échelonné**
2. Activez **Démarrage réparti**
3. Définissez le délai entre les imprimantes (recommandé : 2–5 minutes)

**Exemple avec 3 imprimantes et 3 minutes de délai :**
```
08:00 — Imprimante 1 commence le préchauffage
08:03 — Imprimante 2 commence le préchauffage
08:06 — Imprimante 3 commence le préchauffage
```

:::tip Pertinent pour la taille du fusible
Un X1C consomme environ 1000 W lors du préchauffage. Trois imprimantes simultanément = 3000 W, ce qui peut déclencher le fusible de 16A. Le démarrage échelonné élimine le problème.
:::

## Groupes d'imprimantes

Les groupes d'imprimantes vous permettent d'organiser les imprimantes logiquement et d'envoyer des commandes à tout le groupe :

**Créer un groupe :**
1. Allez dans **Paramètres → Groupes d'imprimantes**
2. Cliquez sur **+ Nouveau groupe**
3. Donnez un nom au groupe (par ex. « Atelier de production », « Salle de loisirs »)
4. Ajoutez des imprimantes au groupe

**Fonctions de groupe :**
- Voir les statistiques globales pour le groupe
- Envoyer une commande de pause à tout le groupe simultanément
- Définir une fenêtre de maintenance pour le groupe

## Surveiller toutes les imprimantes

### Vue multi-caméra
Allez dans **Flotte → Vue caméra** pour voir tous les flux de caméra côte à côte :

```
┌──────────────┐  ┌──────────────┐
│  X1C Flux    │  │  P1S Flux    │
│  [En direct] │  │  [Libre]     │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Flux     │  │  + Ajouter   │
│  [En direct] │  │              │
└──────────────┘  └──────────────┘
```

### Notifications par imprimante
Vous pouvez configurer différentes règles de notification pour différentes imprimantes :
- Imprimante de production : toujours notifier, y compris la nuit
- Imprimante de loisirs : notifier uniquement en journée

Voir [Notifications](./notification-setup) pour la configuration.

## Conseils pour la gestion de flotte

- **Standardiser les emplacements de filament** : Garder le PLA blanc en emplacement 1, le PLA noir en emplacement 2 sur toutes les imprimantes — la répartition des tâches est alors plus simple
- **Vérifier les niveaux AMS quotidiennement** : Voir [Utilisation quotidienne](./daily-use) pour la routine matinale
- **Maintenance en rotation** : Ne pas faire la maintenance de toutes les imprimantes en même temps — garder toujours au moins une active
- **Nommer clairement les fichiers** : Des noms de fichiers comme `logo_x1c_pla_0.2mm.3mf` facilitent le choix de la bonne imprimante
