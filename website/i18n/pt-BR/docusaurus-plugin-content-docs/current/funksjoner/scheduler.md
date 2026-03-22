---
sidebar_position: 4
title: Agendador
description: Planeje impressões, gerencie a fila de impressão e configure o despacho automático
---

# Agendador

O agendador permite organizar e automatizar trabalhos de impressão com visualização de calendário e uma fila de impressão inteligente.

## Visualização de calendário

A visualização de calendário oferece uma visão geral de todas as impressões planejadas e concluídas:

- **Visualização mensal, semanal e diária** — escolha o nível de detalhe
- **Codificação por cor** — cores diferentes por impressora e status
- **Clique em um evento** — veja detalhes da impressão

As impressões concluídas são exibidas automaticamente com base no histórico de impressões.

## Fila de impressão

A fila de impressão permite enfileirar trabalhos que são enviados para a impressora em sequência:

### Adicionar trabalho à fila

1. Clique em **+ Adicionar trabalho**
2. Selecione o arquivo (do SD da impressora, upload local ou FTP)
3. Defina a prioridade (alta, normal, baixa)
4. Selecione a impressora alvo (ou "automático")
5. Clique em **Adicionar**

### Gerenciamento da fila

| Ação | Descrição |
|------|-----------|
| Arrastar e soltar | Reorganize a ordem |
| Pausar fila | Interrompa o envio temporariamente |
| Pular | Envie o próximo trabalho sem esperar |
| Excluir | Remova o trabalho da fila |

:::tip Despacho para várias impressoras
Com várias impressoras, a fila pode distribuir automaticamente os trabalhos para impressoras disponíveis. Ative o **Despacho automático** em **Agendador → Configurações**.
:::

## Impressões agendadas

Configure impressões para iniciar em um horário específico:

1. Clique em **+ Agendar impressão**
2. Selecione o arquivo e a impressora
3. Defina o horário de início
4. Configure alertas (opcional)
5. Salve

:::warning A impressora deve estar livre
As impressões agendadas só iniciam se a impressora estiver em modo stand-by no horário definido. Se a impressora estiver ocupada, o início é adiado para o próximo horário disponível (configurável).
:::

## Balanceamento de carga

Com balanceamento de carga automático, os trabalhos são distribuídos inteligentemente entre as impressoras:

- **Round-robin** — distribuição uniforme entre todas as impressoras
- **Menos ocupada** — envie para a impressora com o menor tempo estimado de conclusão
- **Manual** — você escolhe a impressora para cada trabalho

Configure em **Agendador → Balanceamento de carga**.

## Alertas

O agendador integra com canais de notificação:

- Alerta quando um trabalho inicia
- Alerta quando um trabalho é concluído
- Alerta em caso de erro ou atraso

Veja [Visão geral das funções](./oversikt#varsler) para configurar canais de notificação.
