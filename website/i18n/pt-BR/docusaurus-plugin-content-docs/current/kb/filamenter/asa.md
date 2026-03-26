---
sidebar_position: 6
title: ASA
description: Guia para impressão ASA com Bambu Lab — resistência UV, uso externo, temperaturas e dicas
---

# ASA

ASA (Acrylonitrile Styrene Acrylate) é uma variante resistente a UV do ABS, especialmente desenvolvida para uso externo. O material combina a resistência e rigidez do ABS com uma resistência significativamente melhor à radiação UV, envelhecimento e intempéries.

## Configurações

| Parâmetro | Valor |
|-----------|-------|
| Temperatura do bico | 240–260 °C |
| Temperatura da mesa | 90–110 °C |
| Temperatura da câmara | 40–50 °C (recomendado) |
| Resfriamento da peça | 30–50% |
| Velocidade | 80–100% |
| Secagem necessária | Sim |

## Placas de construção recomendadas

| Placa | Adequação | Cola bastão? |
|-------|---------|----------|
| Engineering Plate | Excelente | Não |
| High Temp Plate | Boa | Sim |
| Textured PEI | Aceitável | Sim |
| Cool Plate (Smooth PEI) | Não recomendada | — |

:::tip Engineering Plate é a melhor para ASA
A Engineering Plate oferece a adesão mais confiável para ASA sem cola bastão. A placa suporta as altas temperaturas da mesa e proporciona boa aderência sem que a peça fique permanentemente grudada.
:::

## Requisitos da impressora

ASA requer **câmara fechada (enclosure)** para melhores resultados. Sem enclosure, você terá:

- **Empenamento** — cantos se levantam da placa de construção
- **Delaminação** — má adesão entre camadas
- **Rachaduras na superfície** — rachaduras visíveis ao longo da impressão

| Impressora | Adequada para ASA? | Observação |
|---------|---------------|---------|
| X1C | Excelente | Totalmente fechada, aquecimento ativo |
| X1E | Excelente | Totalmente fechada, aquecimento ativo |
| P1S | Boa | Fechada, aquecimento passivo |
| P1P | Possível com acessório | Requer acessório de enclosure |
| A1 | Não recomendada | Estrutura aberta |
| A1 Mini | Não recomendada | Estrutura aberta |

## ASA vs ABS — comparação

| Propriedade | ASA | ABS |
|----------|-----|-----|
| Resistência UV | Excelente | Ruim |
| Uso externo | Sim | Não (amarela e fica frágil) |
| Empenamento | Moderado | Alto |
| Superfície | Fosca, uniforme | Fosca, uniforme |
| Resistência química | Boa | Boa |
| Preço | Um pouco mais alto | Mais baixo |
| Odor durante impressão | Moderado | Forte |
| Resistência ao impacto | Boa | Boa |
| Resistência térmica | ~95–105 °C | ~95–105 °C |

:::warning Ventilação
ASA emite gases durante a impressão que podem ser irritantes. Imprima em ambiente bem ventilado ou com sistema de filtragem de ar. Não imprima ASA em ambientes onde você permanece por longos períodos sem ventilação.
:::

## Secagem

ASA é **moderadamente higroscópico** e absorve umidade do ar ao longo do tempo.

| Parâmetro | Valor |
|-----------|-------|
| Temperatura de secagem | 65 °C |
| Tempo de secagem | 4–6 horas |
| Nível higroscópico | Moderado |
| Sinais de umidade | Sons de estalo, bolhas, superfície ruim |

- Armazene em saco selado com sílica gel após abrir
- AMS com dessecante é suficiente para armazenamento de curto prazo
- Para armazenamento longo: use saco a vácuo ou caixa secadora de filamento

## Aplicações

ASA é o material preferido para tudo que será usado **ao ar livre**:

- **Componentes automotivos** — carcaças de espelho, detalhes do painel, tampas de válvula
- **Ferramentas de jardim** — clipes, grampos, peças de móveis de jardim
- **Sinalização externa** — placas, letras, logotipos
- **Peças de drone** — trem de pouso, suportes de câmera
- **Montagens de painéis solares** — suportes e ângulos
- **Peças de caixa de correio** — mecanismos e decorações

## Dicas para impressão ASA bem-sucedida

### Brim e adesão

- **Use brim** para peças grandes e peças com pequena área de contato
- Brim de 5–8 mm previne empenamento efetivamente
- Para peças menores, tente sem brim, mas tenha como backup

### Evite correntes de ar

- **Feche todas as portas e janelas** do ambiente durante a impressão
- Correntes de ar e ar frio são os piores inimigos do ASA
- Não abra a porta da câmara durante a impressão

### Estabilidade de temperatura

- Deixe a câmara aquecer por **10–15 minutos** antes de iniciar a impressão
- Temperatura estável da câmara proporciona resultados mais uniformes
- Evite posicionar a impressora perto de janelas ou saídas de ventilação

### Resfriamento

- ASA precisa de **resfriamento limitado** — 30–50% é típico
- Para overhangs e pontes, aumente para 60–70%, mas espere alguma delaminação
- Para peças mecânicas: priorize a adesão entre camadas sobre detalhes, reduzindo o resfriamento

:::tip Primeira vez com ASA?
Comece com uma peça de teste pequena (ex: cubo de 30 mm) para calibrar suas configurações. ASA se comporta muito semelhante ao ABS, mas com tendência ligeiramente menor ao empenamento. Se você tem experiência com ABS, ASA parecerá uma melhoria.
:::

---

## Encolhimento

ASA encolhe mais que PLA e PETG, mas geralmente um pouco menos que ABS:

| Material | Encolhimento |
|-----------|----------|
| PLA | ~0.3–0.5% |
| PETG | ~0.3–0.6% |
| ASA | ~0.5–0.7% |
| ABS | ~0.7–0.8% |

Para peças com tolerâncias apertadas: compense com 0.5–0.7% no fatiador, ou teste com peças de prova primeiro.

---

## Pós-processamento

- **Alisamento com acetona** — ASA pode ser alisado com vapor de acetona, assim como ABS
- **Lixamento** — lixa bem com lixa de 200–400 grãos
- **Colagem** — cola CA ou colagem com acetona funciona excelentemente
- **Pintura** — aceita pintura bem após leve lixamento

:::danger Manuseio de acetona
Acetona é inflamável e emite gases tóxicos. Sempre use em ambiente bem ventilado, evite chamas abertas e use equipamento de proteção (luvas e óculos).
:::
