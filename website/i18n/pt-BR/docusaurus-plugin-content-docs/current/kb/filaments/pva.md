---
sidebar_position: 8
title: PVA e materiais de suporte
description: Guia de PVA, HIPS, PVB e outros materiais de suporte para impressoras Bambu Lab
---

# PVA e materiais de suporte

Materiais de suporte são usados para imprimir geometrias complexas com overhangs, pontes e cavidades internas que não podem ser impressas sem suporte temporário. Após a impressão, o material de suporte é removido — mecanicamente ou por dissolução em um solvente.

## Visão geral

| Material | Solvente | Combinar com | Tempo de dissolução | Dificuldade |
|-----------|-----------|-------------|----------------|-------------------|
| PVA | Água | PLA, PETG | 12–24 horas | Difícil |
| HIPS | d-Limoneno | ABS, ASA | 12–24 horas | Moderada |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 horas | Moderada |
| BVOH | Água | PLA, PETG, PA | 4–8 horas | Difícil |

---

## PVA (Álcool Polivinílico)

PVA é um material de suporte solúvel em água, sendo a escolha mais utilizada para impressões baseadas em PLA com estruturas de suporte complexas.

### Configurações

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 190–210 °C |
| Temperatura da mesa | 45–60 °C |
| Resfriamento da peça | 100% |
| Velocidade | 60–80% |
| Retração | Aumentada (6–8 mm) |

### Placas de construção recomendadas

| Placa | Adequação | Cola bastão? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Excelente | Não |
| Textured PEI | Boa | Não |
| Engineering Plate | Boa | Não |
| High Temp Plate | Evitar | — |

### Compatibilidade

PVA funciona melhor com materiais que imprimem em **temperaturas semelhantes**:

| Material principal | Compatibilidade | Observação |
|---------------|---------------|---------|
| PLA | Excelente | Combinação ideal |
| PETG | Boa | Temperatura da mesa pode ser um pouco alta para PVA |
| ABS/ASA | Ruim | Temperatura da câmara muito alta — PVA degrada |
| PA (Nylon) | Ruim | Temperaturas muito altas |

### Dissolução

- Coloque a impressão finalizada em **água morna** (aprox. 40 °C)
- PVA se dissolve em **12–24 horas** dependendo da espessura
- Agite a água periodicamente para acelerar o processo
- Troque a água a cada 6–8 horas para dissolução mais rápida
- Limpador ultrassônico proporciona resultado significativamente mais rápido (2–6 horas)

:::danger PVA é extremamente higroscópico
PVA absorve umidade do ar **muito rapidamente** — mesmo horas de exposição podem arruinar o resultado da impressão. PVA que absorveu umidade causa:

- Bolhas intensas e sons de estalo
- Má adesão ao material principal
- Stringing e superfície pegajosa
- Bico entupido

**Sempre seque o PVA imediatamente antes do uso** e imprima de ambiente seco (caixa secadora).
:::

### Secagem do PVA

| Parâmetro | Valor |
|-----------|-------|
| Temperatura de secagem | 45–55 °C |
| Tempo de secagem | 6–10 horas |
| Nível higroscópico | Extremamente alto |
| Método de armazenamento | Caixa selada com dessecante, sempre |

---

## HIPS (Poliestireno de Alto Impacto)

HIPS é um material de suporte que se dissolve em d-limoneno (solvente cítrico). É o material de suporte preferido para ABS e ASA.

### Configurações

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220–240 °C |
| Temperatura da mesa | 90–100 °C |
| Temperatura da câmara | 40–50 °C (recomendado) |
| Resfriamento da peça | 20–40% |
| Velocidade | 70–90% |

### Compatibilidade

| Material principal | Compatibilidade | Observação |
|---------------|---------------|---------|
| ABS | Excelente | Combinação ideal — temperaturas similares |
| ASA | Excelente | Adesão muito boa |
| PLA | Ruim | Diferença de temperatura muito grande |
| PETG | Ruim | Comportamento térmico diferente |

### Dissolução em d-Limoneno

- Coloque a impressão em **d-limoneno** (solvente cítrico)
- Tempo de dissolução: **12–24 horas** em temperatura ambiente
- Aquecimento a 35–40 °C acelera o processo
- d-Limoneno pode ser reutilizado 2–3 vezes
- Enxágue a peça em água e seque após dissolução

