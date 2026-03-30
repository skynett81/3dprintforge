---
sidebar_position: 5
title: Dépannage d'une impression échouée
description: Diagnostiquez et résolvez les erreurs d'impression courantes à l'aide des journaux d'erreurs et des outils de Bambu Dashboard
---

# Dépannage d'une impression échouée

Quelque chose a mal tourné ? Ne vous inquiétez pas — la plupart des erreurs d'impression ont des solutions simples. Bambu Dashboard vous aide à trouver la cause rapidement.

## Étape 1 — Vérifier les codes d'erreur HMS

HMS (Handling, Monitoring, Sensing) est le système d'erreurs de Bambu Labs. Toutes les erreurs sont automatiquement enregistrées dans le tableau de bord.

1. Allez dans **Surveillance → Erreurs**
2. Trouvez l'impression échouée
3. Cliquez sur le code d'erreur pour une description détaillée et une solution proposée

Codes HMS courants :

| Code | Description | Solution rapide |
|------|-------------|-----------------|
| 0700 1xxx | Erreur AMS (bourrage, problème moteur) | Vérifier le chemin du filament dans l'AMS |
| 0300 0xxx | Erreur d'extrusion (sous/sur-extrusion) | Nettoyer la buse, vérifier le filament |
| 0500 xxxx | Erreur de calibration | Effectuer une recalibration |
| 1200 xxxx | Déviation de température | Vérifier les connexions de câbles |
| 0C00 xxxx | Erreur de caméra | Redémarrer l'imprimante |

:::tip Codes d'erreur dans l'historique
Sous **Historique → [Impression] → Journal HMS**, vous pouvez voir tous les codes d'erreur survenus pendant l'impression — même si l'impression s'est « terminée ».
:::

## Erreurs courantes et solutions

### Mauvaise adhérence (la première couche ne tient pas)

**Symptômes :** L'impression se détache du plateau, se recourbe, la première couche est absente

**Causes et solutions :**

| Cause | Solution |
|-------|---------|
| Plateau sale | Essuyer avec de l'alcool IPA |
| Mauvaise température de plateau | Augmenter de 5°C |
| Z-offset incorrect | Effectuer à nouveau l'Auto Bed Leveling |
| Bâton de colle manquant (PETG/ABS) | Appliquer une fine couche de bâton de colle |
| Vitesse trop élevée pour la première couche | Réduire à 20–30 mm/s pour la première couche |

**Liste de vérification rapide :**
1. Le plateau est-il propre ? (IPA + chiffon non pelucheux)
2. Utilisez-vous le bon plateau pour le type de filament ? (voir [Choisir le bon plateau](./choosing-plate))
3. La calibration Z a-t-elle été effectuée après le dernier changement de plateau ?

---

### Gauchissement (les coins se soulèvent)

**Symptômes :** Les coins se courbent vers le haut depuis le plateau, surtout sur les grands modèles plats

**Causes et solutions :**

| Cause | Solution |
|-------|---------|
| Différence de température | Fermer la porte frontale de l'imprimante |
| Brim manquant | Activer le brim dans Bambu Studio (3–5 mm) |
| Plateau trop froid | Augmenter la température du plateau de 5–10°C |
| Filament avec retrait élevé (ABS) | Utiliser Engineering Plate + chambre >40°C |

**L'ABS et l'ASA sont particulièrement sensibles.** Toujours s'assurer :
- Porte frontale fermée
- Ventilation minimale
- Engineering Plate + bâton de colle
- Température de chambre 40°C+

---

### Stringing (fils entre les pièces)

**Symptômes :** Fins fils de plastique entre les parties séparées du modèle

**Causes et solutions :**

| Cause | Solution |
|-------|---------|
| Filament humide | Sécher le filament 6–8 heures (60–70°C) |
| Température de buse trop élevée | Réduire de 5°C |
| Rétraction insuffisante | Augmenter la longueur de rétraction dans Bambu Studio |
| Vitesse de déplacement trop faible | Augmenter la vitesse de déplacement à 200+ mm/s |

