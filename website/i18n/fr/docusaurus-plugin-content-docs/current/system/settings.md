---
sidebar_position: 3
title: Paramètres
description: Vue d'ensemble complète de tous les paramètres de Bambu Dashboard — imprimantes, notifications, thème, OBS, énergie, webhooks et plus
---

# Paramètres

Tous les paramètres de Bambu Dashboard sont regroupés sur une seule page avec des catégories claires. Voici un aperçu de ce qui se trouve dans chaque catégorie.

Accédez à : **https://localhost:3443/#settings**

## Imprimantes

Gérez les imprimantes enregistrées :

| Paramètre | Description |
|---|---|
| Ajouter une imprimante | Enregistrez une nouvelle imprimante avec numéro de série et clé d'accès |
| Nom de l'imprimante | Nom d'affichage personnalisé |
| Modèle d'imprimante | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| Connexion MQTT | Bambu Cloud MQTT ou MQTT local |
| Clé d'accès | LAN Access Code depuis l'application Bambu Lab |
| Adresse IP | Pour le mode local (LAN) |
| Paramètres caméra | Activer/désactiver, résolution |

Consultez [Démarrage](../kom-i-gang/oppsett) pour la configuration étape par étape de la première imprimante.

## Notifications

Consultez la documentation complète dans [Notifications](../funksjoner/notifications).

Aperçu rapide :
- Activer/désactiver les canaux de notification (Telegram, Discord, e-mail, etc.)
- Filtre d'événements par canal
- Heures silencieuses (plage horaire sans notifications)
- Bouton de test par canal

## Thème

Consultez la documentation complète dans [Thème](./themes).

- Mode Clair / Sombre / Automatique
- 6 palettes de couleurs
- Couleur d'accentuation personnalisée
- Arrondi et compacité

## Overlay OBS

Configuration de l'overlay OBS :

| Paramètre | Description |
|---|---|
| Thème par défaut | dark / light / minimal |
| Position par défaut | Coin pour l'overlay |
| Échelle par défaut | Mise à l'échelle (0.5–2.0) |
| Afficher le QR code | Afficher le QR code du tableau de bord dans l'overlay |

Consultez [Overlay OBS](../funksjoner/obs-overlay) pour la syntaxe URL complète et la configuration.

## Énergie et électricité

| Paramètre | Description |
|---|---|
| Token API Tibber | Accès aux prix spot Tibber |
| Zone de prix Nordpool | Sélectionnez la région tarifaire |
| Tarif réseau (€/kWh) | Votre tarif réseau |
| Puissance imprimante (W) | Configurez la consommation par modèle d'imprimante |

## Home Assistant

| Paramètre | Description |
|---|---|
| Broker MQTT | IP, port, nom d'utilisateur, mot de passe |
| Préfixe Discovery | Par défaut : `homeassistant` |
| Activer la découverte | Publier les entités vers HA |

## Webhooks

Paramètres globaux des webhooks :

| Paramètre | Description |
|---|---|
| URL webhook | URL destinataire pour les événements |
| Clé secrète | Signature HMAC-SHA256 |
| Filtre d'événements | Quels événements sont envoyés |
| Tentatives de réessai | Nombre de tentatives en cas d'erreur (par défaut : 3) |
| Délai d'attente | Secondes avant abandon de la requête (par défaut : 10) |

## Paramètres de file

| Paramètre | Description |
|---|---|
| Distribution automatique | Activer/désactiver |
| Stratégie de distribution | Premier disponible / Moins utilisé / Round-robin |
| Confirmation requise | Approbation manuelle avant envoi |
| Démarrage échelonné | Délai entre les imprimantes dans la file |

## Sécurité

| Paramètre | Description |
|---|---|
| Durée de session | Heures/jours avant déconnexion automatique |
| Forcer la 2FA | Exiger la 2FA pour tous les utilisateurs |
| Liste blanche d'IP | Limiter l'accès à des adresses IP spécifiques |
| Certificat HTTPS | Télécharger un certificat personnalisé |

## Système

| Paramètre | Description |
|---|---|
| Port serveur | Par défaut : 3443 |
| Format du journal | JSON / Texte |
| Niveau de journal | Error / Warn / Info / Debug |
| Nettoyage de la base de données | Suppression automatique de l'ancien historique |
| Mises à jour | Vérifier les nouvelles versions |
