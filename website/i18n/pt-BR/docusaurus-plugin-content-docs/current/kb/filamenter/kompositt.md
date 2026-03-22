---
sidebar_position: 6
title: Materiais compósitos (CF/GF)
description: Filamentos com fibra de carbono e fibra de vidro — bico de aço endurecido, desgaste e configurações
---

# Materiais compósitos (CF/GF)

Os filamentos compósitos contêm fibras curtas de carbono (CF) ou fibra de vidro (GF) misturadas em um plástico base como PLA, PETG, PA ou ABS. Oferecem maior rigidez, peso reduzido e melhor estabilidade dimensional.

## Tipos disponíveis

| Filamento | Base | Rigidez | Redução de peso | Dificuldade |
|----------|------|---------|-----------------|-------------|
| PLA-CF | PLA | Alta | Moderada | Fácil |
| PETG-CF | PETG | Alta | Moderada | Moderada |
| PA6-CF | Nylon 6 | Muito alta | Boa | Difícil |
| PA12-CF | Nylon 12 | Muito alta | Boa | Moderada |
| ABS-CF | ABS | Alta | Moderada | Moderada |
| PLA-GF | PLA | Alta | Moderada | Fácil |

## Bico de aço endurecido obrigatório

:::danger Nunca use bico de latão com CF/GF
As fibras de carbono e vidro são muito abrasivas. Elas desgastarão um bico de latão padrão em horas a dias. Use sempre um **bico de aço endurecido** (Hardened Steel) ou **bico HS01** com todos os materiais CF e GF.

- Bambu Lab Hardened Steel Nozzle (0,4 mm)
- Bambu Lab HS01 Nozzle (revestimento especial, maior vida útil)
:::

## Configurações (exemplo PA-CF)

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 270–290 °C |
| Temperatura da mesa | 80–100 °C |
| Resfriamento da peça | 0–20% |
| Velocidade | 80% |
| Secagem | 80 °C / 12 horas |

Para PLA-CF: bico 220–230 °C, mesa 35–50 °C — muito mais simples que PA-CF.

## Chapas de impressão

| Chapa | Adequação | Cola em bastão? |
|-------|-----------|----------------|
| Engineering Plate (PEI Texturizado) | Excelente | Sim (para base PA) |
| High Temp Plate | Boa | Sim |
| Cool Plate | Evitar (CF risca) | — |
| Textured PEI | Boa | Sim |

:::warning A chapa pode ser riscada
Os materiais CF podem riscar chapas lisas ao remover. Use sempre Engineering Plate ou Textured PEI. Não puxe a impressão — dobre a chapa com cuidado.
:::

## Acabamento de superfície

Os filamentos CF produzem uma superfície matte semelhante ao carbono que não precisa de pintura. A superfície é levemente porosa e pode ser impregnada com epóxi para acabamento mais liso.

## Desgaste e vida útil do bico

| Tipo de bico | Vida útil com CF | Custo |
|--------------|-----------------|-------|
| Latão (padrão) | Horas–dias | Baixo |
| Aço endurecido | 200–500 horas | Moderado |
| HS01 (Bambu) | 500–1000 horas | Alto |

Troque o bico ao notar desgaste visível: orifício do bico alargado, paredes finas, má precisão dimensional.

## Secagem

Variantes CF de PA e PETG requerem secagem assim como a base:
- **PLA-CF:** Secagem recomendada, mas não crítica
- **PETG-CF:** 65 °C / 6–8 horas
- **PA-CF:** 80 °C / 12 horas — crítico
