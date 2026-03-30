---
sidebar_position: 4
title: Lubrificação
description: Lubrificação das hastes lineares, guias e intervalos para impressoras Bambu Lab
---

# Lubrificação

A lubrificação adequada das peças móveis reduz o desgaste, diminui o nível de ruído e garante movimentos precisos. As impressoras Bambu Lab usam sistemas de movimento linear que requerem lubrificação periódica.

## Tipos de lubrificação

| Componente | Tipo de lubrificação | Produto |
|------------|---------------------|---------|
| Hastes lineares (XY) | Óleo de máquina leve ou spray PTFE | 3-em-1, Super Lube |
| Fuso do eixo Z | Graxa espessa | Graxa Super Lube |
| Guias lineares | Graxa de lítio leve | Graxa Bambu Lab |
| Articulações do cabo corrente | Nenhum (seco) | — |

## Hastes lineares

### Eixos X e Y
As hastes são hastes de aço polido que deslizam por guias lineares:

```
Intervalo: A cada 200–300 horas, ou em caso de sons de rangido
Quantidade: Muito pouco — uma gota por ponto de haste é suficiente
Método:
1. Desligue a impressora
2. Mova o carro manualmente para a extremidade
3. Aplique 1 gota de óleo leve no meio da haste
4. Mova o carro lentamente para frente e para trás 10 vezes
5. Limpe o excesso de óleo com papel absorvente sem fiapos
```

:::warning Não lubrifique em excesso
Óleo em excesso atrai pó e cria uma pasta abrasiva. Use quantidades mínimas e sempre limpe o excesso.
:::

### Eixo Z (vertical)
O eixo Z usa um fuso (leadscrew) que requer graxa (não óleo):

```
Intervalo: A cada 200 horas
Método:
1. Desligue a impressora
2. Aplique uma camada fina de graxa ao longo do fuso
3. Mova o eixo Z para cima e para baixo manualmente (ou via menu de manutenção)
4. A graxa é distribuída automaticamente
```

## Guias lineares

As impressoras Bambu Lab P1S e X1C usam guias lineares (MGN12) no eixo Y:

```
Intervalo: A cada 300–500 horas
Método:
1. Retire um pouco da graxa antiga com um palito ou palito de dentes da abertura de injeção
2. Injete graxa nova com uma seringa e cânula fina
3. Mova o eixo para frente e para trás para distribuir a graxa
```

A Bambu Lab vende graxa oficial (Bambu Lubricant) calibrada para o sistema.

## Manutenção de lubrificação por modelo

### X1C / P1S
- Eixo Y: Guias lineares — graxa da Bambu
- Eixo X: Hastes de carbono — óleo leve
- Eixo Z: Fuso duplo — graxa da Bambu

### A1 / A1 Mini
- Todos os eixos: Hastes de aço — óleo leve
- Eixo Z: Fuso único — graxa da Bambu

## Sinais de que a lubrificação é necessária

- **Sons de rangido ou raspagem** ao mover
- **Padrões de vibração** visíveis nas paredes verticais (VFA)
- **Dimensões imprecisas** sem outras causas
- **Nível de ruído aumentado** do sistema de movimento

## Intervalos de lubrificação

| Atividade | Intervalo |
|-----------|---------|
| Óleo nas hastes XY | A cada 200–300 horas |
| Graxa no fuso Z | A cada 200 horas |
| Graxa nas guias lineares (X1C/P1S) | A cada 300–500 horas |
| Ciclo completo de manutenção | Semestral (ou 500 horas) |

Use o módulo de manutenção no dashboard para rastrear os intervalos automaticamente.
