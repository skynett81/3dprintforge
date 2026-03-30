---
sidebar_position: 9
title: Filamentos Bambu Lab
description: Guia completo das séries de filamentos próprios da Bambu Lab — configurações, RFID e compatibilidade AMS
---

# Filamentos Bambu Lab

A Bambu Lab produz uma ampla variedade de filamentos especialmente otimizados para suas impressoras. Todos os filamentos Bambu Lab vêm com **tag RFID** que é automaticamente detectada pela impressora e define as configurações corretas.

## RFID e AMS

Todos os filamentos Bambu Lab possuem um **chip RFID** embutido no carretel. Isso fornece:

- **Reconhecimento automático** — a impressora lê o tipo de material, cor e configurações
- **Quantidade restante** — filamento estimado restante no carretel
- **Configurações corretas** — temperatura, velocidade e resfriamento são definidos automaticamente
- **Compatibilidade AMS** — troca de material transparente no AMS

:::tip Filamentos de terceiros no AMS
O AMS também funciona com filamentos de terceiros, mas você precisa definir as configurações manualmente no Bambu Studio. A auto-detecção RFID é exclusiva para filamentos Bambu Lab.
:::

---

## Série PLA

A série PLA da Bambu Lab é a mais abrangente, cobrindo desde produtos básicos até efeitos especiais.

### PLA Basic

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220 °C |
| Temperatura da mesa | 35–45 °C |
| Resfriamento | 100% |
| RFID | Sim |
| Compatível com AMS | Sim |
| Preço | Econômico |

Filamento padrão para impressões do dia a dia. Disponível em ampla variedade de cores.

### PLA Matte

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220 °C |
| Temperatura da mesa | 35–45 °C |
| Resfriamento | 100% |
| Superfície | Fosca, sem brilho |

Proporciona superfície fosca uniforme que esconde linhas de camada melhor que PLA padrão. Escolha popular para impressões estéticas.

### PLA Silk

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 230 °C |
| Temperatura da mesa | 45–55 °C |
| Resfriamento | 80% |
| Superfície | Brilhante, aspecto metálico |

Proporciona superfície brilhante e sedosa com efeito metálico. Requer resfriamento e velocidade ligeiramente menores que PLA padrão.

### PLA Sparkle

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220–230 °C |
| Temperatura da mesa | 35–45 °C |
| Resfriamento | 100% |
| Superfície | Partículas de glitter |

Contém partículas de glitter que criam efeito cintilante. Imprime com configurações padrão de PLA.

### PLA Marble

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220 °C |
| Temperatura da mesa | 35–45 °C |
| Resfriamento | 100% |
| Superfície | Padrão marmorizado |

Proporciona efeito marmorizado único com variações de cor por toda a impressão. Cada impressão é ligeiramente diferente.

### PLA Tough (PLA-S)

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220–230 °C |
| Temperatura da mesa | 35–55 °C |
| Resfriamento | 100% |
| Resistência | 20–30% mais forte que PLA padrão |

PLA reforçado com resistência ao impacto aumentada. Adequado para peças mecânicas que precisam de mais resistência que PLA padrão.

### PLA Galaxy

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220–230 °C |
| Temperatura da mesa | 35–45 °C |
| Resfriamento | 100% |
| Superfície | Glitter + gradiente de cor |

Combina efeito glitter com gradientes de cor para efeito visual único. Imprime com configurações padrão de PLA.

---

## Série PETG

### PETG Basic

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 240–250 °C |
| Temperatura da mesa | 70–80 °C |
| Resfriamento | 50–70% |
| RFID | Sim |
| Compatível com AMS | Sim |

PETG padrão com boa resistência e flexibilidade. Disponível em boa variedade de cores.

### PETG HF (High Flow)

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 240–260 °C |
| Temperatura da mesa | 70–80 °C |
| Resfriamento | 50–70% |
| Velocidade | Até 300 mm/s |

Versão de alta velocidade do PETG formulada para extrusão mais rápida sem sacrificar qualidade. Ideal para peças grandes e produção em lote.

### PETG-CF

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 250–270 °C |
| Temperatura da mesa | 70–80 °C |
| Resfriamento | 40–60% |
| Bico | Aço endurecido obrigatório |

PETG reforçado com fibra de carbono com rigidez e estabilidade dimensional aumentadas. Requer bico endurecido (HS01 ou equivalente).

:::warning Bico endurecido para variantes CF
Todos os filamentos reforçados com fibra de carbono (PLA-CF, PETG-CF, PA-CF, PC-CF) requerem bico de aço endurecido. Latão se desgasta em horas a dias com materiais CF.
:::