**Test d'humidité :** Écoutez les claquements ou cherchez des bulles dans l'extrusion — cela indique un filament humide. L'AMS Bambu a une mesure d'humidité intégrée ; vérifiez l'humidité sous **Statut AMS**.

:::tip Séchoir à filament
Investissez dans un séchoir à filament (par ex. Bambu Filament Dryer) si vous travaillez avec du nylon ou du TPU — ceux-ci absorbent l'humidité en moins de 12 heures.
:::

---

### Spaghetti (l'impression s'effondre en un amas)

**Symptômes :** Le filament pend en fils lâches dans l'air, l'impression est méconnaissable

**Causes et solutions :**

| Cause | Solution |
|-------|---------|
| Mauvaise adhérence tôt → détaché → effondré | Voir la section adhérence ci-dessus |
| Vitesse trop élevée | Réduire la vitesse de 20–30% |
| Mauvaise configuration des supports | Activer les supports dans Bambu Studio |
| Surplomb trop prononcé | Diviser le modèle ou le faire pivoter de 45° |

**Utilisez Print Guard pour arrêter automatiquement les spaghettis** — voir la section suivante.

---

### Sous-extrusion (couches minces et faibles)

**Symptômes :** Les couches ne sont pas solides, trous dans les parois, modèle fragile

**Causes et solutions :**

| Cause | Solution |
|-------|---------|
| Buse partiellement bouchée | Effectuer un Cold Pull (voir maintenance) |
| Filament trop humide | Sécher le filament |
| Température trop basse | Augmenter la température de buse de 5–10°C |
| Vitesse trop élevée | Réduire de 20–30% |
| Tube PTFE endommagé | Inspecter et remplacer le tube PTFE |

## Utiliser Print Guard pour une protection automatique

Print Guard surveille les images de la caméra avec reconnaissance d'image et arrête automatiquement l'impression si des spaghettis sont détectés.

**Activer Print Guard :**
1. Allez dans **Surveillance → Print Guard**
2. Activez la **Détection automatique**
3. Choisissez l'action : **Pause** (recommandé) ou **Annuler**
4. Définissez la sensibilité (commencez par **Moyenne**)

**Lorsque Print Guard intervient :**
1. Vous recevez une notification avec une photo de caméra de ce qui a été détecté
2. L'impression est mise en pause
3. Vous pouvez choisir : **Continuer** (si faux positif) ou **Annuler l'impression**

:::info Faux positifs
Print Guard peut parfois réagir aux modèles comportant de nombreuses colonnes fines. Réduisez la sensibilité ou désactivez temporairement pour les modèles complexes.
:::

## Outils de diagnostic dans le tableau de bord

### Journal des températures
Sous **Historique → [Impression] → Températures**, vous pouvez voir la courbe de température tout au long de l'impression. Recherchez :
- Des chutes soudaines de température (problème de buse ou de plateau)
- Des températures irrégulières (besoin de calibration)

### Statistiques de filament
Vérifiez si le filament consommé correspond à l'estimation. Un grand écart peut indiquer une sous-extrusion ou une rupture de filament.

## Quand contacter le support ?

Contactez le support Bambu Labs si :
- Le code HMS se répète après avoir suivi toutes les solutions proposées
- Vous constatez des dommages mécaniques sur l'imprimante (tiges pliées, engrenages cassés)
- Les valeurs de température sont impossibles (par ex. la buse indique -40°C)
- Une mise à jour du firmware ne résout pas le problème

**Utile à préparer pour le support :**
- Codes d'erreur HMS du journal d'erreurs du tableau de bord
- Photo de caméra de l'erreur
- Quel filament et quels paramètres ont été utilisés (peut être exporté depuis l'historique)
- Modèle d'imprimante et version du firmware (affiché sous **Paramètres → Imprimante → Info**)
