---
sidebar_position: 11
title: Precificação de produtos — calcular preço de venda
description: Guia completo para precificar impressões 3D para venda com todos os fatores de custo
---

# Precificação de produtos — calcular preço de venda

Este guia explica como usar a calculadora de custos para encontrar o preço de venda correto para impressões 3D que você vende.

## Visão geral dos custos

O custo de uma impressão 3D é composto por estes elementos:

| Componente | Descrição | Exemplo |
|-----------|-------------|---------|
| **Filamento** | Custo do material baseado no peso e preço do carretel | 100g × 0,25 kr/g = 25 kr |
| **Resíduo** | Desperdício de material (purga, impressões falhas, suporte) | 10% extra = 2,50 kr |
| **Eletricidade** | Consumo de energia durante a impressão | 3,5h × 150W × 1,50 kr/kWh = 0,79 kr |
| **Desgaste** | Bico + valor da máquina ao longo da vida útil | 3,5h × 0,15 kr/h = 0,53 kr |
| **Mão de obra** | Seu tempo para configuração, pós-processamento, embalagem | 10 min × 200 kr/h = 33,33 kr |
| **Margem** | Margem de lucro | 20% = 12,43 kr |

**Custo total de produção** = soma de todos os componentes

## Configurar definições

### Definições básicas

Vá para **Filament → ⚙ Configurações** e preencha:

1. **Preço da eletricidade (kr/kWh)** — seu preço de eletricidade. Verifique sua conta de luz ou use a integração Nordpool
2. **Potência da impressora (W)** — tipicamente 150W para impressoras Bambu Lab
3. **Custo da máquina (kr)** — quanto você pagou pela impressora
4. **Vida útil da máquina (horas)** — vida útil esperada (3000-8000 horas)
5. **Custo de mão de obra (kr/hora)** — sua taxa horária
6. **Tempo de preparação (min)** — tempo médio para troca de filamento, verificação da placa, embalagem
7. **Margem (%)** — margem de lucro desejada
8. **Custo do bico (kr/hora)** — desgaste do bico (HS01 ≈ 0,05 kr/h)
9. **Fator de resíduo** — desperdício de material (1,1 = 10% extra, 1,15 = 15%)

:::tip Valores típicos para Bambu Lab
| Configuração | Hobbyista | Semi-pro | Profissional |
|---|---|---|---|
| Preço da eletricidade | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Potência da impressora | 150W | 150W | 150W |
| Custo da máquina | 5 000 kr | 12 000 kr | 25 000 kr |
| Vida útil da máquina | 3 000h | 5 000h | 8 000h |
| Custo de mão de obra | 0 kr/h | 150 kr/h | 250 kr/h |
| Tempo de preparação | 5 min | 10 min | 15 min |
| Margem | 0% | 30% | 50% |
| Fator de resíduo | 1,05 | 1,10 | 1,15 |
:::

## Calcular custo

1. Vá para a **Calculadora de custos** (`https://localhost:3443/#costestimator`)
2. **Arraste e solte** um arquivo `.3mf` ou `.gcode`
3. O sistema lê automaticamente: peso do filamento, tempo estimado, cores
4. **Vincular carretéis** — selecione quais carretéis do estoque são usados
5. Clique em **Calcular custo**

### O resultado mostra:

- **Filamento** — custo do material por cor
- **Resíduo/desperdício** — baseado no fator de resíduo
- **Eletricidade** — usa preço spot ao vivo do Nordpool se disponível
- **Desgaste** — bico + valor da máquina
- **Mão de obra** — taxa horária + tempo de preparação
- **Custo de produção** — soma de tudo acima
- **Margem** — sua margem de lucro
- **Custo total** — o mínimo que você deve cobrar
- **Preços de venda sugeridos** — margem 2×, 2,5×, 3×

## Estratégias de precificação

### Margem 2× (mínimo recomendado)
Cobre custo de produção + despesas imprevistas. Use para amigos/família e geometrias simples.

### Margem 2,5× (padrão)
Bom equilíbrio entre preço e valor. Funciona para a maioria dos produtos.

### Margem 3× (premium)
Para modelos complexos, multicoloridos, alta qualidade ou mercados de nicho.

:::warning Não esqueça os custos ocultos
- Impressões falhas (5-15% de todas as impressões falham)
- Filamento que não é totalmente usado (os últimos 50g são frequentemente difíceis)
- Tempo gasto com atendimento ao cliente
- Embalagem e frete
- Manutenção da impressora
:::

## Exemplo: Precificar um suporte para celular

| Parâmetro | Valor |
|-----------|-------|
| Peso do filamento | 45g PLA |
| Tempo de impressão | 2 horas |
| Preço spot | 1,20 kr/kWh |

**Cálculo:**
- Filamento: 45g × 0,25 kr/g = 11,25 kr
- Resíduo (10%): 1,13 kr
- Eletricidade: 2h × 0,15kW × 1,20 = 0,36 kr
- Desgaste: 2h × 0,15 = 0,30 kr
- Mão de obra: (2h + 10min) × 200 kr/h = 433 kr (ou 0 para hobby)
- **Custo de produção (hobby)**: ~13 kr
- **Preço de venda 2,5×**: ~33 kr

## Salvar estimativa

Clique em **Salvar estimativa** para arquivar o cálculo. Estimativas salvas podem ser encontradas na aba **Salvos** na calculadora de custos.

## E-commerce

Se você usa o [módulo de e-commerce](../integrations/ecommerce), pode vincular estimativas de custo diretamente a pedidos para cálculo automático de preços.
