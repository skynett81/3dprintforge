---
sidebar_position: 3
title: Configurações
description: Visão geral completa de todas as configurações do 3DPrintForge — impressora, alertas, tema, OBS, energia, webhooks e mais
---

# Configurações

Todas as configurações do 3DPrintForge estão reunidas em uma única página com categorias claras. Aqui está uma visão geral do que está disponível em cada categoria.

Acesse em: **https://localhost:3443/#settings**

## Impressoras

Gerencie impressoras registradas:

| Configuração | Descrição |
|---|---|
| Adicionar impressora | Registre uma nova impressora com número de série e chave de acesso |
| Nome da impressora | Nome de exibição personalizado |
| Modelo da impressora | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| Conexão MQTT | Bambu Cloud MQTT ou MQTT local |
| Chave de acesso | LAN Access Code do aplicativo Bambu Lab |
| Endereço IP | Para modo local (LAN) |
| Configurações de câmera | Ativar/desativar, resolução |

Veja [Primeiros passos](../getting-started/setup) para configuração passo a passo da primeira impressora.

## Alertas

Veja a documentação completa em [Alertas](../features/notifications).

Visão geral rápida:
- Ativar/desativar canais de alerta (Telegram, Discord, e-mail, etc.)
- Filtro de eventos por canal
- Horários silenciosos (períodos sem alertas)
- Botão de teste por canal

## Tema

Veja a documentação completa em [Tema](./themes).

- Modo claro / escuro / automático
- 6 paletas de cores
- Cor de destaque personalizada
- Arredondamento e compactação

## OBS overlay

Configuração para OBS overlay:

| Configuração | Descrição |
|---|---|
| Tema padrão | dark / light / minimal |
| Posição padrão | Canto do overlay |
| Escala padrão | Escalonamento (0,5–2,0) |
| Mostrar QR code | Exibir QR code para o dashboard no overlay |

Veja [OBS Overlay](../features/obs-overlay) para sintaxe completa de URL e configuração.

## Energia e eletricidade

| Configuração | Descrição |
|---|---|
| Token da API Tibber | Acesso aos preços spot do Tibber |
| Área de preço Nordpool | Selecionar região de preço |
| Taxa de rede (R$/kWh) | Sua taxa de rede |
| Potência da impressora (W) | Configurar consumo de energia por modelo de impressora |

## Home Assistant

| Configuração | Descrição |
|---|---|
| Broker MQTT | IP, porta, usuário, senha |
| Prefixo de discovery | Padrão: `homeassistant` |
| Ativar discovery | Publicar entidades para o HA |

## Webhooks

Configurações globais de webhook:

| Configuração | Descrição |
|---|---|
| URL do webhook | URL do destinatário para eventos |
| Chave secreta | Assinatura HMAC-SHA256 |
| Filtro de eventos | Quais eventos são enviados |
| Tentativas de retry | Número de tentativas em caso de falha (padrão: 3) |
| Timeout | Segundos antes de a requisição desistir (padrão: 10) |

## Configurações da fila

| Configuração | Descrição |
|---|---|
| Despacho automático | Ativar/desativar |
| Estratégia de despacho | Primeiro disponível / Menos usado / Round-robin |
| Exigir confirmação | Aprovação manual antes do envio |
| Início escalonado | Atraso entre impressoras na fila |

## Segurança

| Configuração | Descrição |
|---|---|
| Duração da sessão | Horas/dias antes do logout automático |
| Forçar 2FA | Exigir 2FA para todos os usuários |
| Lista de permissão de IP | Restringir acesso a endereços IP específicos |
| Certificado HTTPS | Carregar certificado personalizado |

## Sistema

| Configuração | Descrição |
|---|---|
| Porta do servidor | Padrão: 3443 |
| Formato de log | JSON / Texto |
| Nível de log | Error / Warn / Info / Debug |
| Limpeza de banco de dados | Exclusão automática do histórico antigo |
| Atualizações | Verificar novas versões |
