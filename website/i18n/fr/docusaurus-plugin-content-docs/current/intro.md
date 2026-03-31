---
sidebar_position: 1
title: Bienvenue sur 3DPrintForge
description: Un tableau de bord puissant et auto-hébergé pour les imprimantes 3D Bambu Lab
---

# Bienvenue sur 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** est un panneau de contrôle complet et auto-hébergé pour les imprimantes 3D Bambu Lab. Il vous offre une vue d'ensemble et un contrôle total sur votre imprimante, le stock de filaments, l'historique d'impression et bien plus — le tout depuis un seul onglet de navigateur.

## Qu'est-ce que 3DPrintForge ?

3DPrintForge se connecte directement à votre imprimante via MQTT sur le réseau local, sans dépendance aux serveurs Bambu Lab. Vous pouvez également vous connecter à Bambu Cloud pour synchroniser les modèles et l'historique d'impression.

### Fonctionnalités principales

- **Tableau de bord en direct** — températures en temps réel, progression, caméra, statut AMS avec indicateur LIVE
- **Stock de filaments** — suivez toutes les bobines avec synchronisation AMS, support bobine EXT, infos matériau, compatibilité plateau et guide de séchage
- **Suivi des filaments** — suivi précis avec 4 niveaux de repli (capteur AMS → estimation EXT → cloud → durée)
- **Guide des matériaux** — 15 matériaux avec températures, compatibilité plateau, séchage, propriétés et conseils
- **Historique d'impression** — journal complet avec noms de modèles, liens MakerWorld, consommation de filament et coûts
- **Planificateur** — vue calendrier, file d'attente d'impression avec équilibrage de charge et vérification du filament
- **Contrôle de l'imprimante** — température, vitesse, ventilateurs, console G-code
- **Print Guard** — protection automatique avec xcam + 5 moniteurs de capteurs
- **Estimateur de coût** — matériau, électricité, main-d'œuvre, usure, marge avec prix de vente suggéré
- **Maintenance** — suivi avec intervalles basés sur la KB, durée de vie de la buse, durée de vie du plateau et guide
- **Alertes sonores** — 9 événements configurables avec téléchargement de son personnalisé et haut-parleur d'imprimante (M300)
- **Journal d'activité** — chronologie persistante de tous les événements (impressions, erreurs, maintenance, filament)
- **Notifications** — 7 canaux (Telegram, Discord, e-mail, ntfy, Pushover, SMS, webhook)
- **Multi-imprimante** — prend en charge toute la gamme Bambu Lab
- **17 langues** — norvégien, anglais, allemand, français, espagnol, italien, japonais, coréen, néerlandais, polonais, portugais, suédois, turc, ukrainien, chinois, tchèque, hongrois
- **Auto-hébergé** — aucune dépendance au cloud, vos données sur votre machine

### Nouveautés de la v1.1.14

- **Intégration AdminLTE 4** — restructuration HTML complète avec sidebar treeview, mise en page moderne et support CSP pour CDN
- **Système CRM** — gestion complète des clients avec 4 panneaux : clients, commandes, factures et paramètres d'entreprise avec intégration de l'historique
- **UI moderne** — accent teal, titres en dégradé, lueur au survol, orbes flottants et thème sombre amélioré
- **Achievements : 18 monuments** — drakkar viking, Statue de la Liberté, Eiffel Tower, Big Ben, Porte de Brandebourg, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, moulin à vent néerlandais, Dragon de Wawel, Cristo Redentor, Turning Torso, Hagia Sophia, La Mère Patrie, Grande Muraille de Chine, Horloge astronomique de Prague, Parlement de Budapest — avec popup de détails, XP et rareté
- **Humidité/température AMS** — évaluation à 5 niveaux avec recommandations de stockage et de séchage
- **Suivi de filament en direct** — mise à jour en temps réel pendant l'impression via le fallback d'estimation cloud
- **Redesign de la section filament** — grandes bobines avec infos complètes (marque, poids, température, RFID, couleur), disposition horizontale et clic pour les détails
- **Bobine EXT en ligne** — bobine externe affichée aux côtés des bobines AMS avec meilleure utilisation de l'espace
- **Disposition du dashboard optimisée** — 2 colonnes par défaut pour les écrans 24–27", grande vue 3D/caméra, filament/AMS compact
- **Temps de changement de filament** dans l'estimateur de coût avec compteur de changement visible
- **Système d'alertes global** — barre d'alerte avec notifications toast en bas à droite, ne bloque pas la navbar
- **Visite guidée i18n** — les 14 clés de la visite traduites en 17 langues
- **5 nouvelles pages KB** — matrice de compatibilité et nouveaux guides de filament traduits en 17 langues
- **i18n complet** — toutes les 3252 clés traduites en 17 langues, y compris CRM et achievements de monuments

