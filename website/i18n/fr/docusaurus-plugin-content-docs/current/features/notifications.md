---
sidebar_position: 6
title: Notifications
description: Configurez les notifications via Telegram, Discord, e-mail, webhook, ntfy, Pushover et SMS pour tous les événements d'impression
---

# Notifications

3DPrintForge prend en charge les notifications via de nombreux canaux afin que vous sachiez toujours ce qui se passe avec vos imprimantes — que vous soyez chez vous ou en déplacement.

Accédez à : **https://localhost:3443/#settings** → onglet **Notifications**

## Canaux disponibles

| Canal | Requis | Supporte les images |
|-------|--------|---------------------|
| Telegram | Token de bot + ID de chat | ✅ |
| Discord | URL de webhook | ✅ |
| E-mail | Serveur SMTP | ✅ |
| Webhook | URL + clé optionnelle | ✅ (base64) |
| ntfy | Serveur ntfy + topic | ❌ |
| Pushover | Token API + clé utilisateur | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Notifications navigateur | Aucune configuration requise | ❌ |

## Configuration par canal

### Telegram

1. Créez un bot via [@BotFather](https://t.me/BotFather) — envoyez `/newbot`
2. Copiez le **token du bot** (format : `123456789:ABC-def...`)
3. Démarrez une conversation avec le bot et envoyez `/start`
4. Trouvez votre **ID de chat** : accédez à `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Dans 3DPrintForge : collez le token et l'ID de chat, cliquez sur **Tester**

:::tip Canal de groupe
Vous pouvez utiliser un groupe Telegram comme destinataire. L'ID de chat pour les groupes commence par `-`.
:::

### Discord

1. Ouvrez le serveur Discord vers lequel vous souhaitez envoyer des notifications
2. Accédez aux paramètres du canal → **Intégrations → Webhooks**
3. Cliquez sur **Nouveau webhook**, donnez-lui un nom et choisissez un canal
4. Copiez l'URL du webhook
5. Collez l'URL dans 3DPrintForge et cliquez sur **Tester**

### E-mail

1. Renseignez le serveur SMTP, le port (généralement 587 pour TLS)
2. Nom d'utilisateur et mot de passe du compte SMTP
3. Adresse **De** et adresse(s) **À** (séparées par des virgules pour plusieurs)
4. Activez **TLS/STARTTLS** pour l'envoi sécurisé
5. Cliquez sur **Tester** pour envoyer un e-mail de test

:::warning Gmail
Utilisez un **mot de passe d'application** pour Gmail, pas votre mot de passe habituel. Activez d'abord l'authentification à 2 facteurs sur votre compte Google.
:::

### ntfy

1. Créez un topic sur [ntfy.sh](https://ntfy.sh) ou faites tourner votre propre serveur ntfy
2. Renseignez l'URL du serveur (ex. `https://ntfy.sh`) et le nom du topic
3. Installez l'application ntfy sur votre téléphone et abonnez-vous au même topic
4. Cliquez sur **Tester**

### Pushover

1. Créez un compte sur [pushover.net](https://pushover.net)
2. Créez une nouvelle application — copiez le **token API**
3. Trouvez votre **clé utilisateur** sur le tableau de bord Pushover
4. Renseignez les deux dans 3DPrintForge et cliquez sur **Tester**

### Webhook (personnalisé)

3DPrintForge envoie un HTTP POST avec une charge JSON :

```json
{
  "event": "print_complete",
  "printer": "Mon X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Ajoutez une **clé secrète** pour valider les requêtes avec une signature HMAC-SHA256 dans l'en-tête `X-Bambu-Signature`.

## Filtre d'événements

Choisissez quels événements déclenchent des notifications par canal :

| Événement | Description |
|-----------|-------------|
| Impression démarrée | Une nouvelle impression commence |
| Impression terminée | Impression achevée (avec image) |
| Impression échouée | Impression interrompue avec erreur |
| Impression en pause | Pause manuelle ou automatique |
| Alerte Print Guard | XCam ou capteur a déclenché une action |
| Filament faible | Bobine presque vide |
| Erreur AMS | Blocage, filament humide, etc. |
| Imprimante déconnectée | Connexion MQTT perdue |
| Tâche de file envoyée | Tâche dispatchée depuis la file |

Cochez les événements souhaités pour chaque canal individuellement.

## Plage de silence

Évitez les notifications la nuit :

1. Activez la **Plage de silence** sous les paramètres de notification
2. Définissez les heures **De** et **À** (ex. 23h00 → 07h00)
3. Choisissez le **Fuseau horaire** pour la plage
4. Les notifications critiques (erreurs Print Guard) peuvent être ignorées — cochez **Toujours envoyer les critiques**

## Notifications push du navigateur

Recevez des notifications directement dans le navigateur sans application :

1. Accédez à **Paramètres → Notifications → Push navigateur**
2. Cliquez sur **Activer les notifications push**
3. Acceptez la boîte de dialogue d'autorisation du navigateur
4. Les notifications fonctionnent même si le tableau de bord est réduit (nécessite que l'onglet soit ouvert)

:::info PWA
Installez 3DPrintForge comme PWA pour recevoir des notifications push en arrière-plan sans onglet ouvert. Voir [PWA](../system/pwa).
:::
