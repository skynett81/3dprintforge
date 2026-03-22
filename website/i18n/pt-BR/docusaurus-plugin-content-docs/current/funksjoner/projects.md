---
sidebar_position: 9
title: Projetos
description: Organize impressões em projetos, rastreie custos, gere faturas e compartilhe projetos com clientes
---

# Projetos

Os projetos permitem agrupar impressões relacionadas, rastrear custos de materiais, faturar clientes e compartilhar uma visão geral do seu trabalho.

Acesse em: **https://localhost:3443/#projects**

## Criar um projeto

1. Clique em **Novo projeto** (ícone +)
2. Preencha:
   - **Nome do projeto** — nome descritivo (máx. 100 caracteres)
   - **Cliente** — conta de cliente opcional (veja [E-commerce](../integrasjoner/ecommerce))
   - **Descrição** — breve descrição em texto
   - **Cor** — escolha uma cor para identificação visual
   - **Tags** — palavras-chave separadas por vírgula
3. Clique em **Criar projeto**

## Vincular impressões ao projeto

### Durante uma impressão

1. Abra o dashboard enquanto uma impressão está em andamento
2. Clique em **Vincular ao projeto** no painel lateral
3. Selecione um projeto existente ou crie um novo
4. A impressão é automaticamente vinculada ao projeto quando concluída

### Do histórico

1. Vá em **Histórico**
2. Encontre a impressão desejada
3. Clique na impressão → **Vincular ao projeto**
4. Selecione o projeto na lista suspensa

### Vinculação em massa

1. Selecione várias impressões no histórico com caixas de seleção
2. Clique em **Ações → Vincular ao projeto**
3. Selecione o projeto — todas as impressões selecionadas são vinculadas

## Visão geral de custos

Cada projeto calcula os custos totais com base em:

| Tipo de custo | Fonte |
|---------------|-------|
| Consumo de filamento | Gramas × preço por grama por material |
| Energia | kWh × preço da energia (do Tibber/Nordpool se configurado) |
| Desgaste da máquina | Calculado a partir da [Previsão de desgaste](../overvaaking/wearprediction) |
| Custo manual | Itens de texto livre adicionados manualmente |

A visão geral de custos é exibida como tabela e gráfico de pizza por impressão e total.

:::tip Preços por hora
Ative a integração Tibber ou Nordpool para custos precisos de energia por impressão. Veja [Preço de energia](../integrasjoner/energy).
:::

## Faturamento

1. Abra um projeto e clique em **Gerar fatura**
2. Preencha:
   - **Data da fatura** e **data de vencimento**
   - **Alíquota de imposto** (0%, 15%, 25%)
   - **Margem** (%)
   - **Nota para o cliente**
3. Pré-visualize a fatura em formato PDF
4. Clique em **Baixar PDF** ou **Enviar ao cliente** (via e-mail)

As faturas são salvas no projeto e podem ser reabertas e editadas até serem enviadas.

:::info Dados do cliente
Os dados do cliente (nome, endereço, CNPJ) são obtidos da conta do cliente vinculada ao projeto. Veja [E-commerce](../integrasjoner/ecommerce) para gerenciar clientes.
:::

## Status do projeto

| Status | Descrição |
|--------|-----------|
| Ativo | O projeto está em andamento |
| Concluído | Todas as impressões estão prontas, fatura enviada |
| Arquivado | Oculto da visualização padrão, mas pesquisável |
| Em espera | Temporariamente pausado |

Altere o status clicando no indicador de status no topo do projeto.

## Compartilhar um projeto

Gere um link compartilhável para mostrar a visão geral do projeto aos clientes:

1. Clique em **Compartilhar projeto** no menu do projeto
2. Selecione o que será exibido:
   - ✅ Impressões e imagens
   - ✅ Consumo total de filamento
   - ❌ Custos e preços (ocultos por padrão)
3. Defina o tempo de expiração do link
4. Copie e compartilhe o link

O cliente vê uma página somente leitura sem precisar fazer login.