## Démarrage rapide

| Tâche | Lien |
|-------|------|
| Installer le tableau de bord | [Installation](./getting-started/installation) |
| Configurer la première imprimante | [Configuration](./getting-started/setup) |
| Connecter Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Explorer toutes les fonctionnalités | [Fonctionnalités](./features/overview) |
| Guide des filaments | [Guide des matériaux](./kb/filaments/guide) |
| Guide de maintenance | [Maintenance](./kb/maintenance/nozzle) |
| Documentation API | [API](./advanced/api) |

:::tip Mode démo
Vous pouvez essayer le tableau de bord sans imprimante physique en exécutant `npm run demo`. Cela démarre 3 imprimantes simulées avec des cycles d'impression en direct.
:::

## Imprimantes prises en charge

Toutes les imprimantes Bambu Lab avec le mode LAN :

- **Série X1** : X1C, X1C Combo, X1E
- **Série P1** : P1S, P1S Combo, P1P
- **Série P2** : P2S, P2S Combo
- **Série A** : A1, A1 Combo, A1 mini
- **Série H2** : H2S, H2D (double buse), H2C (changeur d'outils, 6 têtes)

## Fonctionnalités en détail

### Suivi des filaments

Le tableau de bord suit automatiquement la consommation de filament avec 4 niveaux de repli :

1. **Diff capteur AMS** — le plus précis, compare le remain% de début/fin
2. **EXT direct** — pour P2S/A1 sans vt_tray, utilise l'estimation cloud
3. **Estimation cloud** — données des travaux d'impression Bambu Cloud
4. **Estimation par durée** — ~30 g/heure comme dernier recours

Toutes les valeurs sont affichées comme le minimum entre le capteur AMS et la base de données des bobines pour éviter les erreurs après des impressions échouées.

### Guide des matériaux

Base de données intégrée avec 15 matériaux incluant :
- Températures (buse, plateau, enceinte)
- Compatibilité plateau (Cool, Engineering, High Temp, Textured PEI)
- Informations de séchage (température, durée, hygroscopicité)
- 8 propriétés (résistance, flexibilité, résistance à la chaleur, UV, surface, facilité d'utilisation)
- Niveau de difficulté et exigences spéciales (buse durcie, enceinte)

### Alertes sonores

9 événements configurables avec prise en charge de :
- **Clips audio personnalisés** — téléchargez des MP3/OGG/WAV (max 10 secondes, 500 Ko)
- **Tonalités intégrées** — sons métalliques/synthétiques générés avec l'API Web Audio
- **Haut-parleur d'imprimante** — mélodies G-code M300 directement sur le buzzer de l'imprimante
- **Compte à rebours** — alerte sonore quand il reste 1 minute d'impression

### Maintenance

Système de maintenance complet avec :
- Suivi des composants (buse, tube PTFE, tiges, roulements, AMS, plateau, séchage)
- Intervalles basés sur la KB issus de la documentation
- Durée de vie des buses par type (laiton, acier durci, HS01)
- Durée de vie des plateaux par type (Cool, Engineering, High Temp, Textured PEI)
- Onglet guide avec conseils et liens vers la documentation complète

## Aperçu technique

3DPrintForge est construit avec Node.js 22 et du HTML/CSS/JS natif — pas de frameworks lourds, pas d'étape de compilation. La base de données est SQLite, intégrée à Node.js 22.

- **Backend** : Node.js 22 avec seulement 3 paquets npm (mqtt, ws, basic-ftp)
- **Frontend** : Vanilla HTML/CSS/JS, pas d'étape de compilation
- **Base de données** : SQLite via le built-in Node.js 22 `--experimental-sqlite`
- **Documentation** : Docusaurus avec 17 langues, générée automatiquement lors de l'installation
- **API** : 177+ points de terminaison, documentation OpenAPI sur `/api/docs`

Voir [Architecture](./advanced/architecture) pour les détails.
