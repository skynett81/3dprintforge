---
sidebar_position: 5
title: Fila de impressão
description: Planeje e automatize impressões com fila priorizada, despacho automático e início escalonado
---

# Fila de impressão

A fila de impressão permite planejar impressões com antecedência e enviá-las automaticamente para impressoras disponíveis quando estiverem livres.

Acesse em: **https://localhost:3443/#queue**

## Criar uma fila

1. Vá em **Fila de impressão** no menu de navegação
2. Clique em **Novo trabalho** (ícone +)
3. Preencha:
   - **Nome do arquivo** — carregue `.3mf` ou `.gcode`
   - **Impressora alvo** — selecione uma impressora específica ou **Automático**
   - **Prioridade** — Baixa / Normal / Alta / Crítica
   - **Início agendado** — agora ou em uma data/hora específica
4. Clique em **Adicionar à fila**

:::tip Arrastar e soltar
Você pode arrastar arquivos diretamente do explorador de arquivos para a página da fila para adicioná-los rapidamente.
:::

## Adicionar arquivos

### Carregar arquivo

1. Clique em **Carregar** ou arraste um arquivo para o campo de upload
2. Formatos suportados: `.3mf`, `.gcode`, `.bgcode`
3. O arquivo é salvo na biblioteca de arquivos e vinculado ao trabalho da fila

### Da biblioteca de arquivos

1. Vá em **Biblioteca de arquivos** e encontre o arquivo
2. Clique em **Adicionar à fila** no arquivo
3. O trabalho é criado com as configurações padrão — edite se necessário

### Do histórico

1. Abra uma impressão anterior em **Histórico**
2. Clique em **Imprimir novamente**
3. O trabalho é adicionado com as mesmas configurações da última vez

## Prioridade

A fila é processada em ordem de prioridade:

| Prioridade | Cor | Descrição |
|------------|-----|-----------|
| Crítica | Vermelho | Enviada para a primeira impressora disponível independentemente de outros trabalhos |
| Alta | Laranja | À frente de trabalhos normais e baixos |
| Normal | Azul | Ordem padrão (FIFO) |
| Baixa | Cinza | Enviada somente quando não há trabalhos de maior prioridade aguardando |

Arraste e solte trabalhos na fila para alterar a ordem manualmente dentro do mesmo nível de prioridade.

## Despacho automático

Quando o **Despacho automático** está ativado, o Bambu Dashboard monitora todas as impressoras e envia o próximo trabalho automaticamente:

1. Vá em **Configurações → Fila**
2. Ative **Despacho automático**
3. Selecione a **Estratégia de despacho**:
   - **Primeiro disponível** — envia para a primeira impressora que ficar livre
   - **Menos utilizada** — prioriza a impressora com menos impressões hoje
   - **Round-robin** — rotaciona igualmente entre todas as impressoras

:::warning Confirmação
Ative **Exigir confirmação** nas configurações se quiser aprovar cada despacho manualmente antes de enviar o arquivo.
:::

## Início escalonado

O início escalonado é útil para evitar que todas as impressoras iniciem e terminem ao mesmo tempo:

1. No diálogo **Novo trabalho**, expanda **Configurações avançadas**
2. Ative **Início escalonado**
3. Defina o **Atraso entre impressoras** (ex.: 30 minutos)
4. O sistema distribui os horários de início automaticamente

**Exemplo:** 4 trabalhos idênticos com atraso de 30 minutos iniciam às 08:00, 08:30, 09:00 e 09:30.

## Status da fila e acompanhamento

A visão geral da fila exibe todos os trabalhos com status:

| Status | Descrição |
|--------|-----------|
| Aguardando | O trabalho está na fila esperando uma impressora |
| Agendado | Tem horário de início programado no futuro |
| Enviando | Sendo transferido para a impressora |
| Imprimindo | Em andamento na impressora selecionada |
| Concluído | Finalizado — vinculado ao histórico |
| Com falha | Erro ao enviar ou durante a impressão |
| Cancelado | Cancelado manualmente |

:::info Alertas
Ative alertas para eventos da fila em **Configurações → Alertas → Fila** para receber notificações quando um trabalho iniciar, for concluído ou falhar. Veja [Alertas](./notifications).
:::
