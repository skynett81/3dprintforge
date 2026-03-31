---
sidebar_position: 1
title: Aderência ruim
description: Causas e soluções para aderência ruim na primeira camada — chapa, temperatura, cola, velocidade, Z-offset
---

# Aderência ruim

A aderência ruim é um dos problemas mais comuns na impressão 3D. A primeira camada não adere, ou as impressões param de aderir no meio do trabalho.

## Sintomas

- A primeira camada não adere — a impressão se move ou levanta
- Cantos e bordas levantam (warping)
- A impressão solta no meio do trabalho
- Primeira camada irregular com buracos ou fios soltos

## Lista de verificação — tente nesta ordem

### 1. Limpe a chapa
A causa mais comum de aderência ruim é gordura ou sujeira na chapa.

```
1. Limpe a chapa com IPA (álcool isopropílico)
2. Evite tocar a superfície de impressão com os dedos descalços
3. Em caso de problemas persistentes: lave com água e detergente suave
```

### 2. Calibre o Z-offset

O Z-offset é a altura entre o bico e a chapa na primeira camada. Muito alto = o fio fica solto. Muito baixo = o bico risca a chapa.

**Z-offset correto:**
- A primeira camada deve parecer levemente transparente
- O fio deve ser pressionado contra a chapa com um leve "esmagamento"
- Os fios devem se fundir levemente entre si

Ajuste o Z-offset via **Controle → Ajuste ao vivo do Z** durante a impressão.

:::tip Ajuste ao vivo durante a impressão
O 3DPrintForge exibe botões de ajuste do Z-offset durante a impressão ativa. Ajuste em passos de ±0,02 mm enquanto observa a primeira camada.
:::

### 3. Verifique a temperatura da mesa

| Material | Temp muito baixa | Recomendada |
|----------|-----------------|-------------|
| PLA | Abaixo de 30 °C | 35–45 °C |
| PETG | Abaixo de 60 °C | 70–85 °C |
| ABS | Abaixo de 80 °C | 90–110 °C |
| TPU | Abaixo de 25 °C | 30–45 °C |

Tente aumentar a temperatura da mesa em 5 °C por vez.

### 4. Use cola em bastão

A cola em bastão melhora a aderência para a maioria dos materiais na maioria das chapas:
- Aplique uma camada fina e uniforme
- Deixe secar 30 segundos antes de iniciar
- Especialmente importante para: ABS, PA, PC, PETG (em PEI liso)

### 5. Reduza a velocidade da primeira camada

Velocidade mais baixa na primeira camada proporciona melhor contato entre o filamento e a chapa:
- Padrão: 50 mm/s para a primeira camada
- Tente: 30–40 mm/s
- Bambu Studio: em **Qualidade → Velocidade da primeira camada**

### 6. Verifique o estado da chapa

Uma chapa desgastada produz aderência ruim mesmo com configurações perfeitas. Substitua a chapa se:
- O revestimento PEI estiver visivelmente danificado
- A limpeza não ajudar

### 7. Use brim

Para materiais com tendência a warping (ABS, PA, grandes objetos planos):
- Adicione brim no fatiador: 5–10 mm de largura
- Aumenta a área de contato e mantém as bordas baixas

## Casos especiais

### Objetos grandes e planos
Objetos grandes e planos são mais propensos a soltar. Medidas:
- Brim de 8–10 mm
- Aumente a temperatura da mesa
- Feche a câmara (ABS/PA)
- Reduza o resfriamento da peça

### Superfícies envidraçadas
Chapas com cola em bastão em excesso ao longo do tempo podem ficar envidraçadas. Lave bem com água e comece novamente.

### Após troca de filamento
Materiais diferentes requerem configurações diferentes. Verifique se a temperatura da mesa e a chapa estão configuradas para o novo material.
