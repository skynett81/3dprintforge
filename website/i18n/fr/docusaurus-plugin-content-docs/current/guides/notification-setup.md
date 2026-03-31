---
sidebar_position: 7
title: Configurer les notifications
description: Configurer les notifications Telegram, Discord, e-mail et push dans 3DPrintForge
---

# Configurer les notifications

3DPrintForge peut vous notifier de tout — des impressions terminées aux erreurs critiques — via Telegram, Discord, e-mail ou les notifications push du navigateur.

## Vue d'ensemble des canaux de notification

| Canal | Idéal pour | Nécessite |
|-------|-----------|-----------|
| Telegram | Rapide, partout | Compte Telegram + token de bot |
| Discord | Équipe/communauté | Serveur Discord + URL de webhook |
| E-mail (SMTP) | Notification officielle | Serveur SMTP |
| Push navigateur | Notifications bureau | Navigateur avec support push |

---

## Bot Telegram

### Étape 1 — Créer le bot

1. Ouvrez Telegram et recherchez **@BotFather**
2. Envoyez `/newbot`
3. Donnez un nom au bot (par ex. « Bambu Notifications »)
4. Donnez un nom d'utilisateur au bot (par ex. `bambu_notify_bot`) — doit se terminer par `bot`
5. BotFather répond avec un **token API** : `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Copiez et conservez ce token

### Étape 2 — Trouver votre Chat ID

1. Démarrez une conversation avec votre bot (recherchez le nom d'utilisateur et cliquez sur **Démarrer**)
2. Envoyez un message au bot (par ex. « bonjour »)
3. Allez sur `https://api.telegram.org/bot<VOTRE_TOKEN>/getUpdates` dans le navigateur
4. Trouvez `"chat":{"id": 123456789}` — c'est votre Chat ID

### Étape 3 — Connecter au tableau de bord

1. Allez dans **Paramètres → Notifications → Telegram**
2. Collez le **Token du bot**
3. Collez le **Chat ID**
4. Cliquez sur **Tester la notification** — vous devriez recevoir un message de test dans Telegram
5. Cliquez sur **Enregistrer**

:::tip Notification de groupe
Vous souhaitez notifier tout un groupe ? Ajoutez le bot à un groupe Telegram, trouvez le Chat ID du groupe (nombre négatif, par ex. `-100123456789`) et utilisez-le à la place.
:::

---

## Webhook Discord

### Étape 1 — Créer un webhook dans Discord

1. Allez sur votre serveur Discord
2. Faites un clic droit sur le canal où vous voulez recevoir des notifications → **Modifier le salon**
3. Allez dans **Intégrations → Webhooks**
4. Cliquez sur **Nouveau webhook**
5. Donnez-lui un nom (par ex. « 3DPrintForge »)
6. Choisissez un avatar (optionnel)
7. Cliquez sur **Copier l'URL du webhook**

L'URL ressemble à ceci :
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Étape 2 — Saisir dans le tableau de bord

1. Allez dans **Paramètres → Notifications → Discord**
2. Collez l'**URL du webhook**
3. Cliquez sur **Tester la notification** — le canal Discord devrait recevoir un message de test
4. Cliquez sur **Enregistrer**

---

## E-mail (SMTP)

### Informations nécessaires

Vous avez besoin des paramètres SMTP de votre fournisseur d'e-mail :

| Fournisseur | Serveur SMTP | Port | Chiffrement |
|-------------|-------------|------|-------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Domaine propre | smtp.votredomaine.fr | 587 | TLS |

:::warning Gmail nécessite un mot de passe d'application
Gmail bloque la connexion avec un mot de passe ordinaire. Vous devez créer un **Mot de passe d'application** dans Compte Google → Sécurité → Validation en deux étapes → Mots de passe des applications.
:::

### Configuration dans le tableau de bord

1. Allez dans **Paramètres → Notifications → E-mail**
2. Remplissez :
   - **Serveur SMTP** : par ex. `smtp.gmail.com`
   - **Port** : `587`
   - **Nom d'utilisateur** : votre adresse e-mail
   - **Mot de passe** : mot de passe d'application ou mot de passe ordinaire
   - **Adresse d'expédition** : l'e-mail depuis lequel la notification est envoyée
   - **Adresse de destination** : l'e-mail sur lequel vous souhaitez recevoir les notifications
3. Cliquez sur **Tester l'e-mail**
4. Cliquez sur **Enregistrer**

---

## Notifications push du navigateur

Les notifications push apparaissent comme des notifications système sur le bureau — même lorsque l'onglet du navigateur est en arrière-plan.

**Activer :**
1. Allez dans **Paramètres → Notifications → Notifications push**
2. Cliquez sur **Activer les notifications push**
3. Le navigateur demande l'autorisation — cliquez sur **Autoriser**
4. Cliquez sur **Tester la notification**

:::info Uniquement dans le navigateur où vous l'avez activé
Les notifications push sont liées au navigateur et à l'appareil spécifiques. Activez-les sur chaque appareil sur lequel vous souhaitez recevoir des notifications.
:::

---

## Choisir les événements à notifier

Après avoir configuré un canal de notification, vous pouvez choisir exactement quels événements déclenchent une notification :

**Sous Paramètres → Notifications → Événements :**

| Événement | Recommandé |
|-----------|-----------|
| Impression terminée | Oui |
| Impression échouée / annulée | Oui |
| Print Guard : spaghetti détecté | Oui |
| Erreur HMS (critique) | Oui |
| Avertissement HMS | Optionnel |
| Filament à bas niveau | Oui |
| Erreur AMS | Oui |
| Imprimante déconnectée | Optionnel |
| Rappel de maintenance | Optionnel |
| Sauvegarde nocturne terminée | Non (trop de bruit) |

---

## Heures silencieuses (ne pas notifier la nuit)

Évitez d'être réveillé par une impression terminée à 03h00 :

1. Allez dans **Paramètres → Notifications → Heures silencieuses**
2. Activez les **Heures silencieuses**
3. Définissez l'heure de début et de fin (par ex. **22:00 à 07:00**)
4. Choisissez quels événements doivent quand même notifier pendant la période silencieuse :
   - **Erreurs HMS critiques** — recommandé de garder activé
   - **Print Guard** — recommandé de garder activé
   - **Impression terminée** — peut être désactivé la nuit

:::tip Impression nocturne sans dérangement
Lancez des impressions la nuit avec les heures silencieuses activées. Print Guard veille — et vous recevrez un récapitulatif le matin.
:::
