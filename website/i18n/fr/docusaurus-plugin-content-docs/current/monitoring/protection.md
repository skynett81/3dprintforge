---
sidebar_position: 1
title: Print Guard
description: Surveillance automatique avec détection d'événements XCam, surveillance des capteurs et actions configurables en cas d'anomalie
---

# Print Guard

Print Guard est le système de surveillance en temps réel de 3DPrintForge. Il surveille en permanence la caméra, les capteurs et les données de l'imprimante, et exécute des actions configurables lorsqu'un problème est détecté.

Accédez à : **https://localhost:3443/#protection**

## Détection d'événements XCam

Les imprimantes Bambu Lab envoient des événements XCam via MQTT lorsque la caméra IA détecte des problèmes :

| Événement | Code | Gravité |
|-----------|------|---------|
| Spaghetti détecté | `xcam_spaghetti` | Critique |
| Décollement du plateau | `xcam_detach` | Haute |
| Dysfonctionnement première couche | `xcam_first_layer` | Haute |
| Stringing | `xcam_stringing` | Moyenne |
| Erreur d'extrusion | `xcam_extrusion` | Haute |

Pour chaque type d'événement, vous pouvez configurer une ou plusieurs actions :

- **Notifier** — envoyer une notification via les canaux actifs
- **Pause** — mettre l'impression en pause pour vérification manuelle
- **Arrêter** — annuler l'impression immédiatement
- **Aucune** — ignorer l'événement (mais l'enregistrer quand même)

:::danger Comportement par défaut
Par défaut, les événements XCam sont configurés sur **Notifier** et **Pause**. Passez à **Arrêter** si vous faites entièrement confiance à la détection IA.
:::

## Surveillance des capteurs

Print Guard surveille en permanence les données des capteurs et déclenche une alarme en cas d'anomalie :

### Écart de température

1. Accédez à **Print Guard → Température**
2. Définissez l'**Écart maximal par rapport à la température cible** (recommandé : ±5 °C pour la buse, ±3 °C pour le plateau)
3. Choisissez l'**Action en cas d'anomalie** : Notifier / Pause / Arrêter
4. Définissez le **Délai** (en secondes) avant l'exécution de l'action — donne à la température le temps de se stabiliser

### Filament faible

Le système calcule le filament restant sur les bobines :

1. Accédez à **Print Guard → Filament**
2. Définissez la **Limite minimale** en grammes (ex. 50 g)
3. Choisissez l'action : **Pause et notifier** (recommandé) pour changer la bobine manuellement

### Détection d'arrêt d'impression

Détecte quand l'impression s'est arrêtée de façon inattendue (timeout MQTT, rupture de filament, etc.) :

1. Activez la **Détection d'arrêt**
2. Définissez le **Timeout** (recommandé : 120 secondes sans données = arrêté)
3. Action : Notifier toujours — l'impression a peut-être déjà cessé

## Configuration

### Activer Print Guard

1. Accédez à **Paramètres → Print Guard**
2. Activez **Activer Print Guard**
3. Sélectionnez les imprimantes à surveiller
4. Cliquez sur **Enregistrer**

### Règles par imprimante

Différentes imprimantes peuvent avoir des règles différentes :

1. Cliquez sur une imprimante dans la vue Print Guard
2. Désactivez **Hériter des règles globales**
3. Configurez vos propres règles pour cette imprimante

## Journal et historique des événements

Tous les événements Print Guard sont enregistrés :

- Accédez à **Print Guard → Journal**
- Filtrez par imprimante, type d'événement, date et gravité
- Cliquez sur un événement pour voir les informations détaillées et les actions exécutées
- Exportez le journal en CSV

:::tip Faux positifs
Si Print Guard déclenche des pauses inutiles, ajustez la sensibilité sous **Print Guard → Paramètres → Sensibilité**. Commencez avec « Basse » et augmentez progressivement.
:::
