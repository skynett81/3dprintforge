---
sidebar_position: 1
title: Home Assistant
description: Intégrez 3DPrintForge avec Home Assistant via la découverte MQTT, les entités automatisées et des exemples d'automatisation
---

# Home Assistant

L'intégration Home Assistant expose toutes les imprimantes Bambu Lab comme des entités dans Home Assistant via MQTT Discovery — automatiquement, sans configuration manuelle en YAML.

Accédez à : **https://localhost:3443/#settings** → onglet **Intégrations → Home Assistant**

## Prérequis

- Home Assistant en cours d'exécution sur le réseau
- Broker MQTT (Mosquitto) installé et configuré dans Home Assistant
- 3DPrintForge et Home Assistant utilisent le même broker MQTT

## Activer MQTT Discovery

1. Accédez à **Paramètres → Intégrations → Home Assistant**
2. Renseignez les paramètres du broker MQTT (si non déjà configuré) :
   - **Adresse du broker** : ex. `192.168.1.100`
   - **Port** : `1883` (ou `8883` pour TLS)
   - **Nom d'utilisateur et mot de passe** : si requis par le broker
3. Activez **MQTT Discovery**
4. Définissez le **Préfixe Discovery** : la valeur par défaut est `homeassistant`
5. Cliquez sur **Enregistrer et activer**

3DPrintForge publie maintenant des messages de découverte pour toutes les imprimantes enregistrées.

## Entités dans Home Assistant

Après activation, une nouvelle entité par imprimante apparaît dans Home Assistant (**Paramètres → Appareils et services → MQTT**) :

### Schéma des identifiants d'entité

Les identifiants d'entité suivent le schéma `sensor.{printer_name_slug}_{sensor_id}`, où `printer_name_slug` est le nom de l'imprimante en minuscules avec les caractères spéciaux remplacés par des tirets bas. Exemple : une imprimante nommée « Ma P1S » donne `sensor.ma_p1s_status`.

### Capteurs (lecture)

| ID capteur | Unité | Exemple |
|---|---|---|
| `{slug}_status` | texte | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | nombre | `124` |
| `{slug}_total_layers` | nombre | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | texte | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | texte | `-65dBm` |

### Capteurs binaires

| ID capteur | État |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Remarque
Les boutons (pause/reprise/arrêt) ne sont pas publiés via MQTT Discovery. Utilisez l'API 3DPrintForge pour envoyer des commandes depuis les automatisations.
:::

## Exemples d'automatisation

### Notifier sur mobile quand l'impression est terminée

Remplacez `ma_p1s` par le slug du nom de votre imprimante.

```yaml
automation:
  - alias: "Bambu - Impression terminée"
    trigger:
      - platform: state
        entity_id: binary_sensor.ma_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.ma_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_mon_telephone
        data:
          title: "Impression terminée !"
          message: "{{ states('sensor.ma_p1s_current_file') }} est terminée."
```

### Tamiser les lumières pendant l'impression

```yaml
automation:
  - alias: "Bambu - Tamiser les lumières pendant l'impression"
    trigger:
      - platform: state
        entity_id: binary_sensor.ma_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.atelier
        data:
          brightness_pct: 30
```

## Surveillance énergétique

La mesure de consommation via Shelly ou Tasmota est gérée séparément et n'est pas exposée directement via MQTT Discovery à Home Assistant. Consultez [Mesure de consommation](./power) pour la configuration d'une prise connectée.
