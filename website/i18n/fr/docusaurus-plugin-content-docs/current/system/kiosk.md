---
sidebar_position: 6
title: Mode kiosque
description: Configurez 3DPrintForge comme un écran mural ou une vue hub avec le mode kiosque et la rotation automatique
---

# Mode kiosque

Le mode kiosque est conçu pour les écrans muraux, les téléviseurs ou les moniteurs dédiés qui affichent en permanence le statut des imprimantes — sans clavier, interaction souris ni interface navigateur.

Accédez à : **https://localhost:3443/#settings** → **Système → Kiosque**

## Qu'est-ce que le mode kiosque

En mode kiosque :
- Le menu de navigation est masqué
- Aucun contrôle interactif n'est visible
- Le tableau de bord se met à jour automatiquement
- L'écran fait défiler les imprimantes en rotation (si configuré)
- Le délai d'inactivité est désactivé

## Activer le mode kiosque via l'URL

Ajoutez `?kiosk=true` à l'URL pour activer le mode kiosque sans modifier les paramètres :

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

Le mode kiosque se désactive en supprimant le paramètre ou en ajoutant `?kiosk=false`.

## Paramètres du kiosque

1. Accédez à **Paramètres → Système → Kiosque**
2. Configurez :

| Paramètre | Valeur par défaut | Description |
|---|---|---|
| Affichage par défaut | Vue de flotte | La page affichée |
| Intervalle de rotation | 30 secondes | Temps par imprimante en rotation |
| Mode de rotation | Actives uniquement | Rotation uniquement entre les imprimantes actives |
| Thème | Sombre | Recommandé pour les écrans |
| Taille de police | Grande | Lisible à distance |
| Horloge | Désactivé | Afficher l'horloge dans un coin |

## Vue de flotte pour le kiosque

La vue de flotte est optimisée pour le kiosque :

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Paramètres pour la vue de flotte :
- `cols=N` — nombre de colonnes (1–6)
- `size=small|medium|large` — taille des fiches

## Rotation imprimante par imprimante

Pour la rotation entre des imprimantes individuelles (une imprimante à la fois) :

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — activer la rotation
- `interval=N` — secondes par imprimante

## Configuration sur Raspberry Pi / NUC

Pour du matériel kiosque dédié :

### Chromium en mode kiosque (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Ajoutez la commande dans le démarrage automatique (`~/.config/autostart/bambu-kiosk.desktop`).

### Connexion automatique et démarrage

1. Configurez la connexion automatique dans le système d'exploitation
2. Créez une entrée de démarrage automatique pour Chromium
3. Désactivez l'économiseur d'écran et la gestion de l'énergie :
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Compte utilisateur dédié
Créez un compte 3DPrintForge dédié avec le rôle **Invité** pour l'appareil kiosque. L'appareil n'aura ainsi qu'un accès en lecture et ne pourra pas modifier les paramètres même si quelqu'un accède à l'écran.
:::

## Paramètres Hub

Le mode hub affiche une page de vue d'ensemble avec toutes les imprimantes et les statistiques clés — conçu pour les grands écrans :

```
https://localhost:3443/#hub?kiosk=true
```

La vue hub inclut :
- Grille des imprimantes avec statut
- Indicateurs clés agrégés (impressions actives, progression totale)
- Horloge et date
- Dernières alertes HMS
