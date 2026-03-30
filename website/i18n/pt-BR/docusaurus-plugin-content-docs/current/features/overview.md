---
sidebar_position: 1
title: Visão geral das funções
description: Visão completa de todas as funções do Bambu Dashboard
---

# Visão geral das funções

O Bambu Dashboard reúne tudo o que você precisa para monitorar e controlar suas impressoras Bambu Lab em um único lugar.

## Dashboard

O painel principal exibe o status em tempo real da impressora ativa:

- **Temperatura** — medidores SVG animados para bico e mesa
- **Progresso** — progresso percentual com tempo estimado de conclusão
- **Câmera** — visualização ao vivo da câmera (RTSPS → MPEG1 via ffmpeg)
- **Painel AMS** — representação visual de todas as ranhuras do AMS com cor do filamento
- **Controle de velocidade** — controle deslizante para ajustar velocidade (Silencioso, Padrão, Sport, Turbo)
- **Painéis de estatísticas** — painéis estilo Grafana com gráficos animados
- **Telemetria** — valores ao vivo de ventiladores, temperaturas, pressão

Os painéis podem ser arrastados e soltos para personalizar o layout. Use o botão de bloqueio para fixar o layout.

## Estoque de filamentos

Veja [Filamento](./filament) para documentação completa.

- Rastreie todas as bobinas com nome, cor, peso e fabricante
- Sincronização AMS — veja quais bobinas estão no AMS
- Registro e plano de secagem
- Cartela de cores e suporte a etiquetas NFC
- Importação/exportação (CSV)

## Histórico de impressões

Veja [Histórico](./history) para documentação completa.

- Registro completo de todas as impressões
- Rastreamento de filamento por impressão
- Links para modelos no MakerWorld
- Estatísticas e exportação para CSV

## Agendador

Veja [Agendador](./scheduler) para documentação completa.

- Visualização em calendário das impressões
- Fila de impressão com priorização
- Despacho para várias impressoras

## Controle de impressora

Veja [Controle](./controls) para documentação completa.

- Controle de temperatura (bico, mesa, câmara)
- Controle de perfis de velocidade
- Controle de ventiladores
- Console G-code
- Carregar/descarregar filamento

## Alertas

O Bambu Dashboard suporta 7 canais de notificação:

| Canal | Eventos |
|-------|---------|
| Telegram | Impressão concluída, erro, pausa |
| Discord | Impressão concluída, erro, pausa |
| E-mail | Impressão concluída, erro |
| ntfy | Todos os eventos |
| Pushover | Todos os eventos |
| SMS (Twilio) | Erros críticos |
| Webhook | Payload personalizado |

Configure em **Configurações → Alertas**.

## Print Guard

O Print Guard monitora a impressão ativa via câmera (xcam) e sensores:

- Pausa automática em caso de erro de espaguete
- Nível de sensibilidade configurável
- Registro de eventos detectados

## Manutenção

A seção de manutenção rastreia:

- Próxima manutenção recomendada por componente (bico, placas, AMS)
- Rastreamento de desgaste com base no histórico de impressões
- Registro manual de tarefas de manutenção

## Multi-impressoras

Com suporte a várias impressoras, você pode:

- Gerenciar várias impressoras a partir de um único dashboard
- Alternar entre impressoras com o seletor
- Ver visão geral do status de todas as impressoras simultaneamente
- Distribuir trabalhos de impressão com a fila de impressão

## OBS Overlay

Uma página dedicada `obs.html` fornece um overlay limpo para integração com OBS Studio durante transmissões ao vivo de impressões.

## Atualizações

Atualização automática integrada via GitHub Releases. Notificação e atualização diretamente do dashboard em **Configurações → Atualização**.
