---
sidebar_position: 3
title: Intégration Bambu Cloud
description: Connectez le tableau de bord à Bambu Lab Cloud pour synchroniser les modèles et l'historique d'impression
---

# Intégration Bambu Cloud

Bambu Dashboard peut se connecter à **Bambu Lab Cloud** pour récupérer les images de modèles, l'historique d'impression et les données de filament. Le tableau de bord fonctionne parfaitement sans connexion cloud, mais l'intégration cloud offre des avantages supplémentaires.

## Avantages de l'intégration cloud

| Fonctionnalité | Sans cloud | Avec cloud |
|----------------|-----------|-----------|
| Statut en temps réel de l'imprimante | Oui | Oui |
| Historique d'impression (local) | Oui | Oui |
| Images de modèles depuis MakerWorld | Non | Oui |
| Profils de filament Bambu | Non | Oui |
| Synchronisation de l'historique | Non | Oui |
| Filament AMS depuis le cloud | Non | Oui |

## Connexion à Bambu Cloud

1. Accédez à **Paramètres → Bambu Cloud**
2. Saisissez votre adresse e-mail et mot de passe Bambu Lab
3. Cliquez sur **Connexion**
4. Sélectionnez les données à synchroniser

:::warning Confidentialité
Le nom d'utilisateur et le mot de passe ne sont pas stockés en clair. Le tableau de bord utilise l'API Bambu Labs pour obtenir un token OAuth stocké localement. Vos données ne quittent jamais votre serveur.
:::

## Synchronisation

### Images de modèles

Lorsque le cloud est connecté, les images de modèles sont automatiquement récupérées depuis **MakerWorld** et affichées dans :
- L'historique d'impression
- Le tableau de bord (pendant une impression active)
- La visionneuse de modèles 3D

### Historique d'impression

La synchronisation cloud importe l'historique d'impression depuis l'application Bambu Lab. Les doublons sont automatiquement filtrés en fonction de l'horodatage et du numéro de série.

### Profils de filament

Les profils de filament officiels de Bambu Labs sont synchronisés et affichés dans le stock de filament. Vous pouvez les utiliser comme point de départ pour vos propres profils.

## Fonctionnement sans cloud

Toutes les fonctionnalités essentielles fonctionnent sans connexion cloud :

- Connexion MQTT directe à l'imprimante via LAN
- Statut en temps réel, température, caméra
- Historique et statistiques d'impression locaux
- Stock de filament (géré manuellement)
- Notifications et planificateur

:::tip Mode LAN uniquement
Vous souhaitez utiliser le tableau de bord sans connexion Internet ? Il fonctionne parfaitement dans un réseau isolé — connectez simplement l'imprimante via son adresse IP et laissez l'intégration cloud désactivée.
:::

## Dépannage

**Échec de connexion :**
- Vérifiez que l'adresse e-mail et le mot de passe correspondent à ceux de l'application Bambu Lab
- Vérifiez si le compte utilise l'authentification à deux facteurs (non prise en charge pour le moment)
- Essayez de vous déconnecter puis de vous reconnecter

**La synchronisation s'arrête :**
- Le token a peut-être expiré — déconnectez-vous et reconnectez-vous sous Paramètres
- Vérifiez la connexion Internet depuis votre serveur
