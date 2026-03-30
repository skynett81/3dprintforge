---
sidebar_position: 4
title: Calculadora de custos
description: Carregue um arquivo 3MF ou GCode e calcule o custo total de filamento, energia e desgaste da máquina antes de imprimir
---

# Calculadora de custos

A calculadora de custos permite estimar o custo total de uma impressão antes de enviá-la para a impressora — com base no consumo de filamento, preço de energia e desgaste da máquina.

Acesse em: **https://localhost:3443/#cost-estimator**

## Carregar arquivo

1. Vá em **Calculadora de custos**
2. Arraste e solte um arquivo no campo de upload, ou clique em **Selecionar arquivo**
3. Formatos suportados: `.3mf`, `.gcode`, `.bgcode`
4. Clique em **Analisar**

:::info Análise
O sistema analisa o G-code para extrair o consumo de filamento, o tempo estimado de impressão e o perfil de material. Isso geralmente leva 2–10 segundos.
:::

## Cálculo de filamento

Após a análise é exibido:

| Campo | Valor (exemplo) |
|-------|----------------|
| Filamento estimado | 47,3 g |
| Material (do arquivo) | PLA |
| Preço por grama | R$ 0,025 (do estoque de filamentos) |
| **Custo de filamento** | **R$ 1,18** |

Mude o material na lista suspensa para comparar custos com diferentes tipos de filamento ou fabricantes.

:::tip Substituição de material
Se o G-code não contém informações de material, selecione o material manualmente na lista. O preço é obtido automaticamente do estoque de filamentos.
:::

## Cálculo de energia

O custo de energia é calculado com base em:

- **Tempo estimado de impressão** — da análise do G-code
- **Potência da impressora** — configurada por modelo de impressora (W)
- **Preço de energia** — preço fixo (R$/kWh) ou ao vivo do Tibber/Nordpool

| Campo | Valor (exemplo) |
|-------|----------------|
| Tempo estimado de impressão | 3 horas 22 min |
| Potência da impressora | 350 W (X1C) |
| Consumo estimado | 1,17 kWh |
| Preço de energia | R$ 0,92/kWh |
| **Custo de energia** | **R$ 1,08** |

Ative a integração Tibber ou Nordpool para usar os preços por hora planejados com base no horário de início desejado.

## Desgaste da máquina

O custo de desgaste é estimado com base em:

- Tempo de impressão × custo por hora por modelo de impressora
- Desgaste extra para material abrasivo (CF, GF, etc.)

| Campo | Valor (exemplo) |
|-------|----------------|
| Tempo de impressão | 3 horas 22 min |
| Custo por hora (desgaste) | R$ 0,40/hora |
| **Custo de desgaste** | **R$ 1,35** |

O custo por hora é calculado a partir dos preços dos componentes e da vida útil esperada (veja [Previsão de desgaste](../monitoring/wearprediction)).

## Total

| Item de custo | Valor |
|---------------|-------|
| Filamento | R$ 1,18 |
| Energia | R$ 1,08 |
| Desgaste da máquina | R$ 1,35 |
| **Total** | **R$ 3,61** |
| + Margem (30%) | R$ 1,08 |
| **Preço de venda** | **R$ 4,69** |

Ajuste a margem no campo percentual para calcular o preço de venda recomendado ao cliente.

## Salvar estimativa

Clique em **Salvar estimativa** para vincular a análise a um projeto:

1. Selecione um projeto existente ou crie um novo
2. A estimativa é salva e pode ser usada como base para a fatura
3. O custo real (após a impressão) é comparado automaticamente com a estimativa

## Cálculo em lote

Carregue vários arquivos simultaneamente para calcular o custo total de um conjunto completo:

1. Clique em **Modo lote**
2. Carregue todos os arquivos `.3mf`/`.gcode`
3. O sistema calcula individualmente e o total
4. Exporte o resumo como PDF ou CSV
