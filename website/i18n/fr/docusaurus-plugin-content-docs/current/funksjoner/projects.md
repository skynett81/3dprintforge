---
sidebar_position: 9
title: Projets
description: Organisez les impressions en projets, suivez les coûts, générez des factures et partagez les projets avec vos clients
---

# Projets

Les projets vous permettent de regrouper des impressions associées, de suivre les coûts de matériaux, de facturer les clients et de partager un aperçu de votre travail.

Accédez à : **https://localhost:3443/#projects**

## Créer un projet

1. Cliquez sur **Nouveau projet** (icône +)
2. Renseignez :
   - **Nom du projet** — nom descriptif (max 100 caractères)
   - **Client** — compte client facultatif (voir [E-commerce](../integrasjoner/ecommerce))
   - **Description** — courte description textuelle
   - **Couleur** — choisissez une couleur pour l'identification visuelle
   - **Tags** — mots-clés séparés par des virgules
3. Cliquez sur **Créer le projet**

## Associer des impressions à un projet

### Pendant une impression

1. Ouvrez le tableau de bord pendant qu'une impression est en cours
2. Cliquez sur **Associer au projet** dans le panneau latéral
3. Sélectionnez un projet existant ou créez-en un nouveau
4. L'impression est automatiquement liée au projet à la fin

### Depuis l'historique

1. Accédez à **Historique**
2. Trouvez l'impression concernée
3. Cliquez sur l'impression → **Associer au projet**
4. Sélectionnez le projet dans la liste déroulante

### Association en masse

1. Sélectionnez plusieurs impressions dans l'historique avec les cases à cocher
2. Cliquez sur **Actions → Associer au projet**
3. Sélectionnez le projet — toutes les impressions sélectionnées y sont associées

## Vue des coûts

Chaque projet calcule les coûts totaux basés sur :

| Type de coût | Source |
|--------------|--------|
| Consommation de filament | Grammes × prix par gramme par matériau |
| Électricité | kWh × prix de l'électricité (depuis Tibber/Nordpool si configuré) |
| Usure de la machine | Calculée depuis [Prédiction d'usure](../overvaaking/wearprediction) |
| Coût manuel | Postes en texte libre que vous ajoutez manuellement |

La vue des coûts s'affiche sous forme de tableau et de diagramme circulaire par impression et au total.

:::tip Prix horaires
Activez l'intégration Tibber ou Nordpool pour des coûts d'électricité précis par impression. Voir [Prix de l'électricité](../integrasjoner/energy).
:::

## Facturation

1. Ouvrez un projet et cliquez sur **Générer une facture**
2. Renseignez :
   - **Date de facturation** et **date d'échéance**
   - **Taux de TVA** (0 %, 15 %, 25 %)
   - **Marge** (%)
   - **Note au client**
3. Prévisualisez la facture au format PDF
4. Cliquez sur **Télécharger PDF** ou **Envoyer au client** (par e-mail)

Les factures sont enregistrées sous le projet et peuvent être rouvertes et modifiées jusqu'à leur envoi.

:::info Données client
Les données client (nom, adresse, numéro de société) sont extraites du compte client associé au projet. Voir [E-commerce](../integrasjoner/ecommerce) pour gérer les clients.
:::

## Statut du projet

| Statut | Description |
|--------|-------------|
| Actif | Le projet est en cours |
| Terminé | Toutes les impressions sont prêtes, facture envoyée |
| Archivé | Masqué dans la vue standard, mais consultable |
| En attente | Temporairement suspendu |

Modifiez le statut en cliquant sur l'indicateur de statut en haut du projet.

## Partager un projet

Générez un lien partageable pour afficher l'aperçu du projet à vos clients :

1. Cliquez sur **Partager le projet** dans le menu du projet
2. Choisissez ce qui doit être visible :
   - ✅ Impressions et images
   - ✅ Consommation totale de filament
   - ❌ Coûts et prix (masqués par défaut)
3. Définissez la durée d'expiration du lien
4. Copiez et partagez le lien

Le client voit une page en lecture seule sans se connecter.
