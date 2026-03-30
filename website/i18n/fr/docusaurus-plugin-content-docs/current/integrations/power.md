---
sidebar_position: 3
title: Mesure de consommation
description: Mesurez la consommation électrique réelle par impression avec une prise Shelly ou Tasmota et reliez-la à la vue des coûts
---

# Mesure de consommation

Connectez une prise connectée avec mesure d'énergie à l'imprimante pour enregistrer la consommation électrique réelle par impression — et non de simples estimations.

Accédez à : **https://localhost:3443/#settings** → **Intégrations → Mesure de consommation**

## Appareils pris en charge

| Appareil | Protocole | Recommandation |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Recommandé — configuration simple |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Pour installation fixe |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Modèles récents avec API étendue |
| **Appareils Tasmota** | MQTT | Flexible pour les configurations personnalisées |

:::tip Appareil recommandé
Le Shelly Plug S Plus avec firmware 1.0+ est testé et recommandé. Compatible Wi-Fi, MQTT et HTTP REST sans dépendance au cloud.
:::

## Configuration avec Shelly

### Prérequis

- La prise Shelly est connectée au même réseau que Bambu Dashboard
- Le Shelly est configuré avec une IP statique ou une réservation DHCP

### Configuration

1. Accédez à **Paramètres → Mesure de consommation**
2. Cliquez sur **Ajouter un compteur d'énergie**
3. Sélectionnez le **Type** : Shelly
4. Renseignez :
   - **Adresse IP** : ex. `192.168.1.150`
   - **Canal** : 0 (pour les prises à prise unique)
   - **Authentification** : nom d'utilisateur et mot de passe si configuré
5. Cliquez sur **Tester la connexion**
6. Liez la prise à une **Imprimante** : sélectionnez dans la liste déroulante
7. Cliquez sur **Enregistrer**

### Intervalle de scrutation

L'intervalle de scrutation par défaut est de 10 secondes. Réduisez à 5 pour des mesures plus précises, augmentez à 30 pour une charge réseau plus faible.

## Configuration avec Tasmota

1. Configurez l'appareil Tasmota avec MQTT (voir la documentation Tasmota)
2. Dans Bambu Dashboard : sélectionnez **Type** : Tasmota
3. Renseignez le topic MQTT de l'appareil : ex. `tasmota/power-plug-1`
4. Liez à l'imprimante et cliquez sur **Enregistrer**

Bambu Dashboard s'abonne automatiquement à `{topic}/SENSOR` pour les mesures de puissance.

## Ce qui est mesuré

Lorsque la mesure de consommation est activée, les éléments suivants sont enregistrés par impression :

| Métrique | Description |
|---|---|
| **Puissance instantanée** | Watts pendant l'impression (en direct) |
| **Énergie totale consommée** | kWh pour toute l'impression |
| **Puissance moyenne** | kWh / durée d'impression |
| **Coût énergétique** | kWh × prix de l'électricité (de Tibber/Nordpool) |

Les données sont stockées dans l'historique d'impression et disponibles pour l'analyse.

## Affichage en direct

La consommation instantanée s'affiche dans :

- **Le tableau de bord** — comme un widget supplémentaire (à activer dans les paramètres des widgets)
- **La vue de flotte** — comme un petit indicateur sur la fiche de l'imprimante

## Comparaison avec l'estimation

Après l'impression, une comparaison s'affiche :

| | Estimé | Réel |
|---|---|---|
| Consommation d'énergie | 1,17 kWh | 1,09 kWh |
| Coût électrique | 0,18 € | 0,17 € |
| Écart | — | -6,8 % |

Un écart constant peut être utilisé pour calibrer les estimations dans l'[Estimateur de coûts](../analytics/costestimator).

## Éteindre l'imprimante automatiquement

Shelly/Tasmota peut éteindre automatiquement l'imprimante après la fin de l'impression :

1. Accédez à **Mesure de consommation → [Imprimante] → Extinction automatique**
2. Activez **Éteindre X minutes après la fin de l'impression**
3. Définissez le délai (ex. 10 minutes)

:::danger Refroidissement
Laissez l'imprimante refroidir pendant au moins 5–10 minutes après la fin de l'impression avant de couper l'alimentation. La buse doit refroidir en dessous de 50 °C pour éviter le fluage thermique dans le hotend.
:::
