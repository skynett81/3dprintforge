---
sidebar_position: 5
title: Contrôle de l'imprimante
description: Contrôlez la température, la vitesse, les ventilateurs et envoyez du G-code directement à l'imprimante
---

# Contrôle de l'imprimante

Le panneau de contrôle vous offre un contrôle manuel complet de l'imprimante directement depuis le tableau de bord.

## Gestion de la température

### Buse
- Définissez la température cible entre 0 et 350 °C
- Cliquez sur **Définir** pour envoyer la commande
- La lecture en temps réel s'affiche avec une jauge circulaire animée

### Plateau chauffant
- Définissez la température cible entre 0 et 120 °C
- Extinction automatique après l'impression (configurable)

### Chambre
- Consultez la température de la chambre (lecture en temps réel)
- **X1E, H2S, H2D, H2C** : contrôle actif de la chauffe de chambre via M141 (température cible contrôlable)
- **X1C** : enceinte passive — la température de chambre s'affiche, mais ne peut pas être contrôlée directement
- **P1S** : enceinte passive — affiche la température, pas de contrôle actif de la chauffe de chambre
- **P1P, A1, A1 mini et série H sans chamberHeat** : pas de capteur de chambre

:::warning Températures maximales
Ne dépassez pas les températures recommandées pour la buse et le plateau. Pour les buses en acier trempé (type HF) : max 300 °C. Pour le laiton : max 260 °C. Consultez le manuel de l'imprimante.
:::

## Profils de vitesse

Le contrôle de vitesse propose quatre profils prédéfinis :

| Profil | Vitesse | Utilisation |
|--------|---------|-------------|
| Silencieux | 50 % | Réduction du bruit, impression nocturne |
| Standard | 100 % | Utilisation normale |
| Sport | 124 % | Impressions plus rapides |
| Turbo | 166 % | Vitesse maximale (perte de qualité) |

Le curseur permet de définir un pourcentage personnalisé entre 50 et 200 %.

## Contrôle des ventilateurs

Contrôlez manuellement la vitesse des ventilateurs :

| Ventilateur | Description | Plage |
|-------------|-------------|-------|
| Ventilateur de refroidissement de pièce | Refroidit l'objet imprimé | 0–100 % |
| Ventilateur auxiliaire | Circulation en chambre | 0–100 % |
| Ventilateur de chambre | Refroidissement actif de la chambre | 0–100 % |

:::tip Bons réglages
- **PLA/PETG :** Refroidissement pièce 100 %, auxiliaire 30 %
- **ABS/ASA :** Refroidissement pièce 0–20 %, ventilateur chambre désactivé
- **TPU :** Refroidissement pièce 50 %, vitesse réduite
:::

## Console G-code

Envoyez des commandes G-code directement à l'imprimante :

```gcode
; Exemple : Déplacer la tête
G28 ; Retour à l'origine sur tous les axes
G1 X150 Y150 Z10 F3000 ; Déplacer vers le centre
M104 S220 ; Définir la température de la buse
M140 S60  ; Définir la température du plateau
```

:::danger Soyez prudent avec le G-code
Un G-code incorrect peut endommager l'imprimante. N'envoyez que des commandes que vous comprenez. Évitez `M600` (changement de filament) en cours d'impression.
:::

## Opérations de filament

Depuis le panneau de contrôle, vous pouvez :

- **Charger le filament** — chauffe la buse et charge le filament
- **Décharger le filament** — chauffe la buse et retire le filament
- **Purger la buse** — lancer un cycle de purge

## Macros

Enregistrez et exécutez des séquences de commandes G-code en tant que macros :

1. Cliquez sur **Nouvelle macro**
2. Donnez un nom à la macro
3. Saisissez la séquence G-code
4. Enregistrez et exécutez en un clic

Exemple de macro pour la calibration du plateau :
```gcode
G28
M84
M500
```

## Contrôle d'impression

Pendant une impression active, vous pouvez :

- **Pause** — met l'impression en pause après la couche en cours
- **Reprendre** — reprend une impression en pause
- **Arrêter** — annule l'impression (irréversible)
- **Arrêt d'urgence** — arrêt immédiat de tous les moteurs
