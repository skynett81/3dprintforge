---
sidebar_position: 1
title: Votre première impression
description: Guide étape par étape pour démarrer votre première impression 3D et la surveiller dans Bambu Dashboard
---

# Votre première impression

Ce guide vous accompagne tout au long du processus — d'une imprimante connectée à une impression terminée — avec le Bambu Dashboard comme centre de contrôle.

## Étape 1 — Vérifier que l'imprimante est connectée

Lorsque vous ouvrez le tableau de bord, vous voyez la carte de statut de votre imprimante en haut de la barre latérale ou dans le panneau de vue d'ensemble.

**Statut vert** signifie que l'imprimante est en ligne et prête.

| Statut | Couleur | Signification |
|--------|---------|---------------|
| En ligne | Vert | Prête à imprimer |
| Inactive | Gris | Connectée mais pas active |
| Impression | Bleu | Impression en cours |
| Erreur | Rouge | Requiert votre attention |

Si l'imprimante affiche un statut rouge :
1. Vérifiez que l'imprimante est allumée
2. Assurez-vous qu'elle est connectée au même réseau que le tableau de bord
3. Allez dans **Paramètres → Imprimantes** et confirmez l'adresse IP et le code d'accès

:::tip Utiliser le mode LAN pour une réponse plus rapide
Le mode LAN offre une latence plus faible que le mode cloud. Activez-le dans les paramètres de l'imprimante si l'imprimante et le tableau de bord sont sur le même réseau.
:::

## Étape 2 — Télécharger votre modèle

Bambu Dashboard ne démarre pas les impressions directement — c'est le rôle de Bambu Studio ou MakerWorld. Le tableau de bord prend le relais dès que l'impression commence.

**Via Bambu Studio :**
1. Ouvrez Bambu Studio sur votre PC
2. Importez ou ouvrez votre fichier `.stl` ou `.3mf`
3. Découpez le modèle (choisissez le filament, les supports, le remplissage, etc.)
4. Cliquez sur **Imprimer** en haut à droite

**Via MakerWorld :**
1. Trouvez le modèle sur [makerworld.com](https://makerworld.com)
2. Cliquez directement sur **Imprimer** depuis le site web
3. Bambu Studio s'ouvre automatiquement avec le modèle prêt

## Étape 3 — Démarrer l'impression

Dans Bambu Studio, choisissez la méthode d'envoi :

| Méthode | Prérequis | Avantages |
|---------|-----------|-----------|
| **Cloud** | Compte Bambu + Internet | Fonctionne partout |
| **LAN** | Même réseau | Plus rapide, sans cloud |
| **Carte SD** | Accès physique | Aucune exigence réseau |

Cliquez sur **Envoyer** — l'imprimante reçoit la tâche et commence automatiquement la phase de préchauffage.

:::info L'impression apparaît dans le tableau de bord
Quelques secondes après que Bambu Studio envoie la tâche, l'impression active s'affiche dans le tableau de bord sous **Impression active**.
:::

## Étape 4 — Surveiller dans le tableau de bord

Lorsque l'impression est en cours, le tableau de bord vous offre une vue d'ensemble complète :

### Progression
- Le pourcentage d'avancement et le temps restant estimé s'affichent sur la carte de l'imprimante
- Cliquez sur la carte pour une vue détaillée avec les informations de couche

### Températures
Le panneau de détails affiche les températures en temps réel :
- **Buse** — température actuelle et cible
- **Plateau** — température actuelle et cible
- **Chambre** — température ambiante à l'intérieur de l'imprimante (important pour ABS/ASA)

### Caméra
Cliquez sur l'icône de caméra sur la carte de l'imprimante pour voir le flux en direct directement dans le tableau de bord. Vous pouvez garder la caméra ouverte dans une fenêtre séparée pendant que vous faites autre chose.

:::warning Vérifier les premières couches
Les 3 à 5 premières couches sont critiques. Une mauvaise adhérence maintenant signifie un échec d'impression plus tard. Regardez la caméra et assurez-vous que le filament se dépose proprement et uniformément.
:::

### Print Guard
Bambu Dashboard dispose d'un **Print Guard** piloté par l'IA qui détecte automatiquement les erreurs de type spaghetti et peut mettre l'impression en pause. Activez-le dans **Surveillance → Print Guard**.

## Étape 5 — Après la fin de l'impression

Lorsque l'impression est terminée, le tableau de bord affiche un message de fin (et envoie une notification si vous avez configuré les [notifications](./varsler-oppsett)).

### Vérifier l'historique
Allez dans **Historique** dans la barre latérale pour voir l'impression terminée :
- Temps d'impression total
- Consommation de filament (grammes utilisés, coût estimé)
- Erreurs ou événements HMS pendant l'impression
- Photo de la caméra à la fin (si activée)

### Ajouter une note
Cliquez sur l'impression dans l'historique et ajoutez une note — par exemple « Avait besoin d'un peu plus de brim » ou « Résultat parfait ». Utile lorsque vous imprimez à nouveau le même modèle.

### Vérifier la consommation de filament
Sous **Filament**, vous pouvez voir que le poids de la bobine a été mis à jour en fonction de ce qui a été utilisé. Le tableau de bord déduit automatiquement.

## Conseils pour les débutants

:::tip Ne pas quitter la première impression
Surveillez les 10 à 15 premières minutes. Lorsque vous êtes sûr que l'impression adhère bien, vous pouvez laisser le tableau de bord surveiller le reste.
:::

- **Peser les bobines vides** — entrez le poids de départ des bobines pour un calcul précis du reste (voir [Stock de filament](./filament-oppsett))
- **Configurer les notifications Telegram** — recevoir une notification quand l'impression est terminée sans rester à attendre (voir [Notifications](./varsler-oppsett))
- **Vérifier le plateau** — plateau propre = meilleure adhérence. Essuyez avec de l'IPA (isopropanol) entre les impressions
- **Utiliser le bon plateau** — voir [Choisir le bon plateau](./velge-rett-plate) pour ce qui convient à votre filament
