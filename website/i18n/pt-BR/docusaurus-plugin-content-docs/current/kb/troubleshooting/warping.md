---
sidebar_position: 2
title: Warping
description: Causas do warping e soluções — câmara fechada, brim, temperatura e draft shield
---

# Warping

O warping ocorre quando os cantos ou bordas da impressão levantam da chapa durante ou após a impressão. É causado pela contração térmica do material.

## O que é warping?

Quando o plástico esfria, ele contrai. As camadas superiores estão mais quentes que as inferiores — isso cria tensão que puxa as bordas para cima e curva a impressão. Quanto maior a diferença de temperatura, mais warping.

## Materiais mais propensos

| Material | Risco de warping | Requer câmara fechada |
|----------|-----------------|----------------------|
| PLA | Baixo | Não |
| PETG | Baixo–Moderado | Não |
| ABS | Alto | Sim |
| ASA | Alto | Sim |
| PA/Nylon | Muito alto | Sim |
| PC | Muito alto | Sim |
| TPU | Baixo | Não |

## Soluções

### 1. Use câmara fechada

A medida mais importante para ABS, ASA, PA e PC:
- Mantenha a temperatura da câmara a 40–55 °C para melhores resultados
- X1C e P1S: ative os ventiladores da câmara no modo "fechado"
- A1/P1P: use uma capa para reter o calor

### 2. Use brim

O brim é uma única camada de bordas extras largas que mantém a impressão fixada na chapa:

```
Bambu Studio:
1. Selecione a impressão no fatiador
2. Vá em Support → Brim
3. Defina a largura para 5–10 mm (quanto mais warping, mais largo)
4. Tipo: Outer Brim Only (recomendado)
```

:::tip Guia de largura de brim
- PLA (raramente necessário): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Nylon: 8–15 mm
:::

### 3. Aumente a temperatura da mesa

Temperatura de mesa mais alta reduz a diferença de temperatura entre as camadas:
- ABS: tente 105–110 °C
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Reduza o resfriamento da peça

Para materiais com tendência a warping — reduza ou desative o resfriamento da peça:
- ABS/ASA: 0–20% de resfriamento da peça
- PA: 0–30% de resfriamento da peça

### 5. Evite correntes de ar e ar frio

Mantenha a impressora longe de:
- Janelas e portas externas
- Ar-condicionado e ventiladores
- Correntes de ar no ambiente

Para P1P e A1: cubra as aberturas com papelão durante impressões críticas.

### 6. Draft Shield

Um draft shield é uma parede fina ao redor do objeto que retém o calor:

```
Bambu Studio:
1. Vá em Support → Draft Shield
2. Ative e defina a distância (3–5 mm)
```

Especialmente útil para objetos altos e estreitos.

### 7. Medidas de design do modelo

Ao projetar seus próprios modelos:
- Evite bases planas grandes (adicione chanfro/arredondamento nos cantos)
- Divida partes planas grandes em seções menores
- Use "mouse ears" — pequenos círculos nos cantos — no fatiador ou CAD

## Warping após resfriamento

Às vezes a impressão parece boa, mas o warping ocorre após ser removida da chapa:
- Aguarde sempre até que a chapa e a impressão estejam **completamente frias** (abaixo de 40 °C) antes de remover
- Para ABS: deixe esfriar dentro da câmara fechada para resfriamento mais lento
- Evite colocar a impressão quente em superfície fria
