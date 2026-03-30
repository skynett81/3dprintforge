---
sidebar_position: 4
title: Výběr správné tiskové desky
description: Přehled tiskových desek Bambu Labs a která nejlépe odpovídá vašemu filamentu
---

# Výběr správné tiskové desky

Správná tisková deska je zásadní pro dobrou přilnavost a snadné odebrání výtisku. Špatná kombinace vede ke špatné přilnavosti nebo k tomu, že výtisk uvízne a poškodí desku.

## Přehledová tabulka

| Filament | Doporučená deska | Tyčinka lepidla | Teplota desky |
|----------|-----------------|-----------------|---------------|
| PLA | Cool Plate / Textured PEI | Ne / Ano | 35–45°C |
| PETG | Textured PEI | **Ano (povinné)** | 70°C |
| ABS | Engineering Plate / High Temp | Ano | 90–110°C |
| ASA | Engineering Plate / High Temp | Ano | 90–110°C |
| TPU | Textured PEI | Ne | 35–45°C |
| PA (Nylon) | Engineering Plate | Ano | 90°C |
| PC | High Temp Plate | Ano | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Ano | 45–90°C |
| PVA | Cool Plate | Ne | 35°C |

## Popis desek

### Cool Plate (Hladký PEI)
**Nejlepší pro:** PLA, PVA
**Povrch:** Hladký, dává výtisku hladkou spodní stranu
**Odebrání:** Lehce ohněte desku nebo počkejte, až vychladne — výtisk se sám uvolní

Nepoužívejte Cool Plate s PETG — přilne **příliš silně** a může poškodit povrchovou vrstvu desky.

### Textured PEI (Texturovaná)
**Nejlepší pro:** PETG, TPU, PLA (dává drsný povrch)
**Povrch:** Texturovaný, dává výtisku hrubou a estetickou spodní stranu
**Odebrání:** Počkejte na pokojovou teplotu — výtisk se sám odloupne

:::warning PETG vyžaduje tyčinku lepidla na Textured PEI
Bez tyčinky lepidla se PETG extrémně silně přilne k Textured PEI a při odebrání může poškodit povrch. Vždy naneste tenkou vrstvu tyčinky lepidla (lepidlo Bambu nebo Elmer's Disappearing Purple Glue) na celý povrch.
:::

### Engineering Plate
**Nejlepší pro:** ABS, ASA, PA, PLA-CF, PETG-CF
**Povrch:** Matový povrch PEI s nižší přilnavostí než Textured PEI
**Odebrání:** Snadno se odebírá po vychladnutí. Pro ABS/ASA použijte lepidlo

### High Temp Plate
**Nejlepší pro:** PC, PA-CF, ABS při vysokých teplotách
**Povrch:** Snese teplotu desky až 120°C bez deformace
**Odebrání:** Ochlaďte na pokojovou teplotu

## Časté chyby

### PETG na hladkém Cool Plate (bez lepidla)
**Problém:** PETG přilne tak silně, že výtisk nelze odebrat bez poškození
**Řešení:** Vždy používejte Textured PEI s lepidlem nebo Engineering Plate

### ABS na Cool Plate
**Problém:** Warping — rohy se zdvihají při tisku
**Řešení:** Engineering Plate + lepidlo + zvýšení teploty komory (zavřete přední dvířka)

### PLA na High Temp Plate
**Problém:** Příliš vysoká teplota desky způsobuje nadměrnou přilnavost, obtížné odebrání
**Řešení:** Cool Plate nebo Textured PEI pro PLA

### Příliš mnoho lepidla
**Problém:** Silná vrstva lepidla způsobuje "sloní nohu" (rozlitá první vrstva)
**Řešení:** Jedna tenká vrstva — lepidlo by mělo být sotva viditelné

## Výměna desky

1. **Nechte desku vychladnout** na pokojovou teplotu (nebo použijte rukavice — deska může být horká)
2. Zvedněte desku zepředu a vytáhněte ji
3. Vložte novou desku — magnet ji drží na místě
4. **Spusťte automatickou kalibraci** (Flow Rate a Bed Leveling) po výměně v Bambu Studiu nebo přes panel v **Ovládání → Kalibrace**

:::info Nezapomeňte kalibrovat po výměně
Desky mají mírně rozdílnou tloušťku. Bez kalibrace může být první vrstva příliš daleko nebo narazit do desky.
:::

## Údržba desek

### Čištění (po každých 2–5 tiscích)
- Otřete IPA (isopropanolem 70–99%) a papírovým ubrouskem bez chlupů
- Vyhněte se dotýkání povrchu holýma rukama — tuk z kůže snižuje přilnavost
- Pro Textured PEI: umyjte vlažnou vodou a jemným saponátem po mnoha tiscích

### Odstranění zbytků lepidla
- Zahřejte desku na 60°C
- Otřete vlhkým hadříkem
- Dokončete otřením IPA

### Výměna
Vyměňte desku, když vidíte:
- Viditelné jamky nebo stopy po odebrání výtisků
- Trvale špatnou přilnavost i po čištění
- Bubliny nebo skvrny v povrchové vrstvě

Desky Bambu typicky vydrží 200–500 tisků v závislosti na typu filamentu a zacházení.

:::tip Správné skladování desek
Uchovávejte nepoužívané desky v originálním obalu nebo stojící v držáku — nestohujte je s těžkými věcmi nahoře. Deformované desky způsobují nerovnoměrnou první vrstvu.
:::
