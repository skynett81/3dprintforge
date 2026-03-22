---
sidebar_position: 3
title: Análise de filamento
description: Análise detalhada do consumo de filamento, custos, previsões, taxas de consumo e desperdício por material e fabricante
---

# Análise de filamento

A análise de filamento oferece visibilidade total sobre o seu consumo de filamento — o que você usa, quanto custa e onde pode economizar.

Acesse em: **https://localhost:3443/#filament-analytics**

## Visão geral do consumo

No topo é exibido um resumo para o período selecionado:

- **Consumo total** — gramas e metros para todos os materiais
- **Custo estimado** — com base no preço registrado por bobina
- **Material mais usado** — tipo e fabricante
- **Taxa de reaproveitamento** — proporção de filamento no modelo real vs. suporte/purga

### Consumo por material

Gráfico de pizza e tabela mostram a distribuição entre materiais:

| Coluna | Descrição |
|--------|-----------|
| Material | PLA, PETG, ABS, PA, etc. |
| Fabricante | Bambu Lab, PolyMaker, Prusament, etc. |
| Gramas usados | Peso total |
| Metros | Comprimento estimado |
| Custo | Gramas × preço por grama |
| Impressões | Número de impressões com este material |

Clique em uma linha para detalhar até o nível de bobina individual.

## Taxas de consumo

A taxa de consumo exibe o consumo médio de filamento por unidade de tempo:

- **Gramas por hora** — durante impressão ativa
- **Gramas por semana** — incluindo tempo de inatividade da impressora
- **Gramas por impressão** — média por impressão

Elas são usadas para calcular previsões de necessidades futuras.

:::tip Planejamento de compras
Use a taxa de consumo para planejar o estoque de bobinas. O sistema alerta automaticamente quando o estoque estimado acabará em 14 dias (configurável).
:::

## Previsão de custos

Com base na taxa de consumo histórica é calculado:

- **Consumo estimado nos próximos 30 dias** (gramas por material)
- **Custo estimado nos próximos 30 dias**
- **Estoque recomendado** (suficiente para 30 / 60 / 90 dias de operação)

A previsão leva em conta sazonalidade se você tiver dados de pelo menos um ano.

## Desperdício e eficiência

Veja [Rastreamento de desperdício](./waste) para documentação completa. A análise de filamento exibe um resumo:

- **Purga AMS** — gramas e proporção do consumo total
- **Material de suporte** — gramas e proporção
- **Material real do modelo** — proporção restante (% de eficiência)
- **Custo estimado do desperdício** — quanto o desperdício custa para você

## Registro de bobinas

Todas as bobinas (ativas e vazias) são registradas:

| Campo | Descrição |
|-------|-----------|
| Nome da bobina | Nome do material e cor |
| Peso original | Peso registrado no início |
| Peso restante | Restante calculado |
| Usado | Gramas usados no total |
| Último uso | Data da última impressão |
| Status | Ativa / Vazia / Armazenada |

## Registro de preços

Para análise de custos precisa, registre os preços por bobina:

1. Vá em **Estoque de filamentos**
2. Clique em uma bobina → **Editar**
3. Preencha **Preço de compra** e **Peso na compra**
4. O sistema calcula o preço por grama automaticamente

Bobinas sem preço registrado usam o **preço padrão por grama** (definido em **Configurações → Filamento → Preço padrão**).

## Exportação

1. Clique em **Exportar dados de filamento**
2. Selecione o período e formato (CSV / PDF)
3. O CSV inclui uma linha por impressão com gramas, custo e material
