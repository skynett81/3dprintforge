---
sidebar_position: 5
title: Succès
description: Système de gamification avec succès débloquables, niveaux de rareté et jalons pour l'impression Bambu Lab
---

# Succès

Les succès (achievements) sont un élément de gamification qui récompense les jalons et les moments mémorables de votre aventure d'impression. Collectionnez des succès et suivez votre progression vers le prochain déblocage.

Accédez à : **https://localhost:3443/#achievements**

## Niveaux de rareté

Les succès sont classés en quatre niveaux de rareté :

| Niveau | Couleur | Description |
|--------|---------|-------------|
| **Commun** | Gris | Jalons simples, faciles à atteindre |
| **Peu commun** | Vert | Nécessite un peu d'effort ou de temps |
| **Rare** | Bleu | Nécessite un effort dédié dans le temps |
| **Légendaire** | Or | Exploits extraordinaires |

## Exemples de succès

### Jalons d'impression (Commun / Peu commun)
| Succès | Condition |
|--------|-----------|
| Première impression | Terminez votre toute première impression |
| Une journée entière | Imprimez plus de 24 heures au total |
| Taux de succès élevé | 10 impressions réussies consécutives |
| Collectionneur de filament | Enregistrez 10 types de filament différents |
| Multicolore | Terminez une impression multicolore |

### Succès de volume (Peu commun / Rare)
| Succès | Condition |
|--------|-----------|
| Le kilogramme | Utilisez 1 kg de filament au total |
| 10 kg | Utilisez 10 kg de filament au total |
| 100 impressions | 100 impressions réussies |
| 500 heures | 500 heures d'impression cumulées |
| Quart de nuit | Terminez une impression de plus de 20 heures |

### Maintenance et soin (Peu commun / Rare)
| Succès | Condition |
|--------|-----------|
| Consciencieux | Enregistrez une tâche de maintenance |
| Soigneur d'imprimante | 10 tâches de maintenance enregistrées |
| Zéro déchet | Créez une impression avec > 90 % d'efficacité matériau |
| Maître des buses | Remplacez la buse 5 fois (documenté) |

### Succès légendaires
| Succès | Condition |
|--------|-----------|
| Infatigable | 1000 impressions réussies |
| Titan du filament | 50 kg de consommation totale de filament |
| Semaine sans faute | 7 jours sans une seule impression échouée |
| Bibliothécaire d'impression | 100 modèles différents dans la bibliothèque de fichiers |

## Consulter les succès

La page des succès affiche :

- **Débloqués** — succès que vous avez obtenus (avec la date)
- **Proches** — succès que vous êtes sur le point d'obtenir (barre de progression)
- **Verrouillés** — tous les succès que vous n'avez pas encore obtenus

Filtrez par **Niveau**, **Catégorie** ou **Statut** (débloqué / en cours / verrouillé).

## Barre de progression

Pour les succès avec comptage, une barre de progression s'affiche :

```
Le kilogramme — 1 kg de filament
[████████░░] 847 g / 1000 g (84,7 %)
```

## Notifications

Vous êtes automatiquement notifié quand vous obtenez un nouveau succès :
- **Popup dans le navigateur** avec le nom du succès et son graphique
- Facultatif : notification via Telegram / Discord (configurez sous **Paramètres → Notifications → Succès**)

## Support multi-utilisateurs

Dans les systèmes avec plusieurs utilisateurs, chaque utilisateur a son propre profil de succès. Un **classement** affiche le rang par :

- Nombre total de succès débloqués
- Nombre total d'impressions
- Heures d'impression totales

:::tip Mode privé
Désactivez le classement sous **Paramètres → Succès → Masquer du classement** pour garder votre profil privé.
:::
