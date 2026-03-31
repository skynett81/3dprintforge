---
sidebar_position: 8
title: Navegando no painel
description: Aprenda a navegar no 3DPrintForge — barra lateral, painéis, atalhos de teclado e personalização
---

# Navegando no painel

Este guia te dá uma introdução rápida a como o painel está organizado e como navegar de forma eficiente.

## A barra lateral

A barra lateral à esquerda é seu centro de navegação. Está organizada em seções:

```
┌────────────────────┐
│ 🖨  Status das imp. │  ← Uma linha por impressora
├────────────────────┤
│ Visão geral        │
│ Frota              │
│ Impressão ativa    │
├────────────────────┤
│ Filamento          │
│ Histórico          │
│ Projetos           │
│ Fila               │
│ Agendador          │
├────────────────────┤
│ Monitoramento      │
│  └ Print Guard     │
│  └ Erros           │
│  └ Diagnósticos    │
│  └ Manutenção      │
├────────────────────┤
│ Análise            │
│ Ferramentas        │
│ Integrações        │
│ Sistema            │
├────────────────────┤
│ ⚙ Configurações   │
└────────────────────┘
```

**A barra lateral pode ser ocultada** clicando no ícone de hambúrguer (☰) no canto superior esquerdo. Útil em telas menores ou no modo quiosque.

## O painel principal

Quando você clica em um elemento na barra lateral, o conteúdo é exibido no painel principal à direita. O layout varia:

| Painel | Layout |
|--------|--------|
| Visão geral | Grade de cartões com todas as impressoras |
| Impressão ativa | Cartão de detalhes grande + curvas de temperatura |
| Histórico | Tabela com filtros |
| Filamento | Visualização em cartões com carretéis |
| Análise | Gráficos e diagramas |

## Clicar no status da impressora para detalhes

O cartão da impressora no painel de visão geral é clicável:

**Clique simples** → Abre o painel de detalhes para aquela impressora:
- Temperaturas em tempo real
- Impressão ativa (se em andamento)
- Status do AMS com todos os slots
- Últimos erros e eventos
- Botões rápidos: Pausar, Parar, Luz liga/desliga

**Clique no ícone de câmera** → Abre a visualização da câmera ao vivo

**Clique no ícone ⚙** → Configurações da impressora

## Atalho de teclado — paleta de comandos

A paleta de comandos oferece acesso rápido a todas as funções sem precisar navegar:

| Atalho | Ação |
|--------|------|
| `Ctrl + K` (Linux/Windows) | Abrir paleta de comandos |
| `Cmd + K` (macOS) | Abrir paleta de comandos |
| `Esc` | Fechar paleta |

Na paleta de comandos você pode:
- Pesquisar páginas e funções
- Iniciar uma impressão diretamente
- Pausar / retomar impressões ativas
- Trocar o tema (claro/escuro)
- Navegar para qualquer página

**Exemplo:** Pressione `Ctrl+K`, digite "pausar" → selecione "Pausar todas as impressões ativas"

## Personalização de widgets

O painel de visão geral pode ser personalizado com os widgets que você escolher:

**Como editar o painel:**
1. Clique em **Editar layout** (ícone de lápis) no canto superior direito do painel de visão geral
2. Arraste widgets para a posição desejada
3. Clique e arraste no canto de um widget para redimensionar
4. Clique em **+ Adicionar widget** para adicionar novos:

Widgets disponíveis:

| Widget | Exibe |
|--------|-------|
| Status das impressoras | Cartões de todas as impressoras |
| Impressão ativa (grande) | Visualização detalhada da impressão em andamento |
| Visão geral do AMS | Todos os slots e níveis de filamento |
| Curva de temperatura | Gráfico em tempo real |
| Tarifa elétrica | Gráfico de preços das próximas 24 horas |
| Medidor de filamento | Consumo total dos últimos 30 dias |
| Atalho do histórico | Últimas 5 impressões |
| Feed da câmera | Imagem da câmera ao vivo |

5. Clique em **Salvar layout**

:::tip Salve múltiplos layouts
Você pode ter diferentes layouts para diferentes finalidades — um compacto para uso diário, um grande para pendurar em uma tela grande. Alterne entre eles com o seletor de layouts.
:::

## Tema — alternar entre claro e escuro

**Troca rápida:**
- Clique no ícone sol/lua no canto superior direito da navegação
- Ou: `Ctrl+K` → digite "tema"

**Configuração permanente:**
1. Vá em **Sistema → Temas**
2. Escolha entre:
   - **Claro** — fundo branco
   - **Escuro** — fundo escuro (recomendado à noite)
   - **Automático** — segue a configuração do sistema do seu dispositivo
3. Escolha a cor de destaque (azul, verde, roxo, etc.)
4. Clique em **Salvar**

## Navegação pelo teclado

Para navegação eficiente sem mouse:

| Atalho | Ação |
|--------|------|
| `Tab` | Próximo elemento interativo |
| `Shift+Tab` | Elemento anterior |
| `Enter` / `Espaço` | Ativar botão/link |
| `Esc` | Fechar modal/dropdown |
| `Ctrl+K` | Paleta de comandos |
| `Alt+1` – `Alt+9` | Navegar diretamente para as 9 primeiras páginas |

## PWA — instalar como aplicativo

O 3DPrintForge pode ser instalado como um progressive web app (PWA) e executado como um aplicativo independente sem menus do navegador:

1. Vá ao painel no Chrome, Edge ou Safari
2. Clique no ícone **Instalar aplicativo** na barra de endereços
3. Confirme a instalação

Veja a [Documentação PWA](../system/pwa) para mais detalhes.

## Modo quiosque

O modo quiosque oculta toda a navegação e exibe apenas o painel — perfeito para uma tela dedicada no estúdio de impressão:

1. Vá em **Sistema → Quiosque**
2. Ative o **Modo quiosque**
3. Escolha quais widgets serão exibidos
4. Defina o intervalo de atualização

Veja a [Documentação do quiosque](../system/kiosk) para configuração completa.
