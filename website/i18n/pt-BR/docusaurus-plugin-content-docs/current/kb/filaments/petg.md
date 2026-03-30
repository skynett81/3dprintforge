---
sidebar_position: 2
title: PETG
description: Guia para impressão com PETG — temperatura, IMPORTANTE sobre cola, chapa e dicas
---

# PETG

PETG (Polietileno Tereftalato Glicol) é um material popular para peças funcionais. É mais resistente e termicamente estável que o PLA e tolera exposição química leve.

## Configurações

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 230–250 °C |
| Temperatura da mesa | 70–85 °C |
| Resfriamento da peça | 30–60% |
| Velocidade | Padrão |
| Secagem | Recomendada (6–8 h a 65 °C) |

## Chapas recomendadas

| Chapa | Adequação | Cola em bastão? |
|-------|-----------|----------------|
| Engineering Plate (PEI Texturizado) | Excelente | Não/Sim* |
| Textured PEI | Boa | Sim** |
| Cool Plate (PEI Liso) | Ver aviso | Ver aviso |
| High Temp Plate | Boa | Sim |

:::danger IMPORTANTE: Cola em bastão no PEI Liso com PETG
O PETG adere **extremamente bem** ao PEI Liso (Cool Plate). Sem cola em bastão, você arrisca **arrancar o revestimento da chapa** ao remover a impressão. Use sempre uma camada fina de cola em bastão no PEI Liso ao imprimir com PETG — isso funciona como barreira.

**Alternativa:** Use a Engineering Plate ou Textured PEI — essas oferecem boa aderência sem danificar a chapa.
:::

## Dicas para impressão bem-sucedida

- **Reduza o resfriamento da peça** — muito resfriamento causa delaminação e impressão frágil
- **Aumente a temperatura do bico** — em caso de stringing, tente reduzir 5–10 °C; em caso de fusão ruim das camadas, aumente
- **Temperatura da mesa na primeira camada** — 80–85 °C para boa aderência, reduza para 70 °C após a primeira camada
- **Reduza a velocidade** — PETG é mais exigente que PLA, comece com 80% de velocidade

:::warning Stringing
O PETG é propenso a stringing. Aumente a distância de retração (tente 0,8–1,5 mm para direct drive), aumente a velocidade de retração e reduza a temperatura do bico em 5 °C por vez.
:::

## Secagem

O PETG absorve umidade mais rapidamente que o PLA. PETG úmido produz:
- Bolhas e chiados durante a impressão
- Camadas fracas com superfície porosa
- Aumento do stringing

**Seque a 65 °C por 6–8 horas** antes de imprimir, especialmente se a bobina ficou aberta por muito tempo.

## Armazenamento

Guarde sempre em saco selado ou caixa de secagem com sílica gel. O PETG não deve ficar aberto por mais de alguns dias em ambientes úmidos.
