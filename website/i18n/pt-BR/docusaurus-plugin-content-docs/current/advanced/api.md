---
sidebar_position: 1
title: Referência da API
description: API REST com 284+ endpoints, autenticação e rate limiting
---

# Referência da API

O Bambu Dashboard expõe uma API REST completa com 284+ endpoints. A documentação da API está disponível diretamente no dashboard.

## Documentação interativa

Abra a documentação OpenAPI no navegador:

```
https://seu-servidor:3443/api/docs
```

Aqui você encontrará todos os endpoints, parâmetros, esquemas de requisição/resposta e a possibilidade de testar a API diretamente.

## Autenticação

A API usa autenticação por **Bearer token** (JWT):

```bash
# Fazer login e obter token
curl -X POST https://seu-servidor:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "sua-senha"}'

# Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Use o token em todas as chamadas subsequentes:

```bash
curl https://seu-servidor:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Rate limiting

A API tem rate limiting para proteger o servidor:

| Limite | Valor |
|--------|-------|
| Requisições por minuto | 200 |
| Burst (máx. por segundo) | 20 |
| Resposta ao exceder | `429 Too Many Requests` |

O header `Retry-After` na resposta indica quantos segundos até a próxima requisição ser permitida.

## Visão geral dos endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Fazer login, obter JWT |
| POST | `/api/auth/logout` | Fazer logout |
| GET | `/api/auth/me` | Obter usuário logado |

### Impressoras
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/printers` | Listar todas as impressoras |
| POST | `/api/printers` | Adicionar impressora |
| GET | `/api/printers/:id` | Obter impressora |
| PUT | `/api/printers/:id` | Atualizar impressora |
| DELETE | `/api/printers/:id` | Excluir impressora |
| GET | `/api/printers/:id/status` | Status em tempo real |
| POST | `/api/printers/:id/command` | Enviar comando |

### Filamento
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/filaments` | Listar todas as bobinas |
| POST | `/api/filaments` | Adicionar bobina |
| PUT | `/api/filaments/:id` | Atualizar bobina |
| DELETE | `/api/filaments/:id` | Excluir bobina |
| GET | `/api/filaments/stats` | Estatísticas de consumo |

### Histórico de impressões
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/history` | Listar histórico (paginado) |
| GET | `/api/history/:id` | Obter impressão individual |
| GET | `/api/history/export` | Exportar CSV |
| GET | `/api/history/stats` | Estatísticas |

### Fila de impressão
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/queue` | Obter a fila |
| POST | `/api/queue` | Adicionar trabalho |
| PUT | `/api/queue/:id` | Atualizar trabalho |
| DELETE | `/api/queue/:id` | Remover trabalho |
| POST | `/api/queue/dispatch` | Forçar despacho |

## API WebSocket

Além do REST, existe uma API WebSocket para dados em tempo real:

```javascript
const ws = new WebSocket('wss://seu-servidor:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Tipos de mensagem (recebidos)
- `printer.status` — status atualizado da impressora
- `print.progress` — atualização do percentual de progresso
- `ams.update` — mudança de estado do AMS
- `notification` — mensagem de alerta

## Códigos de erro

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Não autorizado |
| 404 | Não encontrado |
| 429 | Muitas requisições |
| 500 | Erro do servidor |
