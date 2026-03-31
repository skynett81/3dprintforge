---
sidebar_position: 3
title: Profils d'impression
description: Créez, modifiez et gérez des profils d'impression avec des paramètres préréglés pour une impression rapide et cohérente
---

# Profils d'impression

Les profils d'impression sont des ensembles de paramètres d'impression enregistrés que vous pouvez réutiliser entre les impressions et les imprimantes. Gagnez du temps et assurez une qualité cohérente en définissant des profils pour différentes utilisations.

Accédez à : **https://localhost:3443/#profiles**

## Créer un profil

1. Accédez à **Outils → Profils d'impression**
2. Cliquez sur **Nouveau profil** (icône +)
3. Renseignez :
   - **Nom du profil** — nom descriptif, ex. « PLA - Production rapide »
   - **Matériau** — sélectionnez dans la liste (PLA / PETG / ABS / PA / PC / TPU / etc.)
   - **Modèle d'imprimante** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Tous
   - **Description** — texte facultatif

4. Renseignez les paramètres (voir les sections ci-dessous)
5. Cliquez sur **Enregistrer le profil**

## Paramètres d'un profil

### Température
| Champ | Exemple |
|-------|---------|
| Température de la buse | 220 °C |
| Température du plateau | 60 °C |
| Température de la chambre (X1C) | 35 °C |

### Vitesse
| Champ | Exemple |
|-------|---------|
| Réglage de vitesse | Standard |
| Vitesse maximale (mm/s) | 200 |
| Accélération | 5000 mm/s² |

### Qualité
| Champ | Exemple |
|-------|---------|
| Épaisseur de couche | 0,2 mm |
| Pourcentage de remplissage | 15 % |
| Motif de remplissage | Grid |
| Matériau de support | Auto |

### AMS et couleurs
| Champ | Description |
|-------|-------------|
| Volume de purge | Quantité de rinçage lors des changements de couleur |
| Emplacements préférés | Emplacements AMS préférés |

### Avancé
| Champ | Description |
|-------|-------------|
| Mode de séchage | Activer le séchage AMS pour les matériaux humides |
| Temps de refroidissement | Pause entre les couches pour le refroidissement |
| Vitesse du ventilateur | Vitesse du ventilateur de refroidissement en pourcentage |

## Modifier un profil

1. Cliquez sur le profil dans la liste
2. Cliquez sur **Modifier** (icône crayon)
3. Apportez vos modifications
4. Cliquez sur **Enregistrer** (écraser) ou **Enregistrer comme nouveau** (crée une copie)

:::tip Versionnement
Utilisez « Enregistrer comme nouveau » pour conserver un profil fonctionnel pendant que vous expérimentez des modifications.
:::

## Utiliser un profil

### Depuis la bibliothèque de fichiers

1. Sélectionnez un fichier dans la bibliothèque
2. Cliquez sur **Envoyer à l'imprimante**
3. Sélectionnez le **Profil** dans la liste déroulante
4. Les paramètres du profil sont appliqués

### Depuis la file d'impression

1. Créez une nouvelle tâche de file
2. Sélectionnez le **Profil** sous les paramètres
3. Le profil est associé à la tâche de file

## Importer et exporter des profils

### Export
1. Sélectionnez un ou plusieurs profils
2. Cliquez sur **Exporter**
3. Sélectionnez le format : **JSON** (pour import dans d'autres tableaux de bord) ou **PDF** (pour impression/documentation)

### Import
1. Cliquez sur **Importer des profils**
2. Sélectionnez un fichier `.json` exporté depuis un autre 3DPrintForge
3. Les profils existants avec le même nom peuvent être écrasés ou conservés tous les deux

## Partager des profils

Partagez des profils avec d'autres via le module de filaments communautaires (voir [Filaments communautaires](../integrations/community)) ou via l'export JSON direct.

## Profil par défaut

Définissez un profil par défaut par matériau :

1. Sélectionnez le profil
2. Cliquez sur **Définir comme défaut pour [matériau]**
3. Le profil par défaut est automatiquement sélectionné quand vous envoyez un fichier avec ce matériau
