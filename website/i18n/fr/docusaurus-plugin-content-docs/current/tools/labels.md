---
sidebar_position: 1
title: Étiquettes
description: Générez des QR codes, des étiquettes de bobine pour imprimantes thermiques (ZPL), des cartes de couleurs et des palettes de couleurs partagées pour le stock de filament
---

# Étiquettes

L'outil d'étiquettes génère des étiquettes professionnelles pour vos bobines de filament — QR codes, étiquettes de bobine pour imprimantes thermiques et cartes de couleurs pour l'identification visuelle.

Accédez à : **https://localhost:3443/#labels**

## QR codes

Générez des QR codes qui renvoient vers les informations du filament dans le tableau de bord :

1. Accédez à **Étiquettes → QR codes**
2. Sélectionnez la bobine pour laquelle vous souhaitez générer un QR code
3. Le QR code est automatiquement généré et s'affiche dans l'aperçu
4. Cliquez sur **Télécharger PNG** ou **Imprimer**

Le QR code contient une URL vers le profil du filament dans le tableau de bord. Scannez avec votre téléphone pour accéder rapidement aux informations de la bobine.

### Génération en lot

1. Cliquez sur **Tout sélectionner** ou cochez des bobines individuelles
2. Cliquez sur **Générer tous les QR codes**
3. Téléchargez en ZIP avec un PNG par bobine, ou imprimez tout en une fois

## Étiquettes de bobine

Étiquettes professionnelles pour imprimantes thermiques avec toutes les informations de la bobine :

### Contenu de l'étiquette (standard)

- Couleur de la bobine (bloc de couleur rempli)
- Nom du matériau (grande police)
- Fournisseur
- Code hexadécimal de la couleur
- Recommandations de température (buse et plateau)
- QR code
- Code-barres (facultatif)

### ZPL pour imprimantes thermiques

Générez du code ZPL (Zebra Programming Language) pour les imprimantes Zebra, Brother et Dymo :

1. Accédez à **Étiquettes → Impression thermique**
2. Sélectionnez la taille de l'étiquette : **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Sélectionnez la ou les bobines
4. Cliquez sur **Générer ZPL**
5. Envoyez le code ZPL à l'imprimante via :
   - **Imprimer directement** (connexion USB)
   - **Copier le ZPL** et envoyer via commande terminal
   - **Télécharger le fichier .zpl**

:::tip Configuration de l'imprimante
Pour l'impression automatique, configurez la station d'impression sous **Paramètres → Imprimante d'étiquettes** avec l'adresse IP et le port (standard : 9100 pour TCP RAW).
:::

### Étiquettes PDF

Pour les imprimantes ordinaires, générez un PDF avec les bonnes dimensions :

1. Sélectionnez la taille de l'étiquette depuis le modèle
2. Cliquez sur **Générer PDF**
3. Imprimez sur du papier autocollant (Avery ou équivalent)

## Cartes de couleurs

Les cartes de couleurs sont une grille compacte montrant visuellement toutes les bobines :

1. Accédez à **Étiquettes → Cartes de couleurs**
2. Choisissez les bobines à inclure (toutes les actives, ou sélectionnez manuellement)
3. Choisissez le format de carte : **A4** (4×8), **A3** (6×10), **Letter**
4. Cliquez sur **Générer PDF**

Chaque case affiche :
- Bloc de couleur avec la couleur réelle
- Nom du matériau et code hexadécimal de la couleur
- Numéro du matériau (pour référence rapide)

Idéal à plastifier et à afficher près de la station d'impression.

## Palettes de couleurs partagées

Exportez une sélection de couleurs sous forme de palette partagée :

1. Accédez à **Étiquettes → Palettes de couleurs**
2. Sélectionnez les bobines à inclure dans la palette
3. Cliquez sur **Partager la palette**
4. Copiez le lien — d'autres peuvent importer la palette dans leur tableau de bord
5. La palette s'affiche avec les codes hexadécimaux et peut être exportée vers **Adobe Swatch** (`.ase`) ou **Procreate** (`.swatches`)
