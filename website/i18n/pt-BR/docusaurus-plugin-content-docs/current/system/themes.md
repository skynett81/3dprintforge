---
sidebar_position: 4
title: Tema
description: Personalize a aparência do Bambu Dashboard com modo claro/escuro/automático, 6 paletas de cores e cor de destaque personalizada
---

# Tema

O Bambu Dashboard tem um sistema de temas flexível que permite personalizar a aparência de acordo com seu gosto e situação de uso.

Acesse em: **https://localhost:3443/#settings** → **Tema**

## Modo de cor

Escolha entre três modos:

| Modo | Descrição |
|---|---|
| **Claro** | Fundo claro, texto escuro — bom em ambientes bem iluminados |
| **Escuro** | Fundo escuro, texto claro — padrão e recomendado para monitoramento |
| **Automático** | Segue a configuração do sistema operacional (modo escuro/claro do SO) |

Altere o modo no topo das configurações de tema ou pelo atalho na barra de navegação (ícone de lua/sol).

## Paletas de cores

Seis paletas de cores predefinidas estão disponíveis:

| Paleta | Cor primária | Estilo |
|---|---|---|
| **Bambu** | Verde (#00C853) | Padrão, inspirado no Bambu Lab |
| **Noite azul** | Azul (#2196F3) | Calmo e profissional |
| **Pôr do sol** | Laranja (#FF6D00) | Quente e energético |
| **Roxo** | Roxo (#9C27B0) | Criativo e distinto |
| **Vermelho** | Vermelho (#F44336) | Alto contraste, marcante |
| **Monocromático** | Cinza (#607D8B) | Neutro e minimalista |

Clique em uma paleta para visualizá-la e ativá-la imediatamente.

## Cor de destaque personalizada

Use sua própria cor como cor de destaque:

1. Clique em **Cor personalizada** abaixo do seletor de paleta
2. Use o seletor de cores ou digite um código hexadecimal (ex.: `#FF5722`)
3. A pré-visualização é atualizada em tempo real
4. Clique em **Aplicar** para ativar

:::tip Contraste
Certifique-se de que a cor de destaque tem bom contraste com o fundo. O sistema avisa se a cor pode causar problemas de legibilidade (padrão WCAG AA).
:::

## Arredondamento

Ajuste o arredondamento de botões, cartões e elementos:

| Configuração | Descrição |
|---|---|
| **Nítido** | Sem arredondamento (estilo retangular) |
| **Pequeno** | Arredondamento sutil (4 px) |
| **Médio** | Arredondamento padrão (8 px) |
| **Grande** | Arredondamento pronunciado (16 px) |
| **Pill** | Arredondamento máximo (50 px) |

Deslize o controle deslizante para ajustar manualmente entre 0–50 px.

## Compactação

Personalize a densidade na interface:

| Configuração | Descrição |
|---|---|
| **Espaçoso** | Mais espaço entre os elementos |
| **Padrão** | Equilibrado, configuração padrão |
| **Compacto** | Empacotamento mais denso — mais informações na tela |

O modo compacto é recomendado para telas abaixo de 1080p ou visualização em quiosque.

## Tipografia

Selecione o tipo de fonte:

- **Sistema** — usa a fonte padrão do sistema operacional (carregamento rápido)
- **Inter** — clara e moderna (seleção padrão)
- **JetBrains Mono** — monoespaçada, boa para valores de dados
- **Nunito** — estilo mais suave e arredondado

## Animações

Desative ou personalize as animações:

- **Completo** — todas as transições e animações ativas (padrão)
- **Reduzido** — apenas animações necessárias (respeita a preferência do SO)
- **Desligado** — sem animações para desempenho máximo

:::tip Modo quiosque
Para visualização em quiosque, ative **Compacto** + **Escuro** + **Animações reduzidas** para desempenho e legibilidade ideais à distância. Veja [Modo quiosque](./kiosk).
:::

## Exportar e importar configurações de tema

Compartilhe seu tema com outros:

1. Clique em **Exportar tema** — baixa um arquivo `.json`
2. Compartilhe o arquivo com outros usuários do Bambu Dashboard
3. Eles importam via **Importar tema** → selecione o arquivo
