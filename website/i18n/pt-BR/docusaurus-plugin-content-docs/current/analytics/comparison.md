---
sidebar_position: 6
title: Comparação de impressões
description: Compare duas impressões lado a lado com métricas detalhadas, gráficos e imagens da galeria para análise A/B
---

# Comparação de impressões

A comparação de impressões permite analisar duas impressões lado a lado — útil para comparar configurações, materiais, impressoras ou versões do mesmo modelo.

Acesse em: **https://localhost:3443/#comparison**

## Selecionar impressões para comparar

1. Vá em **Comparação de impressões**
2. Clique em **Selecionar impressão A** e busque no histórico
3. Clique em **Selecionar impressão B** e busque no histórico
4. Clique em **Comparar** para carregar a visualização de comparação

:::tip Acesso mais rápido
Em **Histórico**, você pode clicar com o botão direito em uma impressão e selecionar **Definir como impressão A** ou **Comparar com...** para ir diretamente ao modo de comparação.
:::

## Comparação de métricas

As métricas são exibidas em duas colunas (A e B) com marcação de qual é melhor:

| Métrica | Descrição |
|---------|-----------|
| Sucesso | Concluída / Cancelada / Com falha |
| Duração | Tempo total de impressão |
| Consumo de filamento | Gramas totais e por cor |
| Eficiência de filamento | % do modelo em relação ao consumo total |
| Temperatura máxima do bico | Temperatura máxima registrada do bico |
| Temperatura máxima da mesa | Temperatura máxima registrada da mesa |
| Configuração de velocidade | Silencioso / Padrão / Sport / Turbo |
| Trocas AMS | Número de trocas de cor |
| Erros HMS | Possíveis erros durante a impressão |
| Impressora | Qual impressora foi usada |

Células com o melhor valor são exibidas com fundo verde.

## Gráficos de temperatura

Dois gráficos de temperatura são exibidos lado a lado (ou sobrepostos):

- **Visualização separada** — gráfico A à esquerda, gráfico B à direita
- **Visualização sobreposta** — ambos no mesmo gráfico com cores diferentes

Use a visualização sobreposta para ver a estabilidade de temperatura e a taxa de aquecimento diretamente.

## Imagens da galeria

Se ambas as impressões têm capturas de tela de marcos, elas são exibidas em uma grade:

| Impressão A | Impressão B |
|-------------|-------------|
| Imagem 25% A | Imagem 25% B |
| Imagem 50% A | Imagem 50% B |
| Imagem 75% A | Imagem 75% B |
| Imagem 100% A | Imagem 100% B |

Clique em uma imagem para abrir a pré-visualização em tela cheia com animação deslizante.

## Comparação de timelapse

Se ambas as impressões têm timelapse, os vídeos são exibidos lado a lado:

- Reprodução sincronizada — ambos iniciam e pausam ao mesmo tempo
- Reprodução independente — controle cada vídeo separadamente

## Diferenças de configurações

O sistema destaca automaticamente as diferenças nas configurações de impressão (obtidas dos metadados do G-code):

- Espessuras de camada diferentes
- Padrões ou porcentagens de preenchimento diferentes
- Configurações de suporte diferentes
- Perfis de velocidade diferentes

As diferenças são exibidas com marcação laranja na tabela de configurações.

## Salvar comparação

1. Clique em **Salvar comparação**
2. Dê um nome à comparação (ex.: "PLA vs PETG - Benchy")
3. A comparação é salva e fica disponível em **Histórico → Comparações**

## Exportação

1. Clique em **Exportar**
2. Selecione **PDF** para um relatório com todas as métricas e imagens
3. O relatório pode ser vinculado a um projeto para documentação de escolha de material
