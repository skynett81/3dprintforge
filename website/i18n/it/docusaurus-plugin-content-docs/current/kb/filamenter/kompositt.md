---
sidebar_position: 6
title: Materiali compositi (CF/GF)
description: Filamenti rinforzati con fibra di carbonio e fibra di vetro — ugello in acciaio indurito, usura e impostazioni
---

# Materiali compositi (CF/GF)

I filamenti compositi contengono corte fibre di carbonio (CF) o fibre di vetro (GF) mescolate in una plastica base come PLA, PETG, PA o ABS. Offrono maggiore rigidità, peso ridotto e migliore stabilità dimensionale.

## Tipi disponibili

| Filamento | Base | Rigidità | Riduzione peso | Difficoltà |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Alta | Moderata | Facile |
| PETG-CF | PETG | Alta | Moderata | Moderata |
| PA6-CF | Nylon 6 | Molto alta | Buona | Impegnativa |
| PA12-CF | Nylon 12 | Molto alta | Buona | Moderata |
| ABS-CF | ABS | Alta | Moderata | Moderata |
| PLA-GF | PLA | Alta | Moderata | Facile |

## L'ugello in acciaio indurito è obbligatorio

:::danger Non usare mai ugello in ottone con CF/GF
Le fibre di carbonio e di vetro sono estremamente abrasive. Consumano un ugello in ottone standard nel giro di ore o giorni. Usa sempre un **ugello in acciaio indurito** (Hardened Steel) o **ugello HS01** con tutti i materiali CF e GF.

- Bambu Lab Hardened Steel Nozzle (0,4 mm)
- Bambu Lab HS01 Nozzle (rivestimento speciale, durata maggiore)
:::

## Impostazioni (esempio PA-CF)

| Parametro | Valore |
|-----------|-------|
| Temperatura ugello | 270–290 °C |
| Temperatura piano | 80–100 °C |
| Raffreddamento pezzo | 0–20% |
| Velocità | 80% |
| Essiccazione | 80 °C / 12 ore |

Per PLA-CF: ugello 220–230 °C, piano 35–50 °C — molto più semplice di PA-CF.

## Piani consigliati

| Piano | Idoneità | Colla stick? |
|-------|---------|----------|
| Engineering Plate (PEI testurizzato) | Eccellente | Sì (per base PA) |
| High Temp Plate | Buono | Sì |
| Cool Plate | Evita (CF graffia) | — |
| Textured PEI | Buono | Sì |

:::warning Il piano può graffiarsi
I materiali CF possono graffiare i piani lisci durante la rimozione. Usa sempre l'Engineering Plate o la Textured PEI. Non strappare la stampa — piega delicatamente il piano.
:::

## Finitura superficiale

I filamenti CF producono una superficie opaca simile al carbonio che non richiede verniciatura. La superficie è leggermente porosa e può essere impregnata con epossidico per una finitura più liscia.

## Usura e durata ugello

| Tipo ugello | Durata con CF | Costo |
|----------|---------------|---------|
| Ottone (standard) | Ore–giorni | Basso |
| Acciaio indurito | 200–500 ore | Moderato |
| HS01 (Bambu) | 500–1000 ore | Alto |

Sostituisci l'ugello quando si vede usura visibile: foro ugello allargato, pareti sottili, scarsa precisione dimensionale.

## Essiccazione

Le varianti CF di PA e PETG richiedono essiccazione esattamente come la base:
- **PLA-CF:** Essiccazione consigliata, ma non critica
- **PETG-CF:** 65 °C / 6–8 ore
- **PA-CF:** 80 °C / 12 ore — critica
