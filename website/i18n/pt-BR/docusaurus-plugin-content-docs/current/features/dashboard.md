---
sidebar_position: 2
title: Painel principal
description: Visão geral em tempo real da impressora ativa com visualização 3D, status AMS, câmera e widgets personalizáveis
---

# Painel principal

O painel principal é o centro de controle do Bambu Dashboard. Exibe o status em tempo real da impressora selecionada e permite monitorar, controlar e personalizar a visualização conforme necessário.

Acesse em: **https://localhost:3443/**

## Visão geral em tempo real

Quando uma impressora está ativa, todos os valores são atualizados continuamente via MQTT:

- **Temperatura do bico** — medidor SVG animado com temperatura alvo
- **Temperatura da mesa** — medidor correspondente para a plataforma de construção
- **Porcentagem de progresso** — grande indicador percentual com tempo restante
- **Contador de camadas** — camada atual / total de camadas
- **Velocidade** — Silencioso / Padrão / Sport / Turbo com controle deslizante

:::tip Atualização em tempo real
Todos os valores são atualizados diretamente da impressora via MQTT sem recarregar a página. O atraso é tipicamente inferior a 1 segundo.
:::

## Visualização de modelo 3D

Se a impressora enviar um arquivo `.3mf` com o modelo, uma pré-visualização 3D interativa é exibida:

1. O modelo carrega automaticamente quando uma impressão inicia
2. Gire o modelo arrastando com o mouse
3. Role para ampliar/reduzir
4. Clique em **Redefinir** para voltar à visualização padrão

:::info Suporte
A visualização 3D requer que a impressora envie dados do modelo. Nem todos os trabalhos de impressão incluem isso.
:::

## Status do AMS

O painel AMS exibe todas as unidades AMS montadas com ranhuras e filamentos:

- **Cor da ranhura** — representação visual da cor a partir dos metadados da Bambu
- **Nome do filamento** — material e marca
- **Ranhura ativa** — marcada com animação de pulso durante a impressão
- **Erros** — indicador vermelho em caso de erros do AMS (bloqueio, vazio, úmido)

Clique em uma ranhura para ver informações completas do filamento e vinculá-lo ao estoque de filamentos.

## Feed da câmera

A visualização ao vivo da câmera é convertida via ffmpeg (RTSPS → MPEG1):

1. A câmera inicia automaticamente quando você abre o dashboard
2. Clique na imagem da câmera para abrir em tela cheia
3. Use o botão **Instantâneo** para tirar uma foto
4. Clique em **Ocultar câmera** para liberar espaço

:::warning Desempenho
O stream da câmera usa aproximadamente 2–5 Mbit/s. Desative a câmera em conexões de rede lentas.
:::

## Sparklines de temperatura

Abaixo do painel AMS, são exibidos mini-gráficos (sparklines) dos últimos 30 minutos:

- Temperatura do bico ao longo do tempo
- Temperatura da mesa ao longo do tempo
- Temperatura da câmara (onde disponível)

Clique em um sparkline para abrir a visualização completa do gráfico de telemetria.

## Personalização de widgets

O dashboard usa uma grade de arrastar e soltar (grid layout):

1. Clique em **Personalizar layout** (ícone de lápis no canto superior direito)
2. Arraste os widgets para a posição desejada
3. Redimensione arrastando pelo canto
4. Clique em **Bloquear layout** para fixar a posição
5. Clique em **Salvar** para preservar a configuração

Widgets disponíveis:
| Widget | Descrição |
|--------|-----------|
| Câmera | Visualização ao vivo da câmera |
| AMS | Status de bobinas e filamentos |
| Temperatura | Medidores para bico e mesa |
| Progresso | Indicador percentual e estimativa de tempo |
| Telemetria | Ventiladores, pressão, velocidade |
| Modelo 3D | Visualização interativa do modelo |
| Sparklines | Mini-gráficos de temperatura |

:::tip Salvamento
O layout é salvo por usuário no navegador (localStorage). Usuários diferentes podem ter configurações diferentes.
:::
