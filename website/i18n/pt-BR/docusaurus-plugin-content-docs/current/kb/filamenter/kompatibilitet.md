---
sidebar_position: 10
title: Matriz de compatibilidade
description: Guia completo de compatibilidade de materiais com placas, impressoras e bicos Bambu Lab
---

# Matriz de compatibilidade

Esta página fornece uma visão geral completa de quais materiais funcionam com quais placas de construção, impressoras e tipos de bico. Use as tabelas como referência ao planejar impressões com novos materiais.

---

## Materiais e placas de construção

| Material | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Cola bastão |
|-----------|-----------|-------------------|-----------------|--------------|----------|
| PLA | Excelente | Boa | Não recomendada | Boa | Não |
| PLA+ | Excelente | Boa | Não recomendada | Boa | Não |
| PLA-CF | Excelente | Boa | Não recomendada | Boa | Não |
| PLA Silk | Excelente | Boa | Não recomendada | Boa | Não |
| PETG | Ruim | Excelente | Boa | Boa | Sim (Cool) |
| PETG-CF | Ruim | Excelente | Boa | Aceitável | Sim (Cool) |
| ABS | Não recomendado | Excelente | Boa | Aceitável | Sim (HT) |
| ASA | Não recomendado | Excelente | Boa | Aceitável | Sim (HT) |
| TPU | Boa | Boa | Não recomendada | Excelente | Não |
| PA (Nylon) | Não recomendado | Excelente | Boa | Ruim | Sim |
| PA-CF | Não recomendado | Excelente | Boa | Ruim | Sim |
| PA-GF | Não recomendado | Excelente | Boa | Ruim | Sim |
| PC | Não recomendado | Aceitável | Excelente | Não recomendado | Sim (Eng) |
| PC-CF | Não recomendado | Aceitável | Excelente | Não recomendado | Sim (Eng) |
| PVA | Excelente | Boa | Não recomendada | Boa | Não |
| HIPS | Não recomendado | Boa | Boa | Aceitável | Não |
| PVB | Boa | Boa | Não recomendada | Boa | Não |

**Legenda:**
- **Excelente** — funciona de forma ideal, combinação recomendada
- **Boa** — funciona bem, alternativa aceitável
- **Aceitável** — funciona, mas não ideal — requer medidas extras
- **Ruim** — pode funcionar com modificações, mas não recomendado
- **Não recomendado** — resultados ruins ou risco de dano à placa

:::tip PETG e Cool Plate
PETG adere **forte demais** à Cool Plate (Smooth PEI) e pode arrancar o revestimento PEI ao remover a peça. Sempre use cola bastão como filme de separação, ou escolha Engineering Plate.
:::

:::warning PC e escolha de placa
PC requer High Temp Plate devido às altas temperaturas da mesa (100–120 °C). Outras placas podem ser permanentemente deformadas nessas temperaturas.
:::

---

## Materiais e impressoras

| Material | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|-----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| PLA+ | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| PLA-CF | Sim* | Sim* | Sim* | Sim* | Sim* | Sim | Sim | Sim* | Sim* | Sim* |
| PETG | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| PETG-CF | Sim* | Sim* | Sim* | Sim* | Sim* | Sim | Sim | Sim* | Sim* | Sim* |
| ABS | Não | Não | Possível** | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| ASA | Não | Não | Possível** | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| TPU | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| PA (Nylon) | Não | Não | Não | Possível** | Possível** | Sim | Sim | Sim | Sim | Sim |
| PA-CF | Não | Não | Não | Não | Não | Sim | Sim | Possível** | Possível** | Possível** |
| PA-GF | Não | Não | Não | Não | Não | Sim | Sim | Possível** | Possível** | Possível** |
| PC | Não | Não | Não | Possível** | Não | Sim | Sim | Possível** | Possível** | Possível** |
| PC-CF | Não | Não | Não | Não | Não | Sim | Sim | Não | Não | Não |
| PVA | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| HIPS | Não | Não | Possível** | Sim | Sim | Sim | Sim | Sim | Sim | Sim |

**Legenda:**
- **Sim** — totalmente suportado e recomendado
- **Sim*** — requer bico de aço endurecido (HS01 ou equivalente)
- **Possível**** — pode funcionar com limitações, não oficialmente recomendado
- **Não** — não adequado (sem enclosure, temperaturas insuficientes, etc.)

