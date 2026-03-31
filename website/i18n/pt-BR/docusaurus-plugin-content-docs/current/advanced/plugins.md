---
sidebar_position: 4
title: Sistema de plugins
description: Crie e instale plugins para estender o 3DPrintForge
---

# Sistema de plugins

O 3DPrintForge suporta um sistema de plugins que permite estender a funcionalidade sem modificar o código-fonte.

:::info Experimental
O sistema de plugins está em desenvolvimento ativo. A API pode mudar entre versões.
:::

## O que os plugins podem fazer?

- Adicionar novos endpoints de API
- Escutar eventos da impressora e reagir a eles
- Adicionar novos painéis no frontend
- Integrar com serviços de terceiros
- Estender os canais de alerta

## Estrutura do plugin

Um plugin é um módulo Node.js na pasta `plugins/`:

```
plugins/
└── meu-plugin/
    ├── plugin.json    # Metadados
    ├── index.js       # Ponto de entrada
    └── README.md      # Documentação (opcional)
```

### plugin.json

```json
{
  "name": "meu-plugin",
  "version": "1.0.0",
  "description": "Descrição do plugin",
  "author": "Seu nome",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // Chamado quando o plugin é carregado
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('Meu plugin foi carregado');

    // Registrar uma nova rota de API
    api.get('/plugins/meu-plugin/status', (req, res) => {
      res.json({ status: 'ativo' });
    });
  },

  // Chamado quando uma impressão começa
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`Impressão iniciada: ${printJob.name}`);
  },

  // Chamado quando uma impressão termina
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`Impressão concluída: ${printJob.name}`);
    // Salvar dados no banco de dados
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['meu-plugin', 'ultima-impressao', printJob.name]
    );
  }
};
```

## Hooks disponíveis

| Hook | Disparado quando |
|------|-----------------|
| `onLoad` | Plugin é carregado |
| `onUnload` | Plugin é descarregado |
| `onPrinterConnect` | Impressora se conecta |
| `onPrinterDisconnect` | Impressora se desconecta |
| `onPrintStart` | Impressão começa |
| `onPrintEnd` | Impressão é concluída |
| `onPrintFail` | Impressão falha |
| `onFilamentChange` | Troca de filamento |
| `onAmsUpdate` | Status do AMS é atualizado |

## Contexto do plugin

Todos os hooks recebem um objeto `context`:

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `api` | Express Router | Adicionar rotas de API personalizadas |
| `db` | SQLite | Acesso ao banco de dados |
| `logger` | Logger | Log |
| `events` | EventEmitter | Escutar eventos |
| `config` | Object | Configuração do dashboard |
| `printers` | Map | Todas as impressoras conectadas |

## Instalar um plugin

```bash
# Copiar a pasta do plugin
cp -r meu-plugin/ plugins/

# Reiniciar o dashboard
npm start
```

Os plugins são ativados automaticamente na inicialização se estiverem presentes na pasta `plugins/`.

## Desativar um plugin

Adicione `"disabled": true` no `plugin.json`, ou remova a pasta.

## Plugin de exemplo: Notificações Slack

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `Impressão concluída! *${job.name}* levou ${job.duration}`
    });
  }
};
```
