---
sidebar_position: 0
title: Guia de filamentos
description: Guia completo de todos os filamentos para impressão 3D — temperaturas, placas, secagem e propriedades
---

# Guia de filamentos

Uma referência completa para todos os materiais de impressão 3D comuns. Use este guia para escolher o filamento e as configurações corretas para o seu projeto.

## Visão geral — Configurações de temperatura

| Material | Bico (°C) | Mesa (°C) | Câmara (°C) | Dificuldade |
|-----------|-----------|-----------|-------------|--------------|
| PLA | 190–230 (210) | 35–65 (55) | — | Iniciante |
| PLA-CF | 210–240 (220) | 45–65 (55) | — | Intermediário |
| PETG | 220–260 (240) | 60–80 (70) | — | Iniciante |
| PETG-CF | 230–270 (250) | 65–80 (70) | — | Intermediário |
| ABS | 240–270 (255) | 90–110 (100) | 40–60 | Intermediário |
| ASA | 240–270 (260) | 90–110 (100) | 40–60 | Intermediário |
| TPU | 210–240 (225) | 40–60 (50) | — | Avançado |
| PA (Nylon) | 260–290 (275) | 80–100 (90) | 40–60 | Avançado |
| PA-CF | 270–300 (285) | 80–100 (90) | 45–65 | Especialista |
| PA-GF | 270–300 (285) | 80–100 (90) | 45–65 | Especialista |
| PC | 260–300 (280) | 100–120 (110) | 50–70 | Especialista |
| PVA | 190–220 (200) | 45–60 (55) | — | Intermediário |
| PVB | 200–230 (215) | 50–70 (60) | — | Intermediário |
| HIPS | 220–250 (235) | 80–100 (90) | 35–50 | Intermediário |
| PET-CF | 250–280 (265) | 65–85 (75) | — | Avançado |

*Os valores entre parênteses são valores recomendados.*

## Compatibilidade de placas

| Material | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI |
|-----------|:----------:|:-----------------:|:---------------:|:------------:|
| PLA | ★★★ | ★★ | ✗ | ★★★ |
| PLA-CF | ★★ | ★★★ | ✗ | ★★★ |
| PETG | ✗ (cola) | ★★★ | ★★ | ★★★ |
| PETG-CF | ✗ (cola) | ★★★ | ★★ | ★★★ |
| ABS | ⊘ | ★★★ | ★★★ | ★★ |
| ASA | ⊘ | ★★★ | ★★★ | ★★ |
| TPU | ★★★ | ★★ | ✗ | ★★ |
| PA (Nylon) | ⊘ | ★★ (cola) | ★★★ | ★★ (cola) |
| PA-CF | ⊘ | ★★ (cola) | ★★★ | ★★ (cola) |
| PA-GF | ⊘ | ★★ (cola) | ★★★ | ★★ (cola) |
| PC | ⊘ | ★★ (cola) | ★★★ | ✗ (cola) |
| PVA | ★★ | ★★ | ✗ | ★★ |
| PVB | ★★ | ★★ | ✗ | ★★ |
| HIPS | ⊘ | ★★ | ★★★ | ★★ |
| PET-CF | ✗ (cola) | ★★★ | ★★ | ★★★ |

**Legenda:** ★★★ = Excelente, ★★ = Bom, ✗ = Ruim, ⊘ = Não recomendado, (cola) = Cola bastão necessária

## Secagem

| Material | Temperatura | Tempo | Sensibilidade à umidade |
|-----------|:----------:|:---:|:----------------:|
| PLA | 50 °C | 4h | Baixa |
| PLA-CF | 55 °C | 6h | Baixa |
| PETG | 65 °C | 6h | Média |
| PETG-CF | 65 °C | 8h | Média |
| ABS | 65 °C | 6h | Média |
| ASA | 65 °C | 6h | Média |
| TPU | 50 °C | 6h | Alta |
| PA (Nylon) | 80 °C | 12h | Extrema |
| PA-CF | 80 °C | 12h | Extrema |
| PA-GF | 80 °C | 12h | Extrema |
| PC | 80 °C | 8h | Alta |
| PVA | 45 °C | 8h | Extrema |
| PVB | 50 °C | 6h | Média |
| HIPS | 60 °C | 6h | Baixa |
| PET-CF | 65 °C | 8h | Média |

