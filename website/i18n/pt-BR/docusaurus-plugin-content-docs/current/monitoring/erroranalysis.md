---
sidebar_position: 6
title: Análise de padrões de erro
description: Análise baseada em IA de padrões de erro, correlações entre erros e fatores ambientais, e sugestões concretas de melhoria
---

# Análise de padrões de erro

A análise de padrões de erro usa dados históricos de impressões e erros para identificar padrões, causas e correlações — e fornece sugestões concretas de melhoria.

Acesse em: **https://localhost:3443/#error-analysis**

## O que é analisado

O sistema analisa os seguintes pontos de dados:

- Códigos de erro HMS e horários
- Tipo e fabricante de filamento no momento do erro
- Temperatura no momento do erro (bico, mesa, câmara)
- Velocidade e perfil de impressão
- Hora do dia e dia da semana
- Tempo desde a última manutenção
- Modelo da impressora e versão do firmware

## Análise de correlação

O sistema procura correlações estatísticas entre erros e fatores:

**Exemplos de correlações detectadas:**
- "78% dos erros de bloqueio AMS ocorrem com filamento do fabricante X"
- "Entupimento do bico acontece 3× mais frequentemente após 6+ horas de impressão contínua"
- "Erros de aderência aumentam quando a temperatura da câmara está abaixo de 18°C"
- "Erros de stringing correlacionam com umidade acima de 60% (se higrômetro conectado)"

Correlações com significância estatística (p < 0,05) são exibidas primeiro.

:::info Requisito de dados
A análise é mais precisa com no mínimo 50 impressões no histórico. Com menos impressões, as estimativas são exibidas com baixa confiança.
:::

## Sugestões de melhoria

Com base nas análises, sugestões concretas são geradas:

| Tipo de sugestão | Exemplo |
|------------------|---------|
| Filamento | "Troque para outro fabricante para PA-CF — 3 de 4 erros usaram FabricanteX" |
| Temperatura | "Aumente a temperatura da mesa em 5°C para PETG — erros de aderência reduzidos em estimados 60%" |
| Velocidade | "Reduza a velocidade para 80% após 4 horas — entupimentos reduzidos em estimados 45%" |
| Manutenção | "Limpe a engrenagem do extrusor — o desgaste correlaciona com 40% dos erros de extrusão" |
| Calibração | "Execute o nivelamento da mesa — 12 de 15 erros de aderência na última semana correlacionam com calibração incorreta" |

Cada sugestão exibe:
- Efeito estimado (redução percentual de erros)
- Confiança (baixa / média / alta)
- Implementação passo a passo
- Link para documentação relevante

## Impacto na pontuação de saúde

A análise é vinculada à pontuação de saúde (veja [Diagnóstico](./diagnostics)):

- Mostra quais fatores mais reduzem a pontuação
- Estima a melhoria da pontuação ao implementar cada sugestão
- Prioriza sugestões pelo potencial de melhoria da pontuação

## Visualização da linha do tempo

Vá em **Análise de erros → Linha do tempo** para ver uma visão geral cronológica:

1. Selecione a impressora e o período
2. Os erros são exibidos como pontos na linha do tempo, codificados por cor de acordo com o tipo
3. Linhas horizontais marcam tarefas de manutenção
4. Agrupamentos de erros (muitos erros em pouco tempo) são destacados em vermelho

Clique em um agrupamento para abrir a análise desse período específico.

## Relatórios

Gere um relatório PDF da análise de erros:

1. Clique em **Gerar relatório**
2. Selecione o período (ex.: últimos 90 dias)
3. Selecione o conteúdo: correlações, sugestões, linha do tempo, pontuação de saúde
4. Baixe o PDF ou envie por e-mail

Os relatórios são salvos nos projetos se a impressora estiver vinculada a um projeto.

:::tip Revisão semanal
Configure um relatório semanal automático por e-mail em **Configurações → Relatórios** para se manter atualizado sem visitar o dashboard manualmente. Veja [Relatórios](../system/reports).
:::
