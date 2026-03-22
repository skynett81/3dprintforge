---
sidebar_position: 5
title: Solução de problemas em impressões com falha
description: Diagnostique e resolva erros de impressão comuns usando os logs de erros e ferramentas do Bambu Dashboard
---

# Solução de problemas em impressões com falha

Algo deu errado? Não se preocupe — a maioria dos erros de impressão tem soluções simples. O Bambu Dashboard ajuda você a encontrar a causa rapidamente.

## Passo 1 — Verifique os códigos de erro HMS

HMS (Handling, Monitoring, Sensing) é o sistema de erros da Bambu Labs. Todos os erros são registrados automaticamente no painel.

1. Vá em **Monitoramento → Erros**
2. Encontre a impressão com falha
3. Clique no código de erro para ver descrição detalhada e solução sugerida

Códigos HMS comuns:

| Código | Descrição | Solução rápida |
|--------|-----------|----------------|
| 0700 1xxx | Erro AMS (atolamento, problema de motor) | Verifique o caminho do filamento no AMS |
| 0300 0xxx | Erro de extrusão (sub/super-extrusão) | Limpe o bico, verifique o filamento |
| 0500 xxxx | Erro de calibração | Execute recalibração |
| 1200 xxxx | Desvio de temperatura | Verifique conexões dos cabos |
| 0C00 xxxx | Erro de câmera | Reinicie a impressora |

:::tip Códigos de erro no histórico
Em **Histórico → [Impressão] → Log HMS** você pode ver todos os códigos de erro que ocorreram durante a impressão — mesmo que a impressão tenha "concluído".
:::

## Erros comuns e soluções

### Má aderência (primeira camada não adere)

**Sintomas:** A impressão solta da mesa, enrola, falta a primeira camada

**Causas e soluções:**

| Causa | Solução |
|-------|---------|
| Mesa suja | Limpe com álcool IPA |
| Temperatura de mesa errada | Aumente 5°C |
| Z-offset incorreto | Execute Auto Bed Leveling novamente |
| Falta cola em bastão (PETG/ABS) | Aplique camada fina de cola |
| Primeira camada muito rápida | Reduza para 20–30 mm/s na primeira camada |

**Lista de verificação rápida:**
1. A mesa está limpa? (IPA + pano sem fiapos)
2. Está usando a placa certa para o tipo de filamento? (veja [Escolhendo a placa certa](./velge-rett-plate))
3. A calibração Z foi feita após a última troca de placa?

---

### Warping (cantos levantam)

**Sintomas:** Cantos se curvam para cima da mesa, especialmente em modelos grandes e planos

**Causas e soluções:**

| Causa | Solução |
|-------|---------|
| Diferença de temperatura | Feche a porta frontal da impressora |
| Falta de brim | Ative brim no Bambu Studio (3–5 mm) |
| Mesa muito fria | Aumente temperatura da mesa em 5–10°C |
| Filamento com alta retração (ABS) | Use Engineering Plate + câmara >40°C |

**ABS e ASA são especialmente suscetíveis.** Sempre garanta:
- Porta frontal fechada
- Mínima ventilação
- Engineering Plate + cola
- Temperatura da câmara 40°C+

---

### Stringing (fios entre partes)

**Sintomas:** Fios finos de plástico entre partes separadas do modelo

**Causas e soluções:**

| Causa | Solução |
|-------|---------|
| Filamento úmido | Seque o filamento 6–8 horas (60–70°C) |
| Temperatura do bico muito alta | Reduza 5°C |
| Retração insuficiente | Aumente o comprimento de retração no Bambu Studio |
| Velocidade de deslocamento muito baixa | Aumente travel speed para 200+ mm/s |

**O teste de umidade:** Ouça estouros ou observe bolhas na extrusão — isso indica filamento úmido. O Bambu AMS tem medição de umidade integrada; verifique a umidade em **Status do AMS**.

:::tip Secador de filamento
Invista em um secador de filamento (ex.: Bambu Filament Dryer) se trabalhar com nylon ou TPU — esses absorvem umidade em menos de 12 horas.
:::

---

### Espaguete (impressão vira um amontoado)

**Sintomas:** Filamento pendurado em fios soltos no ar, impressão irreconhecível

**Causas e soluções:**

| Causa | Solução |
|-------|---------|
| Má aderência cedo → soltou → colapsou | Veja a seção de aderência acima |
| Velocidade muito alta | Reduza a velocidade em 20–30% |
| Configuração de suporte errada | Ative suportes no Bambu Studio |
| Overhang muito íngreme | Divida o modelo ou gire 45° |

**Use o Print Guard para parar o espaguete automaticamente** — veja a próxima seção.

---

### Sub-extrusão (camadas finas e fracas)

**Sintomas:** Camadas não são sólidas, buracos nas paredes, modelo fraco

**Causas e soluções:**

| Causa | Solução |
|-------|---------|
| Bico parcialmente entupido | Execute Cold Pull (veja manutenção) |
| Filamento muito úmido | Seque o filamento |
| Temperatura muito baixa | Aumente temperatura do bico em 5–10°C |
| Velocidade muito alta | Reduza 20–30% |
| Tubo PTFE danificado | Inspecione e substitua o tubo PTFE |

## Usando o Print Guard para proteção automática

O Print Guard monitora as imagens da câmera com reconhecimento de imagem e para a impressão automaticamente se espaguete for detectado.

**Ativando o Print Guard:**
1. Vá em **Monitoramento → Print Guard**
2. Ative **Detecção automática**
3. Escolha a ação: **Pausar** (recomendado) ou **Cancelar**
4. Defina a sensibilidade (comece com **Média**)

**Quando o Print Guard intervém:**
1. Você recebe uma notificação com foto da câmera do que foi detectado
2. A impressão é pausada
3. Você pode escolher: **Continuar** (se falso positivo) ou **Cancelar impressão**

:::info Falsos positivos
O Print Guard pode às vezes reagir a modelos com muitas colunas finas. Reduza a sensibilidade ou desative temporariamente para modelos complexos.
:::

## Ferramentas de diagnóstico no painel

### Log de temperatura
Em **Histórico → [Impressão] → Temperaturas** você pode ver a curva de temperatura ao longo de toda a impressão. Procure:
- Quedas repentinas de temperatura (problema no bico ou mesa)
- Temperaturas irregulares (necessidade de calibração)

### Estatísticas de filamento
Verifique se o filamento consumido corresponde à estimativa. Uma grande diferença pode indicar sub-extrusão ou quebra de filamento.

## Quando contatar o suporte?

Entre em contato com o suporte da Bambu Labs se:
- O código HMS se repete depois de seguir todas as soluções sugeridas
- Você vê danos mecânicos na impressora (hastes dobradas, engrenagens quebradas)
- Os valores de temperatura são impossíveis (ex.: bico lendo -40°C)
- Uma atualização de firmware não resolve o problema

**Útil ter pronto para o suporte:**
- Códigos de erro HMS do log de erros do painel
- Foto da câmera do erro
- Qual filamento e configurações foram usados (pode ser exportado do histórico)
- Modelo da impressora e versão do firmware (exibido em **Configurações → Impressora → Informações**)
