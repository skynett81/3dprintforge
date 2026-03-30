---
sidebar_position: 3
title: Stringing
description: Causas do stringing e soluções — retração, temperatura e secagem
---

# Stringing

O stringing (ou "oozing") são fios finos de plástico que se formam entre partes separadas do objeto enquanto o bico se move sem extrudar. Dá à impressão uma aparência de "teia de aranha".

## Causas do stringing

1. **Temperatura do bico muito alta** — plástico quente é fluido e goteja
2. **Configurações ruins de retração** — o filamento não é recolhido rápido o suficiente
3. **Filamento úmido** — a umidade causa vapor e fluxo extra
4. **Velocidade muito baixa** — o bico fica muito tempo em posições de trânsito

## Diagnóstico

**Filamento úmido?** Você ouve um estalo/estalido durante a impressão? Então o filamento está úmido — seque-o primeiro antes de ajustar outras configurações.

**Temperatura muito alta?** Você vê gotejamento do bico em momentos de "pausa"? Reduza a temperatura em 5–10 °C.

## Soluções

### 1. Seque o filamento

Filamento úmido é a causa mais comum de stringing que não pode ser ajustado:

| Material | Temperatura de secagem | Tempo |
|----------|----------------------|-------|
| PLA | 45–55 °C | 4–6 horas |
| PETG | 60–65 °C | 6–8 horas |
| TPU | 55–60 °C | 6–8 horas |
| PA | 75–85 °C | 8–12 horas |

### 2. Reduza a temperatura do bico

Comece reduzindo em 5 °C por vez:
- PLA: tente 210–215 °C (a partir de 220 °C)
- PETG: tente 235–240 °C (a partir de 245 °C)

:::warning Temperatura muito baixa causa fusão ruim de camadas
Reduza a temperatura com cuidado. Temperatura muito baixa causa fusão ruim das camadas, impressão fraca e problemas de extrusão.
:::

### 3. Ajuste as configurações de retração

A retração recua o filamento no bico durante o movimento de "viagem" para evitar gotejamento:

```
Bambu Studio → Filamento → Retração:
- Distância de retração: 0,4–1,0 mm (direct drive)
- Velocidade de retração: 30–45 mm/s
```

:::tip Impressoras Bambu Lab têm direct drive
Todas as impressoras Bambu Lab (X1C, P1S, A1) usam extrusor direct drive. O direct drive requer distância de retração **menor** que os sistemas Bowden (tipicamente 0,5–1,5 mm vs. 3–7 mm).
:::

### 4. Aumente a velocidade de viagem

Movimentos rápidos entre pontos dão ao bico menos tempo para gotejar:
- Aumente a "travel speed" para 200–300 mm/s
- As impressoras Bambu Lab lidam bem com isso

### 5. Ative "Avoid Crossing Perimeters"

Configuração do fatiador que faz o bico evitar cruzar áreas abertas onde o stringing ficará visível:
```
Bambu Studio → Qualidade → Avoid crossing perimeters
```

### 6. Reduza a velocidade (para TPU)

Para TPU, a solução é o oposto de outros materiais:
- Reduza a velocidade de impressão para 20–35 mm/s
- O TPU é elástico e se comprime em alta velocidade — isso cria "fluxo retardado"

## Após os ajustes

Teste com um modelo padrão de teste de stringing (ex.: "torture tower" do MakerWorld). Ajuste uma variável por vez e observe a mudança.

:::note Perfeição raramente é possível
Algum stringing é normal para a maioria dos materiais. Concentre-se em reduzir para um nível aceitável, não em eliminar completamente. O PETG sempre terá um pouco mais de stringing que o PLA.
:::
