---
sidebar_position: 6
title: ASA
description: Guide d'impression ASA avec Bambu Lab — résistant aux UV, usage extérieur, températures et conseils
---

# ASA

L'ASA (Acrylonitrile Styrène Acrylate) est une variante de l'ABS résistante aux UV, spécialement développée pour une utilisation en extérieur. Ce matériau combine la résistance et la rigidité de l'ABS avec une bien meilleure tenue aux rayons UV, au vieillissement et aux intempéries.

## Paramètres

| Paramètre | Valeur |
|-----------|--------|
| Température buse | 240–260 °C |
| Température plateau | 90–110 °C |
| Température chambre | 40–50 °C (recommandé) |
| Refroidissement pièce | 30–50% |
| Vitesse | 80–100% |
| Séchage nécessaire | Oui |

## Plateaux recommandés

| Plateau | Compatibilité | Bâton de colle ? |
|---------|--------------|-----------------|
| Engineering Plate | Excellent | Non |
| High Temp Plate | Bon | Oui |
| Textured PEI | Acceptable | Oui |
| Cool Plate (Smooth PEI) | Non recommandé | — |

:::tip L'Engineering Plate est idéale pour l'ASA
L'Engineering Plate offre l'adhérence la plus fiable pour l'ASA sans bâton de colle. Le plateau résiste aux températures élevées et assure une bonne adhésion sans que la pièce ne colle de manière permanente.
:::

## Exigences de l'imprimante

L'ASA nécessite une **chambre fermée (enceinte)** pour de meilleurs résultats. Sans enceinte, vous rencontrerez :

- **Warping** — les coins se soulèvent du plateau
- **Délamination** — mauvaise liaison entre les couches
- **Fissures de surface** — fissures visibles le long de l'impression

| Imprimante | Adaptée pour l'ASA ? | Remarque |
|------------|---------------------|----------|
| X1C | Excellent | Entièrement fermée, chauffage actif |
| X1E | Excellent | Entièrement fermée, chauffage actif |
| P1S | Bon | Fermée, chauffage passif |
| P1P | Possible avec accessoire | Nécessite un accessoire d'enceinte |
| A1 | Non recommandé | Cadre ouvert |
| A1 Mini | Non recommandé | Cadre ouvert |

## ASA vs ABS — comparaison

| Propriété | ASA | ABS |
|-----------|-----|-----|
| Résistance UV | Excellente | Mauvaise |
| Usage extérieur | Oui | Non (jaunit et devient cassant) |
| Warping | Modéré | Élevé |
| Surface | Mate, uniforme | Mate, uniforme |
| Résistance chimique | Bonne | Bonne |
| Prix | Légèrement plus élevé | Plus bas |
| Odeur pendant l'impression | Modérée | Forte |
| Résistance aux chocs | Bonne | Bonne |
| Résistance thermique | ~95–105 °C | ~95–105 °C |

:::warning Ventilation
L'ASA émet des vapeurs irritantes pendant l'impression. Imprimez dans une pièce bien ventilée ou avec un système de filtration d'air. N'imprimez pas l'ASA dans une pièce où vous séjournez longtemps sans ventilation.
:::

## Séchage

L'ASA est **moyennement hygroscopique** et absorbe l'humidité de l'air au fil du temps.

| Paramètre | Valeur |
|-----------|--------|
| Température de séchage | 65 °C |
| Durée de séchage | 4–6 heures |
| Niveau hygroscopique | Moyen |
| Signes d'humidité | Crépitements, bulles, mauvaise surface |

- Conserver dans un sachet scellé avec du gel de silice après ouverture
- L'AMS avec déshydratant est suffisant pour le stockage à court terme
- Pour un stockage prolongé : utiliser des sachets sous vide ou une boîte de séchage

## Applications

L'ASA est le matériau préféré pour tout ce qui sera utilisé **en extérieur** :

- **Composants automobiles** — boîtiers de rétroviseurs, détails de tableau de bord, caches de ventilation
- **Outils de jardin** — supports, pinces, pièces pour mobilier de jardin
- **Signalétique extérieure** — panneaux, lettres, logos
- **Pièces de drone** — trains d'atterrissage, supports de caméra
- **Montages de panneaux solaires** — supports et angles
- **Pièces de boîte aux lettres** — mécanismes et décorations

## Conseils pour une impression ASA réussie

### Brim et adhésion

- **Utilisez un brim** pour les grandes pièces et celles avec une petite surface de contact
- Un brim de 5–8 mm prévient efficacement le warping
- Pour les petites pièces, essayez sans brim, mais gardez-le en option de secours

### Éviter les courants d'air

- **Fermez toutes les portes et fenêtres** de la pièce pendant l'impression
- Les courants d'air et l'air froid sont les pires ennemis de l'ASA
- N'ouvrez pas la porte de la chambre pendant l'impression

### Stabilité de température

- Laissez la chambre chauffer pendant **10–15 minutes** avant le début de l'impression
- Une température de chambre stable donne des résultats plus réguliers
- Évitez de placer l'imprimante près de fenêtres ou de bouches d'aération

### Refroidissement

- L'ASA nécessite un **refroidissement limité** — 30–50% est typique
- Pour les surplombs et les ponts, augmentez à 60–70%, mais attendez-vous à une certaine délamination
- Pour les pièces mécaniques : privilégiez la liaison entre couches plutôt que les détails en réduisant le refroidissement

:::tip Première fois avec l'ASA ?
Commencez par une petite pièce test (par ex., un cube de 30 mm) pour calibrer vos paramètres. L'ASA se comporte très similairement à l'ABS, mais avec une tendance au warping légèrement moindre. Si vous avez de l'expérience avec l'ABS, l'ASA vous semblera être une amélioration.
:::

---

## Retrait

L'ASA se rétracte plus que le PLA et le PETG, mais généralement un peu moins que l'ABS :

| Matériau | Retrait |
|----------|---------|
| PLA | ~0,3–0,5% |
| PETG | ~0,3–0,6% |
| ASA | ~0,5–0,7% |
| ABS | ~0,7–0,8% |

Pour les pièces avec des tolérances serrées : compensez de 0,5–0,7% dans le slicer, ou testez d'abord avec des pièces d'essai.

---

## Post-traitement

- **Lissage à l'acétone** — l'ASA peut être lissé aux vapeurs d'acétone, tout comme l'ABS
- **Ponçage** — se ponce bien avec du papier de verre grain 200–400
- **Collage** — la colle CA ou le soudage à l'acétone fonctionnent parfaitement
- **Peinture** — accepte bien la peinture après un léger ponçage

:::danger Manipulation de l'acétone
L'acétone est inflammable et émet des vapeurs toxiques. Utilisez toujours dans un local bien ventilé, évitez les flammes nues et portez des équipements de protection (gants et lunettes).
:::
