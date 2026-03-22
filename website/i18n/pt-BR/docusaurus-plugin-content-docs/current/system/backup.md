---
sidebar_position: 2
title: Backup
description: Crie, restaure e agende backups automáticos dos dados do Bambu Dashboard
---

# Backup

O Bambu Dashboard pode fazer backup de toda a configuração, histórico e dados para que você possa restaurar facilmente em caso de falha do sistema, migração do servidor ou problemas de atualização.

Acesse em: **https://localhost:3443/#settings** → **Sistema → Backup**

## O que é incluído em um backup

| Tipo de dados | Incluído | Observação |
|---|---|---|
| Configurações e configurações de impressoras | ✅ | |
| Histórico de impressões | ✅ | |
| Estoque de filamentos | ✅ | |
| Usuários e funções | ✅ | Senhas armazenadas com hash |
| Configurações | ✅ | Inclui configurações de alertas |
| Registro de manutenção | ✅ | |
| Projetos e faturas | ✅ | |
| Biblioteca de arquivos (metadados) | ✅ | |
| Biblioteca de arquivos (arquivos) | Opcional | Pode ser grande |
| Vídeos de timelapse | Opcional | Pode ser muito grande |
| Imagens da galeria | Opcional | |

## Criar um backup manual

1. Vá em **Configurações → Backup**
2. Selecione o que incluir (veja a tabela acima)
3. Clique em **Criar backup agora**
4. Um indicador de progresso é exibido enquanto o backup é criado
5. Clique em **Baixar** quando o backup estiver concluído

O backup é salvo como um arquivo `.zip` com timestamp no nome do arquivo:
```
bambu-dashboard-backup-2026-03-22T14-30-00.zip
```

## Baixar backup

Os arquivos de backup são armazenados na pasta de backup no servidor (configurável). Além disso, você pode baixá-los diretamente:

1. Vá em **Backup → Backups existentes**
2. Encontre o backup na lista (ordenada por data)
3. Clique em **Baixar** (ícone de download)

:::info Pasta de armazenamento
Pasta de armazenamento padrão: `./data/backups/`. Altere em **Configurações → Backup → Pasta de armazenamento**.
:::

## Backup automático agendado

1. Ative **Backup automático** em **Backup → Agendamento**
2. Selecione o intervalo:
   - **Diário** — executado às 03:00 (configurável)
   - **Semanal** — um dia específico da semana e horário
   - **Mensal** — primeiro dia do mês
3. Selecione o **Número de backups a manter** (ex.: 7 — os mais antigos são excluídos automaticamente)
4. Clique em **Salvar**

:::tip Armazenamento externo
Para dados importantes: monte um disco externo ou disco de rede como pasta de armazenamento de backups. Assim os backups sobrevivem mesmo se o disco do sistema falhar.
:::

## Restaurar a partir de backup

:::warning A restauração sobrescreve os dados existentes
A restauração substitui todos os dados existentes pelo conteúdo do arquivo de backup. Certifique-se de ter um backup recente dos dados atuais primeiro.
:::

### A partir de backup existente no servidor

1. Vá em **Backup → Backups existentes**
2. Encontre o backup na lista
3. Clique em **Restaurar**
4. Confirme no diálogo
5. O sistema reinicia automaticamente após a restauração

### A partir de arquivo de backup baixado

1. Clique em **Carregar backup**
2. Selecione o arquivo `.zip` do seu computador
3. O arquivo é validado — você verá o que está incluído
4. Clique em **Restaurar a partir do arquivo**
5. Confirme no diálogo

## Validação de backup

O Bambu Dashboard valida todos os arquivos de backup antes da restauração:

- Verifica que o formato ZIP é válido
- Verifica que o esquema do banco de dados é compatível com a versão atual
- Exibe um aviso se o backup for de uma versão mais antiga (a migração será executada automaticamente)
