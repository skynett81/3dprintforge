---
sidebar_position: 1
title: Estatísticas
description: Taxa de sucesso, consumo de filamento, tendências e indicadores-chave para todas as impressoras Bambu Lab ao longo do tempo
---

# Estatísticas

A página de estatísticas oferece uma visão completa da sua atividade de impressão com indicadores-chave, tendências e consumo de filamento em qualquer período selecionado.

Acesse em: **https://localhost:3443/#statistics**

## Indicadores-chave

No topo da página são exibidos quatro cartões de KPI:

| Indicador | Descrição |
|-----------|-----------|
| **Taxa de sucesso** | Proporção de impressões bem-sucedidas em relação ao total |
| **Total de filamento** | Gramas usados no período selecionado |
| **Total de horas de impressão** | Tempo acumulado de impressão |
| **Tempo médio de impressão** | Duração mediana por impressão |

Cada indicador exibe a variação em relação ao período anterior (↑ cima / ↓ baixo) como desvio percentual.

## Taxa de sucesso

A taxa de sucesso é calculada por impressora e no total:

- **Bem-sucedida** — impressão concluída sem interrupção
- **Cancelada** — interrompida manualmente pelo usuário
- **Com falha** — interrompida pelo Print Guard, erro HMS ou falha de hardware

Clique no gráfico de taxa de sucesso para ver quais impressões falharam e o motivo.

:::tip Melhorar a taxa de sucesso
Use a [Análise de padrões de erro](../monitoring/erroranalysis) para identificar e corrigir as causas das impressões com falha.
:::

## Tendências

A visualização de tendências exibe a evolução ao longo do tempo como gráfico de linhas:

1. Selecione o **Período**: Últimos 7 / 30 / 90 / 365 dias
2. Selecione o **Agrupamento**: Dia / Semana / Mês
3. Selecione a **Métrica**: Número de impressões / Horas / Gramas / Taxa de sucesso
4. Clique em **Comparar** para sobrepor duas métricas

O gráfico suporta zoom (rolar) e panorâmica (clicar e arrastar).

## Consumo de filamento

O consumo de filamento é exibido como:

- **Gráfico de barras** — consumo por dia/semana/mês
- **Gráfico de pizza** — distribuição entre materiais (PLA, PETG, ABS, etc.)
- **Tabela** — lista detalhada com total em gramas, metros e custo por material

### Consumo por impressora

Use o filtro de múltipla seleção no topo para:
- Exibir apenas uma impressora
- Comparar duas impressoras lado a lado
- Ver o total agregado de todas as impressoras

## Calendário de atividades

Veja um mapa de calor estilo GitHub compacto diretamente na página de estatísticas (visualização simplificada), ou acesse o [Calendário de atividades](./calendar) completo para uma visualização mais detalhada.

## Exportação

1. Clique em **Exportar estatísticas**
2. Selecione o intervalo de datas e quais métricas incluir
3. Selecione o formato: **CSV** (dados brutos), **PDF** (relatório) ou **JSON**
4. O arquivo é baixado

A exportação CSV é compatível com Excel e Google Sheets para análise adicional.

## Comparação com o período anterior

Ative **Mostrar período anterior** para sobrepor gráficos com o período equivalente anterior:

- Últimos 30 dias vs. 30 dias anteriores
- Mês atual vs. mês anterior
- Ano atual vs. ano anterior

Isso facilita ver se você está imprimindo mais ou menos do que antes e se a taxa de sucesso está melhorando.
