---
sidebar_position: 7
title: Configurar notificações
description: Configure Telegram, Discord, e-mail e notificações push no Bambu Dashboard
---

# Configurar notificações

O Bambu Dashboard pode te notificar sobre tudo — de impressões concluídas a erros críticos — via Telegram, Discord, e-mail ou notificações push do navegador.

## Visão geral dos canais de notificação

| Canal | Melhor para | Requer |
|-------|------------|--------|
| Telegram | Rápido, em qualquer lugar | Conta Telegram + token do bot |
| Discord | Equipe/comunidade | Servidor Discord + URL do webhook |
| E-mail (SMTP) | Notificações oficiais | Servidor SMTP |
| Push do navegador | Notificações de desktop | Navegador com suporte a push |

---

## Bot do Telegram

### Passo 1 — Crie o bot

1. Abra o Telegram e procure por **@BotFather**
2. Envie `/newbot`
3. Dê um nome ao bot (ex.: "Bambu Notificações")
4. Dê um nome de usuário ao bot (ex.: `bambu_notificacoes_bot`) — deve terminar em `bot`
5. O BotFather responderá com um **token de API**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Copie e guarde este token

### Passo 2 — Encontre seu Chat ID

1. Inicie uma conversa com o seu bot (pesquise o nome de usuário e clique em **Iniciar**)
2. Envie uma mensagem ao bot (ex.: "oi")
3. Vá em `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates` no navegador
4. Encontre `"chat":{"id": 123456789}` — esse é seu Chat ID

### Passo 3 — Conecte ao painel

1. Vá em **Configurações → Notificações → Telegram**
2. Cole o **Token do bot**
3. Cole o **Chat ID**
4. Clique em **Testar notificação** — você deverá receber uma mensagem de teste no Telegram
5. Clique em **Salvar**

:::tip Notificação em grupo
Quer notificar um grupo inteiro? Adicione o bot a um grupo do Telegram, encontre o Chat ID do grupo (número negativo, ex.: `-100123456789`) e use-o no lugar.
:::

---

## Webhook do Discord

### Passo 1 — Crie um webhook no Discord

1. Vá ao seu servidor Discord
2. Clique com o botão direito no canal onde quer as notificações → **Editar canal**
3. Vá em **Integrações → Webhooks**
4. Clique em **Novo Webhook**
5. Dê um nome (ex.: "Bambu Dashboard")
6. Escolha um avatar (opcional)
7. Clique em **Copiar URL do Webhook**

A URL ficará assim:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Passo 2 — Adicione ao painel

1. Vá em **Configurações → Notificações → Discord**
2. Cole a **URL do Webhook**
3. Clique em **Testar notificação** — o canal Discord deverá receber uma mensagem de teste
4. Clique em **Salvar**

---

## E-mail (SMTP)

### Informações necessárias

Você precisa das configurações SMTP do seu provedor de e-mail:

| Provedor | Servidor SMTP | Porta | Criptografia |
|----------|--------------|-------|--------------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Domínio próprio | smtp.seudominio.com.br | 587 | TLS |

:::warning Gmail exige senha de aplicativo
O Gmail bloqueia login com senha normal. Você deve criar uma **Senha de aplicativo** em Conta Google → Segurança → Verificação em duas etapas → Senhas de aplicativo.
:::

### Configuração no painel

1. Vá em **Configurações → Notificações → E-mail**
2. Preencha:
   - **Servidor SMTP**: ex.: `smtp.gmail.com`
   - **Porta**: `587`
   - **Nome de usuário**: seu endereço de e-mail
   - **Senha**: senha de aplicativo ou senha normal
   - **Endereço de**: o e-mail do qual a notificação é enviada
   - **Endereço para**: o e-mail onde você quer receber as notificações
3. Clique em **Testar e-mail**
4. Clique em **Salvar**

---

## Notificações push do navegador

As notificações push aparecem como notificações do sistema na área de trabalho — mesmo quando a aba do navegador está em segundo plano.

**Ativando:**
1. Vá em **Configurações → Notificações → Notificações push**
2. Clique em **Ativar notificações push**
3. O navegador pede permissão — clique em **Permitir**
4. Clique em **Testar notificação**

:::info Apenas no navegador onde você ativou
As notificações push são vinculadas ao navegador e dispositivo específicos. Ative em cada dispositivo onde você quer receber notificações.
:::

---

## Escolhendo eventos para notificar

Após configurar um canal de notificação, você pode escolher exatamente quais eventos disparam uma notificação:

**Em Configurações → Notificações → Eventos:**

| Evento | Recomendado |
|--------|-------------|
| Impressão concluída | Sim |
| Impressão com falha / cancelada | Sim |
| Print Guard: espaguete detectado | Sim |
| Erro HMS (crítico) | Sim |
| Aviso HMS | Opcional |
| Nível baixo de filamento | Sim |
| Erro do AMS | Sim |
| Impressora desconectada | Opcional |
| Lembrete de manutenção | Opcional |
| Backup noturno concluído | Não (incômodo) |

---

## Horas de silêncio (sem notificações à noite)

Evite ser acordado por uma impressão concluída às 03h:

1. Vá em **Configurações → Notificações → Horas de silêncio**
2. Ative **Horas de silêncio**
3. Defina o horário de-até (ex.: **22:00 até 07:00**)
4. Escolha quais eventos ainda devem notificar durante o período de silêncio:
   - **Erros HMS críticos** — recomendado manter ativo
   - **Print Guard** — recomendado manter ativo
   - **Impressão concluída** — pode ser desativado à noite

:::tip Impressões noturnas sem interrupção
Rode impressões à noite com horas de silêncio ativas. O Print Guard vigia — e você recebe um resumo de manhã.
:::