---

## ABS e ASA

### ABS

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 250–270 °C |
| Temperatura da mesa | 90–110 °C |
| Temperatura da câmara | Recomendado 40 °C+ |
| Resfriamento | 20–40% |
| Enclosure | Recomendado |

### ASA

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 240–260 °C |
| Temperatura da mesa | 90–110 °C |
| Temperatura da câmara | Recomendado 40 °C+ |
| Resfriamento | 30–50% |
| Enclosure | Recomendado |
| Resistência UV | Excelente |

---

## TPU 95A

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220–240 °C |
| Temperatura da mesa | 35–50 °C |
| Resfriamento | 50–80% |
| Velocidade | 50–70% (reduzida) |
| Dureza Shore | 95A |
| Compatível com AMS | Limitado (alimentação direta recomendada) |

Filamento flexível para peças semelhantes a borracha. O AMS pode lidar com TPU 95A, mas alimentação direta dá melhores resultados para variantes mais macias.

:::tip TPU no AMS
O TPU 95A da Bambu Lab é especialmente formulado para funcionar com AMS. TPU mais macio (85A e abaixo) deve ser alimentado diretamente no extrusor.
:::

---

## Série PA (Nylon)

### PA6-CF

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 270–290 °C |
| Temperatura da mesa | 90–100 °C |
| Temperatura da câmara | 50 °C+ (obrigatório) |
| Resfriamento | 0–20% |
| Bico | Aço endurecido obrigatório |
| Enclosure | Obrigatório |
| Secagem | 70–80 °C por 8–12 horas |

Nylon reforçado com fibra de carbono com resistência e rigidez extremamente altas. Um dos materiais FDM mais fortes disponíveis.

### PA6-GF

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 270–290 °C |
| Temperatura da mesa | 90–100 °C |
| Temperatura da câmara | 50 °C+ (obrigatório) |
| Resfriamento | 0–20% |
| Bico | Aço endurecido obrigatório |
| Enclosure | Obrigatório |
| Secagem | 70–80 °C por 8–12 horas |

Nylon reforçado com fibra de vidro — mais barato que PA6-CF com boa rigidez e estabilidade dimensional.

---

## PC

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 260–280 °C |
| Temperatura da mesa | 100–120 °C |
| Temperatura da câmara | 50–60 °C (obrigatório) |
| Resfriamento | 0–20% |
| Enclosure | Obrigatório |
| Secagem | 70–80 °C por 6–8 horas |

Policarbonato da Bambu Lab para máxima resistência e resistência térmica.

---

## Materiais de suporte

### PVA

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 190–210 °C |
| Temperatura da mesa | 45–60 °C |
| Solvente | Água |
| Combinar com | PLA, PETG |

### HIPS

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 220–240 °C |
| Temperatura da mesa | 90–100 °C |
| Solvente | d-Limoneno |
| Combinar com | ABS, ASA |

---

## Controle de qualidade e consistência de cor

A Bambu Lab mantém controle de qualidade rigoroso em seus filamentos:

- **Tolerância de diâmetro** — ±0.02 mm (líder da indústria)
- **Consistência de cor** — controle de lote garante cor igual entre carretéis
- **Qualidade do carretel** — enrolamento uniforme sem nós ou sobreposição
- **Selagem a vácuo** — cada carretel é embalado a vácuo com dessecante
- **Teste de perfil de temperatura** — cada lote é testado para temperatura ideal

:::tip Número de cor para consistência
A Bambu Lab usa números de cor (ex: "Bambu PLA Matte Charcoal") com controle de lote. Se você precisa de cor idêntica em vários carretéis para um grande projeto, encomende do mesmo lote ou contate o suporte para correspondência de lotes.
:::

---

## Preço e disponibilidade

| Série | Faixa de preço | Disponibilidade |
|-------|-----------|----------------|
| PLA Basic | Econômico | Boa — ampla variedade |
| PLA Matte/Silk/Sparkle | Moderado | Boa |
| PLA Tough | Moderado | Boa |
| PETG Basic/HF | Moderado | Boa |
| PETG-CF | Alto | Moderada |
| ABS/ASA | Moderado | Boa |
| TPU 95A | Moderado | Variedade limitada |
| PA6-CF/GF | Alto | Moderada |
| PC | Alto | Limitada |
| PVA/HIPS | Alto | Boa |

Os filamentos Bambu Lab estão disponíveis na loja online oficial da Bambu Lab e em revendedores selecionados. Os preços são geralmente competitivos com outras marcas premium, especialmente o PLA Basic que é posicionado para o mercado econômico.
