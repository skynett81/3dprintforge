---
sidebar_position: 5
title: Prédiction d'usure
description: Analyse prédictive de 8 composants de l'imprimante avec calcul de durée de vie, alertes de maintenance et prévision des coûts
---

# Prédiction d'usure

La prédiction d'usure calcule la durée de vie attendue des composants critiques en fonction de l'utilisation réelle, du type de filament et du comportement de l'imprimante — afin que vous puissiez planifier la maintenance de manière proactive plutôt que réactive.

Accédez à : **https://localhost:3443/#wear**

## Composants surveillés

3DPrintForge suit l'usure de 8 composants par imprimante :

| Composant | Facteur d'usure principal | Durée de vie typique |
|-----------|--------------------------|---------------------|
| **Buse (laiton)** | Type de filament + heures | 300–800 heures |
| **Buse (acier trempé)** | Heures + matériau abrasif | 1500–3000 heures |
| **Tube PTFE** | Heures + haute température | 500–1500 heures |
| **Roue dentée extrudeur** | Heures + matériau abrasif | 1000–2000 heures |
| **Rail axe X (CNC)** | Nombre d'impressions + vitesse | 2000–5000 heures |
| **Surface du plateau** | Nombre d'impressions + température | 200–500 impressions |
| **Roue dentée AMS** | Nombre de changements de filament | 5000–15000 changements |
| **Ventilateurs de chambre** | Heures de fonctionnement | 3000–8000 heures |

## Calcul de l'usure

L'usure est calculée en pourcentage global (0–100 % d'usure) :

```
Usure % = (utilisation réelle / durée de vie estimée) × 100
         × multiplicateur matériau
         × multiplicateur vitesse
```

**Multiplicateurs de matériaux :**
- PLA, PETG : 1,0× (usure normale)
- ABS, ASA : 1,1× (légèrement plus agressive)
- PA, PC : 1,2× (difficile pour le PTFE et la buse)
- Composites CF/GF : 2,0–3,0× (très abrasif)

:::warning Fibre de carbone
Les filaments renforcés en fibre de carbone (CF-PLA, CF-PA, etc.) usent les buses en laiton extrêmement rapidement. Utilisez une buse en acier trempé et attendez-vous à une usure 2 à 3× plus rapide.
:::

## Calcul de la durée de vie

Pour chaque composant s'affichent :

- **Usure actuelle** — pourcentage utilisé
- **Durée de vie restante estimée** — heures ou impressions
- **Date d'expiration estimée** — basée sur l'utilisation moyenne des 30 derniers jours
- **Intervalle de confiance** — marge d'incertitude de la prédiction

Cliquez sur un composant pour voir le graphique détaillé de l'accumulation d'usure dans le temps.

## Alertes

Configurez des alertes automatiques par composant :

1. Accédez à **Usure → Paramètres**
2. Pour chaque composant, définissez le **Seuil d'alerte** (recommandé : 75 % et 90 %)
3. Choisissez le canal de notification (voir [Notifications](../features/notifications))

**Exemple de message d'alerte :**
> ⚠️ Buse (laiton) sur Mon X1C à 78 % d'usure. Durée de vie estimée : ~45 heures. Recommandé : Planifiez le remplacement de la buse.

## Coût de maintenance

Le module d'usure s'intègre avec le journal des coûts :

- **Coût par composant** — prix de la pièce de rechange
- **Coût de remplacement total** — somme pour tous les composants approchant de la limite
- **Prévision sur 6 mois** — coût de maintenance estimé à venir

Saisissez les prix des composants sous **Usure → Prix** :

1. Cliquez sur **Définir les prix**
2. Renseignez le prix par unité pour chaque composant
3. Le prix est utilisé dans les prévisions de coûts et peut varier selon le modèle d'imprimante

## Réinitialiser le compteur d'usure

Après la maintenance, réinitialisez le compteur du composant concerné :

1. Accédez à **Usure → [Nom du composant]**
2. Cliquez sur **Marquer comme remplacé**
3. Renseignez :
   - Date du remplacement
   - Coût (facultatif)
   - Note (facultatif)
4. Le compteur d'usure est réinitialisé et recalculé

Les réinitialisations apparaissent dans l'historique de maintenance.

:::tip Calibration
Comparez la prédiction d'usure avec les données d'expérience réelles et ajustez les paramètres de durée de vie sous **Usure → Configurer la durée de vie** pour adapter les calculs à votre utilisation réelle.
:::
