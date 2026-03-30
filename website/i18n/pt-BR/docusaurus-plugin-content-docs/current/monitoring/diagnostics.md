---
sidebar_position: 3
title: Diagnóstico
description: Pontuação de saúde, gráficos de telemetria, visualização de bed mesh e monitoramento de componentes para impressoras Bambu Lab
---

# Diagnóstico

A página de diagnóstico oferece uma visão aprofundada da saúde, desempenho e estado da impressora ao longo do tempo.

Acesse em: **https://localhost:3443/#diagnostics**

## Pontuação de saúde

Cada impressora calcula uma **pontuação de saúde** de 0–100 com base em:

| Fator | Peso | Descrição |
|-------|------|-----------|
| Taxa de sucesso (30d) | 30% | Proporção de impressões bem-sucedidas nos últimos 30 dias |
| Desgaste de componentes | 25% | Desgaste médio de peças críticas |
| Erros HMS (30d) | 20% | Número e gravidade dos erros |
| Status de calibração | 15% | Tempo desde a última calibração |
| Estabilidade de temperatura | 10% | Desvio da temperatura alvo durante a impressão |

**Interpretação da pontuação:**
- 🟢 80–100 — Excelente condição
- 🟡 60–79 — Bom, mas algo deve ser investigado
- 🟠 40–59 — Desempenho reduzido, manutenção recomendada
- 🔴 0–39 — Crítico, manutenção necessária

:::tip Histórico
Clique no gráfico de saúde para ver a evolução da pontuação ao longo do tempo. Quedas acentuadas podem indicar um evento específico.
:::

## Gráficos de telemetria

A página de telemetria exibe gráficos interativos para todos os valores dos sensores:

### Conjuntos de dados disponíveis

- **Temperatura do bico** — real vs. alvo
- **Temperatura da mesa** — real vs. alvo
- **Temperatura da câmara** — temperatura ambiente dentro da máquina
- **Motor do extrusor** — consumo de corrente e temperatura
- **Velocidades dos ventiladores** — cabeçote, câmara, AMS
- **Pressão** (X1C) — pressão da câmara para AMS
- **Aceleração** — dados de vibração (ADXL345)

### Navegar nos gráficos

1. Selecione o **Período**: Última hora / 24 horas / 7 dias / 30 dias / Personalizado
2. Selecione a **Impressora** na lista suspensa
3. Selecione os **Conjuntos de dados** a exibir (múltipla seleção suportada)
4. Role para ampliar a linha do tempo
5. Clique e arraste para panorâmica
6. Clique duplo para redefinir o zoom

### Exportar dados de telemetria

1. Clique em **Exportar** no gráfico
2. Selecione o formato: **CSV**, **JSON** ou **PNG** (imagem)
3. O período e os conjuntos de dados selecionados são exportados

## Bed Mesh

A visualização do bed mesh exibe a calibração de nivelamento da plataforma de construção:

1. Vá em **Diagnóstico → Bed Mesh**
2. Selecione a impressora
3. O mesh mais recente é exibido como superfície 3D e mapa de calor:
   - **Azul** — abaixo do centro (côncavo)
   - **Verde** — aproximadamente plano
   - **Vermelho** — acima do centro (convexo)
4. Passe o mouse sobre um ponto para ver o desvio exato em mm

### Escanear bed mesh pela UI

1. Clique em **Escanear agora** (requer que a impressora esteja livre)
2. Confirme na caixa de diálogo — a impressora inicia a calibração automaticamente
3. Aguarde a conclusão do escaneamento (aproximadamente 3–5 minutos)
4. O novo mesh é exibido automaticamente

:::warning Aqueça primeiro
O bed mesh deve ser escaneado com a mesa aquecida (50–60°C para PLA) para calibração precisa.
:::

## Desgaste de componentes

Veja [Previsão de desgaste](./wearprediction) para documentação detalhada.

A página de diagnóstico exibe uma visão geral comprimida:
- Pontuação percentual por componente
- Próxima manutenção recomendada
- Clique em **Detalhes** para análise completa de desgaste
