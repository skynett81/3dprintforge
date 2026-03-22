---
sidebar_position: 4
title: Escolhendo a placa certa
description: Visão geral das placas de impressão Bambu Labs e qual combina melhor com o seu filamento
---

# Escolhendo a placa certa

A placa de impressão correta é essencial para boa aderência e remoção fácil da impressão. A combinação errada resulta em má aderência ou impressões que ficam presas e danificam a placa.

## Tabela de referência rápida

| Filamento | Placa recomendada | Cola em bastão | Temperatura da placa |
|-----------|------------------|----------------|---------------------|
| PLA | Cool Plate / Textured PEI | Não / Sim | 35–45°C |
| PETG | Textured PEI | **Sim (obrigatório)** | 70°C |
| ABS | Engineering Plate / High Temp | Sim | 90–110°C |
| ASA | Engineering Plate / High Temp | Sim | 90–110°C |
| TPU | Textured PEI | Não | 35–45°C |
| PA (Nylon) | Engineering Plate | Sim | 90°C |
| PC | High Temp Plate | Sim | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Sim | 45–90°C |
| PVA | Cool Plate | Não | 35°C |

## Descrição das placas

### Cool Plate (PEI lisa)
**Melhor para:** PLA, PVA
**Superfície:** Lisa, dá fundo liso à impressão
**Remoção:** Dobre a placa levemente ou aguarde esfriar — a impressão solta sozinha

Não use Cool Plate com PETG — adere **forte demais** e pode arrancar o revestimento da placa.

### Textured PEI (Texturizada)
**Melhor para:** PETG, TPU, PLA (dá superfície rugosa)
**Superfície:** Texturizada, dá fundo rugoso e estético
**Remoção:** Aguarde temperatura ambiente — a impressão solta sozinha

:::warning PETG exige cola em bastão no Textured PEI
Sem cola em bastão, o PETG adere extremamente bem ao Textured PEI e pode arrancar o revestimento na remoção. Sempre aplique uma camada fina de cola em bastão (cola Bambu ou Elmer's Disappearing Purple Glue) em toda a superfície.
:::

### Engineering Plate
**Melhor para:** ABS, ASA, PA, PLA-CF, PETG-CF
**Superfície:** Revestimento de PEI fosco com menor adesão do que o Textured PEI
**Remoção:** Fácil de remover após resfriamento. Use cola para ABS/ASA

### High Temp Plate
**Melhor para:** PC, PA-CF, ABS em altas temperaturas
**Superfície:** Suporta temperatura da placa até 120°C sem deformação
**Remoção:** Resfrie até temperatura ambiente

## Erros comuns

### PETG na Cool Plate lisa (sem cola)
**Problema:** O PETG adere tão forte que a impressão não pode ser removida sem danos
**Solução:** Sempre use Textured PEI com cola, ou Engineering Plate

### ABS na Cool Plate
**Problema:** Warping — os cantos levantam durante a impressão
**Solução:** Engineering Plate + cola + aumentar temperatura da câmara (feche a porta frontal)

### PLA na High Temp Plate
**Problema:** Temperatura de placa muito alta gera aderência excessiva, difícil de remover
**Solução:** Cool Plate ou Textured PEI para PLA

### Cola em bastão em excesso
**Problema:** Cola grossa gera "pé de elefante" (primeira camada esparramada)
**Solução:** Uma camada fina — a cola mal deve aparecer

## Trocar a placa

1. **Deixe a placa esfriar** até temperatura ambiente (ou use luvas — a placa pode estar quente)
2. Levante a placa pela frente e puxe para fora
3. Insira a nova placa — o ímã a mantém no lugar
4. **Execute calibração automática** (Flow Rate e Bed Leveling) após a troca no Bambu Studio ou pelo painel em **Controles → Calibração**

:::info Lembre-se de calibrar após a troca
As placas têm espessuras ligeiramente diferentes. Sem calibração, a primeira camada pode ficar muito distante ou colidir com a placa.
:::

## Manutenção das placas

### Limpeza (a cada 2–5 impressões)
- Limpe com IPA (isopropanol 70–99%) e um pano sem fiapos
- Evite tocar a superfície com as mãos — gordura da pele reduz a aderência
- Para Textured PEI: lave com água morna e detergente suave após muitas impressões

### Remover resíduos de cola
- Aqueça a placa a 60°C
- Limpe com pano úmido
- Finalize com limpeza de IPA

### Substituição
Troque a placa quando você ver:
- Marcas ou depressões visíveis após a remoção de impressões
- Aderência consistentemente ruim mesmo após limpeza
- Bolhas ou manchas no revestimento

As placas Bambu duram tipicamente 200–500 impressões dependendo do tipo de filamento e cuidado.

:::tip Guarde as placas corretamente
Armazene placas não utilizadas na embalagem original ou em pé em um suporte — não empilhadas com objetos pesados em cima. Placas deformadas resultam em primeira camada irregular.
:::