:::danger Requisitos de enclosure
Materiais que requerem enclosure (ABS, ASA, PA, PC):
- **A1 e A1 Mini** têm estrutura aberta — não adequados
- **P1P** tem estrutura aberta — requer acessório de enclosure
- **P1S** tem enclosure, mas sem aquecimento ativo da câmara
- **X1C e X1E** têm enclosure completo com aquecimento ativo — recomendados para materiais exigentes
:::

---

## Materiais e tipos de bico

| Material | Latão (padrão) | Aço endurecido (HS01) | Hardened Steel |
|-----------|--------------------|--------------------|----------------|
| PLA | Excelente | Excelente | Excelente |
| PLA+ | Excelente | Excelente | Excelente |
| PLA-CF | Não usar | Excelente | Excelente |
| PLA Silk | Excelente | Excelente | Excelente |
| PETG | Excelente | Excelente | Excelente |
| PETG-CF | Não usar | Excelente | Excelente |
| ABS | Excelente | Excelente | Excelente |
| ASA | Excelente | Excelente | Excelente |
| TPU | Excelente | Boa | Boa |
| PA (Nylon) | Boa | Excelente | Excelente |
| PA-CF | Não usar | Excelente | Excelente |
| PA-GF | Não usar | Excelente | Excelente |
| PC | Boa | Excelente | Excelente |
| PC-CF | Não usar | Excelente | Excelente |
| PVA | Excelente | Boa | Boa |
| HIPS | Excelente | Excelente | Excelente |
| PVB | Excelente | Boa | Boa |

:::danger Fibra de carbono e vidro requerem bico endurecido
Todos os materiais com **-CF** (fibra de carbono) ou **-GF** (fibra de vidro) **requerem bico de aço endurecido**. Latão se desgasta em horas a dias com esses materiais. Bambu Lab HS01 é recomendado.

Materiais que requerem bico endurecido:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Latão vs aço endurecido para materiais comuns
Bico de latão oferece **melhor condutividade térmica** e portanto extrusão mais uniforme para materiais comuns (PLA, PETG, ABS). Aço endurecido funciona bem, mas pode requerer 5–10 °C a mais de temperatura. Use latão para uso diário e troque para aço endurecido para materiais CF/GF.
:::

---

## Dicas para troca de material

Ao trocar entre materiais no AMS ou manualmente, a purgação adequada é importante para evitar contaminação.

### Quantidade de purge recomendada

| Transição | Quantidade de purge | Observação |
|-----------|-------------|---------|
| PLA → PLA (outra cor) | 100–150 mm³ | Troca de cor padrão |
| PLA → PETG | 200–300 mm³ | Aumento de temperatura, fluxo diferente |
| PETG → PLA | 200–300 mm³ | Redução de temperatura |
| ABS → PLA | 300–400 mm³ | Grande diferença de temperatura |
| PLA → ABS | 300–400 mm³ | Grande diferença de temperatura |
| PA → PLA | 400–500 mm³ | Nylon permanece no hotend |
| PC → PLA | 400–500 mm³ | PC requer purga completa |
| Escuro → Claro | 200–300 mm³ | Pigmento escuro é difícil de limpar |
| Claro → Escuro | 100–150 mm³ | Transição mais fácil |

### Mudança de temperatura na troca de material

| Transição | Recomendação |
|----------|-----------|
| Frio → Quente (ex: PLA → ABS) | Aqueça até o novo material, purgue bem |
| Quente → Frio (ex: ABS → PLA) | Purgue primeiro em alta temperatura, depois reduza |
| Temperaturas similares (ex: PLA → PLA) | Purge padrão |
| Grande diferença (ex: PLA → PC) | Parada intermediária com PETG pode ajudar |

:::warning Nylon e PC deixam resíduos
PA (Nylon) e PC são especialmente difíceis de purgar. Após usar esses materiais:
1. Purgue com **PETG** ou **ABS** em alta temperatura (260–280 °C)
2. Use pelo menos **500 mm³** de material de purge
3. Inspecione visualmente a extrusão — deve estar completamente limpa sem descoloração
:::

---

## Referência rápida — escolha de material

Não tem certeza de qual material precisa? Use este guia:

| Necessidade | Material recomendado |
|-------|-------------------|
| Prototipagem / uso diário | PLA |
| Resistência mecânica | PETG, PLA Tough |
| Uso externo | ASA |
| Resistência ao calor | ABS, ASA, PC |
| Peças flexíveis | TPU |
| Resistência máxima | PA-CF, PC-CF |
| Transparente | PETG (natural), PC (natural) |
| Estética / decoração | PLA Silk, PLA Sparkle |
| Snap-fit / dobradiças vivas | PETG, PA |
| Contato com alimentos | PLA (com ressalvas) |