### Vantagens sobre PVA

- **Muito menos sensível à umidade** — mais fácil de armazenar e manusear
- **Mais forte como material de suporte** — suporta mais sem se decompor
- **Melhor compatibilidade térmica** com ABS/ASA
- **Mais fácil de imprimir** — menos entupimentos e problemas

:::warning d-Limoneno é um solvente
Use luvas e trabalhe em ambiente ventilado. d-Limoneno pode irritar a pele e membranas mucosas. Armazene fora do alcance de crianças.
:::

---

## PVB (Polivinil Butiral)

PVB é um material de suporte único que se dissolve em isopropanol (IPA) e pode ser usado para alisar superfícies com vapor de IPA.

### Configurações

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 200–220 °C |
| Temperatura da mesa | 55–75 °C |
| Resfriamento da peça | 80–100% |
| Velocidade | 70–80% |

### Compatibilidade

| Material principal | Compatibilidade | Observação |
|---------------|---------------|---------|
| PLA | Boa | Adesão aceitável |
| PETG | Moderada | Temperatura da mesa pode variar |
| ABS/ASA | Ruim | Temperaturas muito altas |

### Alisamento de superfície com vapor de IPA

A propriedade única do PVB é que a superfície pode ser alisada com vapor de IPA:

1. Coloque a peça em um recipiente fechado
2. Coloque um pano úmido com IPA no fundo (sem contato direto com a peça)
3. Deixe o vapor agir por **30–60 minutos**
4. Retire e deixe secar por 24 horas
5. O resultado é uma superfície lisa e semi-brilhante

:::tip PVB como acabamento de superfície
Embora o PVB seja principalmente um material de suporte, ele pode ser impresso como camada externa em peças de PLA para criar uma superfície que pode ser alisada com IPA. Isso proporciona um acabamento que lembra ABS alisado com acetona.
:::

---

## Comparação de materiais de suporte

| Propriedade | PVA | HIPS | PVB | BVOH |
|----------|-----|------|-----|------|
| Solvente | Água | d-Limoneno | IPA | Água |
| Tempo de dissolução | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Sensibilidade à umidade | Extremamente alta | Baixa | Moderada | Extremamente alta |
| Dificuldade | Difícil | Moderada | Moderada | Difícil |
| Preço | Alto | Moderado | Alto | Muito alto |
| Melhor com | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Disponibilidade | Boa | Boa | Limitada | Limitada |
| Compatível com AMS | Sim (com dessecante) | Sim | Sim | Problemático |

---

## Dicas para extrusão dupla e multicolorido

### Diretrizes gerais

- **Quantidade de purge** — materiais de suporte requerem boa purgação na troca de material (mínimo 150–200 mm³)
- **Camadas de interface** — use 2–3 camadas de interface entre suporte e peça principal para superfície limpa
- **Distância** — defina a distância do suporte em 0.1–0.15 mm para fácil remoção após dissolução
- **Padrão de suporte** — use padrão triangular para PVA/BVOH, grade para HIPS

### Configuração do AMS

- Coloque o material de suporte em um **slot AMS com dessecante**
- Para PVA: considere caixa secadora externa com conexão Bowden
- Configure o perfil de material correto no Bambu Studio
- Teste com um modelo simples de overhang antes de imprimir peças complexas

### Problemas comuns e soluções

| Problema | Causa | Solução |
|---------|-------|---------|
| Suporte não adere | Distância muito grande | Reduza a distância de interface para 0.05 mm |
| Suporte adere demais | Distância muito pequena | Aumente a distância de interface para 0.2 mm |
| Bolhas no material de suporte | Umidade | Seque o filamento completamente |
| Stringing entre materiais | Retração insuficiente | Aumente a retração em 1–2 mm |
| Superfície ruim junto ao suporte | Poucas camadas de interface | Aumente para 3–4 camadas de interface |

:::tip Comece simples
Para sua primeira impressão com material de suporte: use PLA + PVA, um modelo simples com overhang evidente (45°+), e configurações padrão no Bambu Studio. Otimize conforme ganha experiência.
:::
