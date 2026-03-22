---
sidebar_position: 5
title: E-commerce
description: Gérez les commandes, les clients et la facturation pour la vente d'impressions 3D — nécessite une licence de geektech.no
---

# E-commerce

Le module e-commerce vous offre un système complet pour gérer les clients, les commandes et la facturation — parfait pour ceux qui vendent des impressions 3D de manière professionnelle ou semi-professionnelle.

Accédez à : **https://localhost:3443/#orders**

:::danger Licence e-commerce requise
Le module e-commerce nécessite une licence valide. Les licences ne peuvent être **achetées qu'auprès de [geektech.no](https://geektech.no)**. Sans licence active, le module est verrouillé et inaccessible.
:::

## Licence — achat et activation

### Acheter une licence

1. Accédez à **[geektech.no](https://geektech.no)** et créez un compte
2. Sélectionnez **Bambu Dashboard — Licence e-commerce**
3. Choisissez le type de licence :

| Type de licence | Description | Imprimantes |
|---|---|---|
| **Hobby** | Une imprimante, usage personnel et ventes mineures | 1 |
| **Professionnel** | Jusqu'à 5 imprimantes, usage commercial | 1–5 |
| **Entreprise** | Nombre illimité d'imprimantes, support complet | Illimité |

4. Finalisez le paiement
5. Vous recevrez une **clé de licence** par e-mail

### Activer la licence

1. Accédez à **Paramètres → E-commerce** dans le tableau de bord
2. Collez la **clé de licence** dans le champ
3. Cliquez sur **Activer la licence**
4. Le tableau de bord authentifie la clé auprès des serveurs de geektech.no
5. En cas d'activation réussie, le type de licence, la date d'expiration et le nombre d'imprimantes s'affichent

:::warning La clé de licence est liée à votre installation
La clé est activée pour une installation de Bambu Dashboard. Contactez [geektech.no](https://geektech.no) si vous devez transférer la licence vers un nouveau serveur.
:::

### Validation de la licence

- La licence est **validée en ligne** au démarrage, puis toutes les 24 heures
- En cas de panne réseau, la licence fonctionne jusqu'à **7 jours hors ligne**
- Licence expirée → le module est verrouillé, mais les données existantes sont conservées
- Le renouvellement s'effectue via **[geektech.no](https://geektech.no)** → Mes licences → Renouveler

### Vérifier le statut de la licence

Accédez à **Paramètres → E-commerce** ou appelez l'API :

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

La réponse contient :
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Nom de l'entreprise",
  "provider": "geektech.no"
}
```

## Clients

### Créer un client

1. Accédez à **E-commerce → Clients**
2. Cliquez sur **Nouveau client**
3. Renseignez :
   - **Nom / Raison sociale**
   - **Personne de contact** (pour les entreprises)
   - **Adresse e-mail**
   - **Téléphone**
   - **Adresse** (adresse de facturation)
   - **N° SIRET / TVA** (facultatif, pour les assujettis à la TVA)
   - **Note** — remarque interne
4. Cliquez sur **Créer**

### Vue d'ensemble des clients

La liste des clients affiche :
- Nom et coordonnées
- Nombre total de commandes
- Chiffre d'affaires total
- Date de dernière commande
- Statut (Actif / Inactif)

Cliquez sur un client pour voir l'historique complet des commandes et de la facturation.

## Gestion des commandes

### Créer une commande

1. Accédez à **E-commerce → Commandes**
2. Cliquez sur **Nouvelle commande**
3. Sélectionnez le **Client** dans la liste
4. Ajoutez des lignes de commande :
   - Sélectionnez un fichier/modèle dans la bibliothèque, ou ajoutez un article en texte libre
   - Indiquez la quantité et le prix unitaire
   - Le système calcule automatiquement le coût si lié à un projet
5. Indiquez la **Date de livraison** (estimée)
6. Cliquez sur **Créer la commande**

### Statut de la commande

| Statut | Description |
|---|---|
| Demande | Demande reçue, non confirmée |
| Confirmée | Confirmée par le client |
| En production | Impressions en cours |
| Prête à livrer | Terminée, en attente de collecte/envoi |
| Livrée | Commande complétée |
| Annulée | Annulée par le client ou par vous |

Mettez à jour le statut en cliquant sur la commande → **Modifier le statut**.

### Lier des impressions à une commande

1. Ouvrez la commande
2. Cliquez sur **Lier une impression**
3. Sélectionnez les impressions dans l'historique (sélection multiple prise en charge)
4. Les données de coût sont automatiquement récupérées depuis l'historique d'impression

## Facturation

Consultez [Projets → Facturation](../funksjoner/projects#fakturering) pour la documentation détaillée sur la facturation.

Une facture peut être générée directement depuis une commande :

1. Ouvrez la commande
2. Cliquez sur **Générer la facture**
3. Vérifiez le montant et la TVA
4. Téléchargez le PDF ou envoyez-le à l'adresse e-mail du client

### Séquence de numérotation des factures

Configurez la séquence de numérotation sous **Paramètres → E-commerce** :
- **Préfixe** : ex. `2026-`
- **Numéro de départ** : ex. `1001`
- Les numéros de facture sont attribués automatiquement en ordre croissant

## Rapports et taxes

### Rapport des frais

Le système suit tous les frais de transaction :
- Consultez les frais sous **E-commerce → Frais**
- Marquez les frais comme déclarés à des fins comptables
- Exportez le récapitulatif des frais par période

### Statistiques

Sous **E-commerce → Statistiques** :
- Chiffre d'affaires mensuel (diagramme à barres)
- Meilleurs clients par chiffre d'affaires
- Modèles/matériaux les plus vendus
- Taille moyenne des commandes

Exportez en CSV pour le système comptable.

## Support et contact

:::info Besoin d'aide ?
- **Questions de licence** : contactez le support [geektech.no](https://geektech.no)
- **Problèmes techniques** : [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Demandes de fonctionnalités** : [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