:::tip Regra de secagem
Materiais com sensibilidade à umidade **alta** ou **extrema** devem sempre ser secos antes do uso e armazenados com dessecante.
:::

## Requisitos especiais

| Material | Gabinete | Bico endurecido | Impressoras compatíveis |
|-----------|:---------:|:-----------:|:-------------------:|
| PLA | Não | Não | Todas |
| PLA-CF | Não | **Sim** | Todas |
| PETG | Não | Não | Todas |
| PETG-CF | Não | **Sim** | Todas |
| ABS | **Sim** | Não | Apenas fechadas |
| ASA | **Sim** | Não | Apenas fechadas |
| TPU | Não | Não | Todas |
| PA (Nylon) | **Sim** | Não | Apenas fechadas |
| PA-CF | **Sim** | **Sim** | Apenas fechadas |
| PA-GF | **Sim** | **Sim** | Apenas fechadas |
| PC | **Sim** | Não | Apenas fechadas |
| PVA | Não | Não | Todas |
| PVB | Não | Não | Todas |
| HIPS | **Sim** | Não | Apenas fechadas |
| PET-CF | Não | **Sim** | Todas |

## Propriedades (1–5)

| Material | Resistência | Flexibilidade | Calor | UV | Superfície | Imprimibilidade |
|-----------|:------:|:-------------:|:-----:|:--:|:---------:|:-----------:|
| PLA | 3 | 2 | 2 | 1 | 4 | 5 |
| PLA-CF | 4 | 1 | 2 | 2 | 3 | 4 |
| PETG | 4 | 3 | 3 | 3 | 3 | 4 |
| PETG-CF | 5 | 2 | 3 | 3 | 3 | 3 |
| ABS | 4 | 3 | 4 | 2 | 3 | 2 |
| ASA | 4 | 3 | 4 | 5 | 3 | 2 |
| TPU | 3 | 5 | 2 | 3 | 3 | 2 |
| PA (Nylon) | 5 | 4 | 4 | 2 | 3 | 2 |
| PA-CF | 5 | 2 | 5 | 3 | 3 | 1 |
| PA-GF | 5 | 2 | 5 | 3 | 2 | 1 |
| PC | 5 | 3 | 5 | 3 | 3 | 1 |
| PVA | 1 | 2 | 1 | 1 | 3 | 2 |
| PVB | 3 | 3 | 2 | 2 | 5 | 3 |
| HIPS | 3 | 2 | 3 | 2 | 3 | 3 |
| PET-CF | 5 | 2 | 4 | 3 | 3 | 3 |

## Dicas por material

### Padrão (PLA, PETG)
- PLA é o material mais fácil — perfeito para protótipos e decoração
- PETG oferece melhor resistência e tolerância ao calor, mas pode gerar mais fios
- Ambos funcionam sem gabinete e com bico de latão padrão

### Engenharia (ABS, ASA, PC)
- Requer uma impressora fechada para evitar empenamento
- ASA é resistente a UV — use para peças externas
- PC oferece a maior resistência e tolerância ao calor, mas é o mais difícil de imprimir

### Compósito (CF/GF)
- **Sempre** use um bico de aço endurecido — fibra de carbono desgasta bicos de latão rapidamente
- Variantes CF produzem peças mais rígidas e leves com acabamento fosco
- Variantes GF são mais baratas, mas produzem uma superfície mais áspera

### Flexível (TPU)
- Imprima lentamente (50 mm/s ou menos) para melhores resultados
- Reduza a retração para evitar entupimentos
- Extrusoras de acionamento direto funcionam muito melhor que Bowden

### Suporte (PVA, HIPS)
- PVA dissolve em água — perfeito para suporte de PLA
- HIPS dissolve em limoneno — usado junto com ABS
- Ambos são muito sensíveis à umidade — armazene seco

:::warning Materiais de Nylon
PA, PA-CF e PA-GF são **extremamente** higroscópicos. Absorvem umidade do ar em minutos. Sempre seque por 12+ horas antes do uso e imprima diretamente de uma caixa de secagem, se possível.
:::
