---
sidebar_position: 2
title: Configuração inicial
description: Conecte sua impressora Bambu Lab e configure o dashboard
---

# Configuração inicial

Quando o dashboard é executado pela primeira vez, o assistente de configuração é aberto automaticamente.

## Assistente de configuração

O assistente está disponível em `https://seu-servidor:3443/setup`. Ele guia você por:

1. Criar usuário administrador
2. Adicionar impressora
3. Testar conexão
4. Configurar alertas (opcional)

## Adicionar uma impressora

Você precisa de três informações para conectar à impressora:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| Endereço IP | IP local da impressora | `192.168.1.100` |
| Número de série | 15 caracteres, está embaixo da impressora | `01P09C123456789` |
| Código de acesso | 8 caracteres, nas configurações de rede da impressora | `12345678` |

### Encontrar o Código de acesso na impressora

**X1C / P1S / P1P:**
1. Vá em **Configurações** na tela
2. Selecione **WLAN** ou **LAN**
3. Procure **Access Code**

**A1 / A1 Mini:**
1. Toque na tela e selecione **Configurações**
2. Vá em **WLAN**
3. Procure **Access Code**

:::tip IP fixo
Configure um endereço IP fixo para a impressora no seu roteador (reserva DHCP). Assim você não precisa atualizar o dashboard toda vez que a impressora receber um novo IP.
:::

## Configuração do AMS

Após a impressora ser conectada, o status do AMS é atualizado automaticamente. Você pode:

- Dar um nome e cor para cada ranhura
- Vincular bobinas ao seu estoque de filamentos
- Ver o consumo de filamento por bobina

Vá em **Configurações → Impressora → AMS** para configuração manual.

## Certificados HTTPS {#https-sertifikater}

### Certificado autoassinado (padrão)

O dashboard gera automaticamente um certificado autoassinado ao iniciar. Para confiar nele no navegador:

- **Chrome/Edge:** Clique em "Avançado" → "Continuar para o site"
- **Firefox:** Clique em "Avançado" → "Aceitar o risco e continuar"

### Certificado próprio

Coloque os arquivos do certificado na pasta e configure em `config.json`:

```json
{
  "ssl": {
    "cert": "/caminho/para/cert.pem",
    "key": "/caminho/para/key.pem"
  }
}
```

:::info Let's Encrypt
Está usando um nome de domínio? Gere um certificado gratuito com Let's Encrypt e Certbot, e aponte `cert` e `key` para os arquivos em `/etc/letsencrypt/live/seu-dominio/`.
:::

## Variáveis de ambiente

Todas as configurações podem ser substituídas por variáveis de ambiente:

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3000` | Porta HTTP |
| `HTTPS_PORT` | `3443` | Porta HTTPS |
| `NODE_ENV` | `production` | Ambiente |
| `AUTH_SECRET` | (auto) | Segredo JWT |

## Configuração com várias impressoras

Você pode adicionar várias impressoras em **Configurações → Impressoras → Adicionar impressora**. Use o seletor de impressora no topo do dashboard para alternar entre elas.
