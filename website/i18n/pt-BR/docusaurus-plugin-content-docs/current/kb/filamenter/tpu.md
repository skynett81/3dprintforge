---
sidebar_position: 4
title: TPU
description: Guia para impressão com TPU — temperatura, velocidade e configurações de retração
---

# TPU

TPU (Poliuretano Termoplástico) é um material flexível usado para capas, vedações, rodas e outras peças que exigem elasticidade.

## Configurações

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220–240 °C |
| Temperatura da mesa | 30–45 °C |
| Resfriamento da peça | 50–80% |
| Velocidade | 30–50% (IMPORTANTE) |
| Retração | Mínima ou desativada |
| Secagem | Recomendada (6–8 h a 60 °C) |

:::danger Velocidade baixa é crítica
O TPU deve ser impresso devagar. Velocidade muito alta faz com que o material se comprima no extrusor e crie entupimentos. Comece com 30% de velocidade e aumente com cuidado.
:::

## Chapas recomendadas

| Chapa | Adequação | Cola em bastão? |
|-------|-----------|----------------|
| Textured PEI | Excelente | Não |
| Cool Plate (PEI Liso) | Boa | Não |
| Engineering Plate | Boa | Não |

## Configurações de retração

O TPU é elástico e reage mal à retração agressiva:

- **Direct drive (X1C/P1S/A1):** Retração 0,5–1,0 mm, 25 mm/s
- **Bowden (evitar com TPU):** Muito exigente, não recomendado

Para TPU muito macio (Shore A 85 ou menor): desative a retração completamente e confie no controle de temperatura e velocidade.

## Dicas

- **Seque o filamento** — TPU úmido é extremamente difícil de imprimir
- **Use extrusor direto** — Bambu Lab P1S/X1C/A1 todos têm direct drive
- **Evite temperatura alta** — acima de 250 °C o TPU se degrada e produz impressão descolorida
- **Stringing** — TPU tende a formar fios; reduza a temperatura 5 °C ou aumente o resfriamento

:::tip Dureza Shore
O TPU está disponível em diferentes durezas Shore (A85, A95, A98). Quanto menor o Shore A, mais macio e mais difícil de imprimir. O TPU da Bambu Lab é Shore A 95 — um bom ponto de partida.
:::

## Armazenamento

O TPU é muito higroscópico (absorve umidade). TPU úmido produz:
- Bolhas e chiados
- Impressão fraca e frágil (paradoxalmente para um material flexível)
- Stringing

**Seque sempre o TPU** a 60 °C por 6–8 horas antes de imprimir. Guarde em caixa selada com sílica gel.
