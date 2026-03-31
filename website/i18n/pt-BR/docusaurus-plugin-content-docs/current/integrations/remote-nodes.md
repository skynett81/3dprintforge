---
sidebar_position: 4
title: Servidor remoto
description: Conecte várias instâncias do 3DPrintForge para ver todas as impressoras em um painel central
---

# Servidor remoto (Remote Nodes)

A funcionalidade de servidor remoto permite conectar várias instâncias do 3DPrintForge para que você possa ver e controlar todas as impressoras em uma única interface centralizada — seja na mesma rede ou em locais diferentes.

Acesse em: **https://localhost:3443/#settings** → **Integrações → Servidores remotos**

## Casos de uso

- **Casa + escritório** — Veja impressoras em ambos os locais no mesmo dashboard
- **Makerspace** — Dashboard central para todas as instâncias no espaço
- **Instâncias para visitantes** — Dê acesso limitado a clientes sem acesso completo

## Arquitetura

```
Instância primária (seu PC)
  ├── Impressora A (MQTT local)
  ├── Impressora B (MQTT local)
  └── Servidor remoto: Instância secundária
        ├── Impressora C (MQTT no local remoto)
        └── Impressora D (MQTT no local remoto)
```

A instância primária consulta os servidores remotos via REST API e agrega os dados localmente.

## Adicionar um servidor remoto

### Passo 1: Gerar chave de API na instância remota

1. Faça login na instância remota (ex.: `https://192.168.2.50:3443`)
2. Vá em **Configurações → Chaves de API**
3. Clique em **Nova chave** → dê o nome «Nó primário»
4. Defina as permissões: **Leitura** (mínimo) ou **Leitura + Escrita** (para controle remoto)
5. Copie a chave

### Passo 2: Conectar a partir da instância primária

1. Vá em **Configurações → Servidores remotos**
2. Clique em **Adicionar servidor remoto**
3. Preencha:
   - **Nome**: ex.: «Escritório» ou «Garagem»
   - **URL**: `https://192.168.2.50:3443` ou URL externa
   - **Chave de API**: a chave do passo 1
4. Clique em **Testar conexão**
5. Clique em **Salvar**

:::warning Certificado autoassinado
Se a instância remota usar um certificado autoassinado, ative **Ignorar erros TLS** — mas faça isso apenas para conexões de rede interna.
:::

## Visualização agregada

Após a conexão, as impressoras remotas aparecem em:

- **Visão geral da frota** — marcadas com o nome do servidor remoto e um ícone de nuvem
- **Estatísticas** — agregadas em todas as instâncias
- **Estoque de filamentos** — visão geral consolidada

## Controle remoto

Com permissão **Leitura + Escrita** você pode controlar impressoras remotas diretamente:

- Pausar / Retomar / Parar
- Adicionar à fila de impressão (o trabalho é enviado para a instância remota)
- Ver o stream da câmera (proxiado pela instância remota)

:::info Latência
O stream da câmera via servidor remoto pode ter um atraso perceptível dependendo da velocidade da rede e da distância.
:::

## Controle de acesso

Restrinja quais dados o servidor remoto compartilha:

1. Na instância remota: vá em **Configurações → Chaves de API → [Nome da chave]**
2. Restrinja o acesso:
   - Apenas impressoras específicas
   - Sem stream de câmera
   - Somente leitura

## Saúde e monitoramento

O status de cada servidor remoto é exibido em **Configurações → Servidores remotos**:

- **Conectado** — último poll bem-sucedido
- **Desconectado** — não é possível alcançar o servidor remoto
- **Erro de autenticação** — chave de API inválida ou expirada
- **Última sincronização** — timestamp da última sincronização de dados bem-sucedida
