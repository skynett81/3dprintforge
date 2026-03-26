---
sidebar_position: 7
title: PC
description: Guia para impressão de policarbonato com Bambu Lab — alta resistência, resistência térmica e requisitos
---

# PC (Policarbonato)

O policarbonato é um dos materiais termoplásticos mais fortes disponíveis para impressão FDM. Combina resistência ao impacto extremamente alta, resistência térmica de até 110–130 °C e transparência natural. O PC é um material exigente para imprimir, mas oferece resultados que se aproximam de peças injetadas em qualidade.

## Configurações

| Parâmetro | PC puro | Blend PC-ABS | PC-CF |
|-----------|--------|-------------|-------|
| Temperatura do bico | 260–280 °C | 250–270 °C | 270–290 °C |
| Temperatura da mesa | 100–120 °C | 90–110 °C | 100–120 °C |
| Temperatura da câmara | 50–60 °C (obrigatório) | 45–55 °C | 50–60 °C |
| Resfriamento da peça | 0–20% | 20–30% | 0–20% |
| Velocidade | 60–80% | 70–90% | 50–70% |
| Secagem necessária | Sim (crítico) | Sim | Sim (crítico) |

## Placas de construção recomendadas

| Placa | Adequação | Cola bastão? |
|-------|---------|----------|
| High Temp Plate | Excelente (obrigatória) | Não |
| Engineering Plate | Aceitável | Sim |
| Textured PEI | Não recomendada | — |
| Cool Plate (Smooth PEI) | Não usar | — |

:::danger High Temp Plate é obrigatória
PC requer temperaturas de mesa de 100–120 °C. Cool Plate e Textured PEI não suportam essas temperaturas e serão danificadas. Use **sempre** High Temp Plate para PC puro.
:::

## Requisitos de impressora e equipamento

### Enclosure (obrigatório)

PC requer uma **câmara completamente fechada** com temperatura estável de 50–60 °C. Sem isso, você terá empenamento severo, delaminação e separação de camadas.

### Bico endurecido (fortemente recomendado)

PC puro não é abrasivo, mas PC-CF e PC-GF **requerem bico de aço endurecido** (ex: Bambu Lab HS01). Para PC puro, o bico endurecido também é recomendado devido às altas temperaturas.

### Compatibilidade de impressora

| Impressora | Adequada para PC? | Observação |
|---------|--------------|---------|
| X1C | Excelente | Totalmente fechada, HS01 disponível |
| X1E | Excelente | Projetada para materiais de engenharia |
| P1S | Limitada | Fechada, mas sem aquecimento ativo da câmara |
| P1P | Não recomendada | Sem enclosure |
| A1 / A1 Mini | Não usar | Estrutura aberta, temperaturas insuficientes |

:::warning Apenas X1C e X1E são recomendadas
PC requer aquecimento ativo da câmara para resultados consistentes. P1S pode dar resultados aceitáveis com peças pequenas, mas espere empenamento e delaminação em peças maiores.
:::

## Secagem

PC é **muito higroscópico** e absorve umidade rapidamente. PC úmido resulta em impressões catastróficas.

| Parâmetro | Valor |
|-----------|-------|
| Temperatura de secagem | 70–80 °C |
| Tempo de secagem | 6–8 horas |
| Nível higroscópico | Alto |
| Umidade máxima recomendada | < 0.02% |

- **Sempre** seque PC antes de imprimir — mesmo bobinas recém-abertas podem ter absorvido umidade
- Imprima diretamente da caixa secadora se possível
- AMS **não é suficiente** para armazenamento de PC — a umidade é muito alta
- Use secador de filamento dedicado com aquecimento ativo

:::danger Umidade destrói impressões de PC
Sinais de PC úmido: sons fortes de estalo, bolhas na superfície, adesão entre camadas muito ruim, stringing. PC úmido não pode ser compensado com ajustes — **deve** ser seco primeiro.
:::

## Propriedades

