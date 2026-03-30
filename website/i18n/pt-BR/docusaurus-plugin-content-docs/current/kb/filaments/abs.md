---
sidebar_position: 3
title: ABS
description: Guia para impressão com ABS — temperatura, câmara fechada, warping e cola em bastão
---

# ABS

ABS (Acrilonitrila Butadieno Estireno) é um termoplástico com boa estabilidade térmica e resistência ao impacto. Requer câmara fechada e é mais exigente que PLA/PETG, mas produz peças funcionais duráveis.

## Configurações

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 240–260 °C |
| Temperatura da mesa | 90–110 °C |
| Temperatura da câmara | 45–55 °C (X1C/P1S) |
| Resfriamento da peça | 0–20% |
| Ventilador auxiliar | 0% |
| Velocidade | 80–100% |
| Secagem | Recomendada (4–6 h a 70 °C) |

## Chapas recomendadas

| Chapa | Adequação | Cola em bastão? |
|-------|-----------|----------------|
| Engineering Plate (PEI Texturizado) | Excelente | Sim (recomendado) |
| High Temp Plate | Excelente | Sim |
| Cool Plate (PEI Liso) | Evitar | — |
| Textured PEI | Boa | Sim |

:::tip Cola em bastão para ABS
Use sempre cola em bastão na Engineering Plate com ABS. Melhora a aderência e facilita a remoção da impressão sem danificar a chapa.
:::

## Câmara fechada

O ABS **requer** uma câmara fechada para evitar warping:

- **X1C e P1S:** Câmara embutida com controle ativo de temperatura — ideal para ABS
- **P1P:** Parcialmente aberta — adicione tampas superiores para melhores resultados
- **A1 / A1 Mini:** CoreXY aberta — **não recomendado** para ABS sem um invólucro personalizado

Mantenha a câmara fechada durante toda a impressão. Não a abra para verificar a impressão — esperar até o resfriamento também evita warping ao soltar.

## Warping

O ABS é muito propenso a warping (os cantos levantam):

- **Aumente a temperatura da mesa** — tente 105–110 °C
- **Use brim** — brim de 5–10 mm no Bambu Studio
- **Evite correntes de ar** — feche todos os fluxos de ar ao redor da impressora
- **Reduza o resfriamento da peça para 0%** — o resfriamento causa torção

:::warning Vapores
O ABS emite vapores de estireno durante a impressão. Garanta boa ventilação no ambiente, ou use um filtro HEPA/carvão ativo. O Bambu P1S tem filtro embutido.
:::

## Pós-processamento

O ABS pode ser lixado, pintado e colado mais facilmente que PETG e PLA. Também pode ser alisado a vapor com acetona para superfície lisa — mas tome muito cuidado com a exposição à acetona.

## Armazenamento

Seque a **70 °C por 4–6 horas** antes de imprimir. Guarde em caixa selada — o ABS absorve umidade, o que causa estalos e camadas fracas.
