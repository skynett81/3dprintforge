---
sidebar_position: 2
title: Calendário de atividades
description: Calendário heatmap estilo GitHub mostrando atividade da impressora por dia ao longo do ano com seletor de ano e visualização detalhada
---

# Calendário de atividades

O calendário de atividades exibe uma visão geral visual da sua atividade de impressão ao longo do ano — inspirado na visão geral de contribuições do GitHub.

Acesse em: **https://localhost:3443/#calendar**

## Visão geral do mapa de calor

O calendário exibe 365 dias (52 semanas) como uma grade de quadrados coloridos:

- **Cinza** — nenhuma impressão neste dia
- **Verde claro** — 1–2 impressões
- **Verde** — 3–5 impressões
- **Verde escuro** — 6–10 impressões
- **Verde profundo** — 11+ impressões

Os quadrados são organizados com os dias da semana verticalmente (Seg–Dom) e as semanas horizontalmente da esquerda (janeiro) para a direita (dezembro).

:::tip Codificação por cor
Você pode mudar a métrica do mapa de calor de **Número de impressões** para **Horas** ou **Gramas de filamento** usando o seletor acima do calendário.
:::

## Seletor de ano

Clique em **< Ano >** para navegar entre anos:

- Todos os anos com atividade de impressão registrada estão disponíveis
- O ano atual é exibido por padrão
- O futuro é cinza (sem dados)

## Visualização detalhada por dia

Clique em um quadrado para ver os detalhes daquele dia:

- **Data** e dia da semana
- **Número de impressões** — bem-sucedidas e com falha
- **Total de filamento usado** (gramas)
- **Total de horas de impressão**
- **Lista de impressões** — clique para abrir no histórico

## Visão geral mensal

Abaixo do mapa de calor é exibida uma visão geral mensal com:
- Total de impressões por mês como gráfico de barras
- Melhor dia do mês destacado
- Comparação com o mesmo mês do ano anterior (%)

## Filtro de impressora

Selecione a impressora na lista suspensa no topo para exibir a atividade de apenas uma impressora, ou selecione **Todas** para uma visualização agregada.

A visualização de múltiplas impressoras exibe as cores empilhadas ao clicar em **Empilhado** no seletor de visualização.

## Sequências e recordes

Abaixo do calendário são exibidos:

| Estatística | Descrição |
|-------------|-----------|
| **Maior sequência** | Mais dias consecutivos com pelo menos uma impressão |
| **Sequência atual** | Série atual de dias ativos |
| **Dia mais ativo** | O dia com mais impressões no total |
| **Semana mais ativa** | A semana com mais impressões |
| **Mês mais ativo** | O mês com mais impressões |

## Exportação

Clique em **Exportar** para baixar os dados do calendário:

- **PNG** — imagem do mapa de calor (para compartilhamento)
- **CSV** — dados brutos com uma linha por dia (data, número, gramas, horas)

A exportação PNG é otimizada para compartilhamento em redes sociais com o nome da impressora e o ano como subtítulo.
