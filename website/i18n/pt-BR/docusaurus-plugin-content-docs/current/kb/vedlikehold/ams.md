---
sidebar_position: 3
title: Manutenção do AMS
description: Manutenção do AMS — tubos PTFE, caminho do filamento e prevenção de umidade
---

# Manutenção do AMS

O AMS (Sistema Automático de Material) é um sistema preciso que requer manutenção regular para funcionar de forma confiável. Os problemas mais comuns são o caminho do filamento sujo e umidade no compartimento.

## Tubos PTFE

Os tubos PTFE transportam o filamento do AMS para a impressora. Estão entre as primeiras peças que se desgastam.

### Inspeção
Verifique os tubos PTFE em busca de:
- **Dobras ou curvas** — obstruem o fluxo do filamento
- **Desgaste nas conexões** — pó branco ao redor das entradas
- **Deformação da forma** — especialmente com o uso de materiais CF

### Substituição dos tubos PTFE
1. Libere o filamento do AMS (execute o ciclo de alívio)
2. Pressione o anel de travamento azul ao redor do tubo na conexão
3. Puxe o tubo para fora (requer uma boa pegada)
4. Corte o novo tubo no comprimento correto (não mais curto que o original)
5. Empurre até parar e trave

:::tip AMS Lite vs. AMS
O AMS Lite (A1/A1 Mini) tem uma configuração de PTFE mais simples que o AMS completo (P1S/X1C). Os tubos são mais curtos e mais fáceis de substituir.
:::

## Caminho do filamento

### Limpeza do caminho do filamento
Os filamentos deixam pó e resíduos no caminho do filamento, especialmente materiais CF:

1. Execute o descarregamento de todos os slots
2. Use ar comprimido ou um pincel macio para soprar o pó solto
3. Passe um pedaço limpo de nylon ou filamento de limpeza PTFE pelo caminho

### Sensores
O AMS usa sensores para detectar a posição do filamento e ruptura de filamento. Mantenha as janelas dos sensores limpas:
- Limpe suavemente as lentes dos sensores com um pincel limpo
- Evite IPA diretamente nos sensores

## Umidade

O AMS não protege o filamento da umidade. Para materiais higroscópicos (PA, PETG, TPU) recomenda-se:

### Alternativas AMS secas
- **Caixa selada:** Coloque as bobinas em uma caixa hermética com sílica gel
- **Bambu Dry Box:** Acessório oficial de caixa de secagem
- **Alimentação externa:** Use alimentação de filamento fora do AMS para materiais sensíveis

### Indicadores de umidade
Coloque cartões indicadores de umidade (higrômetro) no compartimento do AMS. Troque as bolsas de sílica gel quando a umidade relativa estiver acima de 30%.

## Rodas motrizes e mecanismo de aperto

### Inspeção
Verifique as rodas motrizes (rodas do extrusor no AMS) em busca de:
- Resíduos de filamento entre os dentes
- Desgaste no conjunto de dentes
- Atrito irregular ao puxar manualmente

### Limpeza
1. Use uma escova de dentes ou pincel para remover resíduos entre os dentes da roda motriz
2. Sopre com ar comprimido
3. Evite óleo e lubrificante — o nível de tração é calibrado para operação seca

## Intervalos de manutenção

| Atividade | Intervalo |
|-----------|---------|
| Inspeção visual dos tubos PTFE | Mensal |
| Limpeza do caminho do filamento | A cada 100 horas |
| Verificação dos sensores | Mensal |
| Troca de sílica gel (configuração de secagem) | Conforme necessário (acima de 30% UR) |
| Substituição dos tubos PTFE | Ao notar desgaste visível |
