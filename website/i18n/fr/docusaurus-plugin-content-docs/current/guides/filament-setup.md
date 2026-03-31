---
sidebar_position: 2
title: Configurer le stock de filament
description: Comment créer, configurer et suivre vos bobines de filament dans 3DPrintForge
---

# Configurer le stock de filament

Le stock de filament dans 3DPrintForge vous donne une vue d'ensemble complète de toutes vos bobines — ce qu'il reste, ce qui a été consommé et quelles bobines sont actuellement dans l'AMS.

## Création automatique depuis l'AMS

Lorsque vous connectez une imprimante avec AMS, le tableau de bord lit automatiquement les informations des puces RFID sur les bobines Bambu :

- Type de filament (PLA, PETG, ABS, TPU, etc.)
- Couleur (avec code hexadécimal)
- Marque (Bambu Lab)
- Poids de la bobine et quantité restante

**Ces bobines sont créées automatiquement dans le stock** — vous n'avez rien à faire. Consultez-les sous **Filament → Stock**.

:::info Seules les bobines Bambu ont des puces RFID
Les bobines de tiers (par ex. eSUN, Polymaker, recharges Bambu sans puce) ne sont pas reconnues automatiquement. Celles-ci doivent être ajoutées manuellement.
:::

## Ajouter des bobines manuellement

Pour les bobines sans RFID ou les bobines qui ne sont pas dans l'AMS :

1. Allez dans **Filament → Stock**
2. Cliquez sur **+ Nouvelle bobine** en haut à droite
3. Remplissez les champs :

| Champ | Exemple | Obligatoire |
|-------|---------|-------------|
| Marque | eSUN, Polymaker, Bambu | Oui |
| Type | PLA, PETG, ABS, TPU | Oui |
| Couleur | #FF5500 ou choisir dans la roue chromatique | Oui |
| Poids initial | 1000 g | Recommandé |
| Restant | 850 g | Recommandé |
| Diamètre | 1,75 mm | Oui |
| Note | « Acheté 2025-01, fonctionne bien » | Optionnel |

4. Cliquez sur **Enregistrer**

## Configurer les couleurs et les marques

Vous pouvez modifier une bobine à tout moment en cliquant dessus dans la vue d'ensemble du stock :

- **Couleur** — Choisissez dans la roue chromatique ou saisissez une valeur hexadécimale. La couleur est utilisée comme marqueur visuel dans la vue d'ensemble de l'AMS
- **Marque** — Apparaît dans les statistiques et le filtrage. Créez vos propres marques sous **Filament → Marques**
- **Profil de température** — Saisissez la température de buse et de plateau recommandée par le fabricant de filament. Le tableau de bord peut alors avertir si vous choisissez une mauvaise température

## Comprendre la synchronisation AMS

Le tableau de bord synchronise le statut de l'AMS en temps réel :

```
AMS Emplacement 1 → Bobine : Bambu PLA Blanc  [███████░░░] 72% restant
AMS Emplacement 2 → Bobine : eSUN PETG Gris   [████░░░░░░] 41% restant
AMS Emplacement 3 → (vide)
AMS Emplacement 4 → Bobine : Bambu PLA Rouge  [██████████] 98% restant
```

La synchronisation est mise à jour :
- **Pendant l'impression** — la consommation est déduite en temps réel
- **À la fin de l'impression** — la consommation finale est enregistrée dans l'historique
- **Manuellement** — cliquez sur l'icône de synchronisation d'une bobine pour récupérer les données mises à jour depuis l'AMS

:::tip Corriger l'estimation AMS
L'estimation AMS par RFID n'est pas toujours précise à 100 % après la première utilisation. Pesez la bobine et mettez à jour le poids manuellement pour une meilleure précision.
:::

## Vérifier la consommation et le restant

### Par bobine
Cliquez sur une bobine dans le stock pour voir :
- Total utilisé (grammes, toutes impressions)
- Quantité restante estimée
- Liste de toutes les impressions ayant utilisé cette bobine

### Statistiques globales
Sous **Analyse → Analyse du filament**, vous pouvez voir :
- Consommation par type de filament au fil du temps
- Quelles marques vous utilisez le plus
- Coût estimé basé sur le prix d'achat par kg

### Alertes de niveau bas
Configurez des alertes lorsqu'une bobine approche de sa fin :

1. Allez dans **Filament → Paramètres**
2. Activez **Alerter en cas de stock bas**
3. Définissez le seuil (par ex. 100 g restants)
4. Choisissez le canal de notification (Telegram, Discord, e-mail)

## Conseil : Peser les bobines pour plus de précision

Les estimations de l'AMS et des statistiques d'impression ne sont jamais tout à fait exactes. La méthode la plus précise est de peser la bobine elle-même :

**Comment faire :**

1. Trouvez le poids à vide (bobine vide) — généralement 200–250 g, vérifiez sur le site du fabricant ou sous la bobine
2. Pesez la bobine avec le filament sur une balance de cuisine
3. Soustrayez le poids à vide
4. Mettez à jour **Restant** dans le profil de la bobine

**Exemple :**
```
Poids mesuré :      743 g
Tare (vide) :     - 230 g
Filament restant :  513 g
```

:::tip Générateur d'étiquettes de bobine
Sous **Outils → Étiquettes**, vous pouvez imprimer des étiquettes avec QR code pour vos bobines. Scannez le code avec votre téléphone pour ouvrir rapidement le profil de la bobine.
:::
