---
sidebar_position: 1
title: Autenticação
description: Gerencie usuários, funções, permissões, chaves de API e autenticação de dois fatores com TOTP
---

# Autenticação

O Bambu Dashboard suporta múltiplos usuários com controle de acesso baseado em funções, chaves de API e autenticação de dois fatores (2FA) opcional via TOTP.

Acesse em: **https://localhost:3443/#settings** → **Usuários e acesso**

## Usuários

### Criar um usuário

1. Vá em **Configurações → Usuários**
2. Clique em **Novo usuário**
3. Preencha:
   - **Nome de usuário** — usado para login
   - **Endereço de e-mail**
   - **Senha** — mínimo de 12 caracteres recomendado
   - **Função** — veja as funções abaixo
4. Clique em **Criar**

O novo usuário agora pode fazer login em **https://localhost:3443/login**.

### Alterar senha

1. Vá em **Perfil** (canto superior direito → clique no nome de usuário)
2. Clique em **Alterar senha**
3. Preencha a senha atual e a nova senha
4. Clique em **Salvar**

Administradores podem redefinir senhas de outros usuários em **Configurações → Usuários → [Usuário] → Redefinir senha**.

## Funções

| Função | Descrição |
|---|---|
| **Administrador** | Acesso total — todas as configurações, usuários e funcionalidades |
| **Operador** | Controlar impressoras, ver tudo, mas não alterar configurações do sistema |
| **Convidado** | Somente leitura — ver dashboard, histórico e estatísticas |
| **Usuário de API** | Somente acesso à API — sem interface web |

### Funções personalizadas

1. Vá em **Configurações → Funções**
2. Clique em **Nova função**
3. Selecione as permissões individualmente:
   - Ver dashboard / histórico / estatísticas
   - Controlar impressoras (pausar/parar/iniciar)
   - Gerenciar estoque de filamentos
   - Gerenciar fila
   - Ver stream de câmera
   - Alterar configurações
   - Gerenciar usuários
4. Clique em **Salvar**

## Chaves de API

As chaves de API fornecem acesso programático sem necessidade de login.

### Criar uma chave de API

1. Vá em **Configurações → Chaves de API**
2. Clique em **Nova chave**
3. Preencha:
   - **Nome** — nome descritivo (ex.: «Home Assistant», «Script Python»)
   - **Data de validade** — opcional, defina para maior segurança
   - **Permissões** — selecione uma função ou permissões específicas
4. Clique em **Gerar**
5. **Copie a chave agora** — ela é exibida apenas uma vez

### Usar a chave de API

Adicione no header HTTP para todas as chamadas de API:
```
Authorization: Bearer SUA_CHAVE_DE_API
```

Veja o [Playground da API](../verktoy/playground) para testes.

:::danger Armazenamento seguro
As chaves de API têm o mesmo acesso que o usuário ao qual estão vinculadas. Armazene-as com segurança e rotacione-as regularmente.
:::

## TOTP 2FA

Ative a autenticação de dois fatores com um aplicativo autenticador (Google Authenticator, Authy, Bitwarden, etc.):

### Ativar 2FA

1. Vá em **Perfil → Segurança → Autenticação de dois fatores**
2. Clique em **Ativar 2FA**
3. Escaneie o QR code com o aplicativo autenticador
4. Digite o código de 6 dígitos gerado para confirmar
5. Salve os **códigos de recuperação** (10 códigos de uso único) em um local seguro
6. Clique em **Ativar**

### Fazer login com 2FA

1. Digite o nome de usuário e a senha normalmente
2. Digite o código TOTP de 6 dígitos do aplicativo
3. Clique em **Entrar**

### 2FA obrigatório para todos os usuários

Os administradores podem exigir 2FA para todos os usuários:

1. Vá em **Configurações → Segurança → Forçar 2FA**
2. Ative a configuração
3. Usuários sem 2FA serão forçados a configurá-lo no próximo login

## Gerenciamento de sessões

- Duração padrão da sessão: 24 horas
- Ajuste em **Configurações → Segurança → Duração da sessão**
- Veja as sessões ativas por usuário e encerre sessões individuais
