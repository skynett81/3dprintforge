---
sidebar_position: 9
title: Backup e restauração
description: Backup automático e manual do 3DPrintForge, restauração e migração para novo servidor
---

# Backup e restauração

O 3DPrintForge armazena todos os dados localmente — histórico de impressões, estoque de filamentos, configurações, usuários e mais. Backups regulares garantem que você não perca nada em caso de falha do servidor ou ao migrar.

## O que está incluído no backup?

| Dados | Incluído | Observação |
|-------|---------|-----------|
| Histórico de impressões | Sim | Todos os logs e estatísticas |
| Estoque de filamentos | Sim | Carretéis, pesos, marcas |
| Configurações | Sim | Todas as configurações do sistema |
| Configuração das impressoras | Sim | Endereços IP, códigos de acesso |
| Usuários e funções | Sim | Senhas armazenadas como hash |
| Configuração de notificações | Sim | Tokens do Telegram, etc. |
| Fotos da câmera | Opcional | Podem gerar arquivos grandes |
| Vídeos time-lapse | Opcional | Excluídos por padrão |

## Backup automático noturno

Por padrão, um backup automático é executado toda noite às 03:00.

**Ver e configurar o backup automático:**
1. Vá em **Sistema → Backup**
2. Em **Backup automático** você vê:
   - Último backup bem-sucedido e horário
   - Próximo backup agendado
   - Número de backups armazenados (padrão: 7 dias)

**Configurar:**
- **Horário** — mude do padrão 03:00 para um horário que te convenha
- **Tempo de retenção** — número de dias em que os backups são mantidos (7, 14, 30 dias)
- **Local de armazenamento** — pasta local (padrão) ou caminho externo
- **Compressão** — ativada por padrão (reduz o tamanho em 60–80%)

:::info Os arquivos de backup são armazenados aqui por padrão
```
/caminho/para/3dprintforge/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Backup manual

Faça um backup a qualquer momento:

1. Vá em **Sistema → Backup**
2. Clique em **Fazer backup agora**
3. Aguarde até que o status mostre **Concluído**
4. Baixe o arquivo de backup clicando em **Baixar**

**Alternativo via terminal:**
```bash
cd /caminho/para/3dprintforge
node scripts/backup.js
```

O arquivo de backup é salvo em `data/backups/` com um registro de data e hora no nome do arquivo.

## Restaurar a partir de backup

:::warning A restauração substitui os dados existentes
Todos os dados existentes são substituídos pelo conteúdo do arquivo de backup. Certifique-se de que está restaurando o arquivo correto.
:::

### Pelo painel

1. Vá em **Sistema → Backup**
2. Clique em **Restaurar**
3. Selecione um arquivo de backup da lista ou envie um arquivo de backup do disco
4. Clique em **Restaurar agora**
5. O painel reinicia automaticamente após a restauração

### Pelo terminal

```bash
cd /caminho/para/3dprintforge
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Após a restauração, reinicie o painel:
```bash
sudo systemctl restart 3dprintforge
# ou
npm start
```

## Exportar e importar configurações

Quer apenas salvar as configurações (não todo o histórico)?

**Exportar:**
1. Vá em **Sistema → Configurações → Exportar**
2. Escolha o que deve ser incluído:
   - Configuração das impressoras
   - Configuração de notificações
   - Contas de usuários
   - Marcas e perfis de filamentos
3. Clique em **Exportar** — você baixa um arquivo `.json`

**Importar:**
1. Vá em **Sistema → Configurações → Importar**
2. Envie o arquivo `.json`
3. Escolha quais partes devem ser importadas
4. Clique em **Importar**

:::tip Útil em nova instalação
As configurações exportadas são práticas para levar a um novo servidor. Importe-as após uma nova instalação para não precisar configurar tudo do zero.
:::

## Migrar para novo servidor

Como mover o 3DPrintForge com todos os dados para uma nova máquina:

### Passo 1 — Faça backup no servidor antigo

1. Vá em **Sistema → Backup → Fazer backup agora**
2. Baixe o arquivo de backup
3. Copie o arquivo para o novo servidor (USB, scp, compartilhamento de rede)

### Passo 2 — Instale no novo servidor

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Siga o guia de instalação. Você não precisa configurar nada — apenas deixe o painel funcionando.

### Passo 3 — Restaure o backup

Quando o painel estiver rodando no novo servidor:

1. Vá em **Sistema → Backup → Restaurar**
2. Envie o arquivo de backup do servidor antigo
3. Clique em **Restaurar agora**

Tudo está agora no lugar: histórico, estoque de filamentos, configurações e usuários.

### Passo 4 — Verifique a conexão

1. Vá em **Configurações → Impressoras**
2. Teste a conexão com cada impressora
3. Verifique se os endereços IP ainda estão corretos (o novo servidor pode ter um IP diferente)

## Dicas para boas práticas de backup

- **Teste a restauração** — faça um backup e restaure em uma máquina de teste pelo menos uma vez. Backups não testados não são backups.
- **Armazene externamente** — copie regularmente o arquivo de backup para um disco externo ou armazenamento em nuvem (Nextcloud, Google Drive, etc.)
- **Configure uma notificação** — ative a notificação de "Backup com falha" em **Configurações → Notificações → Eventos** para saber imediatamente quando algo der errado
