---
sidebar_position: 6
title: Alertas
description: Configure alertas via Telegram, Discord, e-mail, webhook, ntfy, Pushover e SMS para todos os eventos da impressora
---

# Alertas

O 3DPrintForge suporta alertas através de vários canais para que você sempre saiba o que está acontecendo com suas impressoras — seja em casa ou fora.

Acesse em: **https://localhost:3443/#settings** → aba **Alertas**

## Canais disponíveis

| Canal | Requer | Suporta imagens |
|-------|--------|-----------------|
| Telegram | Token do bot + Chat-ID | ✅ |
| Discord | URL do webhook | ✅ |
| E-mail | Servidor SMTP | ✅ |
| Webhook | URL + chave opcional | ✅ (base64) |
| ntfy | Servidor ntfy + tópico | ❌ |
| Pushover | Token API + User-key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Push no navegador | Sem configuração necessária | ❌ |

## Configuração por canal

### Telegram

1. Crie um bot via [@BotFather](https://t.me/BotFather) — envie `/newbot`
2. Copie o **token do bot** (formato: `123456789:ABC-def...`)
3. Inicie uma conversa com o bot e envie `/start`
4. Encontre seu **Chat-ID**: acesse `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. No 3DPrintForge: cole o token e o Chat-ID, clique em **Testar**

:::tip Canal de grupo
Você pode usar um grupo do Telegram como destinatário. O Chat-ID de grupos começa com `-`.
:::

### Discord

1. Abra o servidor Discord para o qual deseja enviar alertas
2. Vá em configurações do canal → **Integrações → Webhooks**
3. Clique em **Novo webhook**, dê um nome e selecione o canal
4. Copie a URL do webhook
5. Cole a URL no 3DPrintForge e clique em **Testar**

### E-mail

1. Preencha o servidor SMTP, porta (normalmente 587 para TLS)
2. Nome de usuário e senha da conta SMTP
3. Endereço **De** e endereço(s) **Para** (separados por vírgula para vários)
4. Ative **TLS/STARTTLS** para envio seguro
5. Clique em **Testar** para enviar um e-mail de teste

:::warning Gmail
Use **Senha de aplicativo** para o Gmail, não a senha normal. Ative a autenticação de dois fatores na sua conta do Google primeiro.
:::

### ntfy

1. Crie um tópico em [ntfy.sh](https://ntfy.sh) ou execute seu próprio servidor ntfy
2. Preencha a URL do servidor (ex.: `https://ntfy.sh`) e o nome do tópico
3. Instale o aplicativo ntfy no celular e inscreva-se no mesmo tópico
4. Clique em **Testar**

### Pushover

1. Crie uma conta em [pushover.net](https://pushover.net)
2. Crie um novo aplicativo — copie o **API Token**
3. Encontre sua **User Key** no dashboard do Pushover
4. Preencha ambos no 3DPrintForge e clique em **Testar**

### Webhook (personalizado)

O 3DPrintForge envia um HTTP POST com payload JSON:

```json
{
  "event": "print_complete",
  "printer": "Meu X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Adicione uma **Chave secreta** para validar requisições com assinatura HMAC-SHA256 no cabeçalho `X-Bambu-Signature`.

## Filtro de eventos

Escolha quais eventos devem acionar alertas por canal:

| Evento | Descrição |
|--------|-----------|
| Impressão iniciada | Nova impressão começa |
| Impressão concluída | Impressão concluída (com imagem) |
| Impressão com falha | Impressão cancelada com erro |
| Impressão pausada | Pausa manual ou automática |
| Print Guard alertou | XCam ou sensor acionou uma ação |
| Filamento baixo | Bobina quase vazia |
| Erro AMS | Bloqueio, filamento úmido, etc. |
| Impressora desconectada | Conexão MQTT perdida |
| Trabalho da fila enviado | Trabalho despachado da fila |

Marque os eventos desejados para cada canal individualmente.

## Horário silencioso

Evite alertas durante a noite:

1. Ative **Horário silencioso** nas configurações de alerta
2. Defina **De** e **Até** (ex.: 23:00 → 07:00)
3. Selecione o **Fuso horário** para o horário
4. Alertas críticos (erros do Print Guard) podem ser substituídos — marque **Sempre enviar críticos**

## Push no navegador

Receba alertas diretamente no navegador sem aplicativo:

1. Vá em **Configurações → Alertas → Push no navegador**
2. Clique em **Ativar push**
3. Aceite a caixa de diálogo de permissão do navegador
4. Os alertas funcionam mesmo com o dashboard minimizado (requer a aba aberta)

:::info PWA
Instale o 3DPrintForge como PWA para receber push em segundo plano sem aba aberta. Veja [PWA](../system/pwa).
:::
