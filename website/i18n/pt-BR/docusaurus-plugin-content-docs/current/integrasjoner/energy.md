---
sidebar_position: 2
title: Preço de energia
description: Conecte ao Tibber ou Nordpool para preços ao vivo por hora, histórico de preços e alertas de preço
---

# Preço de energia

A integração de preço de energia obtém preços de energia ao vivo do Tibber ou Nordpool para fornecer cálculos precisos de custo de energia por impressão e alertas sobre horários baratos ou caros para imprimir.

Acesse em: **https://localhost:3443/#settings** → **Integrações → Preço de energia**

## Integração Tibber

O Tibber é um fornecedor de energia com API aberta para preços spot.

### Configuração

1. Faça login em [developer.tibber.com](https://developer.tibber.com)
2. Gere um **Personal Access Token**
3. No Bambu Dashboard: cole o token em **Token da API Tibber**
4. Selecione **Casa** (de onde os preços serão obtidos, se você tiver várias casas)
5. Clique em **Testar conexão**
6. Clique em **Salvar**

### Dados disponíveis do Tibber

- **Preço spot agora** — preço instantâneo incluindo impostos (R$/kWh)
- **Preços nas próximas 24 horas** — o Tibber fornece os preços do dia seguinte a partir das 13h
- **Histórico de preços** — até 30 dias atrás
- **Custo por impressão** — calculado com base no tempo real de impressão × preços por hora

## Integração Nordpool

O Nordpool é a bolsa de energia que fornece preços spot brutos para os países nórdicos.

### Configuração

1. Vá em **Integrações → Nordpool**
2. Selecione a **Área de preço**: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen)
3. Selecione a **Moeda**: NOK / EUR
4. Selecione **Impostos e taxas**:
   - Marque **Incluir IVA** (25%)
   - Preencha **Taxa de rede** (R$/kWh) — veja a fatura do fornecedor de rede
   - Preencha **Taxa de consumo** (R$/kWh)
5. Clique em **Salvar**

:::info Taxa de rede
A taxa de rede varia conforme o fornecedor de rede e o modelo de preço. Verifique sua última fatura de energia para a taxa correta.
:::

## Preços por hora

Os preços por hora são exibidos como um gráfico de barras para as próximas 24–48 horas:

- **Verde** — horas baratas (abaixo da média)
- **Amarelo** — preço médio
- **Vermelho** — horas caras (acima da média)
- **Cinza** — horas sem previsão de preço disponível

Passe o cursor sobre uma hora para ver o preço exato (R$/kWh).

## Histórico de preços

Vá em **Preço de energia → Histórico** para ver:

- Preço médio diário nos últimos 30 dias
- Hora mais cara e mais barata por dia
- Custo total de energia para impressões por dia

## Alertas de preço

Configure alertas automáticos com base no preço de energia:

1. Vá em **Preço de energia → Alertas de preço**
2. Clique em **Novo alerta**
3. Selecione o tipo de alerta:
   - **Preço abaixo do limite** — alertar quando o preço de energia cair abaixo de X R$/kWh
   - **Preço acima do limite** — alertar quando o preço subir acima de X R$/kWh
   - **Hora mais barata do dia** — alertar quando a hora mais barata do dia começar
4. Selecione o canal de alerta
5. Clique em **Salvar**

:::tip Planejamento inteligente
Combine alertas de preço com a fila de impressão: configure uma automação que envia trabalhos da fila automaticamente quando o preço de energia estiver baixo (requer integração de webhook ou Home Assistant).
:::

## Preço de energia na calculadora de custos

A integração de preço de energia ativada fornece custos de energia precisos na [Calculadora de custos](../analyse/costestimator). Selecione **Preço ao vivo** em vez de preço fixo para usar o preço atual do Tibber/Nordpool.
