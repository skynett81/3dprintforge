---
sidebar_position: 3
title: Uso diário
description: Um guia prático para o uso diário do Bambu Dashboard — rotina matinal, monitoramento, após a impressão e manutenção
---

# Uso diário

Este guia cobre como usar o Bambu Dashboard de forma eficiente no dia a dia — do início ao fim do dia.

## Rotina matinal

Abra o painel e passe rapidamente por estes pontos:

### 1. Verifique o status das impressoras
O painel de visão geral mostra o status de todas as suas impressoras. Procure por:
- **Ícones vermelhos** — erros que precisam de atenção
- **Mensagens pendentes** — avisos HMS da noite
- **Impressões inconclusas** — se você teve uma impressão noturna, ela terminou?

### 2. Verifique os níveis do AMS
Vá em **Filamento** ou veja o widget do AMS no painel:
- Algum carretel está abaixo de 100 g? Troque ou peça um novo
- Filamento correto no slot correto para as impressões de hoje?

### 3. Verifique notificações e eventos
Em **Log de notificações** (ícone de sino) você vê:
- Eventos que ocorreram durante a noite
- Erros registrados automaticamente
- Códigos HMS que acionaram alarme

## Iniciar uma impressão

### A partir de um arquivo (Bambu Studio)
1. Abra o Bambu Studio
2. Carregue e fatie o modelo
3. Envie para a impressora — o painel atualiza automaticamente

### Da fila
Se você planejou impressões antecipadamente:
1. Vá em **Fila**
2. Clique em **Iniciar próximo** ou arraste um trabalho para o topo
3. Confirme com **Enviar para impressora**

Veja a [Documentação da fila de impressão](../funksjoner/queue) para informações completas sobre gerenciamento de fila.

### Impressão agendada (scheduler)
Para iniciar uma impressão em um horário específico:
1. Vá em **Agendador**
2. Clique em **+ Novo trabalho**
3. Escolha arquivo, impressora e horário
4. Ative **Otimização de tarifa elétrica** para escolher automaticamente o horário mais barato

Veja [Agendador](../funksjoner/scheduler) para detalhes.

## Monitorar uma impressão ativa

### Visualização da câmera
Clique no ícone de câmera no cartão da impressora. Você pode:
- Ver o feed ao vivo no painel
- Abrir em aba separada para monitoramento em segundo plano
- Tirar uma captura de tela manual

### Informações de progresso
O cartão de impressão ativa mostra:
- Porcentagem concluída
- Tempo estimado restante
- Camada atual / total de camadas
- Filamento ativo e cor

### Temperaturas
Curvas de temperatura em tempo real são exibidas no painel de detalhes:
- Temperatura do bico — deve se manter estável dentro de ±2°C
- Temperatura da mesa — importante para boa aderência
- Temperatura da câmara — sobe gradualmente, especialmente relevante para ABS/ASA

### Print Guard
Com o **Print Guard** ativado, o painel monitora automaticamente por espaguete e desvios volumétricos. Se algo for detectado:
1. A impressão é pausada
2. Você recebe uma notificação
3. As fotos da câmera são salvas para verificação posterior

## Após a impressão — lista de verificação

### Verifique a qualidade
1. Abra a câmera e olhe o resultado enquanto ainda está na mesa
2. Vá em **Histórico → Última impressão** para ver estatísticas
3. Registre uma nota: o que deu certo, o que pode melhorar

### Arquivar
Impressões no histórico nunca são arquivadas automaticamente — ficam lá. Se quiser organizar:
- Clique em uma impressão → **Arquivar** para mover para o arquivo
- Use **Projetos** para agrupar impressões relacionadas

### Atualizar o peso do filamento
Se você pesar o carretel para maior precisão (recomendado):
1. Pese o carretel
2. Vá em **Filamento → [O carretel]**
3. Atualize **Peso restante**

## Lembretes de manutenção

O painel rastreia intervalos de manutenção automaticamente. Em **Manutenção** você vê:

| Tarefa | Intervalo | Status |
|--------|-----------|--------|
| Limpar bico | A cada 50 horas | Verificado automaticamente |
| Lubrificar hastes | A cada 200 horas | Rastreado no painel |
| Calibrar mesa | Após troca de placa | Lembrete manual |
| Limpar AMS | Mensalmente | Notificação de calendário |

Ative notificações de manutenção em **Monitoramento → Manutenção → Notificações**.

:::tip Configure um dia de manutenção semanal
Um dia fixo de manutenção por semana (ex.: domingo à noite) te poupa de paralisações desnecessárias. Use a função de lembretes no painel.
:::

## Tarifa elétrica — melhor horário para imprimir

Se você conectou a integração de tarifa elétrica (Nordpool / Home Assistant):

1. Vá em **Análise → Tarifa elétrica**
2. Veja o gráfico de preços para as próximas 24 horas
3. Os horários mais baratos estão marcados em verde

Use o **Agendador** com **Otimização de tarifa elétrica** ativada — o painel iniciará automaticamente o trabalho na janela mais barata disponível.

:::info Horários tipicamente mais baratos
A madrugada (01h–06h) costuma ser a mais barata. Uma impressão de 8 horas enviada para a fila na noite anterior pode economizar 30–50% no custo de energia.
:::
