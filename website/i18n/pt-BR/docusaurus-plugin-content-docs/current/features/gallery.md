---
sidebar_position: 8
title: Galeria
description: Veja capturas de tela de marcos tiradas automaticamente aos 25, 50, 75 e 100% de progresso para todas as impressões
---

# Galeria

A galeria reúne capturas de tela automáticas tiradas durante cada impressão. As imagens são capturadas em marcos fixos e fornecem um registro visual do desenvolvimento da impressão.

Acesse em: **https://localhost:3443/#gallery**

## Capturas de tela de marcos

O 3DPrintForge tira automaticamente uma captura de tela da câmera nos seguintes marcos:

| Marco | Momento |
|-------|---------|
| **25%** | Um quarto da impressão |
| **50%** | Metade |
| **75%** | Três quartos |
| **100%** | Impressão concluída |

As capturas de tela são vinculadas à entrada correspondente no histórico de impressões e exibidas na galeria.

:::info Requisitos
As capturas de tela de marcos requerem que a câmera esteja conectada e ativa. Câmeras desativadas não geram imagens.
:::

## Ativar a função de captura de tela

1. Vá em **Configurações → Galeria**
2. Ative **Capturas de tela automáticas de marcos**
3. Selecione quais marcos deseja ativar (todos os quatro estão ativos por padrão)
4. Selecione **Qualidade da imagem**: Baixa (640×360) / Média (1280×720) / Alta (1920×1080)
5. Clique em **Salvar**

## Visualização de imagens

A galeria está organizada por impressão:

1. Use o **filtro** no topo para selecionar impressora, data ou nome do arquivo
2. Clique em uma linha de impressão para expandir e ver todas as quatro imagens
3. Clique em uma imagem para abrir a pré-visualização

### Pré-visualização

A pré-visualização exibe:
- Imagem em tamanho completo
- Marco e carimbo de data/hora
- Nome da impressão e impressora
- **←** / **→** para navegar entre imagens da mesma impressão

## Visualização em tela cheia

Clique em **Tela cheia** (ou pressione `F`) na pré-visualização para preencher toda a tela. Use as teclas de seta para navegar entre imagens.

## Baixar imagens

- **Imagem única**: Clique em **Baixar** na pré-visualização
- **Todas as imagens de uma impressão**: Clique em **Baixar todas** na linha da impressão — você recebe um arquivo `.zip`
- **Selecionar várias**: Marque as caixas de seleção e clique em **Baixar selecionadas**

## Excluir imagens

:::warning Espaço de armazenamento
As imagens da galeria podem ocupar espaço significativo ao longo do tempo. Configure a exclusão automática de imagens antigas.
:::

### Exclusão manual

1. Selecione uma ou mais imagens (marque a caixa)
2. Clique em **Excluir selecionadas**
3. Confirme na caixa de diálogo

### Limpeza automática

1. Vá em **Configurações → Galeria → Limpeza automática**
2. Ative **Excluir imagens mais antigas que**
3. Defina o número de dias (ex.: 90 dias)
4. A limpeza é executada automaticamente toda noite às 03:00

## Vinculação ao histórico de impressões

Cada imagem está vinculada a uma entrada de impressão no histórico:

- Clique em **Ver no histórico** em uma impressão na galeria para ir à entrada do histórico
- No histórico, uma miniatura da imagem de 100% é exibida se disponível

## Compartilhamento

Compartilhe uma imagem da galeria via link com tempo limitado:

1. Abra a imagem na pré-visualização
2. Clique em **Compartilhar**
3. Selecione o tempo de expiração e copie o link
