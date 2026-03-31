---
sidebar_position: 2
title: Prix de l'électricité
description: Connectez-vous à Tibber ou Nordpool pour des prix horaires en direct, l'historique des prix et des alertes de prix
---

# Prix de l'électricité

L'intégration Prix de l'électricité récupère les prix en temps réel depuis Tibber ou Nordpool afin de fournir des calculs précis du coût électrique par impression et des alertes sur les bons ou mauvais créneaux horaires pour imprimer.

Accédez à : **https://localhost:3443/#settings** → **Intégrations → Prix de l'électricité**

## Intégration Tibber

Tibber est un fournisseur d'électricité disposant d'une API ouverte pour les prix spot.

### Configuration

1. Connectez-vous à [developer.tibber.com](https://developer.tibber.com)
2. Générez un **Personal Access Token**
3. Dans 3DPrintForge : collez le token sous **Token API Tibber**
4. Sélectionnez le **Domicile** (depuis lequel les prix seront récupérés, si vous en avez plusieurs)
5. Cliquez sur **Tester la connexion**
6. Cliquez sur **Enregistrer**

### Données disponibles depuis Tibber

- **Prix spot actuel** — prix instantané taxes comprises (€/kWh)
- **Prix des 24 prochaines heures** — Tibber livre les prix du lendemain à partir d'environ 13h00
- **Historique des prix** — jusqu'à 30 jours en arrière
- **Coût par impression** — calculé à partir du temps d'impression réel × prix horaires

## Intégration Nordpool

Nordpool est la bourse de l'énergie qui fournit les prix spot bruts pour la Scandinavie et l'Europe.

### Configuration

1. Accédez à **Intégrations → Nordpool**
2. Sélectionnez la **Zone de prix** : FR (France) / BE (Belgique) / CH (Suisse) / etc.
3. Sélectionnez la **Devise** : EUR
4. Configurez **Taxes et redevances** :
   - Cochez **Inclure la TVA** (20 % en France)
   - Renseignez le **Tarif réseau** (€/kWh) — voir votre facture d'électricité
   - Renseignez la **Taxe sur la consommation** (CSPE, €/kWh)
5. Cliquez sur **Enregistrer**

:::info Tarif réseau
Le tarif réseau varie selon le fournisseur et la formule tarifaire. Consultez votre dernière facture d'électricité pour connaître le taux exact.
:::

## Prix horaires

Les prix horaires s'affichent sous forme de diagramme à barres pour les 24–48 prochaines heures :

- **Vert** — heures bon marché (en dessous de la moyenne)
- **Jaune** — prix moyen
- **Rouge** — heures chères (au-dessus de la moyenne)
- **Gris** — heures sans prévision de prix disponible

Survolez une heure pour voir le prix exact (€/kWh).

## Historique des prix

Accédez à **Prix de l'électricité → Historique** pour voir :

- Prix moyen journalier des 30 derniers jours
- Heure la plus chère et la moins chère par jour
- Coût électrique total des impressions par jour

## Alertes de prix

Configurez des alertes automatiques basées sur le prix de l'électricité :

1. Accédez à **Prix de l'électricité → Alertes de prix**
2. Cliquez sur **Nouvelle alerte**
3. Sélectionnez le type d'alerte :
   - **Prix sous le seuil** — alerter quand le prix tombe sous X €/kWh
   - **Prix au-dessus du seuil** — alerter quand le prix dépasse X €/kWh
   - **Heure la moins chère du jour** — alerter quand l'heure la moins chère du jour commence
4. Sélectionnez le canal d'alerte
5. Cliquez sur **Enregistrer**

:::tip Planification intelligente
Combinez les alertes de prix avec la file d'impression : configurez une automatisation qui envoie automatiquement les tâches en file lorsque le prix de l'électricité est bas (nécessite une intégration webhook ou Home Assistant).
:::

## Prix de l'électricité dans l'estimateur de coûts

L'intégration de prix d'électricité activée fournit des coûts électriques précis dans l'[Estimateur de coûts](../analytics/costestimator). Sélectionnez **Prix en direct** au lieu d'un prix fixe pour utiliser le prix actuel Tibber/Nordpool.
