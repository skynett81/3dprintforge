---
sidebar_position: 5
title: Previsão de desgaste
description: Análise preditiva de 8 componentes da impressora com cálculo de vida útil, alertas de manutenção e previsão de custos
---

# Previsão de desgaste

A previsão de desgaste calcula a vida útil esperada dos componentes críticos com base no uso real, tipo de filamento e comportamento da impressora — para que você possa planejar a manutenção proativamente em vez de reativamente.

Acesse em: **https://localhost:3443/#wear**

## Componentes monitorados

O 3DPrintForge rastreia o desgaste de 8 componentes por impressora:

| Componente | Fator principal de desgaste | Vida útil típica |
|------------|----------------------------|------------------|
| **Bico (latão)** | Tipo de filamento + horas | 300–800 horas |
| **Bico (endurecido)** | Horas + material abrasivo | 1500–3000 horas |
| **Tubo PTFE** | Horas + alta temperatura | 500–1500 horas |
| **Engrenagem do extrusor** | Horas + material abrasivo | 1000–2000 horas |
| **Trilho do eixo X (CNC)** | Número de impressões + velocidade | 2000–5000 horas |
| **Superfície da plataforma** | Número de impressões + temperatura | 200–500 impressões |
| **Engrenagem AMS** | Número de trocas de filamento | 5000–15000 trocas |
| **Ventiladores da câmara** | Horas em funcionamento | 3000–8000 horas |

## Cálculo de desgaste

O desgaste é calculado como uma porcentagem acumulada (0–100% desgastado):

```
Desgaste % = (uso real / vida útil esperada) × 100
           × multiplicador de material
           × multiplicador de velocidade
```

**Multiplicadores de material:**
- PLA, PETG: 1,0× (desgaste normal)
- ABS, ASA: 1,1× (ligeiramente mais agressivo)
- PA, PC: 1,2× (difícil para PTFE e bico)
- Compósitos CF/GF: 2,0–3,0× (altamente abrasivo)

:::warning Fibra de carbono
Filamentos reforçados com fibra de carbono (CF-PLA, CF-PA, etc.) desgastam bicos de latão extremamente rápido. Use bico de aço endurecido e espere desgaste 2–3× mais rápido.
:::

## Cálculo de vida útil

Para cada componente são exibidos:

- **Desgaste atual** — porcentagem usada
- **Vida útil restante estimada** — horas ou impressões
- **Data de expiração estimada** — com base na média de uso dos últimos 30 dias
- **Intervalo de confiança** — margem de incerteza para a previsão

Clique em um componente para ver o gráfico detalhado de acumulação de desgaste ao longo do tempo.

## Alertas

Configure alertas automáticos por componente:

1. Vá em **Desgaste → Configurações**
2. Para cada componente, defina o **Limite de alerta** (recomendado: 75% e 90%)
3. Selecione o canal de alerta (veja [Alertas](../features/notifications))

**Exemplo de mensagem de alerta:**
> ⚠️ Bico (latão) no Meu X1C está 78% desgastado. Vida útil estimada: ~45 horas. Recomendado: Planeje a troca do bico.

## Custo de manutenção

O módulo de desgaste integra com o registro de custos:

- **Custo por componente** — preço da peça de reposição
- **Custo total de substituição** — soma de todos os componentes próximos do limite
- **Previsão para os próximos 6 meses** — custo estimado de manutenção futuro

Defina os preços dos componentes em **Desgaste → Preços**:

1. Clique em **Definir preços**
2. Preencha o preço por unidade para cada componente
3. O preço é usado nas previsões de custo e pode variar por modelo de impressora

## Redefinir o contador de desgaste

Após a manutenção, redefina o contador do componente em questão:

1. Vá em **Desgaste → [Nome do componente]**
2. Clique em **Marcar como substituído**
3. Preencha:
   - Data da substituição
   - Custo (opcional)
   - Nota (opcional)
4. O contador de desgaste é zerado e recalculado

As redefinições são exibidas no histórico de manutenção.

:::tip Calibração
Compare a previsão de desgaste com os dados reais de experiência e ajuste os parâmetros de vida útil em **Desgaste → Configurar vida útil** para adaptar os cálculos ao seu uso real.
:::
