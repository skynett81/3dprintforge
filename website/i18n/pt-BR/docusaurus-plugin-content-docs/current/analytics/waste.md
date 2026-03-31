---
sidebar_position: 5
title: Rastreamento de desperdício
description: Rastreie o desperdício de filamento da purga AMS e material de suporte, calcule custos e otimize a eficiência
---

# Rastreamento de desperdício

O rastreamento de desperdício oferece visibilidade total sobre quanto filamento é desperdiçado durante a impressão — purga AMS, limpeza durante trocas de material e material de suporte — e quanto isso custa.

Acesse em: **https://localhost:3443/#waste**

## Categorias de desperdício

O 3DPrintForge distingue três tipos de desperdício:

| Categoria | Fonte | Proporção típica |
|-----------|-------|-----------------|
| **Purga AMS** | Troca de cor no AMS durante impressão multicolor | 5–30 g por troca |
| **Limpeza de troca de material** | Limpeza ao trocar entre materiais diferentes | 10–50 g por troca |
| **Material de suporte** | Estruturas de suporte removidas após a impressão | Varia |

## Rastreamento de purga AMS

Os dados de purga AMS são obtidos diretamente da telemetria MQTT e análise do G-code:

- **Gramas por troca de cor** — calculado a partir do bloco de purga no G-code
- **Número de trocas de cor** — contado do registro de impressão
- **Consumo total de purga** — soma ao longo do período selecionado

:::tip Reduzir a purga
O Bambu Studio tem configurações de volume de purga por combinação de cores. Reduza o volume de purga para pares de cores com baixa diferença de cor (ex.: branco → cinza claro) para economizar filamento.
:::

## Cálculo de eficiência

A eficiência é calculada como:

```
Eficiência % = (material do modelo / consumo total) × 100

Consumo total = material do modelo + purga + material de suporte
```

**Exemplo:**
- Modelo: 45 g
- Purga: 12 g
- Suporte: 8 g
- Total: 65 g
- **Eficiência: 69%**

A eficiência é exibida como um gráfico de tendência ao longo do tempo para ver se você está melhorando.

## Custo do desperdício

Com base nos preços de filamento registrados é calculado:

| Item | Cálculo |
|------|---------|
| Custo de purga | Gramas de purga × preço/grama por cor |
| Custo de suporte | Gramas de suporte × preço/grama |
| **Custo total de desperdício** | Soma dos itens acima |
| **Custo por impressão bem-sucedida** | Custo de desperdício / número de impressões |

## Desperdício por impressora e material

Filtre a visualização por:

- **Impressora** — veja qual impressora gera mais desperdício
- **Material** — veja o desperdício por tipo de filamento
- **Período** — dia, semana, mês, ano

A visualização em tabela mostra a lista classificada com maior desperdício primeiro, incluindo custo estimado.

## Dicas de otimização

O sistema gera sugestões automáticas para reduzir o desperdício:

- **Ordem de cores invertida** — Se a purga de cor A→B é maior que B→A, o sistema sugere inverter a ordem
- **Mesclar camadas de troca de cor** — Agrupa camadas da mesma cor para minimizar as trocas
- **Otimização de estrutura de suporte** — Estima redução de suporte ao mudar a orientação

:::info Precisão
Os cálculos de purga são estimados a partir do G-code. O desperdício real pode variar 10–20% devido ao comportamento da impressora.
:::

## Exportação e relatórios

1. Clique em **Exportar dados de desperdício**
2. Selecione o período e formato (CSV / PDF)
3. Os dados de desperdício podem ser incluídos em relatórios de projetos e faturas como item de custo

Veja também [Análise de filamento](./filamentanalytics) para visão geral do consumo total.
