---
sidebar_position: 4
title: Manutenção
description: Controle a troca de bicos, lubrificação e outras tarefas de manutenção com lembretes, intervalos e registro de custos
---

# Manutenção

O módulo de manutenção ajuda a planejar e rastrear toda a manutenção das suas impressoras Bambu Lab — desde a troca de bicos até a lubrificação dos trilhos.

Acesse em: **https://localhost:3443/#maintenance**

## Plano de manutenção

O Bambu Dashboard vem com intervalos de manutenção pré-configurados para todos os modelos de impressoras Bambu Lab:

| Tarefa | Intervalo (padrão) | Modelo |
|--------|-------------------|--------|
| Limpar bico | A cada 200 horas | Todos |
| Trocar bico (latão) | A cada 500 horas | Todos |
| Trocar bico (endurecido) | A cada 2000 horas | Todos |
| Lubrificar eixo X | A cada 300 horas | X1C, P1S |
| Lubrificar eixo Z | A cada 300 horas | Todos |
| Limpar engrenagens AMS | A cada 200 horas | AMS |
| Limpar câmara | A cada 500 horas | X1C |
| Trocar tubo PTFE | Conforme necessário / 1000 horas | Todos |
| Calibração (completa) | Mensal | Todos |

Todos os intervalos podem ser personalizados por impressora.

## Registro de troca de bico

1. Vá em **Manutenção → Bicos**
2. Clique em **Registrar troca de bico**
3. Preencha:
   - **Data** — definida automaticamente para hoje
   - **Material do bico** — Latão / Aço endurecido / Cobre / Rubi
   - **Diâmetro do bico** — 0,2 / 0,4 / 0,6 / 0,8 mm
   - **Marca/modelo** — opcional
   - **Preço** — para registro de custos
   - **Horas na troca** — obtidas automaticamente do contador de horas de impressão
4. Clique em **Salvar**

O registro exibe todo o histórico de bicos ordenado por data.

:::tip Lembrete antecipado
Defina **Alertar X horas antes** (ex.: 50 horas) para receber um alerta com antecedência antes da próxima troca recomendada.
:::

## Criar tarefas de manutenção

1. Clique em **Nova tarefa** (ícone +)
2. Preencha:
   - **Nome da tarefa** — ex.: "Lubrificar eixo Y"
   - **Impressora** — selecione a(s) impressora(s) aplicável(is)
   - **Tipo de intervalo** — Horas / Dias / Número de impressões
   - **Intervalo** — ex.: 300 horas
   - **Última realização** — informe quando foi feita pela última vez (data retroativa)
3. Clique em **Criar**

## Intervalos e lembretes

Para tarefas ativas são exibidos:
- **Verde** — tempo até a próxima manutenção > 50% do intervalo restante
- **Amarelo** — tempo até a próxima manutenção < 50% restante
- **Laranja** — tempo até a próxima manutenção < 20% restante
- **Vermelho** — manutenção em atraso

### Configurar lembretes

1. Clique em uma tarefa → **Editar**
2. Ative **Lembretes**
3. Defina **Alertar quando** ex.: 10% restante até o vencimento
4. Selecione o canal de alerta (veja [Alertas](../features/notifications))

## Marcar como concluída

1. Encontre a tarefa na lista
2. Clique em **Concluída** (ícone de marca de seleção)
3. O intervalo é redefinido a partir da data/hora atual
4. Uma entrada de registro é criada automaticamente

## Registro de custos

Todas as tarefas de manutenção podem ter um custo associado:

- **Peças** — bicos, tubos PTFE, lubrificantes
- **Tempo** — horas gastas × taxa por hora
- **Serviço externo** — reparo pago

Os custos são somados por impressora e exibidos na visão geral de estatísticas.

## Histórico de manutenção

Vá em **Manutenção → Histórico** para ver:
- Todas as tarefas de manutenção concluídas
- Data, horas e custo
- Quem realizou (em sistema multiusuário)
- Comentários e notas

Exporte o histórico para CSV para fins contábeis.