| Propriedade | Valor |
|----------|-------|
| Resistência à tração | 55–75 MPa |
| Resistência ao impacto | Extremamente alta |
| Resistência térmica (HDT) | 110–130 °C |
| Transparência | Sim (variante natural/transparente) |
| Resistência química | Moderada |
| Resistência UV | Moderada (amarela com o tempo) |
| Encolhimento | ~0.5–0.7% |

## Blends de PC

### PC-ABS

Uma mistura de policarbonato e ABS que combina a resistência de ambos os materiais:

- **Mais fácil de imprimir** que PC puro — temperaturas mais baixas e menos empenamento
- **Resistência ao impacto** entre ABS e PC
- **Popular na indústria** — usado em interiores automotivos e carcaças eletrônicas
- Imprime a 250–270 °C no bico, 90–110 °C na mesa

### PC-CF (fibra de carbono)

PC reforçado com fibra de carbono para máxima rigidez e resistência:

- **Extremamente rígido** — ideal para peças estruturais
- **Leve** — fibra de carbono reduz o peso
- **Requer bico endurecido** — latão se desgasta em horas
- Imprime a 270–290 °C no bico, 100–120 °C na mesa
- Mais caro que PC puro, mas oferece propriedades mecânicas próximas ao alumínio

### PC-GF (fibra de vidro)

PC reforçado com fibra de vidro:

- **Mais barato que PC-CF** com boa rigidez
- **Superfície mais branca** que PC-CF
- **Requer bico endurecido** — fibras de vidro são muito abrasivas
- Rigidez um pouco menor que PC-CF, mas melhor resistência ao impacto

## Aplicações

PC é usado onde você precisa de **máxima resistência e/ou resistência térmica**:

- **Peças mecânicas** — engrenagens, fixadores, acoplamentos sob carga
- **Peças ópticas** — lentes, guias de luz, tampas transparentes (PC transparente)
- **Peças resistentes ao calor** — compartimento do motor, próximo a elementos de aquecimento
- **Carcaças eletrônicas** — caixa protetora com boa resistência ao impacto
- **Ferramentas e gabaritos** — ferramentas de montagem precisas

## Dicas para impressão PC bem-sucedida

### Primeira camada

- Reduza a velocidade para **30–40%** na primeira camada
- Aumente a temperatura da mesa em 5 °C acima do padrão para as primeiras 3–5 camadas
- **Brim é obrigatório** para a maioria das peças de PC — use 8–10 mm

### Temperatura da câmara

- Deixe a câmara atingir **50 °C+** antes de iniciar a impressão
- **Não abra a porta da câmara** durante a impressão — a queda de temperatura causa empenamento imediato
- Após a impressão: deixe a peça resfriar **lentamente** na câmara (1–2 horas)

### Resfriamento

- Use **resfriamento mínimo** (0–20%) para melhor adesão entre camadas
- Para pontes e overhangs: aumente temporariamente para 30–40%
- Com PC, priorize a resistência entre camadas sobre a estética

### Considerações de design

- **Evite cantos vivos** — arredonde com raio mínimo de 1 mm
- **Espessura de parede uniforme** — espessura irregular causa tensões internas
- **Superfícies grandes e planas** são difíceis — divida ou adicione nervuras

:::tip Novo com PC? Comece com PC-ABS
Se você nunca imprimiu PC antes, comece com uma blend PC-ABS. É muito mais tolerante que PC puro e permite ganhar experiência com o material sem os requisitos extremos. Quando dominar PC-ABS, avance para PC puro.
:::

---

## Pós-processamento

- **Lixamento** — PC lixa bem, mas use lixamento úmido para PC transparente
- **Polimento** — PC transparente pode ser polido até qualidade quase óptica
- **Colagem** — colagem com diclorometano cria juntas invisíveis (use EPI!)
- **Pintura** — requer primer para boa aderência
- **Recozimento** — 120 °C por 1–2 horas reduz tensões internas

:::warning Colagem com diclorometano
Diclorometano é tóxico e requer exaustão, luvas resistentes a químicos e óculos de proteção. Sempre trabalhe em ambiente bem ventilado ou em capela.
:::
