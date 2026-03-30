---
sidebar_position: 4
title: Playground da API
description: Teste todos os 177 endpoints da API diretamente no navegador com documentação OpenAPI integrada e autenticação
---

# Playground da API

O playground da API permite explorar e testar todos os 177 endpoints da API do Bambu Dashboard diretamente no navegador — sem escrever código.

Acesse em: **https://localhost:3443/api/docs**

## O que é o playground da API?

O playground é uma versão interativa da documentação OpenAPI (Swagger UI) totalmente integrada ao dashboard. Você já está autenticado quando está logado, portanto pode testar endpoints diretamente.

## Navegar na documentação

Os endpoints são organizados em categorias:

| Categoria | Número de endpoints | Descrição |
|---|---|---|
| Impressoras | 24 | Obter status, controlar, configurar |
| Impressões / Histórico | 18 | Obter, pesquisar, exportar histórico |
| Filamento | 22 | Estoque, bobinas, perfis |
| Fila | 12 | Gerenciar fila de impressão |
| Estatísticas | 15 | Estatísticas agregadas e exportação |
| Alertas | 8 | Configurar e testar canais de alerta |
| Usuários | 10 | Usuários, funções, chaves de API |
| Configurações | 14 | Ler e alterar configuração |
| Manutenção | 12 | Tarefas de manutenção e registro |
| Integrações | 18 | HA, Tibber, webhooks, etc. |
| Biblioteca de arquivos | 14 | Carregar, analisar, gerenciar |
| Sistema | 10 | Backup, saúde, log |

Clique em uma categoria para expandir e ver todos os endpoints.

## Testar um endpoint

1. Clique em um endpoint (ex.: `GET /api/printers`)
2. Clique em **Try it out** (experimentar)
3. Preencha os parâmetros necessários (filtro, paginação, ID da impressora, etc.)
4. Clique em **Execute**
5. Veja a resposta abaixo: código de status HTTP, headers e corpo JSON

### Exemplo: Obter todas as impressoras

```
GET /api/printers
```
Retorna uma lista de todas as impressoras registradas com status em tempo real.

### Exemplo: Enviar comando para impressora

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Ambiente de produção
O playground da API está conectado ao sistema real. Os comandos são enviados para impressoras reais. Tenha cuidado com operações destrutivas como `DELETE` e `POST /command`.
:::

## Autenticação

### Autenticação por sessão (usuário logado)
Quando você está logado no dashboard, o playground já está autenticado via cookie de sessão. Nenhuma configuração adicional é necessária.

### Autenticação por chave de API

Para acesso externo:

1. Clique em **Authorize** (ícone de cadeado no topo do playground)
2. Preencha sua chave de API no campo **ApiKeyAuth**: `Bearer SUA_CHAVE`
3. Clique em **Authorize**

Gere chaves de API em **Configurações → Chaves de API** (veja [Autenticação](../system/auth)).

## Rate limiting

A API tem rate limiting de **200 requisições por minuto** por usuário/chave. O playground exibe as requisições restantes no header de resposta `X-RateLimit-Remaining`.

:::info Especificação OpenAPI
Baixe toda a especificação OpenAPI como YAML ou JSON:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Use a especificação para gerar bibliotecas cliente em Python, TypeScript, Go, etc.
:::

## Teste de webhooks

Teste integrações de webhook diretamente:

1. Vá em `POST /api/webhooks/test`
2. Selecione o tipo de evento na lista suspensa
3. O sistema envia um evento de teste para a URL de webhook configurada
4. Veja a requisição/resposta no playground
