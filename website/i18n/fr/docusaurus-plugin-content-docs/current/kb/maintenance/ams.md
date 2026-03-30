---
sidebar_position: 3
title: Maintenance AMS
description: Maintenance de l'AMS — tubes PTFE, chemin du filament et prévention de l'humidité
---

# Maintenance AMS

L'AMS (Automatic Material System) est un système précis qui nécessite un entretien régulier pour fonctionner de manière fiable. Les problèmes les plus courants sont un chemin de filament encrassé et l'humidité dans le boîtier.

## Tubes PTFE

Les tubes PTFE transportent le filament de l'AMS à l'imprimante. Ils sont parmi les premières pièces à s'user.

### Inspection
Vérifiez les tubes PTFE pour :
- **Pliures ou courbures** — obstruent le flux de filament
- **Usure aux raccords** — poudre blanche autour des entrées
- **Déformation de la forme** — particulièrement lors de l'utilisation de matériaux CF

### Remplacement des tubes PTFE
1. Libérez le filament de l'AMS (exécutez le cycle de déchargement)
2. Appuyez sur la bague de verrouillage bleue autour du tube au niveau du raccord
3. Tirez le tube (nécessite une bonne prise)
4. Coupez le nouveau tube à la bonne longueur (pas plus court que l'original)
5. Poussez jusqu'à l'arrêt et verrouillez

:::tip AMS Lite vs. AMS
L'AMS Lite (A1/A1 Mini) a une configuration PTFE plus simple que l'AMS complet (P1S/X1C). Les tubes sont plus courts et plus faciles à remplacer.
:::

## Chemin du filament

### Nettoyage de la voie du filament
Les filaments laissent de la poussière et des résidus dans la voie, surtout les matériaux CF :

1. Exécutez le déchargement de tous les emplacements
2. Utilisez de l'air comprimé ou un pinceau doux pour souffler la poussière libre
3. Faites passer un morceau de nylon propre ou du filament de nettoyage PTFE dans la voie

### Capteurs
L'AMS utilise des capteurs pour détecter la position du filament et les ruptures. Gardez les fenêtres des capteurs propres :
- Essuyez délicatement les lentilles des capteurs avec un pinceau propre
- Évitez l'IPA directement sur les capteurs

## Humidité

L'AMS ne protège pas le filament contre l'humidité. Pour les matériaux hygroscopiques (PA, PETG, TPU), il est recommandé de :

### Alternatives AMS sèches
- **Boîte hermétique :** Placez les bobines dans une boîte étanche avec du gel de silice
- **Bambu Dry Box :** Accessoire boîte de séchage officielle
- **Alimenteur externe :** Utilisez un alimenteur de filament hors de l'AMS pour les matériaux sensibles

### Indicateurs d'humidité
Placez des cartes indicatrices d'humidité (hygromètre) dans le boîtier AMS. Remplacez les sachets de gel de silice quand l'humidité relative dépasse 30%.

## Roues d'entraînement et mécanisme de serrage

### Inspection
Vérifiez les roues d'entraînement (roues d'extrudeur dans l'AMS) pour :
- Résidus de filament entre les dents
- Usure des dentures
- Friction irrégulière lors de la traction manuelle

### Nettoyage
1. Utilisez une brosse à dents ou une brosse pour éliminer les résidus entre les dents
2. Soufflez avec de l'air comprimé
3. Évitez les huiles et lubrifiants — le niveau de traction est calibré pour un fonctionnement à sec

## Intervalles de maintenance

| Activité | Intervalle |
|-----------|---------|
| Inspection visuelle des tubes PTFE | Mensuel |
| Nettoyage de la voie du filament | Toutes les 100 heures |
| Contrôle des capteurs | Mensuel |
| Remplacement du gel de silice (avec séchage) | Selon les besoins (à 30%+ HR) |
| Remplacement des tubes PTFE | En cas d'usure visible |
