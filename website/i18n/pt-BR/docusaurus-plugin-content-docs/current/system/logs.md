---
sidebar_position: 8
title: Log do servidor
description: Veja o log do servidor em tempo real, filtre por nível e módulo, e resolva problemas no Bambu Dashboard
---

# Log do servidor

O log do servidor fornece visibilidade sobre o que está acontecendo dentro do Bambu Dashboard — útil para solução de problemas, monitoramento e diagnóstico.

Acesse em: **https://localhost:3443/#logs**

## Visualização em tempo real

O fluxo de log é atualizado em tempo real via WebSocket:

1. Vá em **Sistema → Log do servidor**
2. Novas linhas de log aparecem automaticamente na parte inferior
3. Clique em **Fixar no final** para sempre rolar até o último log
4. Clique em **Pausar** para parar o scroll automático e ler as linhas existentes

A visualização padrão mostra as últimas 500 linhas de log.

## Níveis de log

Cada linha de log tem um nível:

| Nível | Cor | Descrição |
|---|---|---|
| **ERROR** | Vermelho | Erros que afetam a funcionalidade |
| **WARN** | Laranja | Avisos — algo pode dar errado |
| **INFO** | Azul | Informações normais de operação |
| **DEBUG** | Cinza | Informações detalhadas para desenvolvedores |

:::info Configuração do nível de log
Altere o nível de log em **Configurações → Sistema → Nível de log**. Para operação normal, use **INFO**. Use **DEBUG** apenas para solução de problemas, pois gera muito mais dados.
:::

## Filtragem

Use a barra de ferramentas de filtro no topo da visualização de log:

1. **Nível de log** — exibir apenas ERROR / WARN / INFO / DEBUG ou uma combinação
2. **Módulo** — filtrar por módulo do sistema:
   - `mqtt` — comunicação MQTT com impressoras
   - `api` — requisições de API
   - `db` — operações de banco de dados
   - `auth` — eventos de autenticação
   - `queue` — eventos da fila de impressão
   - `guard` — eventos do Print Guard
   - `backup` — operações de backup
3. **Texto livre** — pesquisar no texto do log (suporta regex)
4. **Período** — filtrar por intervalo de datas

Combine os filtros para solução de problemas precisa.

## Situações de erro comuns

### Problemas de conexão MQTT

Procure linhas de log do módulo `mqtt`:

```
ERROR [mqtt] Falha na conexão com a impressora XXXX: Connection refused
```

**Solução:** Verifique se a impressora está ligada, a chave de acesso está correta e a rede está funcionando.

### Erros de banco de dados

```
ERROR [db] A migração v95 falhou: SQLITE_CONSTRAINT
```

**Solução:** Faça um backup e execute o reparo do banco de dados via **Configurações → Sistema → Reparar banco de dados**.

### Erros de autenticação

```
WARN [auth] Login com falha para o usuário admin do IP 192.168.1.x
```

Muitas tentativas de login com falha podem indicar uma tentativa de força bruta. Verifique se a lista de permissão de IP deve ser ativada.

## Exportar logs

1. Clique em **Exportar log**
2. Selecione o período (padrão: últimas 24 horas)
3. Selecione o formato: **TXT** (legível por humanos) ou **JSON** (legível por máquina)
4. O arquivo é baixado

Os logs exportados são úteis ao reportar bugs ou ao entrar em contato com o suporte.

## Rotação de logs

Os logs são rotacionados automaticamente:

| Configuração | Padrão |
|---|---|
| Tamanho máximo do arquivo de log | 50 MB |
| Número de arquivos rotacionados a manter | 5 |
| Tamanho máximo total do log | 250 MB |

Ajuste em **Configurações → Sistema → Rotação de logs**. Arquivos de log mais antigos são comprimidos automaticamente com gzip.

## Localização dos arquivos de log

Os arquivos de log são armazenados no servidor:

```
./data/logs/
├── bambu-dashboard.log          (log ativo)
├── bambu-dashboard.log.1.gz     (rotacionado)
├── bambu-dashboard.log.2.gz     (rotacionado)
└── ...
```

:::tip Acesso SSH
Para ler os logs diretamente no servidor via SSH:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
