---
sidebar_position: 6
title: Múltiplas impressoras
description: Configure e gerencie várias impressoras Bambu no Bambu Dashboard — visão geral da frota, fila e início escalonado
---

# Múltiplas impressoras

Tem mais de uma impressora? O Bambu Dashboard foi construído para gerenciamento de frota — você pode monitorar, controlar e coordenar todas as impressoras de um só lugar.

## Adicionando uma nova impressora

1. Vá em **Configurações → Impressoras**
2. Clique em **+ Adicionar impressora**
3. Preencha:

| Campo | Exemplo | Explicação |
|-------|---------|------------|
| Número de série (SN) | 01P... | Encontrado no Bambu Handy ou na tela da impressora |
| Endereço IP | 192.168.1.101 | Para modo LAN (recomendado) |
| Código de acesso | 12345678 | Código de 8 dígitos na tela da impressora |
| Nome | "Bambu #2 - P1S" | Exibido no painel |
| Modelo | P1P, P1S, X1C, A1 | Escolha o modelo correto para os ícones e funções certos |

4. Clique em **Testar conexão** — você deverá ver status verde
5. Clique em **Salvar**

:::tip Dê nomes descritivos às impressoras
"Bambu 1" e "Bambu 2" são confusos. Use nomes como "X1C - Produção" e "P1S - Protótipos" para manter a organização.
:::

## A visão geral da frota

Após adicionar todas as impressoras, elas são exibidas juntas no painel **Frota**. Aqui você vê:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Produção  │  │ P1S - Protótipos│  │ A1 - Hobby Room │
│ ████████░░ 82%  │  │ Ociosa          │  │ ████░░░░░░ 38%  │
│ 1h 24m restante │  │ Pronta para     │  │ 3h 12m restante │
│ Temp: 220/60°C  │  │ imprimir        │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Você pode:
- Clicar em uma impressora para ver os detalhes completos
- Ver todas as temperaturas, status do AMS e erros ativos de uma vez
- Filtrar por status (impressões ativas, ociosas, erros)

## Fila de impressão — distribuindo o trabalho

A fila de impressão permite planejar impressões para todas as impressoras de um só lugar.

**Como funciona:**
1. Vá em **Fila**
2. Clique em **+ Adicionar trabalho**
3. Escolha arquivo e configurações
4. Escolha a impressora ou selecione **Atribuição automática**

### Atribuição automática
Com atribuição automática, o painel escolhe a impressora com base em:
- Capacidade disponível
- Filamento disponível no AMS
- Janelas de manutenção agendadas

Ative em **Configurações → Fila → Atribuição automática**.

### Priorização
Arraste e solte trabalhos na fila para mudar a ordem. Um trabalho com **Alta prioridade** passa à frente dos trabalhos normais.

## Início escalonado — evitando picos de consumo

Se você inicia muitas impressoras ao mesmo tempo, a fase de aquecimento pode causar um pico de consumo. O início escalonado distribui a inicialização:

**Como ativar:**
1. Vá em **Configurações → Frota → Início escalonado**
2. Ative **Inicialização distribuída**
3. Defina o atraso entre impressoras (recomendado: 2–5 minutos)

**Exemplo com 3 impressoras e 3 minutos de atraso:**
```
08:00 — Impressora 1 inicia aquecimento
08:03 — Impressora 2 inicia aquecimento
08:06 — Impressora 3 inicia aquecimento
```

:::tip Relevante para o disjuntor
Uma X1C consome cerca de 1000W durante o aquecimento. Três impressoras ao mesmo tempo = 3000W, o que pode disparar o disjuntor de 16A. O início escalonado elimina o problema.
:::

## Grupos de impressoras

Grupos de impressoras permitem organizar logicamente as impressoras e enviar comandos para todo o grupo:

**Criando um grupo:**
1. Vá em **Configurações → Grupos de impressoras**
2. Clique em **+ Novo grupo**
3. Dê um nome ao grupo (ex.: "Chão de fábrica", "Sala de hobby")
4. Adicione impressoras ao grupo

**Funções de grupo:**
- Ver estatísticas consolidadas do grupo
- Enviar comando de pausa para todo o grupo de uma vez
- Definir janela de manutenção para o grupo

## Monitorando todas as impressoras

### Visualização de múltiplas câmeras
Vá em **Frota → Visualização de câmeras** para ver todos os feeds de câmera lado a lado:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [Ao vivo]   │  │  [Ociosa]    │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Adicionar │
│  [Ao vivo]   │  │              │
└──────────────┘  └──────────────┘
```

### Notificações por impressora
Você pode configurar regras de notificação diferentes para impressoras diferentes:
- Impressora de produção: notifique sempre, incluindo à noite
- Impressora de hobby: notifique apenas durante o dia

Veja [Notificações](./varsler-oppsett) para configuração.

## Dicas para gerenciamento de frota

- **Padronize os slots de filamento**: Mantenha PLA branco no slot 1, PLA preto no slot 2 em todas as impressoras — assim a distribuição de trabalhos fica mais simples
- **Verifique os níveis do AMS diariamente**: Veja [Uso diário](./daglig-bruk) para a rotina matinal
- **Manutenção rotativa**: Não faça manutenção em todas as impressoras ao mesmo tempo — mantenha sempre pelo menos uma ativa
- **Nomeie os arquivos claramente**: Nomes de arquivo como `logo_x1c_pla_0.2mm.3mf` facilitam a escolha da impressora certa
